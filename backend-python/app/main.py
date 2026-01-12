from . import database, schemas, models
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

def get_db():
  db = database.SessionLocal()
  try: 
    yield db
  finally:
    db.close()


@app.get("/products/", response_model=list[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
  products = db.query(models.Product).all()
  return products

@app.post("/product/", response_model=schemas.ProductResponse)
def create_product(data: schemas.ProductSchema, db:Session=Depends(get_db)):
  product_data = data.model_dump()
  product = models.Product(**product_data)
  db.add(product)
  db.commit()
  db.refresh(product)
  return product

@app.put("/product/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, data: schemas.ProductUpdate, db:Session=Depends(get_db)):
  product = db.query(models.Product).filter(models.Product.id == id).first()
  
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  
  update_data = data.model_dump(exclude_unset=True)
  
  for key, value in update_data.items():
    setattr(product, key, value)

  db.commit()
  db.refresh(product)
  return product

@app.delete("/product/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
  product = db.query(models.Product).filter(models.Product.id == id).first()
  
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  
  db.delete(product)
  db.commit()
  return {"message": f"Product by id '{id}' successfully deleted from db"}

@app.put("/product/{id}/stock-decrease",  response_model=schemas.ProductResponse)
def decrease_stock(id: int, data: schemas.ProductDecreaseStock, db:Session= Depends(get_db)):
  product = db.query(models.Product).filter(models.Product.id == id).first()
  
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  
  if product.current_stock < data.discount:
    raise HTTPException(status_code=400, detail=f"Not enough stock available. Only {product.current_stock} units left.")

  product.current_stock -= data.discount
  
  new_movement = models.StockMovement(
    product_id=id,
    type="OUT",
    quantity=data.discount,
    reason="Sale registered from Nodejs"
  )
    
  db.add(new_movement)
  db.commit()
  db.refresh(product)
  return product

@app.put("/product/{id}/stock-increase",  response_model=schemas.ProductResponse)
def increase_stock(id: int, data: schemas.ProductIncreaseStock, db:Session= Depends(get_db)):
  product = db.query(models.Product).filter(models.Product.id == id).first()
  
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  
  product.current_stock += data.increase
  
  new_movement = models.StockMovement(
    product_id=id,
    type="IN",
    quantity=data.increase,
    reason="Stock replenished"
  )
    
  db.add(new_movement)
  db.commit()
  db.refresh(product)
  return product

@app.get("/product/{id}/movements/", response_model=list[schemas.MovementResponse])
def get_product_movements(id: int, db: Session = Depends(get_db)):
  product = db.query(models.Product).filter(models.Product.id == id).first()
  
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  
  movements = db.query(models.StockMovement).filter(models.StockMovement.product_id == id).all()
  return movements
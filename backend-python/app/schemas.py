from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductSchema(BaseModel):
  name: str
  cost_price: float
  current_stock: int
  
class ProductCreate(BaseModel):
  pass
  
class ProductUpdate(BaseModel):
  name: Optional[str] = None
  cost_price: Optional[float] = None
  current_stock: Optional[int] = None
  
class ProductDecreaseStock(BaseModel):
  discount: int
  
class ProductIncreaseStock(BaseModel):
  increase: int
  
class ProductResponse(ProductSchema):
  id: int
  
  class Config: 
    orm_mode = True
    
# Stock movement

class MovementResponse(BaseModel):
    id: int
    type: str
    quantity: int
    reason: str
    created_at: datetime

    class Config:
        from_attributes = True
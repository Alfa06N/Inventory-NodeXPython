from .database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

class Product(Base):
  __tablename__ = "products"
  id = Column(Integer, primary_key=True, autoincrement=True)
  name = Column(String(200), nullable=False)
  cost_price = Column(Float)
  current_stock = Column(Integer)
  
class StockMovement(Base):
    __tablename__ = "stock_movements"
    
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id")) 
    type = Column(String(200)) 
    quantity = Column(Integer)
    reason = Column(String(200)) 
    created_at = Column(DateTime, server_default=func.now()) 
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class SavedBasket(Base):
    __tablename__ = "saved_baskets"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=True, default="My Basket")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="saved_baskets")
    items = relationship("BasketItem", back_populates="basket", cascade="all, delete-orphan")

class BasketItem(Base):
    __tablename__ = "basket_items"
    
    id = Column(Integer, primary_key=True)
    basket_id = Column(Integer, ForeignKey("saved_baskets.id"), nullable=False)
    product_id = Column(String(100), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    basket = relationship("SavedBasket", back_populates="items")
    product = relationship("Product", back_populates="basket_items")

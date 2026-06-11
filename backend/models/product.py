from sqlalchemy import Column, String, Float, DateTime, Text, Boolean, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Supermarket(Base):
    __tablename__ = "supermarkets"
    
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product_prices = relationship("ProductPrice", back_populates="supermarket", cascade="all, delete-orphan")
    promotions = relationship("Promotion", back_populates="supermarket", cascade="all, delete-orphan")

class Suburb(Base):
    __tablename__ = "suburbs"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(100), primary_key=True)
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False)  # dairy, fruit, vegetables, pantry, snacks, drinks
    image = Column(String(10), nullable=False)  # emoji
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product_prices = relationship("ProductPrice", back_populates="product", cascade="all, delete-orphan")
    promotions = relationship("Promotion", back_populates="product", cascade="all, delete-orphan")
    basket_items = relationship("BasketItem", back_populates="product", cascade="all, delete-orphan")

class ProductPrice(Base):
    __tablename__ = "product_prices"
    
    id = Column(Integer, primary_key=True)
    product_id = Column(String(100), ForeignKey("products.id"), nullable=False)
    supermarket_id = Column(String(50), ForeignKey("supermarkets.id"), nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product = relationship("Product", back_populates="product_prices")
    supermarket = relationship("Supermarket", back_populates="product_prices")

class Promotion(Base):
    __tablename__ = "promotions"
    
    id = Column(Integer, primary_key=True)
    product_id = Column(String(100), ForeignKey("products.id"), nullable=False)
    supermarket_id = Column(String(50), ForeignKey("supermarkets.id"), nullable=False)
    original_price = Column(Float, nullable=False)
    discounted_price = Column(Float, nullable=False)
    discount_percent = Column(Integer, nullable=False)
    promotion_label = Column(String(100), nullable=False)
    is_half_price = Column(Boolean, default=False)
    saving_amount = Column(Float, nullable=False)
    ends_in = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product = relationship("Product", back_populates="promotions")
    supermarket = relationship("Supermarket", back_populates="promotions")

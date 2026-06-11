from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(100), primary_key=True)  # Supabase user ID
    email = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    saved_baskets = relationship("SavedBasket", back_populates="user", cascade="all, delete-orphan")

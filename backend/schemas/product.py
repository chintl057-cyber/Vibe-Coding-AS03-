from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class ProductPriceSchema(BaseModel):
    supermarket: str
    price: float
    
    class Config:
        from_attributes = True

class PromotionSchema(BaseModel):
    store: str
    original_price: float
    discounted_price: float
    discount_percent: int
    promotion_label: str
    is_half_price: bool
    saving_amount: float
    ends_in: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProductSchema(BaseModel):
    id: str
    name: str
    category: str
    image: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProductResponseSchema(ProductSchema):
    prices: Dict[str, float]
    promotion: Optional[PromotionSchema] = None
    updated_at: datetime
    
    class Config:
        from_attributes = True

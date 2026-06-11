from pydantic import BaseModel
from typing import List, Optional, Dict

class BasketItemSchema(BaseModel):
    product_id: str
    quantity: int
    
    class Config:
        from_attributes = True

class BasketRequestSchema(BaseModel):
    items: List[BasketItemSchema]

class BasketStoreTotal(BaseModel):
    store: str
    total: float

class ItemSavingsInsight(BaseModel):
    product_id: str
    product_name: str
    category: str
    recommended_store: str
    alternative_store: str
    savings_per_unit: float
    quantity: int
    total_savings: float

class CategorySavingsInsight(BaseModel):
    category: str
    total_savings: float

class SplitBasketAllocation(BaseModel):
    product_id: str
    product_name: str
    category: str
    store: str
    unit_price: float
    quantity: int
    line_total: float

class SplitBasketResult(BaseModel):
    total_cost: float
    allocations: List[SplitBasketAllocation]
    stores_used: List[str]
    extra_savings_vs_single_store: float

class BasketAnalysisResponseSchema(BaseModel):
    cheapest_store_total: BasketStoreTotal
    second_cheapest_store_total: BasketStoreTotal
    single_store_savings_vs_second: float
    split_basket: SplitBasketResult
    split_basket_extra_savings: float
    top_saving_items: List[ItemSavingsInsight]
    category_savings: List[CategorySavingsInsight]
    recommendation_confidence: str
    confidence_reason: str

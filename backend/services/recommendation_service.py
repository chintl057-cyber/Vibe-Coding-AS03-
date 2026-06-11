from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from models import Product, ProductPrice, Supermarket
from schemas.basket import BasketAnalysisResponseSchema, BasketRequestSchema
from utils.calculations import (
    get_basket_totals_by_store,
    get_cheapest_basket_option,
    get_split_basket_optimisation,
    get_top_saving_items,
    get_category_savings_breakdown,
    format_currency,
)

class RecommendationService:
    @staticmethod
    def analyze_basket(
        db: Session,
        basket_request: BasketRequestSchema,
    ) -> BasketAnalysisResponseSchema:
        # Build product map from database
        products_map = RecommendationService._build_products_map(db, basket_request)
        
        # Convert basket items to dict format
        basket_items = [item.dict() for item in basket_request.items]
        
        # Calculate store totals
        store_totals = get_basket_totals_by_store(products_map, basket_items)
        
        if not store_totals:
            raise ValueError("No products found in basket")
        
        # Get cheapest and second cheapest stores
        cheapest_store, second_cheapest_store = get_cheapest_basket_option(store_totals)
        
        # Calculate split basket optimization
        split_basket = get_split_basket_optimisation(products_map, basket_items, cheapest_store)
        
        # Calculate top saving items
        top_saving_items = get_top_saving_items(products_map, basket_items)
        
        # Get category savings
        category_savings = get_category_savings_breakdown(top_saving_items)
        
        # Calculate metrics
        single_store_savings_vs_second = format_currency(
            second_cheapest_store.total - cheapest_store.total
        )
        split_basket_extra_savings = split_basket.extra_savings_vs_single_store
        
        # Determine confidence
        confidence = "high" if len(split_basket.stores_used) >= 2 else "medium"
        reason = (
            "Split basket approach provides significant savings across multiple stores."
            if confidence == "high"
            else "Single store recommendation - similar pricing across stores."
        )
        
        return BasketAnalysisResponseSchema(
            cheapest_store_total=cheapest_store,
            second_cheapest_store_total=second_cheapest_store,
            single_store_savings_vs_second=single_store_savings_vs_second,
            split_basket=split_basket,
            split_basket_extra_savings=split_basket_extra_savings,
            top_saving_items=top_saving_items,
            category_savings=category_savings,
            recommendation_confidence=confidence,
            confidence_reason=reason,
        )
    
    @staticmethod
    def _build_products_map(db: Session, basket_request: BasketRequestSchema) -> Dict[str, Dict]:
        products_map = {}
        product_ids = [item.product_id for item in basket_request.items]
        
        for product_id in product_ids:
            product = db.query(Product).filter(Product.id == product_id).first()
            if not product:
                continue
            
            # Get prices for all supermarkets
            prices_data = db.query(ProductPrice, Supermarket.name).join(
                Supermarket, ProductPrice.supermarket_id == Supermarket.id
            ).filter(ProductPrice.product_id == product.id).all()
            
            prices = {}
            for pp, name in prices_data:
                prices[name] = pp.ProductPrice.price
            
            products_map[product.id] = {
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "image": product.image,
                "prices": prices,
            }
        
        return products_map

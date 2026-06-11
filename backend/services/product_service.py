from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Product, ProductPrice, Promotion, Supermarket
from schemas.product import ProductResponseSchema, PromotionSchema
from typing import List, Dict, Optional

class ProductService:
    @staticmethod
    def get_all_products(db: Session, skip: int = 0, limit: int = 100) -> List[ProductResponseSchema]:
        products = db.query(Product).offset(skip).limit(limit).all()
        return [ProductService._format_product(db, p) for p in products]
    
    @staticmethod
    def get_product_by_id(db: Session, product_id: str) -> Optional[ProductResponseSchema]:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            return ProductService._format_product(db, product)
        return None
    
    @staticmethod
    def search_products(
        db: Session,
        query: str = "",
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ProductResponseSchema]:
        q = db.query(Product)
        
        if query:
            q = q.filter(or_(
                Product.name.ilike(f"%{query}%"),
                Product.description.ilike(f"%{query}%"),
            ))
        
        if category:
            q = q.filter(Product.category == category)
        
        products = q.offset(skip).limit(limit).all()
        return [ProductService._format_product(db, p) for p in products]
    
    @staticmethod
    def get_products_by_category(db: Session, category: str) -> List[ProductResponseSchema]:
        products = db.query(Product).filter(Product.category == category).all()
        return [ProductService._format_product(db, p) for p in products]
    
    @staticmethod
    def _format_product(db: Session, product: Product) -> ProductResponseSchema:
        # Get prices from product_prices table
        prices_data = db.query(ProductPrice, Supermarket.name).join(
            Supermarket, ProductPrice.supermarket_id == Supermarket.id
        ).filter(ProductPrice.product_id == product.id).all()
        
        prices = {name: pp.ProductPrice.price for pp, name in prices_data}
        
        # Get promotion if exists
        promotion_data = db.query(Promotion).filter(
            Promotion.product_id == product.id
        ).first()
        
        promotion = None
        if promotion_data:
            sm = db.query(Supermarket).filter(
                Supermarket.id == promotion_data.supermarket_id
            ).first()
            promotion = PromotionSchema(
                store=sm.name if sm else "",
                original_price=promotion_data.original_price,
                discounted_price=promotion_data.discounted_price,
                discount_percent=promotion_data.discount_percent,
                promotion_label=promotion_data.promotion_label,
                is_half_price=promotion_data.is_half_price,
                saving_amount=promotion_data.saving_amount,
                ends_in=promotion_data.ends_in,
            )
        
        return ProductResponseSchema(
            id=product.id,
            name=product.name,
            category=product.category,
            image=product.image,
            description=product.description,
            prices=prices,
            promotion=promotion,
            updated_at=product.updated_at,
        )

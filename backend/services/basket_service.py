from sqlalchemy.orm import Session
from models import SavedBasket, BasketItem
from schemas.basket import BasketRequestSchema, BasketItemSchema
from typing import Optional

class BasketService:
    @staticmethod
    def create_basket(
        db: Session,
        user_id: str,
        basket_request: BasketRequestSchema,
        name: str = "My Basket",
    ) -> SavedBasket:
        basket = SavedBasket(user_id=user_id, name=name)
        db.add(basket)
        db.flush()
        
        for item in basket_request.items:
            basket_item = BasketItem(
                basket_id=basket.id,
                product_id=item.product_id,
                quantity=item.quantity,
            )
            db.add(basket_item)
        
        db.commit()
        db.refresh(basket)
        return basket
    
    @staticmethod
    def get_user_basket(db: Session, user_id: str) -> Optional[SavedBasket]:
        return db.query(SavedBasket).filter(SavedBasket.user_id == user_id).first()
    
    @staticmethod
    def update_basket(
        db: Session,
        basket_id: int,
        basket_request: BasketRequestSchema,
    ) -> SavedBasket:
        basket = db.query(SavedBasket).filter(SavedBasket.id == basket_id).first()
        
        if not basket:
            raise ValueError("Basket not found")
        
        # Delete old items
        db.query(BasketItem).filter(BasketItem.basket_id == basket_id).delete()
        
        # Add new items
        for item in basket_request.items:
            basket_item = BasketItem(
                basket_id=basket.id,
                product_id=item.product_id,
                quantity=item.quantity,
            )
            db.add(basket_item)
        
        db.commit()
        db.refresh(basket)
        return basket
    
    @staticmethod
    def delete_basket(db: Session, basket_id: int) -> bool:
        basket = db.query(SavedBasket).filter(SavedBasket.id == basket_id).first()
        if basket:
            db.delete(basket)
            db.commit()
            return True
        return False

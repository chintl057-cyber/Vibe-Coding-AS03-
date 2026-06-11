from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import BasketItem, SavedBasket, User
from services.product_service import ProductService

router = APIRouter(prefix="/api/debug", tags=["debug"])


def _serialize_basket_item(item: BasketItem) -> dict:
    product = item.product
    return {
        "id": item.id,
        "product_id": item.product_id,
        "quantity": item.quantity,
        "product": {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "image": product.image,
        } if product else None,
    }


def _serialize_basket(basket: SavedBasket, include_user: bool = True) -> dict:
    data = {
        "id": basket.id,
        "name": basket.name,
        "user_id": basket.user_id,
        "created_at": basket.created_at,
        "updated_at": basket.updated_at,
        "items": [_serialize_basket_item(item) for item in basket.items],
    }

    if include_user:
        data["user"] = {
            "id": basket.user.id,
            "email": basket.user.email,
            "name": basket.user.name,
        } if basket.user else None

    return data


def _serialize_user(user: User, include_baskets: bool = True) -> dict:
    data = {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }

    if include_baskets:
        data["baskets"] = [
            _serialize_basket(basket, include_user=False)
            for basket in user.saved_baskets
        ]

    return data


@router.get("/products")
def debug_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return ProductService.get_all_products(db, skip=skip, limit=limit)


@router.get("/users")
def debug_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [_serialize_user(user) for user in users]


@router.get("/users/{user_id}/baskets")
def debug_user_baskets(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return [_serialize_basket(basket, include_user=False) for basket in user.saved_baskets]


@router.get("/baskets")
def debug_baskets(db: Session = Depends(get_db)):
    baskets = db.query(SavedBasket).order_by(SavedBasket.created_at.desc()).all()
    return [_serialize_basket(basket) for basket in baskets]


@router.get("/baskets/{basket_id}")
def debug_basket(basket_id: int, db: Session = Depends(get_db)):
    basket = db.query(SavedBasket).filter(SavedBasket.id == basket_id).first()
    if not basket:
        raise HTTPException(status_code=404, detail="Basket not found")

    return _serialize_basket(basket)

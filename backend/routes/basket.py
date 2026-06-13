from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies.auth import get_current_user
from services.basket_service import BasketService
from services.recommendation_service import RecommendationService
from schemas.basket import BasketRequestSchema, BasketAnalysisResponseSchema
import logging

router = APIRouter(prefix="/api/basket", tags=["basket"])
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=BasketAnalysisResponseSchema)
def analyze_basket(
    basket_request: BasketRequestSchema,
    db: Session = Depends(get_db),
):
    try:
        return RecommendationService.analyze_basket(db, basket_request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Failed to analyze basket")
        raise HTTPException(
            status_code=500,
            detail="We could not analyze your basket. Please try again later.",
        )

@router.get("/")
def get_user_basket(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user["user_id"]
    basket = BasketService.get_user_basket(db, user_id)
    if not basket:
        raise HTTPException(
            status_code=404,
            detail="You do not have a saved basket yet.",
        )
    
    items = [{"product_id": item.product_id, "quantity": item.quantity} for item in basket.items]
    return {"basket_id": basket.id, "items": items, "name": basket.name}

@router.post("/")
def save_user_basket(
    basket_request: BasketRequestSchema,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user["user_id"]
    
    # Check if basket exists
    existing_basket = BasketService.get_user_basket(db, user_id)
    
    if existing_basket:
        basket = BasketService.update_basket(db, existing_basket.id, basket_request)
    else:
        basket = BasketService.create_basket(db, user_id, basket_request)
    
    items = [{"product_id": item.product_id, "quantity": item.quantity} for item in basket.items]
    return {"basket_id": basket.id, "items": items, "name": basket.name}

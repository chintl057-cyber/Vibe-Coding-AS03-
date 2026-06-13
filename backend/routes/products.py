from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from services.product_service import ProductService
from schemas.product import ProductResponseSchema
from typing import List
import logging

router = APIRouter(prefix="/api/products", tags=["products"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[ProductResponseSchema])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    try:
        return ProductService.get_all_products(db, skip=skip, limit=limit)
    except Exception as e:
        print(f"❌ Products error: {str(e)}")
        import traceback
        traceback.print_exc()
        logger.exception("Failed to load products")
        raise HTTPException(
            status_code=500,
            detail="We could not load products. Please try again later.",
        )

@router.get("/search", response_model=List[ProductResponseSchema])
def search_products(
    q: str = Query(""),
    category: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    try:
        return ProductService.search_products(db, query=q, category=category, skip=skip, limit=limit)
    except Exception as e:
        print(f"❌ Search error: {str(e)}")
        import traceback
        traceback.print_exc()
        logger.exception("Failed to search products")
        raise HTTPException(
            status_code=500,
            detail="We could not search products. Please try again later.",
        )

@router.get("/{product_id}", response_model=ProductResponseSchema)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = ProductService.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="We could not find that product.")
    return product

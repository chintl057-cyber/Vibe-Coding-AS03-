from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from services.product_service import ProductService
from schemas.product import ProductResponseSchema
from typing import List

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=List[ProductResponseSchema])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return ProductService.get_all_products(db, skip=skip, limit=limit)

@router.get("/search", response_model=List[ProductResponseSchema])
def search_products(
    q: str = Query(""),
    category: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return ProductService.search_products(db, query=q, category=category, skip=skip, limit=limit)

@router.get("/{product_id}", response_model=ProductResponseSchema)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = ProductService.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

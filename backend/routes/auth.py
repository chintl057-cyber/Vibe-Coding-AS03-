from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config import settings
from database import get_db
from security import create_access_token
from dependencies.auth import get_current_user
from models import User
import requests
from typing import Optional, Any
import logging

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    email: str
    new_password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    email: str

# Functions:

def _extract_supabase_user(data: dict[str, Any]) -> dict[str, Any]:
    user = data.get("user") or data
    if not isinstance(user, dict):
        return {}
    return user


def _extract_supabase_user_id(data: dict[str, Any]) -> Optional[str]:
    user = _extract_supabase_user(data)
    return user.get("id") or data.get("user_id") or data.get("id")


def _upsert_user(db: Session, user_id: str, email: str, name: Optional[str] = None) -> User:
    user = db.query(User).filter(User.id == user_id).first()

    if user:
        user.email = email
        if name:
            user.name = name
    else:
        user = User(id=user_id, email=email, name=name)
        db.add(user)

    db.commit()
    db.refresh(user)
    return user

# API Endpoints:

@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    logger.info("Register request received for %s", request.email)
    try:
        # Validate settings
        if not settings.supabase_url or not settings.supabase_key:
            raise ValueError("Supabase credentials not configured in .env")

        # Call Supabase Auth API
        url = f"{settings.supabase_url}/auth/v1/signup"
        response = requests.post(
            url,
            json={
                "email": request.email,
                "password": request.password,
                "data": {"name": request.name} if request.name else {},
            },
            headers={
                "apikey": settings.supabase_key,
                "Content-Type": "application/json",
            },
        )

        logger.info("Supabase register status: %s", response.status_code)

        if response.status_code not in (200, 201):
            try:
                error_detail = response.json()
            except Exception:
                error_detail = response.text
            raise HTTPException(status_code=400, detail=f"Supabase error: {error_detail}")

        data = response.json()
        user = _extract_supabase_user(data)
        user_id = _extract_supabase_user_id(data)

        if not user_id:
            raise HTTPException(status_code=500, detail="Supabase did not return user id")

        email = user.get("email") or request.email
        _upsert_user(db, user_id=user_id, email=email, name=request.name)

        # Create JWT token
        token = create_access_token({"sub": user_id, "email": email})

        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user_id=user_id,
            email=email,
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e) if str(e) else type(e).__name__
        logger.exception("Registration error: %s", error_msg)
        raise HTTPException(status_code=500, detail=f"Registration failed: {error_msg}")


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        # Validate settings
        if not settings.supabase_url or not settings.supabase_key:
            raise ValueError("Supabase credentials not configured in .env")

        # Call Supabase Auth API
        url = f"{settings.supabase_url}/auth/v1/token?grant_type=password"
        response = requests.post(
            url,
            json={"email": request.email, "password": request.password},
            headers={"apikey": settings.supabase_key},
        )

        logger.info("Supabase login status: %s", response.status_code)

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        data = response.json()
        user = _extract_supabase_user(data)
        user_id = _extract_supabase_user_id(data)

        if not user_id:
            raise HTTPException(status_code=500, detail="Supabase did not return user id")

        email = user.get("email") or request.email
        name = user.get("user_metadata", {}).get("name") if isinstance(user.get("user_metadata"), dict) else None
        _upsert_user(db, user_id=user_id, email=email, name=name)

        # Create JWT token
        token = create_access_token({"sub": user_id, "email": email})

        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user_id=user_id,
            email=email,
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e) if str(e) else type(e).__name__
        logger.exception("Login error: %s", error_msg)
        raise HTTPException(status_code=500, detail=f"Login failed: {error_msg}")


@router.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user.get("user_id"),
        "email": current_user.get("payload", {}).get("email"),
    }


@router.post("/change-password")
def change_password(request: ChangePasswordRequest):
    try:
        # Validate settings
        if not settings.supabase_url or not settings.supabase_key:
            raise ValueError("Supabase credentials not configured in .env")

        # Call Supabase Auth API to update password
        url = f"{settings.supabase_url}/auth/v1/user"
        response = requests.put(
            url,
            json={"password": request.new_password},
            headers={
                "apikey": settings.supabase_key,
                "Authorization": f"Bearer {request.email}",
            },
        )

        logger.info("Supabase change password status: %s", response.status_code)

        if response.status_code not in [200, 204]:
            raise HTTPException(status_code=400, detail="Failed to change password")

        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e) if str(e) else type(e).__name__
        logger.exception("Change password error: %s", error_msg)
        raise HTTPException(status_code=500, detail=f"Change password failed: {error_msg}")

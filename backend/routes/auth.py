from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from config import settings
from security import create_access_token
from dependencies.auth import get_current_user
import requests
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])

import sys
print("✅ AUTH ROUTES LOADED", file=sys.stderr)
print("✅ AUTH ROUTES LOADED")

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

@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest):
    print("🔵 REGISTER REQUEST RECEIVED")
    print(f"   Email: {request.email}")
    try:
        # Validate settings
        if not settings.supabase_url or not settings.supabase_key:
            raise ValueError("Supabase credentials not configured in .env")
        
        # Call Supabase Auth API
        url = f"{settings.supabase_url}/auth/v1/signup"
        response = requests.post(
            url,
            json={"email": request.email, "password": request.password},
            headers={
                "apikey": settings.supabase_key,
                "Content-Type": "application/json",
            },
        )

        print(f"Supabase Register - STATUS: {response.status_code}")
        print(f"Supabase Register - BODY: {response.text}")
        
        if response.status_code != 200:
            try:
                error_detail = response.json()
            except:
                error_detail = response.text
            raise HTTPException(status_code=400, detail=f"Supabase error: {error_detail}")
        
        data = response.json()
        user_id = data.get("user", {}).get("id")

        if not user_id:
            raise HTTPException(status_code=500, detail="Supabase did not return user id")
        
        # Create JWT token
        token = create_access_token({"sub": user_id, "email": request.email})
        
        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user_id=user_id,
            email=request.email,
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e) if str(e) else type(e).__name__
        print(f"Registration error: {error_msg}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {error_msg}")

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
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
        
        print(f"Supabase Login - STATUS: {response.status_code}")
        print(f"Supabase Login - BODY: {response.text}")
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        data = response.json()
        user_id = data.get("user", {}).get("id")

        if not user_id:
            raise HTTPException(status_code=500, detail="Supabase did not return user id")

        # Create JWT token
        token = create_access_token({"sub": user_id, "email": request.email})
        
        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user_id=user_id,
            email=request.email,
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e) if str(e) else type(e).__name__
        print(f"Login error: {error_msg}")
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
        
        print(f"Supabase Change Password - STATUS: {response.status_code}")
        
        if response.status_code not in [200, 204]:
            raise HTTPException(status_code=400, detail="Failed to change password")
        
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e) if str(e) else type(e).__name__
        print(f"Change password error: {error_msg}")
        raise HTTPException(status_code=500, detail=f"Change password failed: {error_msg}")

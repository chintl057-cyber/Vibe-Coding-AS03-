from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.authentication import AuthCredentials
from security import verify_token
from typing import Optional

security = HTTPBearer()

async def get_current_user(credentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"user_id": user_id, "payload": payload}

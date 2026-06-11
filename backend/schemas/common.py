from pydantic import BaseModel
from typing import Optional

class ErrorResponse(BaseModel):
    detail: str
    status_code: int

class PaginationParams(BaseModel):
    skip: int = 0
    limit: int = 100

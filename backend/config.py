from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    database_url: str
    jwt_secret: str
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    environment: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

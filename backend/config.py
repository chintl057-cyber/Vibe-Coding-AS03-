from pydantic_settings import BaseSettings
from typing import List
from pydantic import field_validator

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    database_url: str
    jwt_secret: str
    cors_origins: List[str] = ["https://basketly-only.vercel.app"]
    environment: str = "development"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

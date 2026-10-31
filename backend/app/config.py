import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "ProposalCraft"
    PROJECT_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    # Render provides postgres:// which SQLAlchemy 2.0 requires as postgresql://
    raw_database_url: str = os.getenv("DATABASE_URL", "sqlite:///./proposalcraft.db")
    
    @property
    def DATABASE_URL(self) -> str:
        url = self.raw_database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    # Storage paths
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./storage/uploads")
    PDF_OUTPUT_DIR: str = os.getenv("PDF_OUTPUT_DIR", "./storage/generated_pdfs")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://proposalcraft.vercel.app",
        "*"
    ]
    
    # Secret Key
    SECRET_KEY: str = os.getenv("SECRET_KEY", "proposalcraft-super-secret-key-change-in-prod")

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()

# Ensure directories exist
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.PDF_OUTPUT_DIR, exist_ok=True)

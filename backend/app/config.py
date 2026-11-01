import os
from pydantic_settings import BaseSettings
from typing import List


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


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

    # Storage paths (resolved absolutely so cwd does not affect them)
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", os.path.join(BASE_DIR, "storage"))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(BASE_DIR, "storage", "uploads"))
    PDF_OUTPUT_DIR: str = os.getenv("PDF_OUTPUT_DIR", os.path.join(BASE_DIR, "storage", "generated_pdfs"))
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
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

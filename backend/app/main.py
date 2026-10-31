import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.api import (
    health_router,
    templates_router,
    proposals_router,
    pdf_router,
    uploads_router,
)

# Auto-create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Production-grade API for ProposalCraft Dynamic Proposal Generation System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev & Vercel deployment preview domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(templates_router)
app.include_router(proposals_router)
app.include_router(pdf_router)
app.include_router(uploads_router)


@app.get("/")
def root():
    return {
        "service": "ProposalCraft Backend API",
        "version": settings.PROJECT_VERSION,
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

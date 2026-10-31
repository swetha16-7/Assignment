from app.api.health import router as health_router
from app.api.templates import router as templates_router
from app.api.proposals import router as proposals_router
from app.api.pdf import router as pdf_router
from app.api.uploads import router as uploads_router

__all__ = [
    "health_router",
    "templates_router",
    "proposals_router",
    "pdf_router",
    "uploads_router",
]

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.template_service import list_templates, get_template_by_id

router = APIRouter(prefix="/api/templates", tags=["Templates"])


@router.get("", response_model=List[Dict[str, Any]])
def get_all_templates():
    return list_templates()


@router.get("/{template_id}", response_model=Dict[str, Any])
def get_template(template_id: str):
    template = get_template_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found")
    return template

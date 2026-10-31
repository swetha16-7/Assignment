from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.schemas.proposal import (
    ProposalCreate,
    ProposalUpdate,
    ProposalResponse,
    ProposalStats,
)
from app.services import proposal_service
from app.services.pdf_service import render_proposal_html

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])


@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def create_proposal(proposal_in: ProposalCreate, db: Session = Depends(get_db)):
    try:
        return proposal_service.create_proposal(db, proposal_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create proposal: {str(e)}")


@router.get("/stats", response_model=ProposalStats)
def get_stats(db: Session = Depends(get_db)):
    return proposal_service.get_dashboard_stats(db)


@router.get("", response_model=List[ProposalResponse])
def get_proposals(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    items, _ = proposal_service.list_proposals(db, skip=skip, limit=limit, status=status, search=search)
    return items


@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal(proposal_id: str, db: Session = Depends(get_db)):
    proposal = proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal


@router.put("/{proposal_id}", response_model=ProposalResponse)
def update_proposal(proposal_id: str, proposal_in: ProposalUpdate, db: Session = Depends(get_db)):
    proposal = proposal_service.update_proposal(db, proposal_id, proposal_in)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal


@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(proposal_id: str, db: Session = Depends(get_db)):
    success = proposal_service.delete_proposal(db, proposal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return None


@router.post("/preview-html", response_class=HTMLResponse)
def preview_html(payload: Dict[str, Any]):
    """
    Renders live HTML preview for currently unsaved form state.
    """
    try:
        template_id = payload.get("selected_template", "corporate")
        html_content = render_proposal_html(payload, template_id)
        return HTMLResponse(content=html_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview generation failed: {str(e)}")

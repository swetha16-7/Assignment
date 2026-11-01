import os
import re
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.services import proposal_service
from app.services.pdf_service import generate_proposal_pdf, render_proposal_html

router = APIRouter(prefix="/api/proposals", tags=["PDF Generation"])


@router.post("/{proposal_id}/generate-pdf")
async def generate_pdf(proposal_id: str, db: Session = Depends(get_db)):
    proposal = proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    try:
        pdf_path = await generate_proposal_pdf(proposal)
        proposal.pdf_path = pdf_path
        proposal.status = "generated"
        db.commit()
        db.refresh(proposal)

        return {
            "message": "PDF generated successfully",
            "proposal_id": proposal.id,
            "proposal_number": proposal.proposal_number,
            "pdf_url": f"/api/proposals/{proposal.id}/download",
            "status": proposal.status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.get("/{proposal_id}/download")
async def download_pdf(proposal_id: str, db: Session = Depends(get_db)):
    proposal = proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    pdf_path = proposal.pdf_path
    
    # Check if path exists directly
    if not pdf_path or not os.path.exists(pdf_path):
        # Check if file exists in settings.PDF_OUTPUT_DIR
        candidate = os.path.join(settings.PDF_OUTPUT_DIR, os.path.basename(pdf_path or ""))
        if pdf_path and os.path.exists(candidate):
            pdf_path = candidate
            proposal.pdf_path = pdf_path
            db.commit()
        else:
            # Auto-generate if missing
            try:
                pdf_path = await generate_proposal_pdf(proposal)
                proposal.pdf_path = pdf_path
                proposal.status = "generated"
                db.commit()
                db.refresh(proposal)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to render PDF: {str(e)}")

    safe_number = re.sub(r"[^a-zA-Z0-9_\-]", "_", proposal.proposal_number or "proposal")
    safe_title = re.sub(r"[^a-zA-Z0-9_\-]", "_", (proposal.title or "proposal")[:30]).strip("_") or "document"
    download_filename = f"{safe_number}_{safe_title}.pdf"

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=download_filename,
    )


@router.get("/{proposal_id}/html-preview", response_class=HTMLResponse)
def get_saved_proposal_html(proposal_id: str, db: Session = Depends(get_db)):
    proposal = proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    proposal_dict = {c.name: getattr(proposal, c.name) for c in proposal.__table__.columns}
    html = render_proposal_html(proposal_dict, proposal.selected_template)
    return HTMLResponse(content=html)

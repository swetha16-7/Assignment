from datetime import datetime
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.models.proposal import Proposal
from app.schemas.proposal import ProposalCreate, ProposalUpdate
from app.utils.calculations import calculate_proposal_totals


def generate_proposal_number(db: Session) -> str:
    year = datetime.utcnow().year
    prefix = f"PC-{year}-"
    count = db.query(Proposal).filter(Proposal.proposal_number.like(f"{prefix}%")).count()
    return f"{prefix}{count + 1:04d}"


def create_proposal(db: Session, proposal_in: ProposalCreate) -> Proposal:
    proposal_data = proposal_in.dict()

    # Recalculate totals with decimal safety
    line_items = proposal_data.get("line_items", [])
    disc_pct = proposal_data.get("discount_percentage", 0.0)
    tax_pct = proposal_data.get("tax_percentage", 0.0)

    calculated = calculate_proposal_totals(line_items, disc_pct, tax_pct)
    proposal_data["line_items"] = calculated["line_items"]
    proposal_data["subtotal"] = calculated["subtotal"]
    proposal_data["discount_percentage"] = calculated["discount_percentage"]
    proposal_data["discount_amount"] = calculated["discount_amount"]
    proposal_data["tax_percentage"] = calculated["tax_percentage"]
    proposal_data["tax_amount"] = calculated["tax_amount"]
    proposal_data["grand_total"] = calculated["grand_total"]

    proposal_number = generate_proposal_number(db)
    proposal = Proposal(
        proposal_number=proposal_number,
        **proposal_data
    )

    db.add(proposal)
    db.commit()
    db.refresh(proposal)
    return proposal


def get_proposal_by_id(db: Session, proposal_id: str) -> Optional[Proposal]:
    return db.query(Proposal).filter(Proposal.id == proposal_id).first()


def list_proposals(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> Tuple[List[Proposal], int]:
    query = db.query(Proposal)

    if status and status != "all":
        query = query.filter(Proposal.status == status)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Proposal.title.ilike(search_pattern)) |
            (Proposal.proposal_number.ilike(search_pattern)) |
            (Proposal.client_name.ilike(search_pattern)) |
            (Proposal.client_company.ilike(search_pattern)) |
            (Proposal.project_name.ilike(search_pattern))
        )

    total = query.count()
    items = query.order_by(desc(Proposal.created_at)).offset(skip).limit(limit).all()
    return items, total


def update_proposal(db: Session, proposal_id: str, proposal_in: ProposalUpdate) -> Optional[Proposal]:
    proposal = get_proposal_by_id(db, proposal_id)
    if not proposal:
        return None

    update_dict = proposal_in.dict(exclude_unset=True)

    # If pricing-related fields changed, recalculate
    if any(k in update_dict for k in ("line_items", "discount_percentage", "tax_percentage")):
        current_items = update_dict.get("line_items", proposal.line_items)
        current_disc = update_dict.get("discount_percentage", proposal.discount_percentage)
        current_tax = update_dict.get("tax_percentage", proposal.tax_percentage)

        calculated = calculate_proposal_totals(current_items, current_disc, current_tax)
        update_dict["line_items"] = calculated["line_items"]
        update_dict["subtotal"] = calculated["subtotal"]
        update_dict["discount_percentage"] = calculated["discount_percentage"]
        update_dict["discount_amount"] = calculated["discount_amount"]
        update_dict["tax_percentage"] = calculated["tax_percentage"]
        update_dict["tax_amount"] = calculated["tax_amount"]
        update_dict["grand_total"] = calculated["grand_total"]

    for key, val in update_dict.items():
        setattr(proposal, key, val)

    proposal.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(proposal)
    return proposal


def delete_proposal(db: Session, proposal_id: str) -> bool:
    proposal = get_proposal_by_id(db, proposal_id)
    if not proposal:
        return False

    db.delete(proposal)
    db.commit()
    return True


def get_dashboard_stats(db: Session) -> Dict[str, Any]:
    total_proposals = db.query(Proposal).count()
    draft_proposals = db.query(Proposal).filter(Proposal.status == "draft").count()
    generated_pdfs = db.query(Proposal).filter(Proposal.status.in_(["generated", "sent", "accepted"])).count()
    
    total_val = db.query(func.sum(Proposal.grand_total)).scalar() or 0.0
    recent = db.query(Proposal).order_by(desc(Proposal.created_at)).limit(6).all()

    return {
        "total_proposals": total_proposals,
        "draft_proposals": draft_proposals,
        "generated_pdfs": generated_pdfs,
        "total_value": float(total_val),
        "recent_proposals": recent
    }

import json
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional, Any, Dict
from datetime import datetime
from app.schemas.pricing import LineItem


class ScopeItem(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., description="Scope title or category")
    description: Optional[str] = Field(default="", description="Detailed scope description")


class DeliverableItem(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., description="Deliverable title")
    description: Optional[str] = Field(default="", description="Deliverable details and format")


class TimelinePhase(BaseModel):
    id: Optional[str] = None
    phase_name: str = Field(..., description="Phase title, e.g. Discovery & Architecture")
    description: Optional[str] = Field(default="", description="Phase milestones and activities")
    start_date: Optional[str] = Field(default="", description="Start date (YYYY-MM-DD or readable)")
    end_date: Optional[str] = Field(default="", description="End date (YYYY-MM-DD or readable)")
    duration: Optional[str] = Field(default="", description="Duration, e.g. 2 weeks")


class TermItem(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., description="Term section heading, e.g. Payment Schedule")
    content: str = Field(..., description="Terms clause content")


class ProposalBase(BaseModel):
    title: str = Field(default="Business Proposal", description="Proposal title")
    selected_template: str = Field(default="corporate", description="Selected template: corporate, modern, minimal")
    status: str = Field(default="draft", description="Proposal status: draft, generated, sent, accepted")

    # Company Details
    company_name: str = Field(default="", description="Your company name")
    company_logo_url: Optional[str] = Field(default=None, description="Company logo data URI or URL")
    company_address: Optional[str] = Field(default="", description="Company physical/mailing address")
    company_email: Optional[str] = Field(default="", description="Company contact email")
    company_phone: Optional[str] = Field(default="", description="Company phone number")
    company_website: Optional[str] = Field(default="", description="Company website URL")

    # Client Details
    client_name: str = Field(default="", description="Primary client contact name")
    client_company: str = Field(default="", description="Client organization name")
    client_email: Optional[str] = Field(default="", description="Client contact email")
    client_address: Optional[str] = Field(default="", description="Client address")
    client_phone: Optional[str] = Field(default="", description="Client phone number")

    # Project Details
    project_name: str = Field(default="", description="Project title")
    project_description: Optional[str] = Field(default="", description="Executive summary or project overview")
    project_objectives: List[str] = Field(default_factory=list, description="List of high-level objectives")
    scope_items: List[ScopeItem] = Field(default_factory=list, description="Scope of work items")
    deliverables: List[DeliverableItem] = Field(default_factory=list, description="Key deliverables")
    assumptions: Optional[str] = Field(default="", description="Project assumptions and prerequisites")

    # Pricing & Currency
    currency: str = Field(default="USD", description="Currency ISO code")
    currency_symbol: str = Field(default="$", description="Currency symbol")
    line_items: List[LineItem] = Field(default_factory=list, description="Billable line items")
    discount_percentage: float = Field(default=0.0, ge=0.0, le=100.0, description="Discount %")
    tax_percentage: float = Field(default=0.0, ge=0.0, description="Tax %")

    # Timeline Details
    timeline_phases: List[TimelinePhase] = Field(default_factory=list, description="Project timeline phases")

    # Terms & Conditions
    terms: List[TermItem] = Field(default_factory=list, description="Terms and conditions")

    @field_validator(
        "project_objectives",
        "scope_items",
        "deliverables",
        "line_items",
        "timeline_phases",
        "terms",
        mode="before"
    )
    @classmethod
    def parse_json_string_if_needed(cls, v):
        if isinstance(v, str):
            v_str = v.strip()
            if not v_str:
                return []
            try:
                parsed = json.loads(v_str)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return []
        if v is None:
            return []
        return v


class ProposalCreate(ProposalBase):
    pass


class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    selected_template: Optional[str] = None
    status: Optional[str] = None

    company_name: Optional[str] = None
    company_logo_url: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_website: Optional[str] = None

    client_name: Optional[str] = None
    client_company: Optional[str] = None
    client_email: Optional[str] = None
    client_address: Optional[str] = None
    client_phone: Optional[str] = None

    project_name: Optional[str] = None
    project_description: Optional[str] = None
    project_objectives: Optional[List[str]] = None
    scope_items: Optional[List[ScopeItem]] = None
    deliverables: Optional[List[DeliverableItem]] = None
    assumptions: Optional[str] = None

    currency: Optional[str] = None
    currency_symbol: Optional[str] = None
    line_items: Optional[List[LineItem]] = None
    discount_percentage: Optional[float] = None
    tax_percentage: Optional[float] = None

    timeline_phases: Optional[List[TimelinePhase]] = None
    terms: Optional[List[TermItem]] = None

    @field_validator(
        "project_objectives",
        "scope_items",
        "deliverables",
        "line_items",
        "timeline_phases",
        "terms",
        mode="before"
    )
    @classmethod
    def parse_update_json_string_if_needed(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            v_str = v.strip()
            if not v_str:
                return []
            try:
                parsed = json.loads(v_str)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return []
        return v


class ProposalResponse(ProposalBase):
    id: str
    proposal_number: str
    subtotal: float
    discount_amount: float
    tax_amount: float
    grand_total: float
    pdf_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProposalStats(BaseModel):
    total_proposals: int
    draft_proposals: int
    generated_pdfs: int
    total_value: float
    recent_proposals: List[ProposalResponse]

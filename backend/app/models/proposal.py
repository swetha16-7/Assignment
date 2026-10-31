import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, JSON
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    proposal_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, default="Business Proposal")
    status = Column(String(50), default="draft")  # draft, generated, sent, accepted
    selected_template = Column(String(50), default="corporate")  # corporate, modern, minimal

    # Company Details
    company_name = Column(String(255), default="")
    company_logo_url = Column(Text, nullable=True)  # URL or data URI
    company_address = Column(Text, default="")
    company_email = Column(String(255), default="")
    company_phone = Column(String(100), default="")
    company_website = Column(String(255), default="")

    # Client Details
    client_name = Column(String(255), default="")
    client_company = Column(String(255), default="")
    client_email = Column(String(255), default="")
    client_address = Column(Text, default="")
    client_phone = Column(String(100), default="")

    # Project Details
    project_name = Column(String(255), default="")
    project_description = Column(Text, default="")
    project_objectives = Column(JSON, default=list)  # list of str or objects
    scope_items = Column(JSON, default=list)  # list of {title, description}
    deliverables = Column(JSON, default=list)  # list of {title, description}
    assumptions = Column(Text, default="")

    # Pricing & Currency
    currency = Column(String(10), default="USD")
    currency_symbol = Column(String(10), default="$")
    line_items = Column(JSON, default=list)  # list of {description, quantity, unit_price, total}
    subtotal = Column(Float, default=0.0)
    discount_percentage = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    tax_percentage = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)

    # Timeline Details
    timeline_phases = Column(JSON, default=list)  # list of {phase_name, description, start_date, end_date, duration}

    # Terms & Conditions
    terms = Column(JSON, default=list)  # list of {title, content}

    # PDF File Path if generated
    pdf_path = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

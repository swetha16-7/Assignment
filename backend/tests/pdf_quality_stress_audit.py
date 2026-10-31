import sys
import os
import asyncio

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.proposal import Proposal
from app.schemas.proposal import ProposalCreate
from app.services import proposal_service
from app.services.pdf_service import generate_proposal_pdf

# Stress-test dataset with long descriptions, 6 scope items, 6 deliverables, 8 pricing items, 5 phases
COMPREHENSIVE_STRESS_PROPOSAL = {
    "title": "Global Omnichannel Digital Banking Modernization & Core Migration",
    "selected_template": "corporate",
    "status": "draft",
    "company_name": "StrataScale Cloud Engineering Global LLC",
    "company_logo_url": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='40'><rect width='160' height='40' fill='%230f2942'/><text x='15' y='26' fill='white' font-family='sans-serif' font-weight='bold' font-size='16'>STRATASCALE</text></svg>",
    "company_address": "Tower One, Financial District, Level 42, New York, NY 10006",
    "company_email": "contracts@stratascale.com",
    "company_phone": "+1 (212) 555-8900",
    "company_website": "https://stratascale.com",
    "client_name": "Eleanor Vance-Montgomery",
    "client_company": "Pacific Horizon Banking Consortium",
    "client_email": "e.vance@pacifichorizon.com",
    "client_address": "888 California Street, Suite 3000, San Francisco, CA 94108",
    "client_phone": "+1 (415) 555-9400",
    "project_name": "Omnichannel Real-Time Payment Engine & Core Banking Migration",
    "project_description": (
        "Pacific Horizon Banking Consortium operates a distributed retail and commercial network across 14 international jurisdictions. "
        "The current legacy core banking systems process over 25 million daily ledger transactions on aging mainframe infrastructure with "
        "batch-based settlement windows that constrain real-time liquidity and introduce unacceptable operational friction.\n\n"
        "StrataScale will deliver an end-to-end, ISO 20022 compliant, cloud-native event-driven platform deployed across three geographically "
        "disparate availability regions. The solution integrates zero-downtime ledger synchronization, real-time fraud mitigation powered by "
        "inline machine learning inferences, and automated compliance auditing designed to exceed FFIEC, PCI-DSS Level 1, and GDPR strictures."
    ),
    "project_objectives": [
        "Achieve sub-50ms roundtrip transaction settlement for real-time domestic and cross-border SEPA/FedNow payment rails",
        "Guarantee 99.999% high availability across active-active cloud regions with zero uncommitted data loss (RPO = 0, RTO < 30s)",
        "Automate end-to-end regulatory compliance logging with tamper-proof cryptographic audit trails",
        "Enable continuous canary deployments and zero-downtime schema evolution across transactional databases",
        "Reduce annual compute and infrastructure operational maintenance expenditure by 42%"
    ],
    "scope_items": [
        {"title": "Workstream 1: Distributed Multi-Region Cloud Landing Zone", "description": "Architect AWS Organizations infrastructure with Transit Gateways, dedicated DirectConnect circuits, KMS HSM encryption, and zero-trust IAM governance."},
        {"title": "Workstream 2: Micro-Core Ledger & Event Mesh Architecture", "description": "Develop high-throughput Kafka streaming pipeline capable of processing 100,000 TPS with distributed lock-free state stores."},
        {"title": "Workstream 3: Real-Time Fraud & AML Detection Gateway", "description": "Deploy low-latency feature stores and inference microservices scanning transaction flows prior to ledger commitment."},
        {"title": "Workstream 4: Open Banking API Gateway (PSD2 / FAPI Compliant)", "description": "Deliver OAuth2 / mTLS secure APIs exposing account aggregation and payment initiation to third-party providers."},
        {"title": "Workstream 5: Legacy Bi-Directional CDC Migration Engine", "description": "Deploy Debezium change-data-capture pipelines replicating legacy DB2 mainframe data to PostgreSQL with live reconciliation."},
        {"title": "Workstream 6: Enterprise Chaos Engineering & DR Certification", "description": "Execute automated region-failover chaos drills and third-party penetration audits."}
    ],
    "deliverables": [
        {"title": "Complete Modular Terraform & GitOps Repositories", "description": "All infrastructure-as-code deploying network, compute, databases, and monitoring clusters."},
        {"title": "Automated ISO 20022 Message Parsing Microservices", "description": "Compiled container images with 95%+ unit test coverage and benchmark test suites."},
        {"title": "Zero-Downtime Mainframe Cutover Orchestrator", "description": "Production scripts and verified verification dashboards for cutover weekend."},
        {"title": "Disaster Recovery Playbooks & Regulatory Certification Dossier", "description": "Exhaustive documentation for executive leadership and central bank auditors."},
        {"title": "24/7 SRE Runbooks & Observability Dashboards", "description": "Grafana dashboards, PagerDuty alerting policies, and runbook automation."},
        {"title": "Engineering Team Training & Enablement Workshops", "description": "Five 4-hour hands-on sessions for 50 internal platform engineers."}
    ],
    "assumptions": (
        "1. Pacific Horizon will provide dedicated staging VPC connections and test accounts within 10 business days of contract execution.\n"
        "2. Mainframe operations staff will be available for bi-weekly interface alignment and schema mapping reviews.\n"
        "3. Security accreditation reviews will be processed within standard 5-day review cycles."
    ),
    "currency": "EUR",
    "currency_symbol": "€",
    "line_items": [
        {"description": "Executive Cloud & Security Architecture Blueprint", "quantity": 160, "unit_price": 220.00},
        {"description": "Multi-Region Cloud Landing Zone Implementation", "quantity": 240, "unit_price": 195.00},
        {"description": "Distributed Event Mesh & Real-Time Ledger Engine", "quantity": 360, "unit_price": 210.00},
        {"description": "ISO 20022 Open Banking API Gateway Microservices", "quantity": 280, "unit_price": 190.00},
        {"description": "Mainframe CDC Replication & Data Migration Pipeline", "quantity": 220, "unit_price": 205.00},
        {"description": "Real-Time Fraud Detection & Inference Service", "quantity": 180, "unit_price": 215.00},
        {"description": "Chaos Engineering, Pen-Testing & Hardening", "quantity": 120, "unit_price": 200.00},
        {"description": "Platform SRE Handover Workshops & Hypercare (60 Days)", "quantity": 100, "unit_price": 180.00}
    ],
    "discount_percentage": 7.5,
    "tax_percentage": 19.0,
    "timeline_phases": [
        {"phase_name": "Phase 1: Architecture Blueprint & Cloud Foundation", "description": "Regulatory audit, VPC peering, KMS vaults, and landing zone instantiation.", "start_date": "2026-11-01", "end_date": "2026-11-30", "duration": "4 Weeks"},
        {"phase_name": "Phase 2: Event Mesh & Micro-Ledger Development", "description": "Kafka streaming topology, distributed schema registries, and core APIs.", "start_date": "2026-12-01", "end_date": "2027-01-31", "duration": "8 Weeks"},
        {"phase_name": "Phase 3: CDC Data Migration & Shadow Ledger Pipeline", "description": "Mainframe CDC replication, shadow processing, and transaction parity verification.", "start_date": "2027-02-01", "end_date": "2027-03-31", "duration": "8 Weeks"},
        {"phase_name": "Phase 4: Chaos Testing, Pen-Testing & Regulatory Sign-Off", "description": "Simulated regional blackouts, central bank audit dossier review, and security sign-off.", "start_date": "2027-04-01", "end_date": "2027-04-30", "duration": "4 Weeks"},
        {"phase_name": "Phase 5: Production Go-Live & 60-Day Hypercare", "description": "Cutover weekend execution, 24/7 war room monitoring, and internal SRE handover.", "start_date": "2027-05-01", "end_date": "2027-06-30", "duration": "8 Weeks"}
    ],
    "terms": [
        {"title": "1. Invoicing & Milestone Release Schedule", "content": "Payments shall be remitted in five milestone tranches: 20% on contract execution, 20% on Phase 2 completion, 20% on Phase 3 completion, 20% on Phase 4 completion, and 20% upon final production sign-off. Net 30 days."},
        {"title": "2. Commercial Validity & Currency", "content": "All figures in this schedule are quoted in Euros (€) and guaranteed valid for 45 calendar days from the date of presentation."},
        {"title": "3. Intellectual Property Rights", "content": "Upon receipt of final milestone settlement, Pacific Horizon Banking Consortium shall hold exclusive, perpetual, irrevocable title to all custom source code and architectural artifacts developed under this engagement."},
        {"title": "4. Service Level & Warranty Commitment", "content": "StrataScale warrants that all delivered services shall perform in strict compliance with agreed specifications during the 60-day hypercare period, with critical defects remediated under 2-hour response SLAs."},
        {"title": "5. Mutual Confidentiality & Regulatory Disclosure", "content": "All proprietary technical data, security schematics, and commercial rate structures shall remain strictly confidential, exempt only where disclosure is legally mandated by banking regulatory authorities."}
    ]
}

# Proposal with minimal/missing optional fields
MINIMAL_OPTIONAL_FIELDS_PROPOSAL = {
    "title": "Advisory Consultation Retainer",
    "selected_template": "minimal",
    "status": "draft",
    "company_name": "Horizon Advisory Group",
    "company_logo_url": None,  # Missing logo
    "company_address": "",      # Missing address
    "company_email": "advisory@horizon.com",
    "company_phone": "",        # Missing phone
    "company_website": "",      # Missing website
    "client_name": "Robert Chen",
    "client_company": "Apex Capital",
    "client_email": "rchen@apexcap.com",
    "client_address": "",       # Missing client address
    "client_phone": "",         # Missing client phone
    "project_name": "Q1 Strategic Review",
    "project_description": "Executive advisory retainer for quarterly portfolio performance evaluations.",
    "project_objectives": [],   # Missing objectives
    "scope_items": [
        {"title": "Monthly Strategic Governance Review", "description": "Review capital allocation models."}
    ],
    "deliverables": [],         # Missing deliverables
    "assumptions": "",          # Missing assumptions
    "currency": "GBP",
    "currency_symbol": "£",
    "line_items": [
        {"description": "Monthly Advisory Retainer (Fixed Fee)", "quantity": 1, "unit_price": 5000.00}
    ],
    "discount_percentage": 0.0, # Zero discount
    "tax_percentage": 0.0,      # Zero tax
    "timeline_phases": [],      # Missing timeline phases
    "terms": []                 # Missing custom terms
}


def run_pdf_stress_audit():
    print("=" * 60)
    print("PROPOSALCRAFT PDF QUALITY & STRESS AUDIT")
    print("=" * 60)

    db = SessionLocal()

    # 1. Stress Test across all 3 templates
    print("\n[STRESS TEST] Generating multi-page, comprehensive proposals with realistic enterprise data:")
    for tmpl in ["corporate", "modern", "minimal"]:
        payload = dict(COMPREHENSIVE_STRESS_PROPOSAL)
        payload["selected_template"] = tmpl
        prop = proposal_service.create_proposal(db, ProposalCreate(**payload))
        
        pdf_path = asyncio.run(generate_proposal_pdf(prop))
        assert os.path.exists(pdf_path)
        data = open(pdf_path, "rb").read()
        assert data.startswith(b"%PDF-")
        
        print(f"  -> Template '{tmpl}': Generated {len(data):,} bytes ({prop.proposal_number})")
        print(f"     Currency: {prop.currency_symbol}{prop.grand_total:,.2f} (Subtotal: {prop.currency_symbol}{prop.subtotal:,.2f})")
        print(f"     Path: {pdf_path}")

    # 2. Test Missing Optional Fields
    print("\n[ROBUSTNESS TEST] Generating proposal with missing optional fields (no logo, no phone, no tax, no phases):")
    for tmpl in ["corporate", "modern", "minimal"]:
        payload = dict(MINIMAL_OPTIONAL_FIELDS_PROPOSAL)
        payload["selected_template"] = tmpl
        prop = proposal_service.create_proposal(db, ProposalCreate(**payload))
        
        pdf_path = asyncio.run(generate_proposal_pdf(prop))
        assert os.path.exists(pdf_path)
        data = open(pdf_path, "rb").read()
        assert data.startswith(b"%PDF-")
        print(f"  -> Template '{tmpl}' handled missing fields gracefully: {len(data):,} bytes ({prop.proposal_number})")

    print("\n" + "=" * 60)
    print("ALL PDF QUALITY & MULTI-TEMPLATE STRESS AUDITS COMPLETED!")
    print("=" * 60)


if __name__ == "__main__":
    run_pdf_stress_audit()

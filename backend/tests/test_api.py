import pytest
import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_PROPOSAL_PAYLOAD = {
    "title": "Cloud Infrastructure Modernization Proposal",
    "selected_template": "corporate",
    "status": "draft",
    "company_name": "Apex Engineering Solutions LLC",
    "company_logo_url": None,
    "company_address": "500 Tech Parkway, Suite 400, Austin, TX 78701",
    "company_email": "proposals@apexsolutions.com",
    "company_phone": "+1 (512) 555-0199",
    "company_website": "https://apexsolutions.com",
    "client_name": "Sarah Jenkins",
    "client_company": "Global FinCorp Inc.",
    "client_email": "s.jenkins@globalfincorp.com",
    "client_address": "120 Wall Street, New York, NY 10005",
    "client_phone": "+1 (212) 555-8833",
    "project_name": "Multi-Region Cloud Migration",
    "project_description": "Comprehensive migration of legacy on-premises transactional systems to an enterprise-grade, highly available Kubernetes cloud platform.",
    "project_objectives": [
        "Achieve 99.99% system availability with automated failover",
        "Reduce operational compute overhead by 35% through containerization",
        "Implement zero-trust security architecture and automated compliance auditing"
    ],
    "scope_items": [
        {
            "title": "Phase 1: Architecture Blueprint & Cloud Foundation",
            "description": "Establish multi-region Terraform VPCs, transit gateways, IAM roles, and encryption KMS keys."
        },
        {
            "title": "Phase 2: Database Migration & Replication",
            "description": "Deploy distributed PostgreSQL clusters with active streaming replication and automated zero-downtime cutover."
        }
    ],
    "deliverables": [
        {
            "title": "Production Terraform Infrastructure as Code",
            "description": "Fully modular, version-controlled repository with CI/CD deployment pipelines."
        },
        {
            "title": "Disaster Recovery Runbook & Training",
            "description": "Complete documentation and hands-on operational runbooks for internal engineering teams."
        }
    ],
    "assumptions": "Client will provide access to existing staging environments and allocate one primary technical liaison.",
    "currency": "USD",
    "currency_symbol": "$",
    "line_items": [
        {
            "description": "Cloud Architecture & Security Design",
            "quantity": 80,
            "unit_price": 175.00
        },
        {
            "description": "Kubernetes Cluster Setup & IaC Implementation",
            "quantity": 120,
            "unit_price": 160.00
        },
        {
            "description": "PostgreSQL Database Migration & Verification",
            "quantity": 60,
            "unit_price": 185.00
        }
    ],
    "discount_percentage": 5.0,
    "tax_percentage": 8.25,
    "timeline_phases": [
        {
            "phase_name": "Discovery & Architecture",
            "description": "Audit existing systems, define network topology, and establish cloud landing zones.",
            "start_date": "2026-11-01",
            "end_date": "2026-11-14",
            "duration": "2 Weeks"
        },
        {
            "phase_name": "Implementation & Deployment",
            "description": "Deploy workloads to Kubernetes, configure ingress, and initiate data sync.",
            "start_date": "2026-11-15",
            "end_date": "2026-12-15",
            "duration": "4 Weeks"
        }
    ],
    "terms": [
        {
            "title": "Payment Schedule",
            "content": "30% upfront upon proposal acceptance, 40% upon completion of Phase 2, and 30% upon final sign-off."
        },
        {
            "title": "Proposal Validity",
            "content": "This proposal and its discounted pricing remain valid for 30 days from the date of issuance."
        }
    ]
}


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "service" in data


def test_templates_catalog():
    response = client.get("/api/templates")
    assert response.status_code == 200
    templates = response.json()
    assert len(templates) >= 3
    ids = [t["id"] for t in templates]
    assert "corporate" in ids
    assert "modern" in ids
    assert "minimal" in ids

    # Single template check
    res_single = client.get("/api/templates/modern")
    assert res_single.status_code == 200
    assert res_single.json()["name"] == "Modern Edge"


def test_create_and_calculate_proposal():
    response = client.post("/api/proposals", json=SAMPLE_PROPOSAL_PAYLOAD)
    assert response.status_code == 201
    proposal = response.json()
    assert "id" in proposal
    assert proposal["proposal_number"].startswith("PC-")
    
    # Verify exact math:
    # Item 1: 80 * 175 = 14000
    # Item 2: 120 * 160 = 19200
    # Item 3: 60 * 185 = 11100
    # Subtotal: 14000 + 19200 + 11100 = 44300.00
    assert proposal["subtotal"] == 44300.0
    
    # Discount 5%: 44300 * 0.05 = 2215.00
    assert proposal["discount_amount"] == 2215.0
    
    # Net: 44300 - 2215 = 42085.00
    # Tax 8.25%: 42085 * 0.0825 = 3472.0125 -> 3472.01
    assert proposal["tax_amount"] == 3472.01
    
    # Grand total: 42085 + 3472.01 = 45557.01
    assert proposal["grand_total"] == 45557.01

    proposal_id = proposal["id"]

    # Retrieve proposal
    get_res = client.get(f"/api/proposals/{proposal_id}")
    assert get_res.status_code == 200
    assert get_res.json()["client_name"] == "Sarah Jenkins"

    # Dashboard stats
    stats_res = client.get("/api/proposals/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_proposals"] >= 1


def test_preview_html_endpoint():
    response = client.post("/api/proposals/preview-html", json=SAMPLE_PROPOSAL_PAYLOAD)
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    html = response.text
    assert "Apex Engineering Solutions LLC" in html
    assert "Sarah Jenkins" in html
    assert "45,557.01" in html


@pytest.mark.asyncio
async def test_generate_pdf_playwright():
    # Create proposal with 'modern' template
    payload = dict(SAMPLE_PROPOSAL_PAYLOAD)
    payload["selected_template"] = "modern"
    res = client.post("/api/proposals", json=payload)
    assert res.status_code == 201
    prop_id = res.json()["id"]

    # Generate PDF
    gen_res = client.post(f"/api/proposals/{prop_id}/generate-pdf")
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert "pdf_url" in gen_data
    assert gen_data["status"] == "generated"

    # Download PDF and verify bytes
    dl_res = client.get(f"/api/proposals/{prop_id}/download")
    assert dl_res.status_code == 200
    assert dl_res.headers["content-type"] == "application/pdf"
    # PDF files start with %PDF-
    assert dl_res.content[:5] == b"%PDF-"
    assert len(dl_res.content) > 1000  # Valid multi-kilobyte PDF


@pytest.mark.asyncio
async def test_generate_pdf_all_templates():
    for template_name in ["corporate", "modern", "minimal"]:
        payload = dict(SAMPLE_PROPOSAL_PAYLOAD)
        payload["selected_template"] = template_name
        res = client.post("/api/proposals", json=payload)
        assert res.status_code == 201
        prop_id = res.json()["id"]

        gen_res = client.post(f"/api/proposals/{prop_id}/generate-pdf")
        assert gen_res.status_code == 200
        dl_res = client.get(f"/api/proposals/{prop_id}/download")
        assert dl_res.status_code == 200
        assert dl_res.content[:5] == b"%PDF-"

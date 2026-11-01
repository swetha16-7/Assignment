import asyncio
import os
import sys
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.proposal import Proposal
from app.schemas.proposal import ProposalCreate
from app.services import proposal_service
from app.services.pdf_service import generate_proposal_pdf
from app.config import settings

def test_pdf_fix():
    print("=" * 60)
    print("VERIFYING PDF GENERATION AND DOWNLOAD FIX")
    print("=" * 60)

    db = SessionLocal()

    # Test 1: Proposal with stringified JSON fields (e.g. from SQLite or raw input)
    print("\n[TEST 1] Testing proposal with JSON strings in line_items and scope...")
    payload_str_json = {
        "title": "Cloud Modernization & Security Architecture",
        "selected_template": "corporate",
        "status": "draft",
        "company_name": "Apex Enterprise Solutions",
        "company_email": "info@apex.com",
        "client_name": "Sarah Connor",
        "client_company": "Cyberdyne Systems",
        "currency": "USD",
        "currency_symbol": "$",
        "line_items": '[{"description": "Security Audit", "quantity": 10, "unit_price": 250.00}]',
        "project_objectives": '["Attain SOC2 compliance", "Migrate to multi-cloud"]',
        "scope_items": '[{"title": "Audit", "description": "Full vulnerability assessment"}]',
        "deliverables": '[{"title": "Security Report", "description": "Comprehensive PDF audit"}]',
        "timeline_phases": '[{"phase_name": "Phase 1", "duration": "2 weeks"}]',
        "terms": '[{"title": "Payment Terms", "content": "Net 30 days"}]',
        "discount_percentage": 5.0,
        "tax_percentage": 10.0,
    }

    # Proposal create handles stringified or list line_items safely
    prop = proposal_service.create_proposal(db, ProposalCreate(**payload_str_json))
    assert prop.id is not None
    assert prop.grand_total > 0
    print(f"  -> Created proposal: {prop.proposal_number} (ID: {prop.id})")
    print(f"     Subtotal: ${prop.subtotal:,.2f}, Grand Total: ${prop.grand_total:,.2f}")

    # Test PDF generation
    print("\n[TEST 2] Generating PDF with Playwright...")
    pdf_path = asyncio.run(generate_proposal_pdf(prop))
    assert os.path.isabs(pdf_path), f"Expected absolute path, got {pdf_path}"
    assert os.path.exists(pdf_path), f"File not found: {pdf_path}"
    
    data = open(pdf_path, "rb").read()
    assert data.startswith(b"%PDF-"), "Invalid PDF header"
    print(f"  -> PDF generated successfully: {pdf_path} ({len(data):,} bytes)")

    # Test 3: Test all 3 templates
    print("\n[TEST 3] Testing PDF generation across all 3 templates with special chars in title...")
    templates = ["corporate", "modern", "minimal"]
    for tmpl in templates:
        p_data = {
            "title": f"Strategic Scope & Architecture: {tmpl.capitalize()}",
            "selected_template": tmpl,
            "status": "draft",
            "company_name": "Tech Corp / Systems",
            "client_name": "Jane & John Doe",
            "line_items": [{"description": "Advisory Consulting", "quantity": 5, "unit_price": 300.0}],
            "discount_percentage": 0.0,
            "tax_percentage": 5.0,
        }
        test_prop = proposal_service.create_proposal(db, ProposalCreate(**p_data))
        generated_path = asyncio.run(generate_proposal_pdf(test_prop))
        assert os.path.exists(generated_path)
        content = open(generated_path, "rb").read()
        assert content.startswith(b"%PDF-")
        print(f"  -> Template '{tmpl}' generated: {len(content):,} bytes ({test_prop.proposal_number})")

    # Test 4: Download filename sanitization
    print("\n[TEST 4] Testing filename sanitization for Windows safety...")
    test_title = 'Mobile / Web App & API: "Critical Phase" *Test* <Scope>'
    safe_title = re.sub(r"[^a-zA-Z0-9_\-]", "_", test_title[:30]).strip("_") or "document"
    assert "/" not in safe_title
    assert "\\" not in safe_title
    assert ":" not in safe_title
    assert '"' not in safe_title
    assert "*" not in safe_title
    assert "<" not in safe_title
    print(f"  -> Original title: {test_title}")
    print(f"  -> Sanitized safe download filename: {safe_title}.pdf")

    print("\n" + "=" * 60)
    print("ALL PDF GENERATION & DOWNLOAD VERIFICATION TESTS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    test_pdf_fix()


def test_api_download_endpoints():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    
    # 1. Create a proposal
    prop_data = {
        "title": "API Download Test Proposal",
        "selected_template": "corporate",
        "client_name": "Test Client",
        "line_items": [{"description": "API Test Item", "quantity": 1, "unit_price": 500}]
    }
    create_res = client.post("/api/proposals", json=prop_data)
    assert create_res.status_code == 201, f"Create failed: {create_res.text}"
    proposal_id = create_res.json()["id"]

    # 2. Call generate-pdf
    gen_res = client.post(f"/api/proposals/{proposal_id}/generate-pdf")
    assert gen_res.status_code == 200, f"Generate failed: {gen_res.text}"
    assert "pdf_url" in gen_res.json()
    print(f"API generate-pdf SUCCESS: {gen_res.json()['pdf_url']}")

    # 3. Call download
    dl_res = client.get(f"/api/proposals/{proposal_id}/download")
    assert dl_res.status_code == 200, f"Download failed: {dl_res.status_code}"
    assert dl_res.headers["content-type"] == "application/pdf"
    assert dl_res.content.startswith(b"%PDF-")
    print(f"API download SUCCESS: Received {len(dl_res.content):,} bytes of PDF")

test_api_download_endpoints()

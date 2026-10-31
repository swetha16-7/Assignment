import sys
import os
import io
import asyncio
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import SessionLocal
from app.models.proposal import Proposal

client = TestClient(app)


def test_full_integration_flow():
    print("=" * 60)
    print("PROPOSALCRAFT FULL END-TO-END INTEGRATION AUDIT")
    print("=" * 60)

    # 1. Health Endpoint
    print("\n[STEP 1] Testing /health ...")
    res = client.get("/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    health = res.json()
    assert health["status"] == "healthy"
    print("  -> Service is online and healthy")

    # 2. Template Catalog
    print("\n[STEP 2] Testing /api/templates ...")
    res = client.get("/api/templates")
    assert res.status_code == 200
    templates = res.json()
    assert len(templates) == 3
    print(f"  -> Successfully retrieved 3 templates: {[t['id'] for t in templates]}")

    # 3. Logo Upload
    print("\n[STEP 3] Testing /api/uploads/logo ...")
    dummy_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
    res = client.post(
        "/api/uploads/logo",
        files={"file": ("acme_logo.png", io.BytesIO(dummy_png), "image/png")}
    )
    assert res.status_code == 200, f"Upload failed: {res.text}"
    upload_data = res.json()
    assert "data_uri" in upload_data
    logo_data_uri = upload_data["data_uri"]
    print(f"  -> Uploaded logo: {upload_data['filename']}")

    # 4. Create Proposal with Dynamic Pricing & Logo
    print("\n[STEP 4] Testing POST /api/proposals ...")
    new_proposal_payload = {
        "title": "Autonomous DevOps & Platform Engineering",
        "selected_template": "modern",
        "status": "draft",
        "company_name": "CloudScale Systems",
        "company_logo_url": logo_data_uri,
        "company_address": "400 Pine Street, Seattle, WA",
        "company_email": "hello@cloudscale.com",
        "company_phone": "+1 206-555-0100",
        "company_website": "https://cloudscale.com",
        "client_name": "Marcus Kane",
        "client_company": "Apex Fintech Group",
        "client_email": "m.kane@apexfin.com",
        "client_address": "700 Market St, San Francisco, CA",
        "client_phone": "+1 415-555-0188",
        "project_name": "Zero-Trust Infrastructure Modernization",
        "project_description": "Deploy automated GitOps CI/CD pipelines and Kubernetes infrastructure.",
        "project_objectives": [
            "Enable daily production microservice releases with automated canary rollback",
            "Attain 99.99% service availability"
        ],
        "scope_items": [
            {"title": "Platform Blueprint", "description": "Multi-region AWS VPC landing zone."},
            {"title": "GitOps Delivery", "description": "ArgoCD and Helm pipeline automation."}
        ],
        "deliverables": [
            {"title": "Terraform Modules", "description": "Infrastructure repository with CI tests."}
        ],
        "assumptions": "Apex Fintech will allocate a primary operations liaison.",
        "currency": "USD",
        "currency_symbol": "$",
        "line_items": [
            {"description": "DevOps Architecture Consulting", "quantity": 40, "unit_price": 200.00},
            {"description": "GitOps Pipeline Engineering", "quantity": 80, "unit_price": 175.00}
        ],
        "discount_percentage": 5.0,
        "tax_percentage": 8.0,
        "timeline_phases": [
            {"phase_name": "Phase 1: Architecture", "description": "Cloud blueprint", "duration": "2 Weeks"},
            {"phase_name": "Phase 2: Implementation", "description": "Pipeline deployment", "duration": "3 Weeks"}
        ],
        "terms": [
            {"title": "Payment Terms", "content": "Net 30 days upon milestone completion."}
        ]
    }
    # Pricing expected:
    # 40 * 200 = 8000
    # 80 * 175 = 14000
    # Subtotal = 22000.00
    # Discount 5% = 1100.00
    # Taxable = 20900.00
    # Tax 8% = 1672.00
    # Grand Total = 22572.00
    res = client.post("/api/proposals", json=new_proposal_payload)
    assert res.status_code == 201, f"Create failed: {res.text}"
    created = res.json()
    proposal_id = created["id"]
    assert created["subtotal"] == 22000.00
    assert created["discount_amount"] == 1100.00
    assert created["tax_amount"] == 1672.00
    assert created["grand_total"] == 22572.00
    print(f"  -> Created proposal #{created['proposal_number']} (ID: {proposal_id})")
    print(f"     Subtotal: ${created['subtotal']:,.2f}, Grand Total: ${created['grand_total']:,.2f}")

    # 5. Live HTML Preview
    print("\n[STEP 5] Testing POST /api/proposals/preview-html ...")
    res = client.post("/api/proposals/preview-html", json=new_proposal_payload)
    assert res.status_code == 200
    assert "text/html" in res.headers["content-type"]
    assert "CloudScale Systems" in res.text
    assert "22,572.00" in res.text
    print("  -> Live HTML Preview rendered dynamically matching current form payload")

    # 6. Retrieve Stored Proposal
    print("\n[STEP 6] Testing GET /api/proposals/{id} ...")
    res = client.get(f"/api/proposals/{proposal_id}")
    assert res.status_code == 200
    retrieved = res.json()
    assert retrieved["client_name"] == "Marcus Kane"
    print(f"  -> Proposal successfully retrieved from database")

    # 7. Update Proposal (e.g. switch template & add item)
    print("\n[STEP 7] Testing PUT /api/proposals/{id} ...")
    update_payload = {
        "selected_template": "corporate",
        "status": "draft",
        "discount_percentage": 10.0
    }
    res = client.put(f"/api/proposals/{proposal_id}", json=update_payload)
    assert res.status_code == 200
    updated = res.json()
    assert updated["selected_template"] == "corporate"
    # Recalculated with 10% discount:
    # 22000 - 2200 = 19800; Tax 8% = 1584; Grand Total = 21384
    assert updated["grand_total"] == 21384.00
    print(f"  -> Proposal updated and recalculated: Grand Total now ${updated['grand_total']:,.2f}")

    # 8. Generate PDF with Playwright
    print("\n[STEP 8] Testing POST /api/proposals/{id}/generate-pdf ...")
    res = client.post(f"/api/proposals/{proposal_id}/generate-pdf")
    assert res.status_code == 200, f"Generate PDF failed: {res.text}"
    gen_data = res.json()
    assert gen_data["status"] == "generated"
    print(f"  -> Playwright PDF generated successfully: {gen_data['pdf_url']}")

    # 9. Download PDF
    print("\n[STEP 9] Testing GET /api/proposals/{id}/download ...")
    res = client.get(f"/api/proposals/{proposal_id}/download")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert res.content.startswith(b"%PDF-")
    assert len(res.content) > 10000
    print(f"  -> Successfully downloaded {len(res.content):,} bytes of valid PDF")

    # 10. Dashboard Stats Aggregation
    print("\n[STEP 10] Testing GET /api/proposals/stats ...")
    res = client.get("/api/proposals/stats")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_proposals"] >= 1
    assert stats["generated_pdfs"] >= 1
    assert stats["total_value"] > 0
    print(f"  -> Dashboard stats verified: {stats['total_proposals']} proposals, ${stats['total_value']:,.2f} total value")

    print("\n" + "=" * 60)
    print("FULL INTEGRATION & PERSISTENCE WORKFLOW VERIFIED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    test_full_integration_flow()

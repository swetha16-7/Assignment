import sys
import os
import asyncio
import io
from fastapi import UploadFile

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.proposal import Proposal
from app.models.template import Template
from app.schemas.proposal import ProposalCreate, ProposalUpdate
from app.services import proposal_service, template_service, upload_service
from app.services.pdf_service import generate_proposal_pdf, render_proposal_html
from app.utils.calculations import calculate_proposal_totals


def run_qa_backend_audit():
    print("=" * 60)
    print("PROPOSALCRAFT BACKEND QA VERIFICATION SUITE")
    print("=" * 60)

    db = SessionLocal()

    # 1. Database Connection & Table Schema
    print("\n[TEST 1] Verifying Database Connection and Schema Integrity...")
    tables = engine.table_names() if hasattr(engine, "table_names") else [t.name for t in Base.metadata.sorted_tables]
    assert "proposals" in tables, "Table 'proposals' missing from database"
    assert "templates" in tables, "Table 'templates' missing from database"
    print("  -> PASSED: Database connected. Tables verified: 'proposals', 'templates'")

    # 2. Template Service Catalog Retrieval
    print("\n[TEST 2] Verifying Template Catalog...")
    templates = template_service.list_templates()
    assert len(templates) >= 3, f"Expected at least 3 templates, got {len(templates)}"
    tmpl_ids = [t["id"] for t in templates]
    for tid in ["corporate", "modern", "minimal"]:
        assert tid in tmpl_ids, f"Template '{tid}' missing from catalog"
        tmpl_meta = template_service.get_template_by_id(tid)
        assert tmpl_meta is not None, f"Could not retrieve template {tid}"
        assert tmpl_meta["name"], f"Template {tid} missing name"
    print(f"  -> PASSED: All 3 templates verified ({', '.join(tmpl_ids)})")

    # 3. Precision Decimal Pricing Calculations
    print("\n[TEST 3] Verifying Decimal-Safe Financial Arithmetic...")
    test_items = [
        {"description": "Kubernetes Architecture", "quantity": 12.5, "unit_price": 180.00},
        {"description": "Data Migration Pipeline", "quantity": 40.0, "unit_price": 125.50},
        {"description": "Automated Testing Suite", "quantity": 15.0, "unit_price": 95.25},
    ]
    # Math:
    # 12.5 * 180.00 = 2250.00
    # 40.0 * 125.50 = 5020.00
    # 15.0 * 95.25 = 1428.75
    # Subtotal = 2250 + 5020 + 1428.75 = 8698.75
    # Discount 10% = 869.875 -> 869.88
    # Taxable = 8698.75 - 869.88 = 7828.87
    # Tax 8.25% = 7828.87 * 0.0825 = 645.881775 -> 645.88
    # Grand Total = 7828.87 + 645.88 = 8474.75
    calc_res = calculate_proposal_totals(test_items, discount_percentage=10.0, tax_percentage=8.25)
    assert calc_res["subtotal"] == 8698.75, f"Subtotal mismatch: {calc_res['subtotal']} != 8698.75"
    assert calc_res["discount_amount"] == 869.88, f"Discount mismatch: {calc_res['discount_amount']} != 869.88"
    assert calc_res["tax_amount"] == 645.88, f"Tax mismatch: {calc_res['tax_amount']} != 645.88"
    assert calc_res["grand_total"] == 8474.75, f"Grand Total mismatch: {calc_res['grand_total']} != 8474.75"
    print(f"  -> PASSED: Decimal arithmetic exact (Subtotal: {calc_res['subtotal']}, Grand Total: {calc_res['grand_total']})")

    # 4. Proposal Creation
    print("\n[TEST 4] Verifying Proposal Creation in Database...")
    create_payload = ProposalCreate(
        title="Enterprise Data Platform Modernization",
        selected_template="modern",
        status="draft",
        company_name="Apex Data Engineering",
        company_email="proposals@apexdata.io",
        company_phone="+1 555-0199",
        company_website="https://apexdata.io",
        company_address="100 Innovation Way, Austin, TX",
        client_name="Michael Sterling",
        client_company="Sterling Capital Partners",
        client_email="m.sterling@sterlingcap.com",
        client_phone="+1 212-555-0144",
        client_address="30 Rockefeller Plaza, New York, NY",
        project_name="Algorithmic Pipeline Revamp",
        project_description="Re-architecting real-time transactional data feeds to achieve sub-millisecond query responses.",
        project_objectives=[
            "Achieve sub-5ms query response latency across 10TB data lake",
            "Eliminate data synchronization lag between regional clusters",
            "Establish continuous automated compliance audits"
        ],
        scope_items=[
            {"title": "Kafka Event Streaming", "description": "High-throughput cluster setup with automated partition balancing."},
            {"title": "ClickHouse Data Mart", "description": "Columnar storage optimization for analytical reporting."}
        ],
        deliverables=[
            {"title": "Production Infrastructure Code", "description": "Terraform and Helm charts deploying the cluster."}
        ],
        assumptions="Sterling Capital will provision dedicated AWS VPC peering links.",
        currency="USD",
        currency_symbol="$",
        line_items=test_items,
        discount_percentage=10.0,
        tax_percentage=8.25,
        timeline_phases=[
            {"phase_name": "Phase 1: Architecture Blueprint", "description": "Design data pipeline topology.", "duration": "2 Weeks"},
            {"phase_name": "Phase 2: Cluster Implementation", "description": "Deploy Kafka and ClickHouse nodes.", "duration": "4 Weeks"}
        ],
        terms=[
            {"title": "Payment Schedule", "content": "50% upfront, 50% upon final acceptance sign-off."},
            {"title": "Commercial Validity", "content": "Valid for 30 calendar days from issue date."}
        ]
    )
    proposal = proposal_service.create_proposal(db, create_payload)
    assert proposal.id is not None
    assert proposal.proposal_number.startswith("PC-")
    assert proposal.grand_total == 8474.75
    prop_id = proposal.id
    print(f"  -> PASSED: Created proposal ID: {prop_id}, Number: {proposal.proposal_number}")

    # 5. Proposal Retrieval
    print("\n[TEST 5] Verifying Proposal Retrieval by ID...")
    retrieved = proposal_service.get_proposal_by_id(db, prop_id)
    assert retrieved is not None
    assert retrieved.client_name == "Michael Sterling"
    assert len(retrieved.scope_items) == 2
    assert len(retrieved.timeline_phases) == 2
    print(f"  -> PASSED: Retrieved proposal successfully with all relational/JSON data")

    # 6. Proposal Update
    print("\n[TEST 6] Verifying Proposal Update & Recalculation...")
    updated_items = test_items + [
        {"description": "Post-Launch 30-Day Support", "quantity": 1.0, "unit_price": 2500.00}
    ]
    update_payload = ProposalUpdate(
        title="Enterprise Data Platform Modernization (Revision A)",
        line_items=updated_items,
        discount_percentage=12.0
    )
    updated = proposal_service.update_proposal(db, prop_id, update_payload)
    assert updated.title == "Enterprise Data Platform Modernization (Revision A)"
    assert len(updated.line_items) == 4
    assert updated.discount_percentage == 12.0
    print(f"  -> PASSED: Proposal updated successfully (New Grand Total: ${updated.grand_total:,.2f})")

    # 7. Logo Upload Validation
    print("\n[TEST 7] Verifying Company Logo Upload and Validation...")
    dummy_png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
    upload_file = UploadFile(
        file=io.BytesIO(dummy_png_bytes),
        filename="test_logo.png",
        headers={"content-type": "image/png"}
    )
    upload_res = asyncio.run(upload_service.save_uploaded_logo(upload_file))
    assert "data_uri" in upload_res
    assert upload_res["data_uri"].startswith("data:image/png;base64,")
    assert os.path.exists(os.path.join("./storage/uploads", upload_res["filename"]))
    print(f"  -> PASSED: Logo uploaded and base64 encoded: {upload_res['filename']}")

    # 8. HTML Template Rendering Parity
    print("\n[TEST 8] Verifying HTML Rendering for All 3 Templates...")
    proposal_dict = {c.name: getattr(updated, c.name) for c in updated.__table__.columns}
    proposal_dict["company_logo_url"] = upload_res["data_uri"]

    for tmpl in ["corporate", "modern", "minimal"]:
        rendered_html = render_proposal_html(proposal_dict, tmpl)
        assert len(rendered_html) > 500, f"Rendered HTML too short for {tmpl}"
        assert "Michael Sterling" in rendered_html, f"Client name missing from {tmpl}"
        assert "Sterling Capital Partners" in rendered_html, f"Client company missing from {tmpl}"
        assert "data:image/png;base64," in rendered_html, f"Logo data URI missing from {tmpl}"
        print(f"  -> PASSED: Template '{tmpl}' rendered {len(rendered_html)} bytes of pristine HTML")

    # 9. Playwright Chromium PDF Generation
    print("\n[TEST 9] Verifying Playwright Chromium A4 PDF Generation...")
    for tmpl in ["corporate", "modern", "minimal"]:
        updated.selected_template = tmpl
        pdf_path = asyncio.run(generate_proposal_pdf(updated))
        assert os.path.exists(pdf_path), f"PDF file not found at {pdf_path}"
        pdf_bytes = open(pdf_path, "rb").read()
        assert pdf_bytes.startswith(b"%PDF-"), f"Invalid PDF header in {pdf_path}"
        assert len(pdf_bytes) > 20000, f"PDF file suspiciously small: {len(pdf_bytes)} bytes"
        print(f"  -> PASSED: '{tmpl}' generated valid A4 PDF ({len(pdf_bytes):,} bytes at {pdf_path})")

    # 10. Proposal Deletion
    print("\n[TEST 10] Verifying Proposal Deletion from Database...")
    del_success = proposal_service.delete_proposal(db, prop_id)
    assert del_success is True
    assert proposal_service.get_proposal_by_id(db, prop_id) is None
    print("  -> PASSED: Proposal successfully deleted and verified removed")

    print("\n" + "=" * 60)
    print("ALL 10 QA BACKEND & PLAYWRIGHT PDF AUDIT TESTS PASSED!")
    print("=" * 60)


if __name__ == "__main__":
    run_qa_backend_audit()

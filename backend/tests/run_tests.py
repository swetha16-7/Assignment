import sys
import os
import asyncio

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tests.test_api import (
    test_health_check,
    test_templates_catalog,
    test_create_and_calculate_proposal,
    test_preview_html_endpoint,
    test_generate_pdf_playwright,
    test_generate_pdf_all_templates,
)


def run_all():
    print("=== RUNNING PROPOSALCRAFT TEST SUITE ===", flush=True)
    
    print("Testing /health ...", flush=True)
    test_health_check()
    print("PASSED: /health", flush=True)

    print("Testing /api/templates ...", flush=True)
    test_templates_catalog()
    print("PASSED: /api/templates", flush=True)

    print("Testing proposal creation & exact decimal calculations ...", flush=True)
    test_create_and_calculate_proposal()
    print("PASSED: proposal creation & decimal calculations", flush=True)

    print("Testing /api/proposals/preview-html ...", flush=True)
    test_preview_html_endpoint()
    print("PASSED: preview-html", flush=True)

    print("Testing Playwright Chromium PDF generation (modern) ...", flush=True)
    asyncio.run(test_generate_pdf_playwright())
    print("PASSED: Playwright PDF generation (modern)", flush=True)

    print("Testing Playwright PDF generation for all 3 templates (corporate, modern, minimal) ...", flush=True)
    asyncio.run(test_generate_pdf_all_templates())
    print("PASSED: All 3 templates generated pristine PDFs!", flush=True)

    print("\nALL BACKEND & PDF TESTS PASSED SUCCESSFULLY!", flush=True)


if __name__ == "__main__":
    run_all()

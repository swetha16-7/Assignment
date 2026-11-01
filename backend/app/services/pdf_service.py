import os
import re
import json
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, select_autoescape
from playwright.async_api import async_playwright
from app.config import settings
from app.models.proposal import Proposal
from app.utils.calculations import calculate_proposal_totals

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"])
)


def safe_json_list(val) -> list:
    """Ensures input is converted to a python list, parsing JSON strings if necessary."""
    if val is None:
        return []
    if isinstance(val, list):
        return val
    if isinstance(val, str):
        val_str = val.strip()
        if not val_str:
            return []
        try:
            parsed = json.loads(val_str)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            return []
    return []


def normalize_proposal_dict(proposal_data: dict) -> dict:
    """Ensure all required fields exist for safe template rendering."""
    data = dict(proposal_data)
    
    # Ensure list types (handles strings from SQLite or JSON payloads)
    line_items = safe_json_list(data.get("line_items"))
    disc = data.get("discount_percentage") or 0.0
    tax = data.get("tax_percentage") or 0.0
    totals = calculate_proposal_totals(line_items, disc, tax)

    data["line_items"] = totals["line_items"]
    data["subtotal"] = totals["subtotal"]
    data["discount_amount"] = totals["discount_amount"]
    data["tax_amount"] = totals["tax_amount"]
    data["grand_total"] = totals["grand_total"]

    data["project_objectives"] = safe_json_list(data.get("project_objectives"))
    data["scope_items"] = safe_json_list(data.get("scope_items"))
    data["deliverables"] = safe_json_list(data.get("deliverables"))
    data["timeline_phases"] = safe_json_list(data.get("timeline_phases"))
    data["terms"] = safe_json_list(data.get("terms"))

    if "currency_symbol" not in data or not data["currency_symbol"]:
        data["currency_symbol"] = "$"

    if "proposal_number" not in data or not data["proposal_number"]:
        data["proposal_number"] = f"PC-{datetime.utcnow().year}-DRAFT"

    if "title" not in data or not data["title"]:
        data["title"] = "Business Proposal"

    # Datetime handling
    if "created_at" not in data or not data["created_at"]:
        data["created_at"] = datetime.utcnow()
    elif isinstance(data["created_at"], str):
        try:
            data["created_at"] = datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
        except Exception:
            data["created_at"] = datetime.utcnow()

    return data


def render_proposal_html(proposal_data: dict, template_id: str = None) -> str:
    norm_data = normalize_proposal_dict(proposal_data)
    tid = (template_id or norm_data.get("selected_template") or "corporate").lower()

    template_file_map = {
        "corporate": "corporate/proposal.html",
        "modern": "modern/proposal.html",
        "minimal": "minimal/proposal.html",
    }
    template_path = template_file_map.get(tid, "corporate/proposal.html")

    jinja_template = jinja_env.get_template(template_path)
    return jinja_template.render(proposal=norm_data)


async def generate_proposal_pdf(proposal: Proposal) -> str:
    """
    Renders the proposal with its chosen template into HTML and converts to A4 PDF using Playwright Chromium.
    Always creates output directories and outputs an absolute path.
    """
    os.makedirs(settings.PDF_OUTPUT_DIR, exist_ok=True)

    proposal_dict = {c.name: getattr(proposal, c.name) for c in proposal.__table__.columns}
    html_content = render_proposal_html(proposal_dict, proposal.selected_template)

    # Sanitize proposal number for filename
    safe_number = re.sub(r"[^a-zA-Z0-9_\-]", "_", proposal.proposal_number or "proposal")
    filename = f"{safe_number}_{proposal.selected_template}.pdf"
    pdf_path = os.path.abspath(os.path.join(settings.PDF_OUTPUT_DIR, filename))

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        )
        context = await browser.new_context()
        page = await context.new_page()

        # Load rendered HTML with load event and fallback
        try:
            await page.set_content(html_content, wait_until="load", timeout=15000)
        except Exception:
            await page.set_content(html_content, wait_until="domcontentloaded", timeout=15000)

        # Generate PDF with A4 specification
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            prefer_css_page_size=True,
            margin={"top": "0mm", "right": "0mm", "bottom": "0mm", "left": "0mm"}
        )

        await context.close()
        await browser.close()

    return pdf_path

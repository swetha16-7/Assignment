from typing import List, Dict, Any, Optional

TEMPLATES_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "corporate",
        "name": "Corporate Classic",
        "tagline": "Authoritative & Formal Enterprise Proposal",
        "description": "Structured layout featuring deep navy accents, serif/sans corporate typography, formal executive cover page, bordered tables, and institutional page headers and footers.",
        "category": "Enterprise & Corporate",
        "primary_color": "#0f2942",
        "accent_color": "#1e3a5f",
        "badge": "Enterprise Ready",
        "features": [
            "Formal corporate cover page with security & date stamping",
            "Structured grid layout with section hierarchy",
            "Elegant bordered pricing breakdown table",
            "Formal signatory & acceptance block"
        ]
    },
    {
        "id": "modern",
        "name": "Modern Edge",
        "tagline": "Contemporary & High-Impact Tech Proposal",
        "description": "Vibrant sapphire blue accents, modern geometric cover page, pill-style metric badges, card-style objective callouts, and clean striped pricing layout.",
        "category": "Tech & Startups",
        "primary_color": "#2563eb",
        "accent_color": "#4f46e5",
        "badge": "Popular",
        "features": [
            "Split hero cover design with modern typography",
            "Highlighted cards for objectives & deliverables",
            "Contemporary zebra-striped pricing table with total callout",
            "Sleek milestone timeline cards"
        ]
    },
    {
        "id": "minimal",
        "name": "Minimal Professional",
        "tagline": "Sophisticated Whitespace & Clean Elegance",
        "description": "Architectural simplicity with neutral slate tones, airy margins, high typographic contrast, hairline divider lines, and uncluttered tables.",
        "category": "Consulting & Advisory",
        "primary_color": "#111827",
        "accent_color": "#64748b",
        "badge": "Minimalist",
        "features": [
            "Crisp editorial typography with generous whitespace",
            "Hairline dividers with understated elegance",
            "Open, distraction-free pricing schedule",
            "Minimalist acceptance and signature block"
        ]
    }
]


def list_templates() -> List[Dict[str, Any]]:
    return TEMPLATES_CATALOG


def get_template_by_id(template_id: str) -> Optional[Dict[str, Any]]:
    for t in TEMPLATES_CATALOG:
        if t["id"] == template_id:
            return t
    return None

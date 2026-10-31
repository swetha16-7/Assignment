from typing import List, Dict, Any, Optional

TEMPLATES_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "corporate",
        "name": "Executive Elite",
        "tagline": "Authoritative & Formal Enterprise Consulting",
        "description": "Sophisticated consulting proposal with deep navy and muted gold accents, formal executive cover page, structured numerical hierarchy, and comprehensive financial breakdown.",
        "category": "Enterprise & Advisory",
        "primary_color": "#0b1f3a",
        "accent_color": "#c5a059",
        "badge": "Enterprise Elite",
        "features": [
            "Formal luxury cover page with security reference & date stamp",
            "Executive summary with highlighted strategic thesis card",
            "Bordered workstream scope & deliverables matrix",
            "Muted gold accented financial breakdown & signatory block"
        ]
    },
    {
        "id": "modern",
        "name": "Modern Innovation",
        "tagline": "Contemporary & High-Impact Tech Agency",
        "description": "Vibrant sapphire blue and indigo palette with modern geometric layout, card-style objective blocks, structured deliverables, and high-impact total investment callouts.",
        "category": "Tech & Digital Agency",
        "primary_color": "#2563eb",
        "accent_color": "#4f46e5",
        "badge": "High Growth",
        "features": [
            "Visually striking cover with gradient accent bar & metadata cards",
            "Attractive visual blocks for business goals & deliverables",
            "Zebra-striped pricing table with standout investment card",
            "Contemporary roadmap timeline with duration badges"
        ]
    },
    {
        "id": "minimal",
        "name": "Minimal Signature",
        "tagline": "Sophisticated Whitespace & Editorial Clarity",
        "description": "Architectural simplicity with pure white, deep charcoal, and warm stone tones. Generous whitespace, refined hairline dividers, and distraction-free financial schedules.",
        "category": "Consulting & Strategy",
        "primary_color": "#18181b",
        "accent_color": "#71717a",
        "badge": "Minimalist",
        "features": [
            "Crisp editorial typography with generous breathing room",
            "Hairline dividers with understated architectural elegance",
            "Open, distraction-free commercial schedule",
            "Minimalist acceptance lines and clean signatory layout"
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

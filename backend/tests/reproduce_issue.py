import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pdf_service import normalize_proposal_dict

# Case 1: line_items passed as JSON string
data_string = {
    "title": "Test Title",
    "line_items": '[{"description": "Design consulting", "quantity": 10, "unit_price": 100}]',
    "project_objectives": '["Launch Q1", "Modernize Cloud"]',
    "scope_items": '[{"title": "Scope 1", "description": "Desc 1"}]',
    "deliverables": '[{"title": "Deliv 1", "description": "Desc 1"}]',
    "timeline_phases": '[{"phase_name": "Phase 1", "duration": "2 weeks"}]',
    "terms": '[{"title": "Term 1", "content": "Content 1"}]'
}

print("Testing Case 1: JSON strings for list fields...")
try:
    normalized = normalize_proposal_dict(data_string)
    print("Case 1 SUCCESS! Line items count:", len(normalized["line_items"]))
    print("Project objectives count:", len(normalized["project_objectives"]))
except Exception as e:
    print("Case 1 CRASHED with:", type(e).__name__, ":", e)

# Case 2: None or empty fields
data_none = {
    "title": None,
    "proposal_number": None,
    "line_items": None,
    "discount_percentage": None,
    "tax_percentage": None,
    "project_objectives": None,
    "scope_items": None,
    "deliverables": None,
    "timeline_phases": None,
    "terms": None,
    "created_at": None
}

print("\nTesting Case 2: None fields...")
try:
    normalized = normalize_proposal_dict(data_none)
    print("Case 2 SUCCESS! Line items count:", len(normalized["line_items"]))
except Exception as e:
    print("Case 2 CRASHED with:", type(e).__name__, ":", e)

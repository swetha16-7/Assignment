import json
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict, Any, Tuple


def to_decimal(val: Any) -> Decimal:
    if val is None or val == "":
        return Decimal("0.00")
    try:
        return Decimal(str(val))
    except Exception:
        return Decimal("0.00")


def round_curr(val: Decimal) -> Decimal:
    return val.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_proposal_totals(
    line_items: Any,
    discount_percentage: float = 0.0,
    tax_percentage: float = 0.0
) -> Dict[str, Any]:
    """
    Computes exact line totals, subtotal, discount, tax, and grand total using safe decimal arithmetic.
    Safely parses JSON strings if line_items was stringified.
    """
    items_list = []
    if isinstance(line_items, list):
        items_list = line_items
    elif isinstance(line_items, str):
        try:
            parsed = json.loads(line_items)
            if isinstance(parsed, list):
                items_list = parsed
        except Exception:
            items_list = []

    processed_items = []
    subtotal = Decimal("0.00")

    for item in items_list:
        if not isinstance(item, dict):
            continue
        desc = item.get("description", "")
        qty = to_decimal(item.get("quantity", 1))
        if qty < Decimal("0"):
            qty = Decimal("0")
        unit_price = to_decimal(item.get("unit_price", 0))
        if unit_price < Decimal("0"):
            unit_price = Decimal("0")

        line_total = round_curr(qty * unit_price)
        subtotal += line_total

        processed_items.append({
            "id": item.get("id", ""),
            "description": desc,
            "quantity": float(qty),
            "unit_price": float(unit_price),
            "total": float(line_total)
        })

    subtotal = round_curr(subtotal)
    disc_pct = to_decimal(discount_percentage)
    if disc_pct < Decimal("0"):
        disc_pct = Decimal("0")
    elif disc_pct > Decimal("100"):
        disc_pct = Decimal("100")

    discount_amount = round_curr(subtotal * (disc_pct / Decimal("100")))
    amount_after_discount = max(Decimal("0.00"), subtotal - discount_amount)

    tax_pct = to_decimal(tax_percentage)
    if tax_pct < Decimal("0"):
        tax_pct = Decimal("0")

    tax_amount = round_curr(amount_after_discount * (tax_pct / Decimal("100")))
    grand_total = round_curr(amount_after_discount + tax_amount)

    return {
        "line_items": processed_items,
        "subtotal": float(subtotal),
        "discount_percentage": float(disc_pct),
        "discount_amount": float(discount_amount),
        "tax_percentage": float(tax_pct),
        "tax_amount": float(tax_amount),
        "grand_total": float(grand_total)
    }


def format_currency_string(amount: float, symbol: str = "$") -> str:
    dec = to_decimal(amount)
    return f"{symbol}{dec:,.2f}"

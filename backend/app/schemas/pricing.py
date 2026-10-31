from pydantic import BaseModel, Field
from typing import Optional


class LineItem(BaseModel):
    id: Optional[str] = None
    description: str = Field(..., min_length=1, description="Line item description")
    quantity: float = Field(default=1.0, ge=0.0, description="Quantity of items or hours")
    unit_price: float = Field(default=0.0, ge=0.0, description="Price per unit")
    total: Optional[float] = Field(default=0.0, ge=0.0, description="Total line cost")


class PricingBreakdown(BaseModel):
    currency: str = Field(default="USD", description="Currency code, e.g. USD, EUR, GBP")
    currency_symbol: str = Field(default="$", description="Currency symbol, e.g. $, €, £")
    subtotal: float = Field(default=0.0, ge=0.0)
    discount_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    discount_amount: float = Field(default=0.0, ge=0.0)
    tax_percentage: float = Field(default=0.0, ge=0.0)
    tax_amount: float = Field(default=0.0, ge=0.0)
    grand_total: float = Field(default=0.0, ge=0.0)

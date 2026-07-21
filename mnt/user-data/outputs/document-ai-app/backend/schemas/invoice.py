from pydantic import BaseModel
from typing import Optional


class LineItem(BaseModel):
    description: str
    quantity: Optional[float] = None
    price: Optional[float] = None
    unit: Optional[str] = None


class InvoiceSchema(BaseModel):
    vendor: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    currency: Optional[str] = None
    line_items: list[LineItem] = []

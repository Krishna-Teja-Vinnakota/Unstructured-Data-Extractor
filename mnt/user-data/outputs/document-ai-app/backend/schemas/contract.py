from pydantic import BaseModel
from typing import Optional


class Party(BaseModel):
    name: str
    role: Optional[str] = None
    address: Optional[str] = None


class ContractSchema(BaseModel):
    parties: list[Party] = []
    effective_date: Optional[str] = None
    expiration_date: Optional[str] = None
    termination_clause: Optional[str] = None
    payment_terms: Optional[str] = None
    governing_law: Optional[str] = None
    key_obligations: list[str] = []

from pydantic import BaseModel
from typing import Optional


class TableSchema(BaseModel):
    title: Optional[str] = None
    columns: list[str] = []
    rows: list[list[str]] = []
    summary: Optional[str] = None

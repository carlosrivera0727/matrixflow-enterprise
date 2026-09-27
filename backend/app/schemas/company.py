from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    tax_id: str


class CompanyResponse(BaseModel):
    id: int
    name: str
    tax_id: str
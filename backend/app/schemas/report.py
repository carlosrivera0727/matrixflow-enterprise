from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: int
    name: str
    description: str
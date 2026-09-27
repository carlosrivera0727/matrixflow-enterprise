from pydantic import BaseModel


class BranchCreate(BaseModel):
    name: str
    address: str


class BranchResponse(BaseModel):
    id: int
    name: str
    address: str
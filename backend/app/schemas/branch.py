from pydantic import Field

from app.schemas.common import APIModel, CompanyStatus, PositiveId, UpdateModel


class BranchBase(APIModel):
    company_id: PositiveId
    name: str = Field(min_length=3, max_length=150)
    city: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=5, max_length=255)
    status: CompanyStatus = CompanyStatus.ACTIVE


class BranchCreate(BranchBase):
    pass


class BranchUpdate(UpdateModel):
    company_id: PositiveId | None = None
    name: str | None = Field(default=None, min_length=3, max_length=150)
    city: str | None = Field(default=None, min_length=2, max_length=100)
    address: str | None = Field(default=None, min_length=5, max_length=255)
    status: CompanyStatus | None = None


class BranchResponse(BranchBase):
    id: PositiveId

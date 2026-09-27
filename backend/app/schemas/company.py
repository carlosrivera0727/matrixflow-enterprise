from pydantic import EmailStr, Field

from app.schemas.common import APIModel, CompanyStatus, PositiveId, UpdateModel


class CompanyBase(APIModel):
    name: str = Field(min_length=3, max_length=150)
    tax_id: str = Field(pattern=r"^\d{11}$")
    sector: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(
        min_length=7,
        max_length=25,
        pattern=r"^[0-9+()\-\s]+$",
    )
    address: str = Field(min_length=5, max_length=255)
    status: CompanyStatus = CompanyStatus.ACTIVE


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(UpdateModel):
    name: str | None = Field(default=None, min_length=3, max_length=150)
    tax_id: str | None = Field(default=None, pattern=r"^\d{11}$")
    sector: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    phone: str | None = Field(
        default=None,
        min_length=7,
        max_length=25,
        pattern=r"^[0-9+()\-\s]+$",
    )
    address: str | None = Field(default=None, min_length=5, max_length=255)
    status: CompanyStatus | None = None


class CompanyResponse(CompanyBase):
    id: PositiveId

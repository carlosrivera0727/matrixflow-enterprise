from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models.company import Company
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.services.base import BaseService


class CompanyService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.companies = CompanyRepository(session)

    def list(self, *, offset: int = 0, limit: int = 100) -> list[CompanyResponse]:
        return [
            CompanyResponse.model_validate(company)
            for company in self.companies.list(offset=offset, limit=limit)
        ]

    def get(self, company_id: int) -> CompanyResponse:
        return CompanyResponse.model_validate(self._get_company(company_id))

    def create(self, data: CompanyCreate) -> CompanyResponse:
        self._validate_unique(data.tax_id, str(data.email), data.name)
        company = Company(**data.model_dump(mode="json"))
        with self.transaction():
            self.companies.add(company)
        return CompanyResponse.model_validate(company)

    def update(self, company_id: int, data: CompanyUpdate) -> CompanyResponse:
        company = self._get_company(company_id)
        values = data.model_dump(exclude_unset=True, mode="json")
        self._validate_unique(
            values.get("tax_id", company.tax_id),
            values.get("email", company.email),
            values.get("name", company.name),
            current_id=company.id,
        )
        with self.transaction():
            self.companies.update(company, values)
        return CompanyResponse.model_validate(company)

    def delete(self, company_id: int) -> None:
        company = self._get_company(company_id)
        if self.companies.has_branches(company_id):
            raise ResourceConflictError(
                "No se puede eliminar una empresa que tiene sucursales relacionadas."
            )
        with self.transaction():
            self.companies.delete(company)

    def _get_company(self, company_id: int) -> Company:
        company = self.companies.get_by_id(company_id)
        if company is None:
            raise ResourceNotFoundError("La empresa solicitada no existe.")
        return company

    def _validate_unique(
        self,
        tax_id: str,
        email: str,
        name: str,
        *,
        current_id: int | None = None,
    ) -> None:
        candidates = (
            (self.companies.get_by_tax_id(tax_id), "Ya existe una empresa con ese RUC."),
            (self.companies.get_by_email(email), "Ya existe una empresa con ese correo."),
            (self.companies.get_by_name(name), "Ya existe una empresa con ese nombre."),
        )
        for existing, message in candidates:
            if existing is not None and existing.id != current_id:
                raise ResourceConflictError(message)

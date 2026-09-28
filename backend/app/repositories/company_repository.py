from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.models.branch import Branch
from app.models.company import Company
from app.repositories.base import BaseRepository


class CompanyRepository(BaseRepository[Company]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Company)

    def get_by_tax_id(self, tax_id: str) -> Company | None:
        statement = select(Company).where(Company.tax_id == tax_id)
        return self.session.scalar(statement)

    def get_by_email(self, email: str) -> Company | None:
        statement = select(Company).where(Company.email == email)
        return self.session.scalar(statement)

    def get_by_name(self, name: str) -> Company | None:
        statement = select(Company).where(Company.name == name)
        return self.session.scalar(statement)

    def has_branches(self, company_id: int) -> bool:
        statement = select(
            exists().where(Branch.company_id == company_id)
        )
        return bool(self.session.scalar(statement))

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.company import Company
from app.repositories.base import BaseRepository


class CompanyRepository(BaseRepository[Company]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Company)

    def get_by_tax_id(self, tax_id: str) -> Company | None:
        statement = select(Company).where(Company.tax_id == tax_id)
        return self.session.scalar(statement)

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.branch import Branch
from app.repositories.base import BaseRepository


class BranchRepository(BaseRepository[Branch]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Branch)

    def list_by_company(self, company_id: int) -> Sequence[Branch]:
        statement = select(Branch).where(Branch.company_id == company_id)
        return self.session.scalars(statement).all()

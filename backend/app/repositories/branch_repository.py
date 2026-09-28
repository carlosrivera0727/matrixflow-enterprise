from collections.abc import Sequence

from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.models.branch import Branch
from app.models.inventory import Inventory
from app.models.sale import Sale
from app.models.target import Target
from app.repositories.base import BaseRepository


class BranchRepository(BaseRepository[Branch]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Branch)

    def list_by_company(self, company_id: int) -> Sequence[Branch]:
        statement = select(Branch).where(Branch.company_id == company_id)
        return self.session.scalars(statement).all()

    def has_dependencies(self, branch_id: int) -> bool:
        statements = (
            select(exists().where(Sale.branch_id == branch_id)),
            select(exists().where(Inventory.branch_id == branch_id)),
            select(exists().where(Target.branch_id == branch_id)),
        )
        return any(bool(self.session.scalar(statement)) for statement in statements)

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.repositories.base import BaseRepository


class SaleRepository(BaseRepository[Sale]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Sale)

    def list_by_branch(self, branch_id: int) -> Sequence[Sale]:
        statement = (
            select(Sale)
            .where(Sale.branch_id == branch_id)
            .order_by(Sale.sale_date.desc())
        )
        return self.session.scalars(statement).all()

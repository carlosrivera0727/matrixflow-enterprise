from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.sale import Sale
from app.repositories.base import BaseRepository


class SaleRepository(BaseRepository[Sale]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Sale)

    def list_by_branch(self, branch_id: int) -> Sequence[Sale]:
        statement = (
            select(Sale)
            .options(selectinload(Sale.details))
            .where(Sale.branch_id == branch_id)
            .order_by(Sale.sale_date.desc())
        )
        return self.session.scalars(statement).all()

    def get_by_id(self, entity_id: int) -> Sale | None:
        statement = (
            select(Sale)
            .options(selectinload(Sale.details))
            .where(Sale.id == entity_id)
        )
        return self.session.scalar(statement)

    def list(self, *, offset: int = 0, limit: int = 100) -> Sequence[Sale]:
        statement = (
            select(Sale)
            .options(selectinload(Sale.details))
            .order_by(Sale.sale_date.desc())
            .offset(offset)
            .limit(limit)
        )
        return self.session.scalars(statement).all()

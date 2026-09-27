from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Product)

    def list_by_category(self, category_id: int) -> Sequence[Product]:
        statement = select(Product).where(Product.category_id == category_id)
        return self.session.scalars(statement).all()

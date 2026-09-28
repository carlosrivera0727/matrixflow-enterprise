from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.category import Category
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Product)

    def list_by_category(self, category_id: int) -> Sequence[Product]:
        statement = select(Product).where(Product.category_id == category_id)
        return self.session.scalars(statement).all()

    def get_by_sku(self, sku: str) -> Product | None:
        statement = select(Product).where(Product.sku == sku)
        return self.session.scalar(statement)


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Category)

    def get_by_name(self, name: str) -> Category | None:
        statement = select(Category).where(Category.name == name)
        return self.session.scalar(statement)

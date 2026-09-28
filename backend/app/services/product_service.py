from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models.category import Category
from app.models.product import Product
from app.repositories.product_repository import CategoryRepository, ProductRepository
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.base import BaseService


class ProductService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.products = ProductRepository(session)
        self.categories = CategoryRepository(session)

    def list(self, *, offset: int = 0, limit: int = 100) -> list[ProductResponse]:
        return [
            ProductResponse.model_validate(product)
            for product in self.products.list(offset=offset, limit=limit)
        ]

    def get(self, product_id: int) -> ProductResponse:
        return ProductResponse.model_validate(self._get_product(product_id))

    def create(self, data: ProductCreate) -> ProductResponse:
        if self.products.get_by_sku(data.sku) is not None:
            raise ResourceConflictError("Ya existe un producto con ese SKU.")

        values = data.model_dump(mode="json")
        category_name = values.pop("category")
        with self.transaction():
            category = self._get_or_create_category(category_name)
            product = Product(**values, category_record=category)
            self.products.add(product)
        return ProductResponse.model_validate(product)

    def update(self, product_id: int, data: ProductUpdate) -> ProductResponse:
        product = self._get_product(product_id)
        values = data.model_dump(exclude_unset=True, mode="json")
        sku = values.get("sku")
        if sku is not None:
            existing = self.products.get_by_sku(sku)
            if existing is not None and existing.id != product.id:
                raise ResourceConflictError("Ya existe un producto con ese SKU.")

        category_name = values.pop("category", None)
        with self.transaction():
            if category_name is not None:
                product.category_record = self._get_or_create_category(category_name)
            self.products.update(product, values)
        return ProductResponse.model_validate(product)

    def delete(self, product_id: int) -> None:
        product = self._get_product(product_id)
        if self.products.has_dependencies(product_id):
            raise ResourceConflictError(
                "No se puede eliminar un producto con inventario o ventas relacionadas."
            )
        with self.transaction():
            self.products.delete(product)

    def _get_product(self, product_id: int) -> Product:
        product = self.products.get_by_id(product_id)
        if product is None:
            raise ResourceNotFoundError("El producto solicitado no existe.")
        return product

    def _get_or_create_category(self, name: str) -> Category:
        category = self.categories.get_by_name(name)
        if category is None:
            category = self.categories.add(Category(name=name))
        return category

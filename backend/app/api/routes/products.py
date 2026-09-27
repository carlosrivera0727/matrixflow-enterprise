from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import AdministratorUser, BusinessUser, DatabaseSession
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.get("", response_model=list[ProductResponse])
def get_products(
    session: DatabaseSession,
    _current_user: BusinessUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[ProductResponse]:
    return ProductService(session).list(offset=offset, limit=limit)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> ProductResponse:
    return ProductService(session).create(data)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> ProductResponse:
    return ProductService(session).get(product_id)


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductUpdate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> ProductResponse:
    return ProductService(session).update(product_id, data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> Response:
    ProductService(session).delete(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

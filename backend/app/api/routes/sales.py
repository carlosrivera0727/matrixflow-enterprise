from fastapi import APIRouter, Query, status

from app.api.dependencies import BusinessUser, DatabaseSession
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sale_service import SaleService

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


@router.get("", response_model=list[SaleResponse])
def get_sales(
    session: DatabaseSession,
    _current_user: BusinessUser,
    branch_id: int | None = Query(default=None, gt=0, alias="branchId"),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[SaleResponse]:
    return SaleService(session).list(
        branch_id=branch_id,
        offset=offset,
        limit=limit,
    )


@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(
    data: SaleCreate,
    session: DatabaseSession,
    current_user: BusinessUser,
) -> SaleResponse:
    return SaleService(session).create(data, user=current_user.name)


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(
    sale_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> SaleResponse:
    return SaleService(session).get(sale_id)

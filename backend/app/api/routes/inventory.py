from fastapi import APIRouter, Query, status

from app.api.dependencies import BusinessUser, DatabaseSession
from app.schemas.inventory import (
    InventoryAdjustment,
    InventoryCreate,
    InventoryMovementResponse,
    InventoryResponse,
)
from app.services.inventory_service import InventoryService

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)


@router.get("", response_model=list[InventoryResponse])
def get_inventory(
    session: DatabaseSession,
    _current_user: BusinessUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[InventoryResponse]:
    return InventoryService(session).list(offset=offset, limit=limit)


@router.post("", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory(
    data: InventoryCreate,
    session: DatabaseSession,
    current_user: BusinessUser,
) -> InventoryResponse:
    return InventoryService(session).create(data, user=current_user.name)


@router.get("/movements", response_model=list[InventoryMovementResponse])
def get_inventory_movements(
    session: DatabaseSession,
    _current_user: BusinessUser,
    inventory_id: int | None = Query(default=None, gt=0, alias="inventoryId"),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[InventoryMovementResponse]:
    return InventoryService(session).list_movements(
        inventory_id=inventory_id,
        offset=offset,
        limit=limit,
    )


@router.get("/{inventory_id}", response_model=InventoryResponse)
def get_inventory_item(
    inventory_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> InventoryResponse:
    return InventoryService(session).get(inventory_id)


@router.patch("/{inventory_id}", response_model=InventoryResponse)
def adjust_inventory(
    inventory_id: int,
    data: InventoryAdjustment,
    session: DatabaseSession,
    current_user: BusinessUser,
) -> InventoryResponse:
    return InventoryService(session).adjust(
        inventory_id,
        data,
        user=current_user.name,
    )

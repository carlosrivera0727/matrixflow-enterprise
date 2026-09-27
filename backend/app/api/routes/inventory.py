from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/inventory",
    tags=["Inventory"],
)


@router.get("/")
def get_inventory():
    return {
        "status": "ok",
        "message": "Endpoint de inventario preparado",
    }
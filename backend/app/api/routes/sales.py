from fastapi import APIRouter

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


@router.get("")
def get_sales():
    return {
        "status": "ok",
        "message": "Endpoint de ventas preparado",
    }

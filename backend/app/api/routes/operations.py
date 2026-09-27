from fastapi import APIRouter

router = APIRouter(
    prefix="/operations",
    tags=["Operations"],
)


@router.post("")
def create_operation():
    return {
        "status": "ok",
        "message": "Endpoint de operaciones preparado",
    }


@router.get("")
def get_operations():
    return {
        "status": "ok",
        "message": "Historial de operaciones preparado",
    }

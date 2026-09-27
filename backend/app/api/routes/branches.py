from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/branches",
    tags=["Branches"],
)


@router.get("/")
def get_branches():
    return {
        "status": "ok",
        "message": "Endpoint de sucursales preparado",
    }

from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports"],
)


@router.get("/")
def get_reports():
    return {
        "status": "ok",
        "message": "Endpoint de reportes preparado",
    }
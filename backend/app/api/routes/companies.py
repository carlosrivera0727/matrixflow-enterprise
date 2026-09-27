from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/companies",
    tags=["Companies"],
)


@router.get("/")
def get_companies():
    return {
        "status": "ok",
        "message": "Endpoint de empresas preparado",
    }
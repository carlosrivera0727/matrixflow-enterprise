from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/matrices",
    tags=["Matrices"],
)


@router.post("/")
def create_matrix():
    return {
        "status": "ok",
        "message": "Endpoint de matrices preparado",
    }
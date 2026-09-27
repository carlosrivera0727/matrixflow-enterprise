from fastapi import APIRouter

router = APIRouter(
    prefix="/matrices",
    tags=["Matrices"],
)


@router.post("")
def create_matrix():
    return {
        "status": "ok",
        "message": "Endpoint de matrices preparado",
    }

from fastapi import APIRouter

router = APIRouter(
    prefix="/vectors",
    tags=["Vectors"],
)


@router.post("")
def create_vector():
    return {
        "status": "ok",
        "message": "Endpoint de vectores preparado",
    }

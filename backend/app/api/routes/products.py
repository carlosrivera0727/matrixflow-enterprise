from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
)


@router.get("/")
def get_products():
    return {
        "status": "ok",
        "message": "Endpoint de productos preparado",
    }
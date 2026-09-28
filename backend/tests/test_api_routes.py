import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401 - registers every SQLAlchemy table
from app.core.database import Base, get_db
from app.core.security import create_access_token
from app.main import app
from app.schemas.user import UserCreate
from app.services.user_service import UserService


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
def api_session() -> Session:
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with Session(engine, expire_on_commit=False) as session:
        def override_database():
            yield session

        app.dependency_overrides[get_db] = override_database
        yield session
        app.dependency_overrides.clear()


def authorization_header(
    session: Session,
    *,
    email: str,
    role: str,
) -> dict[str, str]:
    user = UserService(session).create(
        UserCreate(
            name=f"Usuario {role}",
            email=email,
            password="demo123",
            role=role,
        )
    )
    token = create_access_token(
        user_id=user.id,
        email=str(user.email),
        role=user.role,
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_routes_enforce_authentication_and_roles(api_session: Session) -> None:
    analyst_headers = authorization_header(
        api_session,
        email="analista@matrixflow.pe",
        role="Analista",
    )
    read_only_headers = authorization_header(
        api_session,
        email="consulta@matrixflow.pe",
        role="Consulta",
    )

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        anonymous = await client.get("/api/v1/companies")
        forbidden_write = await client.post(
            "/api/v1/companies",
            headers=analyst_headers,
            json={
                "name": "Empresa restringida",
                "taxId": "20601234567",
                "sector": "Tecnología",
                "email": "empresa@matrixflow.pe",
                "phone": "+51 999 555 111",
                "address": "Av. Empresarial 123",
            },
        )
        allowed_report = await client.get(
            "/api/v1/reports",
            headers=read_only_headers,
        )
        forbidden_catalog = await client.get(
            "/api/v1/products",
            headers=read_only_headers,
        )
        pending_engine = await client.post(
            "/api/v1/operations",
            headers=analyst_headers,
            json={
                "category": "Vector",
                "operationType": "Suma",
                "firstId": 1,
                "secondId": 2,
            },
        )

    assert anonymous.status_code == 401
    assert forbidden_write.status_code == 403
    assert allowed_report.status_code == 200
    assert forbidden_catalog.status_code == 403
    assert pending_engine.status_code == 501


@pytest.mark.anyio
async def test_business_endpoints_complete_sale_and_reporting_flow(
    api_session: Session,
) -> None:
    headers = authorization_header(
        api_session,
        email="admin@matrixflow.pe",
        role="Administrador",
    )

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        company = await client.post(
            "/api/v1/companies",
            headers=headers,
            json={
                "name": "MatrixFlow Enterprise S.A.C.",
                "taxId": "20601234567",
                "sector": "Tecnología",
                "email": "contacto@matrixflow.pe",
                "phone": "+51 1 555 0142",
                "address": "Av. Javier Prado 2450, Lima",
            },
        )
        assert company.status_code == 201
        company_body = company.json()
        assert company_body["taxId"] == "20601234567"

        duplicate = await client.post(
            "/api/v1/companies",
            headers=headers,
            json={
                "name": company_body["name"],
                "taxId": company_body["taxId"],
                "sector": company_body["sector"],
                "email": company_body["email"],
                "phone": company_body["phone"],
                "address": company_body["address"],
                "status": company_body["status"],
            },
        )
        assert duplicate.status_code == 409
        assert duplicate.json()["code"] == "resource_conflict"

        branch = await client.post(
            "/api/v1/branches",
            headers=headers,
            json={
                "companyId": company_body["id"],
                "name": "Sucursal Lima",
                "city": "Lima",
                "address": "Av. Arequipa 1250",
            },
        )
        assert branch.status_code == 201

        product = await client.post(
            "/api/v1/products",
            headers=headers,
            json={
                "sku": "LAP-001",
                "name": "Laptop empresarial",
                "category": "Equipos",
                "price": 2500,
                "minimumStock": 2,
            },
        )
        assert product.status_code == 201

        inventory = await client.post(
            "/api/v1/inventory",
            headers=headers,
            json={
                "branchId": branch.json()["id"],
                "productId": product.json()["id"],
                "stock": 10,
            },
        )
        assert inventory.status_code == 201

        sale = await client.post(
            "/api/v1/sales",
            headers=headers,
            json={
                "branchId": branch.json()["id"],
                "productId": product.json()["id"],
                "quantity": 3,
            },
        )
        assert sale.status_code == 201
        assert sale.json()["total"] == 7500

        inventory_after_sale = await client.get(
            f"/api/v1/inventory/{inventory.json()['id']}",
            headers=headers,
        )
        movements = await client.get(
            "/api/v1/inventory/movements",
            headers=headers,
            params={"inventoryId": inventory.json()["id"]},
        )
        report = await client.get("/api/v1/reports", headers=headers)
        missing = await client.get("/api/v1/products/999", headers=headers)

    assert inventory_after_sale.json()["stock"] == 7
    assert movements.json()[0]["type"] == "Salida"
    assert report.json()["totalSales"] == 7500
    assert report.json()["unitsSold"] == 3
    assert missing.status_code == 404
    assert missing.json()["code"] == "resource_not_found"


@pytest.mark.anyio
async def test_vector_and_matrix_crud_routes(api_session: Session) -> None:
    headers = authorization_header(
        api_session,
        email="analista@matrixflow.pe",
        role="Analista",
    )

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        vector = await client.post(
            "/api/v1/vectors",
            headers=headers,
            json={
                "name": "Vector ventas",
                "description": "Ventas del período",
                "values": [1, 2, 3],
            },
        )
        assert vector.status_code == 201

        updated_vector = await client.patch(
            f"/api/v1/vectors/{vector.json()['id']}",
            headers=headers,
            json={"values": [4, 5, 6]},
        )
        assert updated_vector.json()["values"] == [4, 5, 6]

        matrix = await client.post(
            "/api/v1/matrices",
            headers=headers,
            json={
                "name": "Matriz ventas",
                "description": "Sucursales por producto",
                "values": [[1, 2], [3, 4]],
            },
        )
        assert matrix.status_code == 201
        assert matrix.json()["values"] == [[1, 2], [3, 4]]

        deleted = await client.delete(
            f"/api/v1/vectors/{vector.json()['id']}",
            headers=headers,
        )
        missing = await client.get(
            f"/api/v1/vectors/{vector.json()['id']}",
            headers=headers,
        )

    assert deleted.status_code == 204
    assert deleted.content == b""
    assert missing.status_code == 404

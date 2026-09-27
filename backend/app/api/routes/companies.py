from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import AdministratorUser, BusinessUser, DatabaseSession
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.services.company_service import CompanyService

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.get("", response_model=list[CompanyResponse])
def get_companies(
    session: DatabaseSession,
    _current_user: BusinessUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[CompanyResponse]:
    return CompanyService(session).list(offset=offset, limit=limit)


@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(
    data: CompanyCreate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> CompanyResponse:
    return CompanyService(session).create(data)


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(
    company_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> CompanyResponse:
    return CompanyService(session).get(company_id)


@router.patch("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: int,
    data: CompanyUpdate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> CompanyResponse:
    return CompanyService(session).update(company_id, data)


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(
    company_id: int,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> Response:
    CompanyService(session).delete(company_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

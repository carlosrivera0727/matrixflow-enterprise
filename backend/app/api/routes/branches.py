from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import AdministratorUser, BusinessUser, DatabaseSession
from app.schemas.branch import BranchCreate, BranchResponse, BranchUpdate
from app.services.branch_service import BranchService

router = APIRouter(
    prefix="/branches",
    tags=["Branches"],
)


@router.get("", response_model=list[BranchResponse])
def get_branches(
    session: DatabaseSession,
    _current_user: BusinessUser,
    company_id: int | None = Query(default=None, gt=0, alias="companyId"),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[BranchResponse]:
    return BranchService(session).list(
        company_id=company_id,
        offset=offset,
        limit=limit,
    )


@router.post("", response_model=BranchResponse, status_code=status.HTTP_201_CREATED)
def create_branch(
    data: BranchCreate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> BranchResponse:
    return BranchService(session).create(data)


@router.get("/{branch_id}", response_model=BranchResponse)
def get_branch(
    branch_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> BranchResponse:
    return BranchService(session).get(branch_id)


@router.patch("/{branch_id}", response_model=BranchResponse)
def update_branch(
    branch_id: int,
    data: BranchUpdate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> BranchResponse:
    return BranchService(session).update(branch_id, data)


@router.delete("/{branch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(
    branch_id: int,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> Response:
    BranchService(session).delete(branch_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models.branch import Branch
from app.repositories.branch_repository import BranchRepository
from app.repositories.company_repository import CompanyRepository
from app.schemas.branch import BranchCreate, BranchResponse, BranchUpdate
from app.services.base import BaseService


class BranchService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.branches = BranchRepository(session)
        self.companies = CompanyRepository(session)

    def list(
        self,
        *,
        company_id: int | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[BranchResponse]:
        records = (
            self.branches.list_by_company(company_id)
            if company_id is not None
            else self.branches.list(offset=offset, limit=limit)
        )
        return [BranchResponse.model_validate(branch) for branch in records]

    def get(self, branch_id: int) -> BranchResponse:
        return BranchResponse.model_validate(self._get_branch(branch_id))

    def create(self, data: BranchCreate) -> BranchResponse:
        self._require_company(data.company_id)
        branch = Branch(**data.model_dump(mode="json"))
        with self.transaction():
            self.branches.add(branch)
        return BranchResponse.model_validate(branch)

    def update(self, branch_id: int, data: BranchUpdate) -> BranchResponse:
        branch = self._get_branch(branch_id)
        values = data.model_dump(exclude_unset=True, mode="json")
        if "company_id" in values:
            self._require_company(values["company_id"])
        with self.transaction():
            self.branches.update(branch, values)
        return BranchResponse.model_validate(branch)

    def delete(self, branch_id: int) -> None:
        branch = self._get_branch(branch_id)
        if self.branches.has_dependencies(branch_id):
            raise ResourceConflictError(
                "No se puede eliminar una sucursal con ventas, inventario o metas relacionadas."
            )
        with self.transaction():
            self.branches.delete(branch)

    def _get_branch(self, branch_id: int) -> Branch:
        branch = self.branches.get_by_id(branch_id)
        if branch is None:
            raise ResourceNotFoundError("La sucursal solicitada no existe.")
        return branch

    def _require_company(self, company_id: int) -> None:
        if self.companies.get_by_id(company_id) is None:
            raise ResourceNotFoundError("La empresa indicada no existe.")

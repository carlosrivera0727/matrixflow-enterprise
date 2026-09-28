class ApplicationError(Exception):
    """Base exception for expected application failures."""

    code = "application_error"


class ResourceNotFoundError(ApplicationError):
    code = "resource_not_found"


class ResourceConflictError(ApplicationError):
    code = "resource_conflict"


class PersistenceError(ApplicationError):
    code = "persistence_error"


class AuthenticationError(ApplicationError):
    code = "authentication_error"


class InvalidTokenError(AuthenticationError):
    code = "invalid_token"


class PermissionDeniedError(ApplicationError):
    code = "permission_denied"


class InvalidOperationError(ApplicationError):
    code = "invalid_operation"

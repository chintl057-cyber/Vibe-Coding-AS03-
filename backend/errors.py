import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

DEFAULT_MESSAGES = {
    400: "Please check your request and try again.",
    401: "Your session is invalid or has expired. Please log in again.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource could not be found.",
    405: "This action is not supported.",
    409: "The requested information already exists.",
    422: "Please check the information you entered and try again.",
    429: "Too many requests. Please wait a moment and try again.",
}


def _validation_message(error: RequestValidationError) -> str:
    errors = error.errors()
    if not errors:
        return DEFAULT_MESSAGES[422]

    first_error = errors[0]
    location = [
        str(part).replace("_", " ")
        for part in first_error.get("loc", [])
        if part != "body"
    ]
    field = location[-1] if location else "request"
    message = first_error.get("msg", "is invalid")
    return f"Please check {field}: {message}."


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        error: RequestValidationError,
    ) -> JSONResponse:
        logger.info("Invalid request for %s: %s", request.url.path, error.errors())
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": _validation_message(error)},
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        error: StarletteHTTPException,
    ) -> JSONResponse:
        detail = error.detail if isinstance(error.detail, str) else None
        message = detail or DEFAULT_MESSAGES.get(
            error.status_code,
            "The request could not be completed.",
        )
        return JSONResponse(
            status_code=error.status_code,
            content={"detail": message},
            headers=error.headers,
        )

    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        error: Exception,
    ) -> JSONResponse:
        logger.exception("Unexpected error for %s", request.url.path, exc_info=error)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Something went wrong on our side. Please try again later."
            },
        )

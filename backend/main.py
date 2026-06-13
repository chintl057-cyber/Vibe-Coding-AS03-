from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings
from database import Base, engine
from routes import products, basket, auth
from errors import register_exception_handlers

if settings.environment == "development":
    # Create local development tables automatically. Production deployments should
    # use managed database migrations/SQL instead of doing this on every cold start.
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vibe Coding Backend",
    description="Production-ready backend for grocery price comparison",
    version="1.0.0",
)
register_exception_handlers(app)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(basket.router)
app.include_router(auth.router)

if settings.environment == "development":
    from routes import debug

    app.include_router(debug.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def root():
    return {
        "message": "Vibe Coding Backend",
        "docs": "/docs",
        "health": "/health",
    }

@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    include_in_schema=False,
)
def unknown_api_route(request: Request, path: str):
    return JSONResponse(
        status_code=404,
        content={"detail": f"The API endpoint '{request.url.path}' does not exist."},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

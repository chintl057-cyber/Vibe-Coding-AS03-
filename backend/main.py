from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import Base, engine
from routes import products, basket, auth

if settings.environment == "development":
    # Create local development tables automatically. Production deployments should
    # use managed database migrations/SQL instead of doing this on every cold start.
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vibe Coding Backend",
    description="Production-ready backend for grocery price comparison",
    version="1.0.0",
)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

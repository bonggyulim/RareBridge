from fastapi import FastAPI
from app.api.disease_controller import router as disease_router

app = FastAPI(
    title="RareBridge API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "RareBridge API running"}

app.include_router(disease_router, prefix="/api/v1")
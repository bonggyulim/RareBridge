import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.response_utils import error_response
from app.api import hpo_controller
from app.api import disease_controller
from app.api import diagnosis_controller

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RareBridge API",
    description="AI-powered rare disease diagnosis assistant backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://rarebridge.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=error_response(
            code="SERVER_ERROR",
            message="An unexpected error occurred."
        ),
    )


API_V1_PREFIX = "/api/v1"

app.include_router(
    hpo_controller.router,
    prefix=f"{API_V1_PREFIX}/hpo",
)

app.include_router(
    disease_controller.router,
    prefix=f"{API_V1_PREFIX}/diseases",
)

app.include_router(
    diagnosis_controller.router,
    prefix=f"{API_V1_PREFIX}",
)


@app.get("/")
async def root():
    return {
        "message": "RareBridge API is running",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
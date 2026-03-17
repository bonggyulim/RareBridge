from fastapi import APIRouter
from app.schemas.diagnosis_schema import DiagnosisRequest, DiagnosisResponse
from app.services.diagnosis_service import DiagnosisService

router = APIRouter(tags=["Diagnosis"])

diagnosis_service = DiagnosisService()


@router.post("/diagnosis", response_model=DiagnosisResponse)
async def diagnose(request: DiagnosisRequest):
    result = await diagnosis_service.diagnose(
        text=request.text,
        top_k=request.top_k
    )

    return {
        "success": True,
        "data": result
    }
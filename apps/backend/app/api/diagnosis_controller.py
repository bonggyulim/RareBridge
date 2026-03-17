from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.diagnosis_service import DiagnosisService
from schemas.diagnosis_schema import DiagnosisRequest, DiagnosisResponse
from api.response_utils import error_response

router = APIRouter(tags=["Diagnosis"])
diagnosis_service = DiagnosisService()

@router.post("/diagnosis", response_model=DiagnosisResponse)
async def diagnose(request: DiagnosisRequest):
    try:
        result = await diagnosis_service.diagnose(
            text=request.text,
            top_k=request.top_k
        )
        return {
            "success": True,
            "data": result
        }
    except ValueError as e:  # (추가)
        error_mapping = {  # (추가)
            "EMPTY_INPUT": "내용을 입력해주세요.",
            "TOO_SHORT": "증상을 최소 2자 이상 상세히 입력해주세요.",
            "TOO_LONG": "증상 설명이 너무 깁니다. 500자 이내로 요약해주세요.",
            "INVALID_INPUT": "유효한 증상을 입력해주세요."
        }
        
        error_code = str(e)  # (추가)
        error_msg = error_mapping.get(error_code, "입력값이 올바르지 않습니다.")  # (추가)
        
        return JSONResponse(  # (추가)
            status_code=400,
            content=error_response(error_code, error_msg)
        )
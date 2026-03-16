from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.symptom_schema import SymptomRequest, ApiResponse
from app.services.symptom_service import process_and_validate_symptom
from app.api.response_utils import success_response, error_response

router = APIRouter(tags=["Symptoms"])

@router.post(
    "/parse",
    response_model=ApiResponse,
    response_model_exclude_none=True
)
async def symptom_parsing(request: SymptomRequest):
    user_input = request.text

    try:
        processed_text = process_and_validate_symptom(user_input)
    except ValueError as e:
        error_mapping = {
            "EMPTY_INPUT": "내용을 입력해주세요.",
            "TOO_SHORT": "증상을 최소 2자 이상 상세히 입력해주세요.",
            "TOO_LONG": "증상 설명이 너무 깁니다. 500자 이내로 요약해주세요.",
            "INVALID_INPUT": "유효한 증상을 입력해주세요."
        }

        error_code = str(e)
        error_msg = error_mapping.get(error_code, "입력값이 올바르지 않습니다.")

        return JSONResponse(
            status_code=400,
            content=error_response(error_code, error_msg)
        )

    return success_response({
        "text": processed_text
    })
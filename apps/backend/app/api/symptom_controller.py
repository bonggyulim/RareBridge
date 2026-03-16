from fastapi import APIRouter

from fastapi.responses import JSONResponse
from schemas.symptom_schema import SymptomRequest, ApiResponse
from services.symptom_service import process_and_validate_symptom

router = APIRouter()

# response_model_exclude_none=True 
# => 에러 발생 시 None 아예 안 보냄 (symptom_schema 22번째 줄) => 당장 사용되지는 않음
@router.post("/parse", response_model=ApiResponse,
            response_model_exclude_none=True) 


async def symptom_parsing(request: SymptomRequest):
    # 프론트엔드에서 보낸 텍스트를 받습니다.
    user_input = request.text
        # [Service 호출] 텍스트가공/검증 로직 진행
    try:
        processed_text = process_and_validate_symptom(user_input)
    except ValueError as e:
        # 에러 코드와 메시지를 매핑합니다.
        error_mapping = {
            "EMPTY_INPUT": "내용을 입력해주세요.",
            "TOO_SHORT": "증상을 최소 2자 이상 상세히 입력해주세요.",
            "TOO_LONG": "증상 설명이 너무 깁니다. 500자 이내로 요약해주세요.",
            "INVALID_INPUT": "유효한 증상을 입력해주세요."
        }

        error_code = str(e)
        # 매핑된 메시지가 없으면 기본 메시지를 출력 (안전장치)
        error_msg = error_mapping.get(error_code, "입력값이 올바르지 않습니다.")
        
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": {
                    "code": error_code, 
                    "message": error_msg
                }
            }
        )

    # 모든 검증 통과 시
    return {
        "success": True,
        "data": {"text": processed_text},
    }
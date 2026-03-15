from fastapi import APIRouter
from pydantic import BaseModel, Field
from fastapi import HTTPException

from services import symptom_service

import re

router = APIRouter()
# 만약 입력이 증상과 관련된 내용이 아니라면?? ex. 오늘 날씨가 좋다 -> ?

# [DTO] 프론트엔드에서 보낼 데이터의 형식을 정의합니다
# [DTO] 입력값 검증 강화: 최소 2자 이상, 최대 500자 이하만 받겠다!
class SymptomRequest(BaseModel):
    text: str = Field(..., min_length=2, max_length=500, description="사용자가 입력한 증상 텍스트")
# 위 내용은 fastapi 기본 에러 처리 형식으로 나옴 -> 통일시키려면 다르게 설정해야.

# [DTO] 백엔드에서 보내는 데이터의 형식을 정의합니다 (응답 규격)
class SymptomResponse(BaseModel): # data 안 규격
    text: str
    # hpo_codes: list[str] = Field(default=[], description="추출된 HPO 코드 리스트")
class ApiResponse(BaseModel): # 전체  규격
    data: SymptomResponse


@router.post("/parse", response_model=ApiResponse) # 엔드포인트
async def symptom_parsing(request: SymptomRequest):
    # 1. 프론트엔드에서 보낸 텍스트를 받습니다.
    user_input = request.text

    # [추가 검증] 간단한 유효성 검사 로직 (예: 공백만 있는 경우)
    # front에서 alert로 이미 처리 중
    if not user_input.strip():
        raise HTTPException(status_code=400, 
            detail={
                "success": False, 
                "code": "EMPTY_INPUT",
                "message": "내용을 입력해주세요."
            })

    # [추가 검증] 의미 없는 특수문자 도배 체크
    if not re.search(r'[가-힣a-zA-Z0-9]', user_input):
         raise HTTPException(status_code=400, 
            detail={
                "success": False, 
                "code": "INVALID_INPUT",
                "message": "유효한 증상을 입력해주세요."
            })

    # [추가 검증] 서비스에게 '판단'을 맡김 (AI 활용 단)
    # "야, 이거 분석해봐. 만약 증상 아니면 에러 내지 말고 'False'나 'None'을 줘."
    # result = await symptom_service.analyze_and_validate(user_input)

    # -> 서비스의 대답에 따라 길을 나눠줌
    # if result is None:
    #     return {
    #         "success": True,
    #         "data": { "text": user_input, "message": "증상과 관련 없는 내용입니다." }
    #     }

    return {
        "data": {"text": user_input}
    }


    # 추가 예외 처리 할 만한 부분
    # try:
    #     # [예외 5] AI 호출 시 발생할 수 있는 오류 대비
    #     hpo_codes = await symptom_service.extract_hpo_codes(user_input)
    # except Exception as e:

    #     # 로그를 남기고 사용자에게는 시스템 오류 안내
    #     print(f"AI 호출 에러: {e}")
    #     raise HTTPException(status_code=500, detail={"success": False, "message": "서버 내부 오류가 발생했습니다. 잠시 후 시도해주세요."})

    # return {
    #     "success": True,
    #     "data": { "text": user_input, "hpo_codes": hpo_codes }
    # }

# DTO 관리
from pydantic import BaseModel, Field
from typing import Optional

# [DTO] 프론트엔드에서 보낼 데이터의 형식을 정의합니다
class SymptomRequest(BaseModel):
    text: str

# [DTO] 프론트엔드에서 받을 데이터의 형식을 정의합니다
class SymptomResponse(BaseModel):
    text: str

# [DTO] 에러 발생 시 사용할 규격 => 당장 사용되지는 않음
class ErrorDetail(BaseModel):
    code: str
    message: str

# [DTO] 최종 응답 규격 (성공/실패 통합) => 당장 사용되지는 않음
class ApiResponse(BaseModel):
    success: bool
    data: SymptomResponse
    error: Optional[ErrorDetail] = None

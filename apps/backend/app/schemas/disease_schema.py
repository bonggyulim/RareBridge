# Disease Schema : 질환 검색 API의 요청 및 응답 데이터 구조 정의
# Pydantic 모델을 사용하여 입력 검증과 응답 형식을 정의

from pydantic import BaseModel, Field
from typing import List, Optional

# 요청 모델
class DiseaseSearchRequest(BaseModel):
    hpo_codes: List[str]
    top_k: int = Field(default=5, ge=1, le=20)

# 응답 객체
class DiseaseItem(BaseModel):
    orpha_id: Optional[str] = None
    disease_name: Optional[str] = None
    definition: Optional[str] = None
    matched_hpo_count: int
    input_hpo_count: int
    match_ratio: float

# API 응답
class DiseaseSearchResponse(BaseModel):
    success: bool
    data: List[DiseaseItem]
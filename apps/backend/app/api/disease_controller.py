# Disease Controller : 질환 검색 API endpoint를 정의하는 계층
# 입력된 HPO 코드 목록을 Service 계층에 전달하고 검색 결과를 반환

from fastapi import APIRouter
from app.schemas.disease_schema import DiseaseSearchRequest, DiseaseSearchResponse
from app.services.disease_service import DiseaseService

router = APIRouter(tags=["Disease"])

service = DiseaseService()

@router.post("/diseases/search", response_model=DiseaseSearchResponse)
def search_diseases(request: DiseaseSearchRequest):
    results = service.search_diseases(
        request.hpo_codes,
        request.top_k
    )

    return {
        "success": True,
        "data": results
    }
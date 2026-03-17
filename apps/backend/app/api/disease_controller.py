from fastapi import APIRouter
# from app.schemas.disease_schema import DiseaseSearchRequest, DiseaseSearchResponse
# from app.services.disease_service import DiseaseService

from schemas.disease_schema import DiseaseSearchRequest, DiseaseSearchResponse
from services.disease_service import DiseaseService


router = APIRouter(tags=["Disease"])

service = DiseaseService()

@router.post("/search", response_model=DiseaseSearchResponse)
def search_diseases(request: DiseaseSearchRequest):
    """
    HPO 코드 목록을 기반으로 희귀질환 후보를 검색합니다.
    """

    results = service.search_diseases(
        request.hpo_codes,
        request.top_k
    )

    return {
        "success": True,
        "data": results
    }
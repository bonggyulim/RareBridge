# api/disease_controller.py
from fastapi import APIRouter, Depends
from database import get_supabase
from services import disease_service
from typing import List
from supabase import Client

router = APIRouter(prefix="/api/v1/disease", tags=["Disease"])

# match -> search로 변경
@router.post("/search")
async def search_diseases(hpo_codes: List[str], supabase: Client = Depends(get_supabase)):
    """
    [3단계] HPO 코드들을 기반으로 일치하는 질환을 검색합니다.
    """
    results = disease_service.get_matched_diseases(supabase, hpo_codes)
    
    return {
        "success": True,
        "data": {
            "matched_diseases": results
        }
    }
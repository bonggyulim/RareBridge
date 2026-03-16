from fastapi import APIRouter, HTTPException
from app.schemas.hpo_schema import SymptomRequest, HpoResponse
from app.services.hpo_service import hpo_service
from app.api.response_utils import success_response, error_response

router = APIRouter(prefix="/hpo", tags=["hpo"])

@router.post("/extract")
async def extract_hpo(request: SymptomRequest):
    """
    Endpoint to extract HPO codes from natural language symptom text.
    """
    if not request.text:
        return error_response("INVALID_INPUT", "Text field is required")

    hpo_codes = await hpo_service.extract_hpo_codes(request.text)
    
    if not hpo_codes:
        # We still return success: true but with empty codes if AI couldn't find any
        return success_response({"hpo_codes": []})

    return success_response({"hpo_codes": hpo_codes})

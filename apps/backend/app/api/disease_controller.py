from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.symptom_schema import SymptomRequest
from app.services.hpo_service import hpo_service
from app.api.response_utils import success_response, error_response

router = APIRouter(tags=["HPO"])

@router.post("/extract")
async def extract_hpo(request: SymptomRequest):
    """
    자연어 증상 텍스트에서 HPO 코드를 추출합니다.
    """
    if not request.text or not request.text.strip():
        return JSONResponse(
            status_code=400,
            content=error_response("INVALID_INPUT", "Text field is required")
        )

    hpo_codes = await hpo_service.extract_hpo_codes(request.text)

    if not hpo_codes:
        return success_response({"hpo_codes": []})

    return success_response({"hpo_codes": hpo_codes})
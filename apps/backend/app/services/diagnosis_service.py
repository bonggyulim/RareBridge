# from app.services.hpo_service import HpoService
# from app.services.disease_service import DiseaseService

from services.hpo_service import HpoService
from services.disease_service import DiseaseService
from services.symptom_service import process_and_validate_symptom  # (추가)


class DiagnosisService:
    def __init__(self):
        self.hpo_service = HpoService()
        self.disease_service = DiseaseService()

    async def diagnose(self, text: str, top_k: int = 5):
        # 1. 증상 검증 및 전처리 (추가)
        validated_text = process_and_validate_symptom(text)  # (추가)

        # 2. HPO 코드 추출 (Gemini API)
        hpo_codes = await self.hpo_service.extract_hpo_codes(validated_text)

        # 3. 질병 검색 (DB)
        diseases = self.disease_service.search_diseases(
            hpo_codes=hpo_codes,
            top_k=top_k
        )

        return {
            "text": validated_text,
            "hpo_codes": hpo_codes,
            "diseases": diseases
        }
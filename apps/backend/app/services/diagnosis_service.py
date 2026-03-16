from app.services.hpo_service import HpoService
from app.services.disease_service import DiseaseService


class DiagnosisService:
    def __init__(self):
        self.hpo_service = HpoService()
        self.disease_service = DiseaseService()

    async def diagnose(self, text: str, top_k: int = 5):
        hpo_codes = await self.hpo_service.extract_hpo_codes(text)

        diseases = self.disease_service.search_diseases(
            hpo_codes=hpo_codes,
            top_k=top_k
        )

        return {
            "text": text,
            "hpo_codes": hpo_codes,
            "diseases": diseases
        }
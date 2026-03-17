import logging

from app.services.hpo_service import HpoService
from app.services.disease_service import DiseaseService

logger = logging.getLogger(__name__)


class DiagnosisService:
    def __init__(self):
        self.hpo_service = HpoService()
        self.disease_service = DiseaseService()

    async def diagnose(self, text: str, top_k: int = 5):
        if not isinstance(text, str) or not text.strip():
            raise ValueError("text must not be empty.")

        if not isinstance(top_k, int) or top_k <= 0:
            raise ValueError("top_k must be a positive integer.")

        try:
            hpo_codes = await self.hpo_service.extract_hpo_codes(text)

            if not hpo_codes:
                return {
                    "text": text,
                    "hpo_codes": [],
                    "diseases": []
                }

            diseases = self.disease_service.search_diseases(
                hpo_codes=hpo_codes,
                top_k=top_k
            )

            return {
                "text": text,
                "hpo_codes": hpo_codes,
                "diseases": diseases
            }

        except ValueError:
            raise
        except RuntimeError:
            raise
        except Exception as e:
            logger.exception("Diagnosis pipeline failed.")
            raise RuntimeError("Diagnosis failed.") from e
import logging
from app.repositories.disease_repository import DiseaseRepository

logger = logging.getLogger(__name__)


class DiseaseService:
    def __init__(self):
        self.repository = DiseaseRepository()

    def search_diseases(self, hpo_codes: list[str], top_k: int = 5):
        if not isinstance(hpo_codes, list):
            raise ValueError("hpo_codes must be a list.")

        if not isinstance(top_k, int) or top_k <= 0:
            raise ValueError("top_k must be a positive integer.")

        try:
            return self.repository.search_diseases_by_hpo_codes(hpo_codes, top_k)
        except ValueError:
            raise
        except Exception as e:
            logger.exception("Failed to search diseases.")
            raise RuntimeError("Disease search failed.") from e
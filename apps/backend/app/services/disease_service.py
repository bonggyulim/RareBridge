from app.repositories.disease_repository import DiseaseRepository

class DiseaseService:
    def __init__(self):
        self.repository = DiseaseRepository()

    def search_diseases(self, hpo_codes: list[str], top_k: int = 5):
        return self.repository.search_diseases_by_hpo_codes(hpo_codes, top_k)
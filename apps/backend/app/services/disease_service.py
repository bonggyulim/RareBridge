# Disease Service : 질환 검색 비즈니스 로직을 처리하는 계층
# Repository를 통해 데이터를 조회하고 검색 결과를 반환

from app.repositories.disease_repository import DiseaseRepository

class DiseaseService:

    def __init__(self):
        self.repository = DiseaseRepository()

    def search_diseases(self, hpo_codes: list[str], top_k: int = 5):
        results = self.repository.search_diseases_by_hpo_codes(hpo_codes, top_k)

        return results
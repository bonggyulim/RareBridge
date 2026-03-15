# Disease Repository : 데이터베이스 접근을 담당하는 계층
# HPO 및 질환 테이블을 조회하여 질환 검색에 필요한 데이터를 제공

import os
from collections import Counter
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()


class DiseaseRepository:

    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")

        if not url or not key:
            raise ValueError("SUPABASE 환경변수가 설정되지 않았습니다.")

        self.supabase: Client = create_client(url, key)


    def get_hpo_terms_by_codes(self, hpo_codes: list[str]):

        if not hpo_codes:
            return []

        response = (
            self.supabase
            .table("hpo_term")
            .select("id, hpo_id, name")
            .in_("hpo_id", hpo_codes)
            .execute()
        )

        return response.data or []


    def get_disease_hpo_matches(self, hpo_term_ids: list[int]):

        if not hpo_term_ids:
            return []

        response = (
            self.supabase
            .table("disease_hpo")
            .select("disease_id, hpo_id, frequency")
            .in_("hpo_id", hpo_term_ids)
            .execute()
        )

        return response.data or []


    def get_diseases_by_ids(self, disease_ids: list[int]):

        if not disease_ids:
            return []

        response = (
            self.supabase
            .table("disease")
            .select("id, orpha_id, name, definition")
            .in_("id", disease_ids)
            .execute()
        )

        return response.data or []


    def search_diseases_by_hpo_codes(self, hpo_codes: list[str], top_k: int = 5):

        if not hpo_codes:
            return []

        # HPO 코드 정규화
        normalized_hpo_codes = list({
            code.strip().upper()
            for code in hpo_codes
            if code and code.strip()
        })

        if not normalized_hpo_codes:
            return []

        # HPO 코드 조회
        hpo_terms = self.get_hpo_terms_by_codes(normalized_hpo_codes)

        if not hpo_terms:
            return []

        hpo_term_ids = [row["id"] for row in hpo_terms]

        # disease_hpo 조회
        disease_hpo_rows = self.get_disease_hpo_matches(hpo_term_ids)

        if not disease_hpo_rows:
            return []

        # 질환별 매칭 개수 계산
        disease_counter = Counter()

        for row in disease_hpo_rows:
            disease_id = row["disease_id"]
            disease_counter[disease_id] += 1

        disease_ids = list(disease_counter.keys())
        diseases = self.get_diseases_by_ids(disease_ids)
        disease_map = {row["id"]: row for row in diseases}
        results = []
        input_hpo_count = len(normalized_hpo_codes)

        for disease_id, matched_count in disease_counter.items():
            disease_info = disease_map.get(disease_id)

            if not disease_info:
                continue

            match_ratio = round(matched_count / input_hpo_count, 4)

            results.append({
                "orpha_id": disease_info.get("orpha_id"),
                "disease_name": disease_info.get("name"),
                "definition": disease_info.get("definition"),
                "matched_hpo_count": matched_count,
                "input_hpo_count": input_hpo_count,
                "match_ratio": match_ratio
            })

        # 정렬
        results.sort(
            key=lambda x: (
                -x["matched_hpo_count"],
                -x["match_ratio"],
                x["disease_name"] or ""
            )
        )

        return results[:top_k]
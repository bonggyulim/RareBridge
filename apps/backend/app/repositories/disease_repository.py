import os
import logging
from collections import defaultdict

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
logger = logging.getLogger(__name__)



class DiseaseRepository:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")

        if not url or not key:
            raise ValueError("SUPABASE 환경변수가 설정되지 않았습니다.")

        self.supabase: Client = create_client(url, key)

    def _frequency_to_weight(self, frequency: str | None) -> float:
        if not frequency:
            weight = 0.1
            logger.info(f"[weight-map] frequency=None -> weight={weight}")
            return weight

        value = frequency.strip().lower()

        if "very frequent" in value:
            weight = 1.0
        elif "frequent" in value:
            weight = 0.7
        elif "occasional" in value:
            weight = 0.3
        elif "excluded" in value:
            weight = 0.0
        else:
            weight = 0.1

        logger.info(f"[weight-map] frequency='{frequency}' -> weight={weight}")
        return weight

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

        normalized_hpo_codes = list({
            code.strip().upper()
            for code in hpo_codes
            if code and code.strip()
        })

        if not normalized_hpo_codes:
            return []

        hpo_terms = self.get_hpo_terms_by_codes(normalized_hpo_codes)
        if not hpo_terms:
            return []

        # 입력 HPO 코드 -> 내부 hpo_term.id
        hpo_term_ids = [row["id"] for row in hpo_terms]
        input_hpo_count = len(hpo_term_ids)

        # HPO DB ID -> {hpo_id (HP:xxx), name} 매핑 생성 (추가)
        hpo_info_map = {int(row["id"]): {"hpo_id": row["hpo_id"], "name": row["name"]} for row in hpo_terms}

        if input_hpo_count == 0:
            return []

        disease_hpo_rows = self.get_disease_hpo_matches(hpo_term_ids)
        if not disease_hpo_rows:
            return []

        # 질환별로 매칭된 고유 hpo_id 저장
        disease_matched_hpo_map = defaultdict(set)

        # 질환별 가중치 합계 저장
        disease_weight_sum = defaultdict(float)

        # 같은 질환-같은 hpo_id 중복 row 방지용
        seen_pairs = set()

        for row in disease_hpo_rows:
            disease_id = row.get("disease_id")
            hpo_id = row.get("hpo_id")
            frequency = row.get("frequency")

            if disease_id is None or hpo_id is None:
                continue

            pair_key = (disease_id, hpo_id)
            if pair_key in seen_pairs:
                continue

            seen_pairs.add(pair_key)

            disease_matched_hpo_map[disease_id].add(hpo_id)
            disease_weight_sum[disease_id] += self._frequency_to_weight(frequency)

        disease_ids = list(disease_matched_hpo_map.keys())
        diseases = self.get_diseases_by_ids(disease_ids)
        disease_map = {row["id"]: row for row in diseases}

        results = []

        for disease_id, matched_hpo_ids in disease_matched_hpo_map.items():
            disease_info = disease_map.get(disease_id)
            if not disease_info:
                continue

            matched_count = len(matched_hpo_ids)

            # 방어 코드: 절대 입력 개수보다 커지지 않게
            matched_count = min(matched_count, input_hpo_count)

            raw_weight_sum = disease_weight_sum[disease_id]

            # 최대 가중치는 입력 HPO 개수 * 1.0
            max_possible_weight = float(input_hpo_count)

            match_ratio = matched_count / input_hpo_count
            weighted_ratio = raw_weight_sum / max_possible_weight if max_possible_weight > 0 else 0.0

            # 방어 코드: 절대 1.0 넘지 않게
            match_ratio = min(match_ratio, 1.0)
            weighted_ratio = min(weighted_ratio, 1.0)

            match_percent = round(match_ratio * 100, 1)
            weighted_percent = round(weighted_ratio * 100, 1)

            # 매칭된 HPO 리스트 (코드, 이름) 생성
            matched_hpo_list = [
                hpo_info_map[hpo_internal_id]
                for hpo_internal_id in matched_hpo_ids
                if hpo_internal_id in hpo_info_map
            ]

            results.append({
                "orpha_id": disease_info.get("orpha_id"),
                "disease_name": disease_info.get("name"),
                "definition": disease_info.get("definition"),
                "matched_hpo_count": matched_count,
                "input_hpo_count": input_hpo_count,
                "match_ratio": round(match_ratio, 4),
                "match_percent": match_percent,
                "weighted_score": round(raw_weight_sum, 4),
                "weighted_ratio": round(weighted_ratio, 4),
                "weighted_percent": weighted_percent,
                "matched_hpo_list": matched_hpo_list
            })

        results.sort(
            key=lambda x: (
                -x["weighted_score"],
                -x["matched_hpo_count"],
                -x["match_ratio"],
                x["disease_name"] or ""
            )
        )

        return results[:top_k]

# import os
# from collections import defaultdict

# from dotenv import load_dotenv
# from supabase import create_client, Client

# load_dotenv()


# class DiseaseRepository:
#     def __init__(self):
#         url = os.getenv("SUPABASE_URL")
#         key = os.getenv("SUPABASE_SERVICE_KEY")

#         if not url or not key:
#             raise ValueError("SUPABASE 환경변수가 설정되지 않았습니다.")

#         self.supabase: Client = create_client(url, key)

#     def get_hpo_terms_by_codes(self, hpo_codes: list[str]):
#         if not hpo_codes:
#             return []

#         response = (
#             self.supabase
#             .table("hpo_term")
#             .select("id, hpo_id, name")
#             .in_("hpo_id", hpo_codes)
#             .execute()
#         )

#         return response.data or []

#     def get_disease_hpo_matches(self, hpo_term_ids: list[int]):
#         if not hpo_term_ids:
#             return []

#         response = (
#             self.supabase
#             .table("disease_hpo")
#             .select("disease_id, hpo_id, frequency")
#             .in_("hpo_id", hpo_term_ids)
#             .execute()
#         )

#         return response.data or []

#     def get_diseases_by_ids(self, disease_ids: list[int]):
#         if not disease_ids:
#             return []

#         response = (
#             self.supabase
#             .table("disease")
#             .select("id, orpha_id, name, definition")
#             .in_("id", disease_ids)
#             .execute()
#         )

#         return response.data or []

#     def _frequency_to_weight(self, frequency: str | None) -> float:
#         """
#         frequency 값을 점수로 변환
#         실제 disease_hpo.frequency 값 형식에 따라 조정 가능
#         """
#         if not frequency:
#             return 0.3

#         freq = frequency.strip().lower()

#         if "very frequent" in freq:
#             return 1.0
#         elif "frequent" in freq:
#             return 0.8
#         elif "occasional" in freq:
#             return 0.5
#         elif "rare" in freq:
#             return 0.2
#         elif "excluded" in freq:
#             return 0.0

#         return 0.3

#     def search_diseases_by_hpo_codes(self, hpo_codes: list[str], top_k: int = 5):
#         if not hpo_codes:
#             return []

#         normalized_hpo_codes = list({
#             code.strip().upper()
#             for code in hpo_codes
#             if code and code.strip()
#         })

#         if not normalized_hpo_codes:
#             return []

#         hpo_terms = self.get_hpo_terms_by_codes(normalized_hpo_codes)
#         if not hpo_terms:
#             return []

#         input_hpo_count = len(normalized_hpo_codes)

#         hpo_term_ids = [row["id"] for row in hpo_terms]
#         # HPO DB ID -> {hpo_id (HP:xxx), name} 매핑 생성 (추가)
#         hpo_info_map = {int(row["id"]): {"hpo_id": row["hpo_id"], "name": row["name"]} for row in hpo_terms}  # (추가)

#         disease_hpo_rows = self.get_disease_hpo_matches(hpo_term_ids)
#         if not disease_hpo_rows:
#             return []

#         # disease별로 매칭된 고유 hpo_id 저장
#         disease_hpo_map = defaultdict(set)

#         # disease별 가중치 점수 저장
#         disease_score_map = defaultdict(float)

#         # 중복 반영 방지를 위한 체크
#         seen_pairs = set()

#         for row in disease_hpo_rows:
#             disease_id = row["disease_id"]
#             hpo_term_internal_id = int(row["hpo_id"]) # DB의 id 값 (추가/수정)
#             frequency = row.get("frequency")

#             pair = (disease_id, hpo_term_internal_id)
#             if pair in seen_pairs:
#                 continue

#             seen_pairs.add(pair)
#             disease_hpo_map[disease_id].add(hpo_term_internal_id)
#             disease_score_map[disease_id] += self._frequency_to_weight(frequency)

#         disease_ids = list(disease_hpo_map.keys())
#         diseases = self.get_diseases_by_ids(disease_ids)
#         disease_map = {row["id"]: row for row in diseases}

#         results = []
#         max_possible_score = float(input_hpo_count)

#         for disease_id, matched_hpo_set in disease_hpo_map.items():
#             disease_info = disease_map.get(disease_id)
#             if not disease_info:
#                 continue

#             matched_count = len(matched_hpo_set)
#             match_ratio = round(matched_count / input_hpo_count, 4)

#             weighted_score = round(disease_score_map[disease_id], 4)
#             weighted_ratio = round(weighted_score / max_possible_score, 4)

#             # 매칭된 HPO 리스트 (코드, 이름) 생성 (추가)
#             matched_hpo_list = [  # (추가)
#                 hpo_info_map[hpo_internal_id]
#                 for hpo_internal_id in matched_hpo_set
#                 if hpo_internal_id in hpo_info_map
#             ]

#             results.append({
#                 "orpha_id": disease_info.get("orpha_id"),
#                 "disease_name": disease_info.get("name"),
#                 "definition": disease_info.get("definition"),
#                 "matched_hpo_count": matched_count,
#                 "input_hpo_count": input_hpo_count,
#                 "match_ratio": match_ratio,         # 0 ~ 1 범위
#                 "weighted_score": weighted_score,   # 가중치 합산 점수
#                 "weighted_ratio": weighted_ratio,   # 입력 개수 기준 정규화
#                 "matched_hpo_list": matched_hpo_list # 매칭된 HPO 상세 리스트 (추가)
#             })


#         results.sort(
#             key=lambda x: (
#                 -x["weighted_score"],
#                 -x["matched_hpo_count"],
#                 -x["match_ratio"],
#                 x["disease_name"] or ""
#             )
#         )

#         return results[:top_k]

# import os
# from collections import defaultdict

# from dotenv import load_dotenv
# from supabase import create_client, Client

# load_dotenv()



# FREQUENCY_WEIGHTS = {
#     "Obligate (100%)": 1.0,
#     "Very frequent (99-80%)": 0.9,
#     "Frequent (79-30%)": 0.6,
#     "Occasional (29-5%)": 0.3,
#     "Very rare (<4%)": 0.1,
#     "Excluded (0%)": 0.0,
# }


# class DiseaseRepository:
#     def __init__(self):
#         url = os.getenv("SUPABASE_URL")
#         key = os.getenv("SUPABASE_SERVICE_KEY")

#         if not url or not key:
#             raise ValueError("SUPABASE 환경변수가 설정되지 않았습니다.")

#         self.supabase: Client = create_client(url, key)

#     def get_hpo_terms_by_codes(self, hpo_codes: list[str]):
#         if not hpo_codes:
#             return []

#         response = (
#             self.supabase
#             .table("hpo_term")
#             .select("id, hpo_id, name")
#             .in_("hpo_id", hpo_codes)
#             .execute()
#         )

#         return response.data or []

#     def get_disease_hpo_matches(self, hpo_term_ids: list[int]):
#         if not hpo_term_ids:
#             return []

#         response = (
#             self.supabase
#             .table("disease_hpo")
#             .select("disease_id, hpo_id, frequency")
#             .in_("hpo_id", hpo_term_ids)
#             .execute()
#         )

#         return response.data or []

#     def get_diseases_by_ids(self, disease_ids: list[int]):
#         if not disease_ids:
#             return []

#         response = (
#             self.supabase
#             .table("disease")
#             .select("id, orpha_id, name, definition")
#             .in_("id", disease_ids)
#             .execute()
#         )

#         return response.data or []

#     def search_diseases_by_hpo_codes(self, hpo_codes: list[str], top_k: int = 5):
#         if not hpo_codes:
#             return []

#         normalized_hpo_codes = list({
#             code.strip().upper()
#             for code in hpo_codes
#             if code and code.strip()
#         })

#         if not normalized_hpo_codes:
#             return []

#         hpo_terms = self.get_hpo_terms_by_codes(normalized_hpo_codes)
#         if not hpo_terms:
#             return []

#         hpo_term_ids = [row["id"] for row in hpo_terms]

#         disease_hpo_rows = self.get_disease_hpo_matches(hpo_term_ids)
#         if not disease_hpo_rows:
#             return []

#         # 질병별로 매칭된 고유 HPO와 가중치 합 관리
#         disease_match_map = defaultdict(dict)
#         # disease_match_map[disease_id][hpo_id] = highest_weight_for_that_hpo

#         for row in disease_hpo_rows:
#             disease_id = row["disease_id"]
#             hpo_id = row["hpo_id"]
#             frequency = row.get("frequency")
#             weight = FREQUENCY_WEIGHTS.get(frequency, 0.2)

#             # 같은 disease_id + hpo_id가 중복이면 더 높은 weight만 사용
#             prev_weight = disease_match_map[disease_id].get(hpo_id, 0.0)
#             if weight > prev_weight:
#                 disease_match_map[disease_id][hpo_id] = weight

#         disease_ids = list(disease_match_map.keys())
#         diseases = self.get_diseases_by_ids(disease_ids)
#         disease_map = {row["id"]: row for row in diseases}

#         results = []
#         input_hpo_count = len(normalized_hpo_codes)
#         max_score = float(input_hpo_count)  # 모든 입력 증상이 1.0일 때 최대

#         for disease_id, matched_hpo_weights in disease_match_map.items():
#             disease_info = disease_map.get(disease_id)
#             if not disease_info:
#                 continue

#             matched_count = len(matched_hpo_weights)
#             raw_score = sum(matched_hpo_weights.values())

#             match_ratio = round(matched_count / input_hpo_count, 4)
#             weighted_ratio = round(raw_score / max_score, 4)

#             results.append({
#                 "orpha_id": disease_info.get("orpha_id"),
#                 "disease_name": disease_info.get("name"),
#                 "definition": disease_info.get("definition"),
#                 "matched_hpo_count": matched_count,
#                 "input_hpo_count": input_hpo_count,
#                 "match_ratio": match_ratio,            # 단순 일치율
#                 "weighted_score": round(raw_score, 4), # 정렬용 점수
#                 "weighted_ratio": weighted_ratio,      # 표시용 비율
#             })

#         results.sort(
#             key=lambda x: (
#                 -x["weighted_score"],
#                 -x["matched_hpo_count"],
#                 -x["match_ratio"],
#                 x["disease_name"] or ""
#             )
#         )

#         return results[:top_k]


# import os
# from collections import Counter

# from dotenv import load_dotenv
# from supabase import create_client, Client

# load_dotenv()

# class DiseaseRepository:
#     def __init__(self):
#         url = os.getenv("SUPABASE_URL")
#         key = os.getenv("SUPABASE_SERVICE_KEY")

#         if not url or not key:
#             raise ValueError("SUPABASE 환경변수가 설정되지 않았습니다.")

#         self.supabase: Client = create_client(url, key)

#     def get_hpo_terms_by_codes(self, hpo_codes: list[str]):
#         if not hpo_codes:
#             return []

#         response = (
#             self.supabase
#             .table("hpo_term")
#             .select("id, hpo_id, name")
#             .in_("hpo_id", hpo_codes)
#             .execute()
#         )

#         return response.data or []

#     def get_disease_hpo_matches(self, hpo_term_ids: list[int]):
#         if not hpo_term_ids:
#             return []

#         response = (
#             self.supabase
#             .table("disease_hpo")
#             .select("disease_id, hpo_id, frequency")
#             .in_("hpo_id", hpo_term_ids)
#             .execute()
#         )

#         return response.data or []

#     def get_diseases_by_ids(self, disease_ids: list[int]):
#         if not disease_ids:
#             return []

#         response = (
#             self.supabase
#             .table("disease")
#             .select("id, orpha_id, name, definition")
#             .in_("id", disease_ids)
#             .execute()
#         )

#         return response.data or []

#     def search_diseases_by_hpo_codes(self, hpo_codes: list[str], top_k: int = 5):
#         if not hpo_codes:
#             return []

#         normalized_hpo_codes = list({
#             code.strip().upper()
#             for code in hpo_codes
#             if code and code.strip()
#         })

#         if not normalized_hpo_codes:
#             return []

#         hpo_terms = self.get_hpo_terms_by_codes(normalized_hpo_codes)
#         if not hpo_terms:
#             return []

#         hpo_term_ids = [row["id"] for row in hpo_terms]

#         disease_hpo_rows = self.get_disease_hpo_matches(hpo_term_ids)
#         if not disease_hpo_rows:
#             return []

#         disease_counter = Counter()
#         for row in disease_hpo_rows:
#             disease_id = row["disease_id"]
#             print('disease_repository', disease_id)
#             disease_counter[disease_id] += 1

#         disease_ids = list(disease_counter.keys())
#         diseases = self.get_diseases_by_ids(disease_ids)
#         disease_map = {row["id"]: row for row in diseases}

#         results = []
#         input_hpo_count = len(normalized_hpo_codes)

#         for disease_id, matched_count in disease_counter.items():
#             disease_info = disease_map.get(disease_id)

#             if not disease_info:
#                 continue

#             match_ratio = round(matched_count / input_hpo_count, 4)
#             print('disease_repository', matched_count)
#             print('disease_repository', input_hpo_count)
#             print('disease_repository', match_ratio)

#             results.append({
#                 "orpha_id": disease_info.get("orpha_id"),
#                 "disease_name": disease_info.get("name"),
#                 "definition": disease_info.get("definition"),
#                 "matched_hpo_count": matched_count,
#                 "input_hpo_count": input_hpo_count,
#                 "match_ratio": match_ratio
#             })

#         results.sort(
#             key=lambda x: (
#                 -x["matched_hpo_count"],
#                 -x["match_ratio"],
#                 x["disease_name"] or ""
#             )
#         )

#         return results[:top_k]
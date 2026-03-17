import os
from collections import defaultdict

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()


class DiseaseRepository:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")

        if not url or not key:
            raise ValueError("Supabase environment variables are not configured.")

        self.supabase: Client = create_client(url, key)

    def _frequency_to_weight(self, frequency: str | None) -> float:
        if not frequency:
            return 0.5

        value = frequency.strip().lower()

        if "obligate" in value:
            return 1.0
        elif "very frequent" in value:
            return 0.9
        elif "frequent" in value:
            return 0.55
        elif "occasional" in value:
            return 0.17
        elif "very rare" in value:
            return 0.025
        elif "excluded" in value:
            return 0.0
        return 0.5

    def get_hpo_terms_by_codes(self, hpo_codes: list[str]) -> list[dict]:
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

    def get_disease_hpo_matches(self, hpo_term_ids: list[int]) -> list[dict]:
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

    def get_diseases_by_ids(self, disease_ids: list[int]) -> list[dict]:
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

    def search_diseases_by_hpo_codes(self, hpo_codes: list[str], top_k: int = 5) -> list[dict]:
        if not hpo_codes:
            return []

        normalized_hpo_codes = list({
            code.strip().upper()
            for code in hpo_codes
            if isinstance(code, str) and code.strip()
        })

        if not normalized_hpo_codes:
            return []

        hpo_terms = self.get_hpo_terms_by_codes(normalized_hpo_codes)
        if not hpo_terms:
            return []

        hpo_term_ids = [row["id"] for row in hpo_terms if row.get("id") is not None]
        input_hpo_count = len(hpo_term_ids)

        if input_hpo_count == 0:
            return []

        hpo_id_map = {
            row["id"]: row["hpo_id"]
            for row in hpo_terms
            if row.get("id") is not None and row.get("hpo_id")
        }

        disease_hpo_rows = self.get_disease_hpo_matches(hpo_term_ids)
        if not disease_hpo_rows:
            return []

        disease_matched_hpo_map = defaultdict(set)
        disease_weight_sum = defaultdict(float)
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
        if not disease_ids:
            return []

        diseases = self.get_diseases_by_ids(disease_ids)
        if not diseases:
            return []

        disease_map = {
            row["id"]: row
            for row in diseases
            if row.get("id") is not None
        }

        results = []

        for disease_id, matched_hpo_ids in disease_matched_hpo_map.items():
            disease_info = disease_map.get(disease_id)
            if not disease_info:
                continue

            matched_count = min(len(matched_hpo_ids), input_hpo_count)
            raw_weight_sum = disease_weight_sum[disease_id]
            max_possible_weight = float(input_hpo_count)

            match_ratio = matched_count / input_hpo_count if input_hpo_count > 0 else 0.0
            weighted_ratio = raw_weight_sum / max_possible_weight if max_possible_weight > 0 else 0.0

            match_ratio = min(match_ratio, 1.0)
            weighted_ratio = min(weighted_ratio, 1.0)

            matched_hpo_codes = sorted(
                hpo_id_map[hpo_id]
                for hpo_id in matched_hpo_ids
                if hpo_id in hpo_id_map
            )

            results.append({
                "orpha_id": disease_info.get("orpha_id"),
                "disease_name": disease_info.get("name"),
                "definition": disease_info.get("definition"),
                "matched_hpo_count": matched_count,
                "input_hpo_count": input_hpo_count,
                "match_ratio": round(match_ratio, 4),
                "match_percent": round(match_ratio * 100, 1),
                "weighted_score": round(raw_weight_sum, 4),
                "weighted_percent": round(weighted_ratio * 100, 1),
                "matched_hpo_codes": matched_hpo_codes,
            })

        results.sort(
            key=lambda x: (
                -x["weighted_percent"],
                -x["match_percent"],
                -x["matched_hpo_count"],
                x["disease_name"] or ""
            )
        )

        return results[:top_k]
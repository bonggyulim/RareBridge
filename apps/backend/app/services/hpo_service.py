import os
import json
import logging
from typing import List, Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
logger = logging.getLogger(__name__)


class HpoService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            logger.error("GEMINI_API_KEY not found")

        self.client = genai.Client(api_key=self.api_key)

    async def extract_hpo_codes(
        self,
        text: str,
        image_bytes: Optional[bytes] = None,
        image_content_type: Optional[str] = None,
    ) -> List[str]:
        prompt = f"""
You are a medical informatics expert specializing in the Human Phenotype Ontology (HPO).

The user provided:
1. Symptom text
2. Optional symptom-related images

Your tasks:
1. If the symptom text is in Korean, understand it and internally translate it into concise medical English.
2. Extract phenotype findings from the symptom text.
3. Extract phenotype findings from the image.
4. Combine findings from BOTH the text and the image.
5. Merge overlapping findings and remove duplicates.
6. Return 1 to 8 relevant HPO codes, ordered by relevance.
7. Return ONLY a JSON array of HPO codes.
8. Do not return explanations, markdown, or extra text.

Important rules:
- Text findings and image findings must both be reflected in the final output.
- Text-described symptoms have equal or higher priority than image-only findings.
- If the text mentions symptoms not visible in the image, still include them if they are valid phenotype findings.
- If the image shows findings not mentioned in the text, include them only if they are reasonably supported by the image.
- Do not invent unsupported findings.
- Do not return only one visually obvious image-based code if the text contains additional valid symptoms.

Example output:
["HP:0000988", "HP:0001945", "HP:0000969"]

User symptom text:
{text}
"""

        try:
            contents = [prompt]

            if image_bytes:
                if not image_content_type:
                    image_content_type = "image/jpeg"

                contents.append(
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=image_content_type,
                    )
                )

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )

            raw_text = (response.text or "").strip()
            logger.info(f"Raw HPO extraction response: {raw_text}")

            hpo_codes = self._parse_hpo_json(raw_text)

            if not isinstance(hpo_codes, list):
                return []

            valid_codes = []
            seen = set()

            for code in hpo_codes:
                if not isinstance(code, str):
                    continue

                normalized = code.strip().upper()
                if normalized.startswith("HP:") and normalized not in seen:
                    seen.add(normalized)
                    valid_codes.append(normalized)

            return valid_codes[:8]

        except Exception as e:
            logger.error(f"Error extracting HPO codes: {str(e)}")
            return []

    def _parse_hpo_json(self, raw_text: str):
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            cleaned = raw_text.strip()

            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]

            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]

            cleaned = cleaned.strip()
            return json.loads(cleaned)


hpo_service = HpoService()
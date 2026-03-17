import os
import json
import logging
from typing import List
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()
logger = logging.getLogger(__name__)


class HpoService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            logger.error("GEMINI_API_KEY not found")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def extract_hpo_codes(self, text: str) -> List[str]:
        """
        자연어 증상 텍스트에서 HPO 코드를 추출합니다.
        """
        prompt = f"""
        You are a medical informatics expert specializing in the Human Phenotype Ontology (HPO).
        The following is a natural language description of symptoms provided by a user (it may be in Korean or English):
        "{text}"

        1. If the symptoms are in Korean, translate them accurately to medical English first.
        2. Map these symptoms to the most relevant HPO (Human Phenotype Ontology) codes (e.g., HP:0001250).
        3. Only return a JSON list of the HPO codes. Do not provide any explanation or preamble.

        Example input: "발작, 발달 지연"
        Example output: ["HP:0001250", "HP:0001263"]
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )

            raw_text = (response.text or "").strip()
            logger.info(f"Raw HPO extraction response: {raw_text}")

            hpo_codes = json.loads(raw_text)

            if isinstance(hpo_codes, list):
                return [
                    code
                    for code in hpo_codes
                    if isinstance(code, str) and code.startswith("HP:")
                ]

            return []

        except Exception as e:
            logger.error(f"Error extracting HPO codes: {str(e)}")
            return []


hpo_service = HpoService()


# import os
# import json
# import logging
# from typing import List
# from dotenv import load_dotenv

# import google.generativeai as genai

# load_dotenv()
# logger = logging.getLogger(__name__)



# class HpoService:
#     def __init__(self):
#         self.api_key = os.getenv("GEMINI_API_KEY")

#         if not self.api_key:
#             logger.error("GEMINI_API_KEY not found")

#         genai.configure(api_key=self.api_key)
#         self.model = genai.GenerativeModel("gemini-2.5-flash") # (추가/수정)

#     async def extract_hpo_codes(self, text: str) -> List[str]:
#         """
#         자연어 증상 텍스트에서 HPO 코드를 추출합니다.
#         """
#         prompt = f"""
#         You are a medical informatics expert specializing in the Human Phenotype Ontology (HPO).
#         The following is a natural language description of symptoms provided by a user (it may be in Korean or English):
#         "{text}"

#         1. If the symptoms are in Korean, translate them accurately to medical English first.
#         2. Map these symptoms to the most relevant HPO (Human Phenotype Ontology) codes (e.g., HP:0001250).
#         3. Only return a JSON list of the HPO codes. Do not provide any explanation or preamble.

#         Example input: "발작, 발달 지연"
#         Example output: ["HP:0001250", "HP:0001263"]
#         """

#         try:
#             response = self.model.generate_content(
#                 prompt,
#                 generation_config={"response_mime_type": "application/json"}
#             )

#             logger.info(f"Raw HPO extraction response: {response.text}")
#             hpo_codes = json.loads(response.text)
#             # print('hpo_service:', hpo_codes)
#             # print('----')

#             if isinstance(hpo_codes, list):
#                 return [
#                     code
#                     for code in hpo_codes
#                     if isinstance(code, str) and code.startswith("HP:")
#                 ]

#             return []

#         except Exception as e:
#             logger.error(f"Error extracting HPO codes: {str(e)}")
#             return []

# hpo_service = HpoService()
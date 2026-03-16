from pydantic import BaseModel
from typing import List

class SymptomRequest(BaseModel):
    text: str

class HpoResponse(BaseModel):
    hpo_codes: List[str]

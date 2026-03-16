from pydantic import BaseModel
from typing import List, Optional

class DiagnosisRequest(BaseModel):
    text: str
    top_k: int = 5

class DiagnosisDiseaseItem(BaseModel):
    orpha_id: str
    disease_name: str
    definition: Optional[str] = None
    matched_hpo_count: int
    input_hpo_count: int
    match_ratio: float

class DiagnosisResult(BaseModel):
    text: str
    hpo_codes: List[str]
    diseases: List[DiagnosisDiseaseItem]

class DiagnosisResponse(BaseModel):
    success: bool
    data: DiagnosisResult
from pydantic import BaseModel, Field
from typing import List, Optional

class DiagnosisRequest(BaseModel):
    text: str
    top_k: int = Field(default=5, ge=1, le=20)

class DiagnosisDiseaseItem(BaseModel):
    orpha_id: str
    disease_name: str
    definition: Optional[str] = None
    matched_hpo_count: int
    input_hpo_count: int
    match_ratio: float
    match_percent: float
    weighted_score: float
    weighted_percent: float
    matched_hpo_codes: List[str] = Field(default_factory=list)

class DiagnosisResult(BaseModel):
    text: str
    hpo_codes: List[str]
    diseases: List[DiagnosisDiseaseItem]

class DiagnosisResponse(BaseModel):
    success: bool
    data: DiagnosisResult
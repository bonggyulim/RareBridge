from pydantic import BaseModel, Field
from typing import List, Optional

class DiseaseSearchRequest(BaseModel):
    hpo_codes: List[str]
    top_k: int = Field(default=5, ge=1, le=20)

class DiseaseItem(BaseModel):
    orpha_id: Optional[str] = None
    disease_name: Optional[str] = None
    definition: Optional[str] = None
    matched_hpo_count: int
    input_hpo_count: int
    match_ratio: float
    match_percent: float
    weighted_score: float
    weighted_percent: float
    matched_hpo_codes: List[str] = Field(default_factory=list)

class DiseaseSearchResponse(BaseModel):
    success: bool
    data: List[DiseaseItem]
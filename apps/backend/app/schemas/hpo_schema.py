from pydantic import BaseModel
from typing import List

class HpoData(BaseModel):
    hpo_codes: List[str]

class HpoResponse(BaseModel):
    success: bool
    data: HpoData
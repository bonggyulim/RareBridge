from pydantic import BaseModel
from typing import Optional

class SymptomRequest(BaseModel):
    text: str

class SymptomResponse(BaseModel):
    text: str

class ErrorDetail(BaseModel):
    code: str
    message: str

class ApiResponse(BaseModel):
    success: bool
    data: Optional[SymptomResponse] = None
    error: Optional[ErrorDetail] = None
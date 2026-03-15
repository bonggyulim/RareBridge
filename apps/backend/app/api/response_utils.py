from typing import Any, Optional
from pydantic import BaseModel

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[dict] = None

def success_response(data: Any) -> dict:
    return {
        "success": True,
        "data": data
    }

def error_response(code: str, message: str, status_code: int = 400) -> dict:
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }

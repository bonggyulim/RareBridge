from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse

from app.services.hpo_service import hpo_service
from app.api.response_utils import success_response, error_response

router = APIRouter(tags=["HPO"])


@router.post("/extract")
async def extract_hpo(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    """
    자연어 증상 텍스트 + 선택 이미지에서 HPO 코드를 추출합니다.
    """
    if not text or not text.strip():
        return JSONResponse(
            status_code=400,
            content=error_response("INVALID_INPUT", "Text field is required")
        )

    try:
        image_bytes = None
        image_content_type = None

        if image is not None:
            allowed_types = {"image/jpeg", "image/png", "image/webp"}
            max_size_bytes = 5 * 1024 * 1024

            if image.content_type not in allowed_types:
                return JSONResponse(
                    status_code=400,
                    content=error_response("INVALID_IMAGE", "Uploaded file must be jpg, png, or webp.")
                )

            image_bytes = await image.read()

            if not image_bytes:
                return JSONResponse(
                    status_code=400,
                    content=error_response("INVALID_IMAGE", "Uploaded image is empty.")
                )

            if len(image_bytes) > max_size_bytes:
                return JSONResponse(
                    status_code=400,
                    content=error_response("IMAGE_TOO_LARGE", "Uploaded image is too large.")
                )

            image_content_type = image.content_type

        hpo_codes = await hpo_service.extract_hpo_codes(
            text=text.strip(),
            image_bytes=image_bytes,
            image_content_type=image_content_type,
        )

        if not hpo_codes:
            return success_response({"hpo_codes": []})

        return success_response({"hpo_codes": hpo_codes})

    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content=error_response(str(e), "Invalid input.")
        )
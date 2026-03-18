import re

def process_and_validate_symptom(text: str) -> str:
    cleaned_text = " ".join(text.split())

    if not cleaned_text:
        raise ValueError("EMPTY_INPUT")

    if len(cleaned_text) < 2:
        raise ValueError("TOO_SHORT")

    if len(cleaned_text) > 500:
        raise ValueError("TOO_LONG")

    if not re.search(r"[가-힣a-zA-Z0-9]", cleaned_text):
        raise ValueError("INVALID_INPUT")

    return cleaned_text
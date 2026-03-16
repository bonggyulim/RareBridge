import re

def process_and_validate_symptom(text: str):
    # 1. 전처리
    cleaned_text = " ".join(text.split())

    # 2. 공백만 있는 경우
    if not cleaned_text:
        raise ValueError("EMPTY_INPUT")

    # 3. 글자 수 검사
    if len(cleaned_text) < 2:
        raise ValueError("TOO_SHORT")

    if len(cleaned_text) > 500:
        raise ValueError("TOO_LONG")

    # 4. 유효 문자 포함 여부
    if not re.search(r"[가-힣a-zA-Z0-9]", cleaned_text):
        raise ValueError("INVALID_INPUT")

    return cleaned_text
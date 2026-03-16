# 입력 검증 및 텍스트 처리
import re
from fastapi import HTTPException

def process_and_validate_symptom(text: str):
    # 1. 전처리: 앞뒤 공백 제거 및 연속 공백 정리 (AI를 활용 시 토큰 사용량 최적화)
    cleaned_text = " ".join(text.split())

    # 2. 검증: 공백만 있는 경우
    if not cleaned_text:
        raise ValueError("EMPTY_INPUT")

    # 3. 글자 수 검사
    if len(cleaned_text) < 2:
        raise ValueError("TOO_SHORT") # "최소 2자 이상 입력해주세요."

    if len(cleaned_text) > 500:
        raise ValueError("TOO_LONG")  # "500자 이내로 입력해주세요."

    # 4. 검증: 유효 문자(한/영/숫) 포함 여부
    if not re.search(r'[가-힣a-zA-Z0-9]', cleaned_text):
        raise ValueError("INVALID_INPUT")
    
    # 5. 가공된 텍스트 반환
    return cleaned_text


# 추가로 고려할 검증? 예외처리?
# 만약 입력이 증상과 관련된 내용이 아니라면?? ex. 오늘 날씨가 좋다 -> AI에게 검증맡기기

# Gemini 할당량 초과: "현재 요청이 너무 많습니다. 잠시 후 시도해주세요." (함수 예외처리로 추가할 것)
# API 키 오류: "서버 설정 오류가 발생했습니다." (500 으로 전역 처리 추천)

# 전역 예외 처리 (main)
# "예상치 못한 서버 에러(500 에러)" 
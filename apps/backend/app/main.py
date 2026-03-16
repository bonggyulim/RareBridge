from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 우리가 만들 컨트롤러를 불러옵니다
from api import symptom_controller
# from api import symptom_controller, disease_controller, hpo_controller

app = FastAPI(title="RareBridge API", version="1.0.0")

# 프론트엔드(3000번)와 통신을 허용하는 설정 (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 컨트롤러 연결 (prefix를 /api/v1으로 설정)
# 1. 증상 분석 입구 (Base Path: /api/v1/symptoms)
app.include_router(symptom_controller.router, prefix="/api/v1/symptoms", tags=["Symptoms"])

# 2. HPO 검색 입구 (Base Path: /api/v1/hpo)
# app.include_router(hpo_controller.router, prefix="/api/v1/hpo", tags=["HPO"])

# 3. 질환 조회 입구 (Base Path: /api/v1/diseases)
# app.include_router(disease_controller.router, prefix="/api/v1/diseases", tags=["Diseases"])


@app.get("/")
def home():
    return {"message": "RareBridge Server is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


# 에러처리 전역으로
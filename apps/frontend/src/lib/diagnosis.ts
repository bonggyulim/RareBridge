// apps/frontend/lib/diagnosis.ts
import { DiagnosisResponse } from '@/app/types/diagnosis';

export const postDiagnosis = async (text: string): Promise<DiagnosisResponse> => {
    // 백엔드 main.py 설정에 따른 정확한 경로
    const API_URL = "http://localhost:9000/api/v1/diagnosis";

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            top_k: 5
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || '진단 분석 중 오류가 발생했습니다.';
        throw new Error(message);
    }

    // 백엔드 DiagnosisResponse { success: bool, data: DiagnosisResult } 구조 그대로 반환
    return await response.json();
};

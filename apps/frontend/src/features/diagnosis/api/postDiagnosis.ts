import { DiagnosisResponse } from '../model/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://rarebridge-backend.onrender.com/';

export async function postDiagnosis(text: string): Promise<DiagnosisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/diagnosis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      top_k: 5,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      errorData?.message ||
      '진단 분석 중 오류가 발생했습니다.';
    throw new Error(message);
  }

  return response.json();
}
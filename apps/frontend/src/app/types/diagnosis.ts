export interface DiagnosisDiseaseItem {
  orpha_id: string;
  disease_name: string;
  definition: string | null;
  matched_hpo_count: number;
  input_hpo_count: number;
  match_ratio: number;
  match_percent: number;
  weighted_ratio: number;
  weighted_percent: number;
  matched_hpo_list: { hpo_id: string; name: string }[];
}

// 백엔드 DiagnosisResult 모델 (data 필드 내부 구조)
export interface DiagnosisResult {
  text: string;
  hpo_codes: string[];
  diseases: DiagnosisDiseaseItem[];
}

// 최종 백엔드 응답 규격
export interface DiagnosisResponse {
  success: boolean;
  data: DiagnosisResult;
}

// (참고) 이전 코드와 호환성을 위해 DiagnosisData라는 이름을 DiagnosisResult의 별칭으로 써도 됩니다.
export type DiagnosisData = DiagnosisResult;

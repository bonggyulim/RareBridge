export interface DiagnosisDiseaseItem {
  orpha_id: string;
  disease_name: string;
  definition: string | null;
  matched_hpo_count: number;
  input_hpo_count: number;
  match_ratio: number;
  match_percent: number;
  weighted_score: number;
  weighted_percent: number;
  matched_hpo_codes: string[];
}

export interface DiagnosisResult {
  text: string;
  hpo_codes: string[];
  diseases: DiagnosisDiseaseItem[];
}

export interface DiagnosisResponse {
  success: boolean;
  data: DiagnosisResult;
}
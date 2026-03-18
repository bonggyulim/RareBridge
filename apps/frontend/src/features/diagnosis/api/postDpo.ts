import axios from 'axios';
import type {
  DiagnosisDiseaseItem,
  DiagnosisResult,
  DpoResponse,
} from '@/features/diagnosis/model/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://rarebridge-backend.onrender.com';

export async function postDpo(
  text: string,
  imageFile: File | null
): Promise<DpoResponse> {
  const formData = new FormData();
  formData.append('text', text);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const hpoResponse = await axios.post(
    `${API_BASE_URL}/api/v1/hpo/extract`,
    formData
  );

  const hpoCodes: string[] = hpoResponse.data?.data?.hpo_codes ?? [];

  if (hpoCodes.length === 0) {
    return {
      success: true,
      data: {
        text,
        hpo_codes: [],
        diseases: [],
      },
    };
  }

  const diseaseResponse = await axios.post(
    `${API_BASE_URL}/api/v1/diseases/search`,
    {
      hpo_codes: hpoCodes,
      top_k: 5,
    }
  );

  const diseases: DiagnosisDiseaseItem[] = diseaseResponse.data?.data ?? [];

  const result: DiagnosisResult = {
    text,
    hpo_codes: hpoCodes,
    diseases,
  };

  return {
    success: diseaseResponse.data?.success ?? false,
    data: result,
  };
}
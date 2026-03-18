export type SymptomValidationError =
  | 'EMPTY_INPUT'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'INVALID_INPUT';

export function validateSymptomText(text: string): string {
  const cleanedText = text.split(/\s+/).join(' ').trim();

  if (!cleanedText) {
    throw new Error('EMPTY_INPUT');
  }

  if (cleanedText.length < 2) {
    throw new Error('TOO_SHORT');
  }

  if (cleanedText.length > 500) {
    throw new Error('TOO_LONG');
  }

  if (!/[가-힣a-zA-Z0-9]/.test(cleanedText)) {
    throw new Error('INVALID_INPUT');
  }

  return cleanedText;
}

export function getSymptomValidationMessage(code: string) {
  switch (code) {
    case 'EMPTY_INPUT':
      return '증상 내용을 입력해 주세요.';
    case 'TOO_SHORT':
      return '증상 내용은 최소 2자 이상 입력해 주세요.';
    case 'TOO_LONG':
      return '증상 내용은 500자 이하로 입력해 주세요.';
    case 'INVALID_INPUT':
      return '한글, 영문, 숫자 중 하나 이상 포함해 주세요.';
    default:
      return '입력값을 다시 확인해 주세요.';
  }
}
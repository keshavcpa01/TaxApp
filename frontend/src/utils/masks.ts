export const TIN_MASK = '999-99-9999';
export const ZIP_MASK = '99999';
export const PHONE_MASK = '(999) 999-9999';
export const EIN_MASK = '99-9999999';
export const DATE_MASK = '99/99/9999';

// Optional formatter (if needed outside of UI)
export function formatTIN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  return digits.replace(/(\d{3})(\d{2})(\d{0,4})/, '$1-$2-$3');
}

export function formatEIN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  return digits.replace(/(\d{2})(\d{0,7})/, '$1-$2');
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  return digits.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
}

// lib/price.ts
export function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;

  const cleaned = trimmed.replace(/,/g, '');
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;

  return n;
}

export function toNumberOrZero(value: string): number {
  const n = parsePrice(value);
  return n === null ? 0 : n;
}

export function formatPrice(n: number): string {
  return n.toLocaleString('ja-JP');
}

/** "1,500,000" のような入力を数値化（不正なら null） */
export function parsePositiveNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;

  const cleaned = trimmed.replace(/,/g, '');
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;

  return n;
}

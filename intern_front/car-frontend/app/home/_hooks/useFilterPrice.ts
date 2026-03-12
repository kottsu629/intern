export const parsePrice = (v: string): number | null => {
  const n = Number(v.trim().replace(/,/g, ""));
  return isNaN(n) || v.trim() === "" ? null : n;
};

export const formatPrice = (n: number): string => n.toLocaleString("ja-JP");

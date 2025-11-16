
let hits: number[] = [];
export function allowAnalyze(max=5, windowMs=10_000) {
  const now = Date.now();
  hits = hits.filter(t => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  return true;
}


// src/lib/mapper/localMapper.ts
export type FamilyScore = {
  label: string;      // "Albanian", "Latin", "Proto-Indo-European"
  score: number;      // 0..100
  rationale?: string[];
  dialect?: 'geg'|'tosk';
};

export function mapWordToLanguageFamiliesLocal(word: any, voicePath: string[]): FamilyScore[] {
  const wstr = (word ?? '').toString();
  const w = wstr.normalize('NFC').toLowerCase();
  const vp = (voicePath ?? []).map(String);

  const scores: FamilyScore[] = [];

  // --- trivial baseline (never return empty) ---
  // Adjust your real heuristics here; this is just safe scaffolding.
  let alb = 0, latin = 0, pie = 0;

  // very cheap signals
  if (/[ëç]/.test(w)) alb += 40;                 // ë/ç => Albanian tilt
  if (/(gj|xh|ll|rr|nj|zh|sh|dh|th)/.test(w)) alb += 30; // common digraphs
  if (/[aeiouy]/.test(w)) latin += 20;           // latin vowels present
  if (/[aoe]/.test(w)) pie += 10;                // A/E/O core

  // small boosts from voicePath shape if you want
  if (vp.join('') === 'AE') latin += 20;
  if (vp.includes('Ë')) alb += 20;

  // push only well-formed entries
  if (alb > 0) scores.push({ label: 'Albanian', score: alb, rationale: [] });
  if (latin > 0) scores.push({ label: 'Latin', score: latin, rationale: [] });
  if (pie > 0) scores.push({ label: 'Proto-Indo-European', score: pie, rationale: [] });

  // never return empty
  if (scores.length === 0) scores.push({ label: 'Unknown', score: 1, rationale: ['no signals'] });

  // sort by score desc
  scores.sort((a,b) => b.score - a.score);

  // dialect tagging for top Albanian entry
  const top = scores[0];
  if (top && top.label === 'Albanian') {
    top.dialect = /[ëç]/i.test(w) ? 'tosk' : 'geg';
  }

  return scores;
}


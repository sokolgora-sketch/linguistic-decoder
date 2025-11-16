
export type FamilyScore = {
  label: string;
  score: number;
  rationale?: string[];
  dialect?: 'geg'|'tosk';
};

export function mapWordToLanguageFamiliesLocal(word: any, voicePath: string[]): FamilyScore[] {
  const wstr = (word ?? '').toString();
  const w = wstr.normalize('NFC').toLowerCase();
  const vp = (voicePath ?? []).map(String);

  const scores: FamilyScore[] = [];
  let alb = 0, latin = 0, pie = 0;

  // --- signals ---
  // diacritics → strong Albanian tilt
  if (/[ëç]/.test(w)) alb += 40;

  // simple Albanian morphology cues (deterministic, low weight):
  // - “vet…” prefix (self-)
  // - “vend” stem
  // - suffix “-je” (very common nominalizer)
  // - Albanian digraphs
  const hasAlbMorph =
    /^vet/.test(w) || /vend/.test(w) || /je$/.test(w) ||
    /(sh|zh|xh|gj|ll|rr|nj|dh|th)/.test(w);
  if (hasAlbMorph) alb += 15;

  // voice path nudge
  if (vp.join('') === 'AE') latin += 20;   // common in Latin patterns
  if (vp.includes('Ë')) alb += 20;

  // very light baselines so we never return empty
  if (/[aeiouy]/.test(w)) latin += 10;
  if (/[aoe]/.test(w)) pie += 10;

  if (alb > 0)   scores.push({ label: 'Albanian', score: alb, rationale: [] });
  if (latin > 0) scores.push({ label: 'Latin', score: latin, rationale: [] });
  if (pie > 0)   scores.push({ label: 'Proto-Indo-European', score: pie, rationale: [] });

  if (scores.length === 0)
    scores.push({ label: 'Unknown', score: 1, rationale: ['no signals'] });

  scores.sort((a,b) => b.score - a.score);

  const top = scores[0];
  if (top && top.label === 'Albanian') {
    top.dialect = /[ëç]/i.test(w) ? 'tosk' : 'geg';
  }

  return scores;
}

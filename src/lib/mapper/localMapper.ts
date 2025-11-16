
// src/lib/mapper/localMapper.ts
export type FamilyScore = {
  label: string;
  score: number;         // 0–100
  notes?: string[];
  dialect?: "geg" | "tosk";
};

const ALB_DIGRAPHS = ["gj","q","xh","ll","rr","nj","zh","sh","dh","th","ç"]; // keep ç here for completeness
const ALB_MORPHS   = [
  "vet","vetë","vend","vendos","-je","-sje","-im","-tar","-ues","-shëm","-tari","-imi",
  "bashk","komb","shqip","popull","lëviz","drejt","-ëri","-uar"
];

function hitCount(word: string, list: string[]) {
  const w = word.toLowerCase();
  return list.reduce((n, x) => n + (w.includes(x) ? 1 : 0), 0);
}

export function mapWordToLanguageFamiliesLocal(word: any, voicePath: string[]): FamilyScore[] {
  const wstr = (word ?? '').toString();
  const w = wstr.normalize('NFC').toLowerCase();

  const vp = (voicePath ?? []).map(String);
  const notes: string[] = [];
  
  const scoreMap: Record<string, number> = { albanian: 0, latin: 0, pie: 0 };

  const hasDia = /[ëç]/.test(w);
  const digHits = hitCount(w, ALB_DIGRAPHS);
  const morphHits = hitCount(w, ALB_MORPHS);

  if (hasDia)        { scoreMap.albanian += 3; notes.push("ë/ç present"); }
  if (digHits > 0)   { scoreMap.albanian += 2; notes.push("Albanian digraph(s)"); }
  if (morphHits > 0) { scoreMap.albanian += 1; notes.push("Albanian morpheme(s)"); }

  if (!hasDia && digHits === 0 && morphHits === 0) {
    scoreMap.latin += 2; notes.push("ASCII only; no Albanian cues");
  }

  if (/[AEO]/.test(vp.join(""))) { scoreMap.pie += 1; notes.push("A/E/O distribution"); }

  const sum = scoreMap.albanian + scoreMap.latin + scoreMap.pie || 1;
  const pct = (n: number) => Math.round((n / sum) * 100);

  const scores: FamilyScore[] = [];
  if (scoreMap.albanian > 0) {
    scores.push({ label: "Albanian", score: pct(scoreMap.albanian), notes });
  }
  if (scoreMap.latin > 0) {
    scores.push({ label: "Latin", score: pct(scoreMap.latin), notes });
  }
  if (scoreMap.pie > 0) {
    scores.push({ label: "Proto-Indo-European", score: pct(scoreMap.pie), notes });
  }
  
  scores.sort((a,b) => b.score - a.score);

  // --- Dialect tagging for Albanian (fair, deterministic) ---
  const top = scores.find(s => s.label === 'Albanian');
  if (top) {
    top.dialect = hasDia ? 'tosk' : 'geg';
  }

  return scores;
}

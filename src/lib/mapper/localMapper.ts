
// src/lib/mapper/localMapper.ts
export type FamilyScore = {
  family: string;
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
  let alb = 0, latin = 0, pie = 0;

  const hasDia = /[ëç]/.test(w);
  const digHits = hitCount(w, ALB_DIGRAPHS);
  const morphHits = hitCount(w, ALB_MORPHS);

  if (hasDia)        { alb += 3; notes.push("ë/ç present"); }
  if (digHits > 0)   { alb += 2; notes.push("Albanian digraph(s)"); }
  if (morphHits > 0) { alb += 1; notes.push("Albanian morpheme(s)"); }

  const dialect: FamilyScore["dialect"] =
    hasDia ? "tosk" : (digHits > 0 || morphHits > 0 ? "geg" : undefined);

  if (!hasDia && digHits === 0 && morphHits === 0) {
    latin += 2; notes.push("ASCII only; no Albanian cues");
  }

  if (/[AEO]/.test(vp.join(""))) { pie += 1; notes.push("A/E/O distribution"); }

  const sum = alb + latin + pie || 1;
  const pct = (n: number) => Math.round((n / sum) * 100);

  const out: FamilyScore[] = [];
  if (alb > 0) {
    out.push({ family: "Albanian", score: pct(alb), notes, dialect });
  }
  if (latin > 0) {
    out.push({ family: "Latin", score: pct(latin), notes });
  }
  if (pie > 0) {
    out.push({ family: "Proto-Indo-European", score: pct(pie), notes });
  }
  
  out.sort((a,b) => b.score - a.score);

  return out;
}

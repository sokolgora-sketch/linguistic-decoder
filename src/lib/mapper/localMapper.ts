// src/lib/mapper/localMapper.ts
export type FamilyScore = { family: string; score: number; notes?: string[]; dialect?: string };

const ALB_DIGRAPHS = ["gj","q","xh","ll","rr","nj","zh","sh","dh","th","ç"];
const ALB_MORPHS   = ["vet","vend","-je","-sje","-im","-tar","-ues","-shëm","-tari","-imi"];

function hasAny(word: string, list: string[]) {
  const w = word.toLowerCase();
  return list.some(x => w.includes(x));
}

export function mapWordToLanguageFamiliesLocal(word: string, voicePath: string[]): FamilyScore[] {
  const w = word.normalize("NFC").toLowerCase();
  const notes: string[] = [];
  let alb = 0, latin = 0, pie = 0;

  const hasDia  = /[ëç]/.test(w);
  const digHits = ALB_DIGRAPHS.filter(d => w.includes(d)).length;
  const morph   = hasAny(w, ALB_MORPHS);

  // Albanian scoring (dialect-aware)
  if (hasDia) { alb += 3; notes.push("ë/ç present"); }
  if (digHits > 0) { alb += 2; notes.push("Albanian digraphs"); }
  if (morph) { alb += 1; notes.push("Albanian morpheme"); }
  // Treat no-diacritics but strong Albanian pattern as Gegë orthography
  const dialect = hasDia ? "tosk" : (digHits > 0 || morph ? "geg" : undefined);

  // Latin baseline when plain ASCII and no Albanian cues
  if (!hasDia && digHits === 0 && !morph) {
    latin += 2; notes.push("ASCII only; no Albanian cues");
  }

  // PIE baseline from vowel distribution (very light)
  const vp = (voicePath || []).join("");
  if (/A|E|O/.test(vp)) { pie += 1; notes.push("A/E/O distribution"); }

  // normalize → percentages
  const sum = alb + latin + pie || 1;
  const pct = (n: number) => Math.round((n / sum) * 100);

  const out: FamilyScore[] = [];
  if (alb > 0) {
    out.push({ family: "Albanian", score: pct(alb), notes: notes.slice(), dialect });
  }
  if (latin > 0) {
    out.push({ family: "Latin", score: pct(latin), notes: notes.slice() });
  }
  if (pie > 0) {
    out.push({ family: "Proto-Indo-European", score: pct(pie), notes: notes.slice() });
  }
  

  // sort desc
  out.sort((a,b) => b.score - a.score);
  return out;
}
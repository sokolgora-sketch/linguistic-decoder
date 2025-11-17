
import { CUES, Family } from "./cues";

export type Alphabet = "auto"|Family;

function countHits(w: string, list?: string[]) {
  if (!list || list.length === 0) return 0;
  const s = w.toLowerCase();
  return list.reduce((n, x) => n + (s.includes(x) ? 1 : 0), 0);
}

function scoreFamily(word: string, voicePath: string[], fam: Family) {
  const cfg = CUES[fam];
  const W = { script:1, diacritics:1, digraph:1, morpheme:1, vp:1, ...(cfg.weights||{}) };

  const w = word.normalize("NFC");
  let score = 0;

  if (cfg.script && cfg.script.test(w))      score += W.script;
  if (cfg.diacritics && cfg.diacritics.test(w)) score += W.diacritics;
  if (cfg.digraphs)   score += countHits(w, cfg.digraphs)   * W.digraph;
  if (cfg.morphemes)  score += countHits(w, cfg.morphemes)  * W.morpheme;

  // voicePath distribution: presence of A/E/O gives a tiny nudge to PIE/Latin/Greek roots
  const vp = (voicePath||[]).join("");
  if (/[AEO]/.test(vp)) score += W.vp;

  return score;
}

export type DetectResult = { winner: Family; scores: { family: Family; score: number }[] };

export function detectAlphabetFair(word: string, voicePath: string[], selected: Alphabet): DetectResult {
  if (selected !== "auto") {
    // respect explicit user choice, but still compute scores for display
    const scores = (["albanian","latin","sanskrit","ancient_greek","pie"] as Family[])
      .map(f => ({ family:f, score: scoreFamily(word, voicePath, f) }))
      .sort((a,b)=> b.score - a.score);
    return { winner: selected as Family, scores };
  }

  const families = ["albanian","latin","sanskrit","ancient_greek","pie"] as Family[];
  const scores = families.map(f => ({ family:f, score: scoreFamily(word, voicePath, f) }))
                         .sort((a,b)=> b.score - a.score);

  // normalize to percentages (for UI)
  const sum = scores.reduce((s,x)=> s + x.score, 0) || 1;
  const pct = scores.map(x => ({ family:x.family, score: Math.round((x.score/sum)*100) }));

  // choose winner fairly: highest score; if all near-zero and ASCII, default latin
  let winner = pct[0].family;
  const allZeroish = scores.every(x => x.score === 0);
  const asciiOnly = /^[\u0000-\u007F]*$/.test(word);
  if (allZeroish && asciiOnly) winner = "latin";

  // Dialect hint for Albanian
  if (winner === 'albanian' && pct[0].score > 0) {
    const w = word.normalize('NFC').toLowerCase();
    let geg = 0, tosk = 0;
    if (/[âà]/.test(w) || /(ç|xh)/.test(w)) geg += 1;
    if (/[ë]/.test(w) || /(q|gj)/.test(w)) tosk += 1;
    if (geg > tosk) {
      pct[0] = { ...pct[0], dialect: 'geg' } as any;
    } else if (tosk > geg) {
      pct[0] = { ...pct[0], dialect: 'tosk' } as any;
    }
  }


  return { winner, scores: pct };
}

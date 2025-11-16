
import { VOWELS } from "./sevenVoicesCore";
import type { Vowel } from "./sevenVoicesCore";
import { chooseProfile, classRange } from "./languages";
import type { LangProfile, CClass } from "./languages";
import { getManifest } from "@/engine/manifest";

export function toVowel(ch: string): Vowel | null {
  const u = ch.toUpperCase();
  return u === "Ë" ? "Ë" : VOWELS.includes(u as any) ? (u as Vowel) : null;
}

export function isVowelChar(ch: string) {
  return /[AEIOUYËaeiouyë]/.test(ch);
}

export function extractBase(word: string): Vowel[] {
  const out: Vowel[] = [];
  const s = word.normalize("NFC").toLowerCase();
  for (let i = 0; i < s.length; i++) {
    if (!isVowelChar(s[i])) continue;

    // special case for 'ie' -> I
    if (i < s.length - 1 && s[i] === "i" && s[i + 1] === "e") {
      if (out.length === 0 || out[out.length - 1] !== "I") {
        out.push("I");
      }
      i++; // skip 'e'
      continue;
    }

    const v = toVowel(s[i])!;
    if (out.length && out[out.length - 1] === v) continue; // collapseDupes
    out.push(v);
  }
  return out;
}

export function normalizeTerminalY(seq: Vowel[], rawWord: string): Vowel[] {
  if (
    seq.length &&
    seq[seq.length - 1] === "Y" &&
    rawWord.toLowerCase().endsWith("y")
  ) {
    const out = seq.slice();
    out[out.length - 1] = "I";
    return out;
  }
  return seq;
}


export function computeC(voicePath: Vowel[], consClasses: CClass[], RING: Record<Vowel, number>): number {
  let c = 0;
  const hops = Math.max(0, voicePath.length - 1);
  for (let i = 0; i < hops; i++) {
    const cls = i < consClasses.length ? consClasses[i] : "Glide";
    const d = Math.abs(RING[voicePath[i + 1]] - RING[voicePath[i]]);
    const [lo, hi] = classRange(cls);
    if (d < lo) c += lo - d;
    else if (d > hi) c += d - hi;
  }
  return c;
}

/**
 * Extract the raw substrings between the normalized base vowels.
 * Pure read: does NOT mutate state, does NOT depend on scoring.
 */
function extractWindows(word: string, baseSeq: Vowel[]): string[] {
  const s = word.normalize("NFC");
  // find indices of base vowels in raw string (first match per base slot)
  const pos: number[] = [];
  let vi = 0;
  for (let i = 0; i < s.length && vi < baseSeq.length; i++) {
    const v = toVowel(s[i]);
    if (!v) continue;
    if (v === baseSeq[vi]) {
      pos.push(i);
      vi++;
    }
  }

  const windows: string[] = [];
  for (let k = 0; k < pos.length - 1; k++) {
    windows.push(s.slice(pos[k] + 1, pos[k + 1]));
  }
  return windows;
}

function classifyWindow(chars: string, P: LangProfile): CClass {
  let s = chars.toLowerCase();
  if (P.pre) s = P.pre(s);

  for (let i = 0; i < s.length - 1; i++) {
    const dg = s.slice(i, i + 2);
    if (P.DIGRAPH[dg as keyof typeof P.DIGRAPH])
      return P.DIGRAPH[dg as keyof typeof P.DIGRAPH];
  }
  for (const ch of s) {
    if (/[aeiouyë]/i.test(ch)) continue;
    if (P.LETTER[ch as keyof typeof P.LETTER])
      return P.LETTER[ch as keyof typeof P.LETTER];
  }
  return "NonSibilantFricative";
}


/**
 * Optional debug export (handy for UI): returns both windows and classes.
 */
export function readWindowsDebug(
  word: string,
  baseSeq: Vowel[],
  profile: LangProfile
): { windows: string[]; classes: CClass[]; edge: EdgeInfo, edgeWindows: string[] } {
  const windows = extractWindows(word, baseSeq);
  const classes = windows.map((w) => classifyWindow(w, profile));
  
  const edge = readEdgeWindows(word, profile);
  const edgeWindows: string[] = [];
  if (edge.prefix?.cls) edgeWindows.push(`prefix '${edge.prefix.raw}' → ${edge.prefix.cls}`);
  if (edge.suffix?.cls) edgeWindows.push(`suffix '${edge.suffix.raw}' → ${edge.suffix.cls}`);

  return { windows, classes, edge, edgeWindows };
}


// --- Edge windows (prefix/suffix) support ---

export type EdgeInfo = {
  prefix?: { raw: string; cls: string | null };
  suffix?: { raw: string; cls: string | null };
};

function takePrefixCluster(word: string): string {
  let i = 0;
  while (i < word.length && !isVowelChar(word[i])) i++;
  return word.slice(0, i);
}

function takeSuffixCluster(word: string): string {
  let i = word.length - 1;
  while (i >= 0 && !isVowelChar(word[i])) i--;
  return word.slice(i + 1);
}

// If you already have a classifier, reuse it. Otherwise, a simple fallback mapper:
function classifyClusterByProfile(cluster: string, profile: LangProfile): CClass | null {
  if (!cluster) return null;

  // Fallback: rough class map (keep consistent with your main table)
  const c = cluster.toLowerCase();
  const hit = (list: string[]) => list.some(x => c.includes(x));

  if (hit(["p","b","t","d","k","g","q","c","ck","gj"])) return "Plosive";
  if (hit(["ch","j","dz","ts","dʒ","tʃ","ç","xh"]))     return "Affricate";
  if (hit(["s","z","sh","zh","x"]))                      return "SibilantFricative";
  if (hit(["f","v","h","th","ph","dh"]))                 return "NonSibilantFricative";
  if (hit(["m","n","nj"]))                                return "Nasal";
  if (hit(["ll","rr","l","r"]))                           return "Liquid";
  if (hit(["w","y"]))                                     return "Glide";
  return "NonSibilantFricative";
}

const manifest = getManifest();
const CLASS_DELTA_PREF: Record<string, [number, number]> = Object.entries(manifest.consonant.classes).reduce((acc, [key, val]) => {
  acc[key] = val.preferredDelta;
  return acc;
}, {} as Record<string, [number, number]>);


export function readEdgeWindows(word: string, profile: LangProfile): EdgeInfo {
  const prefixRaw = takePrefixCluster(word);
  const suffixRaw = takeSuffixCluster(word);
  const prefixCls = classifyClusterByProfile(prefixRaw, profile);
  const suffixCls = classifyClusterByProfile(suffixRaw, profile);
  return {
    prefix: prefixRaw ? { raw: prefixRaw, cls: prefixCls } : undefined,
    suffix: suffixRaw ? { raw: suffixRaw, cls: suffixCls } : undefined,
  };
}

// Small penalty if hop Δ is outside preferred range; small bonus if inside.
// edgeWeight is tiny by design so it never dominates interior windows.
export function edgeBiasPenalty(deltaAbs: number, cls: string | null, edgeWeight = 0.25): number {
  if (!cls) return 0;
  const pref = CLASS_DELTA_PREF[cls] ?? [0, 3];
  const [lo, hi] = pref;
  if (deltaAbs >= lo && deltaAbs <= hi) {
    return -edgeWeight; // tiny reward for alignment
  }
  // distance outside range
  const dist = deltaAbs < lo ? (lo - deltaAbs) : (deltaAbs - hi);
  return edgeWeight * Math.min(2, dist); // cap
}

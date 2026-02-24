// Zhuyin (Bopomofo) Carrier Extractor v0.1
// Deterministic: maps Zhuyin vowel/final symbols -> Seven Voices.
//
// Scope v0.1:
// - We treat Zhuyin consonant symbols as non-carriers.
// - We strip tone marks: ˉ ˊ ˇ ˋ ˙
// - We apply a minimal context rule:
//     ㄣ/ㄥ act as CODA (no vowel) when preceded by ㄧ/ㄨ/ㄩ (medials).
//
// IMPORTANT:
// - This is not a Mandarin phonology engine.
// - It is a deterministic instrument lens to extract vowel-carrier structure.

export type SevenVoice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
export type VoiceOrNone = SevenVoice | "NONE";

export type ZhuyinToken = {
  sym: string;
  kind: "vowel" | "consonant" | "tone" | "unknown";
  voices: SevenVoice[];
};

export type ZhuyinCarrierOut = {
  voices: SevenVoice[];
  primary: VoiceOrNone;
  tokens: ZhuyinToken[];
  unknown: string[];
};

const TONE_MARKS = new Set(["ˉ", "ˊ", "ˇ", "ˋ", "˙"]);

// Consonants (Zhuyin initials). We treat medials ㄧㄨㄩ as vowels below.
const ZHUYIN_CONSONANTS = new Set([
  "ㄅ","ㄆ","ㄇ","ㄈ","ㄉ","ㄊ","ㄋ","ㄌ","ㄍ","ㄎ","ㄏ",
  "ㄐ","ㄑ","ㄒ","ㄓ","ㄔ","ㄕ","ㄖ","ㄗ","ㄘ","ㄙ",
]);

// Medials that often behave like glides in Mandarin syllables.
// We still include them in voice paths, but primary selection can skip them.
const MEDIALS = new Set(["ㄧ", "ㄨ", "ㄩ"]);

// Mapping table: Zhuyin vowel/final symbols -> voice sequence.
// NOTE: ㄣ/ㄥ are context-sensitive (handled below).
const MAP: Record<string, SevenVoice[]> = {
  "ㄚ": ["A"],
  "ㄛ": ["O"],
  "ㄜ": ["Ë"],  // central/back-ish (ɤ/ə)
  "ㄝ": ["E"],  // front open-ish (ɛ)
  "ㄧ": ["I"],
  "ㄨ": ["U"],
  "ㄩ": ["Y"],

  "ㄞ": ["A","I"],
  "ㄟ": ["E","I"],
  "ㄠ": ["A","O"],
  "ㄡ": ["O","U"],

  "ㄢ": ["A"],
  "ㄤ": ["A"],

  "ㄣ": ["Ë"], // becomes CODA after ㄧ/ㄨ/ㄩ
  "ㄥ": ["Ë"], // becomes CODA after ㄧ/ㄨ/ㄩ
  "ㄦ": ["Ë"],
};

function normalizeInput(x: unknown): string {
  const s = String(x ?? "").trim();
  if (!s) return "";
  // remove slashes, spaces; keep Zhuyin symbols and tone marks
  return s.replace(/[\/\s]+/g, "");
}

function mapSymbol(sym: string, prevVowelSym: string | null): SevenVoice[] | null {
  // context rule: ㄣ/ㄥ act as CODA when preceded by a medial
  if ((sym === "ㄣ" || sym === "ㄥ") && prevVowelSym && MEDIALS.has(prevVowelSym)) return [];
  return Object.prototype.hasOwnProperty.call(MAP, sym) ? MAP[sym] : null;
}

// Primary heuristic v0.1:
// - Choose the first vowel token whose symbol is NOT a medial (ㄧ/ㄨ/ㄩ).
// - If all vowels are medials, use the first vowel token.
// - Primary is the first voice in that token’s voice sequence.
function choosePrimary(tokens: ZhuyinToken[]): VoiceOrNone {
  const vowels = tokens.filter((t) => t.kind === "vowel" && t.voices.length);
  if (!vowels.length) return "NONE";
  const nonMedial = vowels.find((t) => !MEDIALS.has(t.sym));
  const pick = nonMedial ?? vowels[0];
  return pick.voices[0] ?? "NONE";
}

export function extractCarrierVoicesFromZhuyinV0_1(input: unknown): ZhuyinCarrierOut {
  const s = normalizeInput(input);
  const tokens: ZhuyinToken[] = [];
  const voices: SevenVoice[] = [];
  const unknown: string[] = [];

  let prevVowelSym: string | null = null;

  for (const sym of Array.from(s)) {
    if (TONE_MARKS.has(sym)) {
      tokens.push({ sym, kind: "tone", voices: [] });
      continue;
    }

    const mapped = mapSymbol(sym, prevVowelSym);

    if (mapped !== null) {
      // vowel/final symbol (possibly coda-empty due to context rule)
      tokens.push({ sym, kind: "vowel", voices: mapped });
      if (mapped.length) voices.push(...mapped);
      // update prev vowel sym ONLY when this symbol is a vowel symbol (even if coda-empty? no)
      // For ㄣ/ㄥ treated as coda, we don't want to overwrite prevVowelSym.
      if (!(sym === "ㄣ" || sym === "ㄥ")) prevVowelSym = sym;
      continue;
    }

    if (ZHUYIN_CONSONANTS.has(sym)) {
      tokens.push({ sym, kind: "consonant", voices: [] });
      continue;
    }

    // unknown symbol (could be punctuation or non-Zhuyin)
    tokens.push({ sym, kind: "unknown", voices: [] });
    unknown.push(sym);
  }

  const primary = choosePrimary(tokens);

  return { voices, primary, tokens, unknown };
}

// Export map for lock tests (read-only usage).
export const __ZHUYIN_MAP_V0_1 = MAP;

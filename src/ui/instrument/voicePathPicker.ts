const SEVEN_VOWELS = new Set(["A","E","I","O","U","Y","Ë"]);

function asVowelArray2(value: unknown): [string, string] | null {
    if (!Array.isArray(value) || value.length !== 2) return null;
    const a = String(value[0]).toUpperCase();
    const b = String(value[1]).toUpperCase();
    if (SEVEN_VOWELS.has(a) && SEVEN_VOWELS.has(b)) {
        return [a, b];
    }
    return null;
}

function normalizeVoicePathString(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const t = input
    .replace(/[→–—]/g, '-')
    .replace(/\s+/g, '')
    .toUpperCase();

  const parts = t.split('-').filter(c => SEVEN_VOWELS.has(c));
  if (parts.length === 0) return null;

  return parts.join('-');
}

function normalizeFromBasis(basis: unknown): string | null {
  if (typeof basis !== "string") return null;
  const chars = basis
    .split("")
    .map((c) => c.toUpperCase())
    .filter((c) => SEVEN_VOWELS.has(c));
  if (chars.length !== 2) return null;
  return `${chars[0]}-${chars[1]}`;
}

export type VoicePathTriplet = {
  detected: string | null;   // evidence authority (preferred)
  surface: string | null;    // raw surface (instrument)
  functional: string | null; // deepRoot functional
};

export function pickVoicePaths(payload: any): VoicePathTriplet {
  // 1) Authoritative detected path: evidence.surfaceVowels (already normalized by engine)
  const detectedFromEvidenceArr = asVowelArray2(payload?.evidence?.surfaceVowels);
  const detected =
    detectedFromEvidenceArr ? `${detectedFromEvidenceArr[0]}-${detectedFromEvidenceArr[1]}` : null;

  // 2) Raw surface path: heartInstrumentV1.surfaceVowels (can be pre-normalization)
  const rawArr = asVowelArray2(payload?.heartInstrumentV1?.surfaceVowels);
  const surface = rawArr ? `${rawArr[0]}-${rawArr[1]}` : null;

  // 3) Functional path (usually already string like "U→I" or "U-I")
  const functional =
    normalizeVoicePathString(payload?.deepRoot?.functionalRoots?.[0]?.vowelPath) ??
    null;

  // Fallbacks if evidence missing (older engine payloads):
  const fallbackDetected =
    detected ??
    normalizeFromBasis(payload?.heart?.math7?.primary?.basis) ??
    null;

  return {
    detected: fallbackDetected,
    surface,
    functional,
  };
}

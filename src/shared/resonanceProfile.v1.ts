// src/shared/resonanceProfile.v1.ts
//
// Resonance Profile Layer v0.1
// Deterministic “instrument readout” derived ONLY from emitted vowel data.
// No ranking, no scoring, no pass/fail.
//
// SSOT: Seven vowels = A,E,I,O,U,Y,Ë (imported from shared math7 core).

import {
  type SevenVowel as Voice,
  extractSevenVowelsFromString,
  isSevenVowel,
} from "@/shared/math7.core";

export type Bucket = "source" | "boundary" | "manifest";
export type DominantBucket = Bucket | "mixed" | "none";

export type ResonanceSignature =
  | "PURE_SOURCE"
  | "PURE_BOUNDARY"
  | "PURE_MANIFEST"
  | "MIXED_SOURCE_MANIFEST"
  | "MIXED_SOURCE_BOUNDARY"
  | "MIXED_MANIFEST_BOUNDARY"
  | "MIXED_ALL"
  | "NONE";

export type PolaritySymbol = "♀" | "⚲" | "♂" | "◐" | "∅";

export type VoiceColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet"
  | "mixed"
  | "none";

export type BucketCounts = { source: number; boundary: number; manifest: number };

export type ResonanceSliceV1 = {
  vowels: Voice[];
  bucketCounts: BucketCounts;
  dominantBucket: DominantBucket;
  signature: ResonanceSignature;
  polaritySymbol: PolaritySymbol;

  colorBand: VoiceColor[]; // aligned to vowels
  dominantColor: VoiceColor;

  transitions: string[]; // e.g. ["source→manifest"]
  notes: string[]; // deterministic only
};

export type ResonanceProfileV1 = {
  version: "resonance-profile-v1";
  surface: ResonanceSliceV1;
  normalized: ResonanceSliceV1;
};

export type BuildResonanceProfileInput = {
  surfaceWord: string;
  normalizedBasis?: string;

  // Preferred vowel source when provided (already extracted upstream).
  // (e.g. primaryPath.voicePath)
  primaryVoices?: Array<string | null | undefined>;
};

const COLOR_OF: Record<Voice, Exclude<VoiceColor, "mixed" | "none">> = {
  A: "red",
  E: "orange",
  I: "yellow",
  O: "green",
  U: "blue",
  Y: "indigo",
  "Ë": "violet",
};

function bucketOf(v: Voice): Bucket {
  // SOURCE: { U, Y, Ë }
  if (v === "U" || v === "Y" || v === "Ë") return "source";
  // BOUNDARY: { O }
  if (v === "O") return "boundary";
  // MANIFEST: { A, E, I }
  return "manifest";
}

function safeVoicesFromPrimary(primaryVoices?: Array<string | null | undefined>): Voice[] | null {
  if (!primaryVoices || !Array.isArray(primaryVoices)) return null;
  const out: Voice[] = [];
  for (const x of primaryVoices) {
    const s = String(x ?? "").toUpperCase();
    if (isSevenVowel(s)) out.push(s);
  }
  return out.length ? out : null;
}

function safeExtractVoicesFromString(s: string): Voice[] {
  // SSOT extraction: ignore non-vowels; deterministic; never throws.
  try {
    return extractSevenVowelsFromString(String(s ?? ""));
  } catch {
    return [];
  }
}

function countsFor(vowels: Voice[]): BucketCounts {
  const c: BucketCounts = { source: 0, boundary: 0, manifest: 0 };
  for (const v of vowels) c[bucketOf(v)] += 1;
  return c;
}

function presentBuckets(c: BucketCounts): Bucket[] {
  const out: Bucket[] = [];
  if (c.source > 0) out.push("source");
  if (c.boundary > 0) out.push("boundary");
  if (c.manifest > 0) out.push("manifest");
  return out;
}

function signatureForBuckets(present: Bucket[]): ResonanceSignature {
  if (present.length === 0) return "NONE";
  if (present.length === 1) {
    const b = present[0];
    if (b === "source") return "PURE_SOURCE";
    if (b === "boundary") return "PURE_BOUNDARY";
    return "PURE_MANIFEST";
  }
  if (present.length === 2) {
    const a = present[0];
    const b = present[1];
    const key = [a, b].sort().join("+");
    switch (key) {
      case "boundary+manifest":
        return "MIXED_MANIFEST_BOUNDARY";
      case "boundary+source":
        return "MIXED_SOURCE_BOUNDARY";
      case "manifest+source":
        return "MIXED_SOURCE_MANIFEST";
      default:
        return "MIXED_ALL";
    }
  }
  return "MIXED_ALL";
}

function dominantBucketFor(present: Bucket[], signature: ResonanceSignature): DominantBucket {
  if (signature === "NONE") return "none";
  if (signature === "PURE_SOURCE") return "source";
  if (signature === "PURE_BOUNDARY") return "boundary";
  if (signature === "PURE_MANIFEST") return "manifest";
  return "mixed";
}

function polaritySymbolFor(signature: ResonanceSignature): PolaritySymbol {
  // Instrument glyph only (not biology).
  switch (signature) {
    case "PURE_SOURCE":
      return "♀";
    case "PURE_BOUNDARY":
      return "⚲";
    case "PURE_MANIFEST":
      return "♂";
    case "NONE":
      return "∅";
    default:
      return "◐";
  }
}

function colorBandFor(vowels: Voice[]): { colorBand: VoiceColor[]; dominantColor: VoiceColor } {
  if (!vowels.length) return { colorBand: [], dominantColor: "none" };

  const band = vowels.map((v) => COLOR_OF[v]);
  const first = band[0];
  const allSame = band.every((c) => c === first);

  return { colorBand: band, dominantColor: allSame ? first : "mixed" };
}

function transitionsFor(vowels: Voice[]): string[] {
  if (vowels.length <= 1) return [];
  const buckets = vowels.map(bucketOf);
  const out: string[] = [];
  for (let i = 1; i < buckets.length; i++) {
    const prev = buckets[i - 1];
    const next = buckets[i];
    if (prev !== next) out.push(`${prev}→${next}`);
  }
  return out;
}

function notesFor(signature: ResonanceSignature, present: Bucket[]): string[] {
  const notes: string[] = [];
  if (signature === "NONE") {
    notes.push("no vowels found");
    return notes;
  }
  if (signature.startsWith("PURE_")) {
    notes.push(`pure bucket: ${present[0]}`);
    return notes;
  }
  notes.push(`mixed buckets: ${present.join("+")}`);
  return notes;
}

export function buildResonanceSliceV1(input: {
  // precedence:
  // 1) if provided, use voices (already extracted)
  // 2) else extract from sourceText
  voices?: Array<string | null | undefined> | null;
  sourceText: string;
}): ResonanceSliceV1 {
  const fromPrimary = safeVoicesFromPrimary(input.voices ?? undefined);
  const vowels = fromPrimary ?? safeExtractVoicesFromString(input.sourceText);

  const bucketCounts = countsFor(vowels);
  const present = presentBuckets(bucketCounts);
  const signature = signatureForBuckets(present);
  const dominantBucket = dominantBucketFor(present, signature);
  const polaritySymbol = polaritySymbolFor(signature);

  const { colorBand, dominantColor } = colorBandFor(vowels);
  const transitions = transitionsFor(vowels);
  const notes = notesFor(signature, present);

  return {
    vowels,
    bucketCounts,
    dominantBucket,
    signature,
    polaritySymbol,
    colorBand,
    dominantColor,
    transitions,
    notes,
  };
}

export function buildResonanceProfileV1(input: BuildResonanceProfileInput): ResonanceProfileV1 {
  const surfaceWord = String(input?.surfaceWord ?? "");
  const normalizedBasis = input?.normalizedBasis != null ? String(input.normalizedBasis) : undefined;

  // Surface: structural extraction from the surface word
  const surface = buildResonanceSliceV1({
    sourceText: surfaceWord,
    voices: null,
  });

  // Normalized: prefer primaryVoices if supplied; else structural extraction from normalizedBasis if available.
  // NOTE: This does not do PVN. It is extraction only.
  const normalizedSourceText = normalizedBasis ?? surfaceWord;

  const normalized = buildResonanceSliceV1({
    sourceText: normalizedSourceText,
    voices: input?.primaryVoices ?? null,
  });

  return {
    version: "resonance-profile-v1",
    surface,
    normalized,
  };
}

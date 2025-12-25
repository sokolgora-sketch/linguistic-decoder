import type { AnalyzeWordResultUI, CandidateUI, PrimaryPathSummary } from "@/shared/resultsUI";

/**
 * analyze-v1 Adapter (UI-first contract)
 *
 * Purpose:
 * - Convert raw engine output (unstable/unknown) into AnalyzeWordResultUI (stable UI contract).
 * - Populate CandidateUI.vowelPath reliably from candidate voices.
 * - Populate primaryPath.voicePath[] when possible.
 *
 * Design:
 * - Treat raw as `unknown` / `any` and adapt defensively.
 * - Prefer canonical vowelPath format: "U-I" (machine-friendly).
 */

type Raw = any;

function joinVoicePath(seq: unknown): string | undefined {
  if (!Array.isArray(seq)) return undefined;
  const parts = seq.map(String).map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts.join("-") : undefined;
}

function splitVoicePath(path: unknown): string[] {
  if (typeof path !== "string") return [];
  return path.split(/[-–—\s]+/g).map((s) => s.trim()).filter(Boolean);
}

function normalizeArrowPath(s: string): string {
  // Canonicalize ANY visual formatting ("U → I", "U - I", "U–I") to "U-I"
  // by extracting only valid Seven-Vowels symbols and joining with "-".
  const hits = String(s).toUpperCase().match(/[AEIOUYË]/g) ?? [];
  return hits.join("-");
}

function pickCandidateVowelPath(rawCandidate: Raw): string | undefined {
  // Canonical: candidate.voices.voiceSequence => "U-I"
  const fromVoices = joinVoicePath(rawCandidate?.voices?.voiceSequence);
  if (fromVoices) return fromVoices;

  // Legacy / alternate fields (if present)
  if (typeof rawCandidate?.vowelPath === "string") return normalizeArrowPath(rawCandidate.vowelPath);
  if (typeof rawCandidate?.vowel_path === "string") return normalizeArrowPath(rawCandidate.vowel_path);

  return undefined;
}

function pickPrimaryPath(raw: Raw, bestCandidate: Raw | null): PrimaryPathSummary | null {
  // Prefer best candidate path
  const bestPath = bestCandidate ? pickCandidateVowelPath(bestCandidate) : undefined;

  // Secondary: deepRoot top candidate vowelPath if it exists
  const deep0 = raw?.deepRoot?.candidates?.[0]?.vowelPath;
  const deepPath = typeof deep0 === "string" ? normalizeArrowPath(deep0) : undefined;

  const pathStr = bestPath ?? deepPath;
  const voicePath = splitVoicePath(pathStr);

  if (!voicePath.length) return null;

  // ringPath: prefer numeric ringPath from bestCandidate.voices.ringPath
  const ringPath = Array.isArray(bestCandidate?.voices?.ringPath)
    ? bestCandidate.voices.ringPath.filter((n: any) => Number.isFinite(n))
    : [];

  return {
    voicePath,
    levelPath: "", // keep stable; formalize later if/when you introduce levels
    ringPath,
  };
}

function adaptCandidate(rawCandidate: Raw): CandidateUI {
  const language = String(rawCandidate?.language ?? rawCandidate?.lang ?? "unknown");
  const form = String(rawCandidate?.form ?? "");

  // Engine currently uses `function` for functional statement (also accept `functionalStatement` if present).
  const functionalStatement =
    typeof rawCandidate?.functionalStatement === "string"
      ? rawCandidate.functionalStatement
      : typeof rawCandidate?.function === "string"
      ? rawCandidate.function
      : undefined;

  const vowelPath = pickCandidateVowelPath(rawCandidate);

  const gloss = typeof rawCandidate?.gloss === "string" ? rawCandidate.gloss : undefined;

  const status =
    rawCandidate?.status === "pass" || rawCandidate?.status === "fail" || rawCandidate?.status === "unknown"
      ? rawCandidate.status
      : "unknown";

  const confidenceTag = typeof rawCandidate?.confidenceTag === "string" ? rawCandidate.confidenceTag : undefined;
  const fitTag = typeof rawCandidate?.fitTag === "string" ? rawCandidate.fitTag : undefined;

  return {
    id: String(rawCandidate?.id ?? `${language}-${form}`),
    language,
    form,
    functionalStatement,
    vowelPath,
    gloss,
    status,
    confidenceTag,
    fitTag,
  };
}

export function adaptAnalyzeV1ToUI(raw: Raw): AnalyzeWordResultUI {
  const word = String(raw?.word ?? "");
  const sanitized = String(raw?.sanitized ?? word);
  const engineVersion = String(raw?.engineVersion ?? "unknown");

  const rawCandidates: Raw[] = Array.isArray(raw?.candidates) ? raw.candidates : [];
  const candidates: CandidateUI[] = rawCandidates.map(adaptCandidate);

  const bestRaw = rawCandidates[0] ?? null;

  const primaryPath = pickPrimaryPath(raw, bestRaw);

  // Optional contract fields: keep stable safe defaults if missing.
  const frontier = Array.isArray(raw?.frontier) ? raw.frontier : [];
  const languageFamilies = Array.isArray(raw?.languageFamilies) ? raw.languageFamilies : [];
  const history = Array.isArray(raw?.history) ? raw.history : [];

  const engineMeta =
    raw?.engineMeta ??
    ({
      engineVersion,
      mode: raw?.mode ?? undefined,
      alphabet: raw?.alphabet ?? undefined,
    } as any);

  return {
    word,
    sanitized,
    engineVersion,
    candidates,
    primaryPath,
    frontier,
    languageFamilies,
    history,
    engineMeta,
    mode: raw?.mode,
    alphabet: raw?.alphabet,
    wordMatrix: raw?.wordMatrix,
    symbolic: raw?.symbolic,
    meta: raw?.meta,
    raw, // debug hook; safe but optional
  } as AnalyzeWordResultUI;
}

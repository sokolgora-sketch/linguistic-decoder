import type { AnalyzeWordResultUI, CandidateUI, PrimaryPathSummary } from "@/shared/resultsUI";
import { extractSevenVowelsFromString } from "@/shared/math7.core";

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
  const hits = extractSevenVowelsFromString(String(s ?? ""));
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

function pickCandidateSourceKind(rawCandidate: Raw): string | undefined {
  const direct = typeof rawCandidate?.sourceKind === "string" ? rawCandidate.sourceKind.trim() : "";
  if (direct) return direct;

  const nested =
    typeof rawCandidate?.candidateRecord?.source?.kind === "string"
      ? rawCandidate.candidateRecord.source.kind.trim()
      : "";

  return nested || undefined;
}

function normalizePrimaryVoicePath(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim().toUpperCase())
      .filter((item) => /^[AEIOUYË]$/.test(item));
  }

  if (typeof value === "string") {
    return extractSevenVowelsFromString(value);
  }

  return [];
}

function normalizePrimaryRingPath(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  }

  if (typeof value === "string") {
    return value
      .split(/[-–—\s]+/g)
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  }

  return [];
}

function normalizePrimaryLevelPath(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .join("-");
  }

  return typeof value === "string"
    ? value.trim()
    : "";
}

function pickPrimaryPath(raw: Raw, bestCandidate: Raw | null): PrimaryPathSummary | null {
  const directPrimaryPath =
    raw?.primaryPath && typeof raw.primaryPath === "object"
      ? raw.primaryPath
      : null;

  const directVoicePath =
    normalizePrimaryVoicePath(
      directPrimaryPath?.voicePath,
    );

  if (directVoicePath.length > 0) {
    return {
      voicePath: directVoicePath,
      levelPath:
        normalizePrimaryLevelPath(
          directPrimaryPath?.levelPath,
        ),
      ringPath:
        normalizePrimaryRingPath(
          directPrimaryPath?.ringPath,
        ),
    };
  }

  // Legacy compatibility only: candidate or DeepRoot paths may backfill a
  // missing primary path, but they never override an emitted engine path.
  const bestPath =
    bestCandidate
      ? pickCandidateVowelPath(bestCandidate)
      : undefined;

  const deep0 =
    raw?.deepRoot?.candidates?.[0]?.vowelPath;

  const deepPath =
    typeof deep0 === "string"
      ? normalizeArrowPath(deep0)
      : undefined;

  const pathStr = bestPath ?? deepPath;
  const voicePath = splitVoicePath(pathStr);

  if (!voicePath.length) return null;

  const ringPath =
    Array.isArray(bestCandidate?.voices?.ringPath)
      ? bestCandidate.voices.ringPath.filter(
          (n: any) => Number.isFinite(n),
        )
      : [];

  return {
    voicePath,
    levelPath: "",
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
  const sourceKind = pickCandidateSourceKind(rawCandidate);
  const embryoFirstCandidateFields = {
    candidateId: rawCandidate?.candidateId,
    displayForm: rawCandidate?.displayForm,
    candidateLanguage: rawCandidate?.candidateLanguage,

    // Multi-source functional research provenance.
    //
    // Additive pass-through only:
    // this adapter does not validate, promote, reinterpret, or
    // manufacture research evidence.
    targetWord: rawCandidate?.targetWord,
    sourceId: rawCandidate?.sourceId,
    sourceStatus: rawCandidate?.sourceStatus,
    embryoRelation: rawCandidate?.embryoRelation,
    relationOperationIds: rawCandidate?.relationOperationIds,
    attestationTruth: rawCandidate?.attestationTruth,
    functionalBridgeTruth: rawCandidate?.functionalBridgeTruth,

    claimType: rawCandidate?.claimType,
    originClaim: rawCandidate?.originClaim,
    historicalRelation: rawCandidate?.historicalRelation,
    embryo: rawCandidate?.embryo,
    embryoSize: rawCandidate?.embryoSize,
    embryoLanguage: rawCandidate?.embryoLanguage,
    isolatedStandaloneForm: rawCandidate?.isolatedStandaloneForm,
    plainStandaloneGloss: rawCandidate?.plainStandaloneGloss,
    sourceNote: rawCandidate?.sourceNote,
    segmentation: rawCandidate?.segmentation,
    semanticBridge: rawCandidate?.semanticBridge,
    expansionChain: rawCandidate?.expansionChain,

    // Logic-first structural-hypothesis metadata.
    // These fields are additive pass-through only. The UI adapter
    // does not create, validate, promote, or reinterpret them.
    hypothesisVersion: rawCandidate?.hypothesisVersion,
    discoveryStatus: rawCandidate?.discoveryStatus,
    independentStandaloneMeaning:
      rawCandidate?.independentStandaloneMeaning,
    lexicalAttestation: rawCandidate?.lexicalAttestation,
    functionalSupportStatus:
      rawCandidate?.functionalSupportStatus,
    evidenceRefs: rawCandidate?.evidenceRefs,
    reductionSteps: rawCandidate?.reductionSteps,
    reasonCodes: rawCandidate?.reasonCodes,
    historicalOriginClaim:
      rawCandidate?.historicalOriginClaim,
    historicalTransmissionClaim:
      rawCandidate?.historicalTransmissionClaim,
    winnerClaim: rawCandidate?.winnerClaim,
    languageSuperiorityClaim:
      rawCandidate?.languageSuperiorityClaim,
    candidateTruthClaim:
      rawCandidate?.candidateTruthClaim,

    validationOutcome: rawCandidate?.validationOutcome,
    validationReasons: rawCandidate?.validationReasons,
    rankGroup: rawCandidate?.rankGroup,
    rankScore: rawCandidate?.rankScore,
    rankReason: rawCandidate?.rankReason,
    claimBoundary: rawCandidate?.claimBoundary,
    userDecisionPosture: rawCandidate?.userDecisionPosture,
    evidenceCategories: rawCandidate?.evidenceCategories,
    freeOperatorDiagnostic: rawCandidate?.freeOperatorDiagnostic,
  };

  return {
    ...embryoFirstCandidateFields,
    id: String(rawCandidate?.id ?? `${language}-${form}`),
    language,
    form,
    functionalStatement,
    vowelPath,
    gloss,
    status,
    confidenceTag,
    fitTag,
    sourceKind,
  } as unknown as CandidateUI;
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
    heartInstrumentV1: null,
      mode: raw?.mode ?? undefined,
      alphabet: raw?.alphabet ?? undefined,
    } as any);

  return {
    word,
    sanitized,
    engineVersion,
      // v1 top-level sections (pass-through for compatibility)
      heart: raw?.heart ?? null,
      mind: raw?.mind ?? null,
      consonants: raw?.consonants ?? null,
      symbolicCore: raw?.symbolicCore ?? null,
      deepRoot: raw?.deepRoot ?? null,
      resonanceProfileV1: raw?.resonanceProfileV1 ?? null,
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
  } as unknown as AnalyzeWordResultUI;
}

import type {
  AnalyzeWordResultUI,
  CandidateUI,
  EngineMetaRaw,
  PrimaryPathSummary,
} from "@/shared/resultsUI";
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
 * - Treat raw payload fields as `unknown` and adapt defensively.
 * - Prefer canonical vowelPath format: "U-I" (machine-friendly).
 */

type RawRecord = Record<string, unknown>;

type RawCandidate = RawRecord & {
  voices?: RawRecord & {
    voiceSequence?: unknown;
    ringPath?: unknown;
  };
  candidateRecord?: RawRecord & {
    source?: RawRecord;
  };
};

type RawAnalyzeV1 = RawRecord & {
  candidates?: unknown;
  primaryPath?: RawRecord;
  deepRoot?: RawRecord & {
    candidates?: unknown;
  };
  engineMeta?: EngineMetaRaw;
  meta?: AnalyzeWordResultUI["meta"];
};

function asRawRecord(value: unknown): RawRecord {
  return value !== null && typeof value === "object"
    ? (value as RawRecord)
    : {};
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function optionalStringOrNull(value: unknown): string | null | undefined {
  return value === null || typeof value === "string" ? value : undefined;
}

function optionalNumberOrNull(value: unknown): number | null | undefined {
  return value === null || (typeof value === "number" && Number.isFinite(value))
    ? value
    : undefined;
}

function optionalFiniteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : undefined;
}

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

function pickCandidateVowelPath(rawCandidate: RawCandidate): string | undefined {
  // Canonical: candidate.voices.voiceSequence => "U-I"
  const fromVoices = joinVoicePath(rawCandidate?.voices?.voiceSequence);
  if (fromVoices) return fromVoices;

  // Legacy / alternate fields (if present)
  if (typeof rawCandidate?.vowelPath === "string") return normalizeArrowPath(rawCandidate.vowelPath);
  if (typeof rawCandidate?.vowel_path === "string") return normalizeArrowPath(rawCandidate.vowel_path);

  return undefined;
}

function pickCandidateSourceKind(rawCandidate: RawCandidate): string | undefined {
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

function pickPrimaryPath(
  raw: RawAnalyzeV1,
  bestCandidate: RawCandidate | null,
): PrimaryPathSummary | null {
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

  const deepRootCandidates = Array.isArray(raw?.deepRoot?.candidates)
    ? raw.deepRoot.candidates.map(asRawRecord)
    : [];
  const deep0 = deepRootCandidates[0]?.vowelPath;

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
          (n) => Number.isFinite(Number(n)),
        )
      : [];

  return {
    voicePath,
    levelPath: "",
    ringPath,
  };
}

function adaptCandidate(rawCandidate: RawCandidate): CandidateUI {
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
    candidateId: optionalString(rawCandidate?.candidateId),
    displayForm: optionalString(rawCandidate?.displayForm),
    candidateLanguage: optionalString(rawCandidate?.candidateLanguage),

    // Multi-source functional research provenance.
    //
    // Additive pass-through only:
    // this adapter does not validate, promote, reinterpret, or
    // manufacture research evidence.
    targetWord: optionalString(rawCandidate?.targetWord),
    sourceId: optionalString(rawCandidate?.sourceId),
    sourceStatus: optionalString(rawCandidate?.sourceStatus),
    embryoRelation: optionalString(rawCandidate?.embryoRelation),
    relationOperationIds: optionalStringArray(rawCandidate?.relationOperationIds),
    attestationTruth: optionalString(rawCandidate?.attestationTruth),
    functionalBridgeTruth: optionalString(rawCandidate?.functionalBridgeTruth),

    claimType: optionalString(rawCandidate?.claimType),
    originClaim: optionalString(rawCandidate?.originClaim),
    historicalRelation: optionalString(rawCandidate?.historicalRelation),
    embryo: optionalStringOrNull(rawCandidate?.embryo),
    embryoAuthority: optionalString(rawCandidate?.embryoAuthority),
    embryoSize: optionalNumberOrNull(rawCandidate?.embryoSize),
    embryoLanguage: optionalStringOrNull(rawCandidate?.embryoLanguage),
    isolatedStandaloneForm: optionalStringOrNull(rawCandidate?.isolatedStandaloneForm),
    plainStandaloneGloss: optionalStringOrNull(rawCandidate?.plainStandaloneGloss),
    sourceNote: optionalStringOrNull(rawCandidate?.sourceNote),
    segmentation: rawCandidate?.segmentation,
    semanticBridge: optionalStringOrNull(rawCandidate?.semanticBridge),
    expansionChain: optionalStringArray(rawCandidate?.expansionChain),

    // Logic-first structural-hypothesis metadata.
    // These fields are additive pass-through only. The UI adapter
    // does not create, validate, promote, or reinterpret them.
    hypothesisVersion: optionalString(rawCandidate?.hypothesisVersion),
    discoveryStatus: optionalString(rawCandidate?.discoveryStatus),
    independentStandaloneMeaning:
      rawCandidate?.independentStandaloneMeaning,
    lexicalAttestation: optionalString(rawCandidate?.lexicalAttestation),
    functionalSupportStatus: optionalString(rawCandidate?.functionalSupportStatus),
    evidenceRefs: rawCandidate?.evidenceRefs,
    reductionSteps: rawCandidate?.reductionSteps,
    reasonCodes: rawCandidate?.reasonCodes,
    historicalOriginClaim: optionalString(rawCandidate?.historicalOriginClaim),
    historicalTransmissionClaim: optionalString(rawCandidate?.historicalTransmissionClaim),
    winnerClaim: optionalString(rawCandidate?.winnerClaim),
    languageSuperiorityClaim: optionalString(rawCandidate?.languageSuperiorityClaim),
    candidateTruthClaim: optionalString(rawCandidate?.candidateTruthClaim),

    validationOutcome: optionalString(rawCandidate?.validationOutcome),
    validationReasons: optionalStringArray(rawCandidate?.validationReasons),
    rankGroup: optionalString(rawCandidate?.rankGroup),
    rankScore: optionalFiniteNumber(rawCandidate?.rankScore),
    rankReason: optionalString(rawCandidate?.rankReason),
    claimBoundary: optionalString(rawCandidate?.claimBoundary),
    userDecisionPosture: optionalString(rawCandidate?.userDecisionPosture),
    evidenceCategories: optionalStringArray(rawCandidate?.evidenceCategories),
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
  };
}

export function adaptAnalyzeV1ToUI(rawInput: unknown): AnalyzeWordResultUI {
  const raw = asRawRecord(rawInput) as RawAnalyzeV1;
  const word = String(raw?.word ?? "");
  const sanitized = String(raw?.sanitized ?? word);
  const engineVersion = String(raw?.engineVersion ?? "unknown");

  const rawCandidates: RawCandidate[] = Array.isArray(raw?.candidates)
    ? raw.candidates.map((candidate) => asRawRecord(candidate) as RawCandidate)
    : [];
  const candidates: CandidateUI[] = rawCandidates.map(adaptCandidate);

  const bestRaw = rawCandidates[0] ?? null;

  const primaryPath = pickPrimaryPath(raw, bestRaw);

  // Optional contract fields: keep stable safe defaults if missing.
  const frontier = Array.isArray(raw?.frontier) ? raw.frontier : [];
  const languageFamilies = Array.isArray(raw?.languageFamilies) ? raw.languageFamilies : [];
  const history = Array.isArray(raw?.history) ? raw.history : [];

  const engineMeta: EngineMetaRaw =
    raw?.engineMeta ??
    ({
      engineVersion,
      mode: typeof raw?.mode === "string" ? raw.mode : undefined,
      alphabet: typeof raw?.alphabet === "string" ? raw.alphabet : undefined,
    });

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
    mode: typeof raw?.mode === "string" ? raw.mode : undefined,
    alphabet: typeof raw?.alphabet === "string" ? raw.alphabet : undefined,
    wordMatrix: raw?.wordMatrix,
    symbolic: raw?.symbolic,
    meta: raw?.meta,
    raw, // debug hook; safe but optional
  } as unknown as AnalyzeWordResultUI;
}

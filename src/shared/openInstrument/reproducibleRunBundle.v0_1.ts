import {
  stableNormalize,
  stableStringify,
  type JsonValue,
} from "../engineContract.v1";

export const REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION =
  "open-instrument.reproducible-run-bundle.v0.1" as const;
export const REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION = "stable-json-v0.1" as const;

type PublicCandidateSnapshotV0_1 = Record<string, JsonValue>;

export type ReproducibleRunBundleResultV0_1 = {
  word: string;
  mode: string;
  candidates: PublicCandidateSnapshotV0_1[];
  [key: string]: JsonValue;
};

export type ReproducibleRunBundleInputV0_1 = {
  ipa?: string;
  targetSenseLabel?: string;
};

export type ReproducibleRunBundleV0_1 = {
  schemaVersion: typeof REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION;
  createdAt?: string;
  input: ReproducibleRunBundleInputV0_1;
  result: ReproducibleRunBundleResultV0_1;
  fingerprint: {
    algorithm: "sha256";
    canonicalization: typeof REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION;
    value: string;
  };
};

export type ReproducibleRunBundleParseResultV0_1 =
  | { ok: true; value: ReproducibleRunBundleV0_1 }
  | {
      ok: false;
      reason:
        | "malformed_json"
        | "unsupported_schema_version"
        | "invalid_bundle_shape"
        | "fingerprint_mismatch";
    };

const RESULT_FIELDS = [
  "word",
  "sanitized",
  "engineVersion",
  "mode",
  "alphabet",
  "strictInput",
  "primaryPath",
  "heart",
  "heartPrimaryPath",
  "heartInstrumentV1",
  "phoneticIpaV0_1",
  "evidence",
  "ops",
  "notes",
  "signals",
  "candidates",
  "deepRoot",
  "rootMap",
  "analysisStatusV0_1",
  "originClaim",
  "originClaimGates",
  "resonanceProfileV1",
] as const;

const CANDIDATE_FIELDS = [
  "id",
  "language",
  "form",
  "candidateId",
  "displayForm",
  "candidateLanguage",
  "targetWord",
  "targetSenseId",
  "targetSenseLabel",
  "sourceStatus",
  "functionalBridgeTruth",
  "evidenceRefs",
  "historicalOriginClaim",
  "historicalTransmissionClaim",
  "winnerClaim",
  "languageSuperiorityClaim",
  "candidateTruthClaim",
  "logicDerivedFunctionalHypothesisVerificationV0_1",
  "functionalStatement",
  "vowelPath",
  "decomposition",
  "gloss",
  "status",
  "confidenceTag",
  "fitTag",
  "sourceKind",
  "claimType",
  "originClaim",
  "historicalRelation",
  "embryo",
  "embryoAuthority",
  "embryoSize",
  "embryoLanguage",
  "isolatedStandaloneForm",
  "plainStandaloneGloss",
  "sourceNote",
  "segmentation",
  "semanticBridge",
  "expansionChain",
  "validationOutcome",
  "validationReasons",
  "rankGroup",
  "rankScore",
  "rankReason",
  "claimBoundary",
  "userDecisionPosture",
  "semanticAlignmentStatus",
  "semanticAlignmentSource",
  "semanticAlignmentReasonCodes",
  "semanticAlignmentBridge",
  "sourceId",
  "attestationTruth",
  "embryoRelation",
  "relationOperationIds",
  "hypothesisVersion",
  "independentStandaloneMeaning",
  "lexicalAttestation",
  "functionalSupportStatus",
  "reductionSteps",
  "reasonCodes",
  "evidenceCategories",
  "freeOperatorDiagnostic",
  "ops",
  "notes",
  "note",
  "signals",
] as const;

const FORBIDDEN_KEYS = new Set([
  "raw",
  "debug",
  "providerOutput",
  "providerRequest",
  "providerResponse",
  "tokenUsage",
  "requestId",
  "environment",
  "runtime",
  "serverError",
  "exception",
  "calibrationPacket",
  "researchRows",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
  const allowedSet = new Set(allowed);
  return Object.keys(value).every((key) => allowedSet.has(key));
}

function stripForbiddenKeys(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(stripForbiddenKeys);
  if (!isRecord(value)) return value;

  const output: Record<string, JsonValue> = {};
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    output[key] = stripForbiddenKeys(child as JsonValue);
  }
  return output;
}

function toPublicJson(value: unknown): JsonValue {
  return stripForbiddenKeys(stableNormalize(value));
}

function pickFields(
  source: Record<string, unknown>,
  fields: readonly string[],
): Record<string, JsonValue> {
  const output: Record<string, JsonValue> = {};
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(source, field)) continue;
    output[field] = toPublicJson(source[field]);
  }
  return output;
}

function projectCandidate(value: unknown): PublicCandidateSnapshotV0_1 {
  if (!isRecord(value)) throw new Error("invalid reproducible candidate");
  return pickFields(value, CANDIDATE_FIELDS);
}

export function projectAnalyzeV1ForReproducibleRunBundleV0_1(
  value: unknown,
): ReproducibleRunBundleResultV0_1 {
  if (!isRecord(value)) throw new Error("invalid reproducible result");

  const word = value.word;
  const mode = value.mode;
  const candidates = value.candidates;
  const analysisStatus = value.analysisStatusV0_1;

  if (typeof word !== "string" || word.length === 0) {
    throw new Error("reproducible result word is required");
  }
  if (typeof mode !== "string" || mode.length === 0) {
    throw new Error("reproducible result mode is required");
  }
  if (!Array.isArray(candidates)) {
    throw new Error("reproducible result candidates are required");
  }
  if (!isRecord(analysisStatus)) {
    throw new Error("reproducible result analysis status is required");
  }

  const projected = pickFields(value, RESULT_FIELDS);
  projected.word = word;
  projected.mode = mode;
  projected.candidates = candidates.map(projectCandidate);
  projected.analysisStatusV0_1 = toPublicJson(analysisStatus);

  return projected as ReproducibleRunBundleResultV0_1;
}

function assertBundleShape(bundle: unknown): bundle is ReproducibleRunBundleV0_1 {
  if (!isRecord(bundle)) return false;
  if (
    !hasOnlyKeys(bundle, ["schemaVersion", "createdAt", "input", "result", "fingerprint"])
  ) {
    return false;
  }
  if (bundle.schemaVersion !== REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION) return false;
  if (bundle.createdAt !== undefined && typeof bundle.createdAt !== "string") return false;

  const input = bundle.input;
  if (!isRecord(input) || !hasOnlyKeys(input, ["ipa", "targetSenseLabel"])) return false;
  if (input.ipa !== undefined && typeof input.ipa !== "string") return false;
  if (input.targetSenseLabel !== undefined && typeof input.targetSenseLabel !== "string") {
    return false;
  }

  const result = bundle.result;
  if (!isRecord(result) || !hasOnlyKeys(result, RESULT_FIELDS)) return false;
  if (typeof result.word !== "string" || typeof result.mode !== "string") return false;
  if (!Array.isArray(result.candidates)) return false;
  if (!isRecord(result.analysisStatusV0_1)) return false;
  for (const candidate of result.candidates) {
    if (!isRecord(candidate) || !hasOnlyKeys(candidate, CANDIDATE_FIELDS)) return false;
  }
  if (containsForbiddenKey(bundle)) return false;

  const fingerprint = bundle.fingerprint;
  if (
    !isRecord(fingerprint) ||
    !hasOnlyKeys(fingerprint, ["algorithm", "canonicalization", "value"])
  ) {
    return false;
  }
  return (
    fingerprint.algorithm === "sha256" &&
    fingerprint.canonicalization === REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION &&
    typeof fingerprint.value === "string" &&
    /^[a-f0-9]{64}$/.test(fingerprint.value)
  );
}

function containsForbiddenKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsForbiddenKey);
  if (!isRecord(value)) return false;
  return Object.entries(value).some(
    ([key, child]) => FORBIDDEN_KEYS.has(key) || containsForbiddenKey(child),
  );
}

function canonicalPayload(bundle: {
  schemaVersion: typeof REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION;
  input: ReproducibleRunBundleInputV0_1;
  result: ReproducibleRunBundleResultV0_1;
}): string {
  return `${stableStringify({
    schemaVersion: bundle.schemaVersion,
    input: bundle.input,
    result: bundle.result,
  })}\n`;
}

async function sha256Hex(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("SHA-256 is unavailable in this runtime");
  const bytes = new TextEncoder().encode(value);
  const digest = await subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildReproducibleRunBundleV0_1(input: {
  result: unknown;
  ipa?: string;
  targetSenseLabel?: string;
  createdAt?: string;
}): Promise<ReproducibleRunBundleV0_1> {
  const result = projectAnalyzeV1ForReproducibleRunBundleV0_1(input.result);
  const bundleInput: ReproducibleRunBundleInputV0_1 = {};
  if (input.ipa !== undefined) bundleInput.ipa = input.ipa;
  if (input.targetSenseLabel !== undefined) {
    bundleInput.targetSenseLabel = input.targetSenseLabel;
  }

  const fingerprintValue = await sha256Hex(
    canonicalPayload({
      schemaVersion: REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION,
      input: bundleInput,
      result,
    }),
  );

  return {
    schemaVersion: REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION,
    ...(input.createdAt !== undefined
      ? { createdAt: input.createdAt }
      : { createdAt: new Date().toISOString() }),
    input: bundleInput,
    result,
    fingerprint: {
      algorithm: "sha256",
      canonicalization: REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION,
      value: fingerprintValue,
    },
  };
}

export function serializeReproducibleRunBundleV0_1(
  bundle: ReproducibleRunBundleV0_1,
): string {
  if (!assertBundleShape(bundle)) throw new Error("invalid reproducible bundle");
  return `${stableStringify(bundle)}\n`;
}

export async function parseReproducibleRunBundleV0_1(
  input: string | unknown,
): Promise<ReproducibleRunBundleParseResultV0_1> {
  let value: unknown = input;
  if (typeof input === "string") {
    try {
      value = JSON.parse(input);
    } catch {
      return { ok: false, reason: "malformed_json" };
    }
  }

  if (!isRecord(value)) return { ok: false, reason: "invalid_bundle_shape" };
  if (value.schemaVersion !== REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION) {
    return { ok: false, reason: "unsupported_schema_version" };
  }
  if (!assertBundleShape(value)) return { ok: false, reason: "invalid_bundle_shape" };

  const expected = await sha256Hex(canonicalPayload(value));
  if (expected !== value.fingerprint.value) {
    return { ok: false, reason: "fingerprint_mismatch" };
  }
  return { ok: true, value };
}

import {
  stableNormalize,
  stableStringify,
  type JsonValue,
} from "../engineContract.v1";
import {
  hasLegacyInterpretationFieldsV2,
  projectNeutralInterpretationNodeV2,
  toAnalyzeWordResultV2Contract,
} from "../analyzeWordResult.v2.contract";
import { isAnalysisStatusV0_2, migrateAnalysisStatusV0_1ToV0_2 } from "../analysisStatus.v0_2";
import { INTERPRETATION_DECISION_POLICY_V0_1 } from "./interpretationDecisionPolicy.v0_1";
import {
  parseReproducibleRunBundleV0_1,
  projectAnalyzeV1ForReproducibleRunBundleV0_1,
  type ReproducibleRunBundleV0_1,
} from "./reproducibleRunBundle.v0_1";

export const REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION_V0_2 =
  "open-instrument.reproducible-run-bundle.v0.2" as const;
export const REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION_V0_2 =
  "stable-json-v0.1" as const;

export type ReproducibleRunBundleResultV0_2 = {
  responseContractVersion: "open-instrument.analyze-word-result.v2";
  word: string;
  mode: string;
  candidates: Record<string, JsonValue>[];
  analysisStatusV0_2: JsonValue;
  interpretationDecisionPolicyV0_1: JsonValue;
  [key: string]: JsonValue;
};

export type ReproducibleRunBundleInputV0_2 = Readonly<{
  ipa?: string;
  targetSenseLabel?: string;
}>;

export type ReproducibleRunBundleV0_2 = Readonly<{
  schemaVersion: typeof REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION_V0_2;
  createdAt?: string;
  input: ReproducibleRunBundleInputV0_2;
  result: ReproducibleRunBundleResultV0_2;
  fingerprint: Readonly<{
    algorithm: "sha256";
    canonicalization: typeof REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION_V0_2;
    value: string;
  }>;
}>;

export type ReproducibleRunBundleParseResultV0_2 =
  | { ok: true; value: ReproducibleRunBundleV0_2; migratedFromV0_1?: true }
  | {
      ok: false;
      reason:
        | "malformed_json"
        | "unsupported_schema_version"
        | "invalid_bundle_shape"
        | "fingerprint_mismatch";
    };

const LEGACY_RESULT_FIELDS = [
  "word", "sanitized", "engineVersion", "mode", "alphabet", "strictInput",
  "primaryPath", "automaticCarrierPronunciationV0_1", "functionalVoiceNormalizationV0_1",
  "heart", "heartPrimaryPath", "heartInstrumentV1", "phoneticIpaV0_1", "evidence",
  "ops", "notes", "signals", "candidates", "deepRoot", "rootMap", "originClaim",
  "originClaimGates", "resonanceProfileV1",
] as const;

const LEGACY_INPUT_ONLY_CANDIDATE_FIELDS = [
  "id", "language", "form", "candidateId", "displayForm", "candidateLanguage",
  "targetWord", "targetSenseId", "targetSenseLabel", "sourceStatus", "functionalBridgeTruth",
  "evidenceRefs", "historicalOriginClaim", "historicalTransmissionClaim", "languageSuperiorityClaim",
  "candidateTruthClaim", "logicDerivedFunctionalHypothesisVerificationV0_1", "functionalStatement",
  "vowelPath", "decomposition", "gloss", "status", "confidenceTag", "fitTag", "sourceKind",
  "claimType", "discoveryStatus", "originClaim", "historicalRelation", "embryo", "embryoAuthority",
  "embryoSize", "embryoLanguage", "isolatedStandaloneForm", "plainStandaloneGloss", "sourceNote",
  "segmentation", "semanticBridge", "expansionChain", "validationOutcome", "validationReasons",
  "rankGroup", "rankScore", "rankReason", "claimBoundary", "userDecisionPosture",
  "semanticAlignmentStatus", "semanticAlignmentSource", "semanticAlignmentReasonCodes",
  "semanticAlignmentBridge", "sourceId", "attestationTruth", "embryoRelation", "relationOperationIds",
  "hypothesisVersion", "independentStandaloneMeaning", "lexicalAttestation", "functionalSupportStatus",
  "reductionSteps", "reasonCodes", "evidenceCategories", "freeOperatorDiagnostic", "ops", "notes",
  "note", "signals",
] as const;

const FORBIDDEN_KEYS = new Set([
  "raw", "debug", "providerOutput", "providerRequest", "providerResponse", "tokenUsage",
  "requestId", "environment", "runtime", "serverError", "exception", "calibrationPacket", "researchRows",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function pickJsonFields(source: Record<string, unknown>, fields: readonly string[]): Record<string, JsonValue> {
  const output: Record<string, JsonValue> = {};
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(source, field)) continue;
    const normalized = stableNormalize(source[field]);
    if (isJsonValue(normalized)) output[field] = normalized;
  }
  return output;
}

function removeForbidden(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeForbidden);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !FORBIDDEN_KEYS.has(key))
    .map(([key, child]) => [key, removeForbidden(child)]));
}

function statusAsLegacyInput(status: Record<string, unknown>): Record<string, unknown> {
  const { schemaVersion: _schema, interpretationDecisionPolicy: _policy, ...rest } = status;
  const boundary = isRecord(status.claimBoundary) ? status.claimBoundary : {};
  return {
    ...rest,
    schemaVersion: "open-instrument.analysis-status.v0_1",
    claimBoundary: { ...boundary, winnerClaim: "not_claimed" },
  };
}

function resultV2(value: unknown): ReproducibleRunBundleResultV0_2 {
  if (!isRecord(value)) throw new Error("invalid reproducible result");
  const neutral = value.responseContractVersion === "open-instrument.analyze-word-result.v2"
    ? value
    : toAnalyzeWordResultV2Contract(value);
  if (!isRecord(neutral) || !Array.isArray(neutral.candidates) || !isRecord(neutral.analysisStatusV0_2)) {
    throw new Error("neutral Analyze V2 result is incomplete");
  }

  // Reuse the established, privacy-bounded RRB projection, then replace its
  // legacy status/input shape with the active neutral contract fields.
  const compatibilityInput = {
    ...neutral,
    analysisStatusV0_1: statusAsLegacyInput(neutral.analysisStatusV0_2),
  };
  const legacyProjection = projectAnalyzeV1ForReproducibleRunBundleV0_1(compatibilityInput);
  const cleaned = removeForbidden(projectNeutralInterpretationNodeV2(legacyProjection));
  if (!isRecord(cleaned)) throw new Error("neutral reproducible result projection failed");
  delete cleaned.analysisStatusV0_1;
  const result = pickJsonFields(cleaned, LEGACY_RESULT_FIELDS);
  const candidates = neutral.candidates.map((candidate) => {
    if (!isRecord(candidate)) throw new Error("invalid reproducible candidate");
    const candidateFields = pickJsonFields(candidate, LEGACY_INPUT_ONLY_CANDIDATE_FIELDS);
    const normalized = removeForbidden(projectNeutralInterpretationNodeV2(candidateFields));
    if (!isRecord(normalized)) throw new Error("neutral candidate projection failed");
    return normalized as Record<string, JsonValue>;
  });
  result.responseContractVersion = "open-instrument.analyze-word-result.v2";
  result.word = typeof neutral.word === "string" ? neutral.word : "";
  result.mode = typeof neutral.mode === "string" ? neutral.mode : "";
  result.candidates = candidates;
  result.analysisStatusV0_2 = stableNormalize(neutral.analysisStatusV0_2);
  result.interpretationDecisionPolicyV0_1 = stableNormalize(neutral.interpretationDecisionPolicyV0_1);
  for (const field of [
    "functionalMotivationInterpretationV0_3", "motivationDiscoveryV0_2", "wordSpecificFunctionalDepth",
  ] as const) {
    if (Object.prototype.hasOwnProperty.call(neutral, field)) {
      const normalized = removeForbidden(projectNeutralInterpretationNodeV2(neutral[field]));
      if (isJsonValue(normalized)) result[field] = normalized;
    }
  }
  const projected = projectNeutralInterpretationNodeV2(result);
  if (!isRecord(projected) || hasLegacyInterpretationFieldsV2(projected)) {
    throw new Error("active saved analysis contains legacy interpretation-selection data");
  }
  return projected as ReproducibleRunBundleResultV0_2;
}

export function projectAnalyzeWordResultV2ForReproducibleRunBundleV0_2(
  value: unknown,
): ReproducibleRunBundleResultV0_2 {
  return resultV2(value);
}

function canonicalPayload(bundle: Pick<ReproducibleRunBundleV0_2, "schemaVersion" | "input" | "result">): string {
  return `${stableStringify({ schemaVersion: bundle.schemaVersion, input: bundle.input, result: bundle.result })}\n`;
}

async function sha256Hex(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("SHA-256 is unavailable in this runtime");
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createBundle(
  result: ReproducibleRunBundleResultV0_2,
  input: ReproducibleRunBundleInputV0_2,
  createdAt?: string,
): Promise<ReproducibleRunBundleV0_2> {
  const body = { schemaVersion: REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION_V0_2, input, result } as const;
  return {
    ...body,
    ...(createdAt !== undefined ? { createdAt } : { createdAt: new Date().toISOString() }),
    fingerprint: {
      algorithm: "sha256",
      canonicalization: REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION_V0_2,
      value: await sha256Hex(canonicalPayload(body)),
    },
  };
}

export async function buildReproducibleRunBundleV0_2(input: {
  result: unknown;
  ipa?: string;
  targetSenseLabel?: string;
  createdAt?: string;
}): Promise<ReproducibleRunBundleV0_2> {
  const bundleInput: ReproducibleRunBundleInputV0_2 = {
    ...(input.ipa !== undefined ? { ipa: input.ipa } : {}),
    ...(input.targetSenseLabel !== undefined ? { targetSenseLabel: input.targetSenseLabel } : {}),
  };
  return createBundle(resultV2(input.result), bundleInput, input.createdAt);
}

function assertBundleShape(value: unknown): value is ReproducibleRunBundleV0_2 {
  if (!isRecord(value) || value.schemaVersion !== REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION_V0_2) return false;
  if (Object.keys(value).some((key) => !["schemaVersion", "createdAt", "input", "result", "fingerprint"].includes(key))) return false;
  if (value.createdAt !== undefined && typeof value.createdAt !== "string") return false;
  if (!isRecord(value.input) || Object.keys(value.input).some((key) => !["ipa", "targetSenseLabel"].includes(key))) return false;
  if (value.input.ipa !== undefined && typeof value.input.ipa !== "string") return false;
  if (value.input.targetSenseLabel !== undefined && typeof value.input.targetSenseLabel !== "string") return false;
  const result = value.result;
  if (!isRecord(result) || result.responseContractVersion !== "open-instrument.analyze-word-result.v2" ||
      typeof result.word !== "string" || !result.word || typeof result.mode !== "string" || !result.mode ||
      !Array.isArray(result.candidates) || !isRecord(result.analysisStatusV0_2) ||
      !Array.isArray(result.analysisStatusV0_2.reviewedOperators) ||
      !isRecord(result.interpretationDecisionPolicyV0_1) || hasLegacyInterpretationFieldsV2(value) ||
      Object.values(result).some((item) => !isJsonValue(item)) || containsForbidden(value)) return false;
  if (!isRecord(value.fingerprint) || Object.keys(value.fingerprint).length !== 3) return false;
  return value.fingerprint.algorithm === "sha256" &&
    value.fingerprint.canonicalization === REPRODUCIBLE_RUN_BUNDLE_CANONICALIZATION_V0_2 &&
    typeof value.fingerprint.value === "string" && /^[a-f0-9]{64}$/.test(value.fingerprint.value);
}

function containsForbidden(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsForbidden);
  return isRecord(value) && Object.entries(value).some(([key, child]) => FORBIDDEN_KEYS.has(key) || containsForbidden(child));
}

export function serializeReproducibleRunBundleV0_2(bundle: ReproducibleRunBundleV0_2): string {
  if (!assertBundleShape(bundle)) throw new Error("invalid neutral reproducible bundle");
  return `${stableStringify(bundle)}\n`;
}

async function migrateV0_1Bundle(value: unknown): Promise<ReproducibleRunBundleV0_2 | null> {
  const parsed = await parseReproducibleRunBundleV0_1(value);
  if (!parsed.ok) return null;
  const source = parsed.value;
  const migratedStatus = migrateAnalysisStatusV0_1ToV0_2(source.result.analysisStatusV0_1);
  const status = projectNeutralInterpretationNodeV2(migratedStatus, ["analysisStatusV0_1"]);
  if (!migratedStatus || !isAnalysisStatusV0_2(status)) return null;
  const result = removeForbidden(projectNeutralInterpretationNodeV2(source.result));
  if (!isRecord(result)) return null;
  delete result.analysisStatusV0_1;
  result.responseContractVersion = "open-instrument.analyze-word-result.v2";
  result.analysisStatusV0_2 = status;
  result.interpretationDecisionPolicyV0_1 = INTERPRETATION_DECISION_POLICY_V0_1;
  if (hasLegacyInterpretationFieldsV2(result)) return null;
  const input: ReproducibleRunBundleInputV0_2 = { ...source.input };
  return createBundle(result as ReproducibleRunBundleResultV0_2, input, source.createdAt);
}

export async function parseReproducibleRunBundleV0_2(
  input: string | unknown,
): Promise<ReproducibleRunBundleParseResultV0_2> {
  let value: unknown = input;
  if (typeof input === "string") {
    try { value = JSON.parse(input); } catch { return { ok: false, reason: "malformed_json" }; }
  }
  if (!isRecord(value)) return { ok: false, reason: "invalid_bundle_shape" };
  if (value.schemaVersion === "open-instrument.reproducible-run-bundle.v0.1") {
    const migrated = await migrateV0_1Bundle(value);
    return migrated ? { ok: true, value: migrated, migratedFromV0_1: true } : { ok: false, reason: "invalid_bundle_shape" };
  }
  if (value.schemaVersion !== REPRODUCIBLE_RUN_BUNDLE_SCHEMA_VERSION_V0_2) {
    return { ok: false, reason: "unsupported_schema_version" };
  }
  if (!assertBundleShape(value)) return { ok: false, reason: "invalid_bundle_shape" };
  const expected = await sha256Hex(canonicalPayload(value));
  if (expected !== value.fingerprint.value) return { ok: false, reason: "fingerprint_mismatch" };
  return { ok: true, value };
}

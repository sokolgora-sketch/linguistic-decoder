import { z } from "zod";
import {
  ANALYSIS_STATUS_SCHEMA_VERSION_V0_1,
} from "@/shared/analysisStatus.v0_1";
import { stableStringify } from "@/shared/engineContract.v1";
import type { EvidenceLedgerModel } from "@/ui/ledger/ledgerModel";
import type { TelemetryViewModel, Vowel } from "@/ui/telemetry/types";

export const EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_1 =
  "open-instrument.evidence-package-export.v0.1" as const;
export const EVIDENCE_PACKAGE_EXPORT_PURPOSE_V0_1 =
  "VM-derived evidence export for audit/handoff; no origin proof; no forced answer." as const;
export const EVIDENCE_PACKAGE_EXPORT_FORBIDDEN_KEYS_V0_1 = [
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
  "firebase",
  "firebaseId",
  "authorization",
  "token",
] as const;

const vowel = z.enum(["A", "E", "I", "O", "U", "Y", "Ë"]);
const candidateStatus = z.enum(["pass", "fail", "unknown"]);
const voicePathDelta = z.enum(["MATCH", "SHIFT", "DIVERGE", "NOT_EMITTED"]);

const analysisStatus = z
  .object({
    schemaVersion: z.literal(ANALYSIS_STATUS_SCHEMA_VERSION_V0_1),
    status: z.enum([
      "reviewed_functional_evidence",
      "research_functional_hypothesis",
      "candidate_only",
      "structural_unreviewed",
      "null_no_supported_candidate",
    ]),
    summary: z.string().min(1),
    reviewedOperators: z.array(z.string()),
    candidateOnlyOperators: z.array(z.string()),
    researchHypothesisEmbryos: z.array(z.string()),
    structuralTokens: z.array(z.string()),
    claimBoundary: z
      .object({
        historicalOriginClaim: z.literal("not_claimed"),
        historicalTransmissionClaim: z.literal("not_claimed"),
        winnerClaim: z.literal("not_claimed"),
        languageSuperiorityClaim: z.literal("not_claimed"),
        linguisticOwnershipClaim: z.literal("not_claimed"),
        candidateTruthClaim: z.literal("not_claimed"),
        structuralOutputIsCandidateTruth: z.literal(false),
        nullIsValid: z.literal(true),
      })
      .strict(),
    userDecisionPosture: z.literal("user_decides"),
  })
  .strict();

const candidate = z
  .object({
    index: z.number().int().nonnegative(),
    id: z.string().min(1),
    language: z.string().optional(),
    form: z.string().optional(),
    embryo: z.string().optional(),
    status: candidateStatus.optional(),
    confidenceTag: z.string().optional(),
    fitTag: z.string().optional(),
    sourceKind: z.string().optional(),
    targetWord: z.string().optional(),
    targetSenseId: z.string().optional(),
    targetSenseLabel: z.string().optional(),
    sourceId: z.string().optional(),
    sourceStatus: z.string().optional(),
    discoveryStatus: z.string().optional(),
    evidenceRefs: z.array(z.string()).optional(),
    candidateTruthClaim: z.literal("not_claimed").optional(),
    claimBoundary: z.string().optional(),
    userDecisionPosture: z.literal("user_decides").optional(),
  })
  .strict();

const ledgerSection = z
  .object({
    key: z.enum(["normalization", "ops", "signals"]),
    title: z.string(),
    state: z.enum(["present", "none", "missing"]),
    items: z.array(z.string()),
  })
  .strict();

const exportSchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_1),
    purpose: z.literal(EVIDENCE_PACKAGE_EXPORT_PURPOSE_V0_1),
    input: z
      .object({
        word: z.string().min(1),
        normalizedWord: z.string().optional(),
        mode: z.enum(["strict", "open"]).optional(),
        engineVersion: z.string().optional(),
      })
      .strict(),
    analysisStatusV0_1: analysisStatus.optional(),
    summary: z
      .object({
        voicePath: z.array(vowel).optional(),
        voicePathSurface: z.array(vowel).optional(),
        voicePathFunctional: z.array(vowel).optional(),
        voicePathCarrier: z.array(vowel).optional(),
        voicePathDelta,
      })
      .strict(),
    counts: z
      .object({
        candidates: z.number().finite().nonnegative(),
        ops: z.number().finite().nonnegative().optional(),
        notes: z.number().finite().nonnegative().optional(),
        signals: z.number().finite().nonnegative().optional(),
        rejections: z.number().finite().nonnegative().optional(),
      })
      .strict(),
    candidates: z.array(candidate),
    ledger: z
      .object({ sections: z.array(ledgerSection) })
      .strict()
      .optional(),
  })
  .strict();

export type EvidencePackageExportAnalysisStatusV0_1 = z.infer<typeof analysisStatus>;
export type EvidencePackageExportCandidateV0_1 = z.infer<typeof candidate>;
export type EvidencePackageExportLedgerSectionV0_1 = z.infer<typeof ledgerSection>;
export type EvidencePackageExportV0_1 = z.infer<typeof exportSchema>;

export type EvidencePackageExportFailureV0_1 = { ok: false; reason: string };
export type EvidencePackageExportBuildResultV0_1 =
  | { ok: true; value: EvidencePackageExportV0_1 }
  | EvidencePackageExportFailureV0_1;
export type EvidencePackageExportSerializationResultV0_1 =
  | { ok: true; value: string }
  | EvidencePackageExportFailureV0_1;

type UnknownRecord = Record<string, unknown>;
type ReadResult<T> = { ok: true; value: T } | EvidencePackageExportFailureV0_1;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function fail(reason: string): EvidencePackageExportFailureV0_1 {
  return { ok: false, reason };
}

function unwrapPresentOrMissing(value: unknown, path: string): ReadResult<unknown | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  if (!isRecord(value)) return fail(`${path} must be a PresentOrMissing value`);
  if (value.kind === "missing") {
    return value.missing === "none" || value.missing === "not_emitted" || value.missing === "malformed" || value.missing === "unknown"
      ? { ok: true, value: undefined }
      : fail(`${path}.missing is invalid`);
  }
  return value.kind === "present" ? { ok: true, value: value.value } : fail(`${path}.kind is invalid`);
}

function optionalString(value: unknown, path: string): ReadResult<string | undefined> {
  const unwrapped = unwrapPresentOrMissing(value, path);
  if (!unwrapped.ok) return unwrapped;
  if (unwrapped.value === undefined) return { ok: true, value: undefined };
  return typeof unwrapped.value === "string" ? { ok: true, value: unwrapped.value } : fail(`${path}.value must be a string`);
}

function optionalStringArray(value: unknown, path: string): ReadResult<string[] | undefined> {
  const unwrapped = unwrapPresentOrMissing(value, path);
  if (!unwrapped.ok) return unwrapped;
  if (unwrapped.value === undefined) return { ok: true, value: undefined };
  return Array.isArray(unwrapped.value) && unwrapped.value.every((item) => typeof item === "string")
    ? { ok: true, value: [...unwrapped.value] }
    : fail(`${path}.value must be a string array`);
}

function optionalNumber(value: unknown, path: string): ReadResult<number | undefined> {
  const unwrapped = unwrapPresentOrMissing(value, path);
  if (!unwrapped.ok) return unwrapped;
  if (unwrapped.value === undefined) return { ok: true, value: undefined };
  return typeof unwrapped.value === "number" && Number.isFinite(unwrapped.value) && unwrapped.value >= 0
    ? { ok: true, value: unwrapped.value }
    : fail(`${path}.value must be a finite non-negative number`);
}

function optionalVowels(value: unknown, path: string): ReadResult<Vowel[] | undefined> {
  const unwrapped = unwrapPresentOrMissing(value, path);
  if (!unwrapped.ok) return unwrapped;
  if (unwrapped.value === undefined) return { ok: true, value: undefined };
  return Array.isArray(unwrapped.value) && unwrapped.value.every((item) => vowel.safeParse(item).success)
    ? { ok: true, value: [...unwrapped.value] as Vowel[] }
    : fail(`${path}.value must be a canonical vowel array`);
}

function optionalMode(value: unknown, path: string): ReadResult<"strict" | "open" | undefined> {
  const read = optionalString(value, path);
  if (!read.ok) return read;
  if (read.value === undefined) return { ok: true, value: undefined };
  return read.value === "strict" || read.value === "open" ? { ok: true, value: read.value } : fail(`${path}.value is not a supported mode`);
}

function projectCandidate(value: unknown, index: number): ReadResult<EvidencePackageExportCandidateV0_1> {
  if (!isRecord(value)) return fail(`candidates[${index}] must be an object`);
  if (value.index !== index || typeof value.id !== "string" || value.id.length === 0) return fail(`candidates[${index}] identity is invalid`);

  const output: Record<string, unknown> = { index, id: value.id };
  const stringFields = [
    "language",
    "form",
    "embryo",
    "confidenceTag",
    "fitTag",
    "sourceKind",
    "targetWord",
    "targetSenseId",
    "targetSenseLabel",
    "sourceId",
    "sourceStatus",
    "discoveryStatus",
    "claimBoundary",
  ] as const;
  for (const field of stringFields) {
    const read = optionalString(value[field], `candidates[${index}].${field}`);
    if (!read.ok) return read;
    if (read.value !== undefined) output[field] = read.value;
  }

  const status = optionalString(value.status, `candidates[${index}].status`);
  const evidenceRefs = optionalStringArray(value.evidenceRefs, `candidates[${index}].evidenceRefs`);
  const candidateTruthClaim = optionalString(value.candidateTruthClaim, `candidates[${index}].candidateTruthClaim`);
  const userDecisionPosture = optionalString(value.userDecisionPosture, `candidates[${index}].userDecisionPosture`);
  if (!status.ok) return status;
  if (!evidenceRefs.ok) return evidenceRefs;
  if (!candidateTruthClaim.ok) return candidateTruthClaim;
  if (!userDecisionPosture.ok) return userDecisionPosture;
  if (status.value !== undefined) output.status = status.value;
  if (evidenceRefs.value !== undefined) output.evidenceRefs = evidenceRefs.value;
  if (candidateTruthClaim.value !== undefined) output.candidateTruthClaim = candidateTruthClaim.value;
  if (userDecisionPosture.value !== undefined) output.userDecisionPosture = userDecisionPosture.value;

  const parsed = candidate.safeParse(output);
  return parsed.success ? { ok: true, value: parsed.data } : fail(parsed.error.message);
}

function projectLedger(model: EvidenceLedgerModel | undefined): ReadResult<EvidencePackageExportV0_1["ledger"]> {
  if (model === undefined) return { ok: true, value: undefined };
  const sections: EvidencePackageExportLedgerSectionV0_1[] = [];
  for (const [index, section] of model.sections.entries()) {
    if (!Array.isArray(section.items) || !section.items.every((item) => typeof item === "string")) return fail(`ledger.sections[${index}].items is invalid`);
    const parsed = ledgerSection.safeParse({
      key: section.key,
      title: section.title,
      state: section.state,
      items: [...section.items],
    });
    if (!parsed.success) return fail(parsed.error.message);
    sections.push(parsed.data);
  }
  return { ok: true, value: { sections } };
}

function inspectJson(value: unknown, path: string, seen: WeakSet<object>): string | undefined {
  if (value === null || typeof value === "string" || typeof value === "boolean") return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? undefined : `${path} contains a non-finite number`;
  if (typeof value !== "object") return `${path} contains an unsupported value`;
  if (seen.has(value)) return `${path} contains a circular reference`;
  if (Array.isArray(value)) {
    seen.add(value);
    for (const [index, child] of value.entries()) {
      const failure = inspectJson(child, `${path}[${index}]`, seen);
      if (failure) return failure;
    }
    seen.delete(value);
    return undefined;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return `${path} must contain plain objects only`;
  seen.add(value);
  for (const [key, child] of Object.entries(value)) {
    if ((EVIDENCE_PACKAGE_EXPORT_FORBIDDEN_KEYS_V0_1 as readonly string[]).includes(key)) return `${path}.${key} is forbidden`;
    const failure = inspectJson(child, `${path}.${key}`, seen);
    if (failure) return failure;
  }
  seen.delete(value);
  return undefined;
}

export function validateEvidencePackageExportV0_1(value: unknown): { ok: true } | EvidencePackageExportFailureV0_1 {
  const jsonFailure = inspectJson(value, "export", new WeakSet<object>());
  if (jsonFailure) return fail(jsonFailure);
  const parsed = exportSchema.safeParse(value);
  return parsed.success ? { ok: true } : fail(parsed.error.message);
}

export function buildEvidencePackageExportV0_1(
  vm: TelemetryViewModel,
  ledgerModel?: EvidenceLedgerModel,
): EvidencePackageExportBuildResultV0_1 {
  const vmRecord = vm as unknown as UnknownRecord;
  const readout = vmRecord.readout;
  if (!isRecord(readout)) return fail("readout must be an object");
  if (typeof readout.word !== "string" || readout.word.length === 0) return fail("readout.word must be a non-empty string");

  const normalizedWord = optionalString(readout.normalizedWord, "readout.normalizedWord");
  const mode = optionalMode(readout.mode, "readout.mode");
  const engineVersion = optionalString(readout.engineVersion, "readout.engineVersion");
  const voicePath = optionalVowels(readout.voicePath, "readout.voicePath");
  const voicePathSurface = optionalVowels(readout.voicePathSurface, "readout.voicePathSurface");
  const voicePathFunctional = optionalVowels(readout.voicePathFunctional, "readout.voicePathFunctional");
  const carrier = unwrapPresentOrMissing(readout.phoneticIpaV0_1, "readout.phoneticIpaV0_1");
  const status = unwrapPresentOrMissing(vmRecord.analysisStatusV0_1, "analysisStatusV0_1");
  if (!normalizedWord.ok) return normalizedWord;
  if (!mode.ok) return mode;
  if (!engineVersion.ok) return engineVersion;
  if (!voicePath.ok) return voicePath;
  if (!voicePathSurface.ok) return voicePathSurface;
  if (!voicePathFunctional.ok) return voicePathFunctional;
  if (!carrier.ok) return carrier;
  if (!status.ok) return status;

  let voicePathCarrier: Vowel[] | undefined;
  if (carrier.value !== undefined) {
    if (!isRecord(carrier.value)) return fail("readout.phoneticIpaV0_1.value must be an object");
    const carrierVoices = optionalVowels({ kind: "present", value: carrier.value.voices }, "readout.phoneticIpaV0_1.voices");
    if (!carrierVoices.ok) return carrierVoices;
    voicePathCarrier = carrierVoices.value;
  }

  const statusValue = status.value === undefined ? undefined : analysisStatus.safeParse(status.value);
  if (statusValue && !statusValue.success) return fail(statusValue.error.message);
  if (!isRecord(readout.counts)) return fail("readout.counts must be an object");
  if (!Array.isArray(vmRecord.candidates)) return fail("candidates must be an array");

  const counts: Record<string, unknown> = {};
  const candidatesCount = readout.counts.candidates;
  if (typeof candidatesCount !== "number" || !Number.isFinite(candidatesCount) || candidatesCount < 0) return fail("readout.counts.candidates is invalid");
  counts.candidates = candidatesCount;
  for (const field of ["ops", "notes", "signals", "rejections"] as const) {
    const read = optionalNumber(readout.counts[field], `readout.counts.${field}`);
    if (!read.ok) return read;
    if (read.value !== undefined) counts[field] = read.value;
  }

  const candidates: EvidencePackageExportCandidateV0_1[] = [];
  for (const [index, value] of vmRecord.candidates.entries()) {
    const projected = projectCandidate(value, index);
    if (!projected.ok) return projected;
    candidates.push(projected.value);
  }
  const ledger = projectLedger(ledgerModel);
  if (!ledger.ok) return ledger;

  const summary: Record<string, unknown> = { voicePathDelta: readout.voicePathDelta };
  if (voicePath.value !== undefined) summary.voicePath = voicePath.value;
  if (voicePathSurface.value !== undefined) summary.voicePathSurface = voicePathSurface.value;
  if (voicePathFunctional.value !== undefined) summary.voicePathFunctional = voicePathFunctional.value;
  if (voicePathCarrier !== undefined) summary.voicePathCarrier = voicePathCarrier;

  const input: Record<string, unknown> = { word: readout.word };
  if (normalizedWord.value !== undefined) input.normalizedWord = normalizedWord.value;
  if (mode.value !== undefined) input.mode = mode.value;
  if (engineVersion.value !== undefined) input.engineVersion = engineVersion.value;

  const output: Record<string, unknown> = {
    schemaVersion: EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_1,
    purpose: EVIDENCE_PACKAGE_EXPORT_PURPOSE_V0_1,
    input,
    summary,
    counts,
    candidates,
  };
  if (statusValue?.success) output.analysisStatusV0_1 = statusValue.data;
  if (ledger.value !== undefined) output.ledger = ledger.value;

  const parsed = exportSchema.safeParse(output);
  if (!parsed.success) return fail(parsed.error.message);
  const validation = validateEvidencePackageExportV0_1(parsed.data);
  return validation.ok ? { ok: true, value: parsed.data } : validation;
}

export function serializeEvidencePackageExportV0_1(
  value: EvidencePackageExportV0_1,
): EvidencePackageExportSerializationResultV0_1 {
  const validation = validateEvidencePackageExportV0_1(value);
  if (!validation.ok) return validation;
  try {
    return { ok: true, value: `${stableStringify(value, 2)}\n` };
  } catch (error) {
    return fail(error instanceof Error ? error.message : "serialization failed");
  }
}

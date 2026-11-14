import { stableStringify } from "@/shared/engineContract.v1";
import {
  parseReproducibleRunBundleV0_2,
  serializeReproducibleRunBundleV0_2,
  type ReproducibleRunBundleV0_2,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_2";
import {
  parseComparisonExportArtifactV0_1,
} from "@/ui/instrument/comparisonExportReproducibility.v0_1";
import { adaptComparisonSourceResultToTelemetryVMV0_1 } from "@/ui/telemetry/contractAdapter";
import {
  compareTelemetryViewModelsV0_1,
  type ComparisonProjectionV0_1,
} from "@/ui/instrument/wordToWordComparison.v0_1";
import { hasLegacyInterpretationFieldsV2 } from "@/shared/analyzeWordResult.v2.contract";

export const COMPARISON_EXPORT_ARTIFACT_KIND_V0_2 =
  "open-instrument.comparison-export-reproducibility" as const;
export const COMPARISON_EXPORT_SCHEMA_VERSION_V0_2 =
  "open-instrument.comparison-export-reproducibility.v0.2" as const;
export const COMPARISON_EXPORT_CANONICALIZATION_V0_2 = "stable-json-v0.1" as const;
export const COMPARISON_EXPORT_CONTRACT_ID_V0_2 =
  "OPEN_INSTRUMENT_COMPARISON_EXPORT_REPRODUCIBILITY_V0_2" as const;

type FingerprintV0_2 = ReproducibleRunBundleV0_2["fingerprint"];

export type ComparisonExportArtifactV0_2 = Readonly<{
  artifactKind: typeof COMPARISON_EXPORT_ARTIFACT_KIND_V0_2;
  schemaVersion: typeof COMPARISON_EXPORT_SCHEMA_VERSION_V0_2;
  comparisonContractId: typeof COMPARISON_EXPORT_CONTRACT_ID_V0_2;
  left: ReproducibleRunBundleV0_2;
  right: ReproducibleRunBundleV0_2;
  sourceFingerprints: Readonly<{ left: FingerprintV0_2; right: FingerprintV0_2 }>;
  comparison: ComparisonProjectionV0_1;
  artifactFingerprint: FingerprintV0_2;
}>;

export type ComparisonExportParseResultV0_2 =
  | { ok: true; value: ComparisonExportArtifactV0_2; migratedFromV0_1?: true }
  | { ok: false; reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function omitCreatedAt(bundle: ReproducibleRunBundleV0_2) {
  const body = { ...bundle };
  delete body.createdAt;
  return body;
}

function artifactBody(value: Omit<ComparisonExportArtifactV0_2, "artifactFingerprint">) {
  return {
    artifactKind: value.artifactKind,
    schemaVersion: value.schemaVersion,
    comparisonContractId: value.comparisonContractId,
    left: omitCreatedAt(value.left),
    right: omitCreatedAt(value.right),
    sourceFingerprints: value.sourceFingerprints,
    comparison: value.comparison,
  };
}

async function sha256Hex(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("SHA-256 is unavailable in this runtime");
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function artifactFingerprintValue(
  value: Omit<ComparisonExportArtifactV0_2, "artifactFingerprint">,
): Promise<string> {
  return sha256Hex(`${stableStringify(artifactBody(value))}\n`);
}

async function validateBundle(bundle: ReproducibleRunBundleV0_2, side: string) {
  const parsed = await parseReproducibleRunBundleV0_2(serializeReproducibleRunBundleV0_2(bundle));
  if (!parsed.ok) throw new Error(`invalid ${side} source bundle: ${parsed.reason}`);
  return parsed.value;
}

export async function buildComparisonExportArtifactV0_2(input: {
  left: ReproducibleRunBundleV0_2;
  right: ReproducibleRunBundleV0_2;
}): Promise<ComparisonExportArtifactV0_2> {
  const left = await validateBundle(input.left, "left");
  const right = await validateBundle(input.right, "right");
  const comparison = compareTelemetryViewModelsV0_1(
    adaptComparisonSourceResultToTelemetryVMV0_1(left.result),
    adaptComparisonSourceResultToTelemetryVMV0_1(right.result),
  );
  const base = {
    artifactKind: COMPARISON_EXPORT_ARTIFACT_KIND_V0_2,
    schemaVersion: COMPARISON_EXPORT_SCHEMA_VERSION_V0_2,
    comparisonContractId: COMPARISON_EXPORT_CONTRACT_ID_V0_2,
    left,
    right,
    sourceFingerprints: { left: left.fingerprint, right: right.fingerprint },
    comparison,
  } as const;
  return {
    ...base,
    artifactFingerprint: {
      algorithm: "sha256",
      canonicalization: COMPARISON_EXPORT_CANONICALIZATION_V0_2,
      value: await artifactFingerprintValue(base),
    },
  };
}

export function serializeComparisonExportArtifactV0_2(value: ComparisonExportArtifactV0_2): string {
  if (
    value.artifactKind !== COMPARISON_EXPORT_ARTIFACT_KIND_V0_2 ||
    value.schemaVersion !== COMPARISON_EXPORT_SCHEMA_VERSION_V0_2 ||
    value.comparisonContractId !== COMPARISON_EXPORT_CONTRACT_ID_V0_2 ||
    hasLegacyInterpretationFieldsV2(value)
  ) throw new Error("invalid neutral comparison export artifact");
  return `${stableStringify(value)}\n`;
}

async function parseV0_2(value: unknown): Promise<ComparisonExportParseResultV0_2> {
  if (!isRecord(value) || value.artifactKind !== COMPARISON_EXPORT_ARTIFACT_KIND_V0_2 ||
      value.schemaVersion !== COMPARISON_EXPORT_SCHEMA_VERSION_V0_2 ||
      value.comparisonContractId !== COMPARISON_EXPORT_CONTRACT_ID_V0_2 ||
      !isRecord(value.left) || !isRecord(value.right) || !isRecord(value.sourceFingerprints) ||
      !isRecord(value.artifactFingerprint) || !isRecord(value.comparison)) {
    return { ok: false, reason: "INVALID_ARTIFACT_SHAPE" };
  }
  const left = await parseReproducibleRunBundleV0_2(value.left);
  if (!left.ok) return { ok: false, reason: "INVALID_LEFT_SOURCE_BUNDLE" };
  const right = await parseReproducibleRunBundleV0_2(value.right);
  if (!right.ok) return { ok: false, reason: "INVALID_RIGHT_SOURCE_BUNDLE" };
  const leftFingerprint = stableStringify(left.value.fingerprint);
  const rightFingerprint = stableStringify(right.value.fingerprint);
  if (stableStringify(value.sourceFingerprints.left) !== leftFingerprint ||
      stableStringify(value.sourceFingerprints.right) !== rightFingerprint) {
    return { ok: false, reason: "SOURCE_FINGERPRINT_MISMATCH" };
  }
  const comparison = compareTelemetryViewModelsV0_1(
    adaptComparisonSourceResultToTelemetryVMV0_1(left.value.result),
    adaptComparisonSourceResultToTelemetryVMV0_1(right.value.result),
  );
  if (stableStringify(comparison) !== stableStringify(value.comparison)) {
    return { ok: false, reason: "STORED_PROJECTION_MISMATCH" };
  }
  const base = {
    artifactKind: COMPARISON_EXPORT_ARTIFACT_KIND_V0_2,
    schemaVersion: COMPARISON_EXPORT_SCHEMA_VERSION_V0_2,
    comparisonContractId: COMPARISON_EXPORT_CONTRACT_ID_V0_2,
    left: left.value,
    right: right.value,
    sourceFingerprints: { left: left.value.fingerprint, right: right.value.fingerprint },
    comparison,
  } as const;
  const fingerprintValue = await artifactFingerprintValue(base);
  if (value.artifactFingerprint.algorithm !== "sha256" ||
      value.artifactFingerprint.canonicalization !== COMPARISON_EXPORT_CANONICALIZATION_V0_2 ||
      value.artifactFingerprint.value !== fingerprintValue) {
    return { ok: false, reason: "ARTIFACT_FINGERPRINT_MISMATCH" };
  }
  if (hasLegacyInterpretationFieldsV2(value)) return { ok: false, reason: "LEGACY_SELECTION_DATA" };
  return {
    ok: true,
    value: {
      ...base,
      artifactFingerprint: {
        algorithm: "sha256",
        canonicalization: COMPARISON_EXPORT_CANONICALIZATION_V0_2,
        value: fingerprintValue,
      },
    },
  };
}

export async function parseComparisonExportArtifactV0_2(
  input: string | unknown,
): Promise<ComparisonExportParseResultV0_2> {
  let value: unknown = input;
  if (typeof input === "string") {
    try { value = JSON.parse(input); } catch { return { ok: false, reason: "MALFORMED_JSON" }; }
  }
  if (isRecord(value) && value.schemaVersion === "open-instrument.comparison-export-reproducibility.v0.1") {
    const legacy = await parseComparisonExportArtifactV0_1(value);
    if (!legacy.ok) return { ok: false, reason: `LEGACY_${legacy.reason}` };
    const left = await parseReproducibleRunBundleV0_2(legacy.value.left);
    const right = await parseReproducibleRunBundleV0_2(legacy.value.right);
    if (!left.ok || !right.ok) return { ok: false, reason: "LEGACY_SOURCE_MIGRATION_FAILED" };
    const migrated = await buildComparisonExportArtifactV0_2({ left: left.value, right: right.value });
    return { ok: true, value: migrated, migratedFromV0_1: true };
  }
  return parseV0_2(value);
}

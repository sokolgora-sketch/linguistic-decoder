import { stableStringify } from "@/shared/engineContract.v1";
import {
  parseReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
  type ReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";
import { adaptComparisonSourceResultToTelemetryVMV0_1 } from "@/ui/telemetry/contractAdapter";
import {
  compareTelemetryViewModelsV0_1,
  type ComparisonProjectionV0_1,
  type ComparisonSideV0_1,
  type ComparisonStateV0_1,
  type ComparisonRelationV0_1,
} from "@/ui/instrument/wordToWordComparison.v0_1";

export const COMPARISON_EXPORT_ARTIFACT_KIND_V0_1 =
  "open-instrument.comparison-export-reproducibility" as const;
export const COMPARISON_EXPORT_SCHEMA_VERSION_V0_1 =
  "open-instrument.comparison-export-reproducibility.v0.1" as const;
export const COMPARISON_EXPORT_CANONICALIZATION_V0_1 =
  "stable-json-v0.1" as const;
export const COMPARISON_EXPORT_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_COMPARISON_EXPORT_REPRODUCIBILITY_V0_1" as const;
export const COMPARISON_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_WORD_TO_WORD_STRUCTURAL_AND_AUTHORITY_COMPARISON_V0_1" as const;
export const COMPARISON_SCHEMA_VERSION_V0_1 =
  "open-instrument.word-to-word-structural-authority-comparison.v0_1" as const;

type FingerprintV0_1 = ReproducibleRunBundleV0_1["fingerprint"];

export type ComparisonExportArtifactV0_1 = Readonly<{
  artifactKind: typeof COMPARISON_EXPORT_ARTIFACT_KIND_V0_1;
  schemaVersion: typeof COMPARISON_EXPORT_SCHEMA_VERSION_V0_1;
  comparisonContractId: typeof COMPARISON_CONTRACT_ID_V0_1;
  left: ReproducibleRunBundleV0_1;
  right: ReproducibleRunBundleV0_1;
  sourceFingerprints: Readonly<{
    left: FingerprintV0_1;
    right: FingerprintV0_1;
  }>;
  comparison: ComparisonProjectionV0_1;
  artifactFingerprint: FingerprintV0_1;
}>;

export type ComparisonExportParseResultV0_1 =
  | { ok: true; value: ComparisonExportArtifactV0_1 }
  | {
      ok: false;
      reason:
        | "MALFORMED_JSON"
        | "UNSUPPORTED_ARTIFACT_KIND"
        | "UNSUPPORTED_SCHEMA_VERSION"
        | "INVALID_ARTIFACT_SHAPE"
        | "INVALID_LEFT_SOURCE_BUNDLE"
        | "INVALID_RIGHT_SOURCE_BUNDLE"
        | "SOURCE_FINGERPRINT_MISMATCH"
        | "COMPARISON_SCHEMA_MISMATCH"
        | "ARTIFACT_FINGERPRINT_MISMATCH"
        | "STORED_PROJECTION_MISMATCH";
    };

const COMPARISON_STATES: readonly ComparisonStateV0_1[] = [
  "VALUE",
  "NULL",
  "MISSING",
  "EMPTY_VALID",
  "UNSUPPORTED",
  "NOT_APPLICABLE",
];

const COMPARISON_RELATIONS: readonly ComparisonRelationV0_1[] = [
  "EQUAL",
  "DIFFERENT",
  "LEFT_ONLY",
  "RIGHT_ONLY",
  "BOTH_NULL",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isFingerprint(value: unknown): value is FingerprintV0_1 {
  if (!isRecord(value) || !hasExactKeys(value, ["algorithm", "canonicalization", "value"])) {
    return false;
  }
  return (
    value.algorithm === "sha256" &&
    value.canonicalization === COMPARISON_EXPORT_CANONICALIZATION_V0_1 &&
    typeof value.value === "string" &&
    /^[a-f0-9]{64}$/.test(value.value)
  );
}

function isJsonLike(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) return value.every(isJsonLike);
  if (!isRecord(value)) return false;
  return Object.values(value).every(isJsonLike);
}

function isComparisonSide(value: unknown): value is ComparisonSideV0_1 {
  if (!isRecord(value) || typeof value.state !== "string") return false;
  if (!COMPARISON_STATES.includes(value.state as ComparisonStateV0_1)) return false;

  switch (value.state) {
    case "VALUE":
      return hasExactKeys(value, ["state", "value"]) && isJsonLike(value.value);
    case "EMPTY_VALID":
      return (
        hasExactKeys(value, ["state", "value"]) &&
        Array.isArray(value.value) &&
        isJsonLike(value.value)
      );
    case "NULL":
      return (
        hasExactKeys(value, ["state", "reason"]) &&
        (value.reason === null || typeof value.reason === "string")
      );
    case "MISSING":
    case "UNSUPPORTED":
    case "NOT_APPLICABLE":
      return hasExactKeys(value, ["state"]);
  }
  return false;
}

function isComparisonProjection(
  value: unknown,
): value is ComparisonProjectionV0_1 {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ["schemaVersion", "left", "right", "rows", "claimBoundary"])
  ) {
    return false;
  }
  if (value.schemaVersion !== COMPARISON_SCHEMA_VERSION_V0_1) return false;
  if (
    !isRecord(value.left) ||
    !hasExactKeys(value.left, ["word"]) ||
    typeof value.left.word !== "string" ||
    !isRecord(value.right) ||
    !hasExactKeys(value.right, ["word"]) ||
    typeof value.right.word !== "string" ||
    value.claimBoundary !== "structural_authority_comparison_only" ||
    !Array.isArray(value.rows)
  ) {
    return false;
  }

  return value.rows.every((rawRow) => {
    if (
      !isRecord(rawRow) ||
      !hasExactKeys(rawRow, ["id", "label", "left", "relation", "right"])
    ) {
      return false;
    }
    return (
      typeof rawRow.id === "string" &&
      typeof rawRow.label === "string" &&
      isComparisonSide(rawRow.left) &&
      isComparisonSide(rawRow.right) &&
      typeof rawRow.relation === "string" &&
      COMPARISON_RELATIONS.includes(rawRow.relation as ComparisonRelationV0_1)
    );
  });
}

function omitCreatedAt(bundle: ReproducibleRunBundleV0_1) {
  const body = { ...bundle };
  delete body.createdAt;
  return body;
}

function artifactBody(artifact: {
  artifactKind: typeof COMPARISON_EXPORT_ARTIFACT_KIND_V0_1;
  schemaVersion: typeof COMPARISON_EXPORT_SCHEMA_VERSION_V0_1;
  comparisonContractId: typeof COMPARISON_CONTRACT_ID_V0_1;
  left: ReproducibleRunBundleV0_1;
  right: ReproducibleRunBundleV0_1;
  sourceFingerprints: Readonly<{ left: FingerprintV0_1; right: FingerprintV0_1 }>;
  comparison: ComparisonProjectionV0_1;
}) {
  return {
    artifactKind: artifact.artifactKind,
    schemaVersion: artifact.schemaVersion,
    comparisonContractId: artifact.comparisonContractId,
    left: omitCreatedAt(artifact.left),
    right: omitCreatedAt(artifact.right),
    sourceFingerprints: artifact.sourceFingerprints,
    comparison: artifact.comparison,
  };
}

async function sha256Hex(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("SHA-256 is unavailable in this runtime");
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function artifactFingerprintValue(artifact: {
  artifactKind: typeof COMPARISON_EXPORT_ARTIFACT_KIND_V0_1;
  schemaVersion: typeof COMPARISON_EXPORT_SCHEMA_VERSION_V0_1;
  comparisonContractId: typeof COMPARISON_CONTRACT_ID_V0_1;
  left: ReproducibleRunBundleV0_1;
  right: ReproducibleRunBundleV0_1;
  sourceFingerprints: Readonly<{ left: FingerprintV0_1; right: FingerprintV0_1 }>;
  comparison: ComparisonProjectionV0_1;
}): Promise<string> {
  return sha256Hex(`${stableStringify(artifactBody(artifact))}\n`);
}

async function validateSourceBundle(
  bundle: ReproducibleRunBundleV0_1,
  side: "left" | "right",
): Promise<ReproducibleRunBundleV0_1> {
  const parsed = await parseReproducibleRunBundleV0_1(
    serializeReproducibleRunBundleV0_1(bundle),
  );
  if (!parsed.ok) {
    throw new Error(`invalid ${side} source bundle: ${parsed.reason}`);
  }
  return parsed.value;
}

export async function buildComparisonExportArtifactV0_1(input: {
  left: ReproducibleRunBundleV0_1;
  right: ReproducibleRunBundleV0_1;
}): Promise<ComparisonExportArtifactV0_1> {
  const left = await validateSourceBundle(input.left, "left");
  const right = await validateSourceBundle(input.right, "right");
  const comparison = compareTelemetryViewModelsV0_1(
    adaptComparisonSourceResultToTelemetryVMV0_1(left.result),
    adaptComparisonSourceResultToTelemetryVMV0_1(right.result),
  );
  const base = {
    artifactKind: COMPARISON_EXPORT_ARTIFACT_KIND_V0_1,
    schemaVersion: COMPARISON_EXPORT_SCHEMA_VERSION_V0_1,
    comparisonContractId: COMPARISON_CONTRACT_ID_V0_1,
    left,
    right,
    sourceFingerprints: {
      left: left.fingerprint,
      right: right.fingerprint,
    },
    comparison,
  } as const;

  return {
    ...base,
    artifactFingerprint: {
      algorithm: "sha256",
      canonicalization: COMPARISON_EXPORT_CANONICALIZATION_V0_1,
      value: await artifactFingerprintValue(base),
    },
  };
}

function isEnvelopeShape(value: Record<string, unknown>): boolean {
  if (
    !hasExactKeys(value, [
      "artifactKind",
      "schemaVersion",
      "comparisonContractId",
      "left",
      "right",
      "sourceFingerprints",
      "comparison",
      "artifactFingerprint",
    ]) ||
    !isRecord(value.left) ||
    !isRecord(value.right) ||
    !isRecord(value.sourceFingerprints) ||
    !isRecord(value.artifactFingerprint)
  ) {
    return false;
  }
  return hasExactKeys(value.sourceFingerprints, ["left", "right"]);
}

export function serializeComparisonExportArtifactV0_1(
  artifact: ComparisonExportArtifactV0_1,
): string {
  if (
    !isEnvelopeShape(artifact as unknown as Record<string, unknown>) ||
    artifact.artifactKind !== COMPARISON_EXPORT_ARTIFACT_KIND_V0_1 ||
    artifact.schemaVersion !== COMPARISON_EXPORT_SCHEMA_VERSION_V0_1 ||
    artifact.comparisonContractId !== COMPARISON_CONTRACT_ID_V0_1 ||
    !isFingerprint(artifact.left.fingerprint) ||
    !isFingerprint(artifact.right.fingerprint) ||
    !isFingerprint(artifact.artifactFingerprint) ||
    !isComparisonProjection(artifact.comparison)
  ) {
    throw new Error("invalid comparison export artifact");
  }
  return `${stableStringify(artifact)}\n`;
}

export async function parseComparisonExportArtifactV0_1(
  input: string | unknown,
): Promise<ComparisonExportParseResultV0_1> {
  let value: unknown = input;
  if (typeof input === "string") {
    try {
      value = JSON.parse(input);
    } catch {
      return { ok: false, reason: "MALFORMED_JSON" };
    }
  }
  if (!isRecord(value)) return { ok: false, reason: "INVALID_ARTIFACT_SHAPE" };
  if (value.artifactKind !== COMPARISON_EXPORT_ARTIFACT_KIND_V0_1) {
    return { ok: false, reason: "UNSUPPORTED_ARTIFACT_KIND" };
  }
  if (value.schemaVersion !== COMPARISON_EXPORT_SCHEMA_VERSION_V0_1) {
    return { ok: false, reason: "UNSUPPORTED_SCHEMA_VERSION" };
  }
  if (!isEnvelopeShape(value)) return { ok: false, reason: "INVALID_ARTIFACT_SHAPE" };

  const left = await parseReproducibleRunBundleV0_1(value.left);
  if (!left.ok) return { ok: false, reason: "INVALID_LEFT_SOURCE_BUNDLE" };
  const right = await parseReproducibleRunBundleV0_1(value.right);
  if (!right.ok) return { ok: false, reason: "INVALID_RIGHT_SOURCE_BUNDLE" };

  const sourceFingerprints = value.sourceFingerprints as Record<string, unknown>;
  if (
    !isFingerprint(sourceFingerprints.left) ||
    !isFingerprint(sourceFingerprints.right) ||
    stableStringify(sourceFingerprints.left) !== stableStringify(left.value.fingerprint) ||
    stableStringify(sourceFingerprints.right) !== stableStringify(right.value.fingerprint)
  ) {
    return { ok: false, reason: "SOURCE_FINGERPRINT_MISMATCH" };
  }

  if (
    value.comparisonContractId !== COMPARISON_CONTRACT_ID_V0_1 ||
    !isRecord(value.comparison) ||
    value.comparison.schemaVersion !== COMPARISON_SCHEMA_VERSION_V0_1
  ) {
    return { ok: false, reason: "COMPARISON_SCHEMA_MISMATCH" };
  }
  if (!isComparisonProjection(value.comparison)) {
    return { ok: false, reason: "COMPARISON_SCHEMA_MISMATCH" };
  }
  if (!isFingerprint(value.artifactFingerprint)) {
    return { ok: false, reason: "ARTIFACT_FINGERPRINT_MISMATCH" };
  }

  const base = {
    artifactKind: COMPARISON_EXPORT_ARTIFACT_KIND_V0_1,
    schemaVersion: COMPARISON_EXPORT_SCHEMA_VERSION_V0_1,
    comparisonContractId: COMPARISON_CONTRACT_ID_V0_1,
    left: left.value,
    right: right.value,
    sourceFingerprints: {
      left: left.value.fingerprint,
      right: right.value.fingerprint,
    },
    comparison: value.comparison,
  } as const;
  const expectedArtifactFingerprint = await artifactFingerprintValue(base);
  if (expectedArtifactFingerprint !== value.artifactFingerprint.value) {
    return { ok: false, reason: "ARTIFACT_FINGERPRINT_MISMATCH" };
  }

  let recomputed: ComparisonProjectionV0_1;
  try {
    recomputed = compareTelemetryViewModelsV0_1(
      adaptComparisonSourceResultToTelemetryVMV0_1(left.value.result),
      adaptComparisonSourceResultToTelemetryVMV0_1(right.value.result),
    );
  } catch {
    return { ok: false, reason: "STORED_PROJECTION_MISMATCH" };
  }
  if (stableStringify(recomputed) !== stableStringify(value.comparison)) {
    return { ok: false, reason: "STORED_PROJECTION_MISMATCH" };
  }

  return {
    ok: true,
    value: {
      artifactKind: COMPARISON_EXPORT_ARTIFACT_KIND_V0_1,
      schemaVersion: COMPARISON_EXPORT_SCHEMA_VERSION_V0_1,
      comparisonContractId: COMPARISON_CONTRACT_ID_V0_1,
      left: left.value,
      right: right.value,
      sourceFingerprints: {
        left: left.value.fingerprint,
        right: right.value.fingerprint,
      },
      comparison: value.comparison,
      artifactFingerprint: value.artifactFingerprint,
    },
  };
}

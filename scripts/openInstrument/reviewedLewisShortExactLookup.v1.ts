import {
  REVIEWED_LEWIS_SHORT_ENTRY_ATTESTATION_IMPORTER_VERSION_V1,
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "./reviewedLewisShortEntryAttestationImport.v1";
import type { SourceEntryAttestationV1 } from "../../src/shared/openInstrument/sourceEntryAttestation.v1";
import trustedManifestJson from "./sourceBatches/lewis-short-bounded-slice.v1.manifest.json";
import {
  REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1,
  importReviewedLewisShortBatchV1,
  type ReviewedLewisShortBatchManifestV1,
} from "./reviewedLewisShortBatchImport.v1";

export const REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_VERSION_V1 =
  "open-instrument.reviewed-lewis-short-exact-lookup.v1" as const;

export const REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1 =
  "EXISTING_BOUNDED_SLICE_ONLY" as const;

const TRUSTED_REVIEWED_LEWIS_SHORT_MANIFEST_V1 =
  trustedManifestJson as unknown as ReviewedLewisShortBatchManifestV1;

export type ReviewedLewisShortExactLookupStatusV1 =
  | "FOUND"
  | "AMBIGUOUS"
  | "SOURCE_UNAVAILABLE"
  | "NOT_FOUND";

export type ReviewedLewisShortExactLookupReasonCodeV1 =
  | "LOOKUP_INPUT_INVALID"
  | "TARGET_CONTEXT_FORBIDDEN"
  | "UNSUPPORTED_SOURCE_TRADITION"
  | "QUERY_FORM_INVALID"
  | "ARTIFACT_MISSING"
  | "MANIFEST_INVALID"
  | "SOURCE_SLICE_HASH_MISMATCH"
  | "SOURCE_XML_MALFORMED"
  | "SOURCE_ENTRY_ID_DUPLICATE"
  | "SOURCE_ENTRY_ID_MISSING"
  | "SOURCE_ENTRY_ID_UNEXPECTED"
  | "ENTRY_LOCATOR_MISSING"
  | "EXACT_FORM_MISSING"
  | "UNSUPPORTED_SOURCE_FORM_ENCODING"
  | "AMBIGUOUS_SENSE_STRUCTURE"
  | "LEXICAL_DEFINITION_MISSING"
  | "GLOSS_MISSING"
  | "NO_SUBSTANTIVE_SENSES"
  | "SOURCE_FORM_MISMATCH"
  | "ENTRY_ATTESTATION_VALIDATION_FAILED"
  | "LANE2_VALIDATION_FAILED"
  | "BOUNDED_SLICE_COVERAGE_INCOMPLETE"
  | "MULTIPLE_EXACT_SOURCE_ENTRIES"
  | "AMBIGUOUS_ENTRY_OR_SENSE_SELECTION";

export type ReviewedLewisShortExactLookupInputV1 = Readonly<{
  sourceTraditionId: string;
  queryForm: string;
  sourceSlice: string | null;
  manifest: unknown;
}>;

export type ReviewedLewisShortExactLookupArtifactV1 = Readonly<{
  sourceTraditionId: typeof REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1;
  sourceScope: typeof REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1;
  sourceName: ReviewedLewisShortBatchManifestV1["sourceName"];
  sourceEdition: ReviewedLewisShortBatchManifestV1["sourceEdition"];
  sourceRepository: ReviewedLewisShortBatchManifestV1["sourceRepository"];
  sourceRepositoryCommit: ReviewedLewisShortBatchManifestV1["sourceRepositoryCommit"];
  sourceFilePath: ReviewedLewisShortBatchManifestV1["sourceFilePath"];
  sourceFormat: ReviewedLewisShortBatchManifestV1["sourceFormat"];
  sourceLicense: ReviewedLewisShortBatchManifestV1["sourceLicense"];
  licenseFile: ReviewedLewisShortBatchManifestV1["licenseFile"];
  attribution: ReviewedLewisShortBatchManifestV1["attribution"];
  sourceFileGitBlobSha: ReviewedLewisShortBatchManifestV1["sourceFileGitBlobSha"];
  sourceUrlOrArchiveRef: ReviewedLewisShortBatchManifestV1["sourceUrlOrArchiveRef"];
  sourceDateOrVersion: ReviewedLewisShortBatchManifestV1["sourceDateOrVersion"];
  sourceSliceSha256: string;
  sourceSliceFormat: ReviewedLewisShortBatchManifestV1["sourceSliceFormat"];
  selectedEntryIds: readonly string[];
}>;

export type ReviewedLewisShortExactLookupResultV1 = Readonly<{
  schemaVersion: typeof REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_VERSION_V1;
  status: ReviewedLewisShortExactLookupStatusV1;
  sourceTraditionId: string | null;
  queryForm: string | null;
  normalizedQueryForm: string | null;
  sourceScope: typeof REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1;
  sourceArtifact: ReviewedLewisShortExactLookupArtifactV1 | null;
  attestations: readonly SourceEntryAttestationV1[];
  reasonCodes: readonly ReviewedLewisShortExactLookupReasonCodeV1[];
}>;

const LOOKUP_INPUT_KEYS_V1 = [
  "manifest",
  "queryForm",
  "sourceSlice",
  "sourceTraditionId",
] as const;

const FORBIDDEN_CONTEXT_KEYS_V1 = new Set([
  "targetWord",
  "targetSense",
  "targetSenseId",
  "targetMeaning",
  "structuralInput",
  "structuralAnalysis",
  "semanticBridge",
  "functionalCorrespondence",
  "winner",
  "winnerClaim",
  "runtimeAuthorization",
  "productionMembership",
]);

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeysV1(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expectedKeys].sort());
}

function hasForbiddenContextKeyV1(
  value: unknown,
  seen = new WeakSet<object>(),
): boolean {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return false;
  }
  seen.add(value);
  if (Array.isArray(value)) {
    return value.some((child) => hasForbiddenContextKeyV1(child, seen));
  }
  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_CONTEXT_KEYS_V1.has(key) ||
      hasForbiddenContextKeyV1(child, seen),
  );
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return Object.freeze(value);
}

function resultV1(
  value: Omit<ReviewedLewisShortExactLookupResultV1, "schemaVersion">,
): ReviewedLewisShortExactLookupResultV1 {
  return deepFreezeV1({
    schemaVersion: REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_VERSION_V1,
    ...value,
  });
}

function unavailableV1(
  sourceTraditionId: string | null,
  queryForm: string | null,
  normalizedQueryForm: string | null,
  reasonCodes: readonly ReviewedLewisShortExactLookupReasonCodeV1[],
  sourceArtifact: ReviewedLewisShortExactLookupArtifactV1 | null = null,
): ReviewedLewisShortExactLookupResultV1 {
  return resultV1({
    status: "SOURCE_UNAVAILABLE",
    sourceTraditionId,
    queryForm,
    normalizedQueryForm,
    sourceScope: REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1,
    sourceArtifact,
    attestations: [],
    reasonCodes: [...new Set(reasonCodes)].sort(),
  });
}

function normalizeQueryFormV1(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value) {
    return null;
  }
  const normalized = value.normalize("NFC");
  return normalized.length > 0 && normalized.trim() === normalized
    ? normalized
    : null;
}

function sourceArtifactV1(
  manifest: ReviewedLewisShortBatchManifestV1,
): ReviewedLewisShortExactLookupArtifactV1 {
  return {
    sourceTraditionId: REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1,
    sourceScope: REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1,
    sourceName: manifest.sourceName,
    sourceEdition: manifest.sourceEdition,
    sourceRepository: manifest.sourceRepository,
    sourceRepositoryCommit: manifest.sourceRepositoryCommit,
    sourceFilePath: manifest.sourceFilePath,
    sourceFormat: manifest.sourceFormat,
    sourceLicense: manifest.sourceLicense,
    licenseFile: manifest.licenseFile,
    attribution: manifest.attribution,
    sourceFileGitBlobSha: manifest.sourceFileGitBlobSha,
    sourceUrlOrArchiveRef: manifest.sourceUrlOrArchiveRef,
    sourceDateOrVersion: manifest.sourceDateOrVersion,
    sourceSliceSha256: manifest.sourceSliceSha256,
    sourceSliceFormat: manifest.sourceSliceFormat,
    selectedEntryIds: [...manifest.selectedEntryIds],
  };
}

function attestationManifestV1(
  manifest: ReviewedLewisShortBatchManifestV1,
): ReviewedLewisShortEntryAttestationManifestV1 {
  return {
    manifestVersion: REVIEWED_LEWIS_SHORT_ENTRY_ATTESTATION_IMPORTER_VERSION_V1,
    sourceName: manifest.sourceName,
    sourceRepository: manifest.sourceRepository,
    sourceRepositoryCommit: manifest.sourceRepositoryCommit,
    sourceFilePath: manifest.sourceFilePath,
    sourceLicense: manifest.sourceLicense,
    sourceUrlOrArchiveRef: manifest.sourceUrlOrArchiveRef,
    sourceDateOrVersion: manifest.sourceDateOrVersion,
    sourceFileGitBlobSha: manifest.sourceFileGitBlobSha,
    sourceSliceSha256: manifest.sourceSliceSha256,
    selectedEntryIds: [...manifest.selectedEntryIds],
  };
}

function importedReasonCodesV1(
  result: Readonly<{
    rejections: readonly Readonly<{
      reasonCodes: readonly string[];
    }>[];
  }>,
): ReviewedLewisShortExactLookupReasonCodeV1[] {
  return [
    ...new Set(
      result.rejections.flatMap((rejection) => rejection.reasonCodes),
    ),
  ].sort() as ReviewedLewisShortExactLookupReasonCodeV1[];
}

export function lookupReviewedLewisShortExactV1(
  input: unknown,
): ReviewedLewisShortExactLookupResultV1 {
  if (!isRecordV1(input) || !hasExactKeysV1(input, LOOKUP_INPUT_KEYS_V1)) {
    return unavailableV1(null, null, null, ["LOOKUP_INPUT_INVALID"]);
  }
  if (hasForbiddenContextKeyV1(input)) {
    return unavailableV1(null, null, null, ["TARGET_CONTEXT_FORBIDDEN"]);
  }

  const sourceTraditionId = input.sourceTraditionId;
  const queryForm = input.queryForm;
  const normalizedQueryForm = normalizeQueryFormV1(queryForm);
  if (sourceTraditionId !== REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1) {
    return unavailableV1(
      typeof sourceTraditionId === "string" ? sourceTraditionId : null,
      typeof queryForm === "string" ? queryForm : null,
      normalizedQueryForm,
      ["UNSUPPORTED_SOURCE_TRADITION"],
    );
  }
  if (!normalizedQueryForm) {
    return unavailableV1(
      sourceTraditionId,
      typeof queryForm === "string" ? queryForm : null,
      null,
      ["QUERY_FORM_INVALID"],
    );
  }
  if (typeof input.sourceSlice !== "string" || input.sourceSlice.length === 0) {
    return unavailableV1(
      sourceTraditionId,
      queryForm,
      normalizedQueryForm,
      ["ARTIFACT_MISSING"],
    );
  }
  if (!isRecordV1(input.manifest) || hasForbiddenContextKeyV1(input.manifest)) {
    return unavailableV1(
      sourceTraditionId,
      queryForm,
      normalizedQueryForm,
      ["MANIFEST_INVALID"],
    );
  }

  const manifest = input.manifest as ReviewedLewisShortBatchManifestV1;
  let batch: ReturnType<typeof importReviewedLewisShortBatchV1>;
  let imported: ReturnType<typeof importReviewedLewisShortEntryAttestationsV1>;
  try {
    batch = importReviewedLewisShortBatchV1(input.sourceSlice, manifest);
    if (batch.status !== "IMPORTED") {
      return unavailableV1(
        sourceTraditionId,
        queryForm,
        normalizedQueryForm,
        importedReasonCodesV1(batch),
      );
    }
    if (
      batch.inputSha256 !==
      TRUSTED_REVIEWED_LEWIS_SHORT_MANIFEST_V1.sourceSliceSha256
    ) {
      return unavailableV1(
        sourceTraditionId,
        queryForm,
        normalizedQueryForm,
        ["SOURCE_SLICE_HASH_MISMATCH"],
      );
    }
    imported = importReviewedLewisShortEntryAttestationsV1(
      input.sourceSlice,
      attestationManifestV1(TRUSTED_REVIEWED_LEWIS_SHORT_MANIFEST_V1),
    );
  } catch {
    return unavailableV1(
      sourceTraditionId,
      queryForm,
      normalizedQueryForm,
      ["MANIFEST_INVALID"],
    );
  }

  if (imported.status !== "IMPORTED") {
    return unavailableV1(
      sourceTraditionId,
      queryForm,
      normalizedQueryForm,
      importedReasonCodesV1(imported),
    );
  }

  const artifact = sourceArtifactV1(TRUSTED_REVIEWED_LEWIS_SHORT_MANIFEST_V1);
  const matches = imported.attestations.filter(
    (attestation) =>
      attestation.sourceForm.normalize("NFC") === normalizedQueryForm,
  );
  if (matches.length === 0) {
    return unavailableV1(
      sourceTraditionId,
      queryForm,
      normalizedQueryForm,
      ["BOUNDED_SLICE_COVERAGE_INCOMPLETE"],
      artifact,
    );
  }

  const hasUnresolvedSelection = matches.some(
    (attestation) =>
      attestation.entrySelectionStatus === "UNRESOLVED" ||
      attestation.entries.some(
        (entry) => entry.senseSelectionStatus === "UNRESOLVED",
      ),
  );
  if (matches.length > 1 || hasUnresolvedSelection) {
    return resultV1({
      status: "AMBIGUOUS",
      sourceTraditionId,
      queryForm,
      normalizedQueryForm,
      sourceScope: REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1,
      sourceArtifact: artifact,
      attestations: matches,
      reasonCodes: [
        matches.length > 1 ? "MULTIPLE_EXACT_SOURCE_ENTRIES" : null,
        hasUnresolvedSelection
          ? "AMBIGUOUS_ENTRY_OR_SENSE_SELECTION"
          : null,
      ].filter(
        (reasonCode): reasonCode is ReviewedLewisShortExactLookupReasonCodeV1 =>
          reasonCode !== null,
      ),
    });
  }

  return resultV1({
    status: "FOUND",
    sourceTraditionId,
    queryForm,
    normalizedQueryForm,
    sourceScope: REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1,
    sourceArtifact: artifact,
    attestations: matches,
    reasonCodes: [],
  });
}

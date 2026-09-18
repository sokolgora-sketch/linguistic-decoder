import { createHash } from "node:crypto";
import {
  classifyLewisShortSenseStructureV1,
  parseReviewedLewisShortSourceEntriesV1,
  REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1,
  REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1,
  REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1,
  REVIEWED_LEWIS_SHORT_SOURCE_URL_V1,
} from "./reviewedLewisShortBatchImport.v1";
import {
  SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
  validateSourceEntryAttestationV1,
  type SourceEntryAttestationV1,
  type SourceEntryAttestationSenseV1,
} from "../../src/shared/openInstrument/sourceEntryAttestation.v1";

export const REVIEWED_LEWIS_SHORT_ENTRY_ATTESTATION_IMPORTER_VERSION_V1 =
  "open-instrument.reviewed-lewis-short-entry-attestation-import.v1" as const;

export type ReviewedLewisShortEntryAttestationManifestV1 = Readonly<{
  manifestVersion: typeof REVIEWED_LEWIS_SHORT_ENTRY_ATTESTATION_IMPORTER_VERSION_V1;
  sourceName: "Lewis & Short Latin Dictionary";
  sourceRepository: "https://github.com/PerseusDL/lexica";
  sourceRepositoryCommit: typeof REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1;
  sourceFilePath: typeof REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1;
  sourceLicense: "CC BY-SA 4.0";
  sourceUrlOrArchiveRef: typeof REVIEWED_LEWIS_SHORT_SOURCE_URL_V1;
  sourceDateOrVersion: string;
  sourceFileGitBlobSha: typeof REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1;
  sourceSliceSha256: string;
  selectedEntryIds: readonly string[];
}>;

export type ReviewedLewisShortEntryAttestationRejectionV1 = Readonly<{
  entryId: string | null;
  reasonCodes: readonly [
    | "MANIFEST_INVALID"
    | "SOURCE_SLICE_HASH_MISMATCH"
    | "SOURCE_XML_MALFORMED"
    | "SOURCE_ENTRY_ID_DUPLICATE"
    | "SOURCE_ENTRY_ID_MISSING"
    | "SOURCE_ENTRY_ID_UNEXPECTED"
    | "EXACT_FORM_MISSING"
    | "SOURCE_FORM_MISMATCH"
    | "NO_SUBSTANTIVE_SENSES"
    | "ENTRY_ATTESTATION_VALIDATION_FAILED",
    ...string[],
  ];
}>;

export type ReviewedLewisShortEntryAttestationImportResultV1 = Readonly<{
  status: "IMPORTED" | "REJECTED";
  inputSha256: string;
  outputSha256: string | null;
  outputJson: string | null;
  attestations: readonly SourceEntryAttestationV1[];
  rejections: readonly ReviewedLewisShortEntryAttestationRejectionV1[];
}>;

const SOURCE_NAME_V1 = "Lewis & Short Latin Dictionary" as const;
const SOURCE_REPOSITORY_V1 = "https://github.com/PerseusDL/lexica" as const;
const SOURCE_LICENSE_V1 = "CC BY-SA 4.0" as const;
const SOURCE_DATE_V1 =
  "Lewis & Short source file release date 1997-10-28; upstream commit 56061ca127f4a2844980baffc5f2b6d1332897b3" as const;

function sha256V1(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function compareTextV1(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function rejectedV1(
  inputSha256: string,
  rejections: readonly ReviewedLewisShortEntryAttestationRejectionV1[],
): ReviewedLewisShortEntryAttestationImportResultV1 {
  return {
    status: "REJECTED",
    inputSha256,
    outputSha256: null,
    outputJson: null,
    attestations: [],
    rejections,
  };
}

function manifestIsValidV1(
  manifest: ReviewedLewisShortEntryAttestationManifestV1,
): boolean {
  return (
    manifest.manifestVersion ===
      REVIEWED_LEWIS_SHORT_ENTRY_ATTESTATION_IMPORTER_VERSION_V1 &&
    manifest.sourceName === SOURCE_NAME_V1 &&
    manifest.sourceRepository === SOURCE_REPOSITORY_V1 &&
    manifest.sourceRepositoryCommit === REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1 &&
    manifest.sourceFilePath === REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1 &&
    manifest.sourceLicense === SOURCE_LICENSE_V1 &&
    manifest.sourceUrlOrArchiveRef === REVIEWED_LEWIS_SHORT_SOURCE_URL_V1 &&
    manifest.sourceDateOrVersion === SOURCE_DATE_V1 &&
    manifest.sourceFileGitBlobSha === REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1 &&
    /^[0-9a-f]{64}$/u.test(manifest.sourceSliceSha256) &&
    manifest.selectedEntryIds.length > 0 &&
    new Set(manifest.selectedEntryIds).size === manifest.selectedEntryIds.length
  );
}

function extractSenseAttestationsV1(
  entryXml: string,
  entryId: string,
  entryKey: string,
): readonly SourceEntryAttestationSenseV1[] {
  const senses: SourceEntryAttestationSenseV1[] = [];
  for (const match of entryXml.matchAll(
    /<sense\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/sense>/gu,
  )) {
    const senseId = match[1];
    const senseXml = match[2];
    if (
      classifyLewisShortSenseStructureV1(senseXml) !==
      "LEXICAL_GLOSS_PRESENT"
    ) {
      continue;
    }

    const text = senseXml
      .replace(/<[^>]*>/gu, "")
      .replace(/&amp;/gu, "&")
      .replace(/&lt;/gu, "<")
      .replace(/&gt;/gu, ">")
      .replace(/&quot;/gu, '"')
      .replace(/&apos;/gu, "'")
      .normalize("NFC")
      .trim()
      .replace(/\s+/gu, " ");
    if (!text) continue;

    senses.push({
      senseId,
      senseLocator: `TEI.2 entryFree id="${entryId}" key="${entryKey}" sense id="${senseId}"`,
      text,
      contentStatus: "SUBSTANTIVE_LEXICAL_SENSE",
    });
  }
  return senses;
}

export function importReviewedLewisShortEntryAttestationsV1(
  sourceSlice: string,
  manifest: ReviewedLewisShortEntryAttestationManifestV1,
): ReviewedLewisShortEntryAttestationImportResultV1 {
  const inputSha256 = sha256V1(sourceSlice);
  if (!manifestIsValidV1(manifest)) {
    return rejectedV1(inputSha256, [
      { entryId: null, reasonCodes: ["MANIFEST_INVALID"] },
    ]);
  }
  if (inputSha256 !== manifest.sourceSliceSha256) {
    return rejectedV1(inputSha256, [
      { entryId: null, reasonCodes: ["SOURCE_SLICE_HASH_MISMATCH"] },
    ]);
  }

  const parsed = parseReviewedLewisShortSourceEntriesV1(sourceSlice);
  if (!parsed.ok) {
    return rejectedV1(inputSha256, [
      { entryId: null, reasonCodes: ["SOURCE_XML_MALFORMED"] },
    ]);
  }

  const duplicateEntryIds = parsed.entries
    .map((entry) => entry.id)
    .filter((entryId, index, entryIds) => entryIds.indexOf(entryId) !== index)
    .filter((entryId, index, entryIds) => entryIds.indexOf(entryId) === index)
    .sort(compareTextV1);
  if (duplicateEntryIds.length > 0) {
    return rejectedV1(
      inputSha256,
      duplicateEntryIds.map((entryId) => ({
        entryId,
        reasonCodes: ["SOURCE_ENTRY_ID_DUPLICATE"],
      })),
    );
  }
  const entriesById = new Map(parsed.entries.map((entry) => [entry.id, entry]));
  const unexpectedIds = [...entriesById.keys()]
    .filter((entryId) => !manifest.selectedEntryIds.includes(entryId))
    .sort(compareTextV1);
  if (unexpectedIds.length > 0) {
    return rejectedV1(
      inputSha256,
      unexpectedIds.map((entryId) => ({
        entryId,
        reasonCodes: ["SOURCE_ENTRY_ID_UNEXPECTED"],
      })),
    );
  }
  const missingIds = manifest.selectedEntryIds.filter(
    (entryId) => !entriesById.has(entryId),
  );
  if (missingIds.length > 0) {
    return rejectedV1(
      inputSha256,
      missingIds.map((entryId) => ({
        entryId,
        reasonCodes: ["SOURCE_ENTRY_ID_MISSING"],
      })),
    );
  }

  const selectedEntryIds = new Set(manifest.selectedEntryIds);
  const selectedEntries = parsed.entries.filter((entry) => selectedEntryIds.has(entry.id));
  const selectedEntriesByForm: Array<{
    sourceForm: string;
    entries: typeof selectedEntries;
  }> = [];
  for (const entry of selectedEntries) {
    const firstSenseOffset = entry.xml.indexOf("<sense");
    const headwordXml =
      firstSenseOffset >= 0 ? entry.xml.slice(0, firstSenseOffset) : entry.xml;
    const sourceForm = headwordXml.match(
      /<orth\b[^>]*\blang="la"[^>]*>([\s\S]*?)<\/orth>/u,
    )?.[1] ?? "";
    if (!sourceForm) {
      return rejectedV1(inputSha256, [
        { entryId: entry.id, reasonCodes: ["EXACT_FORM_MISSING"] },
      ]);
    }
    const existingGroup = selectedEntriesByForm.find(
      (group) => group.sourceForm === sourceForm,
    );
    if (existingGroup) {
      existingGroup.entries.push(entry);
    } else {
      selectedEntriesByForm.push({ sourceForm, entries: [entry] });
    }
  }

  const attestations: SourceEntryAttestationV1[] = [];
  for (const group of selectedEntriesByForm) {
    const entries = [];
    for (const entry of group.entries) {
      const senses = extractSenseAttestationsV1(entry.xml, entry.id, entry.key);
      if (senses.length === 0) {
        return rejectedV1(inputSha256, [
          { entryId: entry.id, reasonCodes: ["NO_SUBSTANTIVE_SENSES"] },
        ]);
      }
      entries.push({
        entryId: entry.id,
        entryKey: entry.key,
        entryLocator: `TEI.2 entryFree id="${entry.id}" key="${entry.key}"`,
        sourceForm: group.sourceForm,
        senses,
        senseSelectionStatus:
          senses.length === 1 ? ("NOT_APPLICABLE" as const) : ("UNRESOLVED" as const),
        selectedSenseId: null,
      });
    }

    const rawAttestation = {
      schemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
      attestationId: `source-entry-attestation.scaife-lewis-short.form-${group.sourceForm}.v1`,
      sourceTraditionId: "scaife.lewis-short.v0_1",
      sourceTitle: SOURCE_NAME_V1,
      sourceAuthorOrEditor: "Charlton T. Lewis and Charles Short",
      sourcePublisherOrHost: "Perseus Digital Library / PerseusDL lexica",
      sourceDateOrVersion: SOURCE_DATE_V1,
      sourceRepositoryCommit: manifest.sourceRepositoryCommit,
      sourceFilePath: manifest.sourceFilePath,
      sourceUrlOrArchiveRef: manifest.sourceUrlOrArchiveRef,
      sourceHashOrArchiveHash: manifest.sourceFileGitBlobSha,
      sourceForm: group.sourceForm,
      sourceFormNormalization: "EXACT_PRESERVED" as const,
      sourceAttestation: "SOURCE_FORM_OR_ENTRY_ATTESTED" as const,
      entries,
      entrySelectionStatus:
        entries.length === 1 ? ("NOT_APPLICABLE" as const) : ("UNRESOLVED" as const),
      selectedEntryId: null,
    };
    const validated = validateSourceEntryAttestationV1(rawAttestation);
    if (!validated.ok) {
      return rejectedV1(inputSha256, [
        {
          entryId: null,
          reasonCodes: ["ENTRY_ATTESTATION_VALIDATION_FAILED", ...validated.reasonCodes],
        },
      ]);
    }
    attestations.push(validated.attestation);
  }

  const frozenAttestations = Object.freeze(attestations.slice());
  const outputJson = JSON.stringify(frozenAttestations);
  return {
    status: "IMPORTED",
    inputSha256,
    outputSha256: sha256V1(outputJson),
    outputJson,
    attestations: frozenAttestations,
    rejections: Object.freeze([]),
  };
}

import { createHash } from "node:crypto";
import {
  GENERIC_FUNCTIONAL_WITNESS_SOURCE_DATASET_VERSION_V1,
  GENERIC_FUNCTIONAL_WITNESS_SOURCE_RECORD_VERSION_V1,
  parseGenericFunctionalWitnessSourceDatasetV1,
  type GenericFunctionalWitnessSourceAcquisitionRecordV1,
  type GenericFunctionalWitnessSourceDatasetV1,
} from "../../src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1";

export const REVIEWED_LEWIS_SHORT_BATCH_IMPORTER_VERSION_V1 =
  "open-instrument.reviewed-lewis-short-batch-import.v1" as const;

export const REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1 =
  "scaife.lewis-short.v0_1" as const;

export const REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1 =
  "56061ca127f4a2844980baffc5f2b6d1332897b3" as const;

export const REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1 =
  "CTS_XML_TEI/perseus/pdllex/lat/ls/lat.ls.perseus-eng2.xml" as const;

export const REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1 =
  "c3474349ef9073bb436229cdf886eb77ed88d2fd" as const;

export const REVIEWED_LEWIS_SHORT_SOURCE_URL_V1 =
  `https://github.com/PerseusDL/lexica/blob/${REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1}/${REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1}` as const;

export const REVIEWED_LEWIS_SHORT_SOURCE_DATE_V1 =
  "Lewis & Short source file release date 1997-10-28; upstream commit 56061ca127f4a2844980baffc5f2b6d1332897b3" as const;

export const REVIEWED_LEWIS_SHORT_SELECTED_ENTRY_IDS_V1 = [
  "n3",
  "n7",
  "n9",
] as const;

export const REVIEWED_LEWIS_SHORT_SELECTION_RULE_V1 =
  "Exact source-internal entryFree IDs n3,n7,n9 in source-document order; selection is target-blind and does not inspect target words, embryos, correspondences, or chat examples." as const;

export const REVIEWED_LEWIS_SHORT_ATTRIBUTION_V1 =
  "Text provided under a CC BY-SA license by Perseus Digital Library, http://www.perseus.tufts.edu, with funding from The National Endowment for the Humanities. Data accessed from https://github.com/PerseusDL/lexica/ at the pinned commit." as const;

export const REVIEWED_LEWIS_SHORT_LICENSE_V1 = "CC BY-SA 4.0" as const;

export const REVIEWED_LEWIS_SHORT_LICENSE_FILE_V1 =
  "license.md; CTS_XML_TEI/perseus/pdllex/lat/ls/README.md" as const;

export type ReviewedLewisShortBatchManifestV1 = Readonly<{
  manifestVersion: typeof REVIEWED_LEWIS_SHORT_BATCH_IMPORTER_VERSION_V1;
  sourceName: "Lewis & Short Latin Dictionary";
  sourceEdition: "A Latin Dictionary, 1879; Unicode TEI source file";
  sourceRepository: "https://github.com/PerseusDL/lexica";
  sourceRepositoryCommit: typeof REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1;
  sourceFilePath: typeof REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1;
  sourceFormat: "TEI.2 XML";
  sourceLicense: typeof REVIEWED_LEWIS_SHORT_LICENSE_V1;
  licenseFile: typeof REVIEWED_LEWIS_SHORT_LICENSE_FILE_V1;
  attribution: typeof REVIEWED_LEWIS_SHORT_ATTRIBUTION_V1;
  sourceFileGitBlobSha: typeof REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1;
  sourceUrlOrArchiveRef: typeof REVIEWED_LEWIS_SHORT_SOURCE_URL_V1;
  sourceDateOrVersion: typeof REVIEWED_LEWIS_SHORT_SOURCE_DATE_V1;
  sourceSliceSha256: string;
  sourceSliceFormat: "TEI.2 XML entryFree slice";
  language: "Latin";
  languageVariety: null;
  evidenceFamily: "historical_dictionary";
  sourceStatus: "research_candidate";
  selectedEntryIds: readonly typeof REVIEWED_LEWIS_SHORT_SELECTED_ENTRY_IDS_V1[number][];
  selectionRule: typeof REVIEWED_LEWIS_SHORT_SELECTION_RULE_V1;
}>;

export type ReviewedLewisShortBatchImportReasonCodeV1 =
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
  | "GLOSS_MISSING"
  | "LANE2_VALIDATION_FAILED";

export type ReviewedLewisShortBatchRejectionV1 = Readonly<{
  entryId: string | null;
  reasonCodes: readonly ReviewedLewisShortBatchImportReasonCodeV1[];
}>;

export type ReviewedLewisShortBatchImportResultV1 = Readonly<{
  status: "IMPORTED" | "REJECTED";
  inputSha256: string;
  outputSha256: string | null;
  outputJson: string | null;
  dataset: GenericFunctionalWitnessSourceDatasetV1 | null;
  acceptedRecords: readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[];
  rejections: readonly ReviewedLewisShortBatchRejectionV1[];
}>;

type SourceEntryV1 = Readonly<{
  id: string;
  key: string;
  xml: string;
  senseCount: number;
}>;

type XmlScanResultV1 =
  | { ok: true; startTagNames: readonly string[] }
  | { ok: false };

const EXPECTED_SOURCE_REPOSITORY_V1 = "https://github.com/PerseusDL/lexica";
const EXPECTED_SOURCE_EDITION_V1 =
  "A Latin Dictionary, 1879; Unicode TEI source file";
const EXPECTED_SOURCE_FORMAT_V1 = "TEI.2 XML";
const EXPECTED_SOURCE_SLICE_FORMAT_V1 = "TEI.2 XML entryFree slice";
const EXPECTED_SOURCE_LANGUAGE_V1 = "Latin";
const EXPECTED_SOURCE_EVIDENCE_FAMILY_V1 = "historical_dictionary";
const EXPECTED_SOURCE_STATUS_V1 = "research_candidate";
const EXPECTED_SOURCE_HASH_PATTERN_V1 = /^[0-9a-f]{40}$/u;
const EXPECTED_SLICE_HASH_PATTERN_V1 = /^[0-9a-f]{64}$/u;

function sha256V1(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function compareTextV1(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedReasonCodesV1(
  reasonCodes: Iterable<ReviewedLewisShortBatchImportReasonCodeV1>,
): ReviewedLewisShortBatchImportReasonCodeV1[] {
  return [...new Set(reasonCodes)].sort(compareTextV1);
}

function rejectedV1(
  rejections: readonly ReviewedLewisShortBatchRejectionV1[],
  inputSha256: string,
): ReviewedLewisShortBatchImportResultV1 {
  return {
    status: "REJECTED",
    inputSha256,
    outputSha256: null,
    outputJson: null,
    dataset: null,
    acceptedRecords: [],
    rejections,
  };
}

function manifestIsValidV1(
  manifest: ReviewedLewisShortBatchManifestV1,
): boolean {
  return (
    manifest.manifestVersion ===
      REVIEWED_LEWIS_SHORT_BATCH_IMPORTER_VERSION_V1 &&
    manifest.sourceName === "Lewis & Short Latin Dictionary" &&
    manifest.sourceEdition === EXPECTED_SOURCE_EDITION_V1 &&
    manifest.sourceRepository === EXPECTED_SOURCE_REPOSITORY_V1 &&
    manifest.sourceRepositoryCommit ===
      REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1 &&
    manifest.sourceFilePath === REVIEWED_LEWIS_SHORT_SOURCE_FILE_PATH_V1 &&
    manifest.sourceFormat === EXPECTED_SOURCE_FORMAT_V1 &&
    manifest.sourceLicense === REVIEWED_LEWIS_SHORT_LICENSE_V1 &&
    manifest.licenseFile === REVIEWED_LEWIS_SHORT_LICENSE_FILE_V1 &&
    manifest.attribution === REVIEWED_LEWIS_SHORT_ATTRIBUTION_V1 &&
    manifest.sourceFileGitBlobSha ===
      REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1 &&
    manifest.sourceUrlOrArchiveRef === REVIEWED_LEWIS_SHORT_SOURCE_URL_V1 &&
    manifest.sourceDateOrVersion === REVIEWED_LEWIS_SHORT_SOURCE_DATE_V1 &&
    EXPECTED_SOURCE_HASH_PATTERN_V1.test(manifest.sourceFileGitBlobSha) &&
    EXPECTED_SLICE_HASH_PATTERN_V1.test(manifest.sourceSliceSha256) &&
    manifest.sourceSliceFormat === EXPECTED_SOURCE_SLICE_FORMAT_V1 &&
    manifest.language === EXPECTED_SOURCE_LANGUAGE_V1 &&
    manifest.languageVariety === null &&
    manifest.evidenceFamily === EXPECTED_SOURCE_EVIDENCE_FAMILY_V1 &&
    manifest.sourceStatus === EXPECTED_SOURCE_STATUS_V1 &&
    JSON.stringify(manifest.selectedEntryIds) ===
      JSON.stringify(REVIEWED_LEWIS_SHORT_SELECTED_ENTRY_IDS_V1) &&
    manifest.selectionRule === REVIEWED_LEWIS_SHORT_SELECTION_RULE_V1
  );
}

function findTagEndV1(source: string, startIndex: number): number {
  let quote: '"' | "'" | null = null;
  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === ">") return index;
  }
  return -1;
}

function scanXmlV1(source: string): XmlScanResultV1 {
  const stack: string[] = [];
  const startTagNames: string[] = [];
  let rootName: string | null = null;
  let rootCompleted = false;

  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== "<") {
      if (
        stack.length === 0 &&
        !/^\s$/u.test(source[index] ?? "")
      ) {
        return { ok: false };
      }
      continue;
    }

    if (source.startsWith("<!--", index)) {
      const commentEnd = source.indexOf("-->", index + 4);
      if (commentEnd < 0) return { ok: false };
      index = commentEnd + 2;
      continue;
    }
    if (source.startsWith("<![CDATA[", index)) {
      const cdataEnd = source.indexOf("]]>", index + 9);
      if (cdataEnd < 0 || stack.length === 0) return { ok: false };
      index = cdataEnd + 2;
      continue;
    }
    if (source.startsWith("<?", index)) {
      const instructionEnd = source.indexOf("?>", index + 2);
      if (instructionEnd < 0) return { ok: false };
      index = instructionEnd + 1;
      continue;
    }
    if (source.startsWith("<!", index)) return { ok: false };

    const tagEnd = findTagEndV1(source, index + 1);
    if (tagEnd < 0) return { ok: false };
    const token = source.slice(index, tagEnd + 1);
    if (token.startsWith("</")) {
      const closingMatch = token.match(
        /^<\/([A-Za-z_][A-Za-z0-9_.:-]*)\s*>$/u,
      );
      if (!closingMatch || stack.pop() !== closingMatch[1]) {
        return { ok: false };
      }
      if (stack.length === 0) rootCompleted = true;
      index = tagEnd;
      continue;
    }

    const openingMatch = token.match(
      /^<([A-Za-z_][A-Za-z0-9_.:-]*)(?=\s|\/?\s*>)[\s\S]*>$/u,
    );
    if (!openingMatch || rootCompleted) return { ok: false };
    const tagName = openingMatch[1];
    if (stack.length === 0) {
      if (rootName) return { ok: false };
      rootName = tagName;
    }
    startTagNames.push(tagName);
    if (!/\/\s*>$/u.test(token)) stack.push(tagName);
    else if (stack.length === 0) rootCompleted = true;
    index = tagEnd;
  }

  return rootName === "sourceSlice" && rootCompleted && stack.length === 0
    ? { ok: true, startTagNames }
    : { ok: false };
}

function parseSourceEntriesV1(sourceSlice: string):
  | { ok: true; entries: readonly SourceEntryV1[] }
  | { ok: false } {
  const scannedSource = scanXmlV1(sourceSlice);
  if (!scannedSource.ok) return { ok: false };
  const openCount = scannedSource.startTagNames.filter(
    (tagName) => tagName === "entryFree",
  ).length;
  if (openCount === 0) return { ok: false };

  const entries: SourceEntryV1[] = [];
  const entryPattern =
    /<entryFree\b(?=[^>]*\bid="([^"]+)")(?=[^>]*\bkey="([^"]+)")[^>]*>[\s\S]*?<\/entryFree>/gu;

  for (const match of sourceSlice.matchAll(entryPattern)) {
    const id = match[1];
    const key = match[2];
    const xml = match[0];
    if (!id || !key || !xml) return { ok: false };
    const scannedEntry = scanXmlV1(
      `<sourceSlice>${xml}</sourceSlice>`,
    );
    if (!scannedEntry.ok) return { ok: false };
    entries.push({
      id,
      key,
      xml,
      senseCount: scannedEntry.startTagNames.filter(
        (tagName) => tagName === "sense",
      ).length,
    });
  }

  return entries.length === openCount
    ? { ok: true, entries }
    : { ok: false };
}

function decodeXmlEntityV1(value: string): string {
  switch (value) {
    case "&amp;":
      return "&";
    case "&lt;":
      return "<";
    case "&gt;":
      return ">";
    case "&quot;":
      return '"';
    case "&apos;":
      return "'";
    default:
      return value;
  }
}

function stripXmlTagsV1(value: string): string {
  let output = "";
  let insideTag = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (insideTag) {
      if (character === ">") insideTag = false;
      continue;
    }
    if (character === "<") {
      insideTag = true;
      continue;
    }
    if (character === "&") {
      const semicolonIndex = value.indexOf(";", index + 1);
      if (semicolonIndex >= 0) {
        const entity = value.slice(index, semicolonIndex + 1);
        output += decodeXmlEntityV1(entity);
        index = semicolonIndex;
        continue;
      }
    }
    output += character;
  }

  return output
    .normalize("NFC")
    .trim()
    .replace(/\s+/gu, " ");
}

function buildRecordV1(
  entry: SourceEntryV1,
  manifest: ReviewedLewisShortBatchManifestV1,
):
  | { ok: true; record: GenericFunctionalWitnessSourceAcquisitionRecordV1 }
  | { ok: false; rejection: ReviewedLewisShortBatchRejectionV1 } {
  const firstSenseOffset = entry.xml.indexOf("<sense");
  const headwordXml =
    firstSenseOffset >= 0 ? entry.xml.slice(0, firstSenseOffset) : "";
  const orthMatch = headwordXml.match(
    /<orth\b[^>]*\blang="la"[^>]*>([\s\S]*?)<\/orth>/u,
  );
  const senseMatches = [
    ...entry.xml.matchAll(/<sense\b[^>]*>([\s\S]*?)<\/sense>/gu),
  ];
  const reasonCodes = new Set<ReviewedLewisShortBatchImportReasonCodeV1>();

  if (!firstSenseOffset || firstSenseOffset < 0) {
    reasonCodes.add("GLOSS_MISSING");
  }
  if (!orthMatch?.[1]) reasonCodes.add("EXACT_FORM_MISSING");
  if (orthMatch?.[1].includes("<") || orthMatch?.[1].includes("&")) {
    reasonCodes.add("UNSUPPORTED_SOURCE_FORM_ENCODING");
  }
  if (entry.senseCount === 0) reasonCodes.add("GLOSS_MISSING");
  if (entry.senseCount > 1) reasonCodes.add("AMBIGUOUS_SENSE_STRUCTURE");

  if (reasonCodes.size > 0) {
    return {
      ok: false,
      rejection: {
        entryId: entry.id,
        reasonCodes: sortedReasonCodesV1(reasonCodes),
      },
    };
  }

  const sourceForm = orthMatch[1];
  const gloss = stripXmlTagsV1(senseMatches[0][1]);
  if (!gloss) {
    return {
      ok: false,
      rejection: { entryId: entry.id, reasonCodes: ["GLOSS_MISSING"] },
    };
  }

  const entryLocator = `TEI.2 entryFree id="${entry.id}" key="${entry.key}"`;
  const lookupForm = sourceForm.toLocaleUpperCase("en-US").normalize("NFC");
  const sourceRecordId = `research.batch.scaife-lewis-short.entry-${entry.id}.v1`;
  const citationId = `${sourceRecordId}.citation`;
  const sourceUrlOrArchiveRef = manifest.sourceUrlOrArchiveRef;

  const record: GenericFunctionalWitnessSourceAcquisitionRecordV1 = {
    recordVersion: GENERIC_FUNCTIONAL_WITNESS_SOURCE_RECORD_VERSION_V1,
    sourceRecordId,
    sourceTraditionId: REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1,
    language: manifest.language,
    languageVariety: manifest.languageVariety,
    sourceTitle: manifest.sourceName,
    sourceAuthorOrEditor: "Charlton T. Lewis and Charles Short",
    sourcePublisherOrHost: "Perseus Digital Library / Tufts University",
    sourceDateOrVersion: manifest.sourceDateOrVersion,
    sourceUrlOrArchiveRef,
    entryLocator,
    sourceHashOrArchiveHash: manifest.sourceFileGitBlobSha,
    sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    queryForm: lookupForm,
    queryNormalization: "STRUCTURAL_DISPLAY_UPPERCASE",
    lookupForm,
    lookupNormalization: "EXACT_NFC",
    lookupTransformationAuthority: "STRUCTURAL_HYPOTHESIS_DISPLAY_FORM_V0_1",
    sourceFormRelation: "exact_form",
    queryRelation: "authorized_transformation",
    relationOperationIds: ["structural_display_form_v0_1"],
    evidenceFamily: manifest.evidenceFamily,
    gloss,
    attestationTruth: "fact",
    sourceStatus: manifest.sourceStatus,
    citation: {
      citationId,
      sourceTitle: manifest.sourceName,
      sourceAuthorOrEditor: "Charlton T. Lewis and Charles Short",
      sourcePublisherOrHost: "Perseus Digital Library / Tufts University",
      sourceDateOrVersion: manifest.sourceDateOrVersion,
      sourceUrlOrArchiveRef,
      entryLocator,
      sourceHashOrArchiveHash: manifest.sourceFileGitBlobSha,
      attestedForm: sourceForm,
      attestedGloss: gloss,
      provenanceGroupId: REVIEWED_LEWIS_SHORT_SOURCE_TRADITION_ID_V1,
    },
  };

  return { ok: true, record };
}

export function importReviewedLewisShortBatchV1(
  sourceSlice: string,
  manifest: ReviewedLewisShortBatchManifestV1,
): ReviewedLewisShortBatchImportResultV1 {
  const inputSha256 = sha256V1(sourceSlice);
  if (!manifestIsValidV1(manifest)) {
    return rejectedV1(
      [{ entryId: null, reasonCodes: ["MANIFEST_INVALID"] }],
      inputSha256,
    );
  }

  if (inputSha256 !== manifest.sourceSliceSha256) {
    return rejectedV1(
      [{ entryId: null, reasonCodes: ["SOURCE_SLICE_HASH_MISMATCH"] }],
      inputSha256,
    );
  }

  if (
    [
      "targetWord",
      "targetSenseId",
      "semanticBridge",
      "historicalOriginClaim",
      "historicalTransmissionClaim",
      "winnerClaim",
      "candidateTruthClaim",
      "languageSuperiorityClaim",
    ].some((field) => sourceSlice.includes(`<${field}`))
  ) {
    return rejectedV1(
      [{ entryId: null, reasonCodes: ["MANIFEST_INVALID"] }],
      inputSha256,
    );
  }

  const parsedSource = parseSourceEntriesV1(sourceSlice);
  if (!parsedSource.ok) {
    return rejectedV1(
      [{ entryId: null, reasonCodes: ["SOURCE_XML_MALFORMED"] }],
      inputSha256,
    );
  }

  const entriesById = new Map<string, SourceEntryV1>();
  const duplicateIds = new Set<string>();
  for (const entry of parsedSource.entries) {
    if (entriesById.has(entry.id)) duplicateIds.add(entry.id);
    entriesById.set(entry.id, entry);
  }
  if (duplicateIds.size > 0) {
    return rejectedV1(
      [
        {
          entryId: null,
          reasonCodes: ["SOURCE_ENTRY_ID_DUPLICATE"],
        },
      ],
      inputSha256,
    );
  }

  const selectedIds = [...manifest.selectedEntryIds];
  const unexpectedIds = [...entriesById.keys()].filter(
    (entryId) => !selectedIds.includes(entryId as (typeof selectedIds)[number]),
  );
  if (unexpectedIds.length > 0) {
    return rejectedV1(
      unexpectedIds.sort(compareTextV1).map((entryId) => ({
        entryId,
        reasonCodes: ["SOURCE_ENTRY_ID_UNEXPECTED"],
      })),
      inputSha256,
    );
  }

  const missingIds = selectedIds.filter((entryId) => !entriesById.has(entryId));
  if (missingIds.length > 0) {
    return rejectedV1(
      missingIds.map((entryId) => ({
        entryId,
        reasonCodes: ["SOURCE_ENTRY_ID_MISSING"],
      })),
      inputSha256,
    );
  }

  const records: GenericFunctionalWitnessSourceAcquisitionRecordV1[] = [];
  const rejections: ReviewedLewisShortBatchRejectionV1[] = [];
  for (const entryId of selectedIds) {
    const entry = entriesById.get(entryId);
    if (!entry) {
      rejections.push({ entryId, reasonCodes: ["SOURCE_ENTRY_ID_MISSING"] });
      continue;
    }
    const built = buildRecordV1(entry, manifest);
    if (built.ok) records.push(built.record);
    else rejections.push(built.rejection);
  }
  if (rejections.length > 0) return rejectedV1(rejections, inputSha256);

  const datasetCandidate = {
    datasetVersion: GENERIC_FUNCTIONAL_WITNESS_SOURCE_DATASET_VERSION_V1,
    sourceAuthority: "RESEARCH_EXTERNAL_SOURCE_INPUT" as const,
    records,
  };
  const parsedDataset = parseGenericFunctionalWitnessSourceDatasetV1(datasetCandidate);
  if (!parsedDataset.ok) {
    return rejectedV1(
      [
        {
          entryId: null,
          reasonCodes: ["LANE2_VALIDATION_FAILED"],
        },
      ],
      inputSha256,
    );
  }

  const outputJson = `${JSON.stringify(parsedDataset.dataset, null, 2)}\n`;
  return {
    status: "IMPORTED",
    inputSha256,
    outputSha256: sha256V1(outputJson),
    outputJson,
    dataset: parsedDataset.dataset,
    acceptedRecords: parsedDataset.dataset.records,
    rejections: [],
  };
}

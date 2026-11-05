import { createHash } from "node:crypto";
import {
  SaxesParser,
  type SaxesAttributeNS,
  type SaxesTagNS,
} from "saxes";

export const STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1 =
  "open-instrument.strict-blind-perseus-source-packet.v1" as const;

export const STRICT_BLIND_PERSEUS_SOURCE_ACCESS_DATE_V1 = "2026-11-05" as const;

export const STRICT_BLIND_PERSEUS_SOURCE_TRADITIONS_V1 = [
  "scaife.lewis-short.v0_1",
  "scaife.middle-liddell.v0_1",
] as const;

export const STRICT_BLIND_FROZEN_SOURCE_TRADITIONS_V1 = [
  "fjale.fjalor-shqip.v0_1",
  ...STRICT_BLIND_PERSEUS_SOURCE_TRADITIONS_V1,
] as const;

export const STRICT_BLIND_FROZEN_SEARCH_STAGES_V1 = [
  "S0 exact embryo",
  "S1 identity-preserving normalization",
  "S2 source-attested bounded morphology",
  "S3 source-attested dialect/history",
  "S4 authoritative reconstruction",
] as const;

export const STRICT_BLIND_PERSEUS_LICENSE_V1 = "CC-BY-SA-4.0" as const;
export const STRICT_BLIND_PERSEUS_LICENSE_REFERENCE_V1 =
  "https://creativecommons.org/licenses/by-sa/4.0/" as const;

type PerseusSourceTraditionIdV1 =
  (typeof STRICT_BLIND_PERSEUS_SOURCE_TRADITIONS_V1)[number];

type FrozenSourceTraditionIdV1 =
  (typeof STRICT_BLIND_FROZEN_SOURCE_TRADITIONS_V1)[number];

type SourceHeaderV1 = Readonly<{
  title: string;
  authors: readonly string[];
  publisher: string;
  publicationDate: string | null;
  isbn: string | null;
  availabilityStatement: string | null;
}>;

type SourceAttributionV1 = Readonly<{
  licenseIdentifier: typeof STRICT_BLIND_PERSEUS_LICENSE_V1;
  licenseDecisionReference: typeof STRICT_BLIND_PERSEUS_LICENSE_REFERENCE_V1;
  attributionRequired: true;
  modificationsMustBeOffered: true;
  attributionText: string;
}>;

type PerseusSourceDefinitionV1 = Readonly<{
  sourceTraditionId: PerseusSourceTraditionIdV1;
  repository: string;
  upstreamCommitSha: string;
  sourcePath: string;
  sourceVersion: string;
  accessDate: typeof STRICT_BLIND_PERSEUS_SOURCE_ACCESS_DATE_V1;
  header: SourceHeaderV1;
  attribution: SourceAttributionV1;
  language: "Latin" | "Ancient Greek";
  rawByteLength: number;
  rawSha256: string;
}>;

export const STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1: Readonly<
  Record<PerseusSourceTraditionIdV1, PerseusSourceDefinitionV1>
> = Object.freeze({
  "scaife.lewis-short.v0_1": Object.freeze({
    sourceTraditionId: "scaife.lewis-short.v0_1",
    repository: "https://github.com/PerseusDL/lexica",
    upstreamCommitSha:
      "1c34cdf756c63cf37db61bd366d733431dbd7aa0",
    sourcePath:
      "CTS_XML_TEI/perseus/pdllex/lat/ls/lat.ls.perseus-eng2.xml",
    sourceVersion:
      "PerseusDL/lexica master at commit 1c34cdf756c63cf37db61bd366d733431dbd7aa0",
    accessDate: STRICT_BLIND_PERSEUS_SOURCE_ACCESS_DATE_V1,
    header: Object.freeze({
      title: "A Latin Dictionary",
      authors: ["Charlton T. Lewis", "Charles Short"],
      publisher: "Trustees of Tufts University",
      publicationDate: "1879",
      isbn: "0198642016",
      availabilityStatement:
        "Available under a Creative Commons Attribution-ShareAlike (CC BY-SA) license. Reuse must credit the Perseus Digital Library and identify the source repository; corrections must be offered to the Perseus Digital Library.",
    }),
    attribution: Object.freeze({
      licenseIdentifier: STRICT_BLIND_PERSEUS_LICENSE_V1,
      licenseDecisionReference: STRICT_BLIND_PERSEUS_LICENSE_REFERENCE_V1,
      attributionRequired: true,
      modificationsMustBeOffered: true,
      attributionText:
        "Text provided under a CC BY-SA license by Perseus Digital Library, http://www.perseus.tufts.edu; source data accessed from https://github.com/PerseusDL/lexica/.",
    }),
    language: "Latin",
    rawByteLength: 77415379,
    rawSha256:
      "933ba8fde0ef06823f69a130c95ba6f345ece3cb1603514b17972d1edd421d32",
  }),
  "scaife.middle-liddell.v0_1": Object.freeze({
    sourceTraditionId: "scaife.middle-liddell.v0_1",
    repository: "https://github.com/PerseusDL/canonical-pdlrefwk",
    upstreamCommitSha:
      "02768b0c37d6102be4899fc0eb57f9d348195243",
    sourcePath:
      "data/viaf66541464/001/viaf66541464.001.perseus-eng1.xml",
    sourceVersion:
      "PerseusDL/canonical-pdlrefwk master at commit 02768b0c37d6102be4899fc0eb57f9d348195243",
    accessDate: STRICT_BLIND_PERSEUS_SOURCE_ACCESS_DATE_V1,
    header: Object.freeze({
      title: "An Intermediate Greek-English Lexicon",
      authors: ["Henry George Liddell", "Robert Scott"],
      publisher: "Trustees of Tufts University",
      publicationDate: "1889",
      isbn: "0199102066",
      availabilityStatement:
        "Texts may be freely distributed under a CC BY-SA 4.0 license; credit Perseus, leave the availability statement intact, offer modifications to Perseus, and include file header information whenever possible.",
    }),
    attribution: Object.freeze({
      licenseIdentifier: STRICT_BLIND_PERSEUS_LICENSE_V1,
      licenseDecisionReference: STRICT_BLIND_PERSEUS_LICENSE_REFERENCE_V1,
      attributionRequired: true,
      modificationsMustBeOffered: true,
      attributionText:
        "Text provided under a CC BY-SA license by Perseus Digital Library, http://www.perseus.tufts.edu; data accessed from https://github.com/PerseusDL/canonical-pdlrefwk/.",
    }),
    language: "Ancient Greek",
    rawByteLength: 20190148,
    rawSha256:
      "e273dbed7938de7ab9ed4cf4af0e93216141f89226318a697c94b5d43f924cb7",
  }),
});

export type StrictBlindPerseusSourceSnapshotV1 = Readonly<{
  sourceTraditionId: PerseusSourceTraditionIdV1;
  repository: string;
  upstreamCommitSha: string;
  sourcePath: string;
  sourceVersion: string;
  accessDate: typeof STRICT_BLIND_PERSEUS_SOURCE_ACCESS_DATE_V1;
  rawByteLength: number;
  rawSha256: string;
  licenseIdentifier: typeof STRICT_BLIND_PERSEUS_LICENSE_V1;
  licenseDecisionReference: typeof STRICT_BLIND_PERSEUS_LICENSE_REFERENCE_V1;
  attribution: SourceAttributionV1;
  sourceHeader: SourceHeaderV1;
  sourceAcquisitionState: "VERIFIED_PINNED_SNAPSHOT";
}>;

export type StrictBlindPerseusEntrySenseV1 = Readonly<{
  senseId: string | null;
  text: string;
}>;

export type StrictBlindPerseusExtractedEntryV1 = Readonly<{
  entryLocator: string;
  entryId: string | null;
  entryKey: string | null;
  attestedSpelling: string;
  extractedText: string;
  senses: readonly StrictBlindPerseusEntrySenseV1[];
  sourceProcessingStatus: "EXTRACTED_REVIEW_REQUIRED";
  sourceValidationStatus: "TEI_WELL_FORMED_BOUNDED";
}>;

export type StrictBlindPerseusSourcePacketV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1;
  sourceTraditionId: PerseusSourceTraditionIdV1;
  outcome: "FOUND" | "NOT_FOUND";
  source: StrictBlindPerseusSourceSnapshotV1;
  entry: StrictBlindPerseusExtractedEntryV1 | null;
  lookup: Readonly<{
    status: "NOT_REQUIRED_FOR_FOUND" | "COMPLETED_OVER_VERIFIED_SNAPSHOT";
    coverage: "ENTRY_EXTRACTED" | "COMPLETE_VERIFIED_SNAPSHOT";
  }>;
  unavailable: null;
}>;

export type StrictBlindPerseusUnavailablePacketV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1;
  sourceTraditionId: "fjale.fjalor-shqip.v0_1";
  outcome: "SOURCE_UNAVAILABLE";
  source: null;
  entry: null;
  lookup: null;
  unavailable: Readonly<{
    reasonCode: "REUSE_AUTHORITY_UNVERIFIED";
    detail: "SOURCE_UNAVAILABLE";
    accessPerformed: false;
  }>;
}>;

export type StrictBlindPerseusPacketV1 =
  | StrictBlindPerseusSourcePacketV1
  | StrictBlindPerseusUnavailablePacketV1;

export type StrictBlindPerseusPacketReasonCodeV1 =
  | "PACKET_INVALID"
  | "UNSUPPORTED_SOURCE_TRADITION"
  | "SOURCE_BYTES_MISSING"
  | "SOURCE_BYTE_LENGTH_MISMATCH"
  | "SOURCE_SHA256_MISMATCH"
  | "SOURCE_METADATA_MISMATCH"
  | "ENTRY_REQUIRED_FOR_FOUND"
  | "ENTRY_FORBIDDEN_FOR_NOT_FOUND"
  | "NOT_FOUND_LOOKUP_INCOMPLETE"
  | "NOT_FOUND_SNAPSHOT_UNVERIFIED"
  | "FJALE_SOURCE_ACCESS_FORBIDDEN"
  | "DTD_FORBIDDEN"
  | "EXTERNAL_ENTITY_FORBIDDEN"
  | "MALFORMED_XML"
  | "UNSUPPORTED_TEI_SCHEMA"
  | "ENTRY_SELECTOR_INVALID"
  | "ENTRY_NOT_FOUND"
  | "ENTRY_SPELLING_MISSING"
  | "EXTRACTED_TEXT_MISSING"
  | "ELEMENT_LIMIT_EXCEEDED"
  | "DEPTH_LIMIT_EXCEEDED"
  | "ATTRIBUTE_LIMIT_EXCEEDED"
  | "TEXT_LIMIT_EXCEEDED"
  | "INPUT_BYTE_LIMIT_EXCEEDED"
  | "ENTRY_LIMIT_EXCEEDED";

export type StrictBlindPerseusPacketValidationResultV1 = Readonly<
  | { ok: true; packet: StrictBlindPerseusPacketV1 }
  | {
      ok: false;
      packet: null;
      reasonCodes: readonly StrictBlindPerseusPacketReasonCodeV1[];
    }
>;

export type StrictBlindPerseusSourceSnapshotVerificationResultV1 = Readonly<
  | { ok: true; snapshot: StrictBlindPerseusSourceSnapshotV1 }
  | {
      ok: false;
      reasonCode: StrictBlindPerseusPacketReasonCodeV1;
    }
>;

export type StrictBlindPerseusTeiEntrySelectorV1 = Readonly<{
  entryId?: string;
  entryKey?: string;
  entryOrdinal?: number;
}>;

export type StrictBlindPerseusTeiExtractionResultV1 = Readonly<
  | { ok: true; entry: StrictBlindPerseusExtractedEntryV1 }
  | {
      ok: false;
      reasonCode: StrictBlindPerseusPacketReasonCodeV1;
    }
>;

export type StrictBlindPerseusTeiLimitsV1 = Readonly<{
  maxInputBytes: number;
  maxDepth: number;
  maxElements: number;
  maxAttributesPerElement: number;
  maxTextCharacters: number;
  maxEntriesExamined: number;
}>;

export const STRICT_BLIND_PERSEUS_DEFAULT_TEI_LIMITS_V1: StrictBlindPerseusTeiLimitsV1 =
  Object.freeze({
    maxInputBytes: 128 * 1024 * 1024,
    maxDepth: 128,
    maxElements: 2_000_000,
    maxAttributesPerElement: 128,
    maxTextCharacters: 2_000_000,
    maxEntriesExamined: 1_000_000,
  });

type TeiChunkV1 = string | Uint8Array;
type EntryFrameV1 = {
  depth: number;
  ordinal: number;
  localName: string;
  id: string | null;
  key: string | null;
  spellingParts: string[];
  spellingDepth: number | null;
  senses: Array<{ depth: number; id: string | null; parts: string[] }>;
};

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value === value.normalize("NFC")
  );
}

function exactSourceTextV1(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
}

const FORBIDDEN_PACKET_KEYS_V1 = new Set([
  "targetWord",
  "targetSenseId",
  "targetSenseLabel",
  "targetTranslation",
  "embryo",
  "embryoRelation",
  "semanticBridge",
  "functionDecision",
  "controllerIdentity",
  "previousCaseResult",
]);

function hasForbiddenPacketKeyV1(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasForbiddenPacketKeyV1);
  return Object.entries(value).some(
    ([key, nested]) => FORBIDDEN_PACKET_KEYS_V1.has(key) || hasForbiddenPacketKeyV1(nested),
  );
}

function hasExactKeysV1(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
}

function sortReasonCodesV1(
  values: Iterable<StrictBlindPerseusPacketReasonCodeV1>,
): StrictBlindPerseusPacketReasonCodeV1[] {
  return [...new Set(values)].sort();
}

function sha256V1(bytes: Uint8Array): string {
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}

function byteLengthV1(value: string | Uint8Array): number {
  return typeof value === "string" ? Buffer.byteLength(value, "utf8") : value.byteLength;
}

function sourceDefinitionV1(
  sourceTraditionId: unknown,
): PerseusSourceDefinitionV1 | null {
  if (
    sourceTraditionId !== "scaife.lewis-short.v0_1" &&
    sourceTraditionId !== "scaife.middle-liddell.v0_1"
  ) {
    return null;
  }
  return STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1[sourceTraditionId];
}

function sourceSnapshotFromBytesV1(
  sourceTraditionId: unknown,
  bytes: Uint8Array | null | undefined,
):
  | { ok: true; snapshot: StrictBlindPerseusSourceSnapshotV1 }
  | { ok: false; reasonCode: StrictBlindPerseusPacketReasonCodeV1 } {
  const definition = sourceDefinitionV1(sourceTraditionId);
  if (!definition) {
    return { ok: false, reasonCode: "UNSUPPORTED_SOURCE_TRADITION" };
  }
  if (!bytes || bytes.byteLength === 0) {
    return { ok: false, reasonCode: "SOURCE_BYTES_MISSING" };
  }
  const rawSha256 = sha256V1(bytes);
  if (bytes.byteLength !== definition.rawByteLength) {
    return { ok: false, reasonCode: "SOURCE_BYTE_LENGTH_MISMATCH" };
  }
  if (rawSha256 !== definition.rawSha256) {
    return { ok: false, reasonCode: "SOURCE_SHA256_MISMATCH" };
  }

  return {
    ok: true,
    snapshot: {
      sourceTraditionId: definition.sourceTraditionId,
      repository: definition.repository,
      upstreamCommitSha: definition.upstreamCommitSha,
      sourcePath: definition.sourcePath,
      sourceVersion: definition.sourceVersion,
      accessDate: definition.accessDate,
      rawByteLength: bytes.byteLength,
      rawSha256,
      licenseIdentifier: definition.attribution.licenseIdentifier,
      licenseDecisionReference: definition.attribution.licenseDecisionReference,
      attribution: definition.attribution,
      sourceHeader: definition.header,
      sourceAcquisitionState: "VERIFIED_PINNED_SNAPSHOT",
    },
  };
}

export function verifyStrictBlindPerseusSourceBytesV1(input: Readonly<{
  sourceTraditionId: unknown;
  bytes: Uint8Array | null | undefined;
  expectedByteLength: number;
  expectedSha256: string;
}>): StrictBlindPerseusSourceSnapshotVerificationResultV1 {
  const snapshot = sourceSnapshotFromBytesV1(input.sourceTraditionId, input.bytes);
  if (!snapshot.ok) {
    return snapshot;
  }
  if (snapshot.snapshot.rawByteLength !== input.expectedByteLength) {
    return { ok: false, reasonCode: "SOURCE_BYTE_LENGTH_MISMATCH" };
  }
  if (snapshot.snapshot.rawSha256 !== input.expectedSha256) {
    return { ok: false, reasonCode: "SOURCE_SHA256_MISMATCH" };
  }
  return snapshot;
}

function normalizeExtractedTextV1(parts: readonly string[]): string {
  return parts.join("").replace(/\s+/gu, " ").trim();
}

function attributeValueV1(tag: SaxesTagNS, name: string): string | null {
  for (const [attributeName, attribute] of Object.entries(tag.attributes)) {
    const candidate = attribute as SaxesAttributeNS;
    if (candidate.local === name || attributeName === name) return candidate.value;
  }
  return null;
}

function localNameV1(tag: SaxesTagNS): string {
  return tag.local ?? tag.name.split(":").at(-1) ?? tag.name;
}

function selectorIsValidV1(selector: StrictBlindPerseusTeiEntrySelectorV1): boolean {
  const fields = [selector.entryId, selector.entryKey, selector.entryOrdinal].filter(
    (value) => value !== undefined,
  );
  if (fields.length !== 1) return false;
  if (selector.entryId !== undefined && !exactSourceTextV1(selector.entryId)) return false;
  if (selector.entryKey !== undefined && !exactSourceTextV1(selector.entryKey)) return false;
  return (
    selector.entryOrdinal === undefined ||
    (Number.isInteger(selector.entryOrdinal) && selector.entryOrdinal >= 0)
  );
}

function selectorMatchesV1(
  selector: StrictBlindPerseusTeiEntrySelectorV1,
  entry: EntryFrameV1,
): boolean {
  if (selector.entryId !== undefined) return selector.entryId === entry.id;
  if (selector.entryKey !== undefined) return selector.entryKey === entry.key;
  return selector.entryOrdinal === entry.ordinal;
}

function entryLocatorV1(entry: EntryFrameV1, sourcePath: string): string {
  return `${sourcePath}#${entry.localName}[ordinal=${entry.ordinal};id=${encodeURIComponent(
    entry.id ?? "NULL",
  )};key=${encodeURIComponent(entry.key ?? "NULL")}]`;
}

function appendTextV1(
  entry: EntryFrameV1,
  stack: readonly { depth: number; localName: string }[],
  text: string,
): void {
  if (stack.some((frame) => frame.localName === "orth")) {
    entry.spellingParts.push(text);
  }
  const sense = [...entry.senses].reverse().find((candidate) =>
    stack.some((frame) => frame.depth === candidate.depth),
  );
  if (sense && stack.some((frame) => frame.depth === sense.depth)) {
    sense.parts.push(text);
  }
}

function finishEntryV1(
  entry: EntryFrameV1,
  sourcePath: string,
): StrictBlindPerseusTeiExtractionResultV1 {
  const attestedSpelling = normalizeExtractedTextV1(entry.spellingParts);
  const senses = entry.senses.map((sense) => ({
    senseId: sense.id,
    text: normalizeExtractedTextV1(sense.parts),
  }));
  const extractedText = senses
    .map((sense) => sense.text)
    .filter(Boolean)
    .join(" | ");

  if (!attestedSpelling) return { ok: false, reasonCode: "ENTRY_SPELLING_MISSING" };
  if (!extractedText) return { ok: false, reasonCode: "EXTRACTED_TEXT_MISSING" };

  return {
    ok: true,
    entry: {
      entryLocator: entryLocatorV1(entry, sourcePath),
      entryId: entry.id,
      entryKey: entry.key,
      attestedSpelling,
      extractedText,
      senses,
      sourceProcessingStatus: "EXTRACTED_REVIEW_REQUIRED",
      sourceValidationStatus: "TEI_WELL_FORMED_BOUNDED",
    },
  };
}

export function extractStrictBlindPerseusTeiEntryV1(input: Readonly<{
  sourceTraditionId: unknown;
  chunks: Iterable<TeiChunkV1>;
  selector: StrictBlindPerseusTeiEntrySelectorV1;
  limits?: Partial<StrictBlindPerseusTeiLimitsV1>;
}>): StrictBlindPerseusTeiExtractionResultV1 {
  const definition = sourceDefinitionV1(input.sourceTraditionId);
  if (!definition) return { ok: false, reasonCode: "UNSUPPORTED_SOURCE_TRADITION" };
  if (!selectorIsValidV1(input.selector)) {
    return { ok: false, reasonCode: "ENTRY_SELECTOR_INVALID" };
  }

  const limits: StrictBlindPerseusTeiLimitsV1 = {
    ...STRICT_BLIND_PERSEUS_DEFAULT_TEI_LIMITS_V1,
    ...input.limits,
  };
  const parser = new SaxesParser({
    xmlns: true,
    position: false,
    fragment: false,
    fileName: definition.sourcePath,
  });
  const stack: Array<{ depth: number; localName: string }> = [];
  let rootSeen = false;
  let rootClosed = false;
  let elementCount = 0;
  let entryCount = 0;
  let byteCount = 0;
  let matchedEntry: EntryFrameV1 | null = null;
  let result: StrictBlindPerseusTeiExtractionResultV1 | null = null;
  let failure: StrictBlindPerseusPacketReasonCodeV1 | null = null;
  let rollingMarkup = "";
  let textCharacters = 0;

  const fail = (reasonCode: StrictBlindPerseusPacketReasonCodeV1): void => {
    if (failure) return;
    failure = reasonCode;
    parser.fail(reasonCode);
  };

  parser.on("doctype", () => fail("DTD_FORBIDDEN"));
  parser.on("error", () => {
    if (!failure) failure = "MALFORMED_XML";
  });
  parser.on("opentag", (tag) => {
    if (failure) return;
    elementCount += 1;
    if (elementCount > limits.maxElements) return fail("ELEMENT_LIMIT_EXCEEDED");
    const depth = stack.length + 1;
    if (depth > limits.maxDepth) return fail("DEPTH_LIMIT_EXCEEDED");
    if (Object.keys(tag.attributes).length > limits.maxAttributesPerElement) {
      return fail("ATTRIBUTE_LIMIT_EXCEEDED");
    }

    const localName = localNameV1(tag);
    stack.push({ depth, localName });
    if (!rootSeen) {
      rootSeen = true;
      if (localName !== "TEI.2" && localName !== "TEI") {
        fail("UNSUPPORTED_TEI_SCHEMA");
      }
      return;
    }
    if (depth === 1) rootClosed = false;

    if (localName === "entryFree" || localName === "entry") {
      entryCount += 1;
      if (entryCount > limits.maxEntriesExamined) {
        return fail("ENTRY_LIMIT_EXCEEDED");
      }
      const candidate: EntryFrameV1 = {
        depth,
        ordinal: entryCount - 1,
        localName,
        id: attributeValueV1(tag, "id"),
        key: attributeValueV1(tag, "key"),
        spellingParts: [],
        spellingDepth: null,
        senses: [],
      };
      if (selectorMatchesV1(input.selector, candidate)) matchedEntry = candidate;
    }
    if (!matchedEntry) return;
    if (localName === "orth" && matchedEntry.spellingDepth === null) {
      matchedEntry.spellingDepth = depth;
    }
    if (localName === "sense") {
      matchedEntry.senses.push({
        depth,
        id: attributeValueV1(tag, "id") ?? attributeValueV1(tag, "n"),
        parts: [],
      });
    }
  });
  parser.on("text", (text) => {
    if (failure || !matchedEntry) return;
    textCharacters += text.length;
    if (textCharacters > limits.maxTextCharacters) return fail("TEXT_LIMIT_EXCEEDED");
    appendTextV1(matchedEntry, stack, text);
  });
  parser.on("cdata", (text) => {
    if (failure || !matchedEntry) return;
    textCharacters += text.length;
    if (textCharacters > limits.maxTextCharacters) return fail("TEXT_LIMIT_EXCEEDED");
    appendTextV1(matchedEntry, stack, text);
  });
  parser.on("closetag", (tag) => {
    if (failure) return;
    const localName = localNameV1(tag);
    if (matchedEntry && localName === "sense") {
      const sense = [...matchedEntry.senses].reverse().find((candidate) =>
        stack.some((frame) => frame.depth === candidate.depth),
      );
      if (!sense || sense.depth !== stack.length) return fail("MALFORMED_XML");
    }
    if (matchedEntry && localName === matchedEntry.localName && stack.length === matchedEntry.depth) {
      result = finishEntryV1(matchedEntry, definition.sourcePath);
      matchedEntry = null;
    }
    stack.pop();
    if (stack.length === 0) rootClosed = true;
  });

  try {
    const decoder = new TextDecoder("utf-8", { fatal: true });
    for (const chunk of input.chunks) {
      if (failure) break;
      byteCount += byteLengthV1(chunk);
      if (byteCount > limits.maxInputBytes) {
        fail("INPUT_BYTE_LIMIT_EXCEEDED");
        break;
      }
      const text =
        typeof chunk === "string"
          ? chunk
          : decoder.decode(chunk, { stream: true });
      rollingMarkup = `${rollingMarkup}${text}`.slice(-256);
      if (/<\s*!\s*(?:DOCTYPE|ENTITY|\[)/iu.test(rollingMarkup)) {
        fail(rollingMarkup.includes("ENTITY") ? "EXTERNAL_ENTITY_FORBIDDEN" : "DTD_FORBIDDEN");
        break;
      }
      parser.write(text);
    }
    if (!failure) {
      const trailingText = decoder.decode();
      if (trailingText) parser.write(trailingText);
      parser.close();
    }
  } catch {
    if (!failure) failure = "MALFORMED_XML";
  }

  if (failure) return { ok: false, reasonCode: failure };
  if (!rootSeen || !rootClosed || stack.length !== 0) {
    return { ok: false, reasonCode: "MALFORMED_XML" };
  }
  return result ?? { ok: false, reasonCode: "ENTRY_NOT_FOUND" };
}

export function extractStrictBlindPerseusTeiEntryFromBytesV1(input: Readonly<{
  sourceTraditionId: unknown;
  bytes: Uint8Array;
  selector: StrictBlindPerseusTeiEntrySelectorV1;
  limits?: Partial<StrictBlindPerseusTeiLimitsV1>;
}>): StrictBlindPerseusTeiExtractionResultV1 {
  return extractStrictBlindPerseusTeiEntryV1({
    ...input,
    chunks: [input.bytes],
  });
}

export function buildStrictBlindPerseusFoundPacketV1(input: Readonly<{
  sourceTraditionId: PerseusSourceTraditionIdV1;
  source: StrictBlindPerseusSourceSnapshotV1;
  entry: StrictBlindPerseusExtractedEntryV1;
}>): StrictBlindPerseusPacketValidationResultV1 {
  const packet: StrictBlindPerseusSourcePacketV1 = {
    schemaVersion: STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1,
    sourceTraditionId: input.sourceTraditionId,
    outcome: "FOUND",
    source: input.source,
    entry: input.entry,
    lookup: { status: "NOT_REQUIRED_FOR_FOUND", coverage: "ENTRY_EXTRACTED" },
    unavailable: null,
  };
  return validateStrictBlindPerseusSourcePacketV1(packet);
}

export function buildStrictBlindPerseusNotFoundPacketV1(input: Readonly<{
  sourceTraditionId: PerseusSourceTraditionIdV1;
  source: StrictBlindPerseusSourceSnapshotV1;
  authorizedLookupCompleted: boolean;
  completeVerifiedSnapshot: boolean;
}>): StrictBlindPerseusPacketValidationResultV1 {
  if (!input.authorizedLookupCompleted) {
    return { ok: false, packet: null, reasonCodes: ["NOT_FOUND_LOOKUP_INCOMPLETE"] };
  }
  if (!input.completeVerifiedSnapshot) {
    return { ok: false, packet: null, reasonCodes: ["NOT_FOUND_SNAPSHOT_UNVERIFIED"] };
  }
  return validateStrictBlindPerseusSourcePacketV1({
    schemaVersion: STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1,
    sourceTraditionId: input.sourceTraditionId,
    outcome: "NOT_FOUND",
    source: input.source,
    entry: null,
    lookup: {
      status: "COMPLETED_OVER_VERIFIED_SNAPSHOT",
      coverage: "COMPLETE_VERIFIED_SNAPSHOT",
    },
    unavailable: null,
  });
}

export function buildStrictBlindPerseusSourceUnavailablePacketV1(): StrictBlindPerseusUnavailablePacketV1 {
  return {
    schemaVersion: STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1,
    sourceTraditionId: "fjale.fjalor-shqip.v0_1",
    outcome: "SOURCE_UNAVAILABLE",
    source: null,
    entry: null,
    lookup: null,
    unavailable: {
      reasonCode: "REUSE_AUTHORITY_UNVERIFIED",
      detail: "SOURCE_UNAVAILABLE",
      accessPerformed: false,
    },
  };
}

function sourceSnapshotMatchesDefinitionV1(
  source: Record<string, unknown>,
  sourceTraditionId: PerseusSourceTraditionIdV1,
): boolean {
  const definition = STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1[sourceTraditionId];
  return (
    source.sourceTraditionId === sourceTraditionId &&
    source.repository === definition.repository &&
    source.upstreamCommitSha === definition.upstreamCommitSha &&
    source.sourcePath === definition.sourcePath &&
    source.sourceVersion === definition.sourceVersion &&
    source.accessDate === definition.accessDate &&
    source.licenseIdentifier === definition.attribution.licenseIdentifier &&
    source.licenseDecisionReference === definition.attribution.licenseDecisionReference &&
    source.sourceAcquisitionState === "VERIFIED_PINNED_SNAPSHOT" &&
    Number.isInteger(source.rawByteLength) &&
    source.rawByteLength === definition.rawByteLength &&
    exactTextV1(source.rawSha256) &&
    source.rawSha256 === definition.rawSha256 &&
    JSON.stringify(source.sourceHeader) === JSON.stringify(definition.header) &&
    JSON.stringify(source.attribution) === JSON.stringify(definition.attribution)
  );
}

export function validateStrictBlindPerseusSourcePacketV1(
  value: unknown,
): StrictBlindPerseusPacketValidationResultV1 {
  if (
    !isRecordV1(value) ||
    value.schemaVersion !== STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1 ||
    hasForbiddenPacketKeyV1(value)
  ) {
    return { ok: false, packet: null, reasonCodes: ["PACKET_INVALID"] };
  }
  if (value.outcome === "SOURCE_UNAVAILABLE") {
    const valid =
      hasExactKeysV1(value, [
        "entry",
        "lookup",
        "outcome",
        "schemaVersion",
        "source",
        "sourceTraditionId",
        "unavailable",
      ]) &&
      value.sourceTraditionId === "fjale.fjalor-shqip.v0_1" &&
      value.source === null &&
      value.entry === null &&
      value.lookup === null &&
      isRecordV1(value.unavailable) &&
      value.unavailable.reasonCode === "REUSE_AUTHORITY_UNVERIFIED" &&
      value.unavailable.detail === "SOURCE_UNAVAILABLE" &&
      value.unavailable.accessPerformed === false;
    return valid
      ? { ok: true, packet: value as StrictBlindPerseusUnavailablePacketV1 }
      : { ok: false, packet: null, reasonCodes: ["FJALE_SOURCE_ACCESS_FORBIDDEN"] };
  }
  if (value.outcome !== "FOUND" && value.outcome !== "NOT_FOUND") {
    return { ok: false, packet: null, reasonCodes: ["PACKET_INVALID"] };
  }
  const sourceTraditionId = value.sourceTraditionId;
  if (
    sourceTraditionId !== "scaife.lewis-short.v0_1" &&
    sourceTraditionId !== "scaife.middle-liddell.v0_1"
  ) {
    return { ok: false, packet: null, reasonCodes: ["UNSUPPORTED_SOURCE_TRADITION"] };
  }
  if (!isRecordV1(value.source) || !sourceSnapshotMatchesDefinitionV1(value.source, sourceTraditionId)) {
    return { ok: false, packet: null, reasonCodes: ["SOURCE_METADATA_MISMATCH"] };
  }
  if (
    !hasExactKeysV1(value, [
      "entry",
      "lookup",
      "outcome",
      "schemaVersion",
      "source",
      "sourceTraditionId",
      "unavailable",
    ]) ||
    !hasExactKeysV1(value.source, [
      "accessDate",
      "attribution",
      "licenseDecisionReference",
      "licenseIdentifier",
      "rawByteLength",
      "rawSha256",
      "repository",
      "sourceAcquisitionState",
      "sourceHeader",
      "sourcePath",
      "sourceTraditionId",
      "sourceVersion",
      "upstreamCommitSha",
    ])
  ) {
    return { ok: false, packet: null, reasonCodes: ["PACKET_INVALID"] };
  }
  if (value.unavailable !== null || !isRecordV1(value.lookup)) {
    return { ok: false, packet: null, reasonCodes: ["PACKET_INVALID"] };
  }
  if (value.outcome === "NOT_FOUND") {
    if (value.entry !== null) {
      return { ok: false, packet: null, reasonCodes: ["ENTRY_FORBIDDEN_FOR_NOT_FOUND"] };
    }
    if (
      value.lookup.status !== "COMPLETED_OVER_VERIFIED_SNAPSHOT" ||
      value.lookup.coverage !== "COMPLETE_VERIFIED_SNAPSHOT"
    ) {
      return { ok: false, packet: null, reasonCodes: ["NOT_FOUND_LOOKUP_INCOMPLETE"] };
    }
    return { ok: true, packet: value as StrictBlindPerseusSourcePacketV1 };
  }
  if (!isRecordV1(value.entry)) {
    return { ok: false, packet: null, reasonCodes: ["ENTRY_REQUIRED_FOR_FOUND"] };
  }
  if (
    !hasExactKeysV1(value.entry, [
      "attestedSpelling",
      "entryId",
      "entryKey",
      "entryLocator",
      "extractedText",
      "senses",
      "sourceProcessingStatus",
      "sourceValidationStatus",
    ]) ||
    value.lookup.status !== "NOT_REQUIRED_FOR_FOUND" ||
    value.lookup.coverage !== "ENTRY_EXTRACTED" ||
    !exactSourceTextV1(value.entry.entryLocator) ||
    !exactSourceTextV1(value.entry.attestedSpelling) ||
    !exactSourceTextV1(value.entry.extractedText) ||
    value.entry.sourceProcessingStatus !== "EXTRACTED_REVIEW_REQUIRED" ||
    value.entry.sourceValidationStatus !== "TEI_WELL_FORMED_BOUNDED" ||
    !Array.isArray(value.entry.senses) ||
    (value.entry.entryId !== null && !exactSourceTextV1(value.entry.entryId)) ||
    (value.entry.entryKey !== null && !exactSourceTextV1(value.entry.entryKey)) ||
    value.entry.senses.some(
      (sense) =>
        !isRecordV1(sense) ||
        !hasExactKeysV1(sense, ["senseId", "text"]) ||
        (sense.senseId !== null && !exactSourceTextV1(sense.senseId)) ||
        !exactSourceTextV1(sense.text),
    )
  ) {
    return { ok: false, packet: null, reasonCodes: ["PACKET_INVALID"] };
  }
  return { ok: true, packet: value as StrictBlindPerseusSourcePacketV1 };
}

export function validateStrictBlindPerseusFrozenCoverageV1(
  identities: readonly Readonly<{ sourceTraditionId: string; stage: string }>[],
): Readonly<{ ok: true; expectedCount: 15 } | { ok: false; reasonCode: string }> {
  const expected = STRICT_BLIND_FROZEN_SOURCE_TRADITIONS_V1.flatMap((sourceTraditionId) =>
    STRICT_BLIND_FROZEN_SEARCH_STAGES_V1.map((stage) => `${sourceTraditionId}\u0000${stage}`),
  );
  const actual = identities.map(({ sourceTraditionId, stage }) => `${sourceTraditionId}\u0000${stage}`);
  if (actual.length !== expected.length) return { ok: false, reasonCode: "COVERAGE_COUNT_MISMATCH" };
  if (new Set(actual).size !== actual.length) return { ok: false, reasonCode: "COVERAGE_DUPLICATE" };
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    return { ok: false, reasonCode: "COVERAGE_ORDER_OR_IDENTITY_MISMATCH" };
  }
  return { ok: true, expectedCount: 15 };
}

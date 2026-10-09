import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { open, readFile, realpath, stat, lstat } from "node:fs/promises";
import type { FileHandle } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";

import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
  ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
  projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1,
  type EnglishKaikkiSourceRecordAdapterResultV0_1,
  type EnglishKaikkiVerifiedSnapshotIdentityV0_1,
} from "./englishKaikkiSourceFamilyAdapter.v0_1";
import {
  artifactIdentitySha256V0_1,
  canonicalJsonLineV0_1,
  comparePostingsV0_1,
  compareUtf8BytesV0_1,
  createIdentityPayloadV0_1,
  normalizeIndexQueryV0_1,
  sha256BytesV0_1,
  type EnglishKaikkiDeterministicIndexDirectoryEntryV0_1,
  type EnglishKaikkiDeterministicIndexManifestV0_1,
  type EnglishKaikkiDeterministicIndexPostingV0_1,
} from "./englishKaikkiDeterministicIndex.v0_1";
import {
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
} from "./englishLexicalSenseSourceContract.v0_1";
import type { GenericFunctionalWitnessSourceRecordV1 } from "./genericFunctionalWitnessDiscovery.v1";

export const ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1 =
  "open-instrument.english-kaikki-server-only-exact-index-provider.v0.1" as const;
export const OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT_ENV_V0_1 =
  "OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT" as const;
export const ENGLISH_KAIKKI_SOURCE_RELATIVE_PATH_V0_1 =
  "source-family/english-kaikki/2026-10-03/kaikki.org-dictionary-English.jsonl" as const;
export const ENGLISH_KAIKKI_INDEX_RELATIVE_PATH_V0_1 =
  "source-family/english-kaikki/2026-10-03/index/open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1" as const;

const DIRECTORY_FILE_NAME = "directory.ndjson";
const POSTINGS_FILE_NAME = "postings.ndjson";
const MANIFEST_FILE_NAME = "manifest.json";
const DIRECTORY_PROBE_BYTES = 64 * 1024;
const MAX_POSTING_RANGE_BYTES = 64 * 1024 * 1024;
const MAX_SOURCE_RECORD_BYTES = 64 * 1024 * 1024;
const EXPECTED_ADAPTER_CONTRACT_ID =
  "OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1";
const EXPECTED_ADAPTER_CONTRACT_SHA256 =
  "a359b0a8d6fe172b32937aed93690545adfc2403c40419209f358fc46d14ed02";
const EXPECTED_ADAPTER_IMPLEMENTATION_COMMIT =
  "4e37b56b9194983b836f85269033f916c6ae408d";
const EXPECTED_ADAPTER_IMPLEMENTATION_SHA256 =
  "2b8a41fd2c5cd8d7a11e8b157690d3e4b4dfd12ed44a1de48c5070347e11c28f";
const EXPECTED_INDEX_ARTIFACT_IDENTITY_SHA256 =
  "0bc436e346a903193a326534f4bfd643e7bc0721cffecd74df8912f706777ae9";
const EXPECTED_DIRECTORY_BYTES = 133992318;
const EXPECTED_DIRECTORY_SHA256 =
  "286f114d630d4dca83d6df4c79baf511dcdd145c11b13a446e42701782660fd2";
const EXPECTED_POSTINGS_BYTES = 750627474;
const EXPECTED_POSTINGS_SHA256 =
  "daa79101fe08115ac4bd7d58f26dd9e2786f9de6c9ea54f2d764ef180b837ff1";
const EXPECTED_RECORDS_PROCESSED = 1492836;
const EXPECTED_POSTINGS_WRITTEN = 1492836;
const EXPECTED_DISTINCT_LOOKUP_KEYS = 1355933;

type ProviderRecordAdapterV0_1 = (input: Readonly<{
  recordBytes: Uint8Array;
  recordOrdinal: number;
  verifiedSnapshot: EnglishKaikkiVerifiedSnapshotIdentityV0_1;
}>) => EnglishKaikkiSourceRecordAdapterResultV0_1;

export type EnglishKaikkiServerOnlyExactIndexProviderResultV0_1 = Readonly<
  | {
      status: "MATCHES_FOUND";
      queryForm: string;
      records: readonly GenericFunctionalWitnessSourceRecordV1[];
    }
  | {
      status: "LEXICAL_SENSE_SOURCE_NOT_FOUND" | "LEXICAL_SENSE_GLOSS_NOT_FOUND";
      queryForm: string;
      records: readonly [];
      matchingSourceRecordIds?: readonly string[];
    }
  | {
      status:
        | "INDEX_LOOKUP_INVALID_QUERY"
        | "PROVIDER_CONFIGURATION_FAILURE"
        | "INDEX_ARTIFACT_FAILURE"
        | "SOURCE_RECORD_RECOVERY_FAILURE"
        | "SOURCE_ADAPTER_FAILURE";
      reasonCode: string;
      queryForm: string | null;
      records: readonly [];
    }
>;

export type EnglishKaikkiServerOnlyExactIndexProviderLookupMetricsV0_1 = Readonly<{
  directoryBytesRead: number;
  postingsBytesRead: number;
  sourceBytesRead: number;
  sourceRecordsRecovered: number;
  adapterRecordsEmitted: number;
}>;

export type EnglishKaikkiServerOnlyExactIndexProviderV0_1 = Readonly<{
  providerId: typeof ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1;
  runtimeBoundary: "SERVER_ONLY";
  query: (
    query: unknown,
  ) => Promise<EnglishKaikkiServerOnlyExactIndexProviderResultV0_1>;
  queryWithMetrics: (
    query: unknown,
  ) => Promise<Readonly<{
    result: EnglishKaikkiServerOnlyExactIndexProviderResultV0_1;
    metrics: EnglishKaikkiServerOnlyExactIndexProviderLookupMetricsV0_1;
  }>>;
}>;

type ProviderStateV0_1 = Readonly<{
  sourcePath: string;
  directoryPath: string;
  postingsPath: string;
  manifest: EnglishKaikkiDeterministicIndexManifestV0_1;
  verifiedSnapshot: EnglishKaikkiVerifiedSnapshotIdentityV0_1;
  adaptRecord: ProviderRecordAdapterV0_1;
}>;

type LookupMetricsMutableV0_1 = {
  directoryBytesRead: number;
  postingsBytesRead: number;
  sourceBytesRead: number;
  sourceRecordsRecovered: number;
  adapterRecordsEmitted: number;
};

type DirectoryLineV0_1 = Readonly<{
  start: number;
  end: number;
  entry: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1;
}>;

function failureV0_1(
  status: Extract<
    EnglishKaikkiServerOnlyExactIndexProviderResultV0_1["status"],
    | "INDEX_LOOKUP_INVALID_QUERY"
    | "PROVIDER_CONFIGURATION_FAILURE"
    | "INDEX_ARTIFACT_FAILURE"
    | "SOURCE_RECORD_RECOVERY_FAILURE"
    | "SOURCE_ADAPTER_FAILURE"
  >,
  reasonCode: string,
  queryForm: string | null,
): EnglishKaikkiServerOnlyExactIndexProviderResultV0_1 {
  return Object.freeze({
    status,
    reasonCode,
    queryForm,
    records: Object.freeze([]) as readonly [],
  });
}

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactKeysV0_1(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const observed = Object.keys(value);
  return observed.length === keys.length && observed.every((key, index) => key === keys[index]);
}

function safeIntegerV0_1(value: unknown, minimum = 0): value is number {
  return Number.isSafeInteger(value) && (value as number) >= minimum;
}

function sha256V0_1(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function parseDirectoryLineV0_1(
  bytes: Uint8Array,
): EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString("utf8")) as unknown;
  } catch {
    throw new Error("INDEX_DIRECTORY_JSON_INVALID");
  }
  if (
    !isRecordV0_1(parsed) ||
    !exactKeysV0_1(parsed, [
      "lookupKey",
      "postingByteOffset",
      "postingByteLength",
      "postingCount",
    ]) ||
    typeof parsed.lookupKey !== "string" ||
    parsed.lookupKey.length === 0 ||
    !safeIntegerV0_1(parsed.postingByteOffset) ||
    !safeIntegerV0_1(parsed.postingByteLength, 1) ||
    !safeIntegerV0_1(parsed.postingCount, 1)
  ) {
    throw new Error("INDEX_DIRECTORY_SCHEMA_INVALID");
  }
  const entry = {
    lookupKey: parsed.lookupKey,
    postingByteOffset: parsed.postingByteOffset,
    postingByteLength: parsed.postingByteLength,
    postingCount: parsed.postingCount,
  } satisfies EnglishKaikkiDeterministicIndexDirectoryEntryV0_1;
  if (!canonicalJsonLineV0_1(entry).subarray(0, -1).equals(Buffer.from(bytes))) {
    throw new Error("INDEX_DIRECTORY_NON_CANONICAL");
  }
  return Object.freeze(entry);
}

function parsePostingLineV0_1(
  bytes: Uint8Array,
): EnglishKaikkiDeterministicIndexPostingV0_1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString("utf8")) as unknown;
  } catch {
    throw new Error("INDEX_POSTING_JSON_INVALID");
  }
  if (
    !isRecordV0_1(parsed) ||
    !exactKeysV0_1(parsed, [
      "lookupKey",
      "sourceRecordId",
      "entryLocator",
      "recordOrdinal",
      "recordByteOffset",
      "recordByteLength",
      "recordSha256",
    ]) ||
    typeof parsed.lookupKey !== "string" ||
    parsed.lookupKey.length === 0 ||
    typeof parsed.sourceRecordId !== "string" ||
    parsed.sourceRecordId.length === 0 ||
    typeof parsed.entryLocator !== "string" ||
    parsed.entryLocator.length === 0 ||
    !safeIntegerV0_1(parsed.recordOrdinal, 1) ||
    !safeIntegerV0_1(parsed.recordByteOffset) ||
    !safeIntegerV0_1(parsed.recordByteLength, 1) ||
    !sha256V0_1(parsed.recordSha256)
  ) {
    throw new Error("INDEX_POSTING_SCHEMA_INVALID");
  }
  const posting = {
    lookupKey: parsed.lookupKey,
    sourceRecordId: parsed.sourceRecordId,
    entryLocator: parsed.entryLocator,
    recordOrdinal: parsed.recordOrdinal,
    recordByteOffset: parsed.recordByteOffset,
    recordByteLength: parsed.recordByteLength,
    recordSha256: parsed.recordSha256,
  } satisfies EnglishKaikkiDeterministicIndexPostingV0_1;
  if (!canonicalJsonLineV0_1(posting).subarray(0, -1).equals(Buffer.from(bytes))) {
    throw new Error("INDEX_POSTING_NON_CANONICAL");
  }
  return Object.freeze(posting);
}

function isInsideV0_1(parent: string, child: string): boolean {
  const childRelative = relative(parent, child);
  return childRelative !== "" && !childRelative.startsWith("..") && !isAbsolute(childRelative);
}

async function boundedRealpathV0_1(root: string, path: string): Promise<string> {
  const link = await lstat(path);
  if (link.isSymbolicLink() || !link.isFile()) {
    throw new Error("PROVIDER_ARTIFACT_NOT_REGULAR_FILE");
  }
  const resolved = await realpath(path);
  if (!isInsideV0_1(root, resolved)) {
    throw new Error("PROVIDER_ARTIFACT_ESCAPES_ROOT");
  }
  return resolved;
}

async function hashFileV0_1(path: string): Promise<Readonly<{ bytes: number; sha256: string }>> {
  const hash = createHash("sha256");
  let bytes = 0;
  const stream = createReadStream(path, { highWaterMark: 8 * 1024 * 1024 });
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    hash.update(buffer);
  }
  return Object.freeze({ bytes, sha256: hash.digest("hex") });
}

function validManifestShapeV0_1(value: unknown): value is EnglishKaikkiDeterministicIndexManifestV0_1 {
  if (!isRecordV0_1(value)) return false;
  if (
    value.schemaVersion !== "open-instrument.english-kaikki-deterministic-index-manifest.v0.1" ||
    value.status !== "PUBLISHED_AND_VERIFIED" ||
    value.contractId !== "OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1" ||
    value.indexSchema !== "open-instrument.english-kaikki-deterministic-index.v0.1" ||
    value.indexId !== "open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1" ||
    value.buildProcedureId !== "open-instrument.english-kaikki-deterministic-index-build.v0.1" ||
    !isRecordV0_1(value.sourceSnapshot) ||
    !isRecordV0_1(value.adapter) ||
    !Array.isArray(value.files) ||
    value.files.length !== 2 ||
    !isRecordV0_1(value.artifactIdentity) ||
    !isRecordV0_1(value.counts) ||
    !isRecordV0_1(value.publication)
  ) {
    return false;
  }
  const source = value.sourceSnapshot;
  const adapter = value.adapter;
  const files = value.files;
  const identity = value.artifactIdentity;
  const counts = value.counts;
  const publication = value.publication;
  return (
    source.sourceFamilyId === ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1 &&
    source.snapshotId === ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1 &&
    safeIntegerV0_1(source.expectedBytes, 1) &&
    sha256V0_1(source.expectedSha256) &&
    adapter.contractId === EXPECTED_ADAPTER_CONTRACT_ID &&
    adapter.contractSha256 === EXPECTED_ADAPTER_CONTRACT_SHA256 &&
    typeof adapter.implementationCommit === "string" &&
    /^[0-9a-f]{40}$/u.test(adapter.implementationCommit) &&
    adapter.implementationSha256 === EXPECTED_ADAPTER_IMPLEMENTATION_SHA256 &&
    files[0]?.path === DIRECTORY_FILE_NAME &&
    files[1]?.path === POSTINGS_FILE_NAME &&
    safeIntegerV0_1(files[0]?.bytes, 1) &&
    sha256V0_1(files[0]?.sha256) &&
    safeIntegerV0_1(files[1]?.bytes, 1) &&
    sha256V0_1(files[1]?.sha256) &&
    identity.algorithm === "SHA-256" &&
    identity.payload === "CANONICAL_JSON_IDENTITY_PAYLOAD_V0_1" &&
    sha256V0_1(identity.sha256) &&
    identity.manifestSelfHashExcluded === true &&
    safeIntegerV0_1(counts.recordsProcessed, 1) &&
    safeIntegerV0_1(counts.postingsWritten, 1) &&
    safeIntegerV0_1(counts.distinctLookupKeys, 1) &&
    publication.atomic === true &&
    publication.sourceImported === false &&
    publication.runtimeRegistered === false &&
    typeof publication.externalRelativePath === "string" &&
    publication.externalRelativePath.length > 0 &&
    !isAbsolute(publication.externalRelativePath)
  );
}

async function loadProviderStateV0_1(input: Readonly<{
  externalRoot: string;
  sourcePath: string;
  indexPath: string;
  adaptRecord: ProviderRecordAdapterV0_1;
  productionIdentity: boolean;
}>): Promise<ProviderStateV0_1> {
  const externalRoot = await realpath(input.externalRoot);
  const repositoryRoot = await realpath(resolve(process.cwd()));
  if (input.productionIdentity && (externalRoot === repositoryRoot || isInsideV0_1(repositoryRoot, externalRoot) || isInsideV0_1(externalRoot, repositoryRoot))) {
    throw new Error("EXTERNAL_ROOT_NOT_OUTSIDE_GIT");
  }
  const sourcePath = await boundedRealpathV0_1(externalRoot, input.sourcePath);
  const directoryPath = await boundedRealpathV0_1(externalRoot, join(input.indexPath, DIRECTORY_FILE_NAME));
  const postingsPath = await boundedRealpathV0_1(externalRoot, join(input.indexPath, POSTINGS_FILE_NAME));
  const manifestPath = await boundedRealpathV0_1(externalRoot, join(input.indexPath, MANIFEST_FILE_NAME));
  const manifestBytes = await readFile(manifestPath);
  let parsedManifest: unknown;
  try {
    parsedManifest = JSON.parse(manifestBytes.toString("utf8")) as unknown;
  } catch {
    throw new Error("PROVIDER_MANIFEST_JSON_INVALID");
  }
  if (!validManifestShapeV0_1(parsedManifest)) {
    throw new Error("PROVIDER_MANIFEST_SCHEMA_INVALID");
  }
  const manifest = parsedManifest;
  const fileBindings = [manifest.files[0], manifest.files[1]] as const;
  const identityPayload = createIdentityPayloadV0_1({
    sourceSnapshot: manifest.sourceSnapshot,
    adapter: manifest.adapter,
    files: fileBindings,
  });
  if (artifactIdentitySha256V0_1(identityPayload) !== manifest.artifactIdentity.sha256) {
    throw new Error("PROVIDER_ARTIFACT_IDENTITY_MISMATCH");
  }
  if (
    input.productionIdentity &&
    (manifest.sourceSnapshot.expectedBytes !== ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1 ||
      manifest.sourceSnapshot.expectedSha256 !== ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1 ||
      manifest.adapter.implementationCommit !== EXPECTED_ADAPTER_IMPLEMENTATION_COMMIT ||
      manifest.publication.externalRelativePath !== ENGLISH_KAIKKI_INDEX_RELATIVE_PATH_V0_1 ||
      manifest.artifactIdentity.sha256 !== EXPECTED_INDEX_ARTIFACT_IDENTITY_SHA256 ||
      manifest.files[0].bytes !== EXPECTED_DIRECTORY_BYTES ||
      manifest.files[0].sha256 !== EXPECTED_DIRECTORY_SHA256 ||
      manifest.files[1].bytes !== EXPECTED_POSTINGS_BYTES ||
      manifest.files[1].sha256 !== EXPECTED_POSTINGS_SHA256 ||
      manifest.counts.recordsProcessed !== EXPECTED_RECORDS_PROCESSED ||
      manifest.counts.postingsWritten !== EXPECTED_POSTINGS_WRITTEN ||
      manifest.counts.distinctLookupKeys !== EXPECTED_DISTINCT_LOOKUP_KEYS)
  ) {
    throw new Error("PROVIDER_FROZEN_IDENTITY_MISMATCH");
  }
  const [sourceStat, directoryStat, postingsStat] = await Promise.all([
    stat(sourcePath),
    stat(directoryPath),
    stat(postingsPath),
  ]);
  if (
    sourceStat.size !== manifest.sourceSnapshot.expectedBytes ||
    directoryStat.size !== manifest.files[0].bytes ||
    postingsStat.size !== manifest.files[1].bytes
  ) {
    throw new Error("PROVIDER_ARTIFACT_BYTE_LENGTH_MISMATCH");
  }
  const [sourceDigest, directoryDigest, postingsDigest] = await Promise.all([
    hashFileV0_1(sourcePath),
    hashFileV0_1(directoryPath),
    hashFileV0_1(postingsPath),
  ]);
  if (
    sourceDigest.bytes !== manifest.sourceSnapshot.expectedBytes ||
    sourceDigest.sha256 !== manifest.sourceSnapshot.expectedSha256 ||
    directoryDigest.bytes !== manifest.files[0].bytes ||
    directoryDigest.sha256 !== manifest.files[0].sha256 ||
    postingsDigest.bytes !== manifest.files[1].bytes ||
    postingsDigest.sha256 !== manifest.files[1].sha256
  ) {
    throw new Error("PROVIDER_ARTIFACT_BYTES_HASH_MISMATCH");
  }
  return Object.freeze({
    sourcePath,
    directoryPath,
    postingsPath,
    manifest,
    verifiedSnapshot: Object.freeze({
      byteLength: manifest.sourceSnapshot.expectedBytes,
      sha256: manifest.sourceSnapshot.expectedSha256,
    }),
    adaptRecord: input.adaptRecord,
  });
}

async function readExactRangeV0_1(
  handle: FileHandle,
  offset: number,
  length: number,
  metrics: LookupMetricsMutableV0_1,
  metric: keyof LookupMetricsMutableV0_1,
): Promise<Buffer> {
  const bytes = Buffer.alloc(length);
  let readBytes = 0;
  while (readBytes < length) {
    const result = await handle.read(bytes, readBytes, length - readBytes, offset + readBytes);
    if (result.bytesRead === 0) break;
    readBytes += result.bytesRead;
    metrics[metric] += result.bytesRead;
  }
  if (readBytes !== length) throw new Error("PROVIDER_SHORT_RANGE_READ");
  return bytes;
}

async function readDirectoryLineAtOrAfterV0_1(
  handle: FileHandle,
  fileSize: number,
  offset: number,
  metrics: LookupMetricsMutableV0_1,
): Promise<DirectoryLineV0_1 | null> {
  if (offset >= fileSize) return null;
  const readStart = Math.max(0, offset - DIRECTORY_PROBE_BYTES);
  const readLength = Math.min(DIRECTORY_PROBE_BYTES * 2, fileSize - readStart);
  const window = await readExactRangeV0_1(handle, readStart, readLength, metrics, "directoryBytesRead");
  const relativeOffset = offset - readStart;
  const previousLineFeed = window.lastIndexOf(0x0a, relativeOffset - 1);
  if (previousLineFeed < 0 && readStart > 0) throw new Error("INDEX_DIRECTORY_LINE_TOO_LONG");
  const candidateStart = previousLineFeed < 0 ? 0 : readStart + previousLineFeed + 1;
  const candidateRelativeStart = candidateStart - readStart;
  const candidateLineFeed = window.indexOf(0x0a, candidateRelativeStart);
  if (candidateLineFeed < 0) throw new Error("INDEX_DIRECTORY_LINE_TOO_LONG");
  const lineBytes = window.subarray(candidateRelativeStart, candidateLineFeed);
  return Object.freeze({
    start: candidateStart,
    end: readStart + candidateLineFeed + 1,
    entry: parseDirectoryLineV0_1(lineBytes),
  });
}

async function readPreviousDirectoryLineV0_1(
  handle: FileHandle,
  lineStart: number,
  metrics: LookupMetricsMutableV0_1,
): Promise<DirectoryLineV0_1 | null> {
  if (lineStart === 0) return null;
  const readStart = Math.max(0, lineStart - DIRECTORY_PROBE_BYTES);
  const window = await readExactRangeV0_1(handle, readStart, lineStart - readStart, metrics, "directoryBytesRead");
  if (window[window.length - 1] !== 0x0a) throw new Error("INDEX_DIRECTORY_BOUNDARY_INVALID");
  const previousLineFeed = window.lastIndexOf(0x0a, window.length - 2);
  if (previousLineFeed < 0 && readStart > 0) throw new Error("INDEX_DIRECTORY_LINE_TOO_LONG");
  const start = previousLineFeed < 0 ? readStart : readStart + previousLineFeed + 1;
  const lineBytes = window.subarray(start - readStart, window.length - 1);
  return Object.freeze({
    start,
    end: lineStart,
    entry: parseDirectoryLineV0_1(lineBytes),
  });
}

async function findDirectoryEntryV0_1(
  handle: FileHandle,
  fileSize: number,
  lookupKey: string,
  metrics: LookupMetricsMutableV0_1,
): Promise<EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | null> {
  let low = 0;
  let high = fileSize;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = await readDirectoryLineAtOrAfterV0_1(handle, fileSize, middle, metrics);
    if (candidate === null) {
      high = middle;
      continue;
    }
    const comparison = compareUtf8BytesV0_1(candidate.entry.lookupKey, lookupKey);
    if (comparison < 0) {
      low = candidate.end;
    } else if (comparison > 0) {
      high = candidate.start;
    } else {
      const previous = await readPreviousDirectoryLineV0_1(handle, candidate.start, metrics);
      const next = await readDirectoryLineAtOrAfterV0_1(handle, fileSize, candidate.end, metrics);
      if (previous?.entry.lookupKey === lookupKey || next?.entry.lookupKey === lookupKey) {
        throw new Error("INDEX_DIRECTORY_MULTIPLE_ENTRIES");
      }
      return candidate.entry;
    }
    if (low > high) throw new Error("INDEX_DIRECTORY_ORDER_INVALID");
  }
  return null;
}

function parsePostingRangeV0_1(
  bytes: Buffer,
  entry: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1,
  postingsFileSize: number,
): readonly EnglishKaikkiDeterministicIndexPostingV0_1[] {
  if (
    entry.postingByteOffset + entry.postingByteLength > postingsFileSize ||
    entry.postingByteOffset + entry.postingByteLength < entry.postingByteOffset
  ) {
    throw new Error("INDEX_POSTING_RANGE_OUT_OF_BOUNDS");
  }
  if (bytes.length === 0 || bytes[bytes.length - 1] !== 0x0a) {
    throw new Error("INDEX_POSTING_RANGE_MISSING_FINAL_LF");
  }
  const postings: EnglishKaikkiDeterministicIndexPostingV0_1[] = [];
  let start = 0;
  let previous: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  while (start < bytes.length) {
    const lineFeed = bytes.indexOf(0x0a, start);
    if (lineFeed < 0) throw new Error("INDEX_POSTING_RANGE_TRUNCATED");
    if (lineFeed === start) throw new Error("INDEX_POSTING_EMPTY_LINE");
    const posting = parsePostingLineV0_1(bytes.subarray(start, lineFeed));
    if (posting.lookupKey !== entry.lookupKey) throw new Error("INDEX_POSTING_LOOKUP_KEY_MISMATCH");
    if (previous !== undefined) {
      if (comparePostingsV0_1(previous, posting) >= 0) {
        throw new Error("INDEX_POSTING_ORDER_INVALID");
      }
    }
    postings.push(posting);
    previous = posting;
    start = lineFeed + 1;
  }
  if (postings.length !== entry.postingCount) throw new Error("INDEX_POSTING_COUNT_MISMATCH");
  return Object.freeze(postings);
}

async function performLookupV0_1(
  state: ProviderStateV0_1 | null,
  initializationFailure: boolean,
  query: unknown,
): Promise<Readonly<{
  result: EnglishKaikkiServerOnlyExactIndexProviderResultV0_1;
  metrics: EnglishKaikkiServerOnlyExactIndexProviderLookupMetricsV0_1;
}>> {
  const metrics: LookupMetricsMutableV0_1 = {
    directoryBytesRead: 0,
    postingsBytesRead: 0,
    sourceBytesRead: 0,
    sourceRecordsRecovered: 0,
    adapterRecordsEmitted: 0,
  };
  if (typeof query !== "string" || query.length === 0) {
    return Object.freeze({
      result: failureV0_1("INDEX_LOOKUP_INVALID_QUERY", "INDEX_LOOKUP_INVALID_QUERY", null),
      metrics: Object.freeze(metrics),
    });
  }
  const queryForm = normalizeIndexQueryV0_1(query);
  if (queryForm.length === 0) {
    return Object.freeze({
      result: failureV0_1("INDEX_LOOKUP_INVALID_QUERY", "INDEX_LOOKUP_INVALID_QUERY", null),
      metrics: Object.freeze(metrics),
    });
  }
  if (initializationFailure || state === null) {
    return Object.freeze({
      result: failureV0_1("PROVIDER_CONFIGURATION_FAILURE", "PROVIDER_CONFIGURATION_FAILURE", queryForm),
      metrics: Object.freeze(metrics),
    });
  }

  let directoryHandle: FileHandle | undefined;
  let postingsHandle: FileHandle | undefined;
  let sourceHandle: FileHandle | undefined;
  try {
    directoryHandle = await open(state.directoryPath, "r");
    const directorySize = state.manifest.files[0].bytes;
    const directoryEntry = await findDirectoryEntryV0_1(directoryHandle, directorySize, queryForm, metrics);
    if (directoryEntry === null) {
      return Object.freeze({
        result: Object.freeze({
          status: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
          queryForm,
          records: Object.freeze([]) as readonly [],
        }),
        metrics: Object.freeze(metrics),
      });
    }

    if (directoryEntry.postingByteLength > MAX_POSTING_RANGE_BYTES) {
      return Object.freeze({
        result: failureV0_1("INDEX_ARTIFACT_FAILURE", "INDEX_POSTING_RANGE_TOO_LARGE", queryForm),
        metrics: Object.freeze(metrics),
      });
    }
    postingsHandle = await open(state.postingsPath, "r");
    const postingsBytes = await readExactRangeV0_1(
      postingsHandle,
      directoryEntry.postingByteOffset,
      directoryEntry.postingByteLength,
      metrics,
      "postingsBytesRead",
    );
    const postings = parsePostingRangeV0_1(
      postingsBytes,
      directoryEntry,
      state.manifest.files[1].bytes,
    );
    sourceHandle = await open(state.sourcePath, "r");
    const sourceRecords = [];
    for (const posting of postings) {
      if (
        posting.recordByteOffset + posting.recordByteLength < posting.recordByteOffset ||
        posting.recordByteOffset + posting.recordByteLength > state.manifest.sourceSnapshot.expectedBytes
      ) {
        return Object.freeze({
          result: failureV0_1("SOURCE_RECORD_RECOVERY_FAILURE", "SOURCE_RECORD_RANGE_OUT_OF_BOUNDS", queryForm),
          metrics: Object.freeze(metrics),
        });
      }
      if (posting.recordByteLength > MAX_SOURCE_RECORD_BYTES) {
        return Object.freeze({
          result: failureV0_1("SOURCE_RECORD_RECOVERY_FAILURE", "SOURCE_RECORD_RANGE_TOO_LARGE", queryForm),
          metrics: Object.freeze(metrics),
        });
      }
      const recordBytes = await readExactRangeV0_1(
        sourceHandle,
        posting.recordByteOffset,
        posting.recordByteLength,
        metrics,
        "sourceBytesRead",
      );
      if (sha256BytesV0_1(recordBytes) !== posting.recordSha256) {
        return Object.freeze({
          result: failureV0_1("SOURCE_RECORD_RECOVERY_FAILURE", "SOURCE_RECORD_HASH_MISMATCH", queryForm),
          metrics: Object.freeze(metrics),
        });
      }
      const adapted = state.adaptRecord({
        recordBytes,
        recordOrdinal: posting.recordOrdinal,
        verifiedSnapshot: state.verifiedSnapshot,
      });
      if (!adapted.ok) {
        return Object.freeze({
          result: failureV0_1("SOURCE_ADAPTER_FAILURE", adapted.reasonCode, queryForm),
          metrics: Object.freeze(metrics),
        });
      }
      if (
        adapted.record.queryForm !== posting.lookupKey ||
        adapted.record.sourceRecordId !== posting.sourceRecordId ||
        adapted.record.entryLocator !== posting.entryLocator
      ) {
        return Object.freeze({
          result: failureV0_1("INDEX_ARTIFACT_FAILURE", "INDEX_POSTING_RECOVERY_BINDING_MISMATCH", queryForm),
          metrics: Object.freeze(metrics),
        });
      }
      sourceRecords.push(adapted.record);
      metrics.sourceRecordsRecovered += 1;
    }
    const records = sourceRecords.flatMap(projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1);
    metrics.adapterRecordsEmitted = records.length;
    if (records.length === 0) {
      return Object.freeze({
        result: Object.freeze({
          status: "LEXICAL_SENSE_GLOSS_NOT_FOUND",
          queryForm,
          records: Object.freeze([]) as readonly [],
          matchingSourceRecordIds: Object.freeze(sourceRecords.map((record) => record.sourceRecordId)),
        }),
        metrics: Object.freeze(metrics),
      });
    }
    return Object.freeze({
      result: Object.freeze({
        status: "MATCHES_FOUND",
        queryForm,
        records: Object.freeze(records),
      }),
      metrics: Object.freeze(metrics),
    });
  } catch (error) {
    const reasonCode = error instanceof Error && /^[A-Z0-9_]+$/u.test(error.message)
      ? error.message
      : "PROVIDER_IO_FAILURE";
    const status = reasonCode.startsWith("SOURCE_")
      ? "SOURCE_RECORD_RECOVERY_FAILURE"
      : "INDEX_ARTIFACT_FAILURE";
    return Object.freeze({
      result: failureV0_1(status, reasonCode, queryForm),
      metrics: Object.freeze(metrics),
    });
  } finally {
    await Promise.all([
      directoryHandle?.close(),
      postingsHandle?.close(),
      sourceHandle?.close(),
    ]);
  }
}

async function createProviderV0_1(input: Readonly<{
  externalRoot: string;
  sourcePath: string;
  indexPath: string;
  adaptRecord: ProviderRecordAdapterV0_1;
  productionIdentity: boolean;
}>): Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> {
  let state: ProviderStateV0_1 | null = null;
  let initializationFailure = false;
  try {
    state = await loadProviderStateV0_1(input);
  } catch {
    initializationFailure = true;
  }
  return Object.freeze({
    providerId: ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
    runtimeBoundary: "SERVER_ONLY" as const,
    query: (query: unknown) => performLookupV0_1(state, initializationFailure, query).then((value) => value.result),
    queryWithMetrics: (query: unknown) => performLookupV0_1(state, initializationFailure, query),
  });
}

/**
 * Creates the production provider. It is intentionally not imported by any
 * client or generic Discovery module in this lane. Missing or mismatched
 * external artifacts produce a fail-closed provider result.
 */
export async function createEnglishKaikkiServerOnlyExactIndexProviderV0_1(): Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> {
  const externalRoot = process.env[OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT_ENV_V0_1];
  if (externalRoot === undefined || externalRoot.length === 0) {
    return createProviderV0_1({
      externalRoot: process.cwd(),
      sourcePath: process.cwd(),
      indexPath: process.cwd(),
      adaptRecord: adaptEnglishKaikkiJsonlRecordV0_1,
      productionIdentity: true,
    });
  }
  const canonicalRoot = await realpath(externalRoot).catch(() => externalRoot);
  return createProviderV0_1({
    externalRoot: canonicalRoot,
    sourcePath: join(canonicalRoot, ENGLISH_KAIKKI_SOURCE_RELATIVE_PATH_V0_1),
    indexPath: join(canonicalRoot, ENGLISH_KAIKKI_INDEX_RELATIVE_PATH_V0_1),
    adaptRecord: adaptEnglishKaikkiJsonlRecordV0_1,
    productionIdentity: true,
  });
}

/**
 * Explicit test-only seam for committed synthetic records. Production code
 * must use createEnglishKaikkiServerOnlyExactIndexProviderV0_1 instead.
 */
export async function createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1(
  input: Readonly<{
    fixtureRoot: string;
    sourcePath: string;
    indexPath: string;
    adaptRecord: ProviderRecordAdapterV0_1;
  }>,
): Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> {
  return createProviderV0_1({
    externalRoot: input.fixtureRoot,
    sourcePath: input.sourcePath,
    indexPath: input.indexPath,
    adaptRecord: input.adaptRecord,
    productionIdentity: false,
  });
}

export type { ProviderRecordAdapterV0_1 };

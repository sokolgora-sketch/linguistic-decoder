import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, mkdtemp, open, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "../src/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  artifactIdentitySha256V0_1,
  canonicalJsonLineV0_1,
  canonicalJsonV0_1,
  comparePostingsV0_1,
  createDirectoryEntryV0_1,
  createIdentityPayloadV0_1,
  createPostingV0_1,
  recoverPostingRecordV0_1,
  type EnglishKaikkiDeterministicIndexDirectoryEntryV0_1,
  type EnglishKaikkiDeterministicIndexManifestV0_1,
  type EnglishKaikkiDeterministicIndexPostingV0_1,
} from "../src/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1";
import {
  iteratePhysicalRecordsV0_1,
  readCanonicalNdjsonLinesV0_1,
} from "./openInstrumentEnglishKaikkiDeterministicIndexBuild.v0_1";

const EXTERNAL_ROOT_ENV = "OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT";
const SOURCE_RELATIVE_PATH =
  "source-family/english-kaikki/2026-10-03/kaikki.org-dictionary-English.jsonl";
const INDEX_RELATIVE_PATH =
  "source-family/english-kaikki/2026-10-03/index/open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1";
const EXPECTED_SOURCE_BYTES = 3335546346;
const EXPECTED_SOURCE_SHA256 =
  "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195";
const EXPECTED_RECORDS = 1492836;
const EXPECTED_EXISTING_POSTINGS = 1486239;
const EXPECTED_RECOVERED_POSTINGS = 6597;
const EXPECTED_MISSING_ORDINALS_SHA256 =
  "5c8c1c5e1624068888f3e7bb5c7988264ff3cb03d36a40427639f0178176f30b";
const EXPECTED_BEFORE_DIRECTORY = Object.freeze({
  bytes: 133425417,
  sha256: "2455eaf2ef9cb625d0744986e6ea65103796cd0465ef1e8d52cadd22427cfd5a",
});
const EXPECTED_BEFORE_POSTINGS = Object.freeze({
  bytes: 747334531,
  sha256: "1c9e35493e1e76d9189cef3a9bffb091194f541c4be4414f9c07971aff2f680a",
});
const EXPECTED_BEFORE_MANIFEST_SHA256 =
  "b04888d390e81626dc85d8931116f115a5552bafc4505c5d7521ee4b6411c967";
const EXPECTED_BEFORE_IDENTITY =
  "e963008034b37a2dbe379cc16c2b037674544f17f0062934ece067425e1f9543";
const OUTPUT_BUFFER_BYTES = 1024 * 1024;

type ExternalPaths = Readonly<{
  root: string;
  sourcePath: string;
  indexPath: string;
  directoryPath: string;
  postingsPath: string;
  manifestPath: string;
}>;

type Digest = Readonly<{ bytes: number; sha256: string }>;

type PhysicalProof = Readonly<{
  countA: number;
  countB: number;
  countC: number;
  uniqueRecordOrdinals: number;
  duplicateRecordOrdinals: number;
  missingRecordOrdinals: number;
  minRecordOrdinal: number;
  maxRecordOrdinal: number;
  directoryEntryCount: number;
  directoryPostingCountSum: number;
  rangesContiguous: boolean;
  finalRangeEqualsPostingsEof: boolean;
  canonicalOrder: boolean;
  finalLf: boolean;
}>;

type PostingIterator = AsyncIterator<EnglishKaikkiDeterministicIndexPostingV0_1>;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isOutsideRepository(repositoryRoot: string, candidate: string): boolean {
  const path = relative(repositoryRoot, candidate);
  return path === ".." || path.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`);
}

async function digestFile(path: string): Promise<Digest> {
  const hash = createHash("sha256");
  let bytes = 0;
  for await (const chunk of createReadStream(path, { highWaterMark: 8 * 1024 * 1024 })) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += value.length;
    hash.update(value);
  }
  return Object.freeze({ bytes, sha256: hash.digest("hex") });
}

async function countLf(path: string): Promise<Readonly<{ count: number; finalLf: boolean }>> {
  let count = 0;
  let lastByte = -1;
  for await (const chunk of createReadStream(path, { highWaterMark: 8 * 1024 * 1024 })) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    for (const byte of bytes) if (byte === 0x0a) count += 1;
    if (bytes.length > 0) lastByte = bytes[bytes.length - 1];
  }
  return Object.freeze({ count, finalLf: lastByte === 0x0a });
}

export function serializeMissingOrdinalsSha256V0_1(
  ordinals: readonly number[],
): string {
  const hash = createHash("sha256");
  for (const ordinal of ordinals) hash.update(`${ordinal}\n`);
  return hash.digest("hex");
}

export function assertPhysicalCompletenessV0_1(input: Readonly<{
  countA: number;
  countB: number;
  countC: number;
  manifestPostingsWritten: number;
}>): void {
  assert(input.countA === EXPECTED_RECORDS, `PHYSICAL_COUNT_A_MISMATCH:${input.countA}`);
  assert(input.countB === EXPECTED_RECORDS, `PHYSICAL_COUNT_B_MISMATCH:${input.countB}`);
  assert(input.countC === EXPECTED_RECORDS, `PHYSICAL_COUNT_C_MISMATCH:${input.countC}`);
  assert(input.manifestPostingsWritten === EXPECTED_RECORDS, "MANIFEST_POSTING_COUNT_MISMATCH");
  assert(input.countA === input.countB && input.countB === input.countC, "PHYSICAL_COUNTS_DISAGREE");
}

class NdjsonWriterV0_1 {
  private readonly handlePromise: ReturnType<typeof open>;
  private buffers: Buffer[] = [];
  private bufferedBytes = 0;
  byteLength = 0;

  constructor(private readonly path: string) {
    this.handlePromise = open(path, "wx");
  }

  async write(bytes: Buffer): Promise<void> {
    this.buffers.push(bytes);
    this.bufferedBytes += bytes.length;
    this.byteLength += bytes.length;
    if (this.bufferedBytes >= OUTPUT_BUFFER_BYTES) await this.flush();
  }

  async flush(): Promise<void> {
    if (this.bufferedBytes === 0) return;
    const handle = await this.handlePromise;
    await handle.write(Buffer.concat(this.buffers, this.bufferedBytes));
    this.buffers = [];
    this.bufferedBytes = 0;
  }

  async close(): Promise<void> {
    await this.flush();
    const handle = await this.handlePromise;
    await handle.close();
  }
}

async function resolvePaths(): Promise<ExternalPaths> {
  const configuredRoot = process.env[EXTERNAL_ROOT_ENV];
  assert(configuredRoot, `MISSING_ENV:${EXTERNAL_ROOT_ENV}`);
  const root = await realpath(configuredRoot);
  const repositoryRoot = await realpath(resolve(process.cwd()));
  assert(isOutsideRepository(repositoryRoot, root), "EXTERNAL_ROOT_NOT_OUTSIDE_GIT");
  const sourcePath = join(root, SOURCE_RELATIVE_PATH);
  const indexPath = join(root, INDEX_RELATIVE_PATH);
  await access(sourcePath);
  await access(indexPath);
  return Object.freeze({
    root,
    sourcePath,
    indexPath,
    directoryPath: join(indexPath, "directory.ndjson"),
    postingsPath: join(indexPath, "postings.ndjson"),
    manifestPath: join(indexPath, "manifest.json"),
  });
}

async function* postingIterator(path: string): AsyncGenerator<EnglishKaikkiDeterministicIndexPostingV0_1> {
  for await (const line of readCanonicalNdjsonLinesV0_1(path)) {
    yield JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
  }
}

async function readNext(
  iterator: PostingIterator,
): Promise<EnglishKaikkiDeterministicIndexPostingV0_1 | undefined> {
  const next = await iterator.next();
  return next.done ? undefined : next.value;
}

async function verifyPreRepairArtifact(paths: ExternalPaths): Promise<Readonly<{
  manifest: EnglishKaikkiDeterministicIndexManifestV0_1;
  present: Uint8Array;
  missingOrdinals: number[];
}>> {
  const [source, directory, postings, manifestBytes] = await Promise.all([
    digestFile(paths.sourcePath),
    digestFile(paths.directoryPath),
    digestFile(paths.postingsPath),
    readFile(paths.manifestPath),
  ]);
  assert(source.bytes === EXPECTED_SOURCE_BYTES && source.sha256 === EXPECTED_SOURCE_SHA256, "SOURCE_IDENTITY_MISMATCH");
  assert(directory.bytes === EXPECTED_BEFORE_DIRECTORY.bytes && directory.sha256 === EXPECTED_BEFORE_DIRECTORY.sha256, "DIRECTORY_BASELINE_MISMATCH");
  assert(postings.bytes === EXPECTED_BEFORE_POSTINGS.bytes && postings.sha256 === EXPECTED_BEFORE_POSTINGS.sha256, "POSTINGS_BASELINE_MISMATCH");
  const manifestSha256 = createHash("sha256").update(manifestBytes).digest("hex");
  assert(manifestSha256 === EXPECTED_BEFORE_MANIFEST_SHA256, "MANIFEST_BASELINE_MISMATCH");
  const manifest = JSON.parse(manifestBytes.toString("utf8")) as EnglishKaikkiDeterministicIndexManifestV0_1;
  assert(manifest.artifactIdentity.sha256 === EXPECTED_BEFORE_IDENTITY, "ARTIFACT_IDENTITY_BASELINE_MISMATCH");
  assert(manifest.sourceSnapshot.expectedBytes === EXPECTED_SOURCE_BYTES, "MANIFEST_SOURCE_BYTES_MISMATCH");
  assert(manifest.sourceSnapshot.expectedSha256 === EXPECTED_SOURCE_SHA256, "MANIFEST_SOURCE_SHA_MISMATCH");

  const present = new Uint8Array(EXPECTED_RECORDS + 1);
  let postingCount = 0;
  let previous: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  for await (const line of readCanonicalNdjsonLinesV0_1(paths.postingsPath)) {
    const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
    assert(canonicalJsonV0_1(posting) === line, "PRE_REPAIR_POSTING_NOT_CANONICAL");
    if (previous !== undefined) assert(comparePostingsV0_1(previous, posting) <= 0, "PRE_REPAIR_POSTING_ORDER_INVALID");
    previous = posting;
    assert(Number.isSafeInteger(posting.recordOrdinal) && posting.recordOrdinal >= 1 && posting.recordOrdinal <= EXPECTED_RECORDS, "PRE_REPAIR_ORDINAL_OUT_OF_RANGE");
    assert(present[posting.recordOrdinal] === 0, "PRE_REPAIR_ORDINAL_DUPLICATE");
    present[posting.recordOrdinal] = 1;
    postingCount += 1;
  }
  assert(postingCount === EXPECTED_EXISTING_POSTINGS, `PRE_REPAIR_POSTING_COUNT:${postingCount}`);

  const missingOrdinals: number[] = [];
  for (let ordinal = 1; ordinal <= EXPECTED_RECORDS; ordinal += 1) {
    if (present[ordinal] === 0) missingOrdinals.push(ordinal);
  }
  assert(missingOrdinals.length === EXPECTED_RECOVERED_POSTINGS, "MISSING_ORDINAL_COUNT_MISMATCH");
  assert(serializeMissingOrdinalsSha256V0_1(missingOrdinals) === EXPECTED_MISSING_ORDINALS_SHA256, "MISSING_ORDINAL_SET_MISMATCH");
  return Object.freeze({ manifest, present, missingOrdinals });
}

async function recoverMissingPostings(
  paths: ExternalPaths,
  present: Uint8Array,
  missingOrdinals: readonly number[],
): Promise<Readonly<{
  sourceBytes: number;
  sourceSha256: string;
  sourceRecordCount: number;
  recovered: EnglishKaikkiDeterministicIndexPostingV0_1[];
}>> {
  const missing = new Set(missingOrdinals);
  const recovered: EnglishKaikkiDeterministicIndexPostingV0_1[] = [];
  const sourceHash = createHash("sha256");
  let sourceBytes = 0;
  let sourceRecordCount = 0;
  let adapterRejected = 0;
  for await (const physical of iteratePhysicalRecordsV0_1(paths.sourcePath)) {
    sourceRecordCount += 1;
    sourceBytes += physical.recordBytes.length;
    sourceHash.update(physical.recordBytes);
    if (!missing.has(physical.recordOrdinal)) continue;
    const adapted = adaptEnglishKaikkiJsonlRecordV0_1({
      recordBytes: physical.recordBytes,
      recordOrdinal: physical.recordOrdinal,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    });
    if (!adapted.ok) {
      adapterRejected += 1;
      continue;
    }
    recovered.push(createPostingV0_1({
      sourceRecord: adapted.record,
      recordByteOffset: physical.recordByteOffset,
      recordByteLength: physical.recordBytes.length,
    }));
  }
  const sourceSha256 = sourceHash.digest("hex");
  assert(sourceBytes === EXPECTED_SOURCE_BYTES && sourceSha256 === EXPECTED_SOURCE_SHA256, "SOURCE_IDENTITY_CHANGED_DURING_RECOVERY");
  assert(sourceRecordCount === EXPECTED_RECORDS, `SOURCE_RECORD_COUNT:${sourceRecordCount}`);
  assert(adapterRejected === 0, `RECOVERY_ADAPTER_REJECTED:${adapterRejected}`);
  assert(recovered.length === EXPECTED_RECOVERED_POSTINGS, `RECOVERED_POSTING_COUNT:${recovered.length}`);
  const recoveredOrdinals = recovered.map((posting) => posting.recordOrdinal).sort((left, right) => left - right);
  assert(serializeMissingOrdinalsSha256V0_1(recoveredOrdinals) === EXPECTED_MISSING_ORDINALS_SHA256, "RECOVERED_MISSING_ORDINAL_SET_MISMATCH");
  assert(recoveredOrdinals.every((ordinal, index) => ordinal === missingOrdinals[index]), "RECOVERED_ORDINAL_SEQUENCE_MISMATCH");
  assert(recovered.every((posting) => present[posting.recordOrdinal] === 0), "RECOVERED_ORDINAL_OVERLAP");
  recovered.sort(comparePostingsV0_1);
  return Object.freeze({ sourceBytes, sourceSha256, sourceRecordCount, recovered });
}

async function mergeCandidate(
  sourcePostingsPath: string,
  recovered: readonly EnglishKaikkiDeterministicIndexPostingV0_1[],
  candidatePath: string,
): Promise<Readonly<{ directoryCount: number; postingsCount: number }>> {
  const postingsPath = join(candidatePath, "postings.ndjson");
  const directoryPath = join(candidatePath, "directory.ndjson");
  const postingsWriter = new NdjsonWriterV0_1(postingsPath);
  const directoryWriter = new NdjsonWriterV0_1(directoryPath);
  const existingIterator = postingIterator(sourcePostingsPath);
  const recoveredIterator = (async function* (): AsyncGenerator<EnglishKaikkiDeterministicIndexPostingV0_1> {
    yield* recovered;
  })();
  let existing = await readNext(existingIterator);
  let recoveredPosting = await readNext(recoveredIterator);
  let previous: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  let postingsCount = 0;
  let currentKey: string | undefined;
  let currentGroupStart = 0;
  let currentGroupCount = 0;
  let directoryCount = 0;

  const finishGroup = async (endOffset: number): Promise<void> => {
    if (currentKey === undefined) return;
    await directoryWriter.write(canonicalJsonLineV0_1(createDirectoryEntryV0_1({
      lookupKey: currentKey,
      postingByteOffset: currentGroupStart,
      postingByteLength: endOffset - currentGroupStart,
      postingCount: currentGroupCount,
    })));
    directoryCount += 1;
  };

  try {
    while (existing !== undefined || recoveredPosting !== undefined) {
      let next: EnglishKaikkiDeterministicIndexPostingV0_1;
      if (existing === undefined) {
        next = recoveredPosting as EnglishKaikkiDeterministicIndexPostingV0_1;
        recoveredPosting = await readNext(recoveredIterator);
      } else if (recoveredPosting === undefined || comparePostingsV0_1(existing, recoveredPosting) < 0) {
        next = existing;
        existing = await readNext(existingIterator);
      } else {
        assert(comparePostingsV0_1(existing, recoveredPosting) !== 0, "RECOVERED_POSTING_DUPLICATES_EXISTING");
        next = recoveredPosting;
        recoveredPosting = await readNext(recoveredIterator);
      }
      if (previous !== undefined) assert(comparePostingsV0_1(previous, next) < 0, "REPAIRED_POSTING_ORDER_INVALID");
      previous = next;
      const line = canonicalJsonLineV0_1(next);
      const offset = postingsWriter.byteLength;
      if (currentKey !== next.lookupKey) {
        await finishGroup(offset);
        currentKey = next.lookupKey;
        currentGroupStart = offset;
        currentGroupCount = 0;
      }
      currentGroupCount += 1;
      postingsCount += 1;
      await postingsWriter.write(line);
    }
    await finishGroup(postingsWriter.byteLength);
  } finally {
    await postingsWriter.close();
    await directoryWriter.close();
    if (typeof existingIterator.return === "function") await existingIterator.return(undefined);
    if (typeof recoveredIterator.return === "function") await recoveredIterator.return(undefined);
  }
  assert(postingsCount === EXPECTED_RECORDS, `REPAIRED_POSTING_COUNT:${postingsCount}`);
  assert(directoryCount > 0, "REPAIRED_DIRECTORY_EMPTY");
  return Object.freeze({ directoryCount, postingsCount });
}

async function verifyCandidate(
  candidatePath: string,
  expectedManifest: EnglishKaikkiDeterministicIndexManifestV0_1,
): Promise<Readonly<{ manifest: EnglishKaikkiDeterministicIndexManifestV0_1; physical: PhysicalProof; digests: Readonly<{ directory: Digest; postings: Digest; manifest: Digest }> }>> {
  const directoryPath = join(candidatePath, "directory.ndjson");
  const postingsPath = join(candidatePath, "postings.ndjson");
  const manifestPath = join(candidatePath, "manifest.json");
  const manifestBytes = await readFile(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString("utf8")) as EnglishKaikkiDeterministicIndexManifestV0_1;
  assert(JSON.stringify(manifest) === JSON.stringify(expectedManifest), "CANDIDATE_MANIFEST_CHANGED_AFTER_WRITE");
  const [directoryDigest, postingsDigest, lf] = await Promise.all([
    digestFile(directoryPath),
    digestFile(postingsPath),
    countLf(postingsPath),
  ]);
  assert(manifest.files[0].bytes === directoryDigest.bytes && manifest.files[0].sha256 === directoryDigest.sha256, "CANDIDATE_DIRECTORY_HASH_MISMATCH");
  assert(manifest.files[1].bytes === postingsDigest.bytes && manifest.files[1].sha256 === postingsDigest.sha256, "CANDIDATE_POSTINGS_HASH_MISMATCH");
  const identityPayload = createIdentityPayloadV0_1({
    sourceSnapshot: manifest.sourceSnapshot,
    adapter: manifest.adapter,
    files: [manifest.files[0], manifest.files[1]],
  });
  assert(manifest.artifactIdentity.sha256 === artifactIdentitySha256V0_1(identityPayload), "CANDIDATE_IDENTITY_MISMATCH");

  const ordinals = new Uint8Array(EXPECTED_RECORDS + 1);
  let countB = 0;
  let unique = 0;
  let duplicates = 0;
  let minOrdinal = EXPECTED_RECORDS + 1;
  let maxOrdinal = 0;
  let postingsOffset = 0;
  let previousPosting: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  let activeDirectory: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | undefined;
  let activeDirectoryCount = 0;
  let directoryEntryCount = 0;
  let directoryPostingCountSum = 0;
  let previousDirectoryEnd = 0;
  let rangesContiguous = true;
  const directoryIterator = readCanonicalNdjsonLinesV0_1(directoryPath)[Symbol.asyncIterator]();
  const nextDirectory = async (): Promise<EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | undefined> => {
    const next = await directoryIterator.next();
    if (next.done) return undefined;
    const entry = JSON.parse(next.value) as EnglishKaikkiDeterministicIndexDirectoryEntryV0_1;
    assert(canonicalJsonV0_1(entry) === next.value, "DIRECTORY_NOT_CANONICAL");
    assert(entry.postingByteOffset === previousDirectoryEnd, "DIRECTORY_RANGE_GAP_OR_OVERLAP");
    if (directoryEntryCount > 0 && entry.lookupKey <= (activeDirectory?.lookupKey ?? "")) assert(false, "DIRECTORY_ORDER_INVALID");
    previousDirectoryEnd = entry.postingByteOffset + entry.postingByteLength;
    directoryEntryCount += 1;
    directoryPostingCountSum += entry.postingCount;
    return entry;
  };

  for await (const line of readCanonicalNdjsonLinesV0_1(postingsPath)) {
    const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
    assert(canonicalJsonV0_1(posting) === line, "POSTING_NOT_CANONICAL");
    if (previousPosting !== undefined) assert(comparePostingsV0_1(previousPosting, posting) < 0, "POSTING_ORDER_INVALID");
    previousPosting = posting;
    const ordinal = posting.recordOrdinal;
    assert(Number.isSafeInteger(ordinal) && ordinal >= 1 && ordinal <= EXPECTED_RECORDS, "POSTING_ORDINAL_OUT_OF_RANGE");
    if (ordinals[ordinal] === 1) duplicates += 1;
    else {
      ordinals[ordinal] = 1;
      unique += 1;
    }
    minOrdinal = Math.min(minOrdinal, ordinal);
    maxOrdinal = Math.max(maxOrdinal, ordinal);
    const lineBytes = Buffer.byteLength(line, "utf8") + 1;
    if (activeDirectory === undefined || activeDirectory.lookupKey !== posting.lookupKey) {
      if (activeDirectory !== undefined) {
        assert(postingsOffset === activeDirectory.postingByteOffset + activeDirectory.postingByteLength, "DIRECTORY_RANGE_END_INVALID");
        assert(activeDirectoryCount === activeDirectory.postingCount, "DIRECTORY_POSTING_COUNT_INVALID");
      }
      activeDirectory = await nextDirectory();
      assert(activeDirectory?.lookupKey === posting.lookupKey, "DIRECTORY_KEY_MISMATCH");
      assert(activeDirectory.postingByteOffset === postingsOffset, "DIRECTORY_RANGE_START_INVALID");
      activeDirectoryCount = 0;
    }
    activeDirectoryCount += 1;
    countB += 1;
    postingsOffset += lineBytes;
    assert(postingsOffset <= (activeDirectory as EnglishKaikkiDeterministicIndexDirectoryEntryV0_1).postingByteOffset + (activeDirectory as EnglishKaikkiDeterministicIndexDirectoryEntryV0_1).postingByteLength, "POSTING_OUTSIDE_DIRECTORY_RANGE");
  }
  if (activeDirectory !== undefined) {
    assert(postingsOffset === activeDirectory.postingByteOffset + activeDirectory.postingByteLength, "FINAL_DIRECTORY_RANGE_END_INVALID");
    assert(activeDirectoryCount === activeDirectory.postingCount, "FINAL_DIRECTORY_POSTING_COUNT_INVALID");
  }
  const extraDirectory = await nextDirectory();
  assert(extraDirectory === undefined, "DIRECTORY_HAS_UNREFERENCED_ENTRY");
  assert(previousDirectoryEnd === postingsDigest.bytes, "DIRECTORY_FINAL_RANGE_NOT_EOF");
  assert(directoryPostingCountSum === EXPECTED_RECORDS, `DIRECTORY_SUM:${directoryPostingCountSum}`);
  const missing = [];
  for (let ordinal = 1; ordinal <= EXPECTED_RECORDS; ordinal += 1) if (ordinals[ordinal] === 0) missing.push(ordinal);
  const physical: PhysicalProof = Object.freeze({
    countA: lf.count,
    countB,
    countC: directoryPostingCountSum,
    uniqueRecordOrdinals: unique,
    duplicateRecordOrdinals: duplicates,
    missingRecordOrdinals: missing.length,
    minRecordOrdinal: minOrdinal,
    maxRecordOrdinal: maxOrdinal,
    directoryEntryCount,
    directoryPostingCountSum,
    rangesContiguous,
    finalRangeEqualsPostingsEof: previousDirectoryEnd === postingsDigest.bytes,
    canonicalOrder: true,
    finalLf: lf.finalLf,
  });
  assertPhysicalCompletenessV0_1({
    countA: physical.countA,
    countB: physical.countB,
    countC: physical.countC,
    manifestPostingsWritten: manifest.counts.postingsWritten,
  });
  assert(physical.uniqueRecordOrdinals === EXPECTED_RECORDS, "UNIQUE_ORDINAL_COUNT_INVALID");
  assert(physical.duplicateRecordOrdinals === 0, "DUPLICATE_ORDINAL_COUNT_INVALID");
  assert(physical.missingRecordOrdinals === 0, "MISSING_ORDINAL_COUNT_INVALID");
  assert(physical.minRecordOrdinal === 1 && physical.maxRecordOrdinal === EXPECTED_RECORDS, "ORDINAL_RANGE_INVALID");
  assert(physical.rangesContiguous && physical.finalRangeEqualsPostingsEof, "DIRECTORY_RANGE_PROOF_INVALID");
  assert(physical.finalLf, "POSTINGS_FINAL_LF_INVALID");
  const manifestDigest = Object.freeze({ bytes: manifestBytes.length, sha256: createHash("sha256").update(manifestBytes).digest("hex") });
  return Object.freeze({ manifest, physical, digests: Object.freeze({ directory: directoryDigest, postings: postingsDigest, manifest: manifestDigest }) });
}

async function verifySourceSamples(
  sourcePath: string,
  postings: readonly EnglishKaikkiDeterministicIndexPostingV0_1[],
): Promise<void> {
  const sample = [postings[0], postings[postings.length - 1], ...postings.filter((posting) => posting.lookupKey === "a").slice(0, 2)].filter(
    (posting): posting is EnglishKaikkiDeterministicIndexPostingV0_1 => posting !== undefined,
  );
  const handle = await open(sourcePath, "r");
  try {
    for (const posting of sample) {
      const bytes = Buffer.alloc(posting.recordByteLength);
      const result = await handle.read(bytes, 0, bytes.length, posting.recordByteOffset);
      assert(result.bytesRead === bytes.length, "SOURCE_SAMPLE_SHORT_READ");
      const recovered = recoverPostingRecordV0_1({
        recordBytes: bytes,
        posting,
        verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
      });
      assert(recovered.ok, `SOURCE_SAMPLE_RECOVERY_FAILED:${posting.recordOrdinal}`);
    }
  } finally {
    await handle.close();
  }
}

async function readDeterministicPostingSamples(
  postingsPath: string,
): Promise<EnglishKaikkiDeterministicIndexPostingV0_1[]> {
  let first: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  let last: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  const collision: EnglishKaikkiDeterministicIndexPostingV0_1[] = [];
  for await (const line of readCanonicalNdjsonLinesV0_1(postingsPath)) {
    const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
    first ??= posting;
    last = posting;
    if (posting.lookupKey === "a" && collision.length < 2) collision.push(posting);
  }
  return [first, last, ...collision].filter(
    (posting): posting is EnglishKaikkiDeterministicIndexPostingV0_1 => posting !== undefined,
  );
}

async function buildAndVerifyCandidate(
  paths: ExternalPaths,
  preRepair: Readonly<{ manifest: EnglishKaikkiDeterministicIndexManifestV0_1; present: Uint8Array; missingOrdinals: number[] }>,
  recovered: readonly EnglishKaikkiDeterministicIndexPostingV0_1[],
): Promise<Readonly<{ candidatePath: string; manifest: EnglishKaikkiDeterministicIndexManifestV0_1; proof: PhysicalProof; digests: Readonly<{ directory: Digest; postings: Digest; manifest: Digest }> }>> {
  const candidatePath = await mkdtemp(`${dirname(paths.indexPath)}${process.platform === "win32" ? "\\" : "/"}.targeted-6597-repair-`);
  try {
    const merge = await mergeCandidate(paths.postingsPath, recovered, candidatePath);
    assert(merge.postingsCount === EXPECTED_RECORDS, "CANDIDATE_POSTING_COUNT_INVALID");
    const directoryDigest = await digestFile(join(candidatePath, "directory.ndjson"));
    const postingsDigest = await digestFile(join(candidatePath, "postings.ndjson"));
    const identityPayload = createIdentityPayloadV0_1({
      sourceSnapshot: preRepair.manifest.sourceSnapshot,
      adapter: preRepair.manifest.adapter,
      files: [
        { path: "directory.ndjson", bytes: directoryDigest.bytes, sha256: directoryDigest.sha256 },
        { path: "postings.ndjson", bytes: postingsDigest.bytes, sha256: postingsDigest.sha256 },
      ],
    });
    const manifest = {
      ...preRepair.manifest,
      files: [
        { path: "directory.ndjson", bytes: directoryDigest.bytes, sha256: directoryDigest.sha256 },
        { path: "postings.ndjson", bytes: postingsDigest.bytes, sha256: postingsDigest.sha256 },
      ],
      artifactIdentity: {
        ...preRepair.manifest.artifactIdentity,
        sha256: artifactIdentitySha256V0_1(identityPayload),
      },
      counts: {
        recordsProcessed: EXPECTED_RECORDS,
        postingsWritten: EXPECTED_RECORDS,
        distinctLookupKeys: merge.directoryCount,
      },
    } as EnglishKaikkiDeterministicIndexManifestV0_1;
    await writeFile(join(candidatePath, "manifest.json"), `${JSON.stringify(manifest)}\n`, { flag: "wx" });
    const verified = await verifyCandidate(candidatePath, manifest);
    const recoveredByOrdinal = [...recovered].sort((left, right) => left.recordOrdinal - right.recordOrdinal);
    const existingAndFinalSamples = await readDeterministicPostingSamples(join(candidatePath, "postings.ndjson"));
    await verifySourceSamples(paths.sourcePath, [
      recoveredByOrdinal[0],
      recoveredByOrdinal[recoveredByOrdinal.length - 1],
      ...existingAndFinalSamples,
    ]);
    return Object.freeze({ candidatePath, manifest: verified.manifest, proof: verified.physical, digests: verified.digests });
  } catch (error) {
    await rm(candidatePath, { recursive: true, force: true });
    throw error;
  }
}

async function publishCandidate(paths: ExternalPaths, candidatePath: string): Promise<string> {
  const backupPath = `${paths.indexPath}.incomplete-pre-targeted-repair-${process.pid}-${Date.now()}`;
  await rename(paths.indexPath, backupPath);
  try {
    await rename(candidatePath, paths.indexPath);
  } catch (error) {
    await rename(backupPath, paths.indexPath).catch(() => undefined);
    throw error;
  }
  return backupPath;
}

async function main(): Promise<void> {
  const paths = await resolvePaths();
  const preRepair = await verifyPreRepairArtifact(paths);
  const recovery = await recoverMissingPostings(paths, preRepair.present, preRepair.missingOrdinals);
  const candidate = await buildAndVerifyCandidate(paths, preRepair, recovery.recovered);
  const apply = process.argv.includes("--apply");
  let backupPath: string | undefined;
  if (apply) backupPath = await publishCandidate(paths, candidate.candidatePath);
  else await rm(candidate.candidatePath, { recursive: true, force: true });
  const finalPath = apply ? paths.indexPath : undefined;
  const final = apply && finalPath !== undefined
    ? await verifyCandidate(finalPath, candidate.manifest)
    : undefined;
  console.log(JSON.stringify({
    mode: apply ? "APPLIED" : "CANDIDATE_ONLY",
    source: { bytes: recovery.sourceBytes, sha256: recovery.sourceSha256, records: recovery.sourceRecordCount },
    recovery: {
      existingPostings: EXPECTED_EXISTING_POSTINGS,
      recoveredPostings: recovery.recovered.length,
      adapterAdmitted: recovery.recovered.length,
      adapterRejected: 0,
      missingOrdinalsSha256: EXPECTED_MISSING_ORDINALS_SHA256,
    },
    candidate: {
      directory: candidate.digests.directory,
      postings: candidate.digests.postings,
      manifest: candidate.digests.manifest,
      artifactIdentity: candidate.manifest.artifactIdentity.sha256,
      physical: candidate.proof,
    },
    published: apply ? {
      backupDirectoryRetained: true,
      backupDirectoryName: backupPath === undefined ? undefined : backupPath.slice(backupPath.lastIndexOf("/") + 1),
      directory: final?.digests.directory,
      postings: final?.digests.postings,
      manifest: final?.digests.manifest,
      artifactIdentity: final?.manifest.artifactIdentity.sha256,
      physical: final?.physical,
    } : undefined,
    authority: {
      indexContractSha256: candidate.manifest.files.length === 2 ? "0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8" : "UNKNOWN",
      humanDefinitionSha256: "c108f82172dcf87c786e2e9baebccc3ffaf6d3430c0b55b30018d626abe153cf",
    },
    fullCorpusBuildExecuted: false,
    attempt4Executed: false,
    sourceReacquired: false,
  }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exitCode = 1;
  });
}

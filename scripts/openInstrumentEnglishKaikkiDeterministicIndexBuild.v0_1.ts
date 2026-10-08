import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  rename,
  rm,
  stat,
  statfs,
  unlink,
  writeFile,
  realpath,
} from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
  ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
} from "../src/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  artifactIdentitySha256V0_1,
  canonicalJsonLineV0_1,
  canonicalJsonV0_1,
  comparePostingsV0_1,
  compareUtf8BytesV0_1,
  createDirectoryEntryV0_1,
  createIdentityPayloadV0_1,
  createPostingV0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_SHA256_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1,
  firstUtf8ByteV0_1,
  normalizeIndexQueryV0_1,
  recoverPostingRecordV0_1,
  type EnglishKaikkiDeterministicIndexDirectoryEntryV0_1,
  type EnglishKaikkiDeterministicIndexManifestV0_1,
  type EnglishKaikkiDeterministicIndexPostingV0_1,
} from "../src/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1";

const REPOSITORY_ROOT = resolve(process.cwd());
const EXTERNAL_ROOT_ENV = "OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT";
const SOURCE_RELATIVE_PATH =
  "source-family/english-kaikki/2026-10-03/kaikki.org-dictionary-English.jsonl";
const INDEX_RELATIVE_PATH =
  "source-family/english-kaikki/2026-10-03/index/open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1";
const EXECUTION_RESULT_RELATIVE_PATH =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/index-build-execution-result.json";
const EXECUTION_RESULT_MANIFEST_RELATIVE_PATH =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/index-build-execution-result-hash-manifest.json";
const INDEX_BUILDER_RELATIVE_PATH =
  "scripts/openInstrumentEnglishKaikkiDeterministicIndexBuild.v0_1.ts";
const INDEX_MODULE_RELATIVE_PATH =
  "src/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1.ts";
export const DEFAULT_CHUNK_BYTES = 8 * 1024 * 1024;
export const DEFAULT_BUCKET_BUFFER_BYTES = 1024 * 1024;
export const DEFAULT_SORT_RUN_BYTES = 128 * 1024 * 1024;
const RESOURCE_SAMPLE_RECORDS = 10_000;
const RESOURCE_POSTING_SAFETY_FACTOR = 1.2;
const RESOURCE_DIRECTORY_SAFETY_FACTOR = 1.2;
const RESOURCE_SAFETY_FLOOR_BYTES = 64 * 1024 * 1024;
const OUTPUT_BUFFER_BYTES = 1024 * 1024;
const BUCKET_COUNT = 256;

export type PhysicalRecordV0_1 = Readonly<{
  recordOrdinal: number;
  recordByteOffset: number;
  recordBytes: Buffer;
}>;

type SourceIdentityV0_1 = Readonly<{
  byteLength: number;
  sha256: string;
  physicalRecordCount: number;
}>;

type ResourcePreflightV0_1 = Readonly<{
  availableBytes: number;
  requiredBytes: number;
  estimatedPostingBytes: number;
  estimatedDirectoryBytes: number;
  safetyMarginBytes: number;
  sampleRecords: number;
  physicalRecordCount: number;
  result: "PASS";
}>;

type BuildCountsV0_1 = Readonly<{
  recordsProcessed: number;
  postingsWritten: number;
  distinctLookupKeys: number;
  sourceRecordFailures: number;
}>;

type LookupProofV0_1 = Readonly<{
  procedure: string;
  inputSelection: string;
  zeroMatch: Readonly<{ query: string; status: string }>;
  collision: Readonly<{ lookupKey: string; postingCount: number; status: string }>;
  byteRangeRecovery: string;
  recordSha: string;
  readaptation: string;
  ordering: string;
  result: "PASS";
}>;

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function isInside(parent: string, child: string): boolean {
  const childRelative = relative(parent, child);
  return (
    childRelative !== "" &&
    !childRelative.startsWith("..") &&
    !isAbsolute(childRelative)
  );
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    fail(`INVALID_POSITIVE_INTEGER:${value}`);
  }
  return parsed;
}

function sha256FileBytes(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function sha256File(path: string): Promise<{ bytes: number; sha256: string }> {
  const hash = createHash("sha256");
  let bytes = 0;
  const stream = createReadStream(path, { highWaterMark: DEFAULT_CHUNK_BYTES });
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    hash.update(buffer);
  }
  return { bytes, sha256: hash.digest("hex") };
}

export async function* readCanonicalNdjsonLinesV0_1(
  path: string,
): AsyncGenerator<string> {
  const handle = await open(path, "r");
  let closed = false;
  let position = 0;
  let pending = Buffer.alloc(0);
  try {
    const chunk = Buffer.allocUnsafe(DEFAULT_CHUNK_BYTES);
    while (true) {
      const result = await handle.read(chunk, 0, chunk.length, position);
      if (result.bytesRead === 0) break;
      const bytes = chunk.subarray(0, result.bytesRead);
      position += result.bytesRead;
      let segmentStart = 0;
      for (let index = 0; index < bytes.length; index += 1) {
        if (bytes[index] !== 0x0a) continue;
        const lineBytes =
          pending.length === 0
            ? bytes.subarray(segmentStart, index)
            : Buffer.concat(
                [pending, bytes.subarray(segmentStart, index)],
                pending.length + index - segmentStart,
              );
        assert(lineBytes.length > 0, "INDEX_EMPTY_NDJSON_LINE");
        yield lineBytes.toString("utf8");
        pending = Buffer.alloc(0);
        segmentStart = index + 1;
      }
      if (segmentStart < bytes.length) {
        const tail = bytes.subarray(segmentStart);
        pending =
          pending.length === 0
            ? Buffer.from(tail)
            : Buffer.concat([pending, tail], pending.length + tail.length);
      }
    }
    assert(pending.length === 0, "INDEX_NDJSON_MISSING_FINAL_LF");
  } finally {
    if (!closed) {
      closed = true;
      await handle.close();
    }
  }
}

export async function* iteratePhysicalRecordsV0_1(
  path: string,
  chunkSize = DEFAULT_CHUNK_BYTES,
): AsyncGenerator<PhysicalRecordV0_1> {
  const stream = createReadStream(path, { highWaterMark: chunkSize });
  let pending: Buffer[] = [];
  let pendingBytes = 0;
  let streamOffset = 0;
  let recordStartOffset = 0;
  let recordOrdinal = 0;

  for await (const chunk of stream) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    let segmentStart = 0;
    for (let index = 0; index < bytes.length; index += 1) {
      if (bytes[index] !== 0x0a) continue;
      const part = bytes.subarray(segmentStart, index + 1);
      const recordBytes =
        pendingBytes === 0
          ? part
          : Buffer.concat([...pending, part], pendingBytes + part.length);
      recordOrdinal += 1;
      yield Object.freeze({
        recordOrdinal,
        recordByteOffset: recordStartOffset,
        recordBytes,
      });
      pending = [];
      pendingBytes = 0;
      segmentStart = index + 1;
      recordStartOffset = streamOffset + segmentStart;
    }
    if (segmentStart < bytes.length) {
      const part = bytes.subarray(segmentStart);
      if (pendingBytes === 0) recordStartOffset = streamOffset + segmentStart;
      pending.push(part);
      pendingBytes += part.length;
    }
    streamOffset += bytes.length;
  }

  if (pendingBytes > 0) {
    recordOrdinal += 1;
    yield Object.freeze({
      recordOrdinal,
      recordByteOffset: recordStartOffset,
      recordBytes: Buffer.concat(pending, pendingBytes),
    });
  }
}

async function hashAndCountSourceV0_1(path: string): Promise<SourceIdentityV0_1> {
  const hash = createHash("sha256");
  let byteLength = 0;
  let physicalRecordCount = 0;
  let lastByte = -1;
  const stream = createReadStream(path, { highWaterMark: DEFAULT_CHUNK_BYTES });
  for await (const chunk of stream) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    byteLength += bytes.length;
    hash.update(bytes);
    for (const byte of bytes) if (byte === 0x0a) physicalRecordCount += 1;
    if (bytes.length > 0) lastByte = bytes[bytes.length - 1];
  }
  if (byteLength > 0 && lastByte !== 0x0a) physicalRecordCount += 1;
  return Object.freeze({
    byteLength,
    sha256: hash.digest("hex"),
    physicalRecordCount,
  });
}

async function resolveExternalPathsV0_1(): Promise<Readonly<{
  externalRoot: string;
  sourcePath: string;
  indexPath: string;
}>> {
  const externalRootValue = process.env[EXTERNAL_ROOT_ENV];
  assert(externalRootValue, `MISSING_ENV:${EXTERNAL_ROOT_ENV}`);
  const externalRoot = await realpath(externalRootValue);
  const repositoryRoot = await realpath(REPOSITORY_ROOT);
  assert(
    externalRoot !== repositoryRoot &&
      !isInside(repositoryRoot, externalRoot) &&
      !isInside(externalRoot, repositoryRoot),
    "EXTERNAL_ROOT_NOT_OUTSIDE_GIT",
  );
  const sourcePathCandidate = join(externalRoot, SOURCE_RELATIVE_PATH);
  const sourceStat = await stat(sourcePathCandidate);
  assert(sourceStat.isFile(), "SOURCE_NOT_REGULAR_FILE");
  const sourcePath = await realpath(sourcePathCandidate);
  assert(isInside(externalRoot, sourcePath), "SOURCE_REALPATH_ESCAPES_EXTERNAL_ROOT");
  const indexPath = join(externalRoot, INDEX_RELATIVE_PATH);
  return Object.freeze({ externalRoot, sourcePath, indexPath });
}

async function verifyFrozenAuthorityV0_1(): Promise<void> {
  const definitionPath = resolve(
    REPOSITORY_ROOT,
    "docs/open-instrument/english-kaikki-deterministic-index-v0.1.md",
  );
  const contractPath = resolve(
    REPOSITORY_ROOT,
    "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/contract.json",
  );
  const adapterContractPath = resolve(
    REPOSITORY_ROOT,
    "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/contract.json",
  );
  const adapterImplementationPath = resolve(
    REPOSITORY_ROOT,
    "src/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1.ts",
  );
  const [definitionFile, contractFile, adapterContractFile, adapterImplementationFile] = await Promise.all([
    sha256File(definitionPath),
    sha256File(contractPath),
    sha256File(adapterContractPath),
    sha256File(adapterImplementationPath),
  ]);
  assert(
    definitionFile.sha256 === ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_SHA256_V0_1,
    "FROZEN_INDEX_DEFINITION_HASH_MISMATCH",
  );
  assert(
    contractFile.sha256 === "0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8",
    "FROZEN_INDEX_MACHINE_CONTRACT_HASH_MISMATCH",
  );
  assert(
    adapterContractFile.sha256 ===
      "a359b0a8d6fe172b32937aed93690545adfc2403c40419209f358fc46d14ed02",
    "FROZEN_ADAPTER_CONTRACT_HASH_MISMATCH",
  );
  assert(
    adapterImplementationFile.sha256 ===
      "2b8a41fd2c5cd8d7a11e8b157690d3e4b4dfd12ed44a1de48c5070347e11c28f",
    "FROZEN_ADAPTER_IMPLEMENTATION_HASH_MISMATCH",
  );
  const contract = JSON.parse(await readFile(contractPath, "utf8")) as {
    contractId?: unknown;
    status?: unknown;
    indexSchema?: { schemaVersion?: unknown; indexId?: unknown; buildProcedureId?: unknown };
    authority?: {
      sourceSnapshot?: { expectedBytes?: unknown; expectedSha256?: unknown };
      adapter?: { implementationCommit?: unknown };
    };
  };
  assert(contract.contractId === ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1, "FROZEN_INDEX_CONTRACT_ID_MISMATCH");
  assert(contract.status === "DEFINED_AND_FROZEN_NOT_IMPLEMENTED", "FROZEN_INDEX_CONTRACT_STATUS_MISMATCH");
  assert(contract.indexSchema?.schemaVersion === ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1, "FROZEN_INDEX_SCHEMA_MISMATCH");
  assert(contract.indexSchema?.indexId === ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1, "FROZEN_INDEX_ID_MISMATCH");
  assert(contract.indexSchema?.buildProcedureId === ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1, "FROZEN_BUILD_PROCEDURE_ID_MISMATCH");
  assert(contract.authority?.sourceSnapshot?.expectedBytes === ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1.byteLength, "FROZEN_SOURCE_BYTES_MISMATCH");
  assert(contract.authority?.sourceSnapshot?.expectedSha256 === ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1.sha256, "FROZEN_SOURCE_SHA256_MISMATCH");
  assert(contract.authority?.adapter?.implementationCommit === "4e37b56b9194983b836f85269033f916c6ae408d", "FROZEN_ADAPTER_COMMIT_MISMATCH");
}

async function inspectExistingFinalV0_1(indexPath: string): Promise<"ABSENT" | "PRESENT"> {
  try {
    const existing = await lstat(indexPath);
    assert(!existing.isSymbolicLink(), "EXISTING_FINAL_SYMLINK_UNSAFE");
    assert(existing.isDirectory(), "EXISTING_FINAL_NOT_DIRECTORY");
    return "PRESENT";
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "ABSENT";
    }
    throw error;
  }
}

async function sampleResourceEstimateV0_1(
  sourcePath: string,
  sourceIdentity: SourceIdentityV0_1,
): Promise<Readonly<{ estimatedPostingBytes: number; estimatedDirectoryBytes: number; sampleRecords: number }>> {
  const samplePostings: EnglishKaikkiDeterministicIndexPostingV0_1[] = [];
  let sampleRecords = 0;
  for await (const physical of iteratePhysicalRecordsV0_1(sourcePath)) {
    if (sampleRecords >= RESOURCE_SAMPLE_RECORDS) break;
    sampleRecords += 1;
    const adapted = adaptEnglishKaikkiJsonlRecordV0_1({
      recordBytes: physical.recordBytes,
      recordOrdinal: physical.recordOrdinal,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    });
    assert(adapted.ok, `RESOURCE_SAMPLE_ADAPTER_FAILURE:${physical.recordOrdinal}`);
    samplePostings.push(
      createPostingV0_1({
        sourceRecord: adapted.record,
        recordByteOffset: physical.recordByteOffset,
        recordByteLength: physical.recordBytes.length,
      }),
    );
  }
  assert(sampleRecords > 0, "SOURCE_EMPTY");
  samplePostings.sort(comparePostingsV0_1);
  const samplePostingBytes = samplePostings.reduce(
    (sum, posting) => sum + canonicalJsonLineV0_1(posting).byteLength,
    0,
  );
  const directoryByKey = new Map<string, EnglishKaikkiDeterministicIndexDirectoryEntryV0_1>();
  let postingOffset = 0;
  for (const posting of samplePostings) {
    const lineBytes = canonicalJsonLineV0_1(posting);
    const previous = directoryByKey.get(posting.lookupKey);
    if (previous === undefined) {
      directoryByKey.set(
        posting.lookupKey,
        createDirectoryEntryV0_1({
          lookupKey: posting.lookupKey,
          postingByteOffset: postingOffset,
          postingByteLength: lineBytes.length,
          postingCount: 1,
        }),
      );
    } else {
      directoryByKey.set(
        posting.lookupKey,
        createDirectoryEntryV0_1({
          lookupKey: posting.lookupKey,
          postingByteOffset: previous.postingByteOffset,
          postingByteLength: previous.postingByteLength + lineBytes.length,
          postingCount: previous.postingCount + 1,
        }),
      );
    }
    postingOffset += lineBytes.length;
  }
  const sampleDirectoryBytes = [...directoryByKey.values()].reduce(
    (sum, entry) => sum + canonicalJsonLineV0_1(entry).byteLength,
    0,
  );
  const estimatedPostingBytes = Math.ceil(
    (samplePostingBytes / sampleRecords) *
      sourceIdentity.physicalRecordCount *
      RESOURCE_POSTING_SAFETY_FACTOR,
  );
  const estimatedDirectoryBytes = Math.ceil(
    (sampleDirectoryBytes / sampleRecords) *
      sourceIdentity.physicalRecordCount *
      RESOURCE_DIRECTORY_SAFETY_FACTOR,
  );
  return Object.freeze({
    estimatedPostingBytes,
    estimatedDirectoryBytes,
    sampleRecords,
  });
}

async function resourcePreflightV0_1(
  externalRoot: string,
  sourceIdentity: SourceIdentityV0_1,
): Promise<ResourcePreflightV0_1> {
  const estimate = await sampleResourceEstimateV0_1(
    join(externalRoot, SOURCE_RELATIVE_PATH),
    sourceIdentity,
  );
  const safetyMarginBytes = Math.max(
    RESOURCE_SAFETY_FLOOR_BYTES,
    Math.ceil((estimate.estimatedPostingBytes + estimate.estimatedDirectoryBytes) * 0.1),
  );
  const requiredBytes =
    estimate.estimatedPostingBytes + estimate.estimatedDirectoryBytes + safetyMarginBytes;
  const filesystem = await statfs(externalRoot);
  const availableBytes = Number(filesystem.bavail) * Number(filesystem.bsize);
  assert(
    availableBytes >= requiredBytes,
    `INSUFFICIENT_EXTERNAL_STORAGE:available=${availableBytes}:required=${requiredBytes}`,
  );
  return Object.freeze({
    availableBytes,
    requiredBytes,
    estimatedPostingBytes: estimate.estimatedPostingBytes,
    estimatedDirectoryBytes: estimate.estimatedDirectoryBytes,
    safetyMarginBytes,
    sampleRecords: estimate.sampleRecords,
    physicalRecordCount: sourceIdentity.physicalRecordCount,
    result: "PASS",
  });
}

class BufferedFileWriterV0_1 {
  private readonly handlePromise: ReturnType<typeof open>;
  private buffers: Buffer[] = [];
  private bufferedBytes = 0;
  byteLength = 0;

  constructor(path: string) {
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

class BucketWritersV0_1 {
  private readonly handles = new Map<number, Awaited<ReturnType<typeof open>>>();
  private readonly buffers = new Map<number, Buffer[]>();
  private readonly bufferedBytes = new Map<number, number>();

  constructor(
    private readonly directory: string,
    private readonly bufferLimit: number,
  ) {}

  private pathFor(bucket: number): string {
    return join(this.directory, `bucket-${String(bucket).padStart(3, "0")}.ndjson`);
  }

  async append(bucket: number, bytes: Buffer): Promise<void> {
    let buffer = this.buffers.get(bucket);
    if (buffer === undefined) {
      buffer = [];
      this.buffers.set(bucket, buffer);
      this.bufferedBytes.set(bucket, 0);
    }
    buffer.push(bytes);
    const nextBytes = (this.bufferedBytes.get(bucket) ?? 0) + bytes.length;
    this.bufferedBytes.set(bucket, nextBytes);
    if (nextBytes >= this.bufferLimit) await this.flush(bucket);
  }

  async flush(bucket: number): Promise<void> {
    const bytes = this.bufferedBytes.get(bucket) ?? 0;
    if (bytes === 0) return;
    let handle = this.handles.get(bucket);
    if (handle === undefined) {
      handle = await open(this.pathFor(bucket), "wx");
      this.handles.set(bucket, handle);
    }
    const buffer = this.buffers.get(bucket) ?? [];
    await handle.write(Buffer.concat(buffer, bytes));
    this.buffers.set(bucket, []);
    this.bufferedBytes.set(bucket, 0);
  }

  async close(): Promise<void> {
    const buckets = new Set([...this.handles.keys(), ...this.buffers.keys()]);
    for (const bucket of buckets) await this.flush(bucket);
    for (const handle of this.handles.values()) await handle.close();
  }
}

async function writeSortedRunV0_1(
  path: string,
  postings: EnglishKaikkiDeterministicIndexPostingV0_1[],
): Promise<void> {
  postings.sort(comparePostingsV0_1);
  const lines = postings.map(canonicalJsonLineV0_1);
  await writeFile(path, Buffer.concat(lines));
}

export async function* readPostingRunV0_1(
  path: string,
): AsyncGenerator<{ posting: EnglishKaikkiDeterministicIndexPostingV0_1; line: string }> {
  for await (const line of readCanonicalNdjsonLinesV0_1(path)) {
    const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
    yield { posting, line };
  }
}

type HeapItemV0_1 = Readonly<{
  posting: EnglishKaikkiDeterministicIndexPostingV0_1;
  line: string;
  iterator: AsyncIterator<{ posting: EnglishKaikkiDeterministicIndexPostingV0_1; line: string }>;
  runIndex: number;
}>;

function heapCompareV0_1(left: HeapItemV0_1, right: HeapItemV0_1): number {
  return comparePostingsV0_1(left.posting, right.posting) || left.runIndex - right.runIndex;
}

function heapPushV0_1(heap: HeapItemV0_1[], item: HeapItemV0_1): void {
  heap.push(item);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (heapCompareV0_1(heap[parent], heap[index]) <= 0) break;
    [heap[parent], heap[index]] = [heap[index], heap[parent]];
    index = parent;
  }
}

function heapPopV0_1(heap: HeapItemV0_1[]): HeapItemV0_1 {
  assert(heap.length > 0, "INDEX_HEAP_EMPTY");
  const first = heap[0];
  const last = heap.pop();
  if (heap.length > 0 && last !== undefined) {
    heap[0] = last;
    let index = 0;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      if (left < heap.length && heapCompareV0_1(heap[left], heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < heap.length && heapCompareV0_1(heap[right], heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      index = smallest;
    }
  }
  return first;
}

export async function mergeRunsV0_1(
  runPaths: readonly string[],
  writePosting: (posting: EnglishKaikkiDeterministicIndexPostingV0_1) => Promise<void>,
): Promise<void> {
  const iterators = runPaths.map((path) => readPostingRunV0_1(path)[Symbol.asyncIterator]());
  const heap: HeapItemV0_1[] = [];
  try {
    for (const [runIndex, iterator] of iterators.entries()) {
      const next = await iterator.next();
      if (!next.done) heapPushV0_1(heap, { ...next.value, iterator, runIndex });
    }
    while (heap.length > 0) {
      const item = heapPopV0_1(heap);
      await writePosting(item.posting);
      const next = await item.iterator.next();
      if (!next.done) heapPushV0_1(heap, { ...next.value, iterator: item.iterator, runIndex: item.runIndex });
    }
  } finally {
    // The merge owns iterator shutdown on both success and failure. Each
    // generated-file iterator owns exactly one FileHandle close.
    await Promise.all(
      iterators.map(async (iterator) => {
        if (typeof iterator.return === "function") await iterator.return(undefined);
      }),
    );
  }
}

async function processBucketV0_1(input: Readonly<{
  bucketPath: string;
  workDirectory: string;
  maxRunBytes: number;
  writePosting: (posting: EnglishKaikkiDeterministicIndexPostingV0_1) => Promise<void>;
}>): Promise<void> {
  const runPaths: string[] = [];
  let runPostings: EnglishKaikkiDeterministicIndexPostingV0_1[] = [];
  let runBytes = 0;
  for await (const line of readCanonicalNdjsonLinesV0_1(input.bucketPath)) {
    const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
    runPostings.push(posting);
    runBytes += Buffer.byteLength(line, "utf8") + 1;
    if (runBytes >= input.maxRunBytes) {
        const path = join(input.workDirectory, `run-${String(runPaths.length).padStart(6, "0")}.ndjson`);
        await writeSortedRunV0_1(path, runPostings);
        runPaths.push(path);
      runPostings = [];
      runBytes = 0;
    }
  }
  if (runPostings.length > 0) {
    const path = join(input.workDirectory, `run-${String(runPaths.length).padStart(6, "0")}.ndjson`);
    await writeSortedRunV0_1(path, runPostings);
    runPaths.push(path);
  }
  await unlink(input.bucketPath);
  await mergeRunsV0_1(runPaths, input.writePosting);
  await Promise.all(runPaths.map((path) => unlink(path)));
}

async function readDirectoryEntriesV0_1(
  directoryPath: string,
): Promise<EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[]> {
  const text = await readFile(directoryPath, "utf8");
  const entries: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[] = [];
  for (const line of text.split("\n")) {
    if (line.length === 0) continue;
    entries.push(JSON.parse(line) as EnglishKaikkiDeterministicIndexDirectoryEntryV0_1);
  }
  return entries;
}

async function readRangeV0_1(path: string, offset: number, length: number): Promise<Buffer> {
  const handle = await open(path, "r");
  try {
    const buffer = Buffer.alloc(length);
    const result = await handle.read(buffer, 0, length, offset);
    assert(result.bytesRead === length, "INDEX_RANGE_SHORT_READ");
    return buffer;
  } finally {
    await handle.close();
  }
}

function parsePostingLinesV0_1(bytes: Buffer): EnglishKaikkiDeterministicIndexPostingV0_1[] {
  const text = bytes.toString("utf8");
  assert(text.endsWith("\n"), "INDEX_POSTING_RANGE_MISSING_FINAL_LF");
  return text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1);
}

function findDirectoryEntryV0_1(
  entries: readonly EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[],
  lookupKey: string,
): EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | undefined {
  let low = 0;
  let high = entries.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const comparison = compareUtf8BytesV0_1(entries[middle].lookupKey, lookupKey);
    if (comparison === 0) return entries[middle];
    if (comparison < 0) low = middle + 1;
    else high = middle - 1;
  }
  return undefined;
}

async function verifyArtifactV0_1(input: Readonly<{
  indexPath: string;
  sourcePath: string;
  sourceIdentity: SourceIdentityV0_1;
}>): Promise<Readonly<{
  manifest: EnglishKaikkiDeterministicIndexManifestV0_1;
  directoryEntries: readonly EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[];
  lookupProof: LookupProofV0_1;
}>> {
  const directoryPath = join(input.indexPath, "directory.ndjson");
  const postingsPath = join(input.indexPath, "postings.ndjson");
  const manifestPath = join(input.indexPath, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as EnglishKaikkiDeterministicIndexManifestV0_1;
  assert(manifest.status === "PUBLISHED_AND_VERIFIED", "INDEX_MANIFEST_STATUS_MISMATCH");
  assert(manifest.manifestSelfTreatment === "EXCLUDED_FROM_ARTIFACT_IDENTITY_AND_FILE_BINDINGS", "INDEX_MANIFEST_SELF_POLICY_MISMATCH");
  const directoryFile = await sha256File(directoryPath);
  const postingsFile = await sha256File(postingsPath);
  assert(manifest.files[0].path === "directory.ndjson", "INDEX_MANIFEST_DIRECTORY_PATH_MISMATCH");
  assert(manifest.files[1].path === "postings.ndjson", "INDEX_MANIFEST_POSTINGS_PATH_MISMATCH");
  assert(manifest.files[0].bytes === directoryFile.bytes && manifest.files[0].sha256 === directoryFile.sha256, "INDEX_DIRECTORY_HASH_MISMATCH");
  assert(manifest.files[1].bytes === postingsFile.bytes && manifest.files[1].sha256 === postingsFile.sha256, "INDEX_POSTINGS_HASH_MISMATCH");
  assert(manifest.sourceSnapshot.expectedBytes === input.sourceIdentity.byteLength, "INDEX_SOURCE_BYTES_MISMATCH");
  assert(manifest.sourceSnapshot.expectedSha256 === input.sourceIdentity.sha256, "INDEX_SOURCE_SHA256_MISMATCH");
  const identityPayload = createIdentityPayloadV0_1({
    sourceSnapshot: manifest.sourceSnapshot,
    adapter: manifest.adapter,
    files: [manifest.files[0], manifest.files[1]],
  });
  assert(manifest.artifactIdentity.sha256 === artifactIdentitySha256V0_1(identityPayload), "INDEX_ARTIFACT_IDENTITY_MISMATCH");
  const directoryEntries = await readDirectoryEntriesV0_1(directoryPath);
  let postingsOffset = 0;
  let postingsCount = 0;
  let totalPostingsCount = 0;
  let directoryIndex = 0;
  let lastPosting: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  let currentDirectory: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | undefined;
  for await (const line of readCanonicalNdjsonLinesV0_1(postingsPath)) {
      const lineBytes = Buffer.from(`${line}\n`, "utf8");
      const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
      assert(canonicalJsonV0_1(posting) === line, "INDEX_POSTING_NOT_CANONICAL");
      if (lastPosting !== undefined) assert(comparePostingsV0_1(lastPosting, posting) <= 0, "INDEX_POSTING_ORDER_MISMATCH");
      lastPosting = posting;
      if (currentDirectory === undefined || currentDirectory.lookupKey !== posting.lookupKey) {
        if (currentDirectory !== undefined) {
          assert(postingsOffset === currentDirectory.postingByteOffset + currentDirectory.postingByteLength, "INDEX_DIRECTORY_RANGE_END_MISMATCH");
          assert(postingsCount === currentDirectory.postingCount, "INDEX_DIRECTORY_COUNT_MISMATCH");
          directoryIndex += 1;
        }
        currentDirectory = directoryEntries[directoryIndex];
        assert(currentDirectory?.lookupKey === posting.lookupKey, "INDEX_DIRECTORY_KEY_MISMATCH");
        postingsCount = 0;
        assert(postingsOffset === currentDirectory.postingByteOffset, "INDEX_DIRECTORY_RANGE_START_MISMATCH");
      }
      assert(currentDirectory !== undefined, "INDEX_DIRECTORY_MISSING");
      postingsCount += 1;
      totalPostingsCount += 1;
      postingsOffset += lineBytes.length;
      assert(postingsOffset <= currentDirectory.postingByteOffset + currentDirectory.postingByteLength, "INDEX_POSTING_OUTSIDE_DIRECTORY_RANGE");
  }
  if (currentDirectory !== undefined) {
    assert(postingsOffset === currentDirectory.postingByteOffset + currentDirectory.postingByteLength, "INDEX_FINAL_DIRECTORY_RANGE_END_MISMATCH");
    assert(postingsCount === currentDirectory.postingCount, "INDEX_FINAL_DIRECTORY_COUNT_MISMATCH");
    directoryIndex += 1;
  }
  assert(directoryIndex === directoryEntries.length, "INDEX_DIRECTORY_ENTRY_COUNT_MISMATCH");
  assert(postingsOffset === postingsFile.bytes, "INDEX_POSTINGS_BYTE_COUNT_MISMATCH");
  assert(totalPostingsCount === manifest.counts.recordsProcessed, "INDEX_TOTAL_RECORD_COUNT_MISMATCH");
  assert(totalPostingsCount === manifest.counts.postingsWritten, "INDEX_TOTAL_POSTING_COUNT_MISMATCH");

  const zeroPrefix = "__open_instrument_index_zero_match_";
  let zeroCandidate = "";
  for (let index = 0; index < 1_000_000; index += 1) {
    const candidate = `${zeroPrefix}${String(index).padStart(6, "0")}`;
    if (findDirectoryEntryV0_1(directoryEntries, candidate) === undefined) {
      zeroCandidate = candidate;
      break;
    }
  }
  assert(zeroCandidate.length > 0, "INDEX_ZERO_MATCH_SELECTION_EXHAUSTED");
  const zeroEntry = findDirectoryEntryV0_1(directoryEntries, normalizeIndexQueryV0_1(zeroCandidate));
  assert(zeroEntry === undefined, "INDEX_ZERO_MATCH_EXPECTED_ABSENT");
  const collision = directoryEntries.find((entry) => entry.postingCount >= 2);
  assert(collision !== undefined, "INDEX_COLLISION_PROOF_UNAVAILABLE");
  const collisionBytes = await readRangeV0_1(postingsPath, collision.postingByteOffset, collision.postingByteLength);
  const collisionPostings = parsePostingLinesV0_1(collisionBytes);
  assert(collisionPostings.length === collision.postingCount, "INDEX_COLLISION_POSTING_COUNT_MISMATCH");
  const sourceHandle = await open(input.sourcePath, "r");
  try {
    for (const posting of collisionPostings) {
      const recordBytes = Buffer.alloc(posting.recordByteLength);
      const read = await sourceHandle.read(recordBytes, 0, posting.recordByteLength, posting.recordByteOffset);
      assert(read.bytesRead === posting.recordByteLength, "SOURCE_RECOVERY_SHORT_READ");
      const recovered = recoverPostingRecordV0_1({
        recordBytes,
        posting,
        verifiedSnapshot: input.sourceIdentity,
      });
      if (!recovered.ok) fail(`SOURCE_RECOVERY_FAILURE:${recovered.reasonCode}`);
    }
  } finally {
    await sourceHandle.close();
  }
  return Object.freeze({
    manifest,
    directoryEntries,
    lookupProof: Object.freeze({
      procedure: "First deterministic absent candidate from __open_instrument_index_zero_match_000000..; first directory key with postingCount >= 2 for collision.",
      inputSelection: zeroCandidate,
      zeroMatch: Object.freeze({ query: zeroCandidate, status: "LEXICAL_SENSE_SOURCE_NOT_FOUND" }),
      collision: Object.freeze({ lookupKey: collision.lookupKey, postingCount: collision.postingCount, status: "ALL_POSTINGS_RECOVERED" }),
      byteRangeRecovery: "PASS",
      recordSha: "PASS",
      readaptation: "PASS",
      ordering: "PASS",
      result: "PASS",
    }),
  });
}

async function buildIndexV0_1(input: Readonly<{
  externalRoot: string;
  sourcePath: string;
  indexPath: string;
  sourceIdentity: SourceIdentityV0_1;
  preflight: ResourcePreflightV0_1;
}>): Promise<Readonly<{
  counts: BuildCountsV0_1;
  manifest: EnglishKaikkiDeterministicIndexManifestV0_1;
  lookupProof: LookupProofV0_1;
  indexPath: string;
}>> {
  const parent = dirname(input.indexPath);
  await mkdir(parent, { recursive: true });
  const tempRoot = await mkdtemp(join(parent, ".english-kaikki-index-build-v0.1-"));
  const bucketDirectory = join(tempRoot, "buckets");
  const workDirectory = join(tempRoot, "runs");
  await mkdir(bucketDirectory);
  await mkdir(workDirectory);
  const bucketWriters = new BucketWritersV0_1(bucketDirectory, DEFAULT_BUCKET_BUFFER_BYTES);
  const sortRunBytes = parsePositiveInteger(process.env.OPEN_INSTRUMENT_INDEX_SORT_RUN_BYTES, DEFAULT_SORT_RUN_BYTES);
  let recordsProcessed = 0;
  let postingsWritten = 0;
  let sourceRecordFailures = 0;
  try {
    for await (const physical of iteratePhysicalRecordsV0_1(input.sourcePath)) {
      recordsProcessed += 1;
      const adapted = adaptEnglishKaikkiJsonlRecordV0_1({
        recordBytes: physical.recordBytes,
        recordOrdinal: physical.recordOrdinal,
        verifiedSnapshot: input.sourceIdentity,
      });
      if (!adapted.ok) {
        sourceRecordFailures += 1;
        fail(`SOURCE_RECORD_FAILURE:${physical.recordOrdinal}:${adapted.reasonCode}`);
      }
      const posting = createPostingV0_1({
        sourceRecord: adapted.record,
        recordByteOffset: physical.recordByteOffset,
        recordByteLength: physical.recordBytes.length,
      });
      await bucketWriters.append(firstUtf8ByteV0_1(posting.lookupKey), canonicalJsonLineV0_1(posting));
      postingsWritten += 1;
    }
    await bucketWriters.close();

    const postingsPath = join(tempRoot, "postings.ndjson");
    const directoryPath = join(tempRoot, "directory.ndjson");
    const postingsWriter = new BufferedFileWriterV0_1(postingsPath);
    const directoryWriter = new BufferedFileWriterV0_1(directoryPath);
    let postingsOffset = 0;
    let currentKey: string | undefined;
    let currentPostingOffset = 0;
    let currentPostingLength = 0;
    let currentPostingCount = 0;
    let distinctLookupKeys = 0;
    let previousPosting: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;

    const writePosting = async (posting: EnglishKaikkiDeterministicIndexPostingV0_1): Promise<void> => {
      if (previousPosting !== undefined) assert(comparePostingsV0_1(previousPosting, posting) <= 0, "INDEX_MERGE_ORDER_MISMATCH");
      previousPosting = posting;
      const line = canonicalJsonLineV0_1(posting);
      if (currentKey !== undefined && currentKey !== posting.lookupKey) {
        await directoryWriter.write(canonicalJsonLineV0_1(createDirectoryEntryV0_1({
          lookupKey: currentKey,
          postingByteOffset: currentPostingOffset,
          postingByteLength: currentPostingLength,
          postingCount: currentPostingCount,
        })));
        distinctLookupKeys += 1;
        currentPostingOffset = postingsOffset;
        currentPostingLength = 0;
        currentPostingCount = 0;
      }
      if (currentKey === undefined) currentPostingOffset = postingsOffset;
      currentKey = posting.lookupKey;
      currentPostingLength += line.length;
      currentPostingCount += 1;
      postingsOffset += line.length;
      await postingsWriter.write(line);
    };

    for (let bucket = 0; bucket < BUCKET_COUNT; bucket += 1) {
      const bucketPath = join(bucketDirectory, `bucket-${String(bucket).padStart(3, "0")}.ndjson`);
      try {
        await access(bucketPath);
      } catch {
        continue;
      }
      await processBucketV0_1({
        bucketPath,
        workDirectory,
        maxRunBytes: sortRunBytes,
        writePosting,
      });
    }
    if (currentKey !== undefined) {
      await directoryWriter.write(canonicalJsonLineV0_1(createDirectoryEntryV0_1({
        lookupKey: currentKey,
        postingByteOffset: currentPostingOffset,
        postingByteLength: currentPostingLength,
        postingCount: currentPostingCount,
      })));
      distinctLookupKeys += 1;
    }
    await postingsWriter.close();
    await directoryWriter.close();
    assert(postingsWritten > 0 && recordsProcessed === postingsWritten, "INDEX_RECORD_COUNT_MISMATCH");

    const directoryFile = await sha256File(directoryPath);
    const postingsFile = await sha256File(postingsPath);
    const adapter = {
      contractId: "OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
      contractSha256: "a359b0a8d6fe172b32937aed93690545adfc2403c40419209f358fc46d14ed02",
      implementationCommit: "4e37b56b9194983b836f85269033f916c6ae408d",
      implementationSha256: "2b8a41fd2c5cd8d7a11e8b157690d3e4b4dfd12ed44a1de48c5070347e11c28f",
    } as const;
    const identityPayload = createIdentityPayloadV0_1({
      sourceSnapshot: {
        expectedBytes: input.sourceIdentity.byteLength,
        expectedSha256: input.sourceIdentity.sha256,
      },
      adapter,
      files: [
        { path: "directory.ndjson", bytes: directoryFile.bytes, sha256: directoryFile.sha256 },
        { path: "postings.ndjson", bytes: postingsFile.bytes, sha256: postingsFile.sha256 },
      ],
    });
    const manifest: EnglishKaikkiDeterministicIndexManifestV0_1 = Object.freeze({
      schemaVersion: "open-instrument.english-kaikki-deterministic-index-manifest.v0.1",
      status: "PUBLISHED_AND_VERIFIED",
      contractId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1,
      indexSchema: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1,
      indexId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1,
      buildProcedureId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1,
      sourceSnapshot: Object.freeze({
        sourceFamilyId: ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
        snapshotId: ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
        expectedBytes: input.sourceIdentity.byteLength,
        expectedSha256: input.sourceIdentity.sha256,
      }),
      adapter: Object.freeze(adapter),
      files: Object.freeze([
        Object.freeze({ path: "directory.ndjson", bytes: directoryFile.bytes, sha256: directoryFile.sha256 }),
        Object.freeze({ path: "postings.ndjson", bytes: postingsFile.bytes, sha256: postingsFile.sha256 }),
      ]) as unknown as EnglishKaikkiDeterministicIndexManifestV0_1["files"],
      manifestSelfTreatment: "EXCLUDED_FROM_ARTIFACT_IDENTITY_AND_FILE_BINDINGS",
      artifactIdentity: Object.freeze({
        algorithm: "SHA-256",
        payload: "CANONICAL_JSON_IDENTITY_PAYLOAD_V0_1",
        sha256: artifactIdentitySha256V0_1(identityPayload),
        manifestSelfHashExcluded: true,
      }),
      counts: Object.freeze({
        recordsProcessed,
        postingsWritten,
        distinctLookupKeys,
      }),
      publication: Object.freeze({
        externalRelativePath: INDEX_RELATIVE_PATH,
        atomic: true,
        sourceImported: false,
        runtimeRegistered: false,
      }),
    });
    const manifestPath = join(tempRoot, "manifest.json");
    await writeFile(manifestPath, canonicalJsonLineV0_1(manifest));
    await rm(bucketDirectory, { recursive: true, force: true });
    await rm(workDirectory, { recursive: true, force: true });
    try {
      await access(input.indexPath);
      fail("EXISTING_FINAL_ARTIFACT_CONFLICT");
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code !== "ENOENT") throw error;
    }
    const verified = await verifyArtifactV0_1({
      indexPath: tempRoot,
      sourcePath: input.sourcePath,
      sourceIdentity: input.sourceIdentity,
    });
    await rename(tempRoot, input.indexPath);
    return Object.freeze({
      counts: Object.freeze({ recordsProcessed, postingsWritten, distinctLookupKeys, sourceRecordFailures }),
      manifest: verified.manifest,
      lookupProof: verified.lookupProof,
      indexPath: input.indexPath,
    });
  } catch (error) {
    await bucketWriters.close().catch(() => undefined);
    await rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

async function writeExecutionArtifactsV0_1(input: Readonly<{
  sourceIdentity: SourceIdentityV0_1;
  preflight: ResourcePreflightV0_1;
  counts: BuildCountsV0_1;
  manifest: EnglishKaikkiDeterministicIndexManifestV0_1;
  lookupProof: LookupProofV0_1;
}>): Promise<Readonly<{ resultSha256: string; manifestSha256: string }>> {
  const artifactDirectory = dirname(resolve(REPOSITORY_ROOT, EXECUTION_RESULT_RELATIVE_PATH));
  await mkdir(artifactDirectory, { recursive: true });
  const builderFile = await sha256File(resolve(REPOSITORY_ROOT, INDEX_BUILDER_RELATIVE_PATH));
  const moduleFile = await sha256File(resolve(REPOSITORY_ROOT, INDEX_MODULE_RELATIVE_PATH));
  const result = {
    schemaVersion: "open-instrument.english-kaikki-deterministic-index-build-execution-result.v0.1",
    buildProcedureId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1,
    repositoryBaselineHead: "093e1273ee241269c1b161325b65eacf685373e0",
    implementationBinding: "WORKING_TREE_DELTA_FROM_REPOSITORY_BASELINE_HEAD",
    indexContract: {
      id: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1,
      sha256: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_SHA256_V0_1,
    },
    sourceSnapshot: {
      sourceFamilyId: ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
      snapshotId: ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
      bytes: input.sourceIdentity.byteLength,
      sha256: input.sourceIdentity.sha256,
    },
    adapter: input.manifest.adapter,
    implementationArtifacts: {
      builder: { path: INDEX_BUILDER_RELATIVE_PATH, bytes: builderFile.bytes, sha256: builderFile.sha256 },
      module: { path: INDEX_MODULE_RELATIVE_PATH, bytes: moduleFile.bytes, sha256: moduleFile.sha256 },
    },
    firstAttempt: {
      result: "FAIL",
      failureCode: "ERR_USE_AFTER_CLOSE",
      failureStage: "EXTERNAL_RUN_MERGE",
      indexPublished: false,
    },
    repair: {
      classification: "READLINE_ASYNC_ITERATOR_OWNERSHIP_REPAIR",
      regression: "PASS",
      byteExactSourceReader: "PASS",
    },
    replacementBuildAttempt: 1,
    authoritativeBuildAttempts: 2,
    buildStartState: "SOURCE_IDENTITY_VERIFIED_RESOURCE_PREFLIGHT_PASS_NO_EXISTING_FINAL_ARTIFACT",
    buildResult: "PASS",
    resourcePreflight: input.preflight,
    counts: input.counts,
    generatedIndex: {
      externalRelativePath: INDEX_RELATIVE_PATH,
      directory: input.manifest.files[0],
      postings: input.manifest.files[1],
      manifest: { path: "manifest.json" },
      artifactIdentitySha256: input.manifest.artifactIdentity.sha256,
      publication: "ATOMIC_EXTERNAL_RENAME",
      verification: "PASS",
    },
    lookupProof: input.lookupProof,
    state: {
      sourceAcquired: true,
      sourceSnapshotVerified: true,
      sourceImported: false,
      adapterImplemented: true,
      deterministicIndexContractDefined: true,
      deterministicIndexContractFrozen: true,
      indexBuilderImplemented: true,
      indexBuildAttempts: 2,
      indexBuilt: true,
      indexVerified: true,
      indexPublishedExternal: true,
      indexLookupOfflineImplemented: true,
      indexLookupRuntimeImplemented: false,
      indexWiredToDiscovery: false,
      coverageEvaluated: false,
      runtimeAuthorized: false,
      runtimeChanged: false,
      s4: "NOT_STARTED",
      milestoneComplete: false,
      nextAction: "DEFINE_AND_FREEZE_ENGLISH_KAIKKI_INDEX_DISCOVERY_INTEGRATION_V0_1",
    },
  } as const;
  const resultBytes = canonicalJsonLineV0_1(result);
  const resultPath = resolve(REPOSITORY_ROOT, EXECUTION_RESULT_RELATIVE_PATH);
  await writeFile(resultPath, resultBytes);
  const resultHash = sha256FileBytes(resultBytes);
  const resultManifest = {
    schemaVersion: "open-instrument.english-kaikki-deterministic-index-build-execution-result-hash-manifest.v0.1",
    result: {
      path: EXECUTION_RESULT_RELATIVE_PATH,
      bytes: resultBytes.length,
      sha256: resultHash,
    },
    builder: { path: INDEX_BUILDER_RELATIVE_PATH, bytes: builderFile.bytes, sha256: builderFile.sha256 },
    module: { path: INDEX_MODULE_RELATIVE_PATH, bytes: moduleFile.bytes, sha256: moduleFile.sha256 },
  } as const;
  const resultManifestBytes = canonicalJsonLineV0_1(resultManifest);
  const resultManifestPath = resolve(REPOSITORY_ROOT, EXECUTION_RESULT_MANIFEST_RELATIVE_PATH);
  await writeFile(resultManifestPath, resultManifestBytes);
  return Object.freeze({
    resultSha256: resultHash,
    manifestSha256: sha256FileBytes(resultManifestBytes),
  });
}

async function main(): Promise<void> {
  await verifyFrozenAuthorityV0_1();
  const paths = await resolveExternalPathsV0_1();
  const existingFinalState = await inspectExistingFinalV0_1(paths.indexPath);
  assert(existingFinalState === "ABSENT", "EXISTING_FINAL_ARTIFACT_PRESENT_REQUIRES_VERIFICATION_BEFORE_REUSE");
  const sourceIdentity = await hashAndCountSourceV0_1(paths.sourcePath);
  assert(sourceIdentity.byteLength === ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1.byteLength, "SOURCE_IDENTITY_MISMATCH_BYTES");
  assert(sourceIdentity.sha256 === ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1.sha256, "SOURCE_IDENTITY_MISMATCH_SHA256");
  const preflight = await resourcePreflightV0_1(paths.externalRoot, sourceIdentity);
  if (process.argv.includes("--preflight-only")) {
    console.log(JSON.stringify({
      source: { bytes: sourceIdentity.byteLength, sha256: sourceIdentity.sha256, physicalRecordCount: sourceIdentity.physicalRecordCount },
      preflight,
      existingFinalState,
      authoritativeBuildStarted: false,
    }, null, 2));
    return;
  }
  const built = await buildIndexV0_1({ ...paths, sourceIdentity, preflight });
  const executionArtifacts = await writeExecutionArtifactsV0_1({
    sourceIdentity,
    preflight,
    counts: built.counts,
    manifest: built.manifest,
    lookupProof: built.lookupProof,
  });
  console.log(JSON.stringify({
    source: { bytes: sourceIdentity.byteLength, sha256: sourceIdentity.sha256, physicalRecordCount: sourceIdentity.physicalRecordCount },
    preflight,
    build: built.counts,
    index: { relativePath: INDEX_RELATIVE_PATH, artifactIdentitySha256: built.manifest.artifactIdentity.sha256, verification: "PASS" },
    lookupProof: built.lookupProof,
    executionResult: { path: EXECUTION_RESULT_RELATIVE_PATH, sha256: executionArtifacts.resultSha256 },
    executionResultManifest: { path: EXECUTION_RESULT_MANIFEST_RELATIVE_PATH, sha256: executionArtifacts.manifestSha256 },
  }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exitCode = 1;
  });
}

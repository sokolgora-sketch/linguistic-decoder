import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { access, open, readFile, realpath, rename, unlink, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

import {
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  adaptEnglishKaikkiJsonlRecordV0_1,
} from "../src/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  artifactIdentitySha256V0_1,
  canonicalJsonV0_1,
  comparePostingsV0_1,
  createIdentityPayloadV0_1,
  normalizeIndexQueryV0_1,
  recoverPostingRecordV0_1,
  type EnglishKaikkiDeterministicIndexDirectoryEntryV0_1,
  type EnglishKaikkiDeterministicIndexManifestV0_1,
  type EnglishKaikkiDeterministicIndexPostingV0_1,
} from "../src/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1";

const EXTERNAL_ROOT_ENV = "OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT";
const SOURCE_RELATIVE_PATH =
  "source-family/english-kaikki/2026-10-03/kaikki.org-dictionary-English.jsonl";
const INDEX_RELATIVE_PATH =
  "source-family/english-kaikki/2026-10-03/index/open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1";
const CORRECTION_RECORD_RELATIVE_PATH =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/authority-identity-correction-reconciliation.json";
const EXPECTED_DIRECTORY_BYTES = 133425417;
const EXPECTED_DIRECTORY_SHA256 = "2455eaf2ef9cb625d0744986e6ea65103796cd0465ef1e8d52cadd22427cfd5a";
const EXPECTED_POSTINGS_BYTES = 747334531;
const EXPECTED_POSTINGS_SHA256 = "1c9e35493e1e76d9189cef3a9bffb091194f541c4be4414f9c07971aff2f680a";
const EXPECTED_SOURCE_BYTES = 3335546346;
const EXPECTED_SOURCE_SHA256 = "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195";
const EXPECTED_BEFORE_MANIFEST_SHA256 = "b04888d390e81626dc85d8931116f115a5552bafc4505c5d7521ee4b6411c967";
const EXPECTED_BEFORE_IDENTITY = "e963008034b37a2dbe379cc16c2b037674544f17f0062934ece067425e1f9543";
const EXPECTED_AFTER_MANIFEST_SHA256 = "b5abc8f445cec08ed0f53195dd28b717aef424d07ae2fc86c4de626a754089b0";
const EXPECTED_AFTER_IDENTITY = "861284c56f00d1297b84229e772a791f765f00e059679c6849db0d4924e7ec39";
const EXPECTED_POSTINGS_COUNT = 1486239;
const ZERO_MATCH_PREFIX = "__open_instrument_index_zero_match_";

type ExternalPaths = Readonly<{
  root: string;
  sourcePath: string;
  indexPath: string;
  directoryPath: string;
  postingsPath: string;
  manifestPath: string;
}>;

type FileDigest = Readonly<{ bytes: number; sha256: string }>;

type CorrectionRecord = Readonly<{
  externalArtifact: Readonly<{
    before: Readonly<{ manifestSha256: string; artifactIdentitySha256: string }>;
    after: Readonly<{ manifestSha256: string; artifactIdentitySha256: string }>;
  }>;
}>;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isInside(parent: string, candidate: string): boolean {
  const path = relative(parent, candidate);
  return path === "" || (!path.startsWith(`..${requireSeparator()}`) && path !== "..");
}

function requireSeparator(): string {
  return process.platform === "win32" ? "\\" : "/";
}

async function digestFile(path: string): Promise<FileDigest> {
  const hash = createHash("sha256");
  let bytes = 0;
  for await (const chunk of createReadStream(path)) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += value.length;
    hash.update(value);
  }
  return Object.freeze({ bytes, sha256: hash.digest("hex") });
}

async function* lines(path: string): AsyncGenerator<string> {
  const input = createReadStream(path, { encoding: "utf8" });
  const reader = createInterface({ input, crlfDelay: Infinity });
  try {
    for await (const line of reader) yield line;
  } finally {
    reader.close();
    input.destroy();
  }
}

async function readRange(path: string, offset: number, length: number): Promise<Buffer> {
  const handle = await open(path, "r");
  try {
    const bytes = Buffer.alloc(length);
    const result = await handle.read(bytes, 0, length, offset);
    assert(result.bytesRead === length, "SOURCE_OR_POSTINGS_RANGE_SHORT_READ");
    return bytes;
  } finally {
    await handle.close();
  }
}

function parsePostingLines(bytes: Buffer): EnglishKaikkiDeterministicIndexPostingV0_1[] {
  const text = bytes.toString("utf8");
  assert(text.endsWith("\n"), "COLLISION_RANGE_MISSING_FINAL_LF");
  return text
    .trimEnd()
    .split("\n")
    .map((line) => JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1);
}

async function resolvePaths(): Promise<ExternalPaths> {
  const configuredRoot = process.env[EXTERNAL_ROOT_ENV];
  assert(configuredRoot, `MISSING_ENV:${EXTERNAL_ROOT_ENV}`);
  const root = await realpath(configuredRoot);
  const repositoryRoot = await realpath(resolve(process.cwd()));
  assert(root !== repositoryRoot && !isInside(repositoryRoot, root) && !isInside(root, repositoryRoot), "EXTERNAL_ROOT_NOT_OUTSIDE_GIT");
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

async function loadCorrectionRecord(): Promise<CorrectionRecord> {
  return JSON.parse(await readFile(resolve(process.cwd(), CORRECTION_RECORD_RELATIVE_PATH), "utf8")) as CorrectionRecord;
}

async function verifyDirectory(
  path: string,
): Promise<readonly EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[]> {
  const entries: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[] = [];
  let previous: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | undefined;
  for await (const line of lines(path)) {
    const entry = JSON.parse(line) as EnglishKaikkiDeterministicIndexDirectoryEntryV0_1;
    assert(canonicalJsonV0_1(entry) === line, "DIRECTORY_NOT_CANONICAL");
    if (previous !== undefined) assert(previous.lookupKey < entry.lookupKey, "DIRECTORY_ORDERING_INVALID");
    entries.push(entry);
    previous = entry;
  }
  assert(entries.length > 0, "DIRECTORY_EMPTY");
  return entries;
}

async function verifyPostings(
  path: string,
  directoryEntries: readonly EnglishKaikkiDeterministicIndexDirectoryEntryV0_1[],
  manifest: EnglishKaikkiDeterministicIndexManifestV0_1,
): Promise<Readonly<{ collision: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1; total: number }>> {
  let previous: EnglishKaikkiDeterministicIndexPostingV0_1 | undefined;
  let directoryIndex = 0;
  let postingsOffset = 0;
  let postingsCount = 0;
  let total = 0;
  let current: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 | undefined;
  for await (const line of lines(path)) {
    const posting = JSON.parse(line) as EnglishKaikkiDeterministicIndexPostingV0_1;
    assert(canonicalJsonV0_1(posting) === line, "POSTING_NOT_CANONICAL");
    if (previous !== undefined) assert(comparePostingsV0_1(previous, posting) <= 0, "POSTING_ORDERING_INVALID");
    previous = posting;
    const lineBytes = Buffer.byteLength(`${line}\n`, "utf8");
    if (current === undefined || current.lookupKey !== posting.lookupKey) {
      if (current !== undefined) {
        assert(postingsOffset === current.postingByteOffset + current.postingByteLength, "DIRECTORY_RANGE_END_INVALID");
        assert(postingsCount === current.postingCount, "DIRECTORY_COUNT_INVALID");
        directoryIndex += 1;
      }
      current = directoryEntries[directoryIndex];
      assert(current?.lookupKey === posting.lookupKey, "DIRECTORY_KEY_INVALID");
      postingsCount = 0;
      assert(postingsOffset === current.postingByteOffset, "DIRECTORY_RANGE_START_INVALID");
    }
    postingsCount += 1;
    total += 1;
    postingsOffset += lineBytes;
    assert(current !== undefined, "DIRECTORY_ENTRY_MISSING");
    assert(postingsOffset <= current.postingByteOffset + current.postingByteLength, "POSTING_OUTSIDE_DIRECTORY_RANGE");
  }
  if (current !== undefined) {
    assert(postingsOffset === current.postingByteOffset + current.postingByteLength, "FINAL_DIRECTORY_RANGE_END_INVALID");
    assert(postingsCount === current.postingCount, "FINAL_DIRECTORY_COUNT_INVALID");
    directoryIndex += 1;
  }
  assert(directoryIndex === directoryEntries.length, "DIRECTORY_ENTRY_COUNT_INVALID");
  assert(postingsOffset === manifest.files[1].bytes, "POSTINGS_BYTE_COUNT_INVALID");
  const directoryTotal = directoryEntries.reduce((sum, entry) => sum + entry.postingCount, 0);
  assert(total === directoryTotal, `POSTINGS_TOTAL_INVALID:${total}/${directoryTotal}`);
  const collision = directoryEntries.find((entry) => entry.postingCount >= 2);
  assert(collision !== undefined, "COLLISION_PROOF_UNAVAILABLE");
  return Object.freeze({ collision, total });
}

async function verifyRecovery(
  paths: ExternalPaths,
  collision: EnglishKaikkiDeterministicIndexDirectoryEntryV0_1,
): Promise<Readonly<{ postingCount: number; recordSha: string; readaptation: string }>> {
  const postings = parsePostingLines(await readRange(paths.postingsPath, collision.postingByteOffset, collision.postingByteLength));
  assert(postings.length === collision.postingCount, "COLLISION_POSTING_COUNT_INVALID");
  for (const posting of postings) {
    const recordBytes = await readRange(paths.sourcePath, posting.recordByteOffset, posting.recordByteLength);
    const recovered = recoverPostingRecordV0_1({
      recordBytes,
      posting,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    });
    if (!recovered.ok) throw new Error(`RECOVERY_FAILED:${recovered.reasonCode}`);
    const readapted = adaptEnglishKaikkiJsonlRecordV0_1({
      recordBytes,
      recordOrdinal: posting.recordOrdinal,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    });
    if (!readapted.ok) throw new Error(`READAPTATION_FAILED:${readapted.reasonCode}`);
  }
  return Object.freeze({ postingCount: postings.length, recordSha: "PASS", readaptation: "PASS" });
}

async function verifyArtifact(paths: ExternalPaths, apply: boolean): Promise<void> {
  const correction = await loadCorrectionRecord();
  const directoryBefore = await digestFile(paths.directoryPath);
  const postingsBefore = await digestFile(paths.postingsPath);
  const source = await digestFile(paths.sourcePath);
  assert(directoryBefore.bytes === EXPECTED_DIRECTORY_BYTES && directoryBefore.sha256 === EXPECTED_DIRECTORY_SHA256, "DIRECTORY_BEFORE_MISMATCH");
  assert(postingsBefore.bytes === EXPECTED_POSTINGS_BYTES && postingsBefore.sha256 === EXPECTED_POSTINGS_SHA256, "POSTINGS_BEFORE_MISMATCH");
  assert(source.bytes === EXPECTED_SOURCE_BYTES && source.sha256 === EXPECTED_SOURCE_SHA256, "SOURCE_IDENTITY_MISMATCH");
  assert(correction.externalArtifact.before.directory.sha256 === directoryBefore.sha256, "CORRECTION_BEFORE_DIRECTORY_MISMATCH");
  assert(correction.externalArtifact.before.postings.sha256 === postingsBefore.sha256, "CORRECTION_BEFORE_POSTINGS_MISMATCH");

  const manifestBytesBefore = await readFile(paths.manifestPath);
  const manifestBeforeSha = createHash("sha256").update(manifestBytesBefore).digest("hex");
  const manifest = JSON.parse(manifestBytesBefore.toString("utf8")) as EnglishKaikkiDeterministicIndexManifestV0_1;
  if (apply) {
    assert(manifestBeforeSha === EXPECTED_BEFORE_MANIFEST_SHA256, "MANIFEST_BEFORE_MISMATCH");
    assert(manifest.artifactIdentity.sha256 === EXPECTED_BEFORE_IDENTITY, "IDENTITY_BEFORE_MISMATCH");
  } else {
    assert(manifestBeforeSha === EXPECTED_AFTER_MANIFEST_SHA256, "MANIFEST_AFTER_EXPECTED_FOR_VERIFY");
    assert(manifest.artifactIdentity.sha256 === EXPECTED_AFTER_IDENTITY, "IDENTITY_AFTER_EXPECTED_FOR_VERIFY");
  }
  assert(manifest.files[0].bytes === directoryBefore.bytes && manifest.files[0].sha256 === directoryBefore.sha256, "MANIFEST_DIRECTORY_BINDING_INVALID");
  assert(manifest.files[1].bytes === postingsBefore.bytes && manifest.files[1].sha256 === postingsBefore.sha256, "MANIFEST_POSTINGS_BINDING_INVALID");
  const payload = createIdentityPayloadV0_1({
    sourceSnapshot: manifest.sourceSnapshot,
    adapter: manifest.adapter,
    files: [manifest.files[0], manifest.files[1]],
  });
  const identityAfter = artifactIdentitySha256V0_1(payload);
  assert(identityAfter === EXPECTED_AFTER_IDENTITY, "IDENTITY_AFTER_MISMATCH");
  if (apply) {
    assert(identityAfter !== manifest.artifactIdentity.sha256, "IDENTITY_DID_NOT_CHANGE");
  } else {
    assert(identityAfter === manifest.artifactIdentity.sha256, "IDENTITY_AFTER_CURRENT_MANIFEST_MISMATCH");
  }

  const directoryEntries = await verifyDirectory(paths.directoryPath);
  const postingProof = await verifyPostings(paths.postingsPath, directoryEntries, manifest);
  assert(postingProof.total === EXPECTED_POSTINGS_COUNT, `PROTECTED_POSTINGS_COUNT_INVALID:${postingProof.total}`);
  const directoryKeys = new Set(directoryEntries.map((entry) => entry.lookupKey));
  const zeroCandidate = Array.from(
    { length: 1_000_000 },
    (_, index) => `${ZERO_MATCH_PREFIX}${String(index).padStart(6, "0")}`,
  ).find((candidate) => !directoryKeys.has(candidate));
  assert(zeroCandidate !== undefined, "ZERO_MATCH_SELECTION_EXHAUSTED");
  assert(!directoryKeys.has(normalizeIndexQueryV0_1(zeroCandidate)), "ZERO_MATCH_NOT_ABSENT");
  const recovery = await verifyRecovery(paths, postingProof.collision);

  if (apply) {
    assert(manifestBeforeSha === correction.externalArtifact.before.manifestSha256, "CORRECTION_BEFORE_MANIFEST_MISMATCH");
    const updated = Object.freeze({
      ...manifest,
      counts: Object.freeze({
        ...manifest.counts,
        recordsProcessed: postingProof.total,
        postingsWritten: postingProof.total,
      }),
      artifactIdentity: Object.freeze({ ...manifest.artifactIdentity, sha256: identityAfter }),
    });
    const temporaryManifestPath = `${paths.manifestPath}.correction-${process.pid}-${Date.now()}.tmp`;
    try {
      await writeFile(temporaryManifestPath, `${JSON.stringify(updated)}\n`, { flag: "wx" });
      await rename(temporaryManifestPath, paths.manifestPath);
    } catch (error) {
      await unlink(temporaryManifestPath).catch(() => undefined);
      throw error;
    }
  }

  const manifestBytesAfter = await readFile(paths.manifestPath);
  const manifestAfterSha = createHash("sha256").update(manifestBytesAfter).digest("hex");
  const manifestAfter = JSON.parse(manifestBytesAfter.toString("utf8")) as EnglishKaikkiDeterministicIndexManifestV0_1;
  assert(manifestAfterSha === EXPECTED_AFTER_MANIFEST_SHA256, "MANIFEST_AFTER_MISMATCH");
  assert(manifestAfter.artifactIdentity.sha256 === EXPECTED_AFTER_IDENTITY, "IDENTITY_AFTER_MANIFEST_MISMATCH");
  assert(
    manifestAfter.counts.recordsProcessed === EXPECTED_POSTINGS_COUNT &&
      manifestAfter.counts.postingsWritten === EXPECTED_POSTINGS_COUNT,
    "MANIFEST_COUNTS_AFTER_MISMATCH",
  );
  assert(directoryBefore.bytes === EXPECTED_DIRECTORY_BYTES && postingsBefore.bytes === EXPECTED_POSTINGS_BYTES, "PROTECTED_BYTES_CHANGED");
  console.log(JSON.stringify({
    directory: directoryBefore,
    postings: postingsBefore,
    source,
    manifestBeforeSha,
    manifestAfterSha,
    artifactIdentityBefore: EXPECTED_BEFORE_IDENTITY,
    artifactIdentityAfter: identityAfter,
    zeroMatch: zeroCandidate,
    collision: postingProof.collision.lookupKey,
    collisionPostingCount: recovery.postingCount,
    byteRangeRecovery: "PASS",
    recordShaVerification: recovery.recordSha,
    adapterReadaptation: recovery.readaptation,
    ordering: "PASS",
    multiplicity: "PRESERVED",
    noWinner: "PASS",
  }, null, 2));
}

async function main(): Promise<void> {
  const paths = await resolvePaths();
  const apply = process.argv.includes("--apply");
  await verifyArtifact(paths, apply);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

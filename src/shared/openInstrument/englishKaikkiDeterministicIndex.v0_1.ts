import { createHash } from "node:crypto";
import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
  ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
  type EnglishKaikkiSourceRecordV0_1,
  type EnglishKaikkiVerifiedSnapshotIdentityV0_1,
} from "./englishKaikkiSourceFamilyAdapter.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "./englishLexicalSenseSourceContract.v0_1";

export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1" as const;
export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1 =
  "0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8" as const;
export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1 =
  "c108f82172dcf87c786e2e9baebccc3ffaf6d3430c0b55b30018d626abe153cf" as const;
export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1 =
  "open-instrument.english-kaikki-deterministic-index.v0.1" as const;
export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1 =
  "open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1" as const;
export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1 =
  "open-instrument.english-kaikki-deterministic-index-build.v0.1" as const;

export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_FILES_V0_1 = Object.freeze([
  "directory.ndjson",
  "postings.ndjson",
  "manifest.json",
] as const);

export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_POSTING_FIELDS_V0_1 =
  Object.freeze([
    "lookupKey",
    "sourceRecordId",
    "entryLocator",
    "recordOrdinal",
    "recordByteOffset",
    "recordByteLength",
    "recordSha256",
  ] as const);

export const ENGLISH_KAIKKI_DETERMINISTIC_INDEX_DIRECTORY_FIELDS_V0_1 =
  Object.freeze([
    "lookupKey",
    "postingByteOffset",
    "postingByteLength",
    "postingCount",
  ] as const);

export type EnglishKaikkiDeterministicIndexPostingV0_1 = Readonly<{
  lookupKey: string;
  sourceRecordId: string;
  entryLocator: string;
  recordOrdinal: number;
  recordByteOffset: number;
  recordByteLength: number;
  recordSha256: string;
}>;

export type EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 = Readonly<{
  lookupKey: string;
  postingByteOffset: number;
  postingByteLength: number;
  postingCount: number;
}>;

export type EnglishKaikkiDeterministicIndexFileBindingV0_1 = Readonly<{
  path: (typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_FILES_V0_1)[number];
  bytes: number;
  sha256: string;
}>;

export type EnglishKaikkiDeterministicIndexIdentityPayloadV0_1 = Readonly<{
  schemaVersion: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1;
  indexId: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1;
  indexContractId: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1;
  indexContractVersion: "v0.1";
  indexContractSha256: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1;
  sourceSnapshot: Readonly<{
    sourceFamilyId: typeof ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1;
    snapshotId: typeof ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1;
    expectedBytes: number;
    expectedSha256: string;
  }>;
  adapter: Readonly<{
    contractId: string;
    contractSha256: string;
    implementationCommit: string;
    implementationSha256: string;
  }>;
  buildProcedureId: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1;
  files: readonly [
    EnglishKaikkiDeterministicIndexFileBindingV0_1,
    EnglishKaikkiDeterministicIndexFileBindingV0_1,
  ];
}>;

export type EnglishKaikkiDeterministicIndexManifestV0_1 = Readonly<{
  schemaVersion: "open-instrument.english-kaikki-deterministic-index-manifest.v0.1";
  status: "PUBLISHED_AND_VERIFIED";
  contractId: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1;
  indexSchema: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1;
  indexId: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1;
  buildProcedureId: typeof ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1;
  sourceSnapshot: Readonly<{
    sourceFamilyId: typeof ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1;
    snapshotId: typeof ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1;
    expectedBytes: number;
    expectedSha256: string;
  }>;
  adapter: Readonly<{
    contractId: string;
    contractSha256: string;
    implementationCommit: string;
    implementationSha256: string;
  }>;
  files: readonly [
    EnglishKaikkiDeterministicIndexFileBindingV0_1,
    EnglishKaikkiDeterministicIndexFileBindingV0_1,
  ];
  manifestSelfTreatment: "EXCLUDED_FROM_ARTIFACT_IDENTITY_AND_FILE_BINDINGS";
  artifactIdentity: Readonly<{
    algorithm: "SHA-256";
    payload: "CANONICAL_JSON_IDENTITY_PAYLOAD_V0_1";
    sha256: string;
    manifestSelfHashExcluded: true;
  }>;
  counts: Readonly<{
    recordsProcessed: number;
    postingsWritten: number;
    distinctLookupKeys: number;
  }>;
  publication: Readonly<{
    externalRelativePath: string;
    atomic: true;
    sourceImported: false;
    runtimeRegistered: false;
  }>;
}>;

export type EnglishKaikkiDeterministicIndexLookupFailureV0_1 = Readonly<{
  ok: false;
  status:
    | "VALID_NULL"
    | "SOURCE_FAILURE"
    | "INDEX_FAILURE"
    | "INDEX_LOOKUP_INVALID_QUERY";
  reasonCode: string;
  queryForm: string | null;
  records: readonly [];
}>;

export function canonicalJsonStringV0_1(value: string): string {
  let output = '"';
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (Number.isNaN(next) || next < 0xdc00 || next > 0xdfff) {
        throw new Error("CANONICAL_JSON_UNPAIRED_SURROGATE");
      }
      output += value[index] + value[index + 1];
      index += 1;
      continue;
    }
    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new Error("CANONICAL_JSON_UNPAIRED_SURROGATE");
    }
    if (codeUnit === 0x22) {
      output += '\\"';
    } else if (codeUnit === 0x5c) {
      output += "\\\\";
    } else if (codeUnit <= 0x1f) {
      output += `\\u${codeUnit.toString(16).padStart(4, "0")}`;
    } else {
      output += value[index];
    }
  }
  return `${output}"`;
}

type CanonicalJsonValueV0_1 =
  | null
  | boolean
  | number
  | string
  | readonly CanonicalJsonValueV0_1[]
  | { readonly [key: string]: CanonicalJsonValueV0_1 };

export function canonicalJsonV0_1(value: CanonicalJsonValueV0_1): string {
  if (value === null) return "null";
  if (typeof value === "string") return canonicalJsonStringV0_1(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isSafeInteger(value)) {
      throw new Error("CANONICAL_JSON_NUMBER_NOT_SAFE_INTEGER");
    }
    return Object.is(value, -0) ? "0" : String(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJsonV0_1).join(",")}]`;
  }
  const entries = Object.entries(value).map(
    ([key, child]) => `${canonicalJsonStringV0_1(key)}:${canonicalJsonV0_1(child)}`,
  );
  return `{${entries.join(",")}}`;
}

export function canonicalJsonLineV0_1(value: CanonicalJsonValueV0_1): Buffer {
  return Buffer.from(`${canonicalJsonV0_1(value)}\n`, "utf8");
}

export function sha256BytesV0_1(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function compareUtf8BytesV0_1(left: string, right: string): number {
  return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

export function comparePostingsV0_1(
  left: EnglishKaikkiDeterministicIndexPostingV0_1,
  right: EnglishKaikkiDeterministicIndexPostingV0_1,
): number {
  return (
    compareUtf8BytesV0_1(left.lookupKey, right.lookupKey) ||
    left.recordOrdinal - right.recordOrdinal ||
    compareUtf8BytesV0_1(left.sourceRecordId, right.sourceRecordId)
  );
}

export function sortPostingsV0_1(
  postings: readonly EnglishKaikkiDeterministicIndexPostingV0_1[],
): EnglishKaikkiDeterministicIndexPostingV0_1[] {
  return [...postings].sort(comparePostingsV0_1);
}

export function firstUtf8ByteV0_1(value: string): number {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length === 0) throw new Error("INDEX_EMPTY_LOOKUP_KEY");
  return bytes[0];
}

export function createPostingV0_1(input: Readonly<{
  sourceRecord: EnglishKaikkiSourceRecordV0_1;
  recordByteOffset: number;
  recordByteLength: number;
}>): EnglishKaikkiDeterministicIndexPostingV0_1 {
  return Object.freeze({
    lookupKey: input.sourceRecord.queryForm,
    sourceRecordId: input.sourceRecord.sourceRecordId,
    entryLocator: input.sourceRecord.entryLocator,
    recordOrdinal: input.sourceRecord.recordOrdinal,
    recordByteOffset: input.recordByteOffset,
    recordByteLength: input.recordByteLength,
    recordSha256: input.sourceRecord.recordSha256,
  });
}

export function createDirectoryEntryV0_1(input: Readonly<{
  lookupKey: string;
  postingByteOffset: number;
  postingByteLength: number;
  postingCount: number;
}>): EnglishKaikkiDeterministicIndexDirectoryEntryV0_1 {
  return Object.freeze({
    lookupKey: input.lookupKey,
    postingByteOffset: input.postingByteOffset,
    postingByteLength: input.postingByteLength,
    postingCount: input.postingCount,
  });
}

export function createIdentityPayloadV0_1(input: Readonly<{
  sourceSnapshot: Readonly<{
    expectedBytes: number;
    expectedSha256: string;
  }>;
  adapter: Readonly<{
    contractId: string;
    contractSha256: string;
    implementationCommit: string;
    implementationSha256: string;
  }>;
  files: readonly [
    EnglishKaikkiDeterministicIndexFileBindingV0_1,
    EnglishKaikkiDeterministicIndexFileBindingV0_1,
  ];
}>): EnglishKaikkiDeterministicIndexIdentityPayloadV0_1 {
  return Object.freeze({
    schemaVersion: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1,
    indexId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1,
    indexContractId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1,
    indexContractVersion: "v0.1",
    indexContractSha256: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1,
    sourceSnapshot: Object.freeze({
      sourceFamilyId: ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
      snapshotId: ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
      expectedBytes: input.sourceSnapshot.expectedBytes,
      expectedSha256: input.sourceSnapshot.expectedSha256,
    }),
    adapter: Object.freeze({ ...input.adapter }),
    buildProcedureId: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_BUILD_PROCEDURE_ID_V0_1,
    files: Object.freeze([
      Object.freeze({ ...input.files[0] }),
      Object.freeze({ ...input.files[1] }),
    ]) as unknown as EnglishKaikkiDeterministicIndexIdentityPayloadV0_1["files"],
  });
}

export function artifactIdentitySha256V0_1(
  payload: EnglishKaikkiDeterministicIndexIdentityPayloadV0_1,
): string {
  return sha256BytesV0_1(Buffer.from(canonicalJsonV0_1(payload), "utf8"));
}

export function normalizeIndexQueryV0_1(query: string): string {
  return normalizeEnglishLexicalJoinKeyV0_1(query);
}

export function recoverPostingRecordV0_1(input: Readonly<{
  recordBytes: Uint8Array;
  posting: EnglishKaikkiDeterministicIndexPostingV0_1;
  verifiedSnapshot: EnglishKaikkiVerifiedSnapshotIdentityV0_1;
}>):
  | { ok: true; sourceRecord: EnglishKaikkiSourceRecordV0_1 }
  | EnglishKaikkiDeterministicIndexLookupFailureV0_1 {
  const observedSha256 = sha256BytesV0_1(input.recordBytes);
  if (observedSha256 !== input.posting.recordSha256) {
    return Object.freeze({
      ok: false,
      status: "SOURCE_FAILURE",
      reasonCode: "SOURCE_RECORD_HASH_MISMATCH",
      queryForm: input.posting.lookupKey,
      records: Object.freeze([]) as readonly [],
    });
  }
  const adapted = adaptEnglishKaikkiJsonlRecordV0_1({
    recordBytes: input.recordBytes,
    recordOrdinal: input.posting.recordOrdinal,
    verifiedSnapshot: input.verifiedSnapshot,
  });
  if (!adapted.ok) {
    return Object.freeze({
      ok: false,
      status: "SOURCE_FAILURE",
      reasonCode: adapted.reasonCode,
      queryForm: input.posting.lookupKey,
      records: Object.freeze([]) as readonly [],
    });
  }
  if (
    adapted.record.queryForm !== input.posting.lookupKey ||
    adapted.record.sourceRecordId !== input.posting.sourceRecordId ||
    adapted.record.entryLocator !== input.posting.entryLocator
  ) {
    return Object.freeze({
      ok: false,
      status: "INDEX_FAILURE",
      reasonCode: "INDEX_POSTING_RECOVERY_BINDING_MISMATCH",
      queryForm: input.posting.lookupKey,
      records: Object.freeze([]) as readonly [],
    });
  }
  return Object.freeze({ ok: true, sourceRecord: adapted.record });
}

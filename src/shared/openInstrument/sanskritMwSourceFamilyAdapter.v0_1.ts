import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createInterface } from "node:readline";

export const SANSKRIT_MW_SOURCE_FAMILY_ADAPTER_ID_V0_1 =
  "open-instrument.sanskrit-mw-source-family-adapter.v0_1" as const;

export const SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1 = "sanskrit-mw" as const;

export const SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1 =
  "cdsl-monier-williams-1899" as const;

export const SANSKRIT_MW_SNAPSHOT_ID_V0_1 =
  "open-instrument.sanskrit-mw.snapshot.1899-cdsl-csl-orig-55e8addb.v0_1" as const;

export const SANSKRIT_MW_SOURCE_TITLE_V0_1 =
  "Monier-Williams Sanskrit-English Dictionary" as const;

export const SANSKRIT_MW_SOURCE_DATE_OR_VERSION_V0_1 =
  "Oxford 1899; CDSL digital edition; csl-orig@55e8addbd96e8d9001b8789026b026763f4049c1" as const;

export const SANSKRIT_MW_SOURCE_URL_V0_1 =
  "https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/55e8addbd96e8d9001b8789026b026763f4049c1/v02/mw/mw.txt" as const;

export const SANSKRIT_MW_SOURCE_ARTIFACT_PATH_V0_1 = "v02/mw/mw.txt" as const;
export const SANSKRIT_MW_SOURCE_ARTIFACT_BYTES_V0_1 = 50163993 as const;
export const SANSKRIT_MW_SOURCE_ARTIFACT_SHA256_V0_1 =
  "555ecf5aadaaf21e5965d6b3b419f428fc9ab9237f563627001ceca468d0cff8" as const;
export const SANSKRIT_MW_SOURCE_UPSTREAM_REVISION_V0_1 =
  "55e8addbd96e8d9001b8789026b026763f4049c1" as const;
export const SANSKRIT_MW_SOURCE_EXPECTED_RECORD_COUNT_V0_1 = 286525 as const;
export const SANSKRIT_MW_EXTERNAL_RELATIVE_PATH_V0_1 =
  "source-family/sanskrit-mw/1899-cdsl-csl-orig-55e8addb/mw.txt" as const;

export type SanskritMwVerifiedSnapshotIdentityV0_1 = Readonly<{
  byteLength: number;
  sha256: string;
}>;

export type SanskritMwSourceRecordV0_1 = Readonly<{
  sourceFamilyId: typeof SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1;
  sourceTraditionId: typeof SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1;
  snapshotId: typeof SANSKRIT_MW_SNAPSHOT_ID_V0_1;
  snapshotIdentity: SanskritMwVerifiedSnapshotIdentityV0_1;
  recordOrdinal: number;
  sourceOrdering: number;
  sourceRecordId: string;
  entryLocator: string;
  l: string;
  pc: string;
  k1: string;
  k2: string;
  h: string | null;
  e: string;
  rawEntryMetadata: string;
  sourceForm: string;
  lookupForm: string;
  displayForm: string;
  language: "Sanskrit";
  languageVariety: null;
  representation: "SLP1";
  sourceFormNormalization: "EXACT_PRESERVED";
  evidenceFamily: "lexical_dictionary";
  attestationTruth: "fact";
  sourceStatus: "research_candidate";
  sourceTitle: typeof SANSKRIT_MW_SOURCE_TITLE_V0_1;
  sourceDateOrVersion: typeof SANSKRIT_MW_SOURCE_DATE_OR_VERSION_V0_1;
  sourceUrlOrArchiveRef: typeof SANSKRIT_MW_SOURCE_URL_V0_1;
  sourceHashOrArchiveHash: `sha256:${typeof SANSKRIT_MW_SOURCE_ARTIFACT_SHA256_V0_1}`;
  license: "CC BY-SA 4.0";
  attribution: "Monier-Williams; Cologne Digital Sanskrit Dictionaries";
  pronunciation: null;
  voicePath: null;
  gamma: null;
  zc: null;
}>;

export type SanskritMwSourceRecordAdapterResultV0_1 = Readonly<
  | { ok: true; record: SanskritMwSourceRecordV0_1 }
  | {
      ok: false;
      reasonCode: "SOURCE_ADAPTER_FAILURE" | "SOURCE_RECORD_INVALID";
    }
>;

export type SanskritMwLookupResultV0_1 = Readonly<
  | {
      status: "MATCHES_FOUND";
      lookupForm: string;
      records: readonly SanskritMwSourceRecordV0_1[];
    }
  | {
      status: "SANSKRIT_SOURCE_NOT_FOUND";
      lookupForm: string;
      records: readonly [];
    }
>;

export type SanskritMwSourceFamilyAdapterV0_1 = Readonly<{
  adapterId: typeof SANSKRIT_MW_SOURCE_FAMILY_ADAPTER_ID_V0_1;
  sourceFamilyId: typeof SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1;
  sourceTraditionId: typeof SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1;
  enabledByDefault: false;
  runtimeActiveAfterMerge: false;
  candidateVoicePathPolicy: "NULL_UNAUTHORIZED";
  queryExact: (lookupForm: string) => SanskritMwLookupResultV0_1;
}>;

export type SanskritMwSnapshotValidationResultV0_1 = Readonly<
  | {
      ok: true;
      byteLength: typeof SANSKRIT_MW_SOURCE_ARTIFACT_BYTES_V0_1;
      sha256: typeof SANSKRIT_MW_SOURCE_ARTIFACT_SHA256_V0_1;
    }
  | {
      ok: false;
      reasonCode: "SOURCE_ADAPTER_FAILURE" | "SOURCE_IDENTITY_MISMATCH";
      observed: Readonly<{ byteLength: number; sha256: string | null }>;
    }
>;

export type SanskritMwSnapshotStructureValidationV0_1 = Readonly<{
  ok: boolean;
  recordsVisited: number;
  distinctL: number;
  distinctK1: number;
  duplicateLCount: number;
  recordsLost: number;
  malformedRecordCount: number;
  k1CasePreservationPass: boolean;
  reasonCodes: readonly string[];
}>;

const EXPECTED_SNAPSHOT_IDENTITY_V0_1 = Object.freeze({
  byteLength: SANSKRIT_MW_SOURCE_ARTIFACT_BYTES_V0_1,
  sha256: SANSKRIT_MW_SOURCE_ARTIFACT_SHA256_V0_1,
});

export const SANSKRIT_MW_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1 =
  EXPECTED_SNAPSHOT_IDENTITY_V0_1;

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_1(child, seen);
  }
  return value;
}

function isByteArrayV0_1(value: unknown): value is Uint8Array {
  if (!ArrayBuffer.isView(value)) return false;
  const view = value as ArrayBufferView & {
    length?: unknown;
    BYTES_PER_ELEMENT?: unknown;
  };
  return view.BYTES_PER_ELEMENT === 1 && typeof view.length === "number";
}

function validOrdinalV0_1(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function sourceValueIsPresentV0_1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    !/[\r\n]/u.test(value) &&
    value.trim().length > 0
  );
}

function snapshotIdentityIsVerifiedV0_1(
  identity: unknown,
): identity is SanskritMwVerifiedSnapshotIdentityV0_1 {
  if (identity === null || typeof identity !== "object" || Array.isArray(identity)) {
    return false;
  }
  const candidate = identity as Record<string, unknown>;
  return (
    candidate.byteLength === EXPECTED_SNAPSHOT_IDENTITY_V0_1.byteLength &&
    candidate.sha256 === EXPECTED_SNAPSHOT_IDENTITY_V0_1.sha256
  );
}

function headerFieldsV0_1(line: string): ReadonlyMap<string, string> | null {
  if (!line.startsWith("<L>")) return null;
  const matches = [...line.matchAll(/<([A-Za-z][A-Za-z0-9]*)>/gu)];
  if (matches.length === 0 || matches[0]?.[1] !== "L") return null;

  const fields = new Map<string, string>();
  for (const [index, match] of matches.entries()) {
    const tag = match[1];
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length
      ? (matches[index + 1]?.index ?? line.length)
      : line.length;
    if (!tag || fields.has(tag)) return null;
    fields.set(tag, line.slice(start, end));
  }
  return fields;
}

function recordIdV0_1(l: string): string {
  return `${SANSKRIT_MW_SNAPSHOT_ID_V0_1}#L-${l}`;
}

function entryLocatorV0_1(l: string, pc: string): string {
  return `csl-orig://${SANSKRIT_MW_SOURCE_ARTIFACT_PATH_V0_1}#L=${encodeURIComponent(l)};pc=${encodeURIComponent(pc)}`;
}

function isRecordEndLineV0_1(line: string | undefined): boolean {
  // The frozen csl-orig snapshot contains one source-authored boundary of
  // `<LEND><`; the trailing `<` is part of that line and is not a new record.
  return line === "<LEND>" || line === "<LEND><";
}

function recordFromTextV0_1(
  text: string,
  recordOrdinal: number,
  verifiedSnapshot: SanskritMwVerifiedSnapshotIdentityV0_1,
): SanskritMwSourceRecordAdapterResultV0_1 {
  const lines = text.replace(/\r\n/gu, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  if (lines.length < 2 || !isRecordEndLineV0_1(lines.at(-1))) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }
  if (lines.at(-1) === "<LEND><") lines[lines.length - 1] = "<LEND>";

  const header = headerFieldsV0_1(lines[0] ?? "");
  if (!header) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }

  const l = header.get("L");
  const pc = header.get("pc");
  const k1 = header.get("k1");
  const k2 = header.get("k2");
  const e = header.get("e");
  const h = header.get("h") ?? null;
  if (
    !sourceValueIsPresentV0_1(l) ||
    !sourceValueIsPresentV0_1(pc) ||
    !sourceValueIsPresentV0_1(k1) ||
    !sourceValueIsPresentV0_1(k2) ||
    !sourceValueIsPresentV0_1(e) ||
    (h !== null && !sourceValueIsPresentV0_1(h)) ||
    !snapshotIdentityIsVerifiedV0_1(verifiedSnapshot) ||
    !validOrdinalV0_1(recordOrdinal)
  ) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
  }

  return {
    ok: true,
    record: deepFreezeV0_1({
      sourceFamilyId: SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1,
      sourceTraditionId: SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1,
      snapshotId: SANSKRIT_MW_SNAPSHOT_ID_V0_1,
      snapshotIdentity: Object.freeze({
        byteLength: verifiedSnapshot.byteLength,
        sha256: verifiedSnapshot.sha256,
      }),
      recordOrdinal,
      sourceOrdering: recordOrdinal,
      sourceRecordId: recordIdV0_1(l),
      entryLocator: entryLocatorV0_1(l, pc),
      l,
      pc,
      k1,
      k2,
      h,
      e,
      rawEntryMetadata: e,
      sourceForm: k1,
      lookupForm: k1,
      displayForm: k1,
      language: "Sanskrit",
      languageVariety: null,
      representation: "SLP1",
      sourceFormNormalization: "EXACT_PRESERVED",
      evidenceFamily: "lexical_dictionary",
      attestationTruth: "fact",
      sourceStatus: "research_candidate",
      sourceTitle: SANSKRIT_MW_SOURCE_TITLE_V0_1,
      sourceDateOrVersion: SANSKRIT_MW_SOURCE_DATE_OR_VERSION_V0_1,
      sourceUrlOrArchiveRef: SANSKRIT_MW_SOURCE_URL_V0_1,
      sourceHashOrArchiveHash: `sha256:${SANSKRIT_MW_SOURCE_ARTIFACT_SHA256_V0_1}`,
      license: "CC BY-SA 4.0",
      attribution: "Monier-Williams; Cologne Digital Sanskrit Dictionaries",
      pronunciation: null,
      voicePath: null,
      gamma: null,
      zc: null,
    }),
  };
}

export function adaptSanskritMwRecordV0_1(input: Readonly<{
  recordBytes: Uint8Array;
  recordOrdinal: number;
  verifiedSnapshot: SanskritMwVerifiedSnapshotIdentityV0_1;
}>): SanskritMwSourceRecordAdapterResultV0_1 {
  if (!isByteArrayV0_1(input.recordBytes)) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }
  if (!snapshotIdentityIsVerifiedV0_1(input.verifiedSnapshot)) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }

  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(input.recordBytes);
  } catch {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }

  return recordFromTextV0_1(text, input.recordOrdinal, input.verifiedSnapshot);
}

export function parseSanskritMwRecordV0_1(
  recordText: string,
  recordOrdinal: number,
  verifiedSnapshot: SanskritMwVerifiedSnapshotIdentityV0_1 = EXPECTED_SNAPSHOT_IDENTITY_V0_1,
): SanskritMwSourceRecordAdapterResultV0_1 {
  if (typeof recordText !== "string") {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }
  return recordFromTextV0_1(recordText, recordOrdinal, verifiedSnapshot);
}

export function validateSanskritMwSourceArtifactIdentityV0_1(
  observed: Readonly<{ byteLength: number; sha256: string }>,
): SanskritMwSnapshotValidationResultV0_1 {
  if (
    observed.byteLength === EXPECTED_SNAPSHOT_IDENTITY_V0_1.byteLength &&
    observed.sha256 === EXPECTED_SNAPSHOT_IDENTITY_V0_1.sha256
  ) {
    return Object.freeze({
      ok: true,
      byteLength: SANSKRIT_MW_SOURCE_ARTIFACT_BYTES_V0_1,
      sha256: SANSKRIT_MW_SOURCE_ARTIFACT_SHA256_V0_1,
    });
  }

  return Object.freeze({
    ok: false,
    reasonCode: "SOURCE_IDENTITY_MISMATCH",
    observed: Object.freeze({
      byteLength: observed.byteLength,
      sha256: observed.sha256,
    }),
  });
}

async function sha256FileV0_1(path: string): Promise<string> {
  const hash = createHash("sha256");
  const stream = createReadStream(path);
  for await (const chunk of stream) {
    hash.update(chunk as Uint8Array);
  }
  return hash.digest("hex");
}

export async function verifySanskritMwSnapshotFileV0_1(
  snapshotPath: string,
): Promise<SanskritMwSnapshotValidationResultV0_1> {
  try {
    const metadata = await stat(snapshotPath);
    if (!metadata.isFile()) {
      return Object.freeze({
        ok: false,
        reasonCode: "SOURCE_ADAPTER_FAILURE",
        observed: Object.freeze({ byteLength: metadata.size, sha256: null }),
      });
    }
    const sha256 = await sha256FileV0_1(snapshotPath);
    return validateSanskritMwSourceArtifactIdentityV0_1({
      byteLength: metadata.size,
      sha256,
    });
  } catch {
    return Object.freeze({
      ok: false,
      reasonCode: "SOURCE_ADAPTER_FAILURE",
      observed: Object.freeze({ byteLength: 0, sha256: null }),
    });
  }
}

export async function* streamSanskritMwSnapshotRecordsV0_1(input: Readonly<{
  snapshotPath: string;
}>): AsyncGenerator<SanskritMwSourceRecordV0_1, void, void> {
  const identity = await verifySanskritMwSnapshotFileV0_1(input.snapshotPath);
  if (!identity.ok) {
    throw new Error(identity.reasonCode);
  }

  const lineReader = createInterface({
    input: createReadStream(input.snapshotPath),
    crlfDelay: Infinity,
  });
  const lines: string[] = [];
  let recordOrdinal = 0;

  try {
    for await (const line of lineReader) {
      if (lines.length === 0 && line === "") continue;
      if (isRecordEndLineV0_1(line)) {
        if (lines.length === 0) throw new Error("SOURCE_RECORD_INVALID");
        lines.push(line);
        recordOrdinal += 1;
        const result = adaptSanskritMwRecordV0_1({
          recordBytes: new TextEncoder().encode(`${lines.join("\n")}\n`),
          recordOrdinal,
          verifiedSnapshot: EXPECTED_SNAPSHOT_IDENTITY_V0_1,
        });
        if (!result.ok) throw new Error(result.reasonCode);
        yield result.record;
        lines.length = 0;
        continue;
      }

      if (lines.length === 0 && !line.startsWith("<L>")) {
        throw new Error("SOURCE_RECORD_INVALID");
      }
      lines.push(line);
    }
  } finally {
    lineReader.close();
  }

  if (lines.length > 0) throw new Error("SOURCE_RECORD_INVALID");
}

export async function validateSanskritMwSnapshotStructureV0_1(
  input: Readonly<{ snapshotPath: string }>,
): Promise<SanskritMwSnapshotStructureValidationV0_1> {
  const lValues = new Set<string>();
  const k1Values = new Set<string>();
  let recordsVisited = 0;
  let malformedRecordCount = 0;
  let k1CasePreservationPass = true;

  try {
    for await (const record of streamSanskritMwSnapshotRecordsV0_1(input)) {
      recordsVisited += 1;
      if (
        record.sourceForm !== record.k1 ||
        record.lookupForm !== record.k1 ||
        record.displayForm !== record.k1
      ) {
        k1CasePreservationPass = false;
      }
      if (lValues.has(record.l)) continue;
      lValues.add(record.l);
      k1Values.add(record.k1);
    }
  } catch {
    malformedRecordCount += 1;
  }

  const duplicateLCount = recordsVisited - lValues.size;
  const recordsLost = Math.max(
    0,
    SANSKRIT_MW_SOURCE_EXPECTED_RECORD_COUNT_V0_1 - recordsVisited,
  );
  const reasonCodes = [
    ...(recordsVisited !== SANSKRIT_MW_SOURCE_EXPECTED_RECORD_COUNT_V0_1
      ? ["RECORD_COUNT_MISMATCH"]
      : []),
    ...(duplicateLCount > 0 ? ["DUPLICATE_L"] : []),
    ...(malformedRecordCount > 0 ? ["MALFORMED_RECORD"] : []),
  ];

  return Object.freeze({
    ok: reasonCodes.length === 0,
    recordsVisited,
    distinctL: lValues.size,
    distinctK1: k1Values.size,
    duplicateLCount,
    recordsLost,
    malformedRecordCount,
    k1CasePreservationPass,
    reasonCodes: Object.freeze(reasonCodes),
  });
}

export function lookupSanskritMwSourceRecordsV0_1(
  lookupForm: string,
  sourceRecords: readonly SanskritMwSourceRecordV0_1[],
): SanskritMwLookupResultV0_1 {
  if (typeof lookupForm !== "string") {
    return Object.freeze({
      status: "SANSKRIT_SOURCE_NOT_FOUND",
      lookupForm: "",
      records: Object.freeze([]) as readonly [],
    });
  }

  const records = sourceRecords.filter((record) => record.lookupForm === lookupForm);
  if (records.length === 0) {
    return Object.freeze({
      status: "SANSKRIT_SOURCE_NOT_FOUND",
      lookupForm,
      records: Object.freeze([]) as readonly [],
    });
  }

  return Object.freeze({
    status: "MATCHES_FOUND",
    lookupForm,
    records: Object.freeze([...records]),
  });
}

export function createSanskritMwSourceFamilyAdapterV0_1(
  sourceRecords: readonly SanskritMwSourceRecordV0_1[],
): SanskritMwSourceFamilyAdapterV0_1 {
  return Object.freeze({
    adapterId: SANSKRIT_MW_SOURCE_FAMILY_ADAPTER_ID_V0_1,
    sourceFamilyId: SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1,
    sourceTraditionId: SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1,
    enabledByDefault: false,
    runtimeActiveAfterMerge: false,
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED",
    queryExact(lookupForm: string): SanskritMwLookupResultV0_1 {
      return lookupSanskritMwSourceRecordsV0_1(lookupForm, sourceRecords);
    },
  });
}

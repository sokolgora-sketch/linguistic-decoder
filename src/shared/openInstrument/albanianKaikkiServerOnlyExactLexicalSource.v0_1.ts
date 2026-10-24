import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { open, stat, type FileHandle } from "node:fs/promises";

export const ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1 =
  "open-instrument.albanian-kaikki-server-only-exact-lexical-source.v0.1" as const;
export const ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH" as const;
export const ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1 =
  "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl" as const;
export const ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1 =
  "kaikki-albanian-jsonl-v0.1" as const;
export const ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1 =
  "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc" as const;
export const ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1 = 67438537 as const;
export const ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1 =
  "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const;

export type AlbanianKaikkiExactLexicalSourceSenseV0_1 = Readonly<{
  senseId: string | null;
  glosses: readonly string[];
}>;

export type AlbanianKaikkiExactLexicalSourceIpaObservationV0_1 = Readonly<{
  soundIndex: number;
  ipa: string | null;
  tags: readonly string[];
}>;

export type AlbanianKaikkiExactLexicalSourceRelatedFormV0_1 = Readonly<{
  form: string;
  relation: "SOURCE_RELATED_FORM";
  entryLocator: string;
}>;

export type AlbanianKaikkiExactLexicalSourceFactV0_1 = Readonly<{
  sourceRecordId: string;
  entryLocator: string;
  physicalRecordOrdinal: number;
  language: "Albanian";
  languageCode: "sq";
  form: string;
  partOfSpeech: string | null;
  senses: readonly AlbanianKaikkiExactLexicalSourceSenseV0_1[];
  ipaObservations: readonly AlbanianKaikkiExactLexicalSourceIpaObservationV0_1[];
  /** Source-authored etymology text; descriptive evidence, not a derived claim. */
  etymologyText?: string | null;
  relatedForms?: readonly AlbanianKaikkiExactLexicalSourceRelatedFormV0_1[];
  sourceStatus: "observed_external_snapshot";
  attestationTruth: "fact";
  pronunciationAuthority: typeof ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1;
  sourceSnapshot: Readonly<{
    sourceFamilyId: string;
    sourceUrl: string;
    sha256: string;
    bytes: number;
  }>;
}>;

export type AlbanianKaikkiExactLexicalSourceStatusV0_1 = Readonly<{
  status: "MATCHES_FOUND" | "SOURCE_NOT_FOUND" | "UNAVAILABLE" | "NOT_QUERIED";
  queryForm: string | null;
  reasonCode: string | null;
}>;

export type AlbanianKaikkiExactLexicalSourceLookupResultV0_1 = Readonly<
  | {
      status: "MATCHES_FOUND";
      queryForm: string;
      facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
      reasonCode: null;
    }
  | {
      status: "SOURCE_NOT_FOUND";
      queryForm: string | null;
      facts: readonly [];
      reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" | "ALBANIAN_EXACT_FORM_INVALID_QUERY";
    }
  | {
      status: "UNAVAILABLE";
      queryForm: string | null;
      facts: readonly [];
      reasonCode:
        | "ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"
        | "ALBANIAN_SOURCE_IDENTITY_MISMATCH"
        | "ALBANIAN_SOURCE_READ_FAILURE"
        | "ALBANIAN_SOURCE_RECORD_FAILURE";
  }
>;

export type AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1 = Readonly<{
  indexInitializationCount: number;
  fullSourceScanCount: number;
  fullSourceBytesScanned: number;
  indexedLookupBytesRead: number;
}>;

export type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Readonly<{
  providerId: typeof ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1;
  runtimeBoundary: "SERVER_ONLY";
  query: (query: unknown) => Promise<AlbanianKaikkiExactLexicalSourceLookupResultV0_1>;
  queryWithMetrics: (
    query: unknown,
  ) => Promise<Readonly<{
    result: AlbanianKaikkiExactLexicalSourceLookupResultV0_1;
    metrics: AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1;
  }>>;
}>;

type SourceSnapshotV0_1 = Readonly<{
  sourceFamilyId: string;
  sourceUrl: string;
  sha256: string;
  bytes: number;
}>;

type SourceIdentityV0_1 = Readonly<{
  sourceSnapshot: SourceSnapshotV0_1;
}>;

type SourceRecordRangeV0_1 = Readonly<{
  physicalRecordOrdinal: number;
  matchOrdinal: number;
  recordByteOffset: number;
  recordByteLength: number;
  recordSha256: string;
}>;

type SourceFileFingerprintV0_1 = Readonly<{
  size: number;
  mtimeMs: number;
  ctimeMs: number;
  dev: number;
  ino: number;
}>;

type SourceIndexStateV0_1 = Readonly<{
  sourcePath: string;
  sourceIdentity: SourceIdentityV0_1;
  sourceFileFingerprint: SourceFileFingerprintV0_1;
  byLookupKey: ReadonlyMap<string, readonly SourceRecordRangeV0_1[]>;
  indexInitializationCount: number;
  fullSourceScanCount: number;
  fullSourceBytesScanned: number;
}>;

const productionSourceIdentityV0_1: SourceIdentityV0_1 = Object.freeze({
  sourceSnapshot: Object.freeze({
    sourceFamilyId: ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
    sourceUrl: ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
    sha256: ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
    bytes: ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  }),
});

const sourceIndexPromisesV0_1 = new Map<string, Promise<SourceIndexStateV0_1>>();
const sourceIndexInitializationCountsV0_1 = new Map<string, number>();

type RawRecordV0_1 = Readonly<Record<string, unknown>>;

function isRecordV0_1(value: unknown): value is RawRecordV0_1 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function textV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function lookupKeyV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}

function queryFormV0_1(value: unknown): string | null {
  return typeof value === "string" && value.normalize("NFC").trim()
    ? value.normalize("NFC").trim()
    : null;
}

function stringArrayV0_1(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? Object.freeze(value.flatMap((item) => {
        const text = textV0_1(item);
        return text ? [text] : [];
      }))
    : Object.freeze([]);
}

function projectSenseV0_1(value: unknown): AlbanianKaikkiExactLexicalSourceSenseV0_1 {
  const sense = isRecordV0_1(value) ? value : {};
  return Object.freeze({
    senseId: textV0_1(sense.id),
    glosses: stringArrayV0_1(sense.glosses),
  });
}

function projectSoundV0_1(
  value: unknown,
  soundIndex: number,
): AlbanianKaikkiExactLexicalSourceIpaObservationV0_1 {
  const sound = isRecordV0_1(value) ? value : {};
  return Object.freeze({
    soundIndex,
    ipa: textV0_1(sound.ipa),
    tags: stringArrayV0_1(sound.tags),
  });
}

function sourceFactV0_1(
  record: RawRecordV0_1,
  physicalRecordOrdinal: number,
  matchOrdinal: number,
  sourceIdentity: SourceIdentityV0_1,
): AlbanianKaikkiExactLexicalSourceFactV0_1 | null {
  const form = textV0_1(record.word);
  if (!form || record.lang_code !== "sq") return null;

  const senses = Array.isArray(record.senses)
    ? Object.freeze(record.senses.map(projectSenseV0_1))
    : Object.freeze([]);
  const ipaObservations = Array.isArray(record.sounds)
    ? Object.freeze(record.sounds.map(projectSoundV0_1))
    : Object.freeze([]);
  const etymologyText = textV0_1(record.etymology_text);
  const relatedForms = Array.isArray(record.related)
    ? Object.freeze(record.related.flatMap((value) => {
        const relatedRecord = isRecordV0_1(value) ? value : null;
        const relatedForm = relatedRecord ? textV0_1(relatedRecord.word) : null;
        if (!relatedForm) return [];
        const relatedEncodedForm = encodeURIComponent(relatedForm);
        return [{
          form: relatedForm,
          relation: "SOURCE_RELATED_FORM" as const,
          entryLocator: `jsonl://word/${relatedEncodedForm}`,
        }];
      }))
    : undefined;
  const encodedForm = encodeURIComponent(form);

  return Object.freeze({
    sourceRecordId: `kaikki-albanian-jsonl:word=${encodedForm}:ordinal=${matchOrdinal}`,
    entryLocator: `jsonl://word/${encodedForm}/match/${matchOrdinal}`,
    physicalRecordOrdinal,
    language: "Albanian",
    languageCode: "sq",
    form,
    partOfSpeech: textV0_1(record.pos),
    senses,
    ipaObservations,
    etymologyText,
    ...(relatedForms ? { relatedForms } : {}),
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
    sourceSnapshot: sourceIdentity.sourceSnapshot,
  });
}

function unavailableV0_1(
  reasonCode: Extract<
    AlbanianKaikkiExactLexicalSourceLookupResultV0_1,
    { status: "UNAVAILABLE" }
  >["reasonCode"],
): AlbanianKaikkiExactLexicalSourceLookupResultV0_1 {
  return Object.freeze({
    status: "UNAVAILABLE",
    queryForm: null,
    facts: Object.freeze([]) as readonly [],
    reasonCode,
  });
}

function providerFromFactsV0_1(
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[],
): AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 {
  const byKey = new Map<string, AlbanianKaikkiExactLexicalSourceFactV0_1[]>();
  for (const fact of facts) {
    const key = lookupKeyV0_1(fact.form);
    const values = byKey.get(key) ?? [];
    values.push(fact);
    byKey.set(key, values);
  }

  const query = async (
    query: unknown,
  ): Promise<AlbanianKaikkiExactLexicalSourceLookupResultV0_1> => {
    const queryForm = queryFormV0_1(query);
    if (!queryForm) {
      return Object.freeze({
        status: "SOURCE_NOT_FOUND" as const,
        queryForm: null,
        facts: Object.freeze([]) as readonly [],
        reasonCode: "ALBANIAN_EXACT_FORM_INVALID_QUERY" as const,
      });
    }

    const factsForKey = byKey.get(lookupKeyV0_1(queryForm)) ?? [];
    if (factsForKey.length === 0) {
      return Object.freeze({
        status: "SOURCE_NOT_FOUND" as const,
        queryForm,
        facts: Object.freeze([]) as readonly [],
        reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" as const,
      });
    }

    return Object.freeze({
      status: "MATCHES_FOUND" as const,
      queryForm,
      facts: Object.freeze([...factsForKey]),
      reasonCode: null,
    });
  };

  return Object.freeze({
    providerId: ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1,
    runtimeBoundary: "SERVER_ONLY",
    query,
    queryWithMetrics: async (value: unknown) => Object.freeze({
      result: await query(value),
      metrics: Object.freeze({
        indexInitializationCount: 0,
        fullSourceScanCount: 0,
        fullSourceBytesScanned: 0,
        indexedLookupBytesRead: 0,
      }),
    }),
  });
}

function sourceFileFingerprintV0_1(fileStat: {
  size: number;
  mtimeMs: number;
  ctimeMs: number;
  dev: number;
  ino: number;
}): SourceFileFingerprintV0_1 {
  return Object.freeze({
    size: fileStat.size,
    mtimeMs: fileStat.mtimeMs,
    ctimeMs: fileStat.ctimeMs,
    dev: fileStat.dev,
    ino: fileStat.ino,
  });
}

function sameSourceFileFingerprintV0_1(
  left: SourceFileFingerprintV0_1,
  right: SourceFileFingerprintV0_1,
): boolean {
  return left.size === right.size &&
    left.mtimeMs === right.mtimeMs &&
    left.ctimeMs === right.ctimeMs &&
    left.dev === right.dev &&
    left.ino === right.ino;
}

function metricsForIndexV0_1(
  index: SourceIndexStateV0_1,
  indexedLookupBytesRead: number,
): AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1 {
  return Object.freeze({
    indexInitializationCount: index.indexInitializationCount,
    fullSourceScanCount: index.fullSourceScanCount,
    fullSourceBytesScanned: index.fullSourceBytesScanned,
    indexedLookupBytesRead,
  });
}

async function buildSourceIndexV0_1(
  sourcePath: string,
  sourceIdentity: SourceIdentityV0_1,
): Promise<SourceIndexStateV0_1> {
  const expectedSnapshot = sourceIdentity.sourceSnapshot;
  const byLookupKey = new Map<string, SourceRecordRangeV0_1[]>();
  const hash = createHash("sha256");
  const stream = createReadStream(sourcePath, { highWaterMark: 1024 * 1024 });
  let byteCount = 0;
  let pending = Buffer.alloc(0);
  let pendingOffset = 0;
  let physicalRecordOrdinal = 0;

  const processLine = (rawLine: Buffer, recordByteOffset: number): void => {
    const currentPhysicalRecordOrdinal = physicalRecordOrdinal;
    physicalRecordOrdinal += 1;
    const jsonBytes = rawLine.length > 0 && rawLine[rawLine.length - 1] === 0x0d
      ? rawLine.subarray(0, -1)
      : rawLine;
    if (jsonBytes.length === 0) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonBytes.toString("utf8")) as unknown;
    } catch {
      throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
    }
    if (!isRecordV0_1(parsed)) throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
    const form = textV0_1(parsed.word);
    if (!form || parsed.lang_code !== "sq") return;

    const lookupKey = lookupKeyV0_1(form);
    const entries = byLookupKey.get(lookupKey) ?? [];
    entries.push(Object.freeze({
      physicalRecordOrdinal: currentPhysicalRecordOrdinal,
      matchOrdinal: entries.length,
      recordByteOffset,
      recordByteLength: jsonBytes.byteLength,
      recordSha256: createHash("sha256").update(jsonBytes).digest("hex"),
    }));
    byLookupKey.set(lookupKey, entries);
  };

  for await (const chunk of stream) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    hash.update(bytes);
    byteCount += bytes.byteLength;

    const combined = pending.length > 0 ? Buffer.concat([pending, bytes]) : bytes;
    let scanOffset = 0;
    while (true) {
      const lineFeedOffset = combined.indexOf(0x0a, scanOffset);
      if (lineFeedOffset < 0) break;
      processLine(combined.subarray(scanOffset, lineFeedOffset), pendingOffset + scanOffset);
      scanOffset = lineFeedOffset + 1;
    }

    pendingOffset += scanOffset;
    pending = scanOffset === combined.length
      ? Buffer.alloc(0)
      : Buffer.from(combined.subarray(scanOffset));
  }
  if (pending.length > 0) processLine(pending, pendingOffset);

  const sha256 = hash.digest("hex");
  if (byteCount !== expectedSnapshot.bytes || sha256 !== expectedSnapshot.sha256) {
    throw new Error("ALBANIAN_SOURCE_IDENTITY_MISMATCH");
  }

  const sourceFileFingerprint = sourceFileFingerprintV0_1(await stat(sourcePath));
  if (sourceFileFingerprint.size !== byteCount) {
    throw new Error("ALBANIAN_SOURCE_IDENTITY_MISMATCH");
  }

  const frozenEntries = new Map<string, readonly SourceRecordRangeV0_1[]>();
  for (const [lookupKey, entries] of byLookupKey) {
    frozenEntries.set(lookupKey, Object.freeze([...entries]));
  }

  return Object.freeze({
    sourcePath,
    sourceIdentity,
    sourceFileFingerprint,
    byLookupKey: frozenEntries,
    indexInitializationCount: 0,
    fullSourceScanCount: 1,
    fullSourceBytesScanned: byteCount,
  });
}

function sourceIndexCacheKeyV0_1(
  sourcePath: string,
  sourceIdentity: SourceIdentityV0_1,
): string {
  const snapshot = sourceIdentity.sourceSnapshot;
  return `${sourcePath}\u0000${snapshot.sha256}\u0000${snapshot.bytes}`;
}

function getSourceIndexV0_1(
  sourcePath: string,
  sourceIdentity: SourceIdentityV0_1,
): Promise<SourceIndexStateV0_1> {
  const cacheKey = sourceIndexCacheKeyV0_1(sourcePath, sourceIdentity);
  const existing = sourceIndexPromisesV0_1.get(cacheKey);
  if (existing) return existing;

  const indexInitializationCount = (sourceIndexInitializationCountsV0_1.get(cacheKey) ?? 0) + 1;
  sourceIndexInitializationCountsV0_1.set(cacheKey, indexInitializationCount);
  const indexPromise = buildSourceIndexV0_1(sourcePath, sourceIdentity).then((index) => Object.freeze({
    ...index,
    indexInitializationCount,
  }));
  sourceIndexPromisesV0_1.set(cacheKey, indexPromise);
  return indexPromise;
}

async function readSourceRecordRangeV0_1(
  handle: FileHandle,
  entry: SourceRecordRangeV0_1,
): Promise<Buffer> {
  const bytes = Buffer.alloc(entry.recordByteLength);
  let bytesReadTotal = 0;
  while (bytesReadTotal < bytes.byteLength) {
    const result = await handle.read(
      bytes,
      bytesReadTotal,
      bytes.byteLength - bytesReadTotal,
      entry.recordByteOffset + bytesReadTotal,
    );
    if (result.bytesRead === 0) throw new Error("ALBANIAN_SOURCE_READ_FAILURE");
    bytesReadTotal += result.bytesRead;
  }
  return bytes;
}

async function lookupIndexedSourceFileV0_1(
  index: SourceIndexStateV0_1,
  queryForm: string,
): Promise<Readonly<{
  result: AlbanianKaikkiExactLexicalSourceLookupResultV0_1;
  metrics: AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1;
}>> {
  const currentFingerprint = sourceFileFingerprintV0_1(await stat(index.sourcePath));
  if (!sameSourceFileFingerprintV0_1(index.sourceFileFingerprint, currentFingerprint)) {
    throw new Error("ALBANIAN_SOURCE_IDENTITY_MISMATCH");
  }

  const entries = index.byLookupKey.get(lookupKeyV0_1(queryForm)) ?? [];
  if (entries.length === 0) {
    return Object.freeze({
      result: Object.freeze({
        status: "SOURCE_NOT_FOUND" as const,
        queryForm,
        facts: Object.freeze([]) as readonly [],
        reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" as const,
      }),
      metrics: metricsForIndexV0_1(index, 0),
    });
  }

  const handle = await open(index.sourcePath, "r");
  const facts: AlbanianKaikkiExactLexicalSourceFactV0_1[] = [];
  let indexedLookupBytesRead = 0;
  try {
    for (const entry of entries) {
      const recordBytes = await readSourceRecordRangeV0_1(handle, entry);
      indexedLookupBytesRead += recordBytes.byteLength;
      const recordSha256 = createHash("sha256").update(recordBytes).digest("hex");
      if (recordSha256 !== entry.recordSha256) {
        throw new Error("ALBANIAN_SOURCE_IDENTITY_MISMATCH");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(recordBytes.toString("utf8")) as unknown;
      } catch {
        throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
      }
      if (!isRecordV0_1(parsed)) throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
      const form = textV0_1(parsed.word);
      if (!form || parsed.lang_code !== "sq" || lookupKeyV0_1(form) !== lookupKeyV0_1(queryForm)) {
        throw new Error("ALBANIAN_SOURCE_IDENTITY_MISMATCH");
      }
      const fact = sourceFactV0_1(
        parsed,
        entry.physicalRecordOrdinal,
        entry.matchOrdinal,
        index.sourceIdentity,
      );
      if (!fact) throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
      facts.push(fact);
    }
  } finally {
    await handle.close();
  }

  return Object.freeze({
    result: Object.freeze({
      status: "MATCHES_FOUND" as const,
      queryForm,
      facts: Object.freeze(facts),
      reasonCode: null,
    }),
    metrics: metricsForIndexV0_1(index, indexedLookupBytesRead),
  });
}

function zeroLookupMetricsV0_1(): AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1 {
  return Object.freeze({
    indexInitializationCount: 0,
    fullSourceScanCount: 0,
    fullSourceBytesScanned: 0,
    indexedLookupBytesRead: 0,
  });
}

function indexedProviderV0_1(
  sourcePath: string,
  sourceIdentity: SourceIdentityV0_1,
): AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 {
  const queryWithMetrics = async (
    query: unknown,
  ): Promise<Readonly<{
    result: AlbanianKaikkiExactLexicalSourceLookupResultV0_1;
    metrics: AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1;
  }>> => {
    const queryForm = queryFormV0_1(query);
    if (!queryForm) {
      return Object.freeze({
        result: Object.freeze({
          status: "SOURCE_NOT_FOUND" as const,
          queryForm: null,
          facts: Object.freeze([]) as readonly [],
          reasonCode: "ALBANIAN_EXACT_FORM_INVALID_QUERY" as const,
        }),
        metrics: zeroLookupMetricsV0_1(),
      });
    }

    try {
      const index = await getSourceIndexV0_1(sourcePath, sourceIdentity);
      return await lookupIndexedSourceFileV0_1(index, queryForm);
    } catch (error) {
      const reasonCode = error instanceof Error &&
          (error.message === "ALBANIAN_SOURCE_IDENTITY_MISMATCH" ||
            error.message === "ALBANIAN_SOURCE_READ_FAILURE" ||
            error.message === "ALBANIAN_SOURCE_RECORD_FAILURE")
        ? error.message
        : "ALBANIAN_SOURCE_READ_FAILURE";
      return Object.freeze({
        result: unavailableV0_1(reasonCode),
        metrics: zeroLookupMetricsV0_1(),
      });
    }
  };

  return Object.freeze({
    providerId: ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1,
    runtimeBoundary: "SERVER_ONLY" as const,
    query: async (query: unknown) => (await queryWithMetrics(query)).result,
    queryWithMetrics,
  });
}

export async function createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(
  sourcePath = process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1],
): Promise<AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1> {
  if (!sourcePath) {
    const queryWithMetrics = async (): Promise<Readonly<{
      result: AlbanianKaikkiExactLexicalSourceLookupResultV0_1;
      metrics: AlbanianKaikkiServerOnlyExactLexicalSourceLookupMetricsV0_1;
    }>> => Object.freeze({
      result: unavailableV0_1("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"),
      metrics: zeroLookupMetricsV0_1(),
    });
    return Object.freeze({
      providerId: ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1,
      runtimeBoundary: "SERVER_ONLY" as const,
      query: async () => unavailableV0_1("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"),
      queryWithMetrics,
    });
  }

  return indexedProviderV0_1(sourcePath, productionSourceIdentityV0_1);
}

export function createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1(
  input: Readonly<{
    sourcePath: string;
    sourceSha256: string;
    sourceBytes: number;
    sourceFamilyId?: string;
    sourceUrl?: string;
  }>,
): AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 {
  return indexedProviderV0_1(
    input.sourcePath,
    Object.freeze({
      sourceSnapshot: Object.freeze({
        sourceFamilyId: input.sourceFamilyId ?? "synthetic-albanian-jsonl-fixture-v0.1",
        sourceUrl: input.sourceUrl ?? "synthetic://albanian-jsonl-fixture-v0.1",
        sha256: input.sourceSha256,
        bytes: input.sourceBytes,
      }),
    }),
  );
}

export function createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1(
  input: Readonly<{ facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] }>,
): AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 {
  return providerFromFactsV0_1(input.facts);
}

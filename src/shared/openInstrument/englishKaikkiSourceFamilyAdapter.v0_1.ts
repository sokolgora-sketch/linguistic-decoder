import { createHash } from "node:crypto";
import {
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_KAIKKI_BUILD_DATE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_UPSTREAM_DUMP_DATE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1,
  normalizeEnglishLexicalJoinKeyV0_1,
  validateEnglishLexicalSenseSourceArtifactIdentityV0_1,
} from "./englishLexicalSenseSourceContract.v0_1";
import type {
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceAdapterV1,
  GenericFunctionalWitnessSourceRecordV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_ID_V0_1 =
  "open-instrument.english-kaikki-source-family-adapter.v0_1" as const;

export const ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1 =
  ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1;

export const ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1 =
  "open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1" as const;

export const ENGLISH_KAIKKI_SOURCE_TITLE_V0_1 =
  "English Wiktionary -> Wiktextract -> Kaikki English JSONL" as const;

export const ENGLISH_KAIKKI_SOURCE_DATE_OR_VERSION_V0_1 =
  `Kaikki build ${ENGLISH_LEXICAL_SENSE_SOURCE_KAIKKI_BUILD_DATE_V0_1}; upstream dump ${ENGLISH_LEXICAL_SENSE_SOURCE_UPSTREAM_DUMP_DATE_V0_1}` as const;

export type EnglishKaikkiVerifiedSnapshotIdentityV0_1 = Readonly<{
  byteLength: number;
  sha256: string;
}>;

export type EnglishKaikkiSourceSenseV0_1 = Readonly<{
  senseOrdinal: number;
  sourceSenseId: string;
  senseId: string;
  glosses?: readonly string[];
  raw_glosses?: readonly string[];
  tags?: readonly string[];
  raw_tags?: readonly string[];
}>;

export type EnglishKaikkiSourceRecordV0_1 = Readonly<{
  sourceFamilyId: typeof ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1;
  snapshotId: typeof ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1;
  recordOrdinal: number;
  recordSha256: string;
  sourceRecordId: string;
  entryLocator: string;
  word: string;
  queryForm: string;
  lang: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1;
  lang_code: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1;
  pos: string;
  senses: readonly EnglishKaikkiSourceSenseV0_1[];
}>;

export type EnglishKaikkiSourceRecordAdapterResultV0_1 = Readonly<
  | {
      ok: true;
      record: EnglishKaikkiSourceRecordV0_1;
    }
  | {
      ok: false;
      reasonCode: "SOURCE_ADAPTER_FAILURE" | "SOURCE_RECORD_INVALID";
    }
>;

export type EnglishKaikkiLookupResultV0_1 = Readonly<
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
>;

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

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStringArrayV0_1(
  record: Record<string, unknown>,
  field: string,
): { ok: true; value: readonly string[] | undefined } | { ok: false } {
  const value = record[field];
  if (value === undefined) return { ok: true, value: undefined };
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return { ok: false };
  }
  return { ok: true, value: Object.freeze([...value]) };
}

function validOrdinalV0_1(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function sourceIdentityIsVerifiedV0_1(
  identity: unknown,
): identity is EnglishKaikkiVerifiedSnapshotIdentityV0_1 {
  if (!isRecordV0_1(identity)) return false;
  return validateEnglishLexicalSenseSourceArtifactIdentityV0_1({
    byteLength: identity.byteLength as number,
    sha256: identity.sha256 as string,
  }).ok;
}

function isByteArrayV0_1(value: unknown): value is Uint8Array {
  if (!ArrayBuffer.isView(value)) return false;
  const view = value as ArrayBufferView & {
    length?: unknown;
    BYTES_PER_ELEMENT?: unknown;
  };
  return view.BYTES_PER_ELEMENT === 1 && typeof view.length === "number";
}

function senseIdentityV0_1(
  sourceRecordId: string,
  senseOrdinal: number,
  sourceSenseId: string,
): string {
  return `${sourceRecordId}#sense-${senseOrdinal}#source-sense-id-${sourceSenseId}`;
}

function genericSourceIdV0_1(senseId: string, glossOrdinal: number): string {
  return `${senseId}#gloss-${glossOrdinal}`;
}

function parseRecordValueV0_1(
  raw: unknown,
  recordOrdinal: number,
  recordSha256: string,
):
  | {
      ok: true;
      word: string;
      lang: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1;
      lang_code: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1;
      pos: string;
      senses: readonly EnglishKaikkiSourceSenseV0_1[];
    }
  | { ok: false } {
  if (!isRecordV0_1(raw)) return { ok: false };
  if (
    typeof raw.word !== "string" ||
    raw.word.length === 0 ||
    raw.lang !== ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1 ||
    raw.lang_code !== ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1 ||
    typeof raw.pos !== "string" ||
    raw.pos.length === 0 ||
    !Array.isArray(raw.senses)
  ) {
    return { ok: false };
  }

  const senses: EnglishKaikkiSourceSenseV0_1[] = [];
  for (const [index, rawSense] of raw.senses.entries()) {
    if (!isRecordV0_1(rawSense)) return { ok: false };
    if (typeof rawSense.id !== "string" || rawSense.id.length === 0) {
      return { ok: false };
    }

    const glosses = readStringArrayV0_1(rawSense, "glosses");
    const rawGlosses = readStringArrayV0_1(rawSense, "raw_glosses");
    const tags = readStringArrayV0_1(rawSense, "tags");
    const rawTags = readStringArrayV0_1(rawSense, "raw_tags");
    if (!glosses.ok || !rawGlosses.ok || !tags.ok || !rawTags.ok) {
      return { ok: false };
    }

    senses.push({
      senseOrdinal: index + 1,
      sourceSenseId: rawSense.id,
      senseId: senseIdentityV0_1(
        `${ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1}#jsonl-record-${recordOrdinal}#record-sha256-${recordSha256}`,
        index + 1,
        rawSense.id,
      ),
      ...(glosses.value === undefined ? {} : { glosses: glosses.value }),
      ...(rawGlosses.value === undefined
        ? {}
        : { raw_glosses: rawGlosses.value }),
      ...(tags.value === undefined ? {} : { tags: tags.value }),
      ...(rawTags.value === undefined ? {} : { raw_tags: rawTags.value }),
    });
  }

  return {
    ok: true,
    word: raw.word,
    lang: ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1,
    lang_code: ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1,
    pos: raw.pos,
    senses: Object.freeze(senses),
  };
}

/**
 * Adapts exactly one physical JSONL record. The caller supplies the already
 * verified snapshot identity; this function never opens or scans the source.
 */
export function adaptEnglishKaikkiJsonlRecordV0_1(input: Readonly<{
  recordBytes: Uint8Array;
  recordOrdinal: number;
  verifiedSnapshot: EnglishKaikkiVerifiedSnapshotIdentityV0_1;
}>): EnglishKaikkiSourceRecordAdapterResultV0_1 {
  if (!sourceIdentityIsVerifiedV0_1(input.verifiedSnapshot)) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }
  if (!validOrdinalV0_1(input.recordOrdinal)) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
  }
  if (!isByteArrayV0_1(input.recordBytes) || input.recordBytes.length === 0) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }

  const recordSha256 = createHash("sha256").update(input.recordBytes).digest("hex");
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(input.recordBytes);
  } catch {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  }

  const parsed = parseRecordValueV0_1(raw, input.recordOrdinal, recordSha256);
  if (!parsed.ok) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
  }

  const sourceRecordId = `${ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1}#jsonl-record-${input.recordOrdinal}#record-sha256-${recordSha256}`;
  const entryLocator = `jsonl://record/${input.recordOrdinal};recordSha256=${recordSha256}`;
  return {
    ok: true,
    record: deepFreezeV0_1({
      sourceFamilyId: ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
      snapshotId: ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
      recordOrdinal: input.recordOrdinal,
      recordSha256,
      sourceRecordId,
      entryLocator,
      word: parsed.word,
      queryForm: normalizeEnglishLexicalJoinKeyV0_1(parsed.word),
      lang: parsed.lang,
      lang_code: parsed.lang_code,
      pos: parsed.pos,
      senses: parsed.senses,
    }),
  };
}

function selectedGlossesV0_1(
  sense: EnglishKaikkiSourceSenseV0_1,
): readonly string[] {
  if (sense.glosses !== undefined && sense.glosses.length > 0) {
    return sense.glosses;
  }
  if (sense.raw_glosses !== undefined && sense.raw_glosses.length > 0) {
    return sense.raw_glosses;
  }
  return [];
}

function genericGlossIsAdmissibleV0_1(value: string): boolean {
  return value.length > 0 && value.trim() === value && value.normalize("NFC") === value;
}

/**
 * Projects source facts only. The generic seam has no tags/raw_tags field, so
 * those remain available on the source-record representation and are never
 * promoted into generic semantics.
 */
export function projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1(
  sourceRecord: EnglishKaikkiSourceRecordV0_1,
): readonly GenericFunctionalWitnessSourceRecordV1[] {
  const records: GenericFunctionalWitnessSourceRecordV1[] = [];
  for (const sense of sourceRecord.senses) {
    const glosses = selectedGlossesV0_1(sense);
    for (const [index, gloss] of glosses.entries()) {
      if (!genericGlossIsAdmissibleV0_1(gloss)) continue;
      records.push({
        queryForm: sourceRecord.queryForm,
        sourceId: genericSourceIdV0_1(sense.senseId, index + 1),
        evidenceFamily: "lexical_dictionary",
        language: sourceRecord.lang,
        languageVariety: null,
        sourceForm: sourceRecord.word,
        sourceFormNormalization: "EXACT_PRESERVED",
        gloss,
        citationRefs: [ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1, sourceRecord.entryLocator],
        embryoRelation: "exact_form",
        relationOperationIds: [],
        attestationTruth: "fact",
        sourceStatus: "research_candidate",
        sourceProvenance: {
          // The existing generic seam requires sourceId and provenance
          // sourceRecordId to agree. This tuple identity retains the physical
          // source-record identity in its sense-id prefix and adds the gloss
          // ordinal so no gloss is collapsed by the seam's witness de-dupe.
          sourceRecordId: genericSourceIdV0_1(sense.senseId, index + 1),
          sourceTraditionId: sourceRecord.sourceFamilyId,
          sourceTitle: ENGLISH_KAIKKI_SOURCE_TITLE_V0_1,
          sourceDateOrVersion: ENGLISH_KAIKKI_SOURCE_DATE_OR_VERSION_V0_1,
          sourceUrlOrArchiveRef: ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1,
          entryLocator: sourceRecord.entryLocator,
          sourceHashOrArchiveHash: `sha256:${ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1}`,
          languageVariety: null,
        },
      });
    }
  }
  return Object.freeze(records);
}

export function lookupEnglishKaikkiSourceRecordsV0_1(
  query: string,
  sourceRecords: readonly EnglishKaikkiSourceRecordV0_1[],
): EnglishKaikkiLookupResultV0_1 {
  const queryForm = normalizeEnglishLexicalJoinKeyV0_1(query);
  const matchingSourceRecords = sourceRecords.filter(
    (sourceRecord) => sourceRecord.queryForm === queryForm,
  );
  if (matchingSourceRecords.length === 0) {
    return Object.freeze({
      status: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      queryForm,
      records: Object.freeze([]) as readonly [],
    });
  }

  const records = matchingSourceRecords.flatMap(
    projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1,
  );
  if (records.length === 0) {
    return Object.freeze({
      status: "LEXICAL_SENSE_GLOSS_NOT_FOUND",
      queryForm,
      records: Object.freeze([]) as readonly [],
      matchingSourceRecordIds: Object.freeze(
        matchingSourceRecords.map((record) => record.sourceRecordId),
      ),
    });
  }

  return Object.freeze({
    status: "MATCHES_FOUND",
    queryForm,
    records: Object.freeze(records),
  });
}

/**
 * Creates the existing generic adapter over explicitly supplied record units.
 * It is intentionally linear and record-bound; it is not a corpus loader or
 * persistent index and is not registered with the Discovery runtime.
 */
export function createEnglishKaikkiGenericWitnessSourceAdapterV0_1(
  sourceRecords: readonly EnglishKaikkiSourceRecordV0_1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  return Object.freeze({
    adapterId: ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_ID_V0_1,
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input): GenericFunctionalWitnessSourceAdapterResultV1 {
      return {
        ok: true,
        // The existing generic seam supplies an already-authorized query form.
        // Do not add another canonicalization operator at this boundary.
        records: sourceRecords
          .filter((sourceRecord) => sourceRecord.queryForm === input.embryo)
          .flatMap(projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1),
      };
    },
  });
}

export const ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1 =
  Object.freeze({
    byteLength: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
    sha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
  });

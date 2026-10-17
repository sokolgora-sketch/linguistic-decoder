import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

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
  sourceStatus: "observed_external_snapshot";
  attestationTruth: "fact";
  pronunciationAuthority: typeof ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1;
  sourceSnapshot: Readonly<{
    sourceFamilyId: typeof ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1;
    sourceUrl: typeof ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1;
    sha256: typeof ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1;
    bytes: typeof ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1;
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

export type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Readonly<{
  providerId: typeof ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1;
  runtimeBoundary: "SERVER_ONLY";
  query: (query: unknown) => Promise<AlbanianKaikkiExactLexicalSourceLookupResultV0_1>;
}>;

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
): AlbanianKaikkiExactLexicalSourceFactV0_1 | null {
  const form = textV0_1(record.word);
  if (!form || record.lang_code !== "sq") return null;

  const senses = Array.isArray(record.senses)
    ? Object.freeze(record.senses.map(projectSenseV0_1))
    : Object.freeze([]);
  const ipaObservations = Array.isArray(record.sounds)
    ? Object.freeze(record.sounds.map(projectSoundV0_1))
    : Object.freeze([]);
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
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
    sourceSnapshot: Object.freeze({
      sourceFamilyId: ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
      sourceUrl: ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
      sha256: ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
      bytes: ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
    }),
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

  return Object.freeze({
    providerId: ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1,
    runtimeBoundary: "SERVER_ONLY",
    query: async (query: unknown) => {
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
    },
  });
}

function recordFromJsonLineV0_1(
  line: string,
  physicalRecordOrdinal: number,
  matchOrdinalByKey: Map<string, number>,
): AlbanianKaikkiExactLexicalSourceFactV0_1 | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line) as unknown;
  } catch {
    throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
  }
  if (!isRecordV0_1(parsed)) throw new Error("ALBANIAN_SOURCE_RECORD_FAILURE");
  const form = textV0_1(parsed.word);
  if (!form || parsed.lang_code !== "sq") return null;
  const key = lookupKeyV0_1(form);
  const matchOrdinal = matchOrdinalByKey.get(key) ?? 0;
  matchOrdinalByKey.set(key, matchOrdinal + 1);
  return sourceFactV0_1(parsed, physicalRecordOrdinal, matchOrdinal);
}

async function loadFactsV0_1(
  sourcePath: string,
): Promise<readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]> {
  let bytes: Buffer;
  try {
    bytes = await readFile(sourcePath);
  } catch {
    throw new Error("ALBANIAN_SOURCE_READ_FAILURE");
  }

  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (bytes.byteLength !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1 || sha256 !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1) {
    throw new Error("ALBANIAN_SOURCE_IDENTITY_MISMATCH");
  }

  const facts: AlbanianKaikkiExactLexicalSourceFactV0_1[] = [];
  const matchOrdinalByKey = new Map<string, number>();
  const lines = bytes.toString("utf8").split("\n");
  for (let physicalRecordOrdinal = 0; physicalRecordOrdinal < lines.length; physicalRecordOrdinal += 1) {
    const line = lines[physicalRecordOrdinal]?.replace(/\r$/u, "");
    if (!line) continue;
    const fact = recordFromJsonLineV0_1(line, physicalRecordOrdinal, matchOrdinalByKey);
    if (fact) facts.push(fact);
  }
  return Object.freeze(facts);
}

export async function createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(
  sourcePath = process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1],
): Promise<AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1> {
  if (!sourcePath) {
    return Object.freeze({
      providerId: ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1,
      runtimeBoundary: "SERVER_ONLY" as const,
      query: async () => unavailableV0_1("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"),
    });
  }

  try {
    return providerFromFactsV0_1(await loadFactsV0_1(sourcePath));
  } catch (error) {
    const reasonCode = error instanceof Error &&
        (error.message === "ALBANIAN_SOURCE_IDENTITY_MISMATCH" ||
          error.message === "ALBANIAN_SOURCE_READ_FAILURE" ||
          error.message === "ALBANIAN_SOURCE_RECORD_FAILURE")
      ? error.message
      : "ALBANIAN_SOURCE_READ_FAILURE";
    return Object.freeze({
      providerId: ALBANIAN_KAIKKI_SERVER_ONLY_EXACT_LEXICAL_SOURCE_PROVIDER_ID_V0_1,
      runtimeBoundary: "SERVER_ONLY" as const,
      query: async () => unavailableV0_1(reasonCode),
    });
  }
}

export function createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1(
  input: Readonly<{ facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] }>,
): AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 {
  return providerFromFactsV0_1(input.facts);
}

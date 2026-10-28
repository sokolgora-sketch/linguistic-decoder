import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative } from "node:path";

import type {
  GenericFunctionalWitnessSourceAdapterV1,
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceRecordV1,
  GenericFunctionalWitnessSourceDetailsV1,
  GenericFunctionalWitnessQueryV1,
} from "./genericFunctionalWitnessDiscovery.v1";

type AlbaNetUnavailableReasonCodeV0_1 =
  | "ALBANET_SOURCE_PATH_NOT_CONFIGURED"
  | "ALBANET_SOURCE_NOT_REGULAR_FILE"
  | "ALBANET_SOURCE_OUTSIDE_EXTERNAL_BOUNDARY"
  | "ALBANET_SOURCE_BYTE_LENGTH_MISMATCH"
  | "ALBANET_SOURCE_SHA256_MISMATCH"
  | "ALBANET_SOURCE_PARSE_FAILURE";

export const ALBANET_SOURCE_FAMILY_ADAPTER_ID_V0_1 =
  "open-instrument.albanet-source-family-adapter.v0.1" as const;
export const ALBANET_SOURCE_FAMILY_ID_V0_1 =
  "albanet-omw-sq-v0.1" as const;
export const ALBANET_SOURCE_TITLE_V0_1 =
  "Albanet via Open Multilingual Wordnet data" as const;
export const ALBANET_SOURCE_REPOSITORY_V0_1 =
  "https://github.com/omwn/omw-data" as const;
export const ALBANET_SOURCE_REVISION_V0_1 =
  "406bf83b3c507a3d1f26e88252d5d66893fd36bf" as const;
export const ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1 =
  "wns/als/wn-data-als.tab" as const;
export const ALBANET_SOURCE_FILE_SHA256_V0_1 =
  "5a3c72ec0681fdd1b217c134b04fcb7a03b595163111dc06ce7f9333f70d1ba4" as const;
export const ALBANET_SOURCE_FILE_BYTES_V0_1 = 932373 as const;
export const ALBANET_SOURCE_LICENSE_V0_1 = "CC BY 3.0" as const;
export const ALBANET_SOURCE_PATH_ENV_V0_1 =
  "OPEN_INSTRUMENT_ALBANET_SOURCE_PATH" as const;

export type AlbaNetSourceRecordV0_1 = Readonly<{
  sourceRecordId: string;
  synsetId: string;
  lemma: string;
  definitions: readonly string[];
  examples: readonly string[];
  relationTypes: readonly string[];
  entryLocator: string;
}>;

export type AlbaNetSourceLoadResultV0_1 = Readonly<
  | {
      status: "READY";
      sourcePath: string;
      records: readonly AlbaNetSourceRecordV0_1[];
      adapter: GenericFunctionalWitnessSourceAdapterV1;
    }
  | {
      status: "UNAVAILABLE";
      sourcePath: string | null;
      reasonCode: AlbaNetUnavailableReasonCodeV0_1;
      records: readonly [];
      adapter: null;
    }
>;

type MutableSynsetV0_1 = {
  lemmas: string[];
  definitions: Map<number, string>;
  examples: Map<number, string>;
  relationTypes: Set<string>;
};

function compareTextV0_1(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function normalizeAlbaNetLemmaV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US").normalize("NFC");
}

function exactTextV0_1(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value === value.normalize("NFC");
}

function sourceRecordIdV0_1(synsetId: string, lemma: string): string {
  return `${ALBANET_SOURCE_FAMILY_ID_V0_1}:${synsetId}:lemma=${encodeURIComponent(lemma)}`;
}

function toSourceRecordsV0_1(
  synsets: Map<string, MutableSynsetV0_1>,
): readonly AlbaNetSourceRecordV0_1[] {
  const records: AlbaNetSourceRecordV0_1[] = [];
  for (const [synsetId, synset] of synsets.entries()) {
    for (const lemma of [...new Set(synset.lemmas)].sort(compareTextV0_1)) {
      records.push({
        sourceRecordId: sourceRecordIdV0_1(synsetId, lemma),
        synsetId,
        lemma,
        definitions: [...synset.definitions.entries()]
          .sort(([left], [right]) => left - right)
          .map(([, value]) => value),
        examples: [...synset.examples.entries()]
          .sort(([left], [right]) => left - right)
          .map(([, value]) => value),
        relationTypes: [...synset.relationTypes].sort(compareTextV0_1),
        entryLocator:
          `${ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1}#synset=${synsetId};lemma=${encodeURIComponent(lemma)}`,
      });
    }
  }
  return Object.freeze(records.sort((left, right) =>
    compareTextV0_1(left.sourceRecordId, right.sourceRecordId),
  ));
}

export function parseAlbaNetTabV0_1(
  text: string,
): Readonly<{
  ok: true;
  records: readonly AlbaNetSourceRecordV0_1[];
}> | Readonly<{ ok: false; reasonCode: "ALBANET_SOURCE_PARSE_FAILURE" }> {
  const lines = text.split("\n");
  if (!lines[0]?.startsWith("# Albanet\tals\t")) {
    return { ok: false, reasonCode: "ALBANET_SOURCE_PARSE_FAILURE" };
  }

  const synsets = new Map<string, MutableSynsetV0_1>();
  for (const rawLine of lines.slice(1)) {
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
    if (line.length === 0) continue;
    const fields = line.split("\t");
    const synsetId = fields[0];
    const relationType = fields[1];
    if (!exactTextV0_1(synsetId) || !exactTextV0_1(relationType)) {
      return { ok: false, reasonCode: "ALBANET_SOURCE_PARSE_FAILURE" };
    }
    if (relationType !== "als:lemma" && relationType !== "als:def" && relationType !== "als:exe") {
      return { ok: false, reasonCode: "ALBANET_SOURCE_PARSE_FAILURE" };
    }
    const synset = synsets.get(synsetId) ?? {
      lemmas: [],
      definitions: new Map<number, string>(),
      examples: new Map<number, string>(),
      relationTypes: new Set<string>(),
    };
    synset.relationTypes.add(relationType);

    if (relationType === "als:lemma") {
      if (fields.length !== 3 || !exactTextV0_1(fields[2])) {
        return { ok: false, reasonCode: "ALBANET_SOURCE_PARSE_FAILURE" };
      }
      synset.lemmas.push(fields[2]);
    } else if (relationType === "als:def" || relationType === "als:exe") {
      if (fields.length !== 4 || !/^\d+$/u.test(fields[2] ?? "") || !exactTextV0_1(fields[3])) {
        return { ok: false, reasonCode: "ALBANET_SOURCE_PARSE_FAILURE" };
      }
      const target = relationType === "als:def" ? synset.definitions : synset.examples;
      target.set(Number(fields[2]), fields[3]);
    }
    synsets.set(synsetId, synset);
  }

  return { ok: true, records: toSourceRecordsV0_1(synsets) };
}

function sourceDetailsV0_1(
  record: AlbaNetSourceRecordV0_1,
): GenericFunctionalWitnessSourceDetailsV1 {
  return {
    synsetId: record.synsetId,
    definitions: [...record.definitions],
    examples: [...record.examples],
    relationTypes: [...record.relationTypes],
    license: ALBANET_SOURCE_LICENSE_V0_1,
  };
}

function projectRecordV0_1(
  record: AlbaNetSourceRecordV0_1,
  input: GenericFunctionalWitnessQueryV1,
): GenericFunctionalWitnessSourceRecordV1 | null {
  if (record.definitions.length === 0) return null;
  return {
    queryForm: input.embryo,
    sourceId: record.sourceRecordId,
    evidenceFamily: "lexical_dictionary",
    language: "Albanian",
    languageVariety: null,
    sourceForm: record.lemma,
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss: record.definitions.join(" · "),
    citationRefs: [ALBANET_SOURCE_REPOSITORY_V0_1, record.entryLocator],
    embryoRelation: "exact_form",
    relationOperationIds: [],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    sourceDetails: sourceDetailsV0_1(record),
    sourceProvenance: {
      sourceRecordId: record.sourceRecordId,
      sourceTraditionId: ALBANET_SOURCE_FAMILY_ID_V0_1,
      sourceTitle: ALBANET_SOURCE_TITLE_V0_1,
      sourceDateOrVersion: `omw-data ${ALBANET_SOURCE_REVISION_V0_1}`,
      sourceUrlOrArchiveRef: ALBANET_SOURCE_REPOSITORY_V0_1,
      entryLocator: record.entryLocator,
      sourceHashOrArchiveHash: `sha256:${ALBANET_SOURCE_FILE_SHA256_V0_1}`,
      languageVariety: null,
    },
  };
}

export function createAlbaNetSourceFamilyAdapterV0_1(
  records: readonly AlbaNetSourceRecordV0_1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  const recordsByLemma = new Map<string, readonly AlbaNetSourceRecordV0_1[]>();
  for (const record of records) {
    const key = normalizeAlbaNetLemmaV0_1(record.lemma);
    recordsByLemma.set(key, [
      ...(recordsByLemma.get(key) ?? []),
      record,
    ].sort((left, right) => compareTextV0_1(left.sourceRecordId, right.sourceRecordId)));
  }

  return Object.freeze({
    adapterId: ALBANET_SOURCE_FAMILY_ADAPTER_ID_V0_1,
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      const recordsForLemma = recordsByLemma.get(normalizeAlbaNetLemmaV0_1(input.embryo)) ?? [];
      return {
        ok: true,
        records: recordsForLemma
          .map((record) => projectRecordV0_1(record, input))
          .filter((record): record is GenericFunctionalWitnessSourceRecordV1 => record !== null),
      };
    },
  });
}

function insideRootV0_1(root: string, child: string): boolean {
  const childRelative = relative(root, child);
  return childRelative !== "" && !childRelative.startsWith("..") && !isAbsolute(childRelative);
}

async function hashFileV0_1(path: string): Promise<Readonly<{ bytes: number; sha256: string }>> {
  const bytes = await readFile(path);
  return { bytes: bytes.byteLength, sha256: createHash("sha256").update(bytes).digest("hex") };
}

export async function loadAlbaNetServerOnlySourceV0_1(
  sourcePath = process.env[ALBANET_SOURCE_PATH_ENV_V0_1] ?? null,
): Promise<AlbaNetSourceLoadResultV0_1> {
  if (!sourcePath) {
    return { status: "UNAVAILABLE", sourcePath: null, reasonCode: "ALBANET_SOURCE_PATH_NOT_CONFIGURED", records: [], adapter: null };
  }
  try {
    const repositoryRoot = await realpath(process.cwd());
    const resolvedPath = await realpath(sourcePath);
    const sourceStat = await lstat(resolvedPath);
    if (!sourceStat.isFile()) throw new Error("ALBANET_SOURCE_NOT_REGULAR_FILE");
    if (insideRootV0_1(repositoryRoot, resolvedPath) || insideRootV0_1(resolvedPath, repositoryRoot)) {
      throw new Error("ALBANET_SOURCE_OUTSIDE_EXTERNAL_BOUNDARY");
    }
    const digest = await hashFileV0_1(resolvedPath);
    if (digest.bytes !== ALBANET_SOURCE_FILE_BYTES_V0_1) {
      throw new Error("ALBANET_SOURCE_BYTE_LENGTH_MISMATCH");
    }
    if (digest.sha256 !== ALBANET_SOURCE_FILE_SHA256_V0_1) {
      throw new Error("ALBANET_SOURCE_SHA256_MISMATCH");
    }
    const parsed = parseAlbaNetTabV0_1((await readFile(resolvedPath)).toString("utf8"));
    if (!parsed.ok) throw new Error(parsed.reasonCode);
    return {
      status: "READY",
      sourcePath: resolvedPath,
      records: parsed.records,
      adapter: createAlbaNetSourceFamilyAdapterV0_1(parsed.records),
    };
  } catch (error) {
    const reasonCode = error instanceof Error && error.message.startsWith("ALBANET_SOURCE_")
      ? error.message as AlbaNetUnavailableReasonCodeV0_1
      : "ALBANET_SOURCE_PARSE_FAILURE";
    return {
      status: "UNAVAILABLE",
      sourcePath,
      reasonCode,
      records: [],
      adapter: null,
    };
  }
}

let productionLoadPromiseV0_1: Promise<AlbaNetSourceLoadResultV0_1> | undefined;

export function getProductionAlbaNetSourceV0_1(): Promise<AlbaNetSourceLoadResultV0_1> {
  productionLoadPromiseV0_1 ??= loadAlbaNetServerOnlySourceV0_1();
  return productionLoadPromiseV0_1;
}

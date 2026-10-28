import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative } from "node:path";

import type {
  GenericFunctionalWitnessQueryV1,
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceAdapterV1,
  GenericFunctionalWitnessSourceDetailsV1,
  GenericFunctionalWitnessSourceRecordV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const LEXIN_SOURCE_FAMILY_ADAPTER_ID_V0_1 =
  "open-instrument.lexin-source-family-adapter.v0.1" as const;
export const LEXIN_SOURCE_FAMILY_ID_V0_1 =
  "lexin-swedish-albanian-v0.1" as const;
export const LEXIN_SOURCE_TITLE_V0_1 =
  "Lexin Swedish-Albanian Dictionary" as const;
export const LEXIN_SOURCE_PUBLISHER_V0_1 =
  "Institute for Language and Folklore / Language Council of Sweden" as const;
export const LEXIN_SOURCE_CONTRIBUTOR_V0_1 =
  "Sadulla Zendeli Daja" as const;
export const LEXIN_SOURCE_URL_V0_1 =
  "https://sprakresurser.isof.se/lexin/albanska/swe_alb.xml" as const;
export const LEXIN_SOURCE_VERSION_V0_1 = "2010-07-07" as const;
export const LEXIN_SOURCE_FILE_SHA256_V0_1 =
  "83f9834c0f5a591f0ea326c5fa04d8f4a086d75b6340175a7151c103ef6bf765" as const;
export const LEXIN_SOURCE_FILE_BYTES_V0_1 = 18732653 as const;
export const LEXIN_SOURCE_LICENSE_V0_1 = "CC BY 4.0" as const;
export const LEXIN_SOURCE_PATH_ENV_V0_1 =
  "OPEN_INSTRUMENT_LEXIN_SOURCE_PATH" as const;

export type LexinSourceIdentityV0_1 = Readonly<{
  xmlVersion: string;
  bytes: number;
  sha256: string;
}>;

export const LEXIN_SOURCE_IDENTITY_V0_1: LexinSourceIdentityV0_1 = Object.freeze({
  xmlVersion: LEXIN_SOURCE_VERSION_V0_1,
  bytes: LEXIN_SOURCE_FILE_BYTES_V0_1,
  sha256: LEXIN_SOURCE_FILE_SHA256_V0_1,
});

export type LexinSourceRecordV0_1 = Readonly<{
  sourceRecordId: string;
  entryLocator: string;
  physicalRecordOrdinal: number;
  wordId: string;
  matchingId: string | null;
  variantId: string;
  sourceType: string;
  swedishHeadword: string;
  swedishMeanings: readonly string[];
  albanianTranslation: string;
  albanianSynonyms: readonly string[];
  albanianExamples: readonly string[];
  albanianCompounds: readonly string[];
}>;

type LexinUnavailableReasonCodeV0_1 =
  | "LEXIN_SOURCE_PATH_NOT_CONFIGURED"
  | "LEXIN_SOURCE_NOT_REGULAR_FILE"
  | "LEXIN_SOURCE_OUTSIDE_EXTERNAL_BOUNDARY"
  | "LEXIN_SOURCE_BYTE_LENGTH_MISMATCH"
  | "LEXIN_SOURCE_SHA256_MISMATCH"
  | "LEXIN_SOURCE_PATH_ACCESS_FAILURE"
  | "LEXIN_SOURCE_READ_FAILURE"
  | "LEXIN_SOURCE_SCHEMA_INVALID"
  | "LEXIN_SOURCE_RECORD_INVALID"
  | "LEXIN_SOURCE_DUPLICATE_RECORD_ID";

export type LexinSourceLoadResultV0_1 = Readonly<
  | {
      status: "READY";
      sourcePath: string;
      records: readonly LexinSourceRecordV0_1[];
      adapter: GenericFunctionalWitnessSourceAdapterV1;
    }
  | {
      status: "UNAVAILABLE";
      sourcePath: string | null;
      reasonCode: LexinUnavailableReasonCodeV0_1;
      records: readonly [];
      adapter: null;
    }
>;

type XmlAttributesV0_1 = Readonly<Record<string, string>>;

function decodeXmlTextV0_1(value: string): string {
  return value.replace(
    /&(?:amp|lt|gt|quot|apos|#x[0-9a-f]+|#\d+);/giu,
    (entity) => {
      if (entity === "&amp;") return "&";
      if (entity === "&lt;") return "<";
      if (entity === "&gt;") return ">";
      if (entity === "&quot;") return '"';
      if (entity === "&apos;") return "'";
      if (entity.startsWith("&#x")) return String.fromCodePoint(Number.parseInt(entity.slice(3, -1), 16));
      return String.fromCodePoint(Number.parseInt(entity.slice(2, -1), 10));
    },
  );
}

function cleanXmlTextV0_1(value: string): string {
  return decodeXmlTextV0_1(value).replace(/\s+/gu, " ").trim();
}

function parseAttributesV0_1(raw: string): XmlAttributesV0_1 | null {
  const attributes: Record<string, string> = {};
  let offset = 0;
  while (offset < raw.length) {
    while (/\s/u.test(raw[offset] ?? "")) offset += 1;
    if (offset >= raw.length || raw.slice(offset).trim() === "/") break;
    const nameMatch = raw.slice(offset).match(/^([A-Za-z_][A-Za-z0-9_.:-]*)/u);
    if (!nameMatch) return null;
    const name = nameMatch[1];
    offset += name.length;
    while (/\s/u.test(raw[offset] ?? "")) offset += 1;
    if (raw[offset] !== "=") return null;
    offset += 1;
    while (/\s/u.test(raw[offset] ?? "")) offset += 1;
    const quote = raw[offset];
    if (quote !== '"' && quote !== "'") return null;
    offset += 1;
    const end = raw.indexOf(quote, offset);
    if (end < 0) return null;
    attributes[name] = decodeXmlTextV0_1(raw.slice(offset, end));
    offset = end + 1;
  }
  return Object.freeze(attributes);
}

function validateXmlEnvelopeV0_1(
  xml: string,
): Readonly<{ ok: true; rootAttributes: XmlAttributesV0_1 }> | Readonly<{ ok: false }> {
  const tokenPattern = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<![^>]*>|<\/?[A-Za-z_][^<>]*>|[^<]+/gu;
  const stack: string[] = [];
  let cursor = 0;
  let rootName: string | null = null;
  let rootAttributes: XmlAttributesV0_1 | null = null;
  let rootClosed = false;

  for (const match of xml.matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start !== cursor) return { ok: false };
    cursor = start + token.length;
    if (token.startsWith("<!--") || token.startsWith("<?") || token.startsWith("<!")) continue;
    if (!token.startsWith("<")) {
      if (stack.length === 0 && token.trim().length > 0) return { ok: false };
      continue;
    }

    if (/^<\//u.test(token)) {
      const closeMatch = token.match(/^<\/([A-Za-z_][A-Za-z0-9_.:-]*)\s*>$/u);
      if (!closeMatch || stack.pop() !== closeMatch[1]) return { ok: false };
      if (stack.length === 0) rootClosed = true;
      continue;
    }

    const body = token.slice(1, -1);
    const selfClosing = /\/\s*$/u.test(body);
    const normalizedBody = selfClosing ? body.replace(/\/\s*$/u, "") : body;
    const openMatch = normalizedBody.match(/^([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/u);
    if (!openMatch) return { ok: false };
    const name = openMatch[1];
    const attributes = parseAttributesV0_1(openMatch[2]);
    if (!attributes) return { ok: false };
    if (stack.length === 0) {
      if (rootName !== null || rootClosed) return { ok: false };
      rootName = name;
      rootAttributes = attributes;
    }
    if (!selfClosing) stack.push(name);
  }

  if (cursor !== xml.length || stack.length !== 0 || !rootClosed || rootName !== "Dictionary" || !rootAttributes) {
    return { ok: false };
  }
  return { ok: true, rootAttributes };
}

function childSectionV0_1(block: string, name: "BaseLang" | "TargetLang"): string | null {
  return block.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "u"))?.[1] ?? null;
}

function childTextsV0_1(section: string | null, name: string): readonly string[] {
  if (!section) return Object.freeze([]);
  const values: string[] = [];
  const pattern = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "gu");
  for (const match of section.matchAll(pattern)) {
    const value = cleanXmlTextV0_1(match[1]);
    if (value) values.push(value);
  }
  return Object.freeze(values);
}

function wordAttributeV0_1(attributes: XmlAttributesV0_1, name: string): string | null {
  const value = attributes[name];
  return value && value.trim() ? value.normalize("NFC").trim() : null;
}

function encodeRecordPartV0_1(value: string | null): string {
  return encodeURIComponent(value ?? "NULL");
}

function normalizeQueryV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("sq-AL").normalize("NFC");
}

export function parseLexinXmlV0_1(
  xml: string,
): Readonly<{ ok: true; version: string; records: readonly LexinSourceRecordV0_1[] }> | Readonly<{
  ok: false;
  reasonCode: "LEXIN_SOURCE_SCHEMA_INVALID" | "LEXIN_SOURCE_RECORD_INVALID" | "LEXIN_SOURCE_DUPLICATE_RECORD_ID";
}> {
  const envelope = validateXmlEnvelopeV0_1(xml);
  if (!envelope.ok || envelope.rootAttributes.BaseLang !== "Swedish" || envelope.rootAttributes.TargetLang !== "Albanian") {
    return { ok: false, reasonCode: "LEXIN_SOURCE_SCHEMA_INVALID" };
  }
  const version = envelope.rootAttributes.Version;
  if (!version) return { ok: false, reasonCode: "LEXIN_SOURCE_SCHEMA_INVALID" };

  const records: LexinSourceRecordV0_1[] = [];
  const seenRecordIds = new Set<string>();
  const wordPattern = /<Word\b([^>]*)>([\s\S]*?)<\/Word>/gu;
  let ordinal = 0;
  for (const match of xml.matchAll(wordPattern)) {
    ordinal += 1;
    const attributes = parseAttributesV0_1(match[1]);
    if (!attributes) return { ok: false, reasonCode: "LEXIN_SOURCE_RECORD_INVALID" };
    const wordId = wordAttributeV0_1(attributes, "ID");
    const variantId = wordAttributeV0_1(attributes, "VariantID");
    const sourceType = wordAttributeV0_1(attributes, "Type");
    const swedishHeadword = wordAttributeV0_1(attributes, "Value");
    if (!wordId || !variantId || !sourceType || !swedishHeadword) {
      return { ok: false, reasonCode: "LEXIN_SOURCE_RECORD_INVALID" };
    }
    const matchingId = wordAttributeV0_1(attributes, "MatchingID");
    const baseLang = childSectionV0_1(match[2], "BaseLang");
    const targetLang = childSectionV0_1(match[2], "TargetLang");
    const translations = childTextsV0_1(targetLang, "Translation");
    if (translations.length === 0) continue;
    const swedishMeanings = childTextsV0_1(baseLang, "Meaning");
    const albanianSynonyms = childTextsV0_1(targetLang, "Synonym");
    const albanianExamples = childTextsV0_1(targetLang, "Example");
    const albanianCompounds = childTextsV0_1(targetLang, "Compound");

    for (const [translationIndex, translation] of translations.entries()) {
      const sourceRecordId = `${LEXIN_SOURCE_FAMILY_ID_V0_1}:word=${encodeRecordPartV0_1(wordId)};matching=${encodeRecordPartV0_1(matchingId)};variant=${encodeRecordPartV0_1(variantId)};translation=${translationIndex}`;
      if (seenRecordIds.has(sourceRecordId)) {
        return { ok: false, reasonCode: "LEXIN_SOURCE_DUPLICATE_RECORD_ID" };
      }
      seenRecordIds.add(sourceRecordId);
      records.push({
        sourceRecordId,
        entryLocator: `swe_alb.xml#Word[ordinal=${ordinal};ID=${encodeRecordPartV0_1(wordId)};VariantID=${encodeRecordPartV0_1(variantId)};Translation=${translationIndex}]`,
        physicalRecordOrdinal: ordinal,
        wordId,
        matchingId,
        variantId,
        sourceType,
        swedishHeadword,
        swedishMeanings,
        albanianTranslation: translation,
        albanianSynonyms,
        albanianExamples,
        albanianCompounds,
      });
    }
  }

  const wordCount = [...xml.matchAll(/<Word\b/gu)].length;
  const closingWordCount = [...xml.matchAll(/<\/Word>/gu)].length;
  if (wordCount === 0 || wordCount !== closingWordCount || records.some((record) => !record.sourceRecordId)) {
    return { ok: false, reasonCode: "LEXIN_SOURCE_RECORD_INVALID" };
  }
  return { ok: true, version, records: Object.freeze(records) };
}

function sourceDetailsV0_1(record: LexinSourceRecordV0_1): GenericFunctionalWitnessSourceDetailsV1 {
  return {
    synsetId: record.sourceRecordId,
    sourceIdentity: record.sourceRecordId,
    definitions: [
      `Swedish headword: ${record.swedishHeadword}`,
      ...record.swedishMeanings.map((meaning) => `Swedish meaning: ${meaning}`),
    ],
    examples: [
      `Albanian translation field: ${record.albanianTranslation}`,
      ...record.albanianExamples.map((example) => `Albanian example: ${example}`),
      ...record.albanianCompounds.map((compound) => `Albanian compound: ${compound}`),
    ],
    relationTypes: [
      "BaseLang=Swedish",
      "TargetLang=Albanian",
      "TargetLang/Translation",
      `Word.Type=${record.sourceType}`,
      ...(record.albanianSynonyms.length ? ["TargetLang/Synonym"] : []),
    ],
    license: `${LEXIN_SOURCE_LICENSE_V0_1}; attribution: ${LEXIN_SOURCE_PUBLISHER_V0_1}; contributor: ${LEXIN_SOURCE_CONTRIBUTOR_V0_1}`,
  };
}

function projectRecordV0_1(
  record: LexinSourceRecordV0_1,
  input: GenericFunctionalWitnessQueryV1,
): GenericFunctionalWitnessSourceRecordV1 {
  const meaning = record.swedishMeanings.join(" · ") || "not provided";
  return {
    queryForm: input.embryo,
    sourceId: record.sourceRecordId,
    evidenceFamily: "lexical_dictionary",
    language: "Albanian",
    languageVariety: "Swedish → Albanian bilingual source; Albanian pronunciation not provided",
    sourceForm: record.albanianTranslation,
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss: `Swedish headword: ${record.swedishHeadword}; Swedish meaning: ${meaning}; Albanian translation: ${record.albanianTranslation}`,
    citationRefs: [LEXIN_SOURCE_URL_V0_1, record.entryLocator, "https://creativecommons.org/licenses/by/4.0/"],
    embryoRelation: "exact_form",
    relationOperationIds: [],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    sourceProvenance: {
      sourceRecordId: record.sourceRecordId,
      sourceTraditionId: LEXIN_SOURCE_FAMILY_ID_V0_1,
      sourceTitle: LEXIN_SOURCE_TITLE_V0_1,
      sourceDateOrVersion: `Lexin XML ${LEXIN_SOURCE_VERSION_V0_1}`,
      sourceUrlOrArchiveRef: LEXIN_SOURCE_URL_V0_1,
      entryLocator: record.entryLocator,
      sourceHashOrArchiveHash: `sha256:${LEXIN_SOURCE_FILE_SHA256_V0_1}`,
      languageVariety: "Swedish → Albanian",
    },
    sourceDetails: sourceDetailsV0_1(record),
  };
}

export function createLexinSourceFamilyAdapterV0_1(
  records: readonly LexinSourceRecordV0_1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  return Object.freeze({
    adapterId: LEXIN_SOURCE_FAMILY_ADAPTER_ID_V0_1,
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      const queryForm = normalizeQueryV0_1(input.embryo);
      return {
        ok: true,
        records: records
          .filter((record) => normalizeQueryV0_1(record.albanianTranslation) === queryForm)
          .sort((left, right) => left.physicalRecordOrdinal - right.physicalRecordOrdinal)
          .map((record) => projectRecordV0_1(record, input)),
      };
    },
  });
}

function insideRootV0_1(root: string, child: string): boolean {
  const childRelative = relative(root, child);
  return childRelative !== "" && !childRelative.startsWith("..") && !isAbsolute(childRelative);
}

function unavailableV0_1(
  sourcePath: string | null,
  reasonCode: LexinUnavailableReasonCodeV0_1,
): LexinSourceLoadResultV0_1 {
  return { status: "UNAVAILABLE", sourcePath, reasonCode, records: [], adapter: null };
}

export async function loadLexinServerOnlySourceV0_1(
  sourcePath = process.env[LEXIN_SOURCE_PATH_ENV_V0_1] ?? null,
  expectedIdentity: LexinSourceIdentityV0_1 = LEXIN_SOURCE_IDENTITY_V0_1,
): Promise<LexinSourceLoadResultV0_1> {
  if (!sourcePath) return unavailableV0_1(null, "LEXIN_SOURCE_PATH_NOT_CONFIGURED");

  let repositoryRoot: string;
  let resolvedPath: string;
  try {
    repositoryRoot = await realpath(process.cwd());
    resolvedPath = await realpath(sourcePath);
  } catch {
    return unavailableV0_1(sourcePath, "LEXIN_SOURCE_PATH_ACCESS_FAILURE");
  }

  let sourceStat;
  try {
    sourceStat = await lstat(resolvedPath);
  } catch {
    return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_PATH_ACCESS_FAILURE");
  }
  if (!sourceStat.isFile()) return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_NOT_REGULAR_FILE");
  if (insideRootV0_1(repositoryRoot, resolvedPath) || insideRootV0_1(resolvedPath, repositoryRoot)) {
    return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_OUTSIDE_EXTERNAL_BOUNDARY");
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(resolvedPath);
  } catch {
    return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_READ_FAILURE");
  }
  if (bytes.byteLength !== expectedIdentity.bytes) {
    return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_BYTE_LENGTH_MISMATCH");
  }
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== expectedIdentity.sha256) {
    return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_SHA256_MISMATCH");
  }

  let parsed: ReturnType<typeof parseLexinXmlV0_1>;
  try {
    parsed = parseLexinXmlV0_1(bytes.toString("utf8"));
  } catch {
    return unavailableV0_1(resolvedPath, "LEXIN_SOURCE_SCHEMA_INVALID");
  }
  if (!parsed.ok || parsed.version !== expectedIdentity.xmlVersion) {
    return unavailableV0_1(resolvedPath, parsed.ok ? "LEXIN_SOURCE_SCHEMA_INVALID" : parsed.reasonCode);
  }
  return {
    status: "READY",
    sourcePath: resolvedPath,
    records: parsed.records,
    adapter: createLexinSourceFamilyAdapterV0_1(parsed.records),
  };
}

const productionLexinSourceCacheV0_1 = new Map<string, Promise<LexinSourceLoadResultV0_1>>();

export function getProductionLexinSourceV0_1(): Promise<LexinSourceLoadResultV0_1> {
  const sourcePath = process.env[LEXIN_SOURCE_PATH_ENV_V0_1] ?? "<not-configured>";
  const cached = productionLexinSourceCacheV0_1.get(sourcePath);
  if (cached) return cached;
  const load = loadLexinServerOnlySourceV0_1();
  productionLexinSourceCacheV0_1.set(sourcePath, load);
  return load;
}

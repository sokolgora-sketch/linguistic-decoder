import {
  parseResearchHypothesisManifestV0_1,
  projectResearchHypothesisManifestToCandidateEvidenceV0_1,
  type ResearchHypothesisCandidateEvidenceV0_1,
  type ResearchHypothesisManifestV0_1,
} from "@/shared/openInstrument/researchHypothesisManifest.v0_1";
import rawResearchHypotheses from "@/data/openInstrument/researchHypotheses/ze15-wordnet-role-candidate.v0_1.json";
import rawBatch from "@/data/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1.json";

export const ALBANIAN_OCCUPATIONAL_ROLE_BATCH_SCHEMA_V0_1 =
  "open-instrument.albanian-occupational-role-candidate-batch.v0_1" as const;
export const ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1 =
  "open-instrument.albanian-kaikki.frozen.20261022T035432Z" as const;
export const ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1 =
  "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc" as const;
export const OEWN_2025_PROFILE_ID_V0_1 = "open-english-wordnet.json.2025" as const;
export const OEWN_2025_SHA256_V0_1 =
  "7d749f6e2c39e6970e4997839dcf6e42fd281f3c2fae0171d2192bae8cfa4b51" as const;

type UnknownRecord = Record<string, unknown>;

export type AlbanianOccupationalRoleOewnSenseV0_1 = Readonly<{
  lemma: string;
  senseId: string;
  synsetId: string;
  definitions: readonly string[];
  typedHypernymPaths: readonly (readonly Readonly<{ synsetId: string; members: readonly string[]; definitions: readonly string[] }>[])[];
}>;

export type AlbanianOccupationalRoleCandidateV0_1 = Readonly<{
  candidateId: string;
  candidateStatus: "SOURCE_ROLE_CATEGORY_CANDIDATE" | "EXISTING_RESEARCH_HYPOTHESIS";
  sourceProfileId: typeof ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1;
  sourceArtifactSha256: typeof ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1;
  sourceRecordId: string;
  senseId: string;
  sourceRecord: Readonly<{
    physicalRecordOrdinal: number;
    senseOrdinal: number;
    entryLocator: string;
    rawEntryId: string | null;
    lemma: string;
    partOfSpeech: string | null;
    glosses: readonly string[];
    pronunciationIpa: readonly Readonly<{ soundIndex: number; ipa: string }>[];
    categories: readonly Readonly<{ name: string; source: string | null; orig: string | null; langcode: string | null }>[];
    etymologyText: string | null;
    etymologyTemplates: readonly Readonly<{ name: string; args: Readonly<Record<string, string>>; expansion: string }>[];
    etymologyLinks: readonly Readonly<{
      form: string;
      reference: string;
      direction: "TARGET_RECORD_REFERENCES_SOURCE_FORM";
      resolution: "SOURCE_ROWS_FOUND" | "SOURCE_ROW_NOT_FOUND" | "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN";
      resolvedSourceRows: readonly Readonly<{ sourceRecordId: string; entryLocator: string; physicalRecordOrdinal: number; senseIds: readonly string[] }>[];
    }>[];
  }>;
  suffixDiscoveryMatches: readonly ("-tar" | "-ar" | "-ës")[];
  sourceDerivedRelations: readonly Readonly<{
    baseLemma: string;
    baseSourceRecordId: string;
    baseEntryLocator: string;
    basePhysicalRecordOrdinal: number;
    baseSenseIds: readonly string[];
    relationScope: "SOURCE_RECORD" | "SOURCE_SENSE";
    relationIndex: number;
    direction: "BASE_RECORD_LISTS_TARGET_AS_DERIVED_FORM";
  }>[];
  ontology: Readonly<{
    release: "Open English WordNet 2025";
    artifactSha256: typeof OEWN_2025_SHA256_V0_1;
    exactGlossTerms: readonly string[];
    status: "TYPED_WORKER_PATHS_OBSERVED" | "EXACT_GLOSS_SENSES_FOUND" | "EXACT_GLOSS_SENSES_NOT_FOUND";
    senses: readonly AlbanianOccupationalRoleOewnSenseV0_1[];
  }>;
  researchHypothesis: ResearchHypothesisCandidateEvidenceV0_1 | null;
  functionalOperation: null;
  productionAuthorization: "NOT_AUTHORIZED";
  embryoFunction: "UNKNOWN_OR_NULL";
  historicalRelation: "NOT_CLAIMED";
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
  reasonCodes: readonly string[];
  claimBoundary: string;
}>;

export type AlbanianOccupationalRoleCandidateBatchV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_OCCUPATIONAL_ROLE_BATCH_SCHEMA_V0_1;
  sourceProfileId: typeof ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1;
  sourceArtifactSha256: typeof ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1;
  sourceArtifactBytes: 67438537;
  sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl";
  sourceUpstream: "English Wiktionary → Wiktextract → Kaikki Albanian JSONL";
  sourceLicenses: readonly ["CC BY-SA 4.0", "GFDL"];
  sourceAttributionRequired: true;
  oewnArtifactSha256: typeof OEWN_2025_SHA256_V0_1;
  oewnArtifactBytes: 9986555;
  oewnReleaseDate: "2025-12-31";
  oewnLicense: "CC BY 4.0";
  oewnAttribution: readonly ["Princeton WordNet", "Open English WordNet Community"];
  suffixScan: Readonly<{
    endings: readonly ["-tar", "-ar", "-ës"];
    sourceRowsScanned: number;
    suffixRows: number;
    uniqueSuffixLemmas: number;
    suffixSenseCount: number;
    sourceCategorySenseCount: number;
    candidateSenseCount: number;
    selectedUniqueLemmaCount: number;
    excludedSuffixSenseCount: number;
    sourceDerivedRelationCount: number;
    targetEtymologyReferenceCount: number;
    targetLexicalEtymologyReferenceCount: number;
    targetEtymologyCandidateSenseCount: number;
    uniqueSourceDerivedFormEdgeCount: number;
    exactOewnSenseCount: number;
    exactOewnCandidateSenseCount: number;
    typedWorkerPathSenseCount: number;
    typedWorkerCandidateSenseCount: number;
    existingFunctionalGateEvidenceCandidateSenseCount: number;
  }>;
  candidates: readonly AlbanianOccupationalRoleCandidateV0_1[];
}>;

export type AlbanianSuffixDiscoveryInventoryV0_1 = Readonly<{
  schemaVersion: "open-instrument.albanian-suffix-discovery-inventory.v0_1";
  sourceProfileId: typeof ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1;
  sourceArtifactSha256: typeof ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1;
  sourceArtifactBytes: 67438537;
  sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl";
  sourceUpstream: "English Wiktionary → Wiktextract → Kaikki Albanian JSONL";
  sourceLicenses: readonly ["CC BY-SA 4.0", "GFDL"];
  sourceAttributionRequired: true;
  oewnRelease: "Open English WordNet 2025";
  oewnArtifactSha256: typeof OEWN_2025_SHA256_V0_1;
  oewnArtifactBytes: 9986555;
  oewnReleaseDate: "2025-12-31";
  oewnLicense: "CC BY 4.0";
  oewnAttribution: readonly ["Princeton WordNet", "Open English WordNet Community"];
  discoveryEndings: readonly ["-tar", "-ar", "-ës"];
  sourceRowsScanned: number;
  suffixRows: number;
  suffixSenseCount: number;
  summary: Readonly<{
    sourceCategorySenseCount: number;
    candidateSenseCount: number;
    excludedSuffixSenseCount: number;
    sourceDerivedRelationCount: number;
    uniqueSourceDerivedFormEdgeCount: number;
    targetEtymologyReferenceCount: number;
    targetLexicalEtymologyReferenceCount: number;
    exactOewnSenseCount: number;
    exactOewnCandidateSenseCount: number;
    typedWorkerPathSenseCount: number;
    typedWorkerCandidateSenseCount: number;
    unresolvedExactOewnCandidateSenseCount: number;
  }>;
  records: readonly Readonly<{
    sourceRecordId: string;
    entryLocator: string;
    physicalRecordOrdinal: number;
    rawEntryId: string | null;
    lemma: string;
    partOfSpeech: string | null;
    suffixDiscoveryMatches: readonly ("-tar" | "-ar" | "-ës")[];
    sourceDerivedRelations: AlbanianOccupationalRoleCandidateV0_1["sourceDerivedRelations"];
    etymologyText: string | null;
    etymologyTemplates: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyTemplates"];
    etymologyLinks: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyLinks"];
    senses: readonly Readonly<{
      senseId: string | null;
      senseOrdinal: number;
      glosses: readonly string[];
      categories: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["categories"];
      exactOewnGlossTerms: readonly string[];
      ontology: AlbanianOccupationalRoleCandidateV0_1["ontology"];
      reasonCodes: readonly string[];
    }>[];
  }>[];
}>;

export type AlbanianOccupationalRoleCandidateBatchBuildV0_1 = Readonly<{
  batch: AlbanianOccupationalRoleCandidateBatchV0_1;
  suffixDiscoveryInventory: AlbanianSuffixDiscoveryInventoryV0_1;
}>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const result = value.normalize("NFC").trim();
  return result || null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter((item): item is string => item !== null) : [];
}

function sourceRecordId(lemma: string, matchOrdinal: number): string {
  return `kaikki-albanian-jsonl:word=${encodeURIComponent(lemma)}:ordinal=${matchOrdinal}`;
}

function entryLocator(lemma: string, matchOrdinal: number): string {
  return `jsonl://word/${encodeURIComponent(lemma)}/match/${matchOrdinal}`;
}

export function albanianSuffixDiscoveryMatchesV0_1(lemma: string): ("-tar" | "-ar" | "-ës")[] {
  const normalized = lemma.normalize("NFC").toLocaleLowerCase("sq-AL");
  return (["-tar", "-ar", "-ës"] as const).filter((suffix) => normalized.endsWith(suffix.slice(1)));
}

function isExactOccupationsCategory(value: unknown): value is UnknownRecord {
  return isRecord(value) && value.name === "Occupations" && value.orig === "sq:Occupations" && value.langcode === "sq" &&
    (value.source === "w" || value.source === "w+disamb");
}

function normalizedGlossTerm(value: string): string {
  return value.normalize("NFC").trim().replace(/^(?:a|an|the)\s+/iu, "").replace(/\s+/gu, " ").toLocaleLowerCase("en-US");
}

function exactGlossTerms(glosses: readonly string[]): string[] {
  const terms = glosses.flatMap((gloss) => gloss
    .replace(/\([^)]*\)/gu, " ")
    .split(/[;,]/u)
    .map(normalizedGlossTerm)
    .filter(Boolean));
  return [...new Set(terms)];
}

type OewnSenseInput = Readonly<{ id: string; synset: string }>;

function allPathsToWorker(
  start: string,
  synsets: Readonly<Record<string, unknown>>,
): AlbanianOccupationalRoleOewnSenseV0_1["typedHypernymPaths"] {
  const worker = "09655706-n";
  const results: Array<Readonly<{ synsetId: string; members: readonly string[]; definitions: readonly string[] }[]>> = [];
  const walk = (current: string, path: string[], active: Set<string>): void => {
    if (active.has(current) || path.length > 32) return;
    const record = synsets[current];
    if (!isRecord(record)) return;
    const nextPath = [...path, current];
    if (current === worker) {
      results.push(nextPath.map((synsetId) => {
        const node = isRecord(synsets[synsetId]) ? synsets[synsetId] as UnknownRecord : {};
        return Object.freeze({
          synsetId,
          members: Object.freeze(stringArray(node.members)),
          definitions: Object.freeze(stringArray(node.definition)),
        });
      }));
      return;
    }
    const parentIds = [
      ...stringArray(record.hypernym),
      ...stringArray(record.instance_hypernym),
    ].sort();
    const nextActive = new Set(active).add(current);
    parentIds.forEach((parent) => walk(parent, nextPath, nextActive));
  };
  walk(start, [], new Set());
  return Object.freeze(results.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))));
}

function ontologyForGlossesV0_1(
  glosses: readonly string[],
  entriesByNormalizedLemma: ReadonlyMap<string, { lemma: string; senses: readonly OewnSenseInput[] }>,
  synsets: Readonly<Record<string, unknown>>,
): AlbanianOccupationalRoleCandidateV0_1["ontology"] {
  const terms = exactGlossTerms(glosses);
  const senses = terms.flatMap((term) => {
    const entry = entriesByNormalizedLemma.get(term);
    return entry?.senses.map((sense) => {
      const synset = synsets[sense.synset];
      const definitions = isRecord(synset) ? stringArray(synset.definition) : [];
      return Object.freeze({
        lemma: entry.lemma,
        senseId: sense.id,
        synsetId: sense.synset,
        definitions: Object.freeze(definitions),
        typedHypernymPaths: allPathsToWorker(sense.synset, synsets),
      });
    }) ?? [];
  }).sort((left, right) => left.senseId.localeCompare(right.senseId));
  const typedCount = senses.filter((sense) => sense.typedHypernymPaths.length > 0).length;
  return Object.freeze({
    release: "Open English WordNet 2025",
    artifactSha256: OEWN_2025_SHA256_V0_1,
    exactGlossTerms: Object.freeze(terms),
    status: typedCount > 0
      ? "TYPED_WORKER_PATHS_OBSERVED"
      : senses.length > 0 ? "EXACT_GLOSS_SENSES_FOUND" : "EXACT_GLOSS_SENSES_NOT_FOUND",
    senses: Object.freeze(senses),
  });
}

function targetEtymologyLinks(
  record: UnknownRecord,
  rowByLemma: ReadonlyMap<string, readonly { record: UnknownRecord; physicalRecordOrdinal: number; lemma: string; matchOrdinal: number }[]>,
): AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyLinks"] {
  const raw = Array.isArray(record.etymology_links) ? record.etymology_links : [];
  return Object.freeze(raw.flatMap((item) => {
    if (!Array.isArray(item) || item.length < 2) return [];
    const form = text(item[0]);
    const reference = text(item[1]);
    if (!form || !reference) return [];
    const languageAnchor = reference.slice(reference.lastIndexOf("#") + 1).trim().toLocaleLowerCase("en-US");
    const hasExplicitAlbanianLanguageAnchor = reference.includes("#") && languageAnchor === "albanian";
    const rows = hasExplicitAlbanianLanguageAnchor ? rowByLemma.get(form) ?? [] : [];
    const resolvedSourceRows = rows.map((row) => Object.freeze({
      sourceRecordId: sourceRecordId(row.lemma, row.matchOrdinal),
      entryLocator: entryLocator(row.lemma, row.matchOrdinal),
      physicalRecordOrdinal: row.physicalRecordOrdinal,
      senseIds: Object.freeze(Array.isArray(row.record.senses)
        ? row.record.senses.flatMap((sense) => isRecord(sense) && typeof sense.id === "string" ? [sense.id] : [])
        : []),
    }));
    return [Object.freeze({
      form,
      reference,
      direction: "TARGET_RECORD_REFERENCES_SOURCE_FORM" as const,
      resolution: !hasExplicitAlbanianLanguageAnchor
        ? "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN" as const
        : resolvedSourceRows.length ? "SOURCE_ROWS_FOUND" as const : "SOURCE_ROW_NOT_FOUND" as const,
      resolvedSourceRows: Object.freeze(resolvedSourceRows),
    })];
  }));
}

function etymologyTemplates(record: UnknownRecord): AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyTemplates"] {
  if (!Array.isArray(record.etymology_templates)) return Object.freeze([]);
  return Object.freeze(record.etymology_templates.flatMap((raw) => {
    if (!isRecord(raw) || typeof raw.name !== "string" || !isRecord(raw.args)) return [];
    const args = Object.fromEntries(Object.entries(raw.args).flatMap(([key, value]) => typeof value === "string" ? [[key, value]] : []));
    return [Object.freeze({ name: raw.name, args: Object.freeze(args), expansion: typeof raw.expansion === "string" ? raw.expansion : "" })];
  }));
}

export function buildAlbanianOccupationalRoleCandidateBatchV0_1(input: Readonly<{
  sourceRows: readonly unknown[];
  oewnEntries: Readonly<Record<string, unknown>>;
  oewnSynsets: Readonly<Record<string, unknown>>;
  sourceRowsScanned?: number;
}>): AlbanianOccupationalRoleCandidateBatchBuildV0_1 {
  const rows = input.sourceRows.flatMap((value, physicalRecordOrdinal) => isRecord(value)
    ? [{ record: value, physicalRecordOrdinal }]
    : []);
  const matchOrdinals = new Map<string, number>();
  const identities = rows.map(({ record, physicalRecordOrdinal }) => {
    const lemma = text(record.word) ?? "";
    const ordinal = matchOrdinals.get(lemma) ?? 0;
    matchOrdinals.set(lemma, ordinal + 1);
    return { record, physicalRecordOrdinal, lemma, matchOrdinal: ordinal };
  });
  const albanianIdentities = identities.filter((row) => row.record.lang_code === "sq");
  const rowByLemma = new Map<string, typeof identities>();
  albanianIdentities.forEach((row) => rowByLemma.set(row.lemma, [...(rowByLemma.get(row.lemma) ?? []), row]));
  const suffixRows = albanianIdentities.filter((row) => albanianSuffixDiscoveryMatchesV0_1(row.lemma).length > 0);
  const suffixSenseCount = suffixRows.reduce((total, row) => total + (Array.isArray(row.record.senses) ? row.record.senses.length : 0), 0);
  const sourceResearchManifest = rawResearchHypotheses as unknown as ResearchHypothesisManifestV0_1;
  const seedSenseKeys = new Set(sourceResearchManifest.assertions
    .filter((assertion) => assertion.sourceProfileId === ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1 &&
      assertion.sourceArtifactSha256 === ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1)
    .map((assertion) => `${assertion.targetLemma.normalize("NFC")}\u0000${assertion.senseId}`));
  const selected = suffixRows.flatMap((row) => {
    const senses = Array.isArray(row.record.senses) ? row.record.senses : [];
    return senses.flatMap((rawSense, senseOrdinal) => {
      if (!isRecord(rawSense)) return [];
      const senseId = text(rawSense.id);
      const categories = Array.isArray(rawSense.categories) ? rawSense.categories.filter(isRecord) : [];
      const hasOccupationalCategory = categories.some(isExactOccupationsCategory);
      return senseId && ((hasOccupationalCategory && row.record.pos === "noun") || seedSenseKeys.has(`${row.lemma.normalize("NFC")}\u0000${senseId}`))
        ? [{ ...row, sense: rawSense, senseId, senseOrdinal, categories }]
        : [];
    });
  }).sort((left, right) => left.physicalRecordOrdinal - right.physicalRecordOrdinal || left.senseOrdinal - right.senseOrdinal);

  const derivedByTarget = new Map<string, AlbanianOccupationalRoleCandidateV0_1["sourceDerivedRelations"]>();
  albanianIdentities.forEach((base) => {
    const addRelations = (raw: unknown, baseSenseId: string | null, relationScope: "SOURCE_RECORD" | "SOURCE_SENSE", relationOffset: number): void => {
      if (!Array.isArray(raw)) return;
      raw.forEach((item, index) => {
        const target = isRecord(item) ? text(item.word) : text(item);
        if (!target) return;
        const relation = Object.freeze({
          baseLemma: base.lemma,
          baseSourceRecordId: sourceRecordId(base.lemma, base.matchOrdinal),
          baseEntryLocator: entryLocator(base.lemma, base.matchOrdinal),
          basePhysicalRecordOrdinal: base.physicalRecordOrdinal,
          baseSenseIds: Object.freeze(baseSenseId ? [baseSenseId] : []),
          relationScope,
          relationIndex: relationOffset + index,
          direction: "BASE_RECORD_LISTS_TARGET_AS_DERIVED_FORM" as const,
        });
        derivedByTarget.set(target, Object.freeze([...(derivedByTarget.get(target) ?? []), relation]));
      });
    };
    const rootDerived = Array.isArray(base.record.derived) ? base.record.derived : [];
    addRelations(rootDerived, null, "SOURCE_RECORD", 0);
    if (Array.isArray(base.record.senses)) {
      let senseDerivedOffset = rootDerived.length;
      base.record.senses.forEach((sense) => {
        if (isRecord(sense)) {
          const senseDerived = Array.isArray(sense.derived) ? sense.derived : [];
          addRelations(senseDerived, text(sense.id), "SOURCE_SENSE", senseDerivedOffset);
          senseDerivedOffset += senseDerived.length;
        }
      });
    }
  });

  const oewnEntriesByNormalizedLemma = new Map<string, { lemma: string; senses: readonly OewnSenseInput[] }>();
  Object.entries(input.oewnEntries).forEach(([lemma, raw]) => {
    const normalized = normalizedGlossTerm(lemma.replace(/_/gu, " "));
    if (!isRecord(raw) || !isRecord(raw.n) || !Array.isArray(raw.n.sense)) return;
    const senses = raw.n.sense.flatMap((sense) => isRecord(sense) && typeof sense.id === "string" && typeof sense.synset === "string"
      ? [{ id: sense.id, synset: sense.synset }]
      : []).sort((left, right) => left.id.localeCompare(right.id));
    oewnEntriesByNormalizedLemma.set(normalized, { lemma, senses });
  });

  const candidates = selected.map((candidate): AlbanianOccupationalRoleCandidateV0_1 => {
    const glosses = stringArray(candidate.sense.glosses);
    const terms = exactGlossTerms(glosses);
    const ontology = ontologyForGlossesV0_1(glosses, oewnEntriesByNormalizedLemma, input.oewnSynsets);
    const stableOewnSenses = ontology.senses;
    const targetRecord = candidate.record;
    const ipa = Array.isArray(targetRecord.sounds) ? targetRecord.sounds.flatMap((sound, soundIndex) =>
      isRecord(sound) && typeof sound.ipa === "string" && sound.ipa.trim()
        ? [{ soundIndex, ipa: sound.ipa.trim() }]
        : []) : [];
    const roleCategoryCount = candidate.categories.filter(isExactOccupationsCategory).length;
    const researchAssertion = seedSenseKeys.has(`${candidate.lemma.normalize("NFC")}\u0000${candidate.senseId}`);
    const baseRows = derivedByTarget.get(candidate.lemma) ?? Object.freeze([]);
    const categoryEvidence = candidate.categories.flatMap((category) => typeof category.name === "string" ? [Object.freeze({
      name: text(category.name) ?? "unknown",
      source: text(category.source),
      orig: text(category.orig),
      langcode: text(category.langcode),
    })] : []);
    const etymologyLinks = targetEtymologyLinks(candidate.record, rowByLemma);
    const reasonCodes = [
      roleCategoryCount > 0 ? "SOURCE_OCCUPATIONS_CATEGORY_ATTESTED" : "EXISTING_RESEARCH_HYPOTHESIS_RETAINED",
      baseRows.length > 0 ? "SOURCE_DERIVED_FORM_LINK_PRESENT" : "SOURCE_DERIVED_FORM_LINK_NOT_FOUND",
      etymologyLinks.length > 0 ? "TARGET_SOURCE_ETYMOLOGY_REFERENCES_PRESENT" : "TARGET_SOURCE_ETYMOLOGY_REFERENCES_NOT_FOUND",
      stableOewnSenses.length > 0 ? "OEWN_EXACT_GLOSS_TERMS_HAVE_NOUN_SENSES" : "OEWN_EXACT_GLOSS_TERMS_NOT_FOUND",
      stableOewnSenses.some((sense) => sense.typedHypernymPaths.length > 0)
        ? "OEWN_TYPED_WORKER_HYPERNYM_PATH_OBSERVED"
        : "OEWN_TYPED_WORKER_HYPERNYM_PATH_NOT_ESTABLISHED",
      !ipa.length ? "SOURCE_IPA_NOT_PRESENT" : "SOURCE_IPA_OBSERVATION_PRESENT",
    ];
    return Object.freeze({
      candidateId: `albanian-role-candidate:${encodeURIComponent(candidate.senseId)}`,
      candidateStatus: researchAssertion ? "EXISTING_RESEARCH_HYPOTHESIS" : "SOURCE_ROLE_CATEGORY_CANDIDATE",
      sourceProfileId: ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1,
      sourceArtifactSha256: ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1,
      sourceRecordId: sourceRecordId(candidate.lemma, candidate.matchOrdinal),
      senseId: candidate.senseId,
      sourceRecord: Object.freeze({
        physicalRecordOrdinal: candidate.physicalRecordOrdinal,
        senseOrdinal: candidate.senseOrdinal,
        entryLocator: entryLocator(candidate.lemma, candidate.matchOrdinal),
        rawEntryId: text(candidate.record.id),
        lemma: candidate.lemma,
        partOfSpeech: text(candidate.record.pos),
        glosses: Object.freeze(glosses),
        pronunciationIpa: Object.freeze(ipa),
        categories: Object.freeze(categoryEvidence),
        etymologyText: text(candidate.record.etymology_text),
        etymologyTemplates: etymologyTemplates(candidate.record),
        etymologyLinks,
      }),
      suffixDiscoveryMatches: Object.freeze(albanianSuffixDiscoveryMatchesV0_1(candidate.lemma)),
      sourceDerivedRelations: baseRows,
      ontology,
      researchHypothesis: null,
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
      embryoFunction: "UNKNOWN_OR_NULL",
      historicalRelation: "NOT_CLAIMED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
      reasonCodes: Object.freeze(reasonCodes),
      claimBoundary: "Suffixes are discovery filters only. Source category and lexical records are descriptive evidence; OEWN matches are English-ontology observations, not Albanian sense adjudication or functional authorization. No embryo meaning, historical relation, unique winner, or production operation is claimed.",
    });
  });

  const withResearch = candidates.map((candidate) => Object.freeze({
    ...candidate,
    researchHypothesis: projectExistingHypothesisV0_1(candidate),
  }));
  const exactRoleSenseCount = suffixRows.reduce((count, row) => {
    const senses = Array.isArray(row.record.senses) ? row.record.senses : [];
    return count + (row.record.pos === "noun"
      ? senses.filter((sense) => isRecord(sense) && Array.isArray(sense.categories) && sense.categories.some(isExactOccupationsCategory)).length
      : 0);
  }, 0);
  const sourceDerivedRelationCount = withResearch.reduce((count, candidate) => count + candidate.sourceDerivedRelations.length, 0);
  const targetEtymologyReferenceCount = withResearch.reduce((count, candidate) => count + candidate.sourceRecord.etymologyLinks.length, 0);
  const targetLexicalEtymologyReferenceCount = withResearch.reduce((count, candidate) => count + candidate.sourceRecord.etymologyLinks.filter((link) =>
    !link.form.startsWith("-") && !link.form.startsWith("*") && link.reference.endsWith("#Albanian") && rowByLemma.has(link.form),
  ).length, 0);
  const targetEtymologyCandidateSenseCount = withResearch.filter((candidate) => candidate.sourceRecord.etymologyLinks.length > 0).length;
  const uniqueSourceDerivedFormEdgeCount = new Set(withResearch.flatMap((candidate) => candidate.sourceDerivedRelations.map((relation) => `${relation.baseSourceRecordId}\u0000${candidate.sourceRecord.lemma}`))).size;
  const exactOewnSenseCount = withResearch.reduce((count, candidate) => count + candidate.ontology.senses.length, 0);
  const exactOewnCandidateSenseCount = withResearch.filter((candidate) => candidate.ontology.senses.length > 0).length;
  const typedWorkerPathSenseCount = withResearch.reduce((count, candidate) => count + candidate.ontology.senses.filter((sense) => sense.typedHypernymPaths.length > 0).length, 0);
  const typedWorkerCandidateSenseCount = withResearch.filter((candidate) => candidate.ontology.senses.some((sense) => sense.typedHypernymPaths.length > 0)).length;
  // Evidence-shape count only; this does not count executed AGENT bridge outputs.
  const existingFunctionalGateEvidenceCandidateSenseCount = withResearch.filter((candidate) => {
    const row = identities.find((item) =>
      item.lemma === candidate.sourceRecord.lemma && item.physicalRecordOrdinal === candidate.sourceRecord.physicalRecordOrdinal,
    );
    if (!row || row.record.pos !== "noun") return false;
    const qualifyingSenses = Array.isArray(row.record.senses) ? row.record.senses.filter((sense) =>
      isRecord(sense) && text(sense.id) && stringArray(sense.glosses).length > 0 && Array.isArray(sense.categories) &&
      sense.categories.filter((category) => isRecord(category) && category.name === "Occupations" && category.orig === "sq:Occupations" && category.langcode === "sq" && category.source === "w").length === 1,
    ) : [];
    if (qualifyingSenses.length !== 1) return false;
    return candidate.sourceDerivedRelations.some((relation) => {
      const primaryRow = rowByLemma.get(relation.baseLemma)?.find((item) => item.record.pos !== "name");
      if (!primaryRow || sourceRecordId(primaryRow.lemma, primaryRow.matchOrdinal) !== relation.baseSourceRecordId || relation.relationIndex >= 39) return false;
      const matchingLinks = candidate.sourceRecord.etymologyLinks.filter((link) =>
        link.form.normalize("NFC").toLocaleLowerCase("sq-AL") === relation.baseLemma.normalize("NFC").toLocaleLowerCase("sq-AL"),
      );
      return matchingLinks.length === 1 && matchingLinks[0]?.reference.normalize("NFC").trim() === `${relation.baseLemma}#Albanian`;
    });
  }).length;

  const batch: AlbanianOccupationalRoleCandidateBatchV0_1 = Object.freeze({
    schemaVersion: ALBANIAN_OCCUPATIONAL_ROLE_BATCH_SCHEMA_V0_1,
    sourceProfileId: ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1,
    sourceArtifactSha256: ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1,
    sourceArtifactBytes: 67438537,
    sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
    sourceUpstream: "English Wiktionary → Wiktextract → Kaikki Albanian JSONL",
    sourceLicenses: Object.freeze(["CC BY-SA 4.0", "GFDL"] as const),
    sourceAttributionRequired: true,
    oewnArtifactSha256: OEWN_2025_SHA256_V0_1,
    oewnArtifactBytes: 9986555,
    oewnReleaseDate: "2025-12-31",
    oewnLicense: "CC BY 4.0",
    oewnAttribution: Object.freeze(["Princeton WordNet", "Open English WordNet Community"] as const),
    suffixScan: Object.freeze({
      endings: Object.freeze(["-tar", "-ar", "-ës"] as const),
      sourceRowsScanned: input.sourceRowsScanned ?? rows.length,
      suffixRows: suffixRows.length,
      uniqueSuffixLemmas: new Set(suffixRows.map((row) => row.lemma)).size,
      suffixSenseCount,
      sourceCategorySenseCount: exactRoleSenseCount,
      candidateSenseCount: withResearch.length,
      selectedUniqueLemmaCount: new Set(withResearch.map((candidate) => candidate.sourceRecord.lemma)).size,
      excludedSuffixSenseCount: suffixSenseCount - withResearch.length,
      sourceDerivedRelationCount,
      targetEtymologyReferenceCount,
      targetLexicalEtymologyReferenceCount,
      targetEtymologyCandidateSenseCount,
      uniqueSourceDerivedFormEdgeCount,
      exactOewnSenseCount,
      exactOewnCandidateSenseCount,
      typedWorkerPathSenseCount,
      typedWorkerCandidateSenseCount,
      existingFunctionalGateEvidenceCandidateSenseCount,
    }),
    candidates: Object.freeze(withResearch),
  });
  const inventoryRecords = suffixRows.map((row) => {
    const sourceDerived = derivedByTarget.get(row.lemma) ?? Object.freeze([]);
    const etymologyLinks = targetEtymologyLinks(row.record, rowByLemma);
    const senses = (Array.isArray(row.record.senses) ? row.record.senses : []).flatMap((rawSense, senseOrdinal) => {
      if (!isRecord(rawSense)) return [];
      const glosses = stringArray(rawSense.glosses);
      const categories = Array.isArray(rawSense.categories) ? rawSense.categories.filter(isRecord).flatMap((category) =>
        typeof category.name === "string" ? [Object.freeze({
          name: text(category.name) ?? "unknown",
          source: text(category.source),
          orig: text(category.orig),
          langcode: text(category.langcode),
        })] : [],
      ) : [];
      const ontology = ontologyForGlossesV0_1(glosses, oewnEntriesByNormalizedLemma, input.oewnSynsets);
      const senseId = text(rawSense.id);
      return [Object.freeze({
        senseId,
        senseOrdinal,
        glosses: Object.freeze(glosses),
        categories: Object.freeze(categories),
        exactOewnGlossTerms: ontology.exactGlossTerms,
        ontology,
        reasonCodes: Object.freeze([
          senseId ? null : "SOURCE_SENSE_ID_NOT_PROVIDED",
          glosses.length ? null : "SOURCE_GLOSS_NOT_PROVIDED",
          ontology.senses.length ? null : "OEWN_EXACT_GLOSS_SENSES_NOT_FOUND",
          ontology.senses.some((sense) => sense.typedHypernymPaths.length > 0) ? null : "OEWN_TYPED_WORKER_PATH_NOT_ESTABLISHED",
        ].filter((reason): reason is string => reason !== null)),
      })];
    });
    return Object.freeze({
      sourceRecordId: sourceRecordId(row.lemma, row.matchOrdinal),
      entryLocator: entryLocator(row.lemma, row.matchOrdinal),
      physicalRecordOrdinal: row.physicalRecordOrdinal,
      rawEntryId: text(row.record.id),
      lemma: row.lemma,
      partOfSpeech: text(row.record.pos),
      suffixDiscoveryMatches: Object.freeze(albanianSuffixDiscoveryMatchesV0_1(row.lemma)),
      sourceDerivedRelations: sourceDerived,
      etymologyText: text(row.record.etymology_text),
      etymologyTemplates: etymologyTemplates(row.record),
      etymologyLinks,
      senses: Object.freeze(senses),
    });
  });
  const inventorySenses = inventoryRecords.flatMap((record) => record.senses);
  const inventorySourceCategorySenseCount = inventoryRecords.reduce((count, record) => count +
    (record.partOfSpeech === "noun"
      ? record.senses.filter((sense) => sense.categories.some(isExactOccupationsCategory)).length
      : 0), 0);
  const inventorySourceDerivedRelationCount = inventoryRecords.reduce((count, record) => count + record.sourceDerivedRelations.length, 0);
  const inventoryTargetEtymologyReferenceCount = inventoryRecords.reduce((count, record) => count + record.etymologyLinks.length, 0);
  const inventoryTargetLexicalEtymologyReferenceCount = inventoryRecords.reduce((count, record) => count + record.etymologyLinks.filter((link) =>
    !link.form.startsWith("-") && !link.form.startsWith("*") && link.reference.endsWith("#Albanian") && rowByLemma.has(link.form),
  ).length, 0);
  const inventoryExactOewnSenseCount = inventorySenses.reduce((count, sense) => count + sense.ontology.senses.length, 0);
  const inventoryExactOewnCandidateSenseCount = inventorySenses.filter((sense) => sense.ontology.senses.length > 0).length;
  const inventoryTypedWorkerPathSenseCount = inventorySenses.reduce((count, sense) => count +
    sense.ontology.senses.filter((ontologySense) => ontologySense.typedHypernymPaths.length > 0).length, 0);
  const inventoryTypedWorkerCandidateSenseCount = inventorySenses.filter((sense) =>
    sense.ontology.senses.some((ontologySense) => ontologySense.typedHypernymPaths.length > 0),
  ).length;
  const inventoryUniqueSourceDerivedFormEdgeCount = new Set(inventoryRecords.flatMap((record) => record.sourceDerivedRelations.map((relation) =>
    `${relation.baseSourceRecordId}\u0000${record.lemma}`,
  ))).size;
  return Object.freeze({
    batch,
    suffixDiscoveryInventory: Object.freeze({
      schemaVersion: "open-instrument.albanian-suffix-discovery-inventory.v0_1",
      sourceProfileId: ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1,
      sourceArtifactSha256: ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1,
      sourceArtifactBytes: 67438537,
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sourceUpstream: "English Wiktionary → Wiktextract → Kaikki Albanian JSONL",
      sourceLicenses: Object.freeze(["CC BY-SA 4.0", "GFDL"] as const),
      sourceAttributionRequired: true,
      oewnRelease: "Open English WordNet 2025",
      oewnArtifactSha256: OEWN_2025_SHA256_V0_1,
      oewnArtifactBytes: 9986555,
      oewnReleaseDate: "2025-12-31",
      oewnLicense: "CC BY 4.0",
      oewnAttribution: Object.freeze(["Princeton WordNet", "Open English WordNet Community"] as const),
      discoveryEndings: Object.freeze(["-tar", "-ar", "-ës"] as const),
      sourceRowsScanned: input.sourceRowsScanned ?? rows.length,
      suffixRows: suffixRows.length,
      suffixSenseCount,
      summary: Object.freeze({
        sourceCategorySenseCount: inventorySourceCategorySenseCount,
        candidateSenseCount: withResearch.length,
        excludedSuffixSenseCount: suffixSenseCount - withResearch.length,
        sourceDerivedRelationCount: inventorySourceDerivedRelationCount,
        uniqueSourceDerivedFormEdgeCount: inventoryUniqueSourceDerivedFormEdgeCount,
        targetEtymologyReferenceCount: inventoryTargetEtymologyReferenceCount,
        targetLexicalEtymologyReferenceCount: inventoryTargetLexicalEtymologyReferenceCount,
        exactOewnSenseCount: inventoryExactOewnSenseCount,
        exactOewnCandidateSenseCount: inventoryExactOewnCandidateSenseCount,
        typedWorkerPathSenseCount: inventoryTypedWorkerPathSenseCount,
        typedWorkerCandidateSenseCount: inventoryTypedWorkerCandidateSenseCount,
        unresolvedExactOewnCandidateSenseCount: inventorySenses.filter((sense) => sense.ontology.senses.length === 0).length,
      }),
      records: Object.freeze(inventoryRecords),
    }),
  });
}

function projectExistingHypothesisV0_1(
  candidate: AlbanianOccupationalRoleCandidateV0_1,
): ResearchHypothesisCandidateEvidenceV0_1 | null {
  const raw = rawResearchHypotheses as unknown as ResearchHypothesisManifestV0_1;
  const originalAssertion = raw.assertions.find((assertion) =>
    assertion.sourceProfileId === candidate.sourceProfileId &&
    assertion.sourceArtifactSha256 === candidate.sourceArtifactSha256 &&
    assertion.senseId === candidate.senseId && assertion.targetLemma === candidate.sourceRecord.lemma,
  );
  if (!originalAssertion) return null;
  const sourceEvidenceId = originalAssertion.evidenceRefs.find((id) => id.startsWith("ze15.albanian."));
  if (!sourceEvidenceId) return null;
  const sourceEvidence = Object.freeze({
    evidenceId: sourceEvidenceId,
    authority: "SOURCE_ATTESTED" as const,
    sourceProfileId: candidate.sourceProfileId,
    sourceArtifactSha256: candidate.sourceArtifactSha256,
    sourceRecordId: candidate.sourceRecordId,
    senseId: candidate.senseId,
    locator: candidate.sourceRecord.entryLocator,
    note: `Exact frozen Kaikki row and sense for ${candidate.sourceRecord.lemma}; target-side prose and references remain attributed source observations.`,
  });
  const preservedOntologyEvidence = raw.evidence.filter((evidence) => {
    if (!originalAssertion.evidenceRefs.includes(evidence.evidenceId) || evidence.authority !== "ONTOLOGY_SUPPORTED" ||
      evidence.sourceProfileId !== OEWN_2025_PROFILE_ID_V0_1 || evidence.sourceArtifactSha256 !== OEWN_2025_SHA256_V0_1 ||
      evidence.senseId === "unresolved") return false;
    return candidate.ontology.senses.some((sense) =>
      sense.senseId === evidence.senseId && evidence.sourceRecordId === `${sense.senseId}|${sense.synsetId}`,
    );
  });
  const evidence = [sourceEvidence, ...preservedOntologyEvidence];
  const assertion = {
    ...originalAssertion,
    sourceRecordId: candidate.sourceRecordId,
    senseId: candidate.senseId,
    evidenceRefs: evidence.map((entry) => entry.evidenceId),
    reviewTrack: "NONE" as const,
    reviewCandidate: null,
    ownerApproval: null,
  };
  const parsed = parseResearchHypothesisManifestV0_1({
    schemaVersion: raw.schemaVersion,
    manifestId: `${raw.manifestId}.exact-batch-projection`,
    evidence,
    assertions: [assertion],
  });
  if (!parsed.ok) return null;
  return projectResearchHypothesisManifestToCandidateEvidenceV0_1(parsed.manifest)[0] ?? null;
}

const frozenBatch = rawBatch as unknown as AlbanianOccupationalRoleCandidateBatchV0_1;

export type AlbanianOccupationalRoleCandidateBatchViewV0_1 = Readonly<{
  queryForm: string;
  status: "CANDIDATES_FOUND" | "NO_CANDIDATES";
  sourceProfileId: typeof ALBANIAN_KAIKKI_FROZEN_PROFILE_V0_1;
  sourceArtifactSha256: typeof ALBANIAN_KAIKKI_FROZEN_SHA256_V0_1;
  sourceArtifactBytes: 67438537;
  sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl";
  sourceUpstream: "English Wiktionary → Wiktextract → Kaikki Albanian JSONL";
  sourceLicenses: readonly ["CC BY-SA 4.0", "GFDL"];
  sourceAttributionRequired: true;
  oewnArtifactSha256: typeof OEWN_2025_SHA256_V0_1;
  oewnArtifactBytes: 9986555;
  oewnReleaseDate: "2025-12-31";
  oewnLicense: "CC BY 4.0";
  oewnAttribution: readonly ["Princeton WordNet", "Open English WordNet Community"];
  scanSummary: AlbanianOccupationalRoleCandidateBatchV0_1["suffixScan"];
  candidates: readonly AlbanianOccupationalRoleCandidateV0_1[];
  reasonCodes: readonly string[];
  claimBoundary: string;
}>;

export function getAlbanianOccupationalRoleCandidatesForWordV0_1(
  word: unknown,
): AlbanianOccupationalRoleCandidateBatchViewV0_1 {
  const queryForm = typeof word === "string" ? word.normalize("NFC").trim() : "";
  if (!queryForm) return Object.freeze({
    queryForm,
    status: "NO_CANDIDATES",
    sourceProfileId: frozenBatch.sourceProfileId,
    sourceArtifactSha256: frozenBatch.sourceArtifactSha256,
    sourceArtifactBytes: frozenBatch.sourceArtifactBytes,
    sourceUrl: frozenBatch.sourceUrl,
    sourceUpstream: frozenBatch.sourceUpstream,
    sourceLicenses: frozenBatch.sourceLicenses,
    sourceAttributionRequired: frozenBatch.sourceAttributionRequired,
    oewnArtifactSha256: frozenBatch.oewnArtifactSha256,
    oewnArtifactBytes: frozenBatch.oewnArtifactBytes,
    oewnReleaseDate: frozenBatch.oewnReleaseDate,
    oewnLicense: frozenBatch.oewnLicense,
    oewnAttribution: frozenBatch.oewnAttribution,
    scanSummary: frozenBatch.suffixScan,
    candidates: Object.freeze([]),
    reasonCodes: Object.freeze(["QUERY_FORM_UNAVAILABLE"]),
    claimBoundary: "The bounded candidate batch is descriptive research evidence only; absence from this batch is not source absence or a negative semantic judgment.",
  });
  const key = queryForm.toLocaleLowerCase("sq-AL");
  const candidates = frozenBatch.candidates.filter((candidate) =>
    candidate.sourceRecord.lemma.normalize("NFC").toLocaleLowerCase("sq-AL") === key ||
    candidate.sourceDerivedRelations.some((relation) => relation.baseLemma.normalize("NFC").toLocaleLowerCase("sq-AL") === key) ||
    candidate.sourceRecord.etymologyLinks.some((link) => link.form.normalize("NFC").toLocaleLowerCase("sq-AL") === key),
  ).map((candidate) => Object.freeze({
    ...candidate,
    researchHypothesis: projectExistingHypothesisV0_1(candidate),
  }));
  return Object.freeze({
    queryForm,
    status: candidates.length ? "CANDIDATES_FOUND" : "NO_CANDIDATES",
    sourceProfileId: frozenBatch.sourceProfileId,
    sourceArtifactSha256: frozenBatch.sourceArtifactSha256,
    sourceArtifactBytes: frozenBatch.sourceArtifactBytes,
    sourceUrl: frozenBatch.sourceUrl,
    sourceUpstream: frozenBatch.sourceUpstream,
    sourceLicenses: frozenBatch.sourceLicenses,
    sourceAttributionRequired: frozenBatch.sourceAttributionRequired,
    oewnArtifactSha256: frozenBatch.oewnArtifactSha256,
    oewnArtifactBytes: frozenBatch.oewnArtifactBytes,
    oewnReleaseDate: frozenBatch.oewnReleaseDate,
    oewnLicense: frozenBatch.oewnLicense,
    oewnAttribution: frozenBatch.oewnAttribution,
    scanSummary: frozenBatch.suffixScan,
    candidates: Object.freeze(candidates),
    reasonCodes: Object.freeze(candidates.length ? [] : ["NO_SOURCE_ROLE_CANDIDATE_IN_BOUNDED_BATCH"]),
    claimBoundary: "Suffix endings are discovery filters only. Source category and lexical relations are descriptive facts; OEWN is independent English ontology observation, not Albanian sense adjudication. The batch never authorizes AGENT, embryo meaning, historical relation, or a unique winner; Null is preserved.",
  });
}

export function getAlbanianOccupationalRoleCandidateBatchSummaryV0_1(): AlbanianOccupationalRoleCandidateBatchV0_1["suffixScan"] {
  return frozenBatch.suffixScan;
}

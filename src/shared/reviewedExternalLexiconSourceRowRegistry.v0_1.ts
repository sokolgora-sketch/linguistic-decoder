import type { ReviewedExternalLexiconCandidateSourceRowV0_1 } from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";

export type ReviewedExternalLexiconSourceRowRegistryBoundaryV0_1 = {
  registryId: "reviewed-external-lexicon-source-row-registry.v0_1";
  productionRows: readonly ReviewedExternalLexiconCandidateSourceRowV0_1[];
  liveRowCount: number;
  hasLiveRows: boolean;
  syntheticFixtureRowsAllowed: false;
  liveCitationRequirement: "reviewed_external_metadata_required";
};

const PRODUCTION_SOURCE_ROWS_V0_1 =
  [] as const satisfies readonly ReviewedExternalLexiconCandidateSourceRowV0_1[];

export const reviewedExternalLexiconSourceRowCandidateRegistryV0_1 = [
  {
    sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
    candidateId: "albanian-di-know-functional",
    candidateLanguage: "sq",
    displayForm: "DI know knowledge candidate",
    sourceKind: "reviewed_dictionary_source",
    sourceStatus: "reviewed_accepted",
    embryo: "DI",
    isolatedStandaloneForm: "di",
    plainStandaloneGloss: "know / knowledge",
    sourceNote:
      "Reviewed citation candidate: Albanian di as a free operator meaning know/knowledge can functionally motivate study/learning. Candidate registry row only; production registry remains separately gated.",
    semanticBridge:
      "knowledge can motivate study and learning functionally without making a historical-origin claim",
    originClaim: false,
    historicalTransmissionClaim: false,
    winnerClaim: false,
    languageSuperiorityClaim: false,
    candidateTruthClaim: false,
    publicationEvidenceClaim: false,
    scientificEvidenceClaim: false,
    userDecisionPosture: "user_decides",
    externalCitations: [
      {
        citationId: "reviewed.external.di.knowledge.candidate.citation.v0_1",
        citationStatus: "reviewed_accepted",
        citationType: "dictionary_entry",
        sourceTitle: "di",
        sourceAuthorOrEditor:
          "Wiktionary contributors; citing Demiraj et al. (2021), DPEWA, and FGJSH (2006)",
        sourcePublisherOrHost: "Wiktionary / DPEWA reference listing",
        sourceDateOrVersion: "accessed 2026-07-01; Wiktionary page crawled 2026-06",
        sourceUrlOrArchiveRef: "https://en.wiktionary.org/wiki/di#Albanian",
        entryLocator: "Albanian > Etymology 1 > Verb > di: to know",
        attestedForm: "di",
        attestedGloss: "know / knowledge",
        attestedGrammarNote:
          "Albanian standalone verb di; entry lists IPA /di/, aorist dita, participle ditur, and glosses the verb as to know.",
        reviewedBy: "open-instrument-candidate-registry",
        reviewedAt: "2026-07-01",
        sourceHashOrArchiveHash: "url:https://en.wiktionary.org/wiki/di#Albanian",
        reviewNote:
          "Reviewed citation metadata intake for Albanian di as know/knowledge via stable Wiktionary entry with DPEWA/FGJSH reference trail. Direct DPEWA/FGJSH locator or archived authoritative dictionary snapshot is still required before production-live promotion.",
      },
    ],
  },

  {
    sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
    candidateId: "albanian-da-dam-damage-functional",
    displayForm: "Gheg DA split damage candidate",
    candidateLanguage: "sq",
    sourceKind: "reviewed_dictionary_source",
    sourceStatus: "reviewed_accepted",
    embryo: "DA",
    isolatedStandaloneForm: "da",
    plainStandaloneGloss: "split / divide",
    sourceNote:
      "Reviewed citation candidate: Gheg da as a free operator meaning split/divide can functionally motivate damage/harm through split/divided state. Candidate registry row only; production registry remains separately gated.",
    semanticBridge:
      "what is split or divided can motivate damage/harm without making a historical-origin claim",
    originClaim: false,
    historicalTransmissionClaim: false,
    winnerClaim: false,
    languageSuperiorityClaim: false,
    candidateTruthClaim: false,
    publicationEvidenceClaim: false,
    scientificEvidenceClaim: false,
    userDecisionPosture: "user_decides",
    externalCitations: [
      {
        citationId: "reviewed.external.gheg-da.damage.candidate.citation.v0_1",
        citationStatus: "reviewed_accepted",
        citationType: "dictionary_entry",
        sourceTitle: "Linguistic variation within the Northwestern Gheg Albanian dialect",
        sourceAuthorOrEditor: "Lindon Dedvukaj & Rexhina Ndoci",
        sourcePublisherOrHost: "Proceedings of the Linguistic Society of America",
        sourceDateOrVersion: "2023; volume 8, issue 1; article 5501",
        sourceUrlOrArchiveRef: "https://doi.org/10.3765/plsa.v8i1.5501",
        attestedForm: "da",
        attestedGloss: "to split, cut, divide",
        attestedGrammarNote:
          "Malsia/Northwestern Gheg Albanian verb form; paper lists Malsia da [dɔː] with Shkodër/Lezhë [dɔː], [ndɔː] in example (4)",
        entryLocator: "Example (4), page 3; footnote 1",
        reviewedBy: "open-instrument-candidate-registry",
        reviewedAt: "2026-06-30",
        reviewNote:
          "Reviewed citation metadata intake for Gheg da as split/cut/divide. Candidate registry row only; production registry promotion remains separately gated.",
        sourceHashOrArchiveHash: "doi:10.3765/plsa.v8i1.5501",
      },
    ],
  },
] as const satisfies readonly ReviewedExternalLexiconCandidateSourceRowV0_1[];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

function stringField(row: unknown, key: string): string {
  const record = asRecord(row);
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

function externalCitations(row: unknown): unknown[] {
  const record = asRecord(row);
  const citations = record?.externalCitations;
  return Array.isArray(citations) ? citations : [];
}

export function getReviewedExternalLexiconProductionSourceRowsV0_1(): readonly ReviewedExternalLexiconCandidateSourceRowV0_1[] {
  return PRODUCTION_SOURCE_ROWS_V0_1;
}

export function getReviewedExternalLexiconSourceRowRegistryBoundaryV0_1(): ReviewedExternalLexiconSourceRowRegistryBoundaryV0_1 {
  const productionRows = getReviewedExternalLexiconProductionSourceRowsV0_1();

  return {
    registryId: "reviewed-external-lexicon-source-row-registry.v0_1",
    productionRows,
    liveRowCount: productionRows.length,
    hasLiveRows: productionRows.length > 0,
    syntheticFixtureRowsAllowed: false,
    liveCitationRequirement: "reviewed_external_metadata_required",
  };
}

export function isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row: unknown): boolean {
  const sourceId = stringField(row, "sourceId");
  const sourceUrlRefs = externalCitations(row).map((citation) =>
    stringField(citation, "sourceUrlOrArchiveRef"),
  );
  const citationIds = externalCitations(row).map((citation) =>
    stringField(citation, "citationId"),
  );

  if (sourceId.startsWith("fixture.") || sourceId.includes(".synthetic.")) return false;
  if (citationIds.some((citationId) => citationId.startsWith("fixture."))) return false;
  if (sourceUrlRefs.some((ref) => ref.startsWith("fixture://"))) return false;
  if (sourceUrlRefs.some((ref) => ref.startsWith("pending-reviewed-external-citation:"))) return false;
  if (flattenStrings(row).some((text) => text.includes("CONTRACT TEST ONLY"))) return false;
  if (flattenStrings(row).some((text) => text.includes("NON-LIVE CANDIDATE"))) return false;

  return true;
}

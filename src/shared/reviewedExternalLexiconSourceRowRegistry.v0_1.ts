import type { ReviewedExternalLexiconCandidateSourceRowV0_1 } from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";
import { evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1 } from "./reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";

export type ReviewedExternalLexiconSourceRowRegistryBoundaryV0_1 = {
  registryId: "reviewed-external-lexicon-source-row-registry.v0_1";
  productionRows: readonly ReviewedExternalLexiconCandidateSourceRowV0_1[];
  liveRowCount: number;
  hasLiveRows: boolean;
  syntheticFixtureRowsAllowed: false;
  liveCitationRequirement: "reviewed_external_metadata_required";
};

const PRODUCTION_SOURCE_ROW_IDS_V0_1 = new Set<string>([
  "reviewed.external.di.knowledge.candidate.v0_1",
  "reviewed.external.gheg-da.damage.candidate.v0_1",
  "reviewed.external.albanian-at.father.candidate.v0_1",
]);

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
      "Reviewed production row for bounded functional lexical projection: Albanian di as a free operator meaning know/knowledge can functionally motivate study/learning. Historical origin, transmission, winner, language-superiority, publication-evidence, scientific-evidence and candidate-truth claims remain disabled; the user decides.",
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
          "Reviewed citation metadata for bounded functional lexical projection of Albanian di as know/knowledge via the stable Wiktionary entry and its DPEWA/FGJSH reference trail. A direct DPEWA/FGJSH locator or archived authoritative dictionary snapshot remains unresolved for historical-authority or stronger-source claims and is not required for this bounded lexical projection.",
      },
    ],
  },

  {
    sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
    candidateId: "albanian-at-father-functional",
    candidateLanguage: "sq",
    displayForm: "AT",
    sourceKind: "reviewed_lexical_source",
    sourceStatus: "reviewed_accepted",
    embryo: "AT",
    isolatedStandaloneForm: "at",
    plainStandaloneGloss: "father",
    sourceNote:
      "Reviewed bounded Albanian lexical row: at is attested as father in the Albanian inherited lexicon. This row supports AT as a functional father embryo only on explicitly authorized proof targets. It does not claim historical origin, transmission, winner, ownership, language superiority, publication evidence, scientific evidence, or unrestricted interpretation of the homographic modern at 'horse'.",
    semanticBridge:
      "Albanian at meaning father directly motivates the father function without making a historical-origin claim",
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
        citationId:
          "reviewed.external.albanian-at.father.citation.v0_1",
        citationStatus: "reviewed_accepted",
        citationType: "academic_lexical_reference",
        sourceTitle: "The Albanian inherited lexicon",
        sourceAuthorOrEditor:
          "Bardhyl Demiraj; database revised by Alexander Lubotsky and Michiel de Vaan",
        sourcePublisherOrHost: "IEED / ieed.ullet.net",
        sourceDateOrVersion:
          "Demiraj 1997; database compiled 1998-1999; accessed 2026-08-16",
        sourceUrlOrArchiveRef:
          "https://ieed.ullet.net/alb.html",
        entryLocator:
          "at [m] (tg) {2} 'father'; Alb. atë [m] (tg) 'father' (AE 83)",
        attestedForm: "at",
        attestedGloss: "father",
        attestedGrammarNote:
          "(tg) marks the form as both Tosk and Gheg; the entry also records Albanian atë as father.",
        reviewedBy: "open-instrument-candidate-registry",
        reviewedAt: "2026-08-16",
        reviewNote:
          "Accepted as bounded lexical evidence for AT/father functional motivation. The source is not used to assert historical origin, borrowing direction, linguistic ownership, or unrestricted homograph resolution.",
        sourceHashOrArchiveHash:
          "url:https://ieed.ullet.net/alb.html",
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
      "Reviewed source row: Gheg da as a free operator meaning split/divide can functionally motivate damage/harm through split/divided state. Production registry promotion accepted v0.1; output remains user-decidable.",
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
          "Reviewed citation metadata intake for Gheg da as split/cut/divide. Production source row promotion accepted v0.1; no historical-origin or winner claim.",
        sourceHashOrArchiveHash: "doi:10.3765/plsa.v8i1.5501",
      },
    ],
  },
  {
    sourceId: "reviewed.external.jo.refusal.candidate.v0_1",
    candidateId: "albanian-jo-standalone-refusal-functional",
    candidateLanguage: "sq",
    displayForm: "JO standalone refusal candidate",
    sourceKind: "reviewed_dictionary_source",
    sourceStatus: "reviewed_accepted",
    embryo: "JO",
    isolatedStandaloneForm: "jo",
    plainStandaloneGloss: "standalone refusal / explicit rejection",
    sourceNote:
      "Reviewed JO candidate-registry row for the bounded standalone-refusal or explicit-rejection function. Candidate registration is not production admission or runtime authorization. Historical origin, transmission, winner, language-superiority, publication-evidence, scientific-evidence, candidate-truth and general-negation ownership claims remain disabled; the user decides.",
    semanticBridge:
      "standalone refusal or explicit rejection can functionally motivate a direct negative response without claiming historical origin, unrestricted negative polarity or ownership of general grammatical negation",
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
        citationId:
          "reviewed.external.jo.refusal.candidate.citation.v0_1",
        citationStatus: "reviewed_accepted",
        citationType: "dictionary_entry",
        sourceTitle: "JO part.",
        sourceAuthorOrEditor:
          "Bardhyl Demiraj; Olav Hackstein",
        sourcePublisherOrHost:
          "Digitales Philologisch-Etymologisches Wörterbuch des Altalbanischen / Ludwig-Maximilians-Universität München",
        sourceDateOrVersion:
          "first publication 2024; source snapshot reviewed 2026-07-14",
        sourceUrlOrArchiveRef:
          "https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210",
        entryLocator:
          "DPEWA post ID 25210; exact article head JO part.; dictionary lemmaid=25210",
        attestedForm: "jo",
        attestedGloss:
          "no / not; bounded here to standalone refusal or explicit rejection",
        attestedGrammarNote:
          "Exact attested Albanian particle article JO part.; classification Simplex. The article includes broader grammatical-negation uses, but the v0.1 functional scope excludes general sentence-level negation, prefix behavior, suffix behavior, substring projection and transformed carriers.",
        reviewedBy:
          "open-instrument-source-row-design-review",
        reviewedAt: "2026-07-14",
        sourceHashOrArchiveHash:
          "f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e",
        reviewNote:
          "Candidate-specific DPEWA evidence reviewed for JO candidate-registry placement. Exact article identity, post ID, stable locator, authors, publication year, modern dictionary reference FGJSSH 745f. and source snapshot hash are preserved. Historical attestations remain contextual only. Candidate registration is not production membership or runtime authorization.",
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

export function isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
  sourceId: string,
): boolean {
  return PRODUCTION_SOURCE_ROW_IDS_V0_1.has(sourceId);
}

export function getReviewedExternalLexiconProductionSourceRowsV0_1(): readonly ReviewedExternalLexiconCandidateSourceRowV0_1[] {
  return reviewedExternalLexiconSourceRowCandidateRegistryV0_1.filter(
    (row) =>
      isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
        row.sourceId,
      ) &&
      evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(row)
        .authorized,
  );
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

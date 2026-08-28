import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "./multiSourceFunctionalResearchEvidenceRegistry.v0_1";

/**
 * First externally sourced ER research rows v0.1.
 *
 * IMPORTANT:
 *
 * These are research observations only.
 *
 * They are NOT:
 * - reviewed production evidence;
 * - runtime authorization;
 * - historical-origin proof;
 * - a single-winner etymology;
 * - candidate truth.
 *
 * The Albanian ERË rows intentionally remain `unresolved` with
 * respect to structural embryo ER. The current AllowedOpId vocabulary
 * does not authorize ER -> ERË, so lexical attestation must not be
 * converted into an embryo witness merely because the spellings are
 * close.
 *
 * Reconstructed ER evidence remains reconstruction/inference.
 *
 * Greek ἐρῆμος is independently lexically attested as
 * empty/deserted/devoid, while its ER-family relation is represented
 * only through the cited reconstructed-lexicon source.
 */

export const multiSourceFunctionalResearchEvidenceRowsErV0_1 = [
  {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

    researchEvidenceId:
      "research.external.pokorny-er5-loose-crumbly.v0_1",

    embryo: "ER",

    evidenceFamily:
      "reconstructed_lexicon",

    language:
      "Proto-Indo-European reconstruction",

    form:
      "er-",

    gloss:
      "loose, crumbly; semantic field: weak, infirm",

    embryoRelation:
      "reconstructed_form",

    relationOperationIds: [],

    /**
     * Reconstructed roots are analytical reconstructions, not directly
     * attested lexical facts.
     */
    attestationTruth:
      "inference",

    sourceStatus:
      "research_candidate",

    citations: [
      {
        citationId:
          "research.external.pokorny-er5-lrc.citation.v0_1",

        sourceTitle:
          "Indo-European Lexicon: PIE Etymon and IE Reflexes",

        sourceAuthorOrEditor:
          "Linguistics Research Center, University of Texas at Austin; etymon adapted from Julius Pokorny",

        sourcePublisherOrHost:
          "Linguistics Research Center, University of Texas at Austin",

        sourceDateOrVersion:
          "accessed 2026-08-27; page states reflex data are under active construction",

        sourceUrlOrArchiveRef:
          "https://lrc.la.utexas.edu/lex/master/0500",

        entryLocator:
          "Pokorny Etymon 5. er-, erə-, thematic (e)r-ĕ-; gloss loose, crumbly; Semantic Field Weak, Infirm",

        sourceHashOrArchiveHash:
          null,

        attestedForm:
          "er-",

        attestedGloss:
          "loose, crumbly",
      },
    ],

    functionalHypotheses: [
      {
        targetWord:
          "sterile",

        semanticBridge:
          "a reconstructed weak, infirm, loose, or reduced-cohesion state can be tested as a functional precursor to reduced productive capacity; this is a functional hypothesis, not a historical-origin claim",

        functionalBridgeTruth:
          "hypothesis",

        claimBoundary:
          "functional_hypothesis_only",
      },
    ],

    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",
  },

  {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

    researchEvidenceId:
      "research.external.greek-eremos-empty-devoid.v0_1",

    embryo: "ER",

    evidenceFamily:
      "lexical_dictionary",

    language:
      "Ancient Greek",

    form:
      "ἐρῆμος",

    gloss:
      "empty, deserted; devoid of; desolate, lonely, solitary",

    /**
     * The lexical meaning is independently attested by Logeion/LSJ.
     * The ER-family relation is supplied by the UT LRC reconstructed
     * etymon page, which lists Greek ἔρημος as a reflex under er-5.
     */
    embryoRelation:
      "reconstructed_form",

    relationOperationIds: [],

    attestationTruth:
      "fact",

    sourceStatus:
      "research_candidate",

    citations: [
      {
        citationId:
          "research.external.logeion-eremos.citation.v0_1",

        sourceTitle:
          "Logeion — ἐρῆμος",

        sourceAuthorOrEditor:
          "Logeion; lexical material including LSJ",

        sourcePublisherOrHost:
          "University of Chicago",

        sourceDateOrVersion:
          "accessed 2026-08-27",

        sourceUrlOrArchiveRef:
          "https://logeion.uchicago.edu/%E1%BC%90%CF%81%E1%BF%86%CE%BC%CE%BF%CF%82",

        entryLocator:
          "ἐρῆμος > Short Definition and LSJ senses I-II",

        sourceHashOrArchiveHash:
          null,

        attestedForm:
          "ἐρῆμος",

        attestedGloss:
          "empty, deserted; devoid of",
      },

      {
        citationId:
          "research.external.pokorny-er5-greek-reflex.citation.v0_1",

        sourceTitle:
          "Indo-European Lexicon: PIE Etymon and IE Reflexes",

        sourceAuthorOrEditor:
          "Linguistics Research Center, University of Texas at Austin; etymon adapted from Julius Pokorny",

        sourcePublisherOrHost:
          "Linguistics Research Center, University of Texas at Austin",

        sourceDateOrVersion:
          "accessed 2026-08-27; page states reflex data are under active construction",

        sourceUrlOrArchiveRef:
          "https://lrc.la.utexas.edu/lex/master/0500",

        entryLocator:
          "Hellenic > Greek reflex έρημος under Pokorny Etymon 5. er-",

        sourceHashOrArchiveHash:
          null,

        attestedForm:
          "έρημος",

        attestedGloss:
          "solitary; desert",
      },
    ],

    functionalHypotheses: [
      {
        targetWord:
          "sterile",

        semanticBridge:
          "empty, devoid, or lacking can functionally motivate absence of productive or reproductive capacity; this remains a hypothesis and does not assert that Greek ἐρῆμος is the historical origin of sterile",

        functionalBridgeTruth:
          "hypothesis",

        claimBoundary:
          "functional_hypothesis_only",
      },
    ],

    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",
  },

  /**
   * Albanian ERË I — wind / moving air.
   *
   * Lexical attestation is factual.
   * ER -> ERË relation is unresolved in the current operation contract.
   */
  {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

    researchEvidenceId:
      "research.external.albanian-ere-wind.v0_1",

    embryo: "ER",

    evidenceFamily:
      "lexical_dictionary",

    language:
      "Albanian",

    form:
      "erë",

    gloss:
      "wind; moving air; colloquially air",

    embryoRelation:
      "unresolved",

    relationOperationIds: [],

    attestationTruth:
      "fact",

    sourceStatus:
      "research_candidate",

    citations: [
      {
        citationId:
          "research.external.fjale-ere-wind.citation.v0_1",

        sourceTitle:
          "FJALË — Erë",

        sourceAuthorOrEditor:
          null,

        sourcePublisherOrHost:
          "FJALË — Fjalor Shqip",

        sourceDateOrVersion:
          "accessed 2026-08-27",

        sourceUrlOrArchiveRef:
          "https://fjale.al/er%C3%AB",

        entryLocator:
          "ERË I f., senses 1-2",

        sourceHashOrArchiveHash:
          null,

        attestedForm:
          "erë",

        attestedGloss:
          "wind / moving air; colloquially air",
      },
    ],

    functionalHypotheses: [
      {
        targetWord:
          "sterile",

        semanticBridge:
          null,

        functionalBridgeTruth:
          "unknown",

        claimBoundary:
          "functional_hypothesis_only",
      },
    ],

    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",
  },

  /**
   * Albanian ERË II — smell / odor.
   *
   * Kept distinct from ERË I to avoid homonym collapse.
   */
  {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

    researchEvidenceId:
      "research.external.albanian-ere-smell.v0_1",

    embryo: "ER",

    evidenceFamily:
      "lexical_dictionary",

    language:
      "Albanian",

    form:
      "erë",

    gloss:
      "smell; scent; odor",

    embryoRelation:
      "unresolved",

    relationOperationIds: [],

    attestationTruth:
      "fact",

    sourceStatus:
      "research_candidate",

    citations: [
      {
        citationId:
          "research.external.fjale-ere-smell.citation.v0_1",

        sourceTitle:
          "FJALË — Erë",

        sourceAuthorOrEditor:
          null,

        sourcePublisherOrHost:
          "FJALË — Fjalor Shqip",

        sourceDateOrVersion:
          "accessed 2026-08-27",

        sourceUrlOrArchiveRef:
          "https://fjale.al/er%C3%AB",

        entryLocator:
          "ERË II f., senses 1-2",

        sourceHashOrArchiveHash:
          null,

        attestedForm:
          "erë",

        attestedGloss:
          "smell / scent / odor",
      },
    ],

    functionalHypotheses: [
      {
        targetWord:
          "sterile",

        semanticBridge:
          null,

        functionalBridgeTruth:
          "unknown",

        claimBoundary:
          "functional_hypothesis_only",
      },
    ],

    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",
  },

  /**
   * Albanian ERË III — era / epoch.
   *
   * Kept distinct from ERË I and ERË II.
   */
  {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

    researchEvidenceId:
      "research.external.albanian-ere-era.v0_1",

    embryo: "ER",

    evidenceFamily:
      "lexical_dictionary",

    language:
      "Albanian",

    form:
      "erë",

    gloss:
      "era; epoch; geological era",

    embryoRelation:
      "unresolved",

    relationOperationIds: [],

    attestationTruth:
      "fact",

    sourceStatus:
      "research_candidate",

    citations: [
      {
        citationId:
          "research.external.fjale-ere-era.citation.v0_1",

        sourceTitle:
          "FJALË — Erë",

        sourceAuthorOrEditor:
          null,

        sourcePublisherOrHost:
          "FJALË — Fjalor Shqip",

        sourceDateOrVersion:
          "accessed 2026-08-27",

        sourceUrlOrArchiveRef:
          "https://fjale.al/er%C3%AB",

        entryLocator:
          "ERË III f. libr., senses 1-2",

        sourceHashOrArchiveHash:
          null,

        attestedForm:
          "erë",

        attestedGloss:
          "era / epoch; geological era",
      },
    ],

    functionalHypotheses: [
      {
        targetWord:
          "sterile",

        semanticBridge:
          null,

        functionalBridgeTruth:
          "unknown",

        claimBoundary:
          "functional_hypothesis_only",
      },
    ],

    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",
  },
] as const satisfies readonly MultiSourceFunctionalResearchEvidenceRowV0_1[];

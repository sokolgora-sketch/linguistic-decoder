import {
  extractSevenVowelsFromString,
  type SevenVowel,
} from "@/shared/math7.core";
import type { CrossLanguageOperationLedgerInputV0_2 } from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  type InterpretationDecisionPolicyV0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import {
  STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2,
  type FunctionalMotivationResearchClaimLayerV0_2,
} from "@/shared/openInstrument/functionalMotivationResearchReference.v0_2";

export const FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_SCHEMA_V0_3 =
  "open-instrument.functional-motivation-research-method-expansion.v0_3" as const;

export type ResearchCitationStatusV0_3 = "CITATION_ENTERED_UNVERIFIED";

export type ResearchSourceReferenceV0_3 = Readonly<{
  sourceId: string;
  sourceName: string;
  title: string;
  author: string | null;
  publicationDate: string | null;
  locator: string;
  url: string;
  accessStatus: "ACCESSED";
  citationStatus: ResearchCitationStatusV0_3;
  licensingStatus: "NOT_ASSESSED";
}>;

export type ResearchFormV0_3 = Readonly<{
  exactSpelling: string;
  language: string;
  variety: string;
  grammaticalCategory: string;
  selectedSense: string;
  sourceReferenceIds: readonly string[];
  exactCodePoints: readonly Readonly<{ character: string; position: number }>[];
  writtenVoiceEvents: readonly Readonly<{ voice: SevenVowel; position: number }>[];
}>;

export type ResearchSourceFactV0_3 = Readonly<{
  claimId: string;
  exactForm: string;
  statement: string;
  claimLayer: "SOURCE_FACT";
  evidenceStatus: ResearchCitationStatusV0_3;
  sourceReferenceIds: readonly string[];
}>;

export const FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_SOURCES_V0_3 = [
  {
    sourceId: "fjalor-shqip-studim",
    sourceName: "FJALË / Fjalor Shqip",
    title: "STUDIM lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma STUDIM; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/studim",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-studioj",
    sourceName: "FJALË / Fjalor Shqip",
    title: "STUDIOJ lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma STUDIOJ; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/studioj",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "cambridge-english-study",
    sourceName: "Cambridge Dictionary",
    title: "Study",
    author: "Cambridge University Press",
    publicationDate: null,
    locator: "Noun, learning sense; the accessed web page exposes other noun and verb senses but no edition/version date.",
    url: "https://dictionary.cambridge.org/dictionary/english/study",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-gjithcka",
    sourceName: "FJALË / Fjalor Shqip",
    title: "GJITHÇKA lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma GJITHÇKA, senses 1 and 4; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/gjith%C3%A7ka",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-gjithe",
    sourceName: "FJALË / Fjalor Shqip",
    title: "GJITHË lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma GJITHË, senses 1 and 5; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/gjith%C3%AB",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-cka",
    sourceName: "FJALË / Fjalor Shqip",
    title: "ÇKA lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma ÇKA, interrogative sense 1 and relative senses 2–3; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/%C3%A7ka",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "myrta-2014-elbasanishtja",
    sourceName: "University of Tirana, Faculty of History and Philology, Department of Albanian Language",
    title: "Në gjurmë të elbasanishtes letrare",
    author: "Manola Myrta",
    publicationDate: "2014",
    locator: "Myrta 2014, section 2.3.1.2, ‘Drejtshkrimi i zanores ë paratheksore’, printed page 102, compound table: gjithë + çka → gjithçka; gjithë + një → gjithnjë; gjithë + mo(t)në → gjithmonë; gjithë + kombëtar → gjithëkombëtar. The table is discussed in relation to Kolec Topalli (2011), printed page 272; this source record is Myrta’s report, not a direct Topalli source record.",
    url: "https://unitir.edu.al/wp-content/uploads/2015/03/Dokturatura-Manola-Myrta-Fakulteti-i-Histori-Filologjise-Departamenti-i-Gjuhesise.pdf",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-gjithmone",
    sourceName: "FJALË / Fjalor Shqip",
    title: "GJITHMONË lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma GJITHMONË, senses 1–2; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/gjithmon%C3%AB",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-gjithnje",
    sourceName: "FJALË / Fjalor Shqip",
    title: "GJITHNJË lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma GJITHNJË, senses 1–4; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/gjithnj%C3%AB",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
  {
    sourceId: "fjalor-shqip-gjithekombetar",
    sourceName: "FJALË / Fjalor Shqip",
    title: "GJITHËKOMBËTAR lemma",
    author: null,
    publicationDate: null,
    locator: "Lemma GJITHËKOMBËTAR; edition/version not stated on the accessed entry.",
    url: "https://fjale.al/gjith%C3%ABkomb%C3%ABtar",
    accessStatus: "ACCESSED",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  },
] as const satisfies readonly ResearchSourceReferenceV0_3[];

function projectWrittenForm(
  exactSpelling: string,
  language: string,
  variety: string,
  grammaticalCategory: string,
  selectedSense: string,
  sourceReferenceIds: readonly string[],
): ResearchFormV0_3 {
  const characters = Array.from(exactSpelling);
  return {
    exactSpelling,
    language,
    variety,
    grammaticalCategory,
    selectedSense,
    sourceReferenceIds,
    exactCodePoints: characters.map((character, position) => ({ character, position })),
    writtenVoiceEvents: characters.flatMap((character, position) => {
      const voice = extractSevenVowelsFromString(character)[0];
      return voice ? [{ voice, position }] : [];
    }),
  };
}

const studyComparison = {
  comparisonId: "sq.en.studim-study.selected-learning-sense.v0_3",
  albanian: projectWrittenForm(
    "STUDIM",
    "Albanian",
    "Standard Albanian as recorded by the existing v0.2 reference",
    "noun",
    "studying; acquiring knowledge",
    ["fjalor-shqip-studim", "fjalor-shqip-studioj"],
  ),
  english: projectWrittenForm(
    "STUDY",
    "English",
    "Variety not distinguished by the accessed Cambridge entry",
    "noun",
    "the activity of learning about a subject, usually at school or university",
    ["cambridge-english-study"],
  ),
  selectedSenseRelation: {
    text: "The selected noun senses overlap in the activity of studying or learning about a subject.",
    claimLayer: "LOGICAL_INFERENCE",
    status: "USER_PROPOSED",
    sourceAuthorityPromotion: "NONE",
  },
  sharedWrittenSequence: {
    exactSequence: "STUD",
    albanianSpan: { start: 0, end: 4 },
    englishSpan: { start: 0, end: 4 },
    claimLayer: "DERIVED_STRUCTURE",
    interpretation: "OBSERVED_ORTHOGRAPHIC_SEQUENCE_ONLY",
    rootOrHistoricalRelationship: "NOT_CLAIMED",
  },
  structuralDifferences: [
    {
      position: 4,
      albanian: "I",
      english: "Y",
      claimLayer: "DERIVED_STRUCTURE",
      note: "Y is preserved as canonical written Voice Y; it is not converted to I.",
    },
    {
      position: 5,
      albanian: "M",
      english: null,
      claimLayer: "DERIVED_STRUCTURE",
      note: "Final Albanian M has no English counterpart in this comparison.",
    },
  ],
  proposedComponents: [],
  mechanicalCorrespondence: {
    status: "NOT_ASSERTED",
    operationLedgerInput: null,
    reasonCode: "SELECTED_SENSE_COMPARISON_DOES_NOT_ASSERT_WORD_RECONSTRUCTION",
  },
  excludedEnglishSenseExamples: [
    "A detailed examination or research study.",
    "A room for quiet work.",
    "The verb meaning to learn about a subject.",
    "An artist's preparatory drawing.",
  ],
  authorityBoundary: {
    translationEquivalence: "SELECTED_SENSE_ONLY",
    historicalOrigin: "NOT_CLAIMED",
    sourceAuthorityPromotion: "NONE",
    userDecisionPosture: "user_decides",
  },
} as const;

const gjitheOmission: CrossLanguageOperationLedgerInputV0_2 = {
  initialForm: "GJITHËÇKA",
  declaredFinalForm: "GJITHÇKA",
  operations: [
    {
      applicationId: "omit-boundary-e",
      operationId: "OMIT.v0_2",
      position: 5,
      expectedRemovedText: "Ë",
    },
  ],
  proposedRelationship:
    "Mechanical replay of the source-reported gjithë + çka spelling analysis; no linguistic rule or engine authority is asserted.",
  evidenceReference:
    "https://unitir.edu.al/wp-content/uploads/2015/03/Dokturatura-Manola-Myrta-Fakulteti-i-Histori-Filologjise-Departamenti-i-Gjuhesise.pdf",
};

const gjithnjeOmission: CrossLanguageOperationLedgerInputV0_2 = {
  initialForm: "GJITHËNJË",
  declaredFinalForm: "GJITHNJË",
  operations: [
    {
      applicationId: "contrast-omit-boundary-e",
      operationId: "OMIT.v0_2",
      position: 5,
      expectedRemovedText: "Ë",
    },
  ],
  proposedRelationship:
    "Mechanical audit of the dissertation's source-reported gjithë + një → gjithnjë contrast only.",
  evidenceReference:
    "https://unitir.edu.al/wp-content/uploads/2015/03/Dokturatura-Manola-Myrta-Fakulteti-i-Histori-Filologjise-Departamenti-i-Gjuhesise.pdf",
};

const methodExpansion = {
  schemaVersion: FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_SCHEMA_V0_3,
  referenceId: "sq.en.studim-study.gjithcka.method-expansion.v0_3",
  status: "ACTIVE_RESEARCH_METHOD_EXTENSION",
  authorityBoundary: {
    canonicality: "RESEARCH_METHOD_REFERENCE_ONLY",
    productionAuthority: "NONE",
    sourceAuthorityPromotion: "NONE",
    automaticSemanticPrediction: "NONE",
    historicalOrigin: "NOT_CLAIMED",
  },
  sourceReferences: FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_SOURCES_V0_3,
  studimSpecimen: STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2,
  studyComparison,
  sourceFacts: [
    {
      claimId: "english-study-learning-sense",
      exactForm: "study",
      statement: "Cambridge lists a noun learning sense as the activity of learning about a subject; this extension selects that sense only.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferenceIds: ["cambridge-english-study"],
    },
    {
      claimId: "gjithcka-whole-word-meaning",
      exactForm: "gjithçka",
      statement: "FJALË records GJITHÇKA as all things or every thing, with an additional sense for all things taken together.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferenceIds: ["fjalor-shqip-gjithcka"],
    },
    {
      claimId: "gjithe-component-meaning",
      exactForm: "gjithë",
      statement: "FJALË records GJITHË with an all/whole meaning.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferenceIds: ["fjalor-shqip-gjithe"],
    },
    {
      claimId: "cka-component-meaning",
      exactForm: "çka",
      statement: "FJALË records interrogative what and relative that which senses for ÇKA.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferenceIds: ["fjalor-shqip-cka"],
    },
  ],
  gjithckaCase: {
    target: projectWrittenForm(
      "GJITHÇKA",
      "Albanian",
      "Variety not distinguished by the cited entries",
      "indefinite pronoun",
      "all things; everything",
      ["fjalor-shqip-gjithcka"],
    ),
    components: [
      {
        exactSpelling: "GJITHË",
        codePointSpan: { start: 0, end: 6 },
        proposedFunction: "all / whole",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceReferenceIds: ["fjalor-shqip-gjithe"],
      },
      {
        exactSpelling: "ÇKA",
        codePointSpan: { start: 6, end: 9 },
        proposedFunction: "what / that which",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceReferenceIds: ["fjalor-shqip-cka"],
      },
    ],
    embryoMeaning: {
      status: "UNKNOWN_OR_NULL",
      reason: "No autonomous meaning is assigned to an individual letter or vowel.",
    },
    sourceReportedFormation: {
      exactNotation: "gjithë + çka → gjithçka",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferenceIds: ["myrta-2014-elbasanishtja"],
      scope: "The dissertation reports this component notation and orthographic form; this report is not an executable rule or engine authority.",
    },
    rawConcatenation: "GJITHËÇKA",
    rawConcatenationComparison: "MISMATCH",
    targetSpelling: "GJITHÇKA",
    operationLedgerInput: gjitheOmission,
    operationAuthority: "USER_DECLARED_UNVERIFIED",
    linguisticApplicability: "NOT_ASSESSED",
    functionalReading: {
      text: "all + what/that which → everything",
      claimLayer: "LOGICAL_INFERENCE",
      interpretationStatus: "USER_PROPOSED",
      sourceAuthorityPromotion: "NONE",
    },
    alternativeReadings: [
      {
        description: "Treat GJITHÇKA as a lexicalized whole-word pronoun without asserting a component history.",
        claimLayer: "UNKNOWN_OR_NULL",
      },
      {
        description: "Use the dissertation's reported whole + relative/interrogative component analysis as a source-attributed structural reading.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      },
    ],
    unresolvedClaims: [
      {
        claimId: "gjithcka-formation-authority",
        text: "Whether the reported formation should authorize a reusable linguistic operation in the product remains unassessed.",
        claimLayer: "UNKNOWN_OR_NULL",
      },
      {
        claimId: "gjithcka-historical-origin",
        text: "No historical origin is claimed.",
        claimLayer: "UNKNOWN_OR_NULL",
      },
    ],
  },
  familyContrasts: [
    {
      target: projectWrittenForm(
        "GJITHMONË",
        "Albanian",
        "Variety not distinguished by FJALË",
        "adverb",
        "always; all the time; continuously",
        ["fjalor-shqip-gjithmone"],
      ),
      sourceReportedFormation: {
        exactNotation: "gjithë + mo(t)në → gjithmonë",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceReferenceIds: ["myrta-2014-elbasanishtja"],
      },
      sourceReportsUnstressedEStatus: "LOSS_REPORTED",
      mechanicalAuditInput: null,
      mechanicalAuditReasonCode: "PARENTHETICAL_T_IS_SOURCE_NOTATION_NOT_A_FROZEN_FORM",
      interpretationStatus: "SOURCE_REPORT_RECORDED_NOT_ENGINE_RULE",
    },
    {
      target: projectWrittenForm(
        "GJITHNJË",
        "Albanian",
        "Variety not distinguished by FJALË",
        "adverb",
        "always; at all times; continually",
        ["fjalor-shqip-gjithnje"],
      ),
      sourceReportedFormation: {
        exactNotation: "gjithë + një → gjithnjë",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceReferenceIds: ["myrta-2014-elbasanishtja"],
      },
      sourceReportsUnstressedEStatus: "LOSS_REPORTED",
      mechanicalAuditInput: gjithnjeOmission,
      mechanicalAuditReasonCode: null,
      interpretationStatus: "SOURCE_REPORT_RECORDED_NOT_ENGINE_RULE",
    },
    {
      target: projectWrittenForm(
        "GJITHËKOMBËTAR",
        "Albanian",
        "Variety not distinguished by FJALË",
        "adjective",
        "related to or including the whole nation",
        ["fjalor-shqip-gjithekombetar"],
      ),
      sourceReportedFormation: {
        exactNotation: "gjithë + kombëtar → gjithëkombëtar",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceReferenceIds: ["myrta-2014-elbasanishtja", "fjalor-shqip-gjithekombetar"],
      },
      sourceReportsUnstressedEStatus: "RETAINED_IN_LISTED_FORM",
      sourceDiscussedAlternativeSpelling: {
        exactSpelling: "gjithkombëtar",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        note: "The dissertation reports this as a proposed spelling in its discussion; the cited FJALË headword retains ë.",
      },
      mechanicalAuditInput: null,
      mechanicalAuditReasonCode: "SOURCE_LISTED_CONCATENATION_RETAINS_BOUNDARY_E",
      interpretationStatus: "ORTHOGRAPHIC_VARIATION_RECORDED_NOT_RULE",
    },
  ],
  orthographicGeneralization: {
    status: "NOT_ASSERTED",
    reason: "The cited family examples report both loss and retention of boundary ë, and the dissertation discusses competing spellings; no universal deletion rule is inferred.",
  },
  functionalMotivationBoundary: {
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
    userDecisionPosture: "user_decides",
    multipleInterpretationsMayCoexist: true,
    sourceAuthorityPromotion: "NONE",
    productionAuthority: "NONE",
  },
} as const;

export type FunctionalMotivationResearchMethodExpansionV0_3 = typeof methodExpansion;

export const FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_V0_3:
  FunctionalMotivationResearchMethodExpansionV0_3 = methodExpansion;

export type FunctionalMotivationResearchMethodExpansionClaimLayerV0_3 =
  FunctionalMotivationResearchClaimLayerV0_2;

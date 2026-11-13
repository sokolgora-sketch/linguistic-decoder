import type { CrossLanguageOperationLedgerInputV0_2 } from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";
import type { SingleWordFunctionalMotivationInputV0_1 } from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  type InterpretationDecisionPolicyV0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";

export const FUNCTIONAL_MOTIVATION_RESEARCH_REFERENCE_SCHEMA_V0_2 =
  "open-instrument.functional-motivation-research-reference.v0_2" as const;

export type FunctionalMotivationResearchClaimLayerV0_2 =
  | "SOURCE_FACT"
  | "DERIVED_STRUCTURE"
  | "LOGICAL_INFERENCE"
  | "USER_PROPOSAL"
  | "EXPLORATORY_HYPOTHESIS"
  | "UNKNOWN_OR_NULL";

export type FunctionalMotivationResearchReferenceV0_2 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_MOTIVATION_RESEARCH_REFERENCE_SCHEMA_V0_2;
  referenceId: string;
  status: "ACTIVE_METHOD_SPECIMEN";
  authorityBoundary: Readonly<{
    canonicality: "APPROVED_RESEARCH_EXAMPLE_AND_METHOD_ONLY";
    productionAuthority: "NONE";
    sourceAuthorityPromotion: "NONE";
    historicalOrigin: "NOT_CLAIMED";
  }>;
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
    selectedMeaning: Readonly<{
      text: string;
      claimLayer: "SOURCE_FACT";
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
      sourceReferences: readonly string[];
    }>;
  }>;
  sourceFacts: readonly Readonly<{
    claimId: string;
    exactForm: string;
    statement: string;
    claimLayer: "SOURCE_FACT";
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
    sourceReferences: readonly string[];
  }>[];
  writtenStructure: Readonly<{
    exactCodePoints: readonly Readonly<{ character: string; position: number }>[];
    writtenVoices: readonly Readonly<{ voice: string; position: number }>[];
    structureLayer: "DERIVED_STRUCTURE";
    representationAuthority: "ORTHOGRAPHIC";
    pronunciationAuthority: "NOT_ESTABLISHED";
  }>;
  functionalProposal: Readonly<{
    roots: readonly Readonly<{
      rootId: string;
      proposedSpelling: string;
      proposedFunction: string;
      claimLayer: "USER_PROPOSAL";
      contextualSourceFactIds: readonly string[];
    }>[];
    synthesis: Readonly<{
      text: string;
      claimLayer: "LOGICAL_INFERENCE";
      proposalStatus: "USER_PROPOSED";
      sourceAuthorityPromotion: "NONE";
    }>;
  }>;
  exactSegmentation: Readonly<{
    components: readonly Readonly<{
      exactSpelling: string;
      proposedRole: string | null;
      claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
      unresolved: boolean;
    }>[];
    exactConcatenation: string;
    targetSpelling: string;
    expectedComparison: "EXACT_MATCH";
    unresolvedComponents: readonly string[];
  }>;
  singleWordProposalInput: SingleWordFunctionalMotivationInputV0_1;
  operationLedgers: readonly Readonly<{
    ledgerId: string;
    operationLedgerInput: CrossLanguageOperationLedgerInputV0_2;
    operationCount: number;
    mechanicalCost: number;
    expectedInitialForm: string;
    expectedFinalForm: string;
    expectedOmittedText: string;
    expectedPosition: number;
    inverseReconstruction: "EXACT_MATCH";
    authority: "USER_DECLARED_UNVERIFIED";
    linguisticApplicability: "NOT_ASSESSED";
  }>[];
  alternativeReadings: readonly Readonly<{
    alternativeId: string;
    description: string;
    claimLayer: "SOURCE_FACT" | "USER_PROPOSAL";
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
    sourceReferences: readonly string[];
    separateFromProposedSegmentation: true;
  }>[];
  contrastCases: readonly Readonly<{
    exactForm: string;
    role: "CONTRAST";
    statedContribution: string;
    claimLayer: "SOURCE_FACT" | "UNKNOWN_OR_NULL";
    mustNotInheritRootIds: readonly string[];
  }>[];
  unresolvedClaims: readonly Readonly<{
    claimId: string;
    text: string;
    claimLayer: "UNKNOWN_OR_NULL";
  }>[];
  crossLanguageWitnesses: Readonly<{
    status: "NOT_ASSERTED";
    reason: string;
  }>;
  interpretationBoundary: Readonly<{
    decisionPolicy: InterpretationDecisionPolicyV0_1;
    userDecisionPosture: "user_decides";
    embryoMeaning: "UNKNOWN_OR_NULL";
    compoundAttestation: "NOT_CLAIMED";
  }>;
}>;

const FJALE = "https://fjale.al";

export const STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2 = {
  schemaVersion: FUNCTIONAL_MOTIVATION_RESEARCH_REFERENCE_SCHEMA_V0_2,
  referenceId: "sq.standard.studim.two-root-method-specimen.v0_2",
  status: "ACTIVE_METHOD_SPECIMEN",
  authorityBoundary: {
    canonicality: "APPROVED_RESEARCH_EXAMPLE_AND_METHOD_ONLY",
    productionAuthority: "NONE",
    sourceAuthorityPromotion: "NONE",
    historicalOrigin: "NOT_CLAIMED",
  },
  target: {
    exactSpelling: "STUDIM",
    language: "Albanian",
    variety: "Standard Albanian",
    selectedMeaning: {
      text: "studying; acquiring knowledge",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferences: [`${FJALE}/studim`, `${FJALE}/studioj`],
    },
  },
  sourceFacts: [
    {
      claimId: "studim-lexical-function",
      exactForm: "studim",
      statement: "The cited entry presents STUDIM through the studying/learning function associated with STUDIOJ.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferences: [`${FJALE}/studim`, `${FJALE}/studioj`],
    },
    {
      claimId: "di-lexical-function",
      exactForm: "di",
      statement: "The cited entry gives DI the lexical function ‘know’.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferences: [`${FJALE}/di`],
    },
    {
      claimId: "shtoj-lexical-function",
      exactForm: "shtoj",
      statement: "The cited entry gives SHTOJ an add/increase function; this does not attest SHTU as a component of STUDIM.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferences: [`${FJALE}/shtoj`],
    },
    {
      claimId: "shtim-lexical-function",
      exactForm: "shtim",
      statement: "The cited entry is retained as lexical context for the contrast case, not as evidence that it contains DI.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferences: [`${FJALE}/shtim`],
    },
  ],
  writtenStructure: {
    exactCodePoints: [
      { character: "S", position: 0 },
      { character: "T", position: 1 },
      { character: "U", position: 2 },
      { character: "D", position: 3 },
      { character: "I", position: 4 },
      { character: "M", position: 5 },
    ],
    writtenVoices: [
      { voice: "U", position: 2 },
      { voice: "I", position: 4 },
    ],
    structureLayer: "DERIVED_STRUCTURE",
    representationAuthority: "ORTHOGRAPHIC",
    pronunciationAuthority: "NOT_ESTABLISHED",
  },
  functionalProposal: {
    roots: [
      {
        rootId: "shtu-increase",
        proposedSpelling: "SHTU",
        proposedFunction: "add / increase",
        claimLayer: "USER_PROPOSAL",
        contextualSourceFactIds: ["shtoj-lexical-function"],
      },
      {
        rootId: "di-knowledge",
        proposedSpelling: "DI",
        proposedFunction: "know / knowledge",
        claimLayer: "USER_PROPOSAL",
        contextualSourceFactIds: ["di-lexical-function"],
      },
    ],
    synthesis: {
      text: "Increasing or acquiring knowledge through study.",
      claimLayer: "LOGICAL_INFERENCE",
      proposalStatus: "USER_PROPOSED",
      sourceAuthorityPromotion: "NONE",
    },
  },
  exactSegmentation: {
    components: [
      {
        exactSpelling: "STU",
        proposedRole: "target-side spelling used for the proposed SHTU root realization",
        claimLayer: "USER_PROPOSAL",
        unresolved: false,
      },
      {
        exactSpelling: "DI",
        proposedRole: "proposed knowledge root",
        claimLayer: "USER_PROPOSAL",
        unresolved: false,
      },
      {
        exactSpelling: "M",
        proposedRole: null,
        claimLayer: "UNKNOWN_OR_NULL",
        unresolved: true,
      },
    ],
    exactConcatenation: "STUDIM",
    targetSpelling: "STUDIM",
    expectedComparison: "EXACT_MATCH",
    unresolvedComponents: ["M: function unresolved"],
  },
  singleWordProposalInput: {
    targetWord: "STUDIM",
    targetLanguage: "Albanian",
    targetDialect: "Standard Albanian",
    segments: [
      {
        exactSpelling: "STU",
        proposedMeaning: "Target-side realization of the proposed SHTU add/increase root after an unverified H omission.",
        proposedGrammaticalRole: "proposed root realization",
        language: "Albanian",
        dialect: "Standard Albanian",
        evidenceStatus: "USER_PROPOSED",
        evidenceReference: "",
        unresolved: false,
      },
      {
        exactSpelling: "DI",
        proposedMeaning: "know / knowledge",
        proposedGrammaticalRole: "proposed lexical root",
        language: "Albanian",
        dialect: "Standard Albanian",
        evidenceStatus: "USER_PROPOSED",
        evidenceReference: "",
        unresolved: false,
      },
      {
        exactSpelling: "M",
        proposedMeaning: "",
        proposedGrammaticalRole: "",
        language: "Albanian",
        dialect: "Standard Albanian",
        evidenceStatus: "UNKNOWN_OR_NULL",
        evidenceReference: "",
        unresolved: true,
      },
    ],
    unresolvedConnectingMaterial: "Final M function remains UNKNOWN_OR_NULL.",
    transformations: [
      {
        from: "SHTU",
        to: "STU",
        explanation: "User-declared H omission at zero-based code-point position 1; linguistic applicability has not been assessed.",
        evidenceReference: "",
      },
    ],
    functionalExplanation: "Increasing or acquiring knowledge through study.",
    transparency: "UNKNOWN_OR_NULL",
  },
  operationLedgers: [
    {
      ledgerId: "shtu-to-stu-h-omission",
      operationLedgerInput: {
        initialForm: "SHTU",
        declaredFinalForm: "STU",
        operations: [
          { applicationId: "omit-h", operationId: "OMIT.v0_2", position: 1, expectedRemovedText: "H" },
        ],
        proposedRelationship: "User-proposed root-spelling correspondence for the STUDIM specimen.",
        evidenceReference: "",
      },
      operationCount: 1,
      mechanicalCost: 1,
      expectedInitialForm: "SHTU",
      expectedFinalForm: "STU",
      expectedOmittedText: "H",
      expectedPosition: 1,
      inverseReconstruction: "EXACT_MATCH",
      authority: "USER_DECLARED_UNVERIFIED",
      linguisticApplicability: "NOT_ASSESSED",
    },
  ],
  alternativeReadings: [
    {
      alternativeId: "studioj-im-morphology",
      description: "The ordinary STUDIOJ / -IM lexical-morphological account is a separate alternative and is not merged with STU + DI + M.",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceReferences: [`${FJALE}/studim`, `${FJALE}/studioj`],
      separateFromProposedSegmentation: true,
    },
  ],
  contrastCases: [
    {
      exactForm: "SHTIM",
      role: "CONTRAST",
      statedContribution: "Retain as the existing contrast; it does not receive the proposed DI know/knowledge contribution.",
      claimLayer: "UNKNOWN_OR_NULL",
      mustNotInheritRootIds: ["di-knowledge"],
    },
  ],
  unresolvedClaims: [
    { claimId: "final-m-function", text: "The function of final M is unresolved.", claimLayer: "UNKNOWN_OR_NULL" },
    { claimId: "shtu-linguistic-applicability", text: "The proposed SHTU → STU H omission has not been linguistically assessed.", claimLayer: "UNKNOWN_OR_NULL" },
    { claimId: "historical-origin", text: "No historical origin or etymological derivation is claimed.", claimLayer: "UNKNOWN_OR_NULL" },
  ],
  crossLanguageWitnesses: {
    status: "NOT_ASSERTED",
    reason: "This Standard Albanian worked case makes no foreign-language witness claim; source references remain separately attributed.",
  },
  interpretationBoundary: {
    decisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
    userDecisionPosture: "user_decides",
    embryoMeaning: "UNKNOWN_OR_NULL",
    compoundAttestation: "NOT_CLAIMED",
  },
} satisfies FunctionalMotivationResearchReferenceV0_2;

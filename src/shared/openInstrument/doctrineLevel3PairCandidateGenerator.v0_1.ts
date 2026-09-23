import {
  SEVEN_PRINCIPLES,
  type PrincipleRole,
} from "@/shared/sevenPrinciples.v1";
import {
  SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
  type DoctrineFunctionalPropertyIdV0_1,
} from "@/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import {
  sevenVoiceOrderedViewsSchemaVersion,
  symbolicMathOrder,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

export const DOCTRINE_LEVEL3_PAIR_CANDIDATE_SCHEMA_V0_1 =
  "open-instrument.doctrine-level3-pair-candidate.v0_1" as const;

export const DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1 =
  "level3.ordered-pair.with-template.v0_1" as const;

export const DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1 =
  "DOCTRINE_CANDIDATE_FOR_DF_REVIEW" as const;

export const DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1 =
  "ALREADY_PRODUCTION_AUTHORIZED_PROOF_PAIR" as const;

export const DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1 =
  "AUTHORIZED_BY_GENERIC_DISTINCT_PAIR_LEVEL3_LAW_V1" as const;

export const DOCTRINE_LEVEL3_GENERIC_AUTHORIZATION_ID_V0_1 =
  "OPEN_INSTRUMENT_GENERIC_DISTINCT_PAIR_LEVEL3_COMPOSITION_LAW_V1" as const;

export const DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1 =
  "SELF_PAIR_UNRESOLVED_NON_PRODUCTION" as const;

export const DOCTRINE_LEVEL3_PAIR_GENERATION_STATUS_V0_1 =
  "GENERATED_FOR_DF_REVIEW" as const;

const ATOM_PROPOSALS_V0_1 = Object.freeze({
  A: {
    expression: "initiating beginning",
    tokensUsed: ["initiating", "beginning"],
    traceToCanon: [
      {
        token: "initiating",
        sourceKind: "canonical_role",
        sourceValue: "Initiation/Source",
        form: "grammatical_form",
      },
      {
        token: "beginning",
        sourceKind: "functional_property",
        sourceValue: "beginning",
        form: "verbatim",
      },
    ],
  },
  E: {
    expression: "expanding growth",
    tokensUsed: ["expanding", "growth"],
    traceToCanon: [
      {
        token: "expanding",
        sourceKind: "functional_property",
        sourceValue: "expansion",
        form: "grammatical_form",
      },
      {
        token: "growth",
        sourceKind: "functional_property",
        sourceValue: "growth",
        form: "verbatim",
      },
    ],
  },
  I: {
    expression: "clear understanding",
    tokensUsed: ["clear", "understanding"],
    traceToCanon: [
      {
        token: "clear",
        sourceKind: "functional_property",
        sourceValue: "clarity",
        form: "grammatical_form",
      },
      {
        token: "understanding",
        sourceKind: "functional_property",
        sourceValue: "understanding",
        form: "verbatim",
      },
    ],
  },
  O: {
    expression: "balanced mediation",
    tokensUsed: ["balanced", "mediation"],
    traceToCanon: [
      {
        token: "balanced",
        sourceKind: "functional_property",
        sourceValue: "balance",
        form: "grammatical_form",
      },
      {
        token: "mediation",
        sourceKind: "functional_property",
        sourceValue: "mediation",
        form: "verbatim",
      },
    ],
  },
  U: {
    expression: "grounded depth",
    tokensUsed: ["grounded", "depth"],
    traceToCanon: [
      {
        token: "grounded",
        sourceKind: "functional_property",
        sourceValue: "grounding",
        form: "grammatical_form",
      },
      {
        token: "depth",
        sourceKind: "functional_property",
        sourceValue: "depth",
        form: "verbatim",
      },
    ],
  },
  Y: {
    expression: "reflective exploration",
    tokensUsed: ["reflective", "exploration"],
    traceToCanon: [
      {
        token: "reflective",
        sourceKind: "canonical_role",
        sourceValue: "Reflection/Mirror",
        form: "grammatical_form",
      },
      {
        token: "exploration",
        sourceKind: "functional_property",
        sourceValue: "exploration",
        form: "verbatim",
      },
    ],
  },
  "Ë": {
    expression: "harmonious resolution",
    tokensUsed: ["harmonious", "resolution"],
    traceToCanon: [
      {
        token: "harmonious",
        sourceKind: "functional_property",
        sourceValue: "harmony",
        form: "grammatical_form",
      },
      {
        token: "resolution",
        sourceKind: "functional_property",
        sourceValue: "resolution",
        form: "verbatim",
      },
    ],
  },
} as const satisfies Record<
  SevenVoiceKey,
  Readonly<{
    expression: string;
    tokensUsed: readonly string[];
    traceToCanon: readonly Readonly<{
      token: string;
      sourceKind: "canonical_role" | "functional_property";
      sourceValue: string;
      form: "verbatim" | "grammatical_form";
    }>[];
  }>
>);

export type DoctrineLevel3PairCandidateStatusV0_1 =
  | typeof DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1
  | typeof DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1
  | typeof DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1
  | typeof DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1;

export type DoctrineLevel3AtomProposalV0_1 = Readonly<{
  voice: SevenVoiceKey;
  canonicalRole: PrincipleRole;
  canonicalProperties: readonly DoctrineFunctionalPropertyIdV0_1[];
  proposedCompactExpression: string;
  tokensUsed: readonly string[];
  traceToCanon: readonly Readonly<{
    token: string;
    sourceKind: "canonical_role" | "functional_property";
    sourceValue: string;
    form: "verbatim" | "grammatical_form";
  }>[];
  newSemanticContent: "NO";
  status: typeof DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1;
  productionAnchor?: typeof DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1;
}>;

export type DoctrineLevel3PairCandidateV0_1 = Readonly<{
  schemaVersion: typeof DOCTRINE_LEVEL3_PAIR_CANDIDATE_SCHEMA_V0_1;
  pair: string;
  firstVoice: SevenVoiceKey;
  firstAtom: string;
  secondVoice: SevenVoiceKey;
  secondAtom: string;
  candidateReading: string;
  templateId: typeof DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1;
  status: DoctrineLevel3PairCandidateStatusV0_1;
  semanticStatus:
    | "BOUNDED_REVIEW_CANDIDATE_ONLY"
    | "BOUNDED_LEVEL3_DOCTRINAL_INFERENCE";
  causality: "NOT_AUTHORIZED";
  temporality: "NOT_AUTHORIZED";
  transformation: "NOT_AUTHORIZED";
  dominance: "NOT_AUTHORIZED";
  level4TransitionSemantics: "NOT_AUTHORIZED";
}>;

export type DoctrineLevel3PairReviewArtifactV0_1 = Readonly<{
  schemaVersion: typeof DOCTRINE_LEVEL3_PAIR_CANDIDATE_SCHEMA_V0_1;
  generationStatus: typeof DOCTRINE_LEVEL3_PAIR_GENERATION_STATUS_V0_1;
  matrixAuthorizationStatus: typeof DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1;
  boundaryLabels: readonly [
    "GENERATED_FOR_DF_REVIEW",
    "GENERIC_DISTINCT_PAIR_LEVEL3_LAW_AUTHORIZED",
    "SELF_PAIRS_UNRESOLVED_NON_PRODUCTION",
    "NOT_LEXICAL_DEFINITION",
    "NOT_EXTERNAL_EVIDENCE",
    "NOT_TARGET_VALIDATION",
    "NOT_LEVEL_4_TRANSITION_SEMANTICS",
  ];
  templateId: typeof DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1;
  orderedViewsSchema: typeof sevenVoiceOrderedViewsSchemaVersion;
  authorizationLaw: typeof DOCTRINE_LEVEL3_GENERIC_AUTHORIZATION_ID_V0_1;
  historicalExplicitProofPairs: readonly ["U→Y", "A→E", "E→A", "I→O"];
  atoms: readonly DoctrineLevel3AtomProposalV0_1[];
  orderedPairCandidates: readonly DoctrineLevel3PairCandidateV0_1[];
}>;

function atomStatusV0_1(
  voice: SevenVoiceKey,
): Pick<DoctrineLevel3AtomProposalV0_1, "status" | "productionAnchor"> {
  return voice === "U" || voice === "Y"
    ? {
        status: DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1,
        productionAnchor: DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1,
      }
    : { status: DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1 };
}

export function getDoctrineLevel3AtomProposalV0_1(
  voice: SevenVoiceKey,
): DoctrineLevel3AtomProposalV0_1 {
  const proposal = ATOM_PROPOSALS_V0_1[voice];
  const profile = SEVEN_VOICE_DOCTRINE_PROFILES_V0_1[voice];
  const status = atomStatusV0_1(voice);

  return Object.freeze({
    voice,
    canonicalRole: SEVEN_PRINCIPLES[voice].role,
    canonicalProperties: profile.functionalProperties.map((property) => property.id),
    proposedCompactExpression: proposal.expression,
    tokensUsed: proposal.tokensUsed,
    traceToCanon: proposal.traceToCanon,
    newSemanticContent: "NO",
    ...status,
  });
}

export function getDoctrineLevel3AtomProposalsV0_1(): readonly DoctrineLevel3AtomProposalV0_1[] {
  return symbolicMathOrder.map((voice) => getDoctrineLevel3AtomProposalV0_1(voice));
}

export function renderDoctrineLevel3PairReadingV0_1(
  firstVoice: SevenVoiceKey,
  secondVoice: SevenVoiceKey,
): string {
  return `${getDoctrineLevel3AtomProposalV0_1(firstVoice).proposedCompactExpression} with ${getDoctrineLevel3AtomProposalV0_1(secondVoice).proposedCompactExpression}`;
}

export function candidatePairReadingV0_1(
  firstVoice: SevenVoiceKey,
  secondVoice: SevenVoiceKey,
): DoctrineLevel3PairCandidateV0_1 {
  const firstAtom = getDoctrineLevel3AtomProposalV0_1(firstVoice);
  const secondAtom = getDoctrineLevel3AtomProposalV0_1(secondVoice);
  const isSelfPair = firstVoice === secondVoice;

  return Object.freeze({
    schemaVersion: DOCTRINE_LEVEL3_PAIR_CANDIDATE_SCHEMA_V0_1,
    pair: `${firstVoice}→${secondVoice}`,
    firstVoice,
    firstAtom: firstAtom.proposedCompactExpression,
    secondVoice,
    secondAtom: secondAtom.proposedCompactExpression,
    candidateReading: renderDoctrineLevel3PairReadingV0_1(firstVoice, secondVoice),
    templateId: DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1,
    status: isSelfPair
      ? DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1
      : DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
    semanticStatus: isSelfPair
      ? "BOUNDED_REVIEW_CANDIDATE_ONLY"
      : "BOUNDED_LEVEL3_DOCTRINAL_INFERENCE",
    causality: "NOT_AUTHORIZED",
    temporality: "NOT_AUTHORIZED",
    transformation: "NOT_AUTHORIZED",
    dominance: "NOT_AUTHORIZED",
    level4TransitionSemantics: "NOT_AUTHORIZED",
  });
}

export function generateDoctrineLevel3PairReviewMatrixV0_1(): readonly DoctrineLevel3PairCandidateV0_1[] {
  return symbolicMathOrder.flatMap((firstVoice) =>
    symbolicMathOrder.map((secondVoice) =>
      candidatePairReadingV0_1(firstVoice, secondVoice),
    ),
  );
}

export function buildDoctrineLevel3PairReviewArtifactV0_1(): DoctrineLevel3PairReviewArtifactV0_1 {
  return Object.freeze({
    schemaVersion: DOCTRINE_LEVEL3_PAIR_CANDIDATE_SCHEMA_V0_1,
    generationStatus: DOCTRINE_LEVEL3_PAIR_GENERATION_STATUS_V0_1,
    matrixAuthorizationStatus: DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
    boundaryLabels: [
      "GENERATED_FOR_DF_REVIEW",
      "GENERIC_DISTINCT_PAIR_LEVEL3_LAW_AUTHORIZED",
      "SELF_PAIRS_UNRESOLVED_NON_PRODUCTION",
      "NOT_LEXICAL_DEFINITION",
      "NOT_EXTERNAL_EVIDENCE",
      "NOT_TARGET_VALIDATION",
      "NOT_LEVEL_4_TRANSITION_SEMANTICS",
    ] as const,
    templateId: DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1,
    orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
    authorizationLaw: DOCTRINE_LEVEL3_GENERIC_AUTHORIZATION_ID_V0_1,
    historicalExplicitProofPairs: ["U→Y", "A→E", "E→A", "I→O"] as const,
    atoms: getDoctrineLevel3AtomProposalsV0_1(),
    orderedPairCandidates: generateDoctrineLevel3PairReviewMatrixV0_1(),
  });
}

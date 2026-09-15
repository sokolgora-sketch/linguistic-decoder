import {
  isSevenVoiceKey,
  symbolicMathOrder,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

export const DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1 =
  "open-instrument.doctrine-functional-profile.v0_1" as const;

export const DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1 =
  "ENGINE_AUTHORIZED_DOCTRINE_PROFILE" as const;

export const DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1 =
  "REVIEWED_DOCTRINE_NORMALIZATION" as const;

export const DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1 =
  "inference" as const;

export const DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1 =
  "AUTHOR_PRIMARY_DOCTRINE_SOURCE" as const;

export const DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1 =
  "VERBATIM" as const;

export const DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1 =
  "NOT_EXECUTABLE_DIRECTLY" as const;

export type SevenVoicesAuthorSourceIdV0_1 =
  | "seven-voices.author-source.chapter-01.sq"
  | "seven-voices.author-source.chapter-02.sq"
  | "seven-voices.author-source.chapter-03.sq"
  | "seven-voices.author-source.chapter-04.sq";

export type DoctrineFunctionalPropertyIdV0_1 =
  | "beginning"
  | "creation"
  | "activation"
  | "life_pulse"
  | "expansion"
  | "transformation"
  | "connection"
  | "growth"
  | "illumination"
  | "knowledge"
  | "recognition"
  | "clarity"
  | "truth_orientation"
  | "understanding"
  | "mediation"
  | "balance"
  | "order"
  | "center"
  | "harmonization"
  | "non_domination"
  | "unification"
  | "support"
  | "grounding"
  | "depth"
  | "stability"
  | "nourishment"
  | "belonging"
  | "foundation"
  | "choice"
  | "duality"
  | "exploration"
  | "adventure"
  | "mystery"
  | "imagination"
  | "experimentation"
  | "discovery"
  | "risk"
  | "learning_from_experience"
  | "resolution"
  | "harmony"
  | "peace"
  | "reconciliation"
  | "unity"
  | "emotional_interiority";

export type DoctrineFunctionalProfileSourceClassV0_1 =
  | "EXPLICIT_DOCTRINE"
  | "FUNCTIONAL_INTERPRETATION";

export type DoctrineFunctionalProfileSourceRefV0_1 = Readonly<{
  sourceId: SevenVoicesAuthorSourceIdV0_1;
  locator: string;
  sourceKind: typeof DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1;
  sourceStatus: typeof DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1;
  engineAuthority: typeof DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1;
}>;

export type DoctrineFunctionalProfileDatumV0_1 = Readonly<{
  id: DoctrineFunctionalPropertyIdV0_1;
  sourceClass: DoctrineFunctionalProfileSourceClassV0_1;
  sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
  normalizationStatus:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1;
}>;

export type SevenVoicesPrincipleAssociationV0_1 =
  | "Bashkimi"
  | "Vibrimi"
  | "Ritmi"
  | "Balanca"
  | "Ndryshimi"
  | "Nisma"
  | "Dashuria";

export type DoctrineFunctionalProfilePrincipleV0_1 = Readonly<{
  label: SevenVoicesPrincipleAssociationV0_1;
  sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
  sourceClass: "EXPLICIT_DOCTRINE";
  normalizationStatus:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1;
}>;

export type DoctrineFunctionalProfileRelationIdV0_1 =
  | "a-eh-complementarity"
  | "o-high-low-mediation"
  | "o-non-domination-balance";

export type DoctrineFunctionalProfileRelationTypeV0_1 =
  | "COMPLEMENTARY_OPPOSITION"
  | "MEDIATES_HIGH_LOW_GROUPINGS"
  | "NON_DOMINATING_BALANCE";

export type DoctrineFunctionalProfileRelationV0_1 = Readonly<{
  relationId: DoctrineFunctionalProfileRelationIdV0_1;
  subject: SevenVoiceKey;
  relatedVoices: readonly SevenVoiceKey[];
  relationType: DoctrineFunctionalProfileRelationTypeV0_1;
  directionality: "SYMMETRIC" | "VOICE_IDENTITY_RELATION";
  sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
  sourceClass: "EXPLICIT_DOCTRINE";
  normalizationStatus:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1;
}>;

export type DoctrineFunctionalProfileColorV0_1 =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet";

export type DoctrineFunctionalProfileSymbolicMetadataV0_1 = Readonly<{
  color: Readonly<{
    value: DoctrineFunctionalProfileColorV0_1;
    sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
  }>;
  frequencyTensionIds: readonly [
    "seven-voices.frequency-grouping.v0_1",
  ];
}>;

export type DoctrineFunctionalProfileTensionClaimIdV0_1 =
  | "chapter-01-high-light"
  | "chapter-01-lower-anchoring"
  | "chapter-02-o-high-low-mediation"
  | "chapter-03-frequency-variation";

export type DoctrineFunctionalProfileTensionV0_1 = Readonly<{
  tensionId: "seven-voices.frequency-grouping.v0_1";
  affectedVoices: readonly SevenVoiceKey[];
  dimension: "frequency_or_level_association";
  competingClaims: readonly Readonly<{
    claimId: DoctrineFunctionalProfileTensionClaimIdV0_1;
    sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
  }>[];
  status: "UNRESOLVED_OR_CONFLICTING";
  noSingleWinner: true;
}>;

export type DoctrineFunctionalProfileClaimBoundaryV0_1 = Readonly<{
  lexicalEvidence: "NOT_CLAIMED";
  historicalEvidence: "NOT_CLAIMED";
  etymologicalEvidence: "NOT_CLAIMED";
  empiricalScientificEvidence: "NOT_CLAIMED";
  targetSenseBinding: "NOT_APPLICABLE";
  pathComposition: "NOT_AUTHORIZED";
  productionCandidate: "NOT_CLAIMED";
}>;

export type SevenVoiceDoctrineFunctionalProfileV0_1 = Readonly<{
  schemaVersion: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  engineAuthority: typeof DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1;
  normalizationStatus:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1;
  truthClassification:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1;
  voice: SevenVoiceKey;
  functionalProperties: readonly DoctrineFunctionalProfileDatumV0_1[];
  principleAssociation: DoctrineFunctionalProfilePrincipleV0_1;
  relationalPropertyIds: readonly DoctrineFunctionalProfileRelationIdV0_1[];
  symbolicMetadata: DoctrineFunctionalProfileSymbolicMetadataV0_1;
  unresolvedTensionIds: readonly [
    "seven-voices.frequency-grouping.v0_1",
  ];
  claimBoundary: DoctrineFunctionalProfileClaimBoundaryV0_1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export const DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_REFS_V0_1 = Object.freeze({
  chapter01Lines16To20: {
    sourceId: "seven-voices.author-source.chapter-01.sq",
    locator: "chapter-01:lines-16-20",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter01Lines21To26: {
    sourceId: "seven-voices.author-source.chapter-01.sq",
    locator: "chapter-01:lines-21-26",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter01Lines27To33: {
    sourceId: "seven-voices.author-source.chapter-01.sq",
    locator: "chapter-01:lines-27-33",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter01Line37: {
    sourceId: "seven-voices.author-source.chapter-01.sq",
    locator: "chapter-01:line-37",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter01Line38: {
    sourceId: "seven-voices.author-source.chapter-01.sq",
    locator: "chapter-01:line-38",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter02Lines13To28: {
    sourceId: "seven-voices.author-source.chapter-02.sq",
    locator: "chapter-02:lines-13-28",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter02Lines27To28: {
    sourceId: "seven-voices.author-source.chapter-02.sq",
    locator: "chapter-02:lines-27-28",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter02Lines31To43: {
    sourceId: "seven-voices.author-source.chapter-02.sq",
    locator: "chapter-02:lines-31-43",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter02Lines37To38: {
    sourceId: "seven-voices.author-source.chapter-02.sq",
    locator: "chapter-02:lines-37-38",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Line15: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:line-15",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Lines17To19: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:lines-17-19",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Lines21To23: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:lines-21-23",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Line25: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:line-25",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Line27: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:line-27",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Line29: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:line-29",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter03Line31: {
    sourceId: "seven-voices.author-source.chapter-03.sq",
    locator: "chapter-03:line-31",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines16To17: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-16-17",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines19To20: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-19-20",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines22To23: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-22-23",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines25To26: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-25-26",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines28To29: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-28-29",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines31To32: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-31-32",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
  chapter04Lines34To35: {
    sourceId: "seven-voices.author-source.chapter-04.sq",
    locator: "chapter-04:lines-34-35",
    sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
    sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  },
} as const);

type SourceRefKeyV0_1 = keyof typeof DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_REFS_V0_1;

function sourceRefsV0_1(
  ...keys: readonly SourceRefKeyV0_1[]
): readonly DoctrineFunctionalProfileSourceRefV0_1[] {
  return Object.freeze(
    keys.map((key) => DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_REFS_V0_1[key]),
  );
}

function datumV0_1(
  id: DoctrineFunctionalPropertyIdV0_1,
  sourceClass: DoctrineFunctionalProfileSourceClassV0_1,
  ...sourceRefs: readonly SourceRefKeyV0_1[]
): DoctrineFunctionalProfileDatumV0_1 {
  return {
    id,
    sourceClass,
    sourceRefs: sourceRefsV0_1(...sourceRefs),
    normalizationStatus:
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  };
}

function principleV0_1(
  label: SevenVoicesPrincipleAssociationV0_1,
  sourceRef: SourceRefKeyV0_1,
): DoctrineFunctionalProfilePrincipleV0_1 {
  return {
    label,
    sourceRefs: sourceRefsV0_1(sourceRef),
    sourceClass: "EXPLICIT_DOCTRINE",
    normalizationStatus:
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  };
}

const CLAIM_BOUNDARY_V0_1: DoctrineFunctionalProfileClaimBoundaryV0_1 = {
  lexicalEvidence: "NOT_CLAIMED",
  historicalEvidence: "NOT_CLAIMED",
  etymologicalEvidence: "NOT_CLAIMED",
  empiricalScientificEvidence: "NOT_CLAIMED",
  targetSenseBinding: "NOT_APPLICABLE",
  pathComposition: "NOT_AUTHORIZED",
  productionCandidate: "NOT_CLAIMED",
};

const FREQUENCY_TENSION_ID_V0_1 =
  "seven-voices.frequency-grouping.v0_1" as const;

const FREQUENCY_TENSION_V0_1: DoctrineFunctionalProfileTensionV0_1 = {
  tensionId: FREQUENCY_TENSION_ID_V0_1,
  affectedVoices: symbolicMathOrder,
  dimension: "frequency_or_level_association",
  competingClaims: [
    {
      claimId: "chapter-01-high-light",
      sourceRefs: sourceRefsV0_1("chapter01Line37"),
    },
    {
      claimId: "chapter-01-lower-anchoring",
      sourceRefs: sourceRefsV0_1("chapter01Line38"),
    },
    {
      claimId: "chapter-02-o-high-low-mediation",
      sourceRefs: sourceRefsV0_1("chapter02Lines27To28"),
    },
    {
      claimId: "chapter-03-frequency-variation",
      sourceRefs: sourceRefsV0_1(
        "chapter03Line25",
        "chapter03Line27",
        "chapter03Line29",
        "chapter03Line31",
      ),
    },
  ],
  status: "UNRESOLVED_OR_CONFLICTING",
  noSingleWinner: true,
};

export const SEVEN_VOICE_DOCTRINE_PROFILE_TENSIONS_V0_1 = Object.freeze([
  FREQUENCY_TENSION_V0_1,
] as const);

function symbolicMetadataV0_1(
  color: DoctrineFunctionalProfileColorV0_1,
  ...colorSources: readonly SourceRefKeyV0_1[]
): DoctrineFunctionalProfileSymbolicMetadataV0_1 {
  return {
    color: {
      value: color,
      sourceRefs: sourceRefsV0_1(...colorSources),
    },
    frequencyTensionIds: [FREQUENCY_TENSION_ID_V0_1],
  };
}

const PROFILE_RELATIONS_V0_1 = Object.freeze({
  "a-eh-complementarity": {
    relationId: "a-eh-complementarity",
    subject: "A",
    relatedVoices: ["Ë"],
    relationType: "COMPLEMENTARY_OPPOSITION",
    directionality: "SYMMETRIC",
    sourceRefs: sourceRefsV0_1("chapter01Lines21To26"),
    sourceClass: "EXPLICIT_DOCTRINE",
    normalizationStatus:
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  },
  "o-high-low-mediation": {
    relationId: "o-high-low-mediation",
    subject: "O",
    relatedVoices: ["A", "E", "I", "U", "Y", "Ë"],
    relationType: "MEDIATES_HIGH_LOW_GROUPINGS",
    directionality: "VOICE_IDENTITY_RELATION",
    sourceRefs: sourceRefsV0_1(
      "chapter02Lines27To28",
      "chapter03Line25",
    ),
    sourceClass: "EXPLICIT_DOCTRINE",
    normalizationStatus:
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  },
  "o-non-domination-balance": {
    relationId: "o-non-domination-balance",
    subject: "O",
    relatedVoices: ["A", "E", "I", "U", "Y", "Ë"],
    relationType: "NON_DOMINATING_BALANCE",
    directionality: "VOICE_IDENTITY_RELATION",
    sourceRefs: sourceRefsV0_1("chapter02Lines37To38"),
    sourceClass: "EXPLICIT_DOCTRINE",
    normalizationStatus:
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  },
} as const satisfies Record<
  DoctrineFunctionalProfileRelationIdV0_1,
  DoctrineFunctionalProfileRelationV0_1
>);

export const SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1 = Object.freeze(
  PROFILE_RELATIONS_V0_1,
);

function profileV0_1(
  voice: SevenVoiceKey,
  functionalProperties: readonly DoctrineFunctionalProfileDatumV0_1[],
  principleAssociation: DoctrineFunctionalProfilePrincipleV0_1,
  relationalPropertyIds: readonly DoctrineFunctionalProfileRelationIdV0_1[],
  symbolicMetadata: DoctrineFunctionalProfileSymbolicMetadataV0_1,
): SevenVoiceDoctrineFunctionalProfileV0_1 {
  return {
    schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
    normalizationStatus:
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
    truthClassification:
      DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
    voice,
    functionalProperties,
    principleAssociation,
    relationalPropertyIds,
    symbolicMetadata,
    unresolvedTensionIds: [FREQUENCY_TENSION_ID_V0_1],
    claimBoundary: CLAIM_BOUNDARY_V0_1,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

function deepFreezeV0_1<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreezeV0_1(child);
    }
  }
  return value;
}

export const SEVEN_VOICE_DOCTRINE_PROFILES_V0_1 = deepFreezeV0_1({
  A: profileV0_1(
    "A",
    [
      datumV0_1("beginning", "EXPLICIT_DOCTRINE", "chapter01Lines16To20", "chapter03Line15"),
      datumV0_1("creation", "EXPLICIT_DOCTRINE", "chapter01Lines16To20", "chapter03Line15"),
      datumV0_1("activation", "FUNCTIONAL_INTERPRETATION", "chapter03Line15"),
      datumV0_1("life_pulse", "EXPLICIT_DOCTRINE", "chapter01Lines16To20", "chapter03Line15"),
    ],
    principleV0_1("Bashkimi", "chapter04Lines16To17"),
    ["a-eh-complementarity"],
    symbolicMetadataV0_1("red", "chapter03Line15"),
  ),
  E: profileV0_1(
    "E",
    [
      datumV0_1("expansion", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Lines17To19"),
      datumV0_1("transformation", "EXPLICIT_DOCTRINE", "chapter03Lines17To19"),
      datumV0_1("connection", "FUNCTIONAL_INTERPRETATION", "chapter03Lines17To19"),
      datumV0_1("growth", "FUNCTIONAL_INTERPRETATION", "chapter01Lines27To33", "chapter03Lines17To19"),
    ],
    principleV0_1("Vibrimi", "chapter04Lines19To20"),
    [],
    symbolicMetadataV0_1("orange", "chapter03Lines17To19"),
  ),
  I: profileV0_1(
    "I",
    [
      datumV0_1("illumination", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Lines21To23"),
      datumV0_1("knowledge", "EXPLICIT_DOCTRINE", "chapter03Lines21To23"),
      datumV0_1("recognition", "EXPLICIT_DOCTRINE", "chapter01Lines27To33"),
      datumV0_1("clarity", "EXPLICIT_DOCTRINE", "chapter03Lines21To23"),
      datumV0_1("truth_orientation", "FUNCTIONAL_INTERPRETATION", "chapter03Lines21To23"),
      datumV0_1("understanding", "EXPLICIT_DOCTRINE", "chapter03Lines21To23"),
    ],
    principleV0_1("Ritmi", "chapter04Lines22To23"),
    [],
    symbolicMetadataV0_1("yellow", "chapter03Lines21To23"),
  ),
  O: profileV0_1(
    "O",
    [
      datumV0_1("mediation", "EXPLICIT_DOCTRINE", "chapter02Lines13To28", "chapter03Line25"),
      datumV0_1("balance", "EXPLICIT_DOCTRINE", "chapter02Lines13To28", "chapter04Lines25To26"),
      datumV0_1("order", "EXPLICIT_DOCTRINE", "chapter02Lines13To28"),
      datumV0_1("center", "EXPLICIT_DOCTRINE", "chapter02Lines31To43"),
      datumV0_1("harmonization", "EXPLICIT_DOCTRINE", "chapter02Lines13To28", "chapter03Line25"),
      datumV0_1("non_domination", "EXPLICIT_DOCTRINE", "chapter02Lines37To38"),
      datumV0_1("unification", "FUNCTIONAL_INTERPRETATION", "chapter02Lines13To28"),
    ],
    principleV0_1("Balanca", "chapter04Lines25To26"),
    ["o-high-low-mediation", "o-non-domination-balance"],
    symbolicMetadataV0_1("green", "chapter03Line25"),
  ),
  U: profileV0_1(
    "U",
    [
      datumV0_1("support", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Line27"),
      datumV0_1("grounding", "EXPLICIT_DOCTRINE", "chapter03Line27", "chapter04Lines28To29"),
      datumV0_1("depth", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Line27"),
      datumV0_1("stability", "EXPLICIT_DOCTRINE", "chapter03Line27", "chapter04Lines28To29"),
      datumV0_1("nourishment", "EXPLICIT_DOCTRINE", "chapter03Line27"),
      datumV0_1("belonging", "EXPLICIT_DOCTRINE", "chapter03Line27"),
      datumV0_1("foundation", "FUNCTIONAL_INTERPRETATION", "chapter03Line27"),
    ],
    principleV0_1("Ndryshimi", "chapter04Lines28To29"),
    [],
    symbolicMetadataV0_1("blue", "chapter03Line27"),
  ),
  Y: profileV0_1(
    "Y",
    [
      datumV0_1("choice", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Line29"),
      datumV0_1("duality", "EXPLICIT_DOCTRINE", "chapter03Line29"),
      datumV0_1("exploration", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Line29"),
      datumV0_1("adventure", "EXPLICIT_DOCTRINE", "chapter03Line29"),
      datumV0_1("mystery", "EXPLICIT_DOCTRINE", "chapter03Line29"),
      datumV0_1("imagination", "EXPLICIT_DOCTRINE", "chapter01Lines27To33", "chapter03Line29"),
      datumV0_1("experimentation", "EXPLICIT_DOCTRINE", "chapter03Line29"),
      datumV0_1("discovery", "EXPLICIT_DOCTRINE", "chapter03Line29"),
      datumV0_1("risk", "FUNCTIONAL_INTERPRETATION", "chapter03Line29"),
      datumV0_1("learning_from_experience", "EXPLICIT_DOCTRINE", "chapter03Line29"),
    ],
    principleV0_1("Nisma", "chapter04Lines31To32"),
    [],
    symbolicMetadataV0_1("indigo", "chapter03Line29"),
  ),
  "Ë": profileV0_1(
    "Ë",
    [
      datumV0_1("resolution", "EXPLICIT_DOCTRINE", "chapter01Lines21To26", "chapter03Line31"),
      datumV0_1("harmony", "EXPLICIT_DOCTRINE", "chapter01Lines21To26", "chapter03Line31"),
      datumV0_1("peace", "EXPLICIT_DOCTRINE", "chapter03Line31"),
      datumV0_1("reconciliation", "FUNCTIONAL_INTERPRETATION", "chapter01Lines21To26"),
      datumV0_1("unity", "EXPLICIT_DOCTRINE", "chapter01Lines21To26", "chapter03Line31"),
      datumV0_1("emotional_interiority", "EXPLICIT_DOCTRINE", "chapter01Lines21To26"),
      datumV0_1("connection", "FUNCTIONAL_INTERPRETATION", "chapter03Line31"),
    ],
    principleV0_1("Dashuria", "chapter04Lines34To35"),
    ["a-eh-complementarity"],
    symbolicMetadataV0_1("violet", "chapter03Line31"),
  ),
} as const satisfies Record<
  SevenVoiceKey,
  SevenVoiceDoctrineFunctionalProfileV0_1
>);

export type DoctrineFunctionalProfileReasonCodeV0_1 =
  | "PROFILE_NOT_OBJECT"
  | "SCHEMA_VERSION_INVALID"
  | "ENGINE_AUTHORITY_INVALID"
  | "NORMALIZATION_STATUS_INVALID"
  | "TRUTH_CLASSIFICATION_INVALID"
  | "VOICE_INVALID"
  | "FUNCTIONAL_PROPERTIES_INVALID"
  | "PRINCIPLE_ASSOCIATION_INVALID"
  | "RELATIONAL_PROPERTIES_INVALID"
  | "SYMBOLIC_METADATA_INVALID"
  | "UNRESOLVED_TENSIONS_INVALID"
  | "CLAIM_BOUNDARY_INVALID"
  | "USER_DECISION_POSTURE_INVALID"
  | "NO_SINGLE_WINNER_INVALID"
  | "LEXICAL_EVIDENCE_FIELD_PRESENT"
  | "PATH_COMPOSITION_FIELD_PRESENT"
  | "SOURCE_REFERENCE_INVALID";

export type DoctrineFunctionalProfileValidationFailureV0_1 = Readonly<{
  ok: false;
  schemaVersion: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  reasonCodes: readonly DoctrineFunctionalProfileReasonCodeV0_1[];
}>;

export type DoctrineFunctionalProfileValidationSuccessV0_1 = Readonly<{
  ok: true;
  schemaVersion: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  value: SevenVoiceDoctrineFunctionalProfileV0_1;
}>;

export type DoctrineFunctionalProfileValidationResultV0_1 =
  | DoctrineFunctionalProfileValidationSuccessV0_1
  | DoctrineFunctionalProfileValidationFailureV0_1;

type RecordV0_1 = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is RecordV0_1 {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyStringV0_1(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSourceRefV0_1(value: unknown): value is DoctrineFunctionalProfileSourceRefV0_1 {
  if (!isRecordV0_1(value)) return false;
  return (
    nonEmptyStringV0_1(value.sourceId) &&
    nonEmptyStringV0_1(value.locator) &&
    value.sourceKind === DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1 &&
    value.sourceStatus === DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1 &&
    value.engineAuthority ===
      DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1
  );
}

function sourceRefsValidV0_1(value: unknown): value is readonly DoctrineFunctionalProfileSourceRefV0_1[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(isSourceRefV0_1)
  );
}

function hasOnlyKnownKeysV0_1(
  value: RecordV0_1,
  keys: readonly string[],
): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isFunctionalPropertyDatumV0_1(
  value: unknown,
): value is DoctrineFunctionalProfileDatumV0_1 {
  if (!isRecordV0_1(value)) return false;
  return (
    nonEmptyStringV0_1(value.id) &&
    (value.sourceClass === "EXPLICIT_DOCTRINE" ||
      value.sourceClass === "FUNCTIONAL_INTERPRETATION") &&
    sourceRefsValidV0_1(value.sourceRefs) &&
    value.normalizationStatus ===
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1
  );
}

function isPrincipleV0_1(value: unknown): value is DoctrineFunctionalProfilePrincipleV0_1 {
  if (!isRecordV0_1(value)) return false;
  return (
    nonEmptyStringV0_1(value.label) &&
    value.sourceClass === "EXPLICIT_DOCTRINE" &&
    sourceRefsValidV0_1(value.sourceRefs) &&
    value.normalizationStatus ===
      DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1
  );
}

function isClaimBoundaryV0_1(value: unknown): value is DoctrineFunctionalProfileClaimBoundaryV0_1 {
  if (!isRecordV0_1(value)) return false;
  return (
    value.lexicalEvidence === "NOT_CLAIMED" &&
    value.historicalEvidence === "NOT_CLAIMED" &&
    value.etymologicalEvidence === "NOT_CLAIMED" &&
    value.empiricalScientificEvidence === "NOT_CLAIMED" &&
    value.targetSenseBinding === "NOT_APPLICABLE" &&
    value.pathComposition === "NOT_AUTHORIZED" &&
    value.productionCandidate === "NOT_CLAIMED"
  );
}

export function validateSevenVoiceDoctrineFunctionalProfileV0_1(
  value: unknown,
): DoctrineFunctionalProfileValidationResultV0_1 {
  if (!isRecordV0_1(value)) {
    return {
      ok: false,
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      reasonCodes: ["PROFILE_NOT_OBJECT"],
    };
  }

  const reasonCodes: DoctrineFunctionalProfileReasonCodeV0_1[] = [];
  const knownKeys = [
    "schemaVersion",
    "engineAuthority",
    "normalizationStatus",
    "truthClassification",
    "voice",
    "functionalProperties",
    "principleAssociation",
    "relationalPropertyIds",
    "symbolicMetadata",
    "unresolvedTensionIds",
    "claimBoundary",
    "userDecisionPosture",
    "noSingleWinner",
  ] as const;

  if (
    !hasOnlyKnownKeysV0_1(value, knownKeys) ||
    "evidenceRefs" in value ||
    "semanticBridge" in value ||
    "targetSense" in value
  ) {
    reasonCodes.push("LEXICAL_EVIDENCE_FIELD_PRESENT");
  }

  if ("startState" in value || "resultState" in value || "transitions" in value) {
    reasonCodes.push("PATH_COMPOSITION_FIELD_PRESENT");
  }
  if (value.schemaVersion !== DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1) {
    reasonCodes.push("SCHEMA_VERSION_INVALID");
  }
  if (value.engineAuthority !== DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1) {
    reasonCodes.push("ENGINE_AUTHORITY_INVALID");
  }
  if (
    value.normalizationStatus !==
    DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1
  ) {
    reasonCodes.push("NORMALIZATION_STATUS_INVALID");
  }
  if (value.truthClassification !== DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1) {
    reasonCodes.push("TRUTH_CLASSIFICATION_INVALID");
  }
  if (typeof value.voice !== "string" || !isSevenVoiceKey(value.voice)) {
    reasonCodes.push("VOICE_INVALID");
  }
  if (
    !Array.isArray(value.functionalProperties) ||
    value.functionalProperties.length === 0 ||
    !value.functionalProperties.every(isFunctionalPropertyDatumV0_1)
  ) {
    reasonCodes.push("FUNCTIONAL_PROPERTIES_INVALID");
  }
  if (!isPrincipleV0_1(value.principleAssociation)) {
    reasonCodes.push("PRINCIPLE_ASSOCIATION_INVALID");
  }
  if (
    !Array.isArray(value.relationalPropertyIds) ||
    !value.relationalPropertyIds.every(nonEmptyStringV0_1)
  ) {
    reasonCodes.push("RELATIONAL_PROPERTIES_INVALID");
  }
  const symbolicMetadata = value.symbolicMetadata;
  if (
    !isRecordV0_1(symbolicMetadata) ||
    !isRecordV0_1(symbolicMetadata.color) ||
    !nonEmptyStringV0_1(symbolicMetadata.color.value) ||
    !sourceRefsValidV0_1(symbolicMetadata.color.sourceRefs) ||
    !Array.isArray(symbolicMetadata.frequencyTensionIds) ||
    symbolicMetadata.frequencyTensionIds.length !== 1 ||
    symbolicMetadata.frequencyTensionIds[0] !== FREQUENCY_TENSION_ID_V0_1
  ) {
    reasonCodes.push("SYMBOLIC_METADATA_INVALID");
  }
  if (
    !Array.isArray(value.unresolvedTensionIds) ||
    value.unresolvedTensionIds.length !== 1 ||
    value.unresolvedTensionIds[0] !== FREQUENCY_TENSION_ID_V0_1
  ) {
    reasonCodes.push("UNRESOLVED_TENSIONS_INVALID");
  }
  if (!isClaimBoundaryV0_1(value.claimBoundary)) {
    reasonCodes.push("CLAIM_BOUNDARY_INVALID");
  }
  if (value.userDecisionPosture !== "user_decides") {
    reasonCodes.push("USER_DECISION_POSTURE_INVALID");
  }
  if (value.noSingleWinner !== true) {
    reasonCodes.push("NO_SINGLE_WINNER_INVALID");
  }

  if (reasonCodes.length > 0) {
    return {
      ok: false,
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      reasonCodes: [...new Set(reasonCodes)],
    };
  }

  return {
    ok: true,
    schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    value: value as SevenVoiceDoctrineFunctionalProfileV0_1,
  };
}

export type DoctrineFunctionalProfileRegistryValidationResultV0_1 = Readonly<{
  ok: boolean;
  schemaVersion: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  reasonCodes: readonly DoctrineFunctionalProfileReasonCodeV0_1[];
}>;

export function validateSevenVoiceDoctrineProfilesV0_1(
  value: unknown = SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
): DoctrineFunctionalProfileRegistryValidationResultV0_1 {
  if (!isRecordV0_1(value)) {
    return {
      ok: false,
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      reasonCodes: ["PROFILE_NOT_OBJECT"],
    };
  }

  const keys = Object.keys(value);
  if (
    keys.length !== symbolicMathOrder.length ||
    keys.some((key, index) => key !== symbolicMathOrder[index])
  ) {
    return {
      ok: false,
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      reasonCodes: ["VOICE_INVALID"],
    };
  }

  const failures = keys.flatMap((key) => {
    const result = validateSevenVoiceDoctrineFunctionalProfileV0_1(value[key]);
    return result.ok ? [] : result.reasonCodes;
  });

  return {
    ok: failures.length === 0,
    schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    reasonCodes: [...new Set(failures)],
  };
}

export function getSevenVoiceDoctrineFunctionalProfileV0_1(
  voice: unknown,
): SevenVoiceDoctrineFunctionalProfileV0_1 | null {
  if (typeof voice !== "string" || !isSevenVoiceKey(voice)) return null;
  return SEVEN_VOICE_DOCTRINE_PROFILES_V0_1[voice];
}

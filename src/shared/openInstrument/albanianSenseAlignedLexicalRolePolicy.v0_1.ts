import {
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_FILE_SHA256_V0_1,
  ALBANET_SOURCE_REPOSITORY_V0_1,
  ALBANET_SOURCE_REVISION_V0_1,
  ALBANET_SOURCE_TITLE_V0_1,
} from "./albanetSourceIdentity.v0_1";

export {
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_FILE_SHA256_V0_1,
  ALBANET_SOURCE_REPOSITORY_V0_1,
  ALBANET_SOURCE_REVISION_V0_1,
  ALBANET_SOURCE_TITLE_V0_1,
} from "./albanetSourceIdentity.v0_1";

export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_SCHEMA_V0_1 =
  "open-instrument.albanian-sense-aligned-lexical-role.v0.1" as const;

export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_PREDICATE_ID_V0_1 =
  "albanian.exact-source-definition.human-role.v0.1" as const;

export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_STATEMENT_V0_1 =
  "This exact Kaikki sense is linked through its source-owned synonym to the reviewed AlbaNet definition, which supports the lexical label HUMAN_ROLE." as const;

export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_ALTERNATIVES_V0_1 = Object.freeze([
  "Each result remains attached to its exact Kaikki sense; another sense of the same word is not merged into it.",
  "Kaikki and AlbaNet lineage independence is not established by these records.",
  "The lexical role label does not imply morphology, historical derivation, embryo function, or Seven-Voices meaning.",
  "No functional operation is classified; functionalOperation remains Null.",
] as const);

export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_CLAIM_BOUNDARY_V0_1 =
  "A reviewed exact-definition predicate can label a uniquely linked source sense as HUMAN_ROLE. The label is lexical and sense-specific; it does not authorize the existing AGENT operation or any morphology, historical, embryo, or Seven-Voices claim." as const;

/** Exact source-definition tuples only; no independent source lineage or expert review is asserted. */
export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_REVIEWED_DEFINITIONS_V0_1 = Object.freeze([
  Object.freeze({
    predicateId: ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_PREDICATE_ID_V0_1,
    reviewStatus: "REVIEWED_EXACT_SOURCE_DEFINITION" as const,
    sourceFamilyId: ALBANET_SOURCE_FAMILY_ID_V0_1,
    sourceRevision: ALBANET_SOURCE_REVISION_V0_1,
    sourceSha256: ALBANET_SOURCE_FILE_SHA256_V0_1,
    sourceTitle: ALBANET_SOURCE_TITLE_V0_1,
    sourceUrl: ALBANET_SOURCE_REPOSITORY_V0_1,
    lemma: "zejtar",
    synsetId: "09974648-n",
    definition: "një punëtor i afte qe praktikon një zanat",
    roleLabel: "HUMAN_ROLE" as const,
    rationale: "The exact definition identifies a worker who practices a craft.",
  }),
  Object.freeze({
    predicateId: ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_PREDICATE_ID_V0_1,
    reviewStatus: "REVIEWED_EXACT_SOURCE_DEFINITION" as const,
    sourceFamilyId: ALBANET_SOURCE_FAMILY_ID_V0_1,
    sourceRevision: ALBANET_SOURCE_REVISION_V0_1,
    sourceSha256: ALBANET_SOURCE_FILE_SHA256_V0_1,
    sourceTitle: ALBANET_SOURCE_TITLE_V0_1,
    sourceUrl: ALBANET_SOURCE_REPOSITORY_V0_1,
    lemma: "aktor",
    synsetId: "09765278-n",
    definition: "aktoret teatrale",
    roleLabel: "HUMAN_ROLE" as const,
    rationale: "The exact definition denotes theatrical actors.",
  }),
] as const);

export const ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_LINEAGE_STATUS_V0_1 =
  "INDEPENDENCE_NOT_ESTABLISHED" as const;

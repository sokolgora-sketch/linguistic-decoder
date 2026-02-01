// BRAIN-0 — CandidateRecord errors v0.1
export const CR_ERR = {
  NOT_OBJECT: "candidateRecord:not_object",
  BAD_VERSION: "candidateRecord:bad_version",

  EMPTY_LANGUAGE_ID: "candidateRecord:empty_languageId",
  EMPTY_LANGUAGE_NAME: "candidateRecord:empty_languageName",
  EMPTY_FORM: "candidateRecord:empty_form",
  EMPTY_GLOSS: "candidateRecord:empty_gloss",

  ROOTS_EMPTY: "candidateRecord:roots_empty",
  ROOT_BAD_TOKEN: "candidateRecord:root_bad_token",

  OPS_BAD_TOKEN: "candidateRecord:ops_bad_token",

  SOURCE_BAD_KIND: "candidateRecord:source_bad_kind",
  SOURCE_EMPTY_REF: "candidateRecord:source_empty_ref",
  SOURCE_EMPTY_VERSION: "candidateRecord:source_empty_version",

  EXPLAINS_BAD_SEGMENT: "candidateRecord:explains_bad_segment",
} as const;

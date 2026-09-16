export const DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1 =
  "open-instrument.dalipaj-embryomorpheme-source-corpus.v0_1" as const;

export const DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1 =
  "dalipaj.embryomorpheme-source.partial.v0_1" as const;

export const DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1 =
  "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT" as const;

export const DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1 =
  "NOT_YET_EVALUATED" as const;

export type DalipajEmbryomorphemeFormClassificationV0_1 =
  | "ATOMIC_EMBRYOMORPHEME"
  | "CONSTITUENT_CLAIM"
  | "COMPOUND_CLAIM";

export type DalipajEmbryomorphemeClaimTypeV0_1 =
  | "LEXICAL_CLAIM"
  | "DALIPAJ_FUNCTIONAL_CLAIM"
  | "DALIPAJ_ETYMOLOGICAL_CLAIM";

export type DalipajEmbryomorphemeSourceClassV0_1 =
  "PRIMARY_AUTHOR_SOURCE";

export type DalipajEmbryomorphemeConfidenceV0_1 =
  | "MEDIUM"
  | "LOW_MEDIUM";

export type DalipajEmbryomorphemeSourceRecordV0_1 = Readonly<{
  recordId: string;
  form: "GROP" | "SY" | "SY-GROP";
  sourceGloss: string;
  formClassification: DalipajEmbryomorphemeFormClassificationV0_1;
  claimTypes: readonly DalipajEmbryomorphemeClaimTypeV0_1[];
  author: "Agron Dalipaj";
  sourceTitle: string;
  sourceUrl: string;
  sourceLocator: string;
  sourceClass: DalipajEmbryomorphemeSourceClassV0_1;
  provenanceCaveat: string;
  confidence: DalipajEmbryomorphemeConfidenceV0_1;
  standaloneAtomicStatus?: "NOT_ESTABLISHED_FROM_ACCESSIBLE_SOURCE";
  zeroEvaluationStatus: typeof DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1;
}>;

export type DalipajEmbryomorphemeSourceCorpusV0_1 = Readonly<{
  schemaVersion: typeof DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1;
  corpusId: typeof DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1;
  corpusAuthority: typeof DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1;
  corpusStatus: "PARTIAL_PRIMARY_CORPUS_AVAILABLE";
  freezeStatus: "FROZEN";
  recordCount: 3;
  canonicalPromotion: "NO";
  runtimeAuthority: "NO";
  historicalClaimAdoption: "NO";
  productionEvidencePromotion: "NO";
  zeroEvaluationStatus: typeof DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1;
  records: readonly DalipajEmbryomorphemeSourceRecordV0_1[];
}>;

export type DalipajEmbryomorphemeSourceCorpusReasonCodeV0_1 =
  | "CORPUS_NOT_RECORD"
  | "SCHEMA_VERSION_INVALID"
  | "CORPUS_ID_INVALID"
  | "AUTHORITY_INVALID"
  | "CORPUS_STATUS_INVALID"
  | "FREEZE_STATUS_INVALID"
  | "RECORD_COUNT_INVALID"
  | "PROMOTION_BOUNDARY_INVALID"
  | "ZERO_EVALUATION_STATUS_INVALID"
  | "RECORDS_INVALID"
  | "RECORD_NOT_RECORD"
  | "RECORD_ID_INVALID"
  | "FORM_INVALID"
  | "SOURCE_GLOSS_INVALID"
  | "FORM_CLASSIFICATION_INVALID"
  | "CLAIM_TYPES_INVALID"
  | "AUTHOR_INVALID"
  | "SOURCE_TITLE_INVALID"
  | "SOURCE_URL_INVALID"
  | "SOURCE_LOCATOR_INVALID"
  | "SOURCE_CLASS_INVALID"
  | "PROVENANCE_CAVEAT_INVALID"
  | "CONFIDENCE_INVALID"
  | "STANDALONE_ATOMIC_STATUS_INVALID"
  | "FORBIDDEN_FIELD_PRESENT"
  | "CANONICAL_CONTENT_INVALID"
  | "DUPLICATE_FORM";

export type DalipajEmbryomorphemeSourceCorpusValidationResultV0_1 = Readonly<
  | {
      ok: true;
      reasonCodes: readonly [];
    }
  | {
      ok: false;
      reasonCodes: readonly DalipajEmbryomorphemeSourceCorpusReasonCodeV0_1[];
    }
>;

const RECORDS_V0_1: readonly DalipajEmbryomorphemeSourceRecordV0_1[] = [
  {
    recordId: "dalipaj.embryomorpheme.grop.v0_1",
    form: "GROP",
    sourceGloss: "pit/hollow; used in the eye-socket context",
    formClassification: "ATOMIC_EMBRYOMORPHEME",
    claimTypes: ["LEXICAL_CLAIM"],
    author: "Agron Dalipaj",
    sourceTitle: "Albanian Etymology: Cyclops (Ciklopi) => Sy-Klopi",
    sourceUrl:
      "https://balkanacademia.com/2026/07/27/albanian-etymology-cyclops-ciklopi-sy-klopi/",
    sourceLocator:
      "Etymology According to TEM/EM: GROPa e SYrit / EYE + PIT discussion",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat:
      "The online page attributes the study to Agron Dalipaj and also identifies a translator; the original publication edition was not independently located.",
    confidence: "MEDIUM",
    zeroEvaluationStatus: DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
  },
  {
    recordId: "dalipaj.embryomorpheme.sy.v0_1",
    form: "SY",
    sourceGloss: "eye component in the EYE + PIT / SY-GROP analysis",
    formClassification: "CONSTITUENT_CLAIM",
    claimTypes: ["LEXICAL_CLAIM", "DALIPAJ_FUNCTIONAL_CLAIM"],
    author: "Agron Dalipaj",
    sourceTitle: "Albanian Etymology: Cyclops (Ciklopi) => Sy-Klopi",
    sourceUrl:
      "https://balkanacademia.com/2026/07/27/albanian-etymology-cyclops-ciklopi-sy-klopi/",
    sourceLocator:
      "Etymology According to TEM/EM: EYE + PIT / SY-GROP discussion",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat:
      "The source uses SY inside a compound analysis but does not provide an independently isolated standalone atomic glossary entry; the online page also has mixed author/translator provenance.",
    confidence: "LOW_MEDIUM",
    standaloneAtomicStatus: "NOT_ESTABLISHED_FROM_ACCESSIBLE_SOURCE",
    zeroEvaluationStatus: DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
  },
  {
    recordId: "dalipaj.embryomorpheme.sy-grop.v0_1",
    form: "SY-GROP",
    sourceGloss: "eye-pit / eye socket",
    formClassification: "COMPOUND_CLAIM",
    claimTypes: [
      "DALIPAJ_FUNCTIONAL_CLAIM",
      "DALIPAJ_ETYMOLOGICAL_CLAIM",
    ],
    author: "Agron Dalipaj",
    sourceTitle: "Albanian Etymology: Cyclops (Ciklopi) => Sy-Klopi",
    sourceUrl:
      "https://balkanacademia.com/2026/07/27/albanian-etymology-cyclops-ciklopi-sy-klopi/",
    sourceLocator:
      "Etymology According to TEM/EM: SY-GROP transformation sequence to CIKLOP",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat:
      "This record preserves an author-attributed compound and proposed etymological relationship only; it does not adopt a historical origin claim, and the original publication edition was not independently located.",
    confidence: "MEDIUM",
    zeroEvaluationStatus: DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
  },
];

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  seen.add(value);
  for (const child of Object.values(value)) {
    deepFreezeV0_1(child, seen);
  }
  return Object.freeze(value);
}

export const DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1 = deepFreezeV0_1({
  schemaVersion: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1,
  corpusId: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1,
  corpusAuthority: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1,
  corpusStatus: "PARTIAL_PRIMARY_CORPUS_AVAILABLE",
  freezeStatus: "FROZEN",
  recordCount: 3,
  canonicalPromotion: "NO",
  runtimeAuthority: "NO",
  historicalClaimAdoption: "NO",
  productionEvidencePromotion: "NO",
  zeroEvaluationStatus: DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
  records: RECORDS_V0_1,
} satisfies DalipajEmbryomorphemeSourceCorpusV0_1);

const FORMS_V0_1 = new Set(["GROP", "SY", "SY-GROP"]);
const CANONICAL_RECORDS_BY_FORM_V0_1 = new Map(
  RECORDS_V0_1.map((record) => [record.form, record]),
);
const FORM_CLASSIFICATIONS_V0_1 = new Set([
  "ATOMIC_EMBRYOMORPHEME",
  "CONSTITUENT_CLAIM",
  "COMPOUND_CLAIM",
]);
const CLAIM_TYPES_V0_1 = new Set([
  "LEXICAL_CLAIM",
  "DALIPAJ_FUNCTIONAL_CLAIM",
  "DALIPAJ_ETYMOLOGICAL_CLAIM",
]);
const CONFIDENCE_VALUES_V0_1 = new Set(["MEDIUM", "LOW_MEDIUM"]);
const FORBIDDEN_FIELDS_V0_1 = new Set([
  "vowelAffinity",
  "expectedVoice",
  "expectedPath",
  "voicePath",
  "zeroVoice",
  "zeroRole",
  "zeroProfile",
  "zeroFunctionalCorrespondence",
  "zeroAgreement",
  "agreementScore",
  "semanticAlignment",
  "targetSenseAlignment",
  "doctrineProjection",
  "functionalComponents",
  "providerOutput",
]);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasForbiddenFieldV0_1(value: unknown): boolean {
  if (!isRecordV0_1(value)) return false;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_FIELDS_V0_1.has(key) || hasForbiddenFieldV0_1(child)) {
      return true;
    }
  }
  return false;
}

function hasOnlyStringsV0_1(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isKnownFormV0_1(
  value: unknown,
): value is DalipajEmbryomorphemeSourceRecordV0_1["form"] {
  return typeof value === "string" && FORMS_V0_1.has(value);
}

function matchesCanonicalValueV0_1(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      actual.length === expected.length &&
      expected.every((item, index) =>
        matchesCanonicalValueV0_1(actual[index], item),
      )
    );
  }

  if (isRecordV0_1(expected)) {
    if (!isRecordV0_1(actual)) return false;
    const expectedKeys = Object.keys(expected).sort();
    const actualKeys = Object.keys(actual).sort();
    return (
      JSON.stringify(actualKeys) === JSON.stringify(expectedKeys) &&
      expectedKeys.every((key) =>
        matchesCanonicalValueV0_1(actual[key], expected[key]),
      )
    );
  }

  return actual === expected;
}

function validateRecordV0_1(
  value: unknown,
): DalipajEmbryomorphemeSourceCorpusReasonCodeV0_1[] {
  if (!isRecordV0_1(value)) return ["RECORD_NOT_RECORD"];

  const reasons = new Set<DalipajEmbryomorphemeSourceCorpusReasonCodeV0_1>();
  if (hasForbiddenFieldV0_1(value)) reasons.add("FORBIDDEN_FIELD_PRESENT");
  if (typeof value.recordId !== "string" || value.recordId.length === 0) {
    reasons.add("RECORD_ID_INVALID");
  }
  if (typeof value.form !== "string" || !FORMS_V0_1.has(value.form)) {
    reasons.add("FORM_INVALID");
  }
  if (typeof value.sourceGloss !== "string" || value.sourceGloss.length === 0) {
    reasons.add("SOURCE_GLOSS_INVALID");
  }
  if (
    typeof value.formClassification !== "string" ||
    !FORM_CLASSIFICATIONS_V0_1.has(value.formClassification)
  ) {
    reasons.add("FORM_CLASSIFICATION_INVALID");
  }
  if (
    !hasOnlyStringsV0_1(value.claimTypes) ||
    value.claimTypes.length === 0 ||
    value.claimTypes.some(
      (claimType) => !CLAIM_TYPES_V0_1.has(claimType),
    )
  ) {
    reasons.add("CLAIM_TYPES_INVALID");
  }
  if (value.author !== "Agron Dalipaj") reasons.add("AUTHOR_INVALID");
  const requiredTextFields = {
    sourceTitle: "SOURCE_TITLE_INVALID",
    sourceUrl: "SOURCE_URL_INVALID",
    sourceLocator: "SOURCE_LOCATOR_INVALID",
    provenanceCaveat: "PROVENANCE_CAVEAT_INVALID",
  } as const;
  for (const [field, reason] of Object.entries(requiredTextFields)) {
    if (typeof value[field] !== "string" || value[field].length === 0) {
      reasons.add(reason);
    }
  }
  if (value.sourceClass !== "PRIMARY_AUTHOR_SOURCE") {
    reasons.add("SOURCE_CLASS_INVALID");
  }
  if (
    typeof value.confidence !== "string" ||
    !CONFIDENCE_VALUES_V0_1.has(value.confidence)
  ) {
    reasons.add("CONFIDENCE_INVALID");
  }
  if (
    value.standaloneAtomicStatus !== undefined &&
    value.standaloneAtomicStatus !== "NOT_ESTABLISHED_FROM_ACCESSIBLE_SOURCE"
  ) {
    reasons.add("STANDALONE_ATOMIC_STATUS_INVALID");
  }
  if (
    value.zeroEvaluationStatus !==
    DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1
  ) {
    reasons.add("ZERO_EVALUATION_STATUS_INVALID");
  }
  if (
    isKnownFormV0_1(value.form) &&
    !matchesCanonicalValueV0_1(
      value,
      CANONICAL_RECORDS_BY_FORM_V0_1.get(value.form),
    )
  ) {
    reasons.add("CANONICAL_CONTENT_INVALID");
  }

  return [...reasons].sort();
}

export function validateDalipajEmbryomorphemeSourceCorpusV0_1(
  value: unknown = DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
): DalipajEmbryomorphemeSourceCorpusValidationResultV0_1 {
  if (!isRecordV0_1(value)) {
    return { ok: false, reasonCodes: ["CORPUS_NOT_RECORD"] };
  }

  const reasons = new Set<DalipajEmbryomorphemeSourceCorpusReasonCodeV0_1>();
  if (hasForbiddenFieldV0_1(value)) reasons.add("FORBIDDEN_FIELD_PRESENT");
  if (
    value.schemaVersion !== DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1
  ) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (value.corpusId !== DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1) {
    reasons.add("CORPUS_ID_INVALID");
  }
  if (
    value.corpusAuthority !==
    DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1
  ) {
    reasons.add("AUTHORITY_INVALID");
  }
  if (value.corpusStatus !== "PARTIAL_PRIMARY_CORPUS_AVAILABLE") {
    reasons.add("CORPUS_STATUS_INVALID");
  }
  if (value.freezeStatus !== "FROZEN") reasons.add("FREEZE_STATUS_INVALID");
  if (value.recordCount !== 3) reasons.add("RECORD_COUNT_INVALID");
  if (
    value.canonicalPromotion !== "NO" ||
    value.runtimeAuthority !== "NO" ||
    value.historicalClaimAdoption !== "NO" ||
    value.productionEvidencePromotion !== "NO"
  ) {
    reasons.add("PROMOTION_BOUNDARY_INVALID");
  }
  if (
    value.zeroEvaluationStatus !==
    DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1
  ) {
    reasons.add("ZERO_EVALUATION_STATUS_INVALID");
  }

  if (!Array.isArray(value.records) || value.records.length !== 3) {
    reasons.add("RECORDS_INVALID");
  } else {
    const seenForms = new Set<string>();
    for (const [index, record] of value.records.entries()) {
      for (const reason of validateRecordV0_1(record)) reasons.add(reason);
      if (!matchesCanonicalValueV0_1(record, RECORDS_V0_1[index])) {
        reasons.add("CANONICAL_CONTENT_INVALID");
      }
      if (isRecordV0_1(record) && typeof record.form === "string") {
        if (seenForms.has(record.form)) reasons.add("DUPLICATE_FORM");
        seenForms.add(record.form);
      }
    }
    if (![...seenForms].every((form) => FORMS_V0_1.has(form))) {
      reasons.add("FORM_INVALID");
    }
  }

  const reasonCodes = [...reasons].sort();
  return reasonCodes.length === 0
    ? { ok: true, reasonCodes: [] }
    : { ok: false, reasonCodes };
}

export function getDalipajEmbryomorphemeSourceRecordV0_1(
  form: unknown,
): DalipajEmbryomorphemeSourceRecordV0_1 | null {
  if (typeof form !== "string" || !FORMS_V0_1.has(form)) return null;
  return (
    DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.find(
      (record) => record.form === form,
    ) ?? null
  );
}

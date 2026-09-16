export const DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1 =
  "open-instrument.dalipaj-embryomorpheme-expanded-source-corpus.v0_1" as const;

export const DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1 =
  "dalipaj.embryomorpheme-source.expanded.v0_1" as const;

export const DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1 =
  "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT" as const;

export const DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1 =
  "NOT_YET_EVALUATED" as const;

export const DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1 =
  "NOT_CONSIDERED" as const;

export type DalipajExpandedEmbryomorphemeFormV0_1 =
  | "BI"
  | "LE"
  | "ZA"
  | "GJ"
  | "MA";

type ClaimTypeV0_1 =
  | "LEXICAL_CLAIM"
  | "DALIPAJ_FUNCTIONAL_CLAIM"
  | "DALIPAJ_ETYMOLOGICAL_CLAIM";

type ExpandedSourceRecordV0_1 = Readonly<{
  recordId: string;
  form: DalipajExpandedEmbryomorphemeFormV0_1;
  sourceGloss: string;
  formClassification: "ATOMIC_EMBRYOMORPHEME";
  claimTypes: readonly ClaimTypeV0_1[];
  author: "Agron Dalipaj";
  sourceTitle: string;
  sourceUrl: string;
  sourceLocator: string;
  sourceClass: "PRIMARY_AUTHOR_SOURCE";
  provenanceCaveat: string;
  confidence: "MEDIUM";
  atomicStatus: "PRIMARY_ATOMIC_VERIFIED";
  zeroEvaluationStatus: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1;
  canonicalStatus: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1;
}>;

export type DalipajExpandedEmbryomorphemeSourceCorpusV0_1 = Readonly<{
  schemaVersion: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1;
  batchId: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1;
  corpusAuthority: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1;
  corpusStatus: "EXPANDED_PRIMARY_CORPUS_BATCH_AVAILABLE";
  freezeStatus: "FROZEN";
  recordCount: 5;
  canonicalPromotion: "NO";
  runtimeAuthority: "NO";
  historicalClaimAdoption: "NO";
  productionEvidencePromotion: "NO";
  zeroEvaluationStatus: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1;
  canonicalStatus: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1;
  records: readonly ExpandedSourceRecordV0_1[];
}>;

export type DalipajExpandedEmbryomorphemeSourceCorpusReasonCodeV0_1 =
  | "CORPUS_NOT_RECORD"
  | "SCHEMA_VERSION_INVALID"
  | "BATCH_ID_INVALID"
  | "AUTHORITY_INVALID"
  | "CORPUS_STATUS_INVALID"
  | "FREEZE_STATUS_INVALID"
  | "RECORD_COUNT_INVALID"
  | "PROMOTION_BOUNDARY_INVALID"
  | "ZERO_EVALUATION_STATUS_INVALID"
  | "CANONICAL_STATUS_INVALID"
  | "RECORDS_INVALID"
  | "RECORD_NOT_RECORD"
  | "RECORD_ID_INVALID"
  | "FORM_INVALID"
  | "SOURCE_GLOSS_INVALID"
  | "CLAIM_TYPES_INVALID"
  | "FORM_CLASSIFICATION_INVALID"
  | "AUTHOR_INVALID"
  | "SOURCE_TITLE_INVALID"
  | "SOURCE_URL_INVALID"
  | "SOURCE_LOCATOR_INVALID"
  | "SOURCE_CLASS_INVALID"
  | "PROVENANCE_CAVEAT_INVALID"
  | "CONFIDENCE_INVALID"
  | "ATOMIC_STATUS_INVALID"
  | "FORBIDDEN_FIELD_PRESENT"
  | "CANONICAL_CONTENT_INVALID"
  | "DUPLICATE_FORM";

export type DalipajExpandedEmbryomorphemeSourceCorpusValidationResultV0_1 = Readonly<
  | { ok: true; reasonCodes: readonly [] }
  | {
      ok: false;
      reasonCodes: readonly DalipajExpandedEmbryomorphemeSourceCorpusReasonCodeV0_1[];
    }
>;

const CLAIM_TYPES_V0_1 = [
  "LEXICAL_CLAIM",
  "DALIPAJ_FUNCTIONAL_CLAIM",
  "DALIPAJ_ETYMOLOGICAL_CLAIM",
] as const;

const PROVENANCE_CAVEAT_V0_1 =
  "The public article is attributed to Agron Dalipaj; this record preserves the attributed source claim without adopting a historical derivation or exposing it to ZË-RO analysis.";

const RECORDS_V0_1 = [
  {
    recordId: "dalipaj.embryomorpheme.bi.v0_1",
    form: "BI",
    sourceGloss: "godas; e qëlloj dikë me diçka; ushtroj dhunë",
    formClassification: "ATOMIC_EMBRYOMORPHEME",
    claimTypes: CLAIM_TYPES_V0_1,
    author: "Agron Dalipaj",
    sourceTitle: "Cila është origjina e fjalës Via, a ekziston etimoni i saj në greqishte?",
    sourceUrl:
      "https://www.botasot.info/kultura/1934372/cila-eshte-origjina-e-fjales-via-a-ekziston-etimoni-i-saj-ne-greqishte/",
    sourceLocator:
      "Bota Sot article text: explicit Embriomorfja [bi] entry and gloss in the acquired source capture, web lines 359-360.",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat: PROVENANCE_CAVEAT_V0_1,
    confidence: "MEDIUM",
    atomicStatus: "PRIMARY_ATOMIC_VERIFIED",
    zeroEvaluationStatus:
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
  },
  {
    recordId: "dalipaj.embryomorpheme.le.v0_1",
    form: "LE",
    sourceGloss: "prodhon, nxjerr, lëshon",
    formClassification: "ATOMIC_EMBRYOMORPHEME",
    claimTypes: CLAIM_TYPES_V0_1,
    author: "Agron Dalipaj",
    sourceTitle: "Daulle është fjalë e gjuhës shqipe, jo e origjinës turko-arabe",
    sourceUrl:
      "https://www.botasot.info/kultura/1921215/daulle-eshte-fjale-e-gjuhes-shqipe-jo-e-origjines-turko-arabe/",
    sourceLocator:
      "Bota Sot article text: explicit embriomorfja [le] entry and gloss in the acquired source capture, web lines 288 and 292-303.",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat: PROVENANCE_CAVEAT_V0_1,
    confidence: "MEDIUM",
    atomicStatus: "PRIMARY_ATOMIC_VERIFIED",
    zeroEvaluationStatus:
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
  },
  {
    recordId: "dalipaj.embryomorpheme.za.v0_1",
    form: "ZA",
    sourceGloss: "kap, lidh",
    formClassification: "ATOMIC_EMBRYOMORPHEME",
    claimTypes: CLAIM_TYPES_V0_1,
    author: "Agron Dalipaj",
    sourceTitle: "Etimologji për fjalën SAMAR",
    sourceUrl: "https://shqip.info/etimologji-per-fjalen-samar/",
    sourceLocator:
      "Shqip.info article text: the Tre embriomorfet list identifies [za] and its gloss, web lines 116-123 in the acquired source capture; author attribution at line 125.",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat: PROVENANCE_CAVEAT_V0_1,
    confidence: "MEDIUM",
    atomicStatus: "PRIMARY_ATOMIC_VERIFIED",
    zeroEvaluationStatus:
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
  },
  {
    recordId: "dalipaj.embryomorpheme.gj.v0_1",
    form: "GJ",
    sourceGloss: "gjë, gja; emër i pacaktuar",
    formClassification: "ATOMIC_EMBRYOMORPHEME",
    claimTypes: CLAIM_TYPES_V0_1,
    author: "Agron Dalipaj",
    sourceTitle: "Etimologji për fjalën SAMAR",
    sourceUrl: "https://shqip.info/etimologji-per-fjalen-samar/",
    sourceLocator:
      "Shqip.info article text: the Tre embriomorfet list identifies [g]/GJ and its gloss, web lines 116-123 in the acquired source capture; author attribution at line 125.",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat: PROVENANCE_CAVEAT_V0_1,
    confidence: "MEDIUM",
    atomicStatus: "PRIMARY_ATOMIC_VERIFIED",
    zeroEvaluationStatus:
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
  },
  {
    recordId: "dalipaj.embryomorpheme.ma.v0_1",
    form: "MA",
    sourceGloss: "mba, me mbajt",
    formClassification: "ATOMIC_EMBRYOMORPHEME",
    claimTypes: CLAIM_TYPES_V0_1,
    author: "Agron Dalipaj",
    sourceTitle: "Etimologji për fjalën SAMAR",
    sourceUrl: "https://shqip.info/etimologji-per-fjalen-samar/",
    sourceLocator:
      "Shqip.info article text: the Tre embriomorfet list identifies [ma] and its gloss, web lines 116-123 in the acquired source capture; author attribution at line 125.",
    sourceClass: "PRIMARY_AUTHOR_SOURCE",
    provenanceCaveat: PROVENANCE_CAVEAT_V0_1,
    confidence: "MEDIUM",
    atomicStatus: "PRIMARY_ATOMIC_VERIFIED",
    zeroEvaluationStatus:
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
  },
] as const satisfies readonly ExpandedSourceRecordV0_1[];

const CANONICAL_FORMS_V0_1 = ["BI", "LE", "ZA", "GJ", "MA"] as const;
const FORBIDDEN_FIELDS_V0_1 = new Set([
  "vowelAffinity",
  "expectedVoice",
  "expectedPath",
  "voicePath",
  "zeroEmbryo",
  "zeroProfile",
  "zeroRole",
  "zeroFunctionalCorrespondence",
  "agreement",
  "agreementScore",
  "semanticAlignment",
  "targetSenseAlignment",
  "doctrineProjection",
  "functionalComponents",
  "providerOutput",
]);
const RECORD_KEYS_V0_1 = [
  "recordId",
  "form",
  "sourceGloss",
  "formClassification",
  "claimTypes",
  "author",
  "sourceTitle",
  "sourceUrl",
  "sourceLocator",
  "sourceClass",
  "provenanceCaveat",
  "confidence",
  "atomicStatus",
  "zeroEvaluationStatus",
  "canonicalStatus",
] as const;
const CANONICAL_RECORDS_BY_FORM_V0_1 = new Map(
  RECORDS_V0_1.map((record) => [record.form, record]),
);

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_1(child, seen);
  }
  return Object.freeze(value);
}

export const DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1 =
  deepFreezeV0_1({
    schemaVersion: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1,
    batchId: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1,
    corpusAuthority: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
    corpusStatus: "EXPANDED_PRIMARY_CORPUS_BATCH_AVAILABLE",
    freezeStatus: "FROZEN",
    recordCount: 5,
    canonicalPromotion: "NO",
    runtimeAuthority: "NO",
    historicalClaimAdoption: "NO",
    productionEvidencePromotion: "NO",
    zeroEvaluationStatus:
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
    records: RECORDS_V0_1,
  } satisfies DalipajExpandedEmbryomorphemeSourceCorpusV0_1);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasForbiddenFieldV0_1(value: unknown): boolean {
  if (!isRecordV0_1(value)) return false;
  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_FIELDS_V0_1.has(key) || hasForbiddenFieldV0_1(child),
  );
}

function hasExactKeysV0_1(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expectedKeys].sort());
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

function matchesClaimTypesV0_1(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length === CLAIM_TYPES_V0_1.length &&
    value.every((claimType, index) => claimType === CLAIM_TYPES_V0_1[index])
  );
}

function validateRecordV0_1(
  value: unknown,
): DalipajExpandedEmbryomorphemeSourceCorpusReasonCodeV0_1[] {
  if (!isRecordV0_1(value)) return ["RECORD_NOT_RECORD"];

  const reasons = new Set<
    DalipajExpandedEmbryomorphemeSourceCorpusReasonCodeV0_1
  >();
  if (hasForbiddenFieldV0_1(value)) reasons.add("FORBIDDEN_FIELD_PRESENT");
  if (!hasExactKeysV0_1(value, RECORD_KEYS_V0_1)) {
    reasons.add("CANONICAL_CONTENT_INVALID");
  }
  if (typeof value.recordId !== "string" || value.recordId.length === 0) {
    reasons.add("RECORD_ID_INVALID");
  }
  if (
    typeof value.form !== "string" ||
    !CANONICAL_FORMS_V0_1.includes(
      value.form as DalipajExpandedEmbryomorphemeFormV0_1,
    )
  ) {
    reasons.add("FORM_INVALID");
  }
  if (typeof value.sourceGloss !== "string" || value.sourceGloss.length === 0) {
    reasons.add("SOURCE_GLOSS_INVALID");
  }
  if (!matchesClaimTypesV0_1(value.claimTypes)) {
    reasons.add("CLAIM_TYPES_INVALID");
  }
  if (value.formClassification !== "ATOMIC_EMBRYOMORPHEME") {
    reasons.add("FORM_CLASSIFICATION_INVALID");
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
  if (value.confidence !== "MEDIUM") reasons.add("CONFIDENCE_INVALID");
  if (value.atomicStatus !== "PRIMARY_ATOMIC_VERIFIED") {
    reasons.add("ATOMIC_STATUS_INVALID");
  }
  if (
    value.zeroEvaluationStatus !==
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1
  ) {
    reasons.add("ZERO_EVALUATION_STATUS_INVALID");
  }
  if (
    value.canonicalStatus !==
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1
  ) {
    reasons.add("CANONICAL_STATUS_INVALID");
  }
  if (
    typeof value.form === "string" &&
    CANONICAL_FORMS_V0_1.includes(
      value.form as DalipajExpandedEmbryomorphemeFormV0_1,
    ) &&
    !matchesCanonicalValueV0_1(
      value,
      CANONICAL_RECORDS_BY_FORM_V0_1.get(
        value.form as DalipajExpandedEmbryomorphemeFormV0_1,
      ),
    )
  ) {
    reasons.add("CANONICAL_CONTENT_INVALID");
  }

  return [...reasons];
}

export function validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1(
  value: unknown = DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
): DalipajExpandedEmbryomorphemeSourceCorpusValidationResultV0_1 {
  if (!isRecordV0_1(value)) {
    return { ok: false, reasonCodes: ["CORPUS_NOT_RECORD"] };
  }

  const reasons = new Set<
    DalipajExpandedEmbryomorphemeSourceCorpusReasonCodeV0_1
  >();
  if (hasForbiddenFieldV0_1(value)) reasons.add("FORBIDDEN_FIELD_PRESENT");
  if (
    value.schemaVersion !==
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1
  ) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (
    value.batchId !== DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1
  ) {
    reasons.add("BATCH_ID_INVALID");
  }
  if (
    value.corpusAuthority !==
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1
  ) {
    reasons.add("AUTHORITY_INVALID");
  }
  if (value.corpusStatus !== "EXPANDED_PRIMARY_CORPUS_BATCH_AVAILABLE") {
    reasons.add("CORPUS_STATUS_INVALID");
  }
  if (value.freezeStatus !== "FROZEN") reasons.add("FREEZE_STATUS_INVALID");
  if (value.recordCount !== 5) reasons.add("RECORD_COUNT_INVALID");
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
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1
  ) {
    reasons.add("ZERO_EVALUATION_STATUS_INVALID");
  }
  if (
    value.canonicalStatus !==
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1
  ) {
    reasons.add("CANONICAL_STATUS_INVALID");
  }
  if (!hasExactKeysV0_1(value, [
    "schemaVersion",
    "batchId",
    "corpusAuthority",
    "corpusStatus",
    "freezeStatus",
    "recordCount",
    "canonicalPromotion",
    "runtimeAuthority",
    "historicalClaimAdoption",
    "productionEvidencePromotion",
    "zeroEvaluationStatus",
    "canonicalStatus",
    "records",
  ])) {
    reasons.add("CANONICAL_CONTENT_INVALID");
  }

  if (!Array.isArray(value.records) || value.records.length !== 5) {
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
    if (
      [...seenForms].some(
        (form) =>
          !CANONICAL_FORMS_V0_1.includes(
            form as DalipajExpandedEmbryomorphemeFormV0_1,
          ),
      )
    ) {
      reasons.add("FORM_INVALID");
    }
  }

  const reasonCodes = [...reasons].sort();
  return reasonCodes.length === 0
    ? { ok: true, reasonCodes: [] }
    : { ok: false, reasonCodes };
}

export function getDalipajExpandedEmbryomorphemeSourceRecordV0_1(
  form: unknown,
): ExpandedSourceRecordV0_1 | null {
  if (
    typeof form !== "string" ||
    !CANONICAL_FORMS_V0_1.includes(
      form as DalipajExpandedEmbryomorphemeFormV0_1,
    )
  ) {
    return null;
  }
  return (
    DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.find(
      (record) => record.form === form,
    ) ?? null
  );
}

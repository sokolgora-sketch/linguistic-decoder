import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import {
  extractSevenVowelsFromString,
  type SevenVowel,
} from "@/shared/math7.core";
import {
  isSevenVoiceKey,
  symbolicMathOrder,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";
import {
  discoverStructuralHypothesesV0_1,
  type StructuralHypothesisV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1,
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1,
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
  getDalipajEmbryomorphemeSourceRecordV0_1,
  type DalipajEmbryomorphemeSourceRecordV0_1,
} from "./dalipajEmbryomorphemeSourceCorpus.v0_1";
import {
  getSevenVoiceDoctrineFunctionalProfileV0_1,
  type SevenVoiceDoctrineFunctionalProfileV0_1,
} from "./doctrineFunctionalProfile.v0_1";
import {
  produceGenericFunctionalHypothesisV1,
  type GenericFunctionalHypothesisV1,
} from "./genericFunctionalHypothesisProducer.v1";

export const DALIPAJ_ZERO_BLIND_COMPARISON_SCHEMA_V0_1 =
  "open-instrument.dalipaj-frozen-corpus-zero-blind-comparison.v0_1" as const;

export const DALIPAJ_ZERO_BLIND_COMPARISON_AUTHORITY_V0_1 =
  "RESEARCH_COMPARISON_ONLY_NOT_RUNTIME_AUTHORITY" as const;

export const DALIPAJ_ZERO_BLIND_COMPARISON_VERDICTS_V0_1 = Object.freeze([
  "DIRECT_CORRESPONDENCE",
  "PARTIAL_CORRESPONDENCE",
  "NO_CORRESPONDENCE",
  "INSUFFICIENT_INFORMATION",
  "STRUCTURAL_NULL",
  "NOT_APPLICABLE",
] as const);

export type DalipajZeroBlindComparisonVerdictV0_1 =
  (typeof DALIPAJ_ZERO_BLIND_COMPARISON_VERDICTS_V0_1)[number];

export type DalipajZeroBlindComparisonReasonCodeV0_1 =
  | "ZERO_OUTPUT_FROZEN_BEFORE_SOURCE_REVEAL"
  | "NO_TARGET_SENSE"
  | "NO_SEMANTIC_ALIGNMENT"
  | "PROVIDER_NOT_USED"
  | "ZERO_STRUCTURAL_NULL"
  | "SOURCE_FORM_ATOMIC"
  | "SOURCE_FORM_CONSTITUENT_ONLY"
  | "SOURCE_FORM_COMPOUND_CLAIM"
  | "STANDALONE_ATOMIC_STATUS_NOT_ESTABLISHED"
  | "HISTORICAL_CLAIM_OUTSIDE_COMPARISON"
  | "NO_EXACT_REVIEWED_PROFILE_PROPERTY_MATCH"
  | "PROFILE_SPECIFICITY_NOT_ESTABLISHED"
  | "PROFILE_MATCH_IS_BROAD"
  | "UNIQUE_PROFILE_PROPERTY_MATCH"
  | "NO_EXTERNAL_EVIDENCE_IN_ZERO_OUTPUT";

export type DalipajZeroProfileSpecificityCheckV0_1 =
  | "NO_MATCH_NO_SPECIFICITY_CLAIM"
  | "UNIQUE_PROFILE_TOKEN_MATCH"
  | "BROAD_PROFILE_TOKEN_MATCH"
  | "NOT_APPLICABLE_STRUCTURAL_NULL";

export type DalipajZeroFrozenAnalysisV0_1 = Readonly<{
  form: DalipajEmbryomorphemeSourceRecordV0_1["form"];
  normalizedForm: string;
  voicePath: readonly SevenVoiceKey[];
  structuralHypothesisId: string | null;
  embryo: string | null;
  functionalComponents: GenericFunctionalHypothesisV1["functionalComponents"] | null;
  genericFunctionalHypothesis: GenericFunctionalHypothesisV1 | null;
  truthClassification: "hypothesis" | "unknown";
  evidenceStatus: "NO_EXTERNAL_EVIDENCE" | "NOT_APPLICABLE_STRUCTURAL_NULL";
}>;

export type DalipajZeroBlindComparisonRecordV0_1 = Readonly<{
  recordId: string;
  form: DalipajEmbryomorphemeSourceRecordV0_1["form"];
  sourceFormClassification: DalipajEmbryomorphemeSourceRecordV0_1["formClassification"];
  sourceGloss: string;
  zeroOutput: DalipajZeroFrozenAnalysisV0_1;
  verdict: DalipajZeroBlindComparisonVerdictV0_1;
  reasonCodes: readonly DalipajZeroBlindComparisonReasonCodeV0_1[];
  profileSpecificityCheck: DalipajZeroProfileSpecificityCheckV0_1;
  sourceClaimWasUsedForGeneration: false;
}>;

export type DalipajZeroBlindComparisonResultV0_1 = Readonly<{
  schemaVersion: typeof DALIPAJ_ZERO_BLIND_COMPARISON_SCHEMA_V0_1;
  comparisonAuthority: typeof DALIPAJ_ZERO_BLIND_COMPARISON_AUTHORITY_V0_1;
  sourceCorpusId: typeof DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1;
  sourceCorpusAuthority: typeof DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1;
  comparisonPhase: "SOURCE_REVEALED_AFTER_ZERO_OUTPUT_FREEZE";
  comparisonRecordCount: 3;
  records: readonly DalipajZeroBlindComparisonRecordV0_1[];
  cyclopsHistoricalClaimEvaluated: "NO";
  sourceGlossVisibleDuringGeneration: false;
  targetSenseInjected: false;
  semanticAlignmentInjected: false;
  providerCalls: 0;
  corpusLevelResult:
    | "NO_OBSERVED_CORRESPONDENCE"
    | "LIMITED_OBSERVED_CORRESPONDENCE"
    | "MIXED_OBSERVED_CORRESPONDENCE"
    | "OBSERVED_CORRESPONDENCE_REQUIRES_LARGER_CORPUS"
    | "INSUFFICIENT_INFORMATION";
  dalipajValidatesZero: "NO";
  zeroValidatesDalipaj: "NO";
  canonicalPromotion: "NO";
  runtimeAuthority: "NO";
  productionEvidencePromotion: "NO";
  moreSourceAcquisitionWarranted: "YES" | "NO_CURRENT_REASON_TO_EXPAND";
}>;

export type DalipajZeroFormOnlyAnalysisRunnerV0_1 = (
  form: DalipajEmbryomorphemeSourceRecordV0_1["form"],
) =>
  | DalipajZeroFrozenAnalysisV0_1
  | Promise<DalipajZeroFrozenAnalysisV0_1>;

export type DalipajZeroBlindComparisonOptionsV0_1 = Readonly<{
  analyzeForm?: DalipajZeroFormOnlyAnalysisRunnerV0_1;
}>;

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

function normalizeFormV0_1(form: string): string {
  return form
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^a-zë]/g, "");
}

function canonicalVoicePathV0_1(value: unknown): readonly SevenVoiceKey[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (voice): voice is SevenVoiceKey =>
        typeof voice === "string" && isSevenVoiceKey(voice),
    )
  ) {
    return [];
  }

  return [...value];
}

function structuralPathV0_1(
  hypothesis: StructuralHypothesisV0_1,
): readonly SevenVowel[] {
  return extractSevenVowelsFromString(hypothesis.embryo);
}

export async function runDalipajZeroFormOnlyAnalysisV0_1(
  form: DalipajEmbryomorphemeSourceRecordV0_1["form"],
): Promise<DalipajZeroFrozenAnalysisV0_1> {
  const payload = await runAnalysisDeterministic(form, {
    mode: "strict",
    alphabet: "auto",
  });
  const structuralHypothesis =
    discoverStructuralHypothesesV0_1(form)[0] ?? null;

  let genericFunctionalHypothesis: GenericFunctionalHypothesisV1 | null = null;
  if (structuralHypothesis) {
    const built = produceGenericFunctionalHypothesisV1({
      targetWord: normalizeFormV0_1(form),
      structuralHypothesis,
      voicePath: structuralPathV0_1(structuralHypothesis),
    });

    if (built.ok) {
      genericFunctionalHypothesis = built.hypothesis;
    }
  }

  return deepFreezeV0_1({
    form,
    normalizedForm: normalizeFormV0_1(form),
    voicePath: canonicalVoicePathV0_1(payload.primaryPath?.voicePath),
    structuralHypothesisId: structuralHypothesis?.hypothesisId ?? null,
    embryo: structuralHypothesis?.embryo ?? null,
    functionalComponents:
      genericFunctionalHypothesis?.functionalComponents ?? null,
    genericFunctionalHypothesis,
    truthClassification: genericFunctionalHypothesis
      ? genericFunctionalHypothesis.truthClassification
      : "unknown",
    evidenceStatus: genericFunctionalHypothesis
      ? "NO_EXTERNAL_EVIDENCE"
      : "NOT_APPLICABLE_STRUCTURAL_NULL",
  });
}

function normalizedTermsV0_1(value: string): readonly string[] {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("en-US")
    .replace(/_/g, " ")
    .split(/[^a-zë]+/g)
    .map((term) => term.trim())
    .filter(Boolean);
}

function profileTermsV0_1(
  profile: SevenVoiceDoctrineFunctionalProfileV0_1,
): readonly string[] {
  return [
    ...profile.functionalProperties.flatMap((property) =>
      normalizedTermsV0_1(property.id),
    ),
    ...normalizedTermsV0_1(profile.principleAssociation.label),
  ];
}

function exactProfileMatchesV0_1(
  sourceGloss: string,
  zeroOutput: DalipajZeroFrozenAnalysisV0_1,
): Readonly<{
  matchedTerms: readonly string[];
  matchedVoices: readonly SevenVoiceKey[];
}> {
  const sourceTerms = new Set(normalizedTermsV0_1(sourceGloss));
  const pathVoices = new Set(zeroOutput.voicePath);
  const matchedTerms = new Set<string>();
  const matchedVoices = new Set<SevenVoiceKey>();

  for (const voice of symbolicMathOrder) {
    const profile = getSevenVoiceDoctrineFunctionalProfileV0_1(voice);
    if (!profile) continue;
    const profileTerms = profileTermsV0_1(profile);
    const matchingTerms = profileTerms.filter((term) => sourceTerms.has(term));

    if (matchingTerms.length > 0) {
      for (const term of matchingTerms) matchedTerms.add(term);
      if (pathVoices.has(voice)) matchedVoices.add(voice);
    }
  }

  return {
    matchedTerms: [...matchedTerms].sort(),
    matchedVoices: [...matchedVoices],
  };
}

function commonReasonCodesV0_1(): DalipajZeroBlindComparisonReasonCodeV0_1[] {
  return [
    "ZERO_OUTPUT_FROZEN_BEFORE_SOURCE_REVEAL",
    "NO_TARGET_SENSE",
    "NO_SEMANTIC_ALIGNMENT",
    "PROVIDER_NOT_USED",
  ];
}

function compareRecordV0_1(
  sourceRecord: DalipajEmbryomorphemeSourceRecordV0_1,
  zeroOutput: DalipajZeroFrozenAnalysisV0_1,
): DalipajZeroBlindComparisonRecordV0_1 {
  const reasonCodes = commonReasonCodesV0_1();

  if (zeroOutput.embryo === null) {
    reasonCodes.push("ZERO_STRUCTURAL_NULL");
    if (sourceRecord.formClassification === "CONSTITUENT_CLAIM") {
      reasonCodes.push(
        "SOURCE_FORM_CONSTITUENT_ONLY",
        "STANDALONE_ATOMIC_STATUS_NOT_ESTABLISHED",
      );
    }
    if (sourceRecord.formClassification === "COMPOUND_CLAIM") {
      reasonCodes.push(
        "SOURCE_FORM_COMPOUND_CLAIM",
        "HISTORICAL_CLAIM_OUTSIDE_COMPARISON",
      );
    }

    return {
      recordId: sourceRecord.recordId,
      form: sourceRecord.form,
      sourceFormClassification: sourceRecord.formClassification,
      sourceGloss: sourceRecord.sourceGloss,
      zeroOutput,
      verdict: "STRUCTURAL_NULL",
      reasonCodes: [...new Set(reasonCodes)],
      profileSpecificityCheck: "NOT_APPLICABLE_STRUCTURAL_NULL",
      sourceClaimWasUsedForGeneration: false,
    };
  }

  reasonCodes.push("SOURCE_FORM_ATOMIC", "NO_EXTERNAL_EVIDENCE_IN_ZERO_OUTPUT");
  const matches = exactProfileMatchesV0_1(sourceRecord.sourceGloss, zeroOutput);

  if (matches.matchedTerms.length === 0) {
    reasonCodes.push(
      "NO_EXACT_REVIEWED_PROFILE_PROPERTY_MATCH",
      "PROFILE_SPECIFICITY_NOT_ESTABLISHED",
    );
    return {
      recordId: sourceRecord.recordId,
      form: sourceRecord.form,
      sourceFormClassification: sourceRecord.formClassification,
      sourceGloss: sourceRecord.sourceGloss,
      zeroOutput,
      verdict: "NO_CORRESPONDENCE",
      reasonCodes: [...new Set(reasonCodes)],
      profileSpecificityCheck: "NO_MATCH_NO_SPECIFICITY_CLAIM",
      sourceClaimWasUsedForGeneration: false,
    };
  }

  const profileSpecificityCheck =
    matches.matchedVoices.length === 1
      ? "UNIQUE_PROFILE_TOKEN_MATCH"
      : "BROAD_PROFILE_TOKEN_MATCH";
  reasonCodes.push(
    profileSpecificityCheck === "UNIQUE_PROFILE_TOKEN_MATCH"
      ? "UNIQUE_PROFILE_PROPERTY_MATCH"
      : "PROFILE_MATCH_IS_BROAD",
  );

  return {
    recordId: sourceRecord.recordId,
    form: sourceRecord.form,
    sourceFormClassification: sourceRecord.formClassification,
    sourceGloss: sourceRecord.sourceGloss,
    zeroOutput,
    verdict:
      profileSpecificityCheck === "UNIQUE_PROFILE_TOKEN_MATCH"
        ? "PARTIAL_CORRESPONDENCE"
        : "INSUFFICIENT_INFORMATION",
    reasonCodes: [...new Set(reasonCodes)],
    profileSpecificityCheck,
    sourceClaimWasUsedForGeneration: false,
  };
}

function corpusLevelResultV0_1(
  records: readonly DalipajZeroBlindComparisonRecordV0_1[],
): DalipajZeroBlindComparisonResultV0_1["corpusLevelResult"] {
  const verdicts = records.map((record) => record.verdict);
  const hasDirect = verdicts.includes("DIRECT_CORRESPONDENCE");
  const hasPartial = verdicts.includes("PARTIAL_CORRESPONDENCE");
  const hasNo = verdicts.includes("NO_CORRESPONDENCE");
  const hasNull = verdicts.includes("STRUCTURAL_NULL");

  if (hasDirect && (hasNo || hasNull || hasPartial)) {
    return "MIXED_OBSERVED_CORRESPONDENCE";
  }
  if (hasDirect || hasPartial) {
    return "LIMITED_OBSERVED_CORRESPONDENCE";
  }
  if (hasNo || hasNull) return "NO_OBSERVED_CORRESPONDENCE";
  return "INSUFFICIENT_INFORMATION";
}

export async function compareDalipajFrozenCorpusToZeroV0_1(
  options: DalipajZeroBlindComparisonOptionsV0_1 = {},
): Promise<DalipajZeroBlindComparisonResultV0_1> {
  const analyzeForm =
    options.analyzeForm ?? runDalipajZeroFormOnlyAnalysisV0_1;

  // Phase A/B: only forms cross the generation boundary. Source glosses are
  // not read into the runner and cannot affect the frozen Zero outputs.
  const forms = DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
    ({ form }) => form,
  );
  const zeroOutputs = deepFreezeV0_1(
    await Promise.all(forms.map((form) => analyzeForm(form))),
  );

  // Phase C: source records, including glosses, are revealed only after all
  // form-only outputs have been frozen.
  const sourceRecords = forms.map((form) => {
    const record = getDalipajEmbryomorphemeSourceRecordV0_1(form);
    if (!record) throw new Error(`Missing frozen source record for ${form}`);
    return record;
  });
  const records = sourceRecords.map((sourceRecord, index) =>
    compareRecordV0_1(sourceRecord, zeroOutputs[index]),
  );

  return deepFreezeV0_1({
    schemaVersion: DALIPAJ_ZERO_BLIND_COMPARISON_SCHEMA_V0_1,
    comparisonAuthority: DALIPAJ_ZERO_BLIND_COMPARISON_AUTHORITY_V0_1,
    sourceCorpusId: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_ID_V0_1,
    sourceCorpusAuthority: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1,
    comparisonPhase: "SOURCE_REVEALED_AFTER_ZERO_OUTPUT_FREEZE",
    comparisonRecordCount: records.length as 3,
    records,
    cyclopsHistoricalClaimEvaluated: "NO",
    sourceGlossVisibleDuringGeneration: false,
    targetSenseInjected: false,
    semanticAlignmentInjected: false,
    providerCalls: 0,
    corpusLevelResult: corpusLevelResultV0_1(records),
    dalipajValidatesZero: "NO",
    zeroValidatesDalipaj: "NO",
    canonicalPromotion: "NO",
    runtimeAuthority: "NO",
    productionEvidencePromotion: "NO",
    moreSourceAcquisitionWarranted: "YES",
  });
}

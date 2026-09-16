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
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
  getDalipajExpandedEmbryomorphemeSourceRecordV0_1,
  type DalipajExpandedEmbryomorphemeFormV0_1,
} from "./dalipajEmbryomorphemeExpandedSourceCorpus.v0_1";
import {
  getSevenVoiceDoctrineFunctionalProfileV0_1,
  type DoctrineFunctionalProfileDatumV0_1,
  type DoctrineFunctionalPropertyIdV0_1,
} from "./doctrineFunctionalProfile.v0_1";
import {
  produceGenericFunctionalHypothesisV1,
  type GenericFunctionalHypothesisV1,
} from "./genericFunctionalHypothesisProducer.v1";

export const DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_SCHEMA_V0_1 =
  "open-instrument.dalipaj-expanded-atomic-blind-comparison.v0_1" as const;

export const DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_AUTHORITY_V0_1 =
  "RESEARCH_COMPARISON_ONLY_NOT_RUNTIME_AUTHORITY" as const;

export const DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_VERDICTS_V0_1 =
  Object.freeze([
    "DIRECT_CORRESPONDENCE",
    "PARTIAL_CORRESPONDENCE",
    "NO_CORRESPONDENCE",
    "INSUFFICIENT_INFORMATION",
    "NOT_APPLICABLE_STRUCTURAL_NULL",
  ] as const);

export type DalipajExpandedAtomicBlindComparisonVerdictV0_1 =
  (typeof DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_VERDICTS_V0_1)[number];

export type DalipajExpandedAtomicBlindComparisonReasonCodeV0_1 =
  | "ZERO_OUTPUT_FROZEN_BEFORE_SOURCE_REVEAL"
  | "NO_TARGET_SENSE"
  | "NO_SEMANTIC_ALIGNMENT"
  | "PROVIDER_NOT_USED"
  | "SOURCE_FORM_ATOMIC"
  | "SOURCE_FUNCTIONAL_TARGET_REVEALED_AFTER_ZERO_OUTPUT_FREEZE"
  | "ZERO_STRUCTURAL_NULL"
  | "GENERIC_HYPOTHESIS_UNAVAILABLE"
  | "NO_EXACT_CANONICAL_PROPERTY_MATCH"
  | "PROPERTY_DEFINITION_INSUFFICIENT"
  | "PROFILE_SPECIFICITY_NOT_ESTABLISHED"
  | "UNIQUE_EXACT_CANONICAL_PROPERTY_MATCH"
  | "PROFILE_MATCH_IS_NOT_UNIQUE"
  | "WRONG_PROFILE_EXACT_PROPERTY_ALTERNATIVE";

export type DalipajExpandedAtomicBlindComparisonPropertySpecificityV0_1 =
  | "HIGH_SPECIFICITY"
  | "MEDIUM_SPECIFICITY"
  | "LOW_SPECIFICITY"
  | "NOT_OBJECTIVELY_MATCHABLE";

export type DalipajExpandedAtomicBlindComparisonProfileSpecificityV0_1 =
  | "NO_MATCH_NO_SPECIFICITY_CLAIM"
  | "UNIQUE_ASSIGNED_PROFILE_MATCH"
  | "ASSIGNED_PROFILE_MATCH_HAS_WRONG_PROFILE_ALTERNATIVES"
  | "NO_ASSIGNED_PROFILE_MATCH"
  | "NOT_APPLICABLE_STRUCTURAL_NULL";

type ExpandedSourceRecordV0_1 = Readonly<{
  recordId: string;
  form: DalipajExpandedEmbryomorphemeFormV0_1;
  sourceGloss: string;
}>;

type FrozenFunctionalTargetV0_1 = Readonly<{
  target: string;
}>;

const FROZEN_FUNCTIONAL_TARGETS_V0_1 = Object.freeze({
  BI: { target: "striking / using force" },
  LE: { target: "produces / brings out / releases" },
  ZA: { target: "catches / binds" },
  GJ: { target: "thing / unspecified entity" },
  MA: { target: "holds / keeps" },
} as const satisfies Record<
  DalipajExpandedEmbryomorphemeFormV0_1,
  FrozenFunctionalTargetV0_1
>);

const PROPERTY_SPECIFICITY_V0_1 = {
  beginning: "HIGH_SPECIFICITY",
  creation: "HIGH_SPECIFICITY",
  activation: "MEDIUM_SPECIFICITY",
  life_pulse: "NOT_OBJECTIVELY_MATCHABLE",
  expansion: "HIGH_SPECIFICITY",
  transformation: "HIGH_SPECIFICITY",
  connection: "MEDIUM_SPECIFICITY",
  growth: "MEDIUM_SPECIFICITY",
  illumination: "MEDIUM_SPECIFICITY",
  knowledge: "HIGH_SPECIFICITY",
  recognition: "MEDIUM_SPECIFICITY",
  clarity: "MEDIUM_SPECIFICITY",
  truth_orientation: "LOW_SPECIFICITY",
  understanding: "MEDIUM_SPECIFICITY",
  mediation: "HIGH_SPECIFICITY",
  balance: "MEDIUM_SPECIFICITY",
  order: "HIGH_SPECIFICITY",
  center: "MEDIUM_SPECIFICITY",
  harmonization: "LOW_SPECIFICITY",
  non_domination: "NOT_OBJECTIVELY_MATCHABLE",
  unification: "LOW_SPECIFICITY",
  support: "MEDIUM_SPECIFICITY",
  grounding: "LOW_SPECIFICITY",
  depth: "LOW_SPECIFICITY",
  stability: "MEDIUM_SPECIFICITY",
  nourishment: "MEDIUM_SPECIFICITY",
  belonging: "LOW_SPECIFICITY",
  foundation: "MEDIUM_SPECIFICITY",
  choice: "HIGH_SPECIFICITY",
  duality: "HIGH_SPECIFICITY",
  exploration: "HIGH_SPECIFICITY",
  adventure: "MEDIUM_SPECIFICITY",
  mystery: "LOW_SPECIFICITY",
  imagination: "LOW_SPECIFICITY",
  experimentation: "HIGH_SPECIFICITY",
  discovery: "HIGH_SPECIFICITY",
  risk: "MEDIUM_SPECIFICITY",
  learning_from_experience: "NOT_OBJECTIVELY_MATCHABLE",
  resolution: "HIGH_SPECIFICITY",
  harmony: "LOW_SPECIFICITY",
  peace: "MEDIUM_SPECIFICITY",
  reconciliation: "HIGH_SPECIFICITY",
  unity: "LOW_SPECIFICITY",
  emotional_interiority: "NOT_OBJECTIVELY_MATCHABLE",
} as const satisfies Record<
  DoctrineFunctionalPropertyIdV0_1,
  DalipajExpandedAtomicBlindComparisonPropertySpecificityV0_1
>;

type PropertyMatchV0_1 = Readonly<{
  voice: SevenVoiceKey;
  property: DoctrineFunctionalPropertyIdV0_1;
  specificity: DalipajExpandedAtomicBlindComparisonPropertySpecificityV0_1;
  sourceClass: DoctrineFunctionalProfileDatumV0_1["sourceClass"];
}>;

export type DalipajExpandedAtomicBlindFrozenAnalysisV0_1 = Readonly<{
  form: DalipajExpandedEmbryomorphemeFormV0_1;
  normalizedForm: string;
  vowelSequence: readonly SevenVowel[];
  voicePath: readonly SevenVoiceKey[];
  structuralStatus: "STRUCTURAL_CANDIDATE_AVAILABLE" | "STRUCTURAL_NULL";
  structuralHypothesisId: string | null;
  structuralEmbryo: string | null;
  structuralExpansionChain: readonly string[] | null;
  genericHypothesisStatus: "AVAILABLE" | "UNAVAILABLE";
  genericFunctionalHypothesis: GenericFunctionalHypothesisV1 | null;
  functionalComponents: GenericFunctionalHypothesisV1["functionalComponents"] | null;
  truthClassification: "hypothesis" | "unknown";
  evidenceState: "NO_EXTERNAL_EVIDENCE" | "NOT_APPLICABLE_STRUCTURAL_NULL";
}>;

export type DalipajExpandedAtomicBlindComparisonRecordV0_1 = Readonly<{
  recordId: string;
  form: DalipajExpandedEmbryomorphemeFormV0_1;
  sourceGloss: string;
  sourceFunctionalTarget: string;
  zeroOutput: DalipajExpandedAtomicBlindFrozenAnalysisV0_1;
  zeroOutputFrozenBeforeSourceReveal: true;
  sourceClaimWasUsedForGeneration: false;
  verdict: DalipajExpandedAtomicBlindComparisonVerdictV0_1;
  reasonCodes: readonly DalipajExpandedAtomicBlindComparisonReasonCodeV0_1[];
  matchedProperty: DoctrineFunctionalPropertyIdV0_1 | null;
  matchedPropertySpecificity:
    | DalipajExpandedAtomicBlindComparisonPropertySpecificityV0_1
    | null;
  matchedPropertySourceClass: DoctrineFunctionalProfileDatumV0_1["sourceClass"] | null;
  wrongProfileAlternatives: readonly PropertyMatchV0_1[];
  profileSpecificityVerdict: DalipajExpandedAtomicBlindComparisonProfileSpecificityV0_1;
  propertyDefinitionInsufficient: boolean;
}>;

export type DalipajExpandedAtomicBlindComparisonResultV0_1 = Readonly<{
  schemaVersion: typeof DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_SCHEMA_V0_1;
  comparisonAuthority: typeof DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_AUTHORITY_V0_1;
  sourceCorpusId: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1;
  sourceCorpusAuthority: typeof DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1;
  comparisonPhase: "SOURCE_REVEALED_AFTER_ZERO_OUTPUT_FREEZE";
  comparisonRecordCount: 5;
  records: readonly DalipajExpandedAtomicBlindComparisonRecordV0_1[];
  sourceGlossVisibleDuringGeneration: false;
  targetSenseInjected: false;
  semanticAlignmentInjected: false;
  providerCalls: 0;
  totalCases: 5;
  structuralCandidateCount: number;
  structuralNullCount: number;
  functionallyComparableCount: number;
  directCorrespondenceCount: number;
  partialCorrespondenceCount: number;
  noCorrespondenceCount: number;
  insufficientInformationCount: number;
  propertyDefinitionInsufficientCases: number;
  corpusLevelResult:
    | "STRUCTURAL_CAPABILITY_LIMIT_DOMINATES"
    | "SEMANTIC_DEFINITION_LIMIT_DOMINATES"
    | "LIMITED_OBSERVED_CORRESPONDENCE"
    | "MIXED_OBSERVED_CORRESPONDENCE"
    | "NO_OBSERVED_CORRESPONDENCE"
    | "INSUFFICIENT_INFORMATION";
  structuralDiscoveryLimitObserved: "YES" | "NO";
  functionalCorrespondenceObserved: "YES" | "NO" | "MIXED" | "INSUFFICIENT";
  propertyDefinitionGapMateriallyObserved: "YES" | "NO";
  unequalPropertyCountsEffect: "ESTABLISHED" | "NOT_ESTABLISHED";
  connectionDuplicateEffect: "YES" | "NO";
  profileModificationEvidence: "YES" | "NO" | "INSUFFICIENT";
  cyclopsHistoricalClaimEvaluated: "NO";
  dalipajValidatesZero: "NO";
  zeroValidatesDalipaj: "NO";
  canonicalPromotion: "NO";
  runtimeAuthority: "NO";
  productionEvidencePromotion: "NO";
  historicalClaimAdoption: "NO";
}>;

export type DalipajExpandedAtomicBlindFormOnlyAnalysisRunnerV0_1 = (
  form: DalipajExpandedEmbryomorphemeFormV0_1,
) =>
  | DalipajExpandedAtomicBlindFrozenAnalysisV0_1
  | Promise<DalipajExpandedAtomicBlindFrozenAnalysisV0_1>;

export type DalipajExpandedAtomicBlindComparisonOptionsV0_1 = Readonly<{
  analyzeForm?: DalipajExpandedAtomicBlindFormOnlyAnalysisRunnerV0_1;
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

export async function runDalipajExpandedAtomicZeroFormOnlyAnalysisV0_1(
  form: DalipajExpandedEmbryomorphemeFormV0_1,
): Promise<DalipajExpandedAtomicBlindFrozenAnalysisV0_1> {
  const normalizedForm = normalizeFormV0_1(form);
  const payload = await runAnalysisDeterministic(form, {
    mode: "strict",
    alphabet: "auto",
  });
  const structuralHypothesis =
    discoverStructuralHypothesesV0_1(form)[0] ?? null;

  let genericFunctionalHypothesis: GenericFunctionalHypothesisV1 | null = null;
  if (structuralHypothesis) {
    const built = produceGenericFunctionalHypothesisV1({
      targetWord: normalizedForm,
      structuralHypothesis,
      voicePath: structuralPathV0_1(structuralHypothesis),
    });

    if (built.ok) genericFunctionalHypothesis = built.hypothesis;
  }

  return deepFreezeV0_1({
    form,
    normalizedForm,
    vowelSequence: extractSevenVowelsFromString(normalizedForm),
    voicePath: canonicalVoicePathV0_1(payload.primaryPath?.voicePath),
    structuralStatus: structuralHypothesis
      ? "STRUCTURAL_CANDIDATE_AVAILABLE"
      : "STRUCTURAL_NULL",
    structuralHypothesisId: structuralHypothesis?.hypothesisId ?? null,
    structuralEmbryo: structuralHypothesis?.embryo ?? null,
    structuralExpansionChain: structuralHypothesis?.expansionChain ?? null,
    genericHypothesisStatus: genericFunctionalHypothesis
      ? "AVAILABLE"
      : "UNAVAILABLE",
    genericFunctionalHypothesis,
    functionalComponents:
      genericFunctionalHypothesis?.functionalComponents ?? null,
    truthClassification: genericFunctionalHypothesis
      ? genericFunctionalHypothesis.truthClassification
      : "unknown",
    evidenceState: genericFunctionalHypothesis
      ? "NO_EXTERNAL_EVIDENCE"
      : "NOT_APPLICABLE_STRUCTURAL_NULL",
  });
}

function targetConceptsV0_1(target: string): readonly string[] {
  return target
    .normalize("NFC")
    .toLocaleLowerCase("en-US")
    .split("/")
    .map((concept) => concept.trim().replace(/\s+/g, " "))
    .filter(Boolean);
}

function canonicalPropertyTermV0_1(
  property: DoctrineFunctionalPropertyIdV0_1,
): string {
  return property.replace(/_/g, " ");
}

function isPrimaryMatchSpecificityV0_1(
  specificity: DalipajExpandedAtomicBlindComparisonPropertySpecificityV0_1,
): boolean {
  return (
    specificity === "HIGH_SPECIFICITY" ||
    specificity === "MEDIUM_SPECIFICITY"
  );
}

function exactProfileMatchesV0_1(
  sourceFunctionalTarget: string,
  voicePath: readonly SevenVoiceKey[],
): Readonly<{
  assigned: readonly PropertyMatchV0_1[];
  wrongProfileAlternatives: readonly PropertyMatchV0_1[];
}> {
  const concepts = new Set(targetConceptsV0_1(sourceFunctionalTarget));
  const pathVoices = new Set(voicePath);
  const assigned: PropertyMatchV0_1[] = [];
  const wrongProfileAlternatives: PropertyMatchV0_1[] = [];

  for (const voice of symbolicMathOrder) {
    const profile = getSevenVoiceDoctrineFunctionalProfileV0_1(voice);
    if (!profile) continue;

    for (const property of profile.functionalProperties) {
      const specificity = PROPERTY_SPECIFICITY_V0_1[property.id];
      if (
        !isPrimaryMatchSpecificityV0_1(specificity) ||
        !concepts.has(canonicalPropertyTermV0_1(property.id))
      ) {
        continue;
      }

      const match = {
        voice,
        property: property.id,
        specificity,
        sourceClass: property.sourceClass,
      } satisfies PropertyMatchV0_1;
      if (pathVoices.has(voice)) assigned.push(match);
      else wrongProfileAlternatives.push(match);
    }
  }

  return { assigned, wrongProfileAlternatives };
}

function commonReasonCodesV0_1(): DalipajExpandedAtomicBlindComparisonReasonCodeV0_1[] {
  return [
    "ZERO_OUTPUT_FROZEN_BEFORE_SOURCE_REVEAL",
    "NO_TARGET_SENSE",
    "NO_SEMANTIC_ALIGNMENT",
    "PROVIDER_NOT_USED",
  ];
}

function compareRecordV0_1(
  sourceRecord: ExpandedSourceRecordV0_1,
  zeroOutput: DalipajExpandedAtomicBlindFrozenAnalysisV0_1,
): DalipajExpandedAtomicBlindComparisonRecordV0_1 {
  const reasonCodes = commonReasonCodesV0_1();
  reasonCodes.push(
    "SOURCE_FORM_ATOMIC",
    "SOURCE_FUNCTIONAL_TARGET_REVEALED_AFTER_ZERO_OUTPUT_FREEZE",
  );

  const sourceFunctionalTarget = FROZEN_FUNCTIONAL_TARGETS_V0_1[
    sourceRecord.form
  ].target;

  if (zeroOutput.structuralStatus === "STRUCTURAL_NULL") {
    reasonCodes.push("ZERO_STRUCTURAL_NULL");
    return {
      recordId: sourceRecord.recordId,
      form: sourceRecord.form,
      sourceGloss: sourceRecord.sourceGloss,
      sourceFunctionalTarget,
      zeroOutput,
      zeroOutputFrozenBeforeSourceReveal: true,
      sourceClaimWasUsedForGeneration: false,
      verdict: "NOT_APPLICABLE_STRUCTURAL_NULL",
      reasonCodes: [...new Set(reasonCodes)],
      matchedProperty: null,
      matchedPropertySpecificity: null,
      matchedPropertySourceClass: null,
      wrongProfileAlternatives: [],
      profileSpecificityVerdict: "NOT_APPLICABLE_STRUCTURAL_NULL",
      propertyDefinitionInsufficient: false,
    };
  }

  if (!zeroOutput.genericFunctionalHypothesis) {
    reasonCodes.push("GENERIC_HYPOTHESIS_UNAVAILABLE");
    return {
      recordId: sourceRecord.recordId,
      form: sourceRecord.form,
      sourceGloss: sourceRecord.sourceGloss,
      sourceFunctionalTarget,
      zeroOutput,
      zeroOutputFrozenBeforeSourceReveal: true,
      sourceClaimWasUsedForGeneration: false,
      verdict: "INSUFFICIENT_INFORMATION",
      reasonCodes: [...new Set(reasonCodes)],
      matchedProperty: null,
      matchedPropertySpecificity: null,
      matchedPropertySourceClass: null,
      wrongProfileAlternatives: [],
      profileSpecificityVerdict: "NO_ASSIGNED_PROFILE_MATCH",
      propertyDefinitionInsufficient: true,
    };
  }

  const matches = exactProfileMatchesV0_1(
    sourceFunctionalTarget,
    zeroOutput.voicePath,
  );
  const propertyDefinitionInsufficient = matches.assigned.length === 0;

  if (matches.assigned.length === 0) {
    reasonCodes.push(
      "NO_EXACT_CANONICAL_PROPERTY_MATCH",
      "PROPERTY_DEFINITION_INSUFFICIENT",
      "PROFILE_SPECIFICITY_NOT_ESTABLISHED",
    );
    if (matches.wrongProfileAlternatives.length > 0) {
      reasonCodes.push("WRONG_PROFILE_EXACT_PROPERTY_ALTERNATIVE");
    }
  } else if (
    matches.assigned.length === 1 &&
    matches.wrongProfileAlternatives.length === 0
  ) {
    reasonCodes.push("UNIQUE_EXACT_CANONICAL_PROPERTY_MATCH");
  } else {
    reasonCodes.push("PROFILE_MATCH_IS_NOT_UNIQUE");
  }

  const uniqueAssigned =
    matches.assigned.length === 1 ? matches.assigned[0] : null;
  const profileSpecificityVerdict =
    matches.assigned.length === 0
      ? "NO_ASSIGNED_PROFILE_MATCH"
      : matches.wrongProfileAlternatives.length > 0
        ? "ASSIGNED_PROFILE_MATCH_HAS_WRONG_PROFILE_ALTERNATIVES"
        : "UNIQUE_ASSIGNED_PROFILE_MATCH";

  let verdict: DalipajExpandedAtomicBlindComparisonVerdictV0_1;
  if (matches.assigned.length === 0) {
    verdict = "INSUFFICIENT_INFORMATION";
  } else if (
    matches.assigned.length === 1 &&
    matches.wrongProfileAlternatives.length === 0
  ) {
    verdict = "DIRECT_CORRESPONDENCE";
  } else {
    verdict = "PARTIAL_CORRESPONDENCE";
  }

  return {
    recordId: sourceRecord.recordId,
    form: sourceRecord.form,
    sourceGloss: sourceRecord.sourceGloss,
    sourceFunctionalTarget,
    zeroOutput,
    zeroOutputFrozenBeforeSourceReveal: true,
    sourceClaimWasUsedForGeneration: false,
    verdict,
    reasonCodes: [...new Set(reasonCodes)],
    matchedProperty: uniqueAssigned?.property ?? null,
    matchedPropertySpecificity: uniqueAssigned?.specificity ?? null,
    matchedPropertySourceClass: uniqueAssigned?.sourceClass ?? null,
    wrongProfileAlternatives: matches.wrongProfileAlternatives,
    profileSpecificityVerdict,
    propertyDefinitionInsufficient,
  };
}

function corpusLevelResultV0_1(
  records: readonly DalipajExpandedAtomicBlindComparisonRecordV0_1[],
): DalipajExpandedAtomicBlindComparisonResultV0_1["corpusLevelResult"] {
  const candidateRecords = records.filter(
    (record) =>
      record.zeroOutput.structuralStatus ===
      "STRUCTURAL_CANDIDATE_AVAILABLE",
  );
  const propertyGapCount = records.filter(
    (record) => record.propertyDefinitionInsufficient,
  ).length;
  const hasDirect = records.some(
    (record) => record.verdict === "DIRECT_CORRESPONDENCE",
  );
  const hasPartial = records.some(
    (record) => record.verdict === "PARTIAL_CORRESPONDENCE",
  );
  const hasNo = records.some(
    (record) => record.verdict === "NO_CORRESPONDENCE",
  );

  if (
    candidateRecords.length > 0 &&
    propertyGapCount === candidateRecords.length
  ) {
    return "SEMANTIC_DEFINITION_LIMIT_DOMINATES";
  }
  if (
    records.some(
      (record) => record.zeroOutput.structuralStatus === "STRUCTURAL_NULL",
    ) && candidateRecords.length === 0
  ) {
    return "STRUCTURAL_CAPABILITY_LIMIT_DOMINATES";
  }
  if (hasDirect && (hasPartial || hasNo)) {
    return "MIXED_OBSERVED_CORRESPONDENCE";
  }
  if (hasDirect || hasPartial) return "LIMITED_OBSERVED_CORRESPONDENCE";
  if (hasNo) return "NO_OBSERVED_CORRESPONDENCE";
  return "INSUFFICIENT_INFORMATION";
}

export async function compareDalipajExpandedAtomicCorpusToZeroV0_1(
  options: DalipajExpandedAtomicBlindComparisonOptionsV0_1 = {},
): Promise<DalipajExpandedAtomicBlindComparisonResultV0_1> {
  const analyzeForm =
    options.analyzeForm ?? runDalipajExpandedAtomicZeroFormOnlyAnalysisV0_1;

  // Only the five frozen forms cross the generation boundary. Source glosses
  // and functional targets are intentionally not passed to the runner.
  const forms = DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
    (record) => record.form,
  );
  const zeroOutputs = deepFreezeV0_1(
    await Promise.all(forms.map((form) => analyzeForm(form))),
  );

  // Reveal source claims only after every form-only output is frozen.
  const sourceRecords = forms.map((form) => {
    const record = getDalipajExpandedEmbryomorphemeSourceRecordV0_1(form);
    if (!record) throw new Error(`Missing frozen source record for ${form}`);
    return record;
  });
  const records = sourceRecords.map((sourceRecord, index) =>
    compareRecordV0_1(sourceRecord, zeroOutputs[index]),
  );

  const structuralCandidateCount = records.filter(
    (record) =>
      record.zeroOutput.structuralStatus ===
      "STRUCTURAL_CANDIDATE_AVAILABLE",
  ).length;
  const structuralNullCount = records.length - structuralCandidateCount;
  const functionallyComparableCount = records.filter(
    (record) => record.zeroOutput.genericFunctionalHypothesis !== null,
  ).length;
  const directCorrespondenceCount = records.filter(
    (record) => record.verdict === "DIRECT_CORRESPONDENCE",
  ).length;
  const partialCorrespondenceCount = records.filter(
    (record) => record.verdict === "PARTIAL_CORRESPONDENCE",
  ).length;
  const noCorrespondenceCount = records.filter(
    (record) => record.verdict === "NO_CORRESPONDENCE",
  ).length;
  const insufficientInformationCount = records.filter(
    (record) => record.verdict === "INSUFFICIENT_INFORMATION",
  ).length;
  const propertyDefinitionInsufficientCases = records.filter(
    (record) => record.propertyDefinitionInsufficient,
  ).length;

  return deepFreezeV0_1({
    schemaVersion: DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_SCHEMA_V0_1,
    comparisonAuthority: DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_AUTHORITY_V0_1,
    sourceCorpusId: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1,
    sourceCorpusAuthority: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
    comparisonPhase: "SOURCE_REVEALED_AFTER_ZERO_OUTPUT_FREEZE",
    comparisonRecordCount: records.length as 5,
    records,
    sourceGlossVisibleDuringGeneration: false,
    targetSenseInjected: false,
    semanticAlignmentInjected: false,
    providerCalls: 0,
    totalCases: 5,
    structuralCandidateCount,
    structuralNullCount,
    functionallyComparableCount,
    directCorrespondenceCount,
    partialCorrespondenceCount,
    noCorrespondenceCount,
    insufficientInformationCount,
    propertyDefinitionInsufficientCases,
    corpusLevelResult: corpusLevelResultV0_1(records),
    structuralDiscoveryLimitObserved: structuralNullCount > 0 ? "YES" : "NO",
    functionalCorrespondenceObserved:
      functionallyComparableCount === 0
        ? "INSUFFICIENT"
        : directCorrespondenceCount > 0 || partialCorrespondenceCount > 0
        ? directCorrespondenceCount > 0 && partialCorrespondenceCount > 0
          ? "MIXED"
          : "YES"
        : insufficientInformationCount > 0
          ? "INSUFFICIENT"
          : "NO",
    propertyDefinitionGapMateriallyObserved:
      propertyDefinitionInsufficientCases > 0 ? "YES" : "NO",
    unequalPropertyCountsEffect: "NOT_ESTABLISHED",
    connectionDuplicateEffect: "NO",
    profileModificationEvidence: "NO",
    cyclopsHistoricalClaimEvaluated: "NO",
    dalipajValidatesZero: "NO",
    zeroValidatesDalipaj: "NO",
    canonicalPromotion: "NO",
    runtimeAuthority: "NO",
    productionEvidencePromotion: "NO",
    historicalClaimAdoption: "NO",
  });
}

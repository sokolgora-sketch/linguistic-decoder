import type {
  ComparativeVerdictV0_1,
} from "./functionalRoleComparativeEvaluationContract.v0_1";
import {
  getSevenVoiceDoctrineFunctionalProfileV0_1,
  type SevenVoiceDoctrineFunctionalProfileV0_1,
} from "./doctrineFunctionalProfile.v0_1";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "../sevenVoiceOrderedViews.v0.1";
import type {
  GenericFunctionalWitnessV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1 =
  "open-instrument.generic-functional-witness-correspondence.v1" as const;

export type GenericFunctionalWitnessCorrespondenceReasonCodeV1 =
  | "INPUT_NOT_OBJECT"
  | "SCHEMA_VERSION_INVALID"
  | "TARGET_ANALYSIS_INVALID"
  | "STRUCTURAL_ANALYSIS_INVALID"
  | "VOICE_PATH_INVALID"
  | "DOCTRINE_PROFILE_UNAVAILABLE"
  | "NO_SOURCE_WITNESS"
  | "SOURCE_WITNESS_INVALID"
  | "SOURCE_WITNESS_EMBRYO_MISMATCH"
  | "SOURCE_SEMANTICS_UNAVAILABLE"
  | "EXACT_FORM_MATCH_ONLY"
  | "SOURCE_RELATION_REQUIRES_REVIEW"
  | "NO_REVIEWED_COMPARISON_RULE"
  | "FUNCTIONAL_CORRESPONDENCE_NOT_AUTHORIZED";

export type GenericFunctionalWitnessCorrespondenceTargetSenseV1 = Readonly<{
  id: string;
  label: string;
}>;

export type GenericFunctionalWitnessCorrespondenceInputV1 = Readonly<{
  schemaVersion: typeof GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1;
  targetAnalysis: Readonly<{
    analysisId: string;
    targetWord: string;
    targetSense?: GenericFunctionalWitnessCorrespondenceTargetSenseV1 | null;
  }>;
  structuralAnalysis: Readonly<{
    hypothesisId: string;
    embryo: string;
    voicePath: readonly SevenVoiceKey[];
  }>;
  sourceWitness: GenericFunctionalWitnessV1 | null;
}>;

export type GenericFunctionalWitnessCorrespondenceDoctrineBasisV1 = Readonly<{
  voicePath: readonly SevenVoiceKey[];
  profiles: readonly SevenVoiceDoctrineFunctionalProfileV0_1[];
}>;

export type GenericFunctionalWitnessCorrespondenceResultV1 = Readonly<{
  schemaVersion: typeof GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1;
  verdict: ComparativeVerdictV0_1;
  reasonCodes: readonly GenericFunctionalWitnessCorrespondenceReasonCodeV1[];
  targetAnalysis: GenericFunctionalWitnessCorrespondenceInputV1["targetAnalysis"] | null;
  structuralAnalysis: GenericFunctionalWitnessCorrespondenceInputV1["structuralAnalysis"] | null;
  targetSenseBinding:
    | "TARGET_SENSE_UNBOUND"
    | "TARGET_SENSE_PRESENT_NOT_BOUND";
  doctrineBasis: GenericFunctionalWitnessCorrespondenceDoctrineBasisV1 | null;
  sourceWitness: GenericFunctionalWitnessV1 | null;
  sourceAttestation: "SOURCE_RECORD_ONLY" | "NOT_AVAILABLE";
  functionalCorrespondence: ComparativeVerdictV0_1;
  functionalAcceptance: "NOT_AUTHORIZED";
  historicalRelation: "NOT_CLAIMED";
  targetOriginClaim: "NOT_CLAIMED";
  winnerClaim: "NOT_CLAIMED";
  languageSuperiorityClaim: "NOT_CLAIMED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

type RecordV1 = Record<string, unknown>;

const EVIDENCE_FAMILIES_V1 = new Set<string>([
  "lexical_dictionary",
  "dialect_lexicon",
  "etymological_dictionary",
  "historical_dictionary",
  "corpus",
  "scholarly_paper",
  "reconstructed_lexicon",
  "other",
]);

function isRecordV1(value: unknown): value is RecordV1 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value === value.normalize("NFC")
  );
}

function stringArrayV1(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(exactTextV1);
}

function reasonCodesV1(
  values: readonly GenericFunctionalWitnessCorrespondenceReasonCodeV1[],
): readonly GenericFunctionalWitnessCorrespondenceReasonCodeV1[] {
  return [...new Set(values)].sort();
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as RecordV1)) {
    deepFreezeV1(child, seen);
  }
  return value;
}

function cloneTargetAnalysisV1(
  value: GenericFunctionalWitnessCorrespondenceInputV1["targetAnalysis"],
): GenericFunctionalWitnessCorrespondenceInputV1["targetAnalysis"] {
  return {
    analysisId: value.analysisId,
    targetWord: value.targetWord,
    ...(value.targetSense
      ? { targetSense: { ...value.targetSense } }
      : { targetSense: null }),
  };
}

function cloneStructuralAnalysisV1(
  value: GenericFunctionalWitnessCorrespondenceInputV1["structuralAnalysis"],
): GenericFunctionalWitnessCorrespondenceInputV1["structuralAnalysis"] {
  return {
    hypothesisId: value.hypothesisId,
    embryo: value.embryo,
    voicePath: [...value.voicePath],
  };
}

function cloneSourceWitnessV1(
  value: GenericFunctionalWitnessV1,
): GenericFunctionalWitnessV1 {
  return {
    witnessId: value.witnessId,
    queryForm: value.queryForm,
    sourceId: value.sourceId,
    evidenceFamily: value.evidenceFamily,
    language: value.language,
    sourceForm: value.sourceForm,
    sourceFormNormalization: value.sourceFormNormalization,
    gloss: value.gloss,
    embryoRelation: value.embryoRelation,
    attestationTruth: value.attestationTruth,
    sourceStatus: value.sourceStatus,
    sourceAttestation: value.sourceAttestation,
    functionalCorrespondence: value.functionalCorrespondence,
    targetMeaning: value.targetMeaning,
    historicalRelation: value.historicalRelation,
    winnerClaim: value.winnerClaim,
    languageSuperiorityClaim: value.languageSuperiorityClaim,
    userDecisionPosture: value.userDecisionPosture,
    noSingleWinner: value.noSingleWinner,
    citationRefs: [...value.citationRefs],
    relationOperationIds: [...value.relationOperationIds],
    ...(value.languageVariety !== undefined
      ? { languageVariety: value.languageVariety }
      : {}),
    ...(value.sourceProvenance
      ? { sourceProvenance: { ...value.sourceProvenance } }
      : {}),
  };
}

function targetSenseBindingV1(
  targetAnalysis: GenericFunctionalWitnessCorrespondenceInputV1["targetAnalysis"],
): GenericFunctionalWitnessCorrespondenceResultV1["targetSenseBinding"] {
  return targetAnalysis.targetSense
    ? "TARGET_SENSE_PRESENT_NOT_BOUND"
    : "TARGET_SENSE_UNBOUND";
}

function targetAnalysisIsValidV1(
  value: unknown,
): value is GenericFunctionalWitnessCorrespondenceInputV1["targetAnalysis"] {
  if (!isRecordV1(value)) return false;

  const targetSense = value.targetSense;
  return (
    exactTextV1(value.analysisId) &&
    exactTextV1(value.targetWord) &&
    (targetSense === undefined ||
      targetSense === null ||
      (isRecordV1(targetSense) &&
        exactTextV1(targetSense.id) &&
        exactTextV1(targetSense.label)))
  );
}

function baseResultV1(
  input: Readonly<{
    verdict: ComparativeVerdictV0_1;
    reasonCodes: readonly GenericFunctionalWitnessCorrespondenceReasonCodeV1[];
    targetAnalysis: GenericFunctionalWitnessCorrespondenceInputV1["targetAnalysis"] | null;
    structuralAnalysis: GenericFunctionalWitnessCorrespondenceInputV1["structuralAnalysis"] | null;
    doctrineBasis: GenericFunctionalWitnessCorrespondenceDoctrineBasisV1 | null;
    sourceWitness: GenericFunctionalWitnessV1 | null;
    targetSenseBinding: GenericFunctionalWitnessCorrespondenceResultV1["targetSenseBinding"];
  }>,
): GenericFunctionalWitnessCorrespondenceResultV1 {
  return deepFreezeV1({
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
    verdict: input.verdict,
    reasonCodes: reasonCodesV1(input.reasonCodes),
    targetAnalysis: input.targetAnalysis,
    structuralAnalysis: input.structuralAnalysis,
    targetSenseBinding: input.targetSenseBinding,
    doctrineBasis: input.doctrineBasis,
    sourceWitness: input.sourceWitness,
    sourceAttestation: input.sourceWitness
      ? "SOURCE_RECORD_ONLY"
      : "NOT_AVAILABLE",
    functionalCorrespondence: input.verdict,
    functionalAcceptance: "NOT_AUTHORIZED",
    historicalRelation: "NOT_CLAIMED",
    targetOriginClaim: "NOT_CLAIMED",
    winnerClaim: "NOT_CLAIMED",
    languageSuperiorityClaim: "NOT_CLAIMED",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  });
}

function sourceProvenanceIsValidV1(value: unknown, sourceId: string): boolean {
  if (!isRecordV1(value)) return false;

  return (
    value.sourceRecordId === sourceId &&
    exactTextV1(value.sourceRecordId) &&
    exactTextV1(value.sourceTraditionId) &&
    exactTextV1(value.sourceTitle) &&
    exactTextV1(value.sourceDateOrVersion) &&
    exactTextV1(value.sourceUrlOrArchiveRef) &&
    exactTextV1(value.entryLocator) &&
    (value.sourceHashOrArchiveHash === null ||
      exactTextV1(value.sourceHashOrArchiveHash)) &&
    (value.languageVariety === null || exactTextV1(value.languageVariety))
  );
}

function sourceWitnessIsValidV1(value: unknown): value is GenericFunctionalWitnessV1 {
  if (!isRecordV1(value)) return false;

  return (
    exactTextV1(value.witnessId) &&
    exactTextV1(value.queryForm) &&
    exactTextV1(value.sourceId) &&
    typeof value.evidenceFamily === "string" &&
    EVIDENCE_FAMILIES_V1.has(value.evidenceFamily) &&
    exactTextV1(value.language) &&
    (value.languageVariety === undefined ||
      value.languageVariety === null ||
      exactTextV1(value.languageVariety)) &&
    typeof value.sourceForm === "string" &&
    value.sourceForm.length > 0 &&
    value.sourceForm.trim() === value.sourceForm &&
    value.sourceFormNormalization === "EXACT_PRESERVED" &&
    exactTextV1(value.gloss) &&
    stringArrayV1(value.citationRefs) &&
    value.citationRefs.length > 0 &&
    stringArrayV1(value.relationOperationIds) &&
    (value.embryoRelation === "exact_form" ||
      value.embryoRelation === "authorized_transformation" ||
      value.embryoRelation === "reconstructed_form" ||
      value.embryoRelation === "phonetic_resemblance" ||
      value.embryoRelation === "semantic_resemblance") &&
    (value.attestationTruth === "fact" ||
      value.attestationTruth === "inference" ||
      value.attestationTruth === "hypothesis" ||
      value.attestationTruth === "unknown") &&
    (value.sourceStatus === "research_candidate" ||
      value.sourceStatus === "reviewed_candidate") &&
    (value.sourceProvenance === undefined ||
      sourceProvenanceIsValidV1(value.sourceProvenance, value.sourceId)) &&
    value.sourceAttestation === "SOURCE_RECORD_ONLY" &&
    value.functionalCorrespondence === "NOT_EVALUATED" &&
    value.targetMeaning === "NOT_CLAIMED" &&
    value.historicalRelation === "NOT_CLAIMED" &&
    value.winnerClaim === "NOT_CLAIMED" &&
    value.languageSuperiorityClaim === "NOT_CLAIMED" &&
    value.userDecisionPosture === "user_decides" &&
    value.noSingleWinner === true
  );
}

function inputIsValidV1(
  value: unknown,
): value is GenericFunctionalWitnessCorrespondenceInputV1 {
  if (!isRecordV1(value)) return false;

  const targetAnalysis = value.targetAnalysis;
  const structuralAnalysis = value.structuralAnalysis;

  return (
    value.schemaVersion ===
      GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1 &&
    targetAnalysisIsValidV1(targetAnalysis) &&
    isRecordV1(structuralAnalysis) &&
    exactTextV1(structuralAnalysis.hypothesisId) &&
    exactTextV1(structuralAnalysis.embryo) &&
    Array.isArray(structuralAnalysis.voicePath) &&
    structuralAnalysis.voicePath.length > 0 &&
    structuralAnalysis.voicePath.every(
      (voice) => typeof voice === "string" && isSevenVoiceKey(voice),
    ) &&
    (value.sourceWitness === null || sourceWitnessIsValidV1(value.sourceWitness))
  );
}

function buildDoctrineBasisV1(
  voicePath: readonly SevenVoiceKey[],
): GenericFunctionalWitnessCorrespondenceDoctrineBasisV1 | null {
  const profiles = voicePath.map((voice) =>
    getSevenVoiceDoctrineFunctionalProfileV0_1(voice),
  );
  if (profiles.some((profile) => profile === null)) return null;

  return {
    voicePath: [...voicePath],
    profiles: profiles as readonly SevenVoiceDoctrineFunctionalProfileV0_1[],
  };
}

export function evaluateGenericFunctionalWitnessCorrespondenceV1(
  input: unknown,
): GenericFunctionalWitnessCorrespondenceResultV1 {
  if (!isRecordV1(input)) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["INPUT_NOT_OBJECT"],
      targetAnalysis: null,
      structuralAnalysis: null,
      doctrineBasis: null,
      sourceWitness: null,
      targetSenseBinding: "TARGET_SENSE_UNBOUND",
    });
  }

  if (
    input.schemaVersion !==
    GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1
  ) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["SCHEMA_VERSION_INVALID"],
      targetAnalysis: null,
      structuralAnalysis: null,
      doctrineBasis: null,
      sourceWitness: null,
      targetSenseBinding: "TARGET_SENSE_UNBOUND",
    });
  }

  if (!isRecordV1(input.targetAnalysis)) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["TARGET_ANALYSIS_INVALID"],
      targetAnalysis: null,
      structuralAnalysis: null,
      doctrineBasis: null,
      sourceWitness: null,
      targetSenseBinding: "TARGET_SENSE_UNBOUND",
    });
  }

  if (!isRecordV1(input.structuralAnalysis)) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["STRUCTURAL_ANALYSIS_INVALID"],
      targetAnalysis: null,
      structuralAnalysis: null,
      doctrineBasis: null,
      sourceWitness: null,
      targetSenseBinding: "TARGET_SENSE_UNBOUND",
    });
  }

  if (!inputIsValidV1(input)) {
    const voicePath = input.structuralAnalysis.voicePath;
    const voicePathInvalid =
      !Array.isArray(voicePath) ||
      voicePath.length === 0 ||
      !voicePath.every(
        (voice) => typeof voice === "string" && isSevenVoiceKey(voice),
      );
    const sourceWitness = input.sourceWitness;
    const targetAnalysis = input.targetAnalysis;
    const structuralAnalysis = input.structuralAnalysis;
    const reasons: GenericFunctionalWitnessCorrespondenceReasonCodeV1[] = [];
    const targetAnalysisValid = targetAnalysisIsValidV1(targetAnalysis);
    if (!targetAnalysisValid) {
      reasons.push("TARGET_ANALYSIS_INVALID");
    }
    if (
      !exactTextV1(structuralAnalysis.hypothesisId) ||
      !exactTextV1(structuralAnalysis.embryo)
    ) {
      reasons.push("STRUCTURAL_ANALYSIS_INVALID");
    }
    if (voicePathInvalid) reasons.push("VOICE_PATH_INVALID");
    if (sourceWitness !== null && !sourceWitnessIsValidV1(sourceWitness)) {
      reasons.push("SOURCE_WITNESS_INVALID");
    }
    if (reasons.length === 0) reasons.push("SOURCE_SEMANTICS_UNAVAILABLE");

    return baseResultV1({
      verdict: "NULL",
      reasonCodes: reasons,
      targetAnalysis: targetAnalysisValid
        ? cloneTargetAnalysisV1(targetAnalysis)
        : null,
      structuralAnalysis:
        exactTextV1(structuralAnalysis.hypothesisId) &&
        exactTextV1(structuralAnalysis.embryo) &&
        !voicePathInvalid
          ? cloneStructuralAnalysisV1(
              structuralAnalysis as GenericFunctionalWitnessCorrespondenceInputV1["structuralAnalysis"],
            )
          : null,
      doctrineBasis: null,
      sourceWitness: null,
      targetSenseBinding: "TARGET_SENSE_UNBOUND",
    });
  }

  const validInput = input as GenericFunctionalWitnessCorrespondenceInputV1;
  const targetAnalysis = cloneTargetAnalysisV1(validInput.targetAnalysis);
  const structuralAnalysis = cloneStructuralAnalysisV1(
    validInput.structuralAnalysis,
  );
  const doctrineBasis = buildDoctrineBasisV1(structuralAnalysis.voicePath);
  const targetSenseBinding = targetSenseBindingV1(targetAnalysis);

  if (!doctrineBasis) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["DOCTRINE_PROFILE_UNAVAILABLE"],
      targetAnalysis,
      structuralAnalysis,
      doctrineBasis: null,
      sourceWitness: null,
      targetSenseBinding,
    });
  }

  if (validInput.sourceWitness === null) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["NO_SOURCE_WITNESS"],
      targetAnalysis,
      structuralAnalysis,
      doctrineBasis,
      sourceWitness: null,
      targetSenseBinding,
    });
  }

  if (validInput.sourceWitness.queryForm !== structuralAnalysis.embryo) {
    return baseResultV1({
      verdict: "NULL",
      reasonCodes: ["SOURCE_WITNESS_EMBRYO_MISMATCH"],
      targetAnalysis,
      structuralAnalysis,
      doctrineBasis,
      sourceWitness: null,
      targetSenseBinding,
    });
  }

  const sourceWitness = cloneSourceWitnessV1(validInput.sourceWitness);
  const relationReasonCode =
    validInput.sourceWitness.embryoRelation === "exact_form"
      ? "EXACT_FORM_MATCH_ONLY"
      : "SOURCE_RELATION_REQUIRES_REVIEW";
  return baseResultV1({
    verdict: "UNKNOWN",
    reasonCodes: [
      relationReasonCode,
      "NO_REVIEWED_COMPARISON_RULE",
      "FUNCTIONAL_CORRESPONDENCE_NOT_AUTHORIZED",
    ],
    targetAnalysis,
    structuralAnalysis,
    doctrineBasis,
    sourceWitness,
    targetSenseBinding,
  });
}

export const ZHEJI_TRANSPARENCY_LEVELS_V0_1 = [
  "atomic",
  "metaphorical",
  "opaque",
] as const;

export type ZhejiTransparencyLevelV0_1 =
  (typeof ZHEJI_TRANSPARENCY_LEVELS_V0_1)[number];

export type ZhejiEvidenceNoteV0_1 = string | null;

export interface ZhejiPresenceLayerV0_1 {
  isPresent: boolean;
  evidenceNote: ZhejiEvidenceNoteV0_1;
}

export interface ZhejiAnalysisLayersV0_1 {
  formal: ZhejiPresenceLayerV0_1;
  symbolic: ZhejiPresenceLayerV0_1;
}

export interface ZhejiSemanticTransparencyV0_1 {
  level: ZhejiTransparencyLevelV0_1;
  reason: string;
  decomposition?: string[];
}

export interface ZhejiTransparencyCandidateV0_1 {
  language: string;
  nullCandidate?: boolean;
  analysisLayers?: ZhejiAnalysisLayersV0_1;
  semanticTransparency?: ZhejiSemanticTransparencyV0_1;
  candidateType?: unknown;
}

export interface ZhejiTransparencyContrastMatrixV0_1 {
  atomic: string[];
  metaphorical: string[];
  opaque: string[];
}

export interface ZhejiTransparencyContrastV0_1 {
  hasContrast: boolean;
  matrix: ZhejiTransparencyContrastMatrixV0_1;
}

export interface ZhejiPromptContractMetadataV0_1 {
  zhejiPromptContractApplied: boolean;
  sevenVoiceDoctrineReferenceIncluded: boolean;
  symbolicEvaluationAllowed: boolean;
  zhejiFieldsRequested: readonly ["analysisLayers", "semanticTransparency"];
  transparencyContrastRequestedFromBrain: false;
}

export const ZHEJI_PROMPT_CONTRACT_METADATA_V0_1: ZhejiPromptContractMetadataV0_1 =
  Object.freeze({
    zhejiPromptContractApplied: true,
    sevenVoiceDoctrineReferenceIncluded: true,
    symbolicEvaluationAllowed: true,
    zhejiFieldsRequested: ["analysisLayers", "semanticTransparency"] as const,
    transparencyContrastRequestedFromBrain: false,
  });

export const ZHEJI_FORBIDDEN_RAW_FIELDS_V0_1 = Object.freeze([
  "transparencyContrast",
  "transparencyContrastNote",
  "score",
  "rank",
  "winner",
  "originVerdict",
  "historicalTruth",
  "provesOrigin",
  "isOrigin",
  "languageWins",
] as const);

export type ZhejiForbiddenRawFieldV0_1 =
  (typeof ZHEJI_FORBIDDEN_RAW_FIELDS_V0_1)[number];

export function isZhejiTransparencyLevelV0_1(
  value: unknown,
): value is ZhejiTransparencyLevelV0_1 {
  return (
    typeof value === "string" &&
    (ZHEJI_TRANSPARENCY_LEVELS_V0_1 as readonly string[]).includes(value)
  );
}

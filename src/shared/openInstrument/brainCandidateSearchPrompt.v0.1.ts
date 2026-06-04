import type {
  HeartChunkSegmentation,
  HeartChunkVariant,
  HeartFunctionHint,
  HeartLegalTransform,
} from "./heartChunkSegmentation.v0.1";

export const BRAIN_CANDIDATE_TYPES = [
  "strong_living_match",
  "historical_match",
  "functional_resonance",
  "phonetic_resonance",
  "weak_resonance",
  "likely_false_friend",
  "null_candidate",
] as const;

export const BRAIN_EVIDENCE_TYPES = [
  "living_lexical",
  "historical_etymology",
  "dictionary_attested",
  "phonetic_only",
  "semantic_only",
  "doctrine_alignment",
  "none",
] as const;

export const BRAIN_FALSE_FRIEND_RISKS = [
  "none",
  "low",
  "medium",
  "high",
] as const;

export type BrainCandidateType = (typeof BRAIN_CANDIDATE_TYPES)[number];
export type BrainEvidenceType = (typeof BRAIN_EVIDENCE_TYPES)[number];
export type BrainFalseFriendRisk =
  (typeof BRAIN_FALSE_FRIEND_RISKS)[number];

export type BrainCandidateSearchInput = {
  word: string;
  normalizedWord: string;
  segmentationId: string;
  chunks: string[];
  chunkVariants: HeartChunkVariant[];
  voicePath: HeartChunkSegmentation["voicePath"];
  legalTransforms: HeartLegalTransform[];
  normalizationNotes: string[];
  functionHints: HeartFunctionHint[];
  targetLanguages: string[];
  searchMode: "chunk_candidate_search_v0.1";
};

export type BrainCandidateSearchPrompt = {
  systemPrompt: string;
  userPrompt: string;
  inputJson: BrainCandidateSearchInput;
  requiredOutputSchema: Record<string, unknown>;
};

export function brainInputFromHeartSegmentation(
  segmentation: HeartChunkSegmentation,
  targetLanguages: string[],
): BrainCandidateSearchInput {
  return {
    word: segmentation.word,
    normalizedWord: segmentation.normalizedWord,
    segmentationId: segmentation.segmentationId,
    chunks: segmentation.chunks,
    chunkVariants: segmentation.chunkVariants,
    voicePath: segmentation.voicePath,
    legalTransforms: segmentation.legalTransforms,
    normalizationNotes: segmentation.normalizationNotes,
    functionHints: segmentation.functionHints,
    targetLanguages,
    searchMode: "chunk_candidate_search_v0.1",
  };
}

function enumScalarSchema(allowedValues: readonly string[]): Record<string, unknown> {
  return {
    type: "string",
    requiredScalar: true,
    arraysAreInvalid: true,
    allowedValues: [...allowedValues],
  };
}

function requiredOutputSchema(): Record<string, unknown> {
  return {
    enumFieldsMustBeScalarStrings: true,
    arraysAreInvalidForEnumFields: true,
    word: "string",
    segmentationId: "string",
    chunkCandidates: [
      {
        segmentationId: "string",
        chunk: "string",
        language: "string",
        candidateForm: "string",
        meaning: "string",
        functionFit: "string",
        sourceNote: "string",
        evidenceType: enumScalarSchema(BRAIN_EVIDENCE_TYPES),
        candidateType: enumScalarSchema(BRAIN_CANDIDATE_TYPES),
        falseFriendRisk: enumScalarSchema(BRAIN_FALSE_FRIEND_RISKS),
        nullCandidate: "boolean",
        notes: "string",
      },
    ],
    nullCandidates: [
      {
        segmentationId: "string",
        chunk: "string",
        language: "string",
        candidateForm: "string",
        meaning: "string",
        functionFit: "string",
        sourceNote: "string",
        evidenceType: {
          type: "string",
          requiredScalar: true,
          arraysAreInvalid: true,
          allowedValues: ["none"],
        },
        candidateType: {
          type: "string",
          requiredScalar: true,
          arraysAreInvalid: true,
          allowedValues: ["null_candidate"],
        },
        falseFriendRisk: {
          type: "string",
          requiredScalar: true,
          arraysAreInvalid: true,
          allowedValues: ["none"],
        },
        nullCandidate: true,
        notes: "string",
      },
    ],
    warnings: ["string"],
    claimBoundary: {
      originClaim: false,
      scientificEvidence: false,
      publicationEvidence: false,
      developmentCandidateSearchOnly: true,
    },
  };
}

export function buildBrainCandidateSearchPrompt(
  input: BrainCandidateSearchInput,
): BrainCandidateSearchPrompt {
  const schema = requiredOutputSchema();

  const systemPrompt = [
    "You are the Brain in the Open Instrument Heart-to-Brain Candidate Search Protocol.",
    "Return strict JSON only. No prose outside JSON.",
    "Brain searches candidate meanings only.",
    "Brain does not own segmentation, vowel path, legal transforms, validation, or origin verdict.",
    "Use only Heart-approved chunks and target languages.",
    "Preserve segmentationId exactly.",
    "Preserve chunks exactly. Do not create new segmentation. Do not reorder chunks.",
    "Do not invent transforms. Do not change vowel path.",
    "Do not claim origin. Do not treat resonance as proof.",
    "Do not hide nulls. If no credible candidate exists, return a null_candidate.",
    "Every candidate must include candidateType, evidenceType, falseFriendRisk, nullCandidate, sourceNote, and notes.",
    "Enum fields must be scalar strings, never arrays.",
    "candidateType must be exactly one lowercase string copied from the allowed candidateType list.",
    "evidenceType must be exactly one lowercase string copied from the allowed evidenceType list.",
    "falseFriendRisk must be exactly one lowercase string copied from the allowed falseFriendRisk list.",
    "Never wrap enum values in arrays. Arrays are invalid for candidateType, evidenceType, and falseFriendRisk.",
    "Do not use uppercase enum aliases such as STRONG_LEXICAL, NULL_CANDIDATE, or FALSE_FRIEND_RISK.",
    "Do not use prose labels or near-synonyms as enum values.",
    "Every candidate and null candidate must copy the exact segmentationId from HEART_APPROVED_INPUT_JSON.",
    "Every candidate and null candidate must use only exact chunk strings from HEART_APPROVED_INPUT_JSON.",
    "For null candidates, use exactly: candidateType=\"null_candidate\", evidenceType=\"none\", falseFriendRisk=\"none\", nullCandidate=true.",
    "Function hints are ZE-RO doctrine. Doctrine alignment is not external linguistic evidence.",
    "If uncertain, use scalar strings: candidateType=\"weak_resonance\" or candidateType=\"null_candidate\"; evidenceType=\"none\" if null; falseFriendRisk=\"high\" if risky.",
    `Allowed candidateType values: ${BRAIN_CANDIDATE_TYPES.join(", ")}.`,
    `Allowed evidenceType values: ${BRAIN_EVIDENCE_TYPES.join(", ")}.`,
    `Allowed falseFriendRisk values: ${BRAIN_FALSE_FRIEND_RISKS.join(", ")}.`,
  ].join("\n");

  const userPrompt = [
    "HEART_APPROVED_INPUT_JSON:",
    JSON.stringify(input, null, 2),
    "REQUIRED_OUTPUT_SCHEMA_JSON:",
    JSON.stringify(schema, null, 2),
    "Task: Search candidate meanings for each Heart-approved chunk across targetLanguages.",
    "Return candidates and null candidates as strict JSON matching the required schema.",
    "Do not add prose.",
  ].join("\n");

  return {
    systemPrompt,
    userPrompt,
    inputJson: input,
    requiredOutputSchema: schema,
  };
}

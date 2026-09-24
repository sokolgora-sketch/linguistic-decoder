import { z } from "zod";
import type {
  AnalysisStatusClaimBoundaryV0_1,
  AnalysisStatusCodeV0_1,
  AnalysisStatusV0_1,
} from "@/shared/analysisStatus.v0_1";

export const WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_1 =
  "open-instrument.word-specific-functional-depth.v0_1" as const;

export type WordSpecificFunctionalDepthAuthorityClassV0_1 =
  | "reviewed_functional"
  | "research_functional";

export type WordSpecificFunctionalDepthStatusV0_1 = Extract<
  AnalysisStatusCodeV0_1,
  "reviewed_functional_evidence" | "research_functional_hypothesis"
>;

export type WordSpecificFunctionalDepthResultV0_1 = {
  candidateId: string;
  form: string;
  sourceKind: string;
  sourceStatus: string;
  authorityClass: WordSpecificFunctionalDepthAuthorityClassV0_1;
  targetWord: string | null;
  targetSenseId: string | null;
  targetSenseLabel: string | null;
  embryo: string | null;
  expansionChain: string[];
  functionalStatement: string | null;
  semanticBridge: string | null;
  evidenceRefs: string[];
  claimBoundary: string;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
};

export type WordSpecificFunctionalDepthV0_1 = {
  schemaVersion: typeof WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_1;
  status: WordSpecificFunctionalDepthStatusV0_1 | null;
  authorityClass: WordSpecificFunctionalDepthAuthorityClassV0_1 | null;
  results: WordSpecificFunctionalDepthResultV0_1[];
  evidenceRefs: string[];
  claimBoundary: AnalysisStatusClaimBoundaryV0_1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
  nullReason: "no_supported_word_specific_functional_motivation" | null;
};

const WordSpecificFunctionalDepthClaimBoundarySchema = z
  .object({
    historicalOriginClaim: z.literal("not_claimed"),
    historicalTransmissionClaim: z.literal("not_claimed"),
    winnerClaim: z.literal("not_claimed"),
    languageSuperiorityClaim: z.literal("not_claimed"),
    linguisticOwnershipClaim: z.literal("not_claimed"),
    candidateTruthClaim: z.literal("not_claimed"),
    structuralOutputIsCandidateTruth: z.literal(false),
    nullIsValid: z.literal(true),
  })
  .strict();

const WordSpecificFunctionalDepthResultSchema = z
  .object({
    candidateId: z.string().min(1),
    form: z.string().min(1),
    sourceKind: z.string().min(1),
    sourceStatus: z.string().min(1),
    authorityClass: z.enum(["reviewed_functional", "research_functional"]),
    targetWord: z.string().nullable(),
    targetSenseId: z.string().nullable(),
    targetSenseLabel: z.string().nullable(),
    embryo: z.string().nullable(),
    expansionChain: z.array(z.string()),
    functionalStatement: z.string().nullable(),
    semanticBridge: z.string().nullable(),
    evidenceRefs: z.array(z.string().min(1)).min(1),
    claimBoundary: z.string().min(1),
    userDecisionPosture: z.literal("user_decides"),
    noSingleWinner: z.literal(true),
  })
  .strict();

export const WordSpecificFunctionalDepthContractSchema = z
  .object({
    schemaVersion: z.literal(WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_1),
    status: z
      .enum(["reviewed_functional_evidence", "research_functional_hypothesis"])
      .nullable(),
    authorityClass: z.enum(["reviewed_functional", "research_functional"]).nullable(),
    results: z.array(WordSpecificFunctionalDepthResultSchema),
    evidenceRefs: z.array(z.string()),
    claimBoundary: WordSpecificFunctionalDepthClaimBoundarySchema,
    userDecisionPosture: z.literal("user_decides"),
    noSingleWinner: z.literal(true),
    nullReason: z.literal("no_supported_word_specific_functional_motivation").nullable(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.status === null) {
      if (
        value.authorityClass !== null ||
        value.results.length !== 0 ||
        value.evidenceRefs.length !== 0 ||
        value.nullReason !== "no_supported_word_specific_functional_motivation"
      ) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: "Null depth must contain no functional results" });
      }
      return;
    }

    const expectedAuthority =
      value.status === "reviewed_functional_evidence"
        ? "reviewed_functional"
        : "research_functional";

    if (
      value.authorityClass !== expectedAuthority ||
      value.results.length === 0 ||
      value.nullReason !== null ||
      value.results.some((result) => result.authorityClass !== expectedAuthority)
    ) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Functional depth authority/status mismatch" });
    }
  });

type UnknownRecord = Record<string, unknown>;

type WordSpecificFunctionalDepthInputV0_1 = {
  word: string;
  analysisStatus?: AnalysisStatusV0_1 | null;
  candidates: readonly unknown[];
};

const CLAIM_BOUNDARY: AnalysisStatusClaimBoundaryV0_1 = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  linguisticOwnershipClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  structuralOutputIsCandidateTruth: false,
  nullIsValid: true,
};

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => text(item))
    .filter((item): item is string => Boolean(item));
}

function evidenceRefs(value: UnknownRecord): string[] {
  const direct = stringList(value.evidenceRefs);
  if (direct.length > 0) return [...new Set(direct)];

  const evidence = isRecord(value.evidence) ? value.evidence : null;
  const nested = evidence ? evidence.refs : null;
  if (!Array.isArray(nested)) return [];

  const refs = nested
    .map((item) => {
      if (typeof item === "string") return text(item);
      return isRecord(item) ? text(item.ref) : null;
    })
    .filter((item): item is string => Boolean(item));

  return [...new Set(refs)];
}

function claimBoundaryForCandidate(value: UnknownRecord): string | null {
  return text(value.claimBoundary);
}

function isReviewedFunctionalCandidate(
  candidate: UnknownRecord,
): boolean {
  return (
    candidate.claimType === "functionalMotivation" &&
    (candidate.sourceKind === "reviewed_dictionary_source" ||
      candidate.sourceKind === "reviewed_lexical_source") &&
    candidate.sourceStatus === "reviewed_accepted" &&
    candidate.validationOutcome === "validated" &&
    evidenceRefs(candidate).length > 0 &&
    Boolean(text(candidate.functionalStatement) ?? text(candidate.semanticBridge)) &&
    Boolean(claimBoundaryForCandidate(candidate))
  );
}

function isResearchFunctionalCandidate(
  candidate: UnknownRecord,
  word: string,
  analysisStatus: AnalysisStatusV0_1 | null | undefined,
): boolean {
  return (
    analysisStatus?.status === "research_functional_hypothesis" &&
    candidate.claimType === "functionalMotivation" &&
    candidate.sourceKind === "multi_source_research_witness" &&
    (candidate.sourceStatus === "research_candidate" ||
      candidate.sourceStatus === "reviewed_candidate") &&
    candidate.evidenceBasis === "functional_correspondence" &&
    candidate.attestationTruth === "fact" &&
    candidate.functionalBridgeTruth === "hypothesis" &&
    candidate.claimBoundary === "research_functional_hypothesis_only" &&
    candidate.userDecisionPosture === "user_decides" &&
    text(candidate.targetWord)?.toLocaleLowerCase("en-US") ===
      word.trim().toLocaleLowerCase("en-US") &&
    evidenceRefs(candidate).length > 0 &&
    Boolean(text(candidate.semanticBridge) ?? text(candidate.functionalStatement))
  );
}

function authorityClassForCandidate(
  candidate: UnknownRecord,
  word: string,
  analysisStatus: AnalysisStatusV0_1 | null | undefined,
): WordSpecificFunctionalDepthAuthorityClassV0_1 | null {
  if (
    analysisStatus?.status === "reviewed_functional_evidence" &&
    isReviewedFunctionalCandidate(candidate)
  ) {
    return "reviewed_functional";
  }

  if (isResearchFunctionalCandidate(candidate, word, analysisStatus)) {
    return "research_functional";
  }

  return null;
}

function projectResult(
  candidate: UnknownRecord,
  authorityClass: WordSpecificFunctionalDepthAuthorityClassV0_1,
): WordSpecificFunctionalDepthResultV0_1 | null {
  const candidateId = text(candidate.candidateId) ?? text(candidate.id);
  const form = text(candidate.form) ?? text(candidate.displayForm);
  const sourceKind = text(candidate.sourceKind);
  const sourceStatus = text(candidate.sourceStatus);
  const claimBoundary = text(candidate.claimBoundary);
  const refs = evidenceRefs(candidate);

  if (!candidateId || !form || !sourceKind || !sourceStatus || !claimBoundary || refs.length === 0) {
    return null;
  }

  return {
    candidateId,
    form,
    sourceKind,
    sourceStatus,
    authorityClass,
    targetWord: text(candidate.targetWord),
    targetSenseId: text(candidate.targetSenseId),
    targetSenseLabel: text(candidate.targetSenseLabel),
    embryo: text(candidate.embryo),
    expansionChain: stringList(candidate.expansionChain),
    functionalStatement: text(candidate.functionalStatement),
    semanticBridge: text(candidate.semanticBridge),
    evidenceRefs: refs,
    claimBoundary,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

function nullDepth(): WordSpecificFunctionalDepthV0_1 {
  return {
    schemaVersion: WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_1,
    status: null,
    authorityClass: null,
    results: [],
    evidenceRefs: [],
    claimBoundary: CLAIM_BOUNDARY,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    nullReason: "no_supported_word_specific_functional_motivation",
  };
}

export function buildWordSpecificFunctionalDepthV0_1(
  input: WordSpecificFunctionalDepthInputV0_1,
): WordSpecificFunctionalDepthV0_1 {
  const word = input.word.trim();
  const analysisStatus = input.analysisStatus;
  const results: WordSpecificFunctionalDepthResultV0_1[] = [];
  const seenCandidateIds = new Set<string>();

  for (const rawCandidate of input.candidates) {
    if (!isRecord(rawCandidate)) continue;

    const authorityClass = authorityClassForCandidate(
      rawCandidate,
      word,
      analysisStatus,
    );
    if (!authorityClass) continue;

    const result = projectResult(rawCandidate, authorityClass);
    if (!result || seenCandidateIds.has(result.candidateId)) continue;

    seenCandidateIds.add(result.candidateId);
    results.push(result);
  }

  if (results.length === 0) return nullDepth();

  const status: WordSpecificFunctionalDepthStatusV0_1 =
    results.some((result) => result.authorityClass === "reviewed_functional")
      ? "reviewed_functional_evidence"
      : "research_functional_hypothesis";
  const authorityClass: WordSpecificFunctionalDepthAuthorityClassV0_1 =
    status === "reviewed_functional_evidence"
      ? "reviewed_functional"
      : "research_functional";

  return {
    schemaVersion: WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_1,
    status,
    authorityClass,
    results,
    evidenceRefs: [...new Set(results.flatMap((result) => result.evidenceRefs))],
    claimBoundary: CLAIM_BOUNDARY,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    nullReason: null,
  };
}

export function isWordSpecificFunctionalDepthV0_1(
  value: unknown,
): value is WordSpecificFunctionalDepthV0_1 {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_1) return false;
  if (
    value.status !== null &&
    value.status !== "reviewed_functional_evidence" &&
    value.status !== "research_functional_hypothesis"
  ) {
    return false;
  }
  if (
    value.authorityClass !== null &&
    value.authorityClass !== "reviewed_functional" &&
    value.authorityClass !== "research_functional"
  ) {
    return false;
  }
  if (!Array.isArray(value.results) || !Array.isArray(value.evidenceRefs)) return false;
  if (value.userDecisionPosture !== "user_decides" || value.noSingleWinner !== true) return false;
  if (!isRecord(value.claimBoundary)) return false;
  if (
    value.claimBoundary.historicalOriginClaim !== "not_claimed" ||
    value.claimBoundary.historicalTransmissionClaim !== "not_claimed" ||
    value.claimBoundary.winnerClaim !== "not_claimed" ||
    value.claimBoundary.languageSuperiorityClaim !== "not_claimed" ||
    value.claimBoundary.linguisticOwnershipClaim !== "not_claimed" ||
    value.claimBoundary.candidateTruthClaim !== "not_claimed" ||
    value.claimBoundary.structuralOutputIsCandidateTruth !== false ||
    value.claimBoundary.nullIsValid !== true
  ) return false;
  if (value.nullReason !== null && value.nullReason !== "no_supported_word_specific_functional_motivation") {
    return false;
  }

  if (value.status === null) {
    return value.authorityClass === null &&
      value.results.length === 0 &&
      value.evidenceRefs.length === 0 &&
      value.nullReason === "no_supported_word_specific_functional_motivation";
  }

  if (value.authorityClass === null || value.results.length === 0 || value.nullReason !== null) {
    return false;
  }

  const expectedAuthority =
    value.status === "reviewed_functional_evidence"
      ? "reviewed_functional"
      : "research_functional";

  return value.authorityClass === expectedAuthority && value.results.every((result) => {
    if (!isRecord(result)) return false;
    return (
      typeof result.candidateId === "string" && result.candidateId.trim().length > 0 &&
      typeof result.form === "string" && result.form.trim().length > 0 &&
      typeof result.sourceKind === "string" && result.sourceKind.trim().length > 0 &&
      typeof result.sourceStatus === "string" && result.sourceStatus.trim().length > 0 &&
      result.authorityClass === expectedAuthority &&
      (result.targetWord === null || typeof result.targetWord === "string") &&
      (result.targetSenseId === null || typeof result.targetSenseId === "string") &&
      (result.targetSenseLabel === null || typeof result.targetSenseLabel === "string") &&
      (result.embryo === null || typeof result.embryo === "string") &&
      Array.isArray(result.expansionChain) && result.expansionChain.every((item) => typeof item === "string") &&
      (result.functionalStatement === null || typeof result.functionalStatement === "string") &&
      (result.semanticBridge === null || typeof result.semanticBridge === "string") &&
      Array.isArray(result.evidenceRefs) && result.evidenceRefs.length > 0 && result.evidenceRefs.every((item) => typeof item === "string") &&
      typeof result.claimBoundary === "string" && result.claimBoundary.trim().length > 0 &&
      result.userDecisionPosture === "user_decides" &&
      result.noSingleWinner === true
    );
  });
}

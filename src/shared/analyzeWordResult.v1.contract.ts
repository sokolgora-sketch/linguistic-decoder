import { z } from "zod";

/**
 * analyze-v1 CONTRACT (runtime enforced)
 * - Strict: rejects unknown top-level keys.
 * - Minimal: we validate only what the endpoint must guarantee.
 *
 * If you want to allow a new top-level key, add it here AND update tests.
 */

export const AnalysisStatusClaimBoundaryV0_1ContractSchema = z
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

export const AnalysisStatusV0_1ContractSchema = z
  .object({
    schemaVersion: z.literal("open-instrument.analysis-status.v0_1"),
    status: z.enum([
      "reviewed_functional_evidence",
      "research_functional_hypothesis",
      "candidate_only",
      "structural_unreviewed",
      "null_no_supported_candidate",
    ]),
    summary: z.string().min(1),
    reviewedOperators: z.array(z.string()),
    candidateOnlyOperators: z.array(z.string()),
    researchHypothesisEmbryos: z.array(z.string()),
    structuralTokens: z.array(z.string()),
    claimBoundary: AnalysisStatusClaimBoundaryV0_1ContractSchema,
    userDecisionPosture: z.literal("user_decides"),
  })
  .strict();
export const AnalyzeWordPrimaryPathV1ContractSchema = z
  .object({
    voicePath: z.union([
      z.string().min(1),
      z.array(z.string().min(1)).min(1),
    ]),
    levelPath: z.string(),
    ringPath: z.union([
      z.string(),
      z.array(z.number()),
    ]),
  })
  .strict();

const EMBRYO_FIRST_CLAIM_TYPES = [
  "functionalMotivation",
  "structuralHypothesis",
  "historicalTransmission",
  "surfaceResonance",
  "seedPairing",
  "unresolved",
  "notEvaluated",
] as const;

const EMBRYO_FIRST_ORIGIN_CLAIMS = [
  "not_claimed",
  "context_only",
  "explicitly_supported",
  "rejected_for_this_output",
] as const;

const EMBRYO_FIRST_HISTORICAL_RELATIONS = [
  "not_evaluated",
  "context_only",
  "possible_loan_relation",
  "attested_loan_relation",
  "possible_cognate_relation",
  "unknown",
  "not_applicable",
] as const;

const EMBRYO_FIRST_VALIDATION_OUTCOMES = [
  "validated",
  "partial",
  "failed",
  "not_evaluated",
  "blocked",
] as const;

const EMBRYO_FIRST_RANK_GROUPS = [
  "validatedFunctionalMotivation",
  "partialFunctionalMotivation",
  "structuralHypothesis",
  "surfaceOrSeedOnly",
  "historicalContextOnly",
  "unresolved",
] as const;

/**
 * Normalized live candidate envelope. Legacy candidate fields remain allowed
 * through passthrough; this schema only hardens the additive embryo-first
 * projection and does not assert linguistic truth or source validity.
 */
export const AnalyzeV1CandidateEnvelopeSchema = z
  .object({
    candidateId: z.string().min(1),
    displayForm: z.string().min(1),
    candidateLanguage: z.string().min(1),
    claimType: z.enum(EMBRYO_FIRST_CLAIM_TYPES),
    originClaim: z.enum(EMBRYO_FIRST_ORIGIN_CLAIMS),
    historicalRelation: z.enum(EMBRYO_FIRST_HISTORICAL_RELATIONS),
    embryo: z.string().nullable(),
    embryoSize: z.number().finite().nullable(),
    embryoLanguage: z.string().nullable(),
    isolatedStandaloneForm: z.string().nullable(),
    plainStandaloneGloss: z.string().nullable(),
    sourceNote: z.string().nullable(),
    segmentation: z.unknown().nullable(),
    semanticBridge: z.string().nullable(),
    expansionChain: z.array(z.string()),
    validationOutcome: z.enum(EMBRYO_FIRST_VALIDATION_OUTCOMES),
    validationReasons: z.array(z.string()),
    rankGroup: z.enum(EMBRYO_FIRST_RANK_GROUPS),
    rankScore: z.number().finite(),
    rankReason: z.string().min(1),
    claimBoundary: z.string().min(1),
    userDecisionPosture: z.literal("user_decides"),
  })
  .passthrough();

const AnalyzeV1ResearchCandidateEnvelopeSchema = z
  .object({
    candidateId: z.string().min(1),
    displayForm: z.string().min(1),
    candidateLanguage: z.string().min(1),
    claimType: z.literal("functionalMotivation"),
    embryo: z.string().min(1),
    plainStandaloneGloss: z.string().min(1),
    semanticBridge: z.string().nullable(),
    validationOutcome: z.literal("not_evaluated"),
    rankGroup: z.literal("unresolved"),
    claimBoundary: z.literal("research_functional_hypothesis_only"),
    userDecisionPosture: z.literal("user_decides"),
  })
  .passthrough();

export type AnalyzeV1CandidateEnvelope = z.infer<
  typeof AnalyzeV1CandidateEnvelopeSchema
>;

function validateLiveCandidateEnvelopeArray(value: unknown): void {
  if (!Array.isArray(value)) return;

  if (value.length > 0) {
    z
      .array(
        z.union([
          AnalyzeV1CandidateEnvelopeSchema,
          AnalyzeV1ResearchCandidateEnvelopeSchema,
        ]),
      )
      .parse(value);
  }
}

export const AnalyzeWordResultV1ContractSchema = z
  .object({
    word: z.string().min(1),
    sanitized: z.string(),

    // Required “engine identity” fields used across UI/export/tests
    engineVersion: z.string().min(1),
    mode: z.string().min(1),
    alphabet: z.string().min(1),
    primaryPath:
      AnalyzeWordPrimaryPathV1ContractSchema
        .optional(),

    // Optional analysis blocks (kept loose for now; contract is about shape/stability)
    heart: z.unknown().optional(),
    mind: z.unknown().optional(),
    consonants: z.unknown().optional(),
    symbolicCore: z.unknown().optional(),
    candidates: z.array(z.unknown()).optional(),
    deepRoot: z.unknown().optional(),
    rootMap: z.unknown().optional(),
    analysisStatusV0_1: AnalysisStatusV0_1ContractSchema.optional(),
      heartPrimaryPath: z.unknown().optional(),
      resonanceProfileV1: z.unknown().optional(),
    // Origin Claim Protocol (V1) — keep loose until protocol stabilizes
    originClaim: z.unknown().optional(),
    wordMatrix: z.unknown().optional(),
    languageFamilies: z.array(z.unknown()).optional(),
    meta: z.unknown().optional(),
    debug: z.unknown().optional(),

    // Route-provided telemetry / debug blocks (stable shape at top-level; inner kept loose)
    evidence: z.unknown().optional(),
    originClaimGates: z.unknown().optional(),
    raw: z.unknown().optional(),
    heartInstrumentV1: z.unknown().optional(),
  })
  .strict();

export type AnalyzeWordResultV1Contract = z.infer<
  typeof AnalyzeWordResultV1ContractSchema
>;

/**
 * Normalizes and validates the output.
 * This is the single canonical conversion used by the route.
 */
export function toAnalyzeWordResultV1Contract(input: unknown): AnalyzeWordResultV1Contract {
  // Zod will strip unknown keys BEFORE strict check? No—strict rejects unknown keys.
  // So we validate against a pre-picked object to guarantee stability.
  const o = (input ?? {}) as any;

  validateLiveCandidateEnvelopeArray(o.candidates);

  const picked = {
    word: o.word,
    sanitized: o.sanitized,

    engineVersion: o.engineVersion,
    mode: o.mode,
    alphabet: o.alphabet,
    primaryPath: o.primaryPath,

    heart: o.heart,
    mind: o.mind,
    consonants: o.consonants,
    symbolicCore: o.symbolicCore,
    candidates: o.candidates,
    deepRoot: o.deepRoot,
    rootMap: o.rootMap,
    analysisStatusV0_1: o.analysisStatusV0_1,
      heartPrimaryPath: o.heartPrimaryPath,
      resonanceProfileV1: o.resonanceProfileV1,
    wordMatrix: o.wordMatrix,
    languageFamilies: o.languageFamilies,
    meta: o.meta,
    debug: o.debug,

    evidence: o.evidence,
    originClaim: o.originClaim,
    originClaimGates: o.originClaimGates,
    raw: o.raw,
    heartInstrumentV1: o.heartInstrumentV1,
  };

  return AnalyzeWordResultV1ContractSchema.parse(picked);
}

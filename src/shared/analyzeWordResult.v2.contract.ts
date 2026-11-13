import { z } from "zod";
import {
  AnalyzeWordResultV1ContractSchema,
  toAnalyzeWordResultV1Contract,
} from "./analyzeWordResult.v1.contract";
import {
  buildAnalysisStatusV0_2,
  isAnalysisStatusV0_2,
  migrateAnalysisStatusV0_1ToV0_2,
} from "./analysisStatus.v0_2";
import {
  isFunctionalMotivationInterpretationV0_3,
  migrateFunctionalMotivationInterpretationV0_2ToV0_3,
} from "./openInstrument/functionalMotivationInterpretation.v0_3";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./openInstrument/interpretationDecisionPolicy.v0_1";
import { migrateOriginClaimV1ToV0_2, isOriginClaimV0_2 } from "./originClaim.v2";
import {
  migrateLegacyInterpretationTextAtInputV0_1,
  migrateLegacyReviewedEvidenceLineAtInputV0_1,
} from "./openInstrument/neutralInterpretationInputMigration.v0_1";

export const ANALYZE_WORD_RESULT_SCHEMA_VERSION_V2 =
  "open-instrument.analyze-word-result.v2" as const;

const LEGACY_SELECTION_KEYS = new Set([
  "analysisStatusV0_1",
  "functionalMotivationInterpretationV0_2",
  "motivationDiscoveryV0_1",
  "winnerClaim",
  "noSingleWinner",
  "candidateWinnerIndependent",
]);

function hasLegacySelectionFields(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasLegacySelectionFields);
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) =>
    LEGACY_SELECTION_KEYS.has(key) ||
    ((key === "policy" || key === "mode") && child === "no_single_winner") ||
    hasLegacySelectionFields(child),
  );
}

function hasLegacyGeneratedPolicyText(value: unknown, path: readonly string[] = []): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasLegacyGeneratedPolicyText(item, path));
  }
  if (typeof value === "string") {
    const parentKey = path[path.length - 1];
    const ownerKey = path[path.length - 2];
    if (parentKey === "summary" && ownerKey === "analysisStatusV0_2") {
      return /\b(?:no single winner|no winner|winner claims? remain unclaimed|winner claim)\b|no_single_winner/i.test(value);
    }
    if (
      parentKey === "evidenceText" &&
      value.toLocaleLowerCase("en-US").startsWith("reviewed functional free-operator evidence:")
    ) {
      return /;\s*winnerClaim=not_claimed;\s*languageSuperiorityClaim=/i.test(value);
    }
    return false;
  }
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) =>
    hasLegacyGeneratedPolicyText(child, [...path, key]),
  );
}

const noLegacySelectionFields = (value: unknown): boolean =>
  !hasLegacySelectionFields(value) && !hasLegacyGeneratedPolicyText(value);

const neutralResultBase = AnalyzeWordResultV1ContractSchema.omit({
  analysisStatusV0_1: true,
  functionalMotivationInterpretationV0_2: true,
  originClaim: true,
  wordSpecificFunctionalDepth: true,
}).extend({
  responseContractVersion: z.literal(ANALYZE_WORD_RESULT_SCHEMA_VERSION_V2),
  analysisStatusV0_2: z.unknown().refine(
    isAnalysisStatusV0_2,
    "analysisStatusV0_2 contract invalid",
  ),
  interpretationDecisionPolicyV0_1: z.unknown().refine(
    isInterpretationDecisionPolicyV0_1,
    "interpretation decision policy contract invalid",
  ),
  functionalMotivationInterpretationV0_3: z.unknown().refine(
    (value) => value === undefined || isFunctionalMotivationInterpretationV0_3(value),
    "functionalMotivationInterpretationV0_3 contract invalid",
  ).optional(),
  originClaim: z.unknown().refine(
    (value) => value === undefined || isOriginClaimV0_2(value),
    "origin claim v0.2 contract invalid",
  ).optional(),
  wordSpecificFunctionalDepth: z.unknown().nullable().optional(),
  motivationDiscoveryV0_2: z.unknown().optional(),
  evidencePackage: z.unknown().optional(),
  automaticCarrierPronunciationV0_1: z.unknown().optional(),
  frontier: z.array(z.unknown()).optional(),
  history: z.unknown().optional(),
  engineMeta: z.unknown().optional(),
}).passthrough();

export const AnalyzeWordResultV2ContractSchema = neutralResultBase.superRefine(
  (value, context) => {
    if (!noLegacySelectionFields(value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Active response contains a legacy interpretation-selection field",
      });
    }
  },
);

export type AnalyzeWordResultV2Contract = z.infer<typeof AnalyzeWordResultV2ContractSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function projectNeutralNode(value: unknown, path: readonly string[] = []): unknown {
  if (Array.isArray(value)) return value.map((item) => projectNeutralNode(item, path));
  if (typeof value === "string") {
    const parentKey = path[path.length - 1];
    const ownerKey = path[path.length - 2];
    // Only known generated policy fields are migrated. Target spellings,
    // source identifiers, citations, glosses and user claims remain exact.
    if (
      (parentKey === "summary" && ownerKey === "analysisStatusV0_1") ||
      (parentKey === "claimBoundary" && path.includes("candidates")) ||
      ((parentKey === "gloss" || parentKey === "notes") &&
        path.includes("deepRoot") && path.includes("functionalRoots"))
    ) {
      return migrateLegacyInterpretationTextAtInputV0_1(value);
    }
    if (
      parentKey === "evidenceText" &&
      value.toLocaleLowerCase("en-US").startsWith("reviewed functional free-operator evidence:")
    ) {
      return migrateLegacyReviewedEvidenceLineAtInputV0_1(value);
    }
    return value;
  }
  if (!isRecord(value)) return value;

  const output: Record<string, unknown> = {};
  let replacedSelectionGuard = false;
  for (const [key, child] of Object.entries(value)) {
    if (
      key === "analysisStatusV0_1" ||
      key === "functionalMotivationInterpretationV0_2" ||
      key === "winnerClaim" ||
      key === "noSingleWinner" ||
      key === "candidateWinnerIndependent"
    ) {
      replacedSelectionGuard = true;
      continue;
    }
    if ((key === "policy" || key === "mode") && child === "no_single_winner") {
      replacedSelectionGuard = true;
      continue;
    }
    if (key === "motivationDiscoveryV0_1" && isRecord(child)) {
      const projected = projectNeutralNode(child, [...path, key]) as Record<string, unknown>;
      projected.schemaVersion = "open-instrument.motivation-engine-discovery.v0_2";
      output.motivationDiscoveryV0_2 = projected;
      continue;
    }
    output[key] = projectNeutralNode(child, [...path, key]);
  }

  const parentKey = path[path.length - 1];
  if (parentKey === "originClaim" || value.policy === "no_single_winner") {
    const migrated = migrateOriginClaimV1ToV0_2({
      ...output,
      version: value.version,
      policy: value.policy,
    });
    if (migrated) return migrated;
  }
  if (parentKey === "wordSpecificFunctionalDepth" && typeof output.schemaVersion === "string") {
    output.schemaVersion = "open-instrument.word-specific-functional-depth.v0_2";
  }
  if (parentKey === "doctrineReading" && typeof output.schemaVersion === "string") {
    output.schemaVersion = "open-instrument.doctrine-reading.v2";
  }
  if (replacedSelectionGuard) {
    output.interpretationDecisionPolicy = INTERPRETATION_DECISION_POLICY_V0_1;
  }
  return output;
}

/** Versioned neutral projection for legacy input records and export adapters. */
export function projectNeutralInterpretationNodeV2(
  value: unknown,
  inputPath: readonly string[] = [],
): unknown {
  return projectNeutralNode(value, inputPath);
}

export function toAnalyzeWordResultV2Contract(input: unknown): AnalyzeWordResultV2Contract {
  if (
    isRecord(input) &&
    input.responseContractVersion === ANALYZE_WORD_RESULT_SCHEMA_VERSION_V2
  ) {
    return AnalyzeWordResultV2ContractSchema.parse(input);
  }
  // Validate the established engine projection before applying the public V2
  // transport migration. Legacy names remain accepted only at this boundary.
  toAnalyzeWordResultV1Contract(input);
  if (!isRecord(input)) throw new Error("Analyze V2 response input must be an object");

  const projected = projectNeutralNode(input) as Record<string, unknown>;
  const migratedStatus = migrateAnalysisStatusV0_1ToV0_2(input.analysisStatusV0_1);
  const status = (migratedStatus ? projectNeutralNode(migratedStatus, ["analysisStatusV0_1"]) : null) ??
    (isAnalysisStatusV0_2(input.analysisStatusV0_2)
      ? input.analysisStatusV0_2
      : buildAnalysisStatusV0_2(input));
  const rawInterpretation = isFunctionalMotivationInterpretationV0_3(
    input.functionalMotivationInterpretationV0_3,
  )
    ? input.functionalMotivationInterpretationV0_3
    : migrateFunctionalMotivationInterpretationV0_2ToV0_3(
        input.functionalMotivationInterpretationV0_2,
      );
  const interpretation = projectNeutralNode(rawInterpretation);
  const originClaim = isOriginClaimV0_2(projected.originClaim)
    ? projected.originClaim
    : migrateOriginClaimV1ToV0_2(input.originClaim);

  delete projected.analysisStatusV0_1;
  delete projected.functionalMotivationInterpretationV0_2;
  delete projected.motivationDiscoveryV0_1;
  projected.responseContractVersion = ANALYZE_WORD_RESULT_SCHEMA_VERSION_V2;
  projected.analysisStatusV0_2 = status;
  projected.interpretationDecisionPolicyV0_1 = INTERPRETATION_DECISION_POLICY_V0_1;
  if (isFunctionalMotivationInterpretationV0_3(interpretation)) {
    projected.functionalMotivationInterpretationV0_3 = interpretation;
  }
  if (originClaim) projected.originClaim = originClaim;

  return AnalyzeWordResultV2ContractSchema.parse(projected);
}

export function hasLegacyInterpretationFieldsV2(value: unknown): boolean {
  return !noLegacySelectionFields(value);
}

import {
  projectSevenVoiceDoctrineV0_1,
} from "@/shared/openInstrument/doctrineProjection.v0_1";

export const LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_VERIFICATION_SCHEMA_V0_1 =
  "open-instrument.logic-derived-functional-hypothesis-verification.v0_1" as const;

export type LogicDerivedFunctionalHypothesisVerificationCheckV0_1 = Readonly<{
  id: string;
  pass: boolean;
}>;

export type VerifyLogicDerivedFunctionalHypothesisContextV0_1 = Readonly<{
  targetWord: string;
  strongerEvidencePresent?: boolean;
  canonicalCandidatePresent?: boolean;
  structuralOnly?: boolean;
}>;

export type LogicDerivedFunctionalHypothesisVerificationV0_1 = Readonly<{
  schemaVersion: typeof LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_VERIFICATION_SCHEMA_V0_1;
  status: "verified" | "rejected";
  accepted: boolean;
  reasonCodes: readonly string[];
  checks: readonly LogicDerivedFunctionalHypothesisVerificationCheckV0_1[];
}>;

type UnknownRecordV0_1 = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is UnknownRecordV0_1 {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textV0_1(value: unknown): string {
  return typeof value === "string"
    ? value.normalize("NFKC").trim()
    : "";
}

function normalizedWordV0_1(value: unknown): string {
  return textV0_1(value).toLocaleLowerCase("en-US");
}

function stringArrayV0_1(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  if (!value.every((item) => typeof item === "string")) return null;
  return value.map((item) => textV0_1(item));
}

function checkV0_1(
  id: string,
  pass: boolean,
): LogicDerivedFunctionalHypothesisVerificationCheckV0_1 {
  return { id, pass };
}

function rejectedV0_1(
  reasonCodes: readonly string[],
  checks: readonly LogicDerivedFunctionalHypothesisVerificationCheckV0_1[],
): LogicDerivedFunctionalHypothesisVerificationV0_1 {
  return {
    schemaVersion:
      LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_VERIFICATION_SCHEMA_V0_1,
    status: "rejected",
    accepted: false,
    reasonCodes,
    checks,
  };
}

export function verifyLogicDerivedFunctionalHypothesisV0_1(
  hypothesisValue: unknown,
  contextValue: unknown,
): LogicDerivedFunctionalHypothesisVerificationV0_1 {
  const checks: LogicDerivedFunctionalHypothesisVerificationCheckV0_1[] = [];
  const hypothesis = isRecordV0_1(hypothesisValue)
    ? hypothesisValue
    : null;
  const context = isRecordV0_1(contextValue) ? contextValue : null;

  if (
    !hypothesis ||
    !context ||
    hypothesis.schemaVersion !==
      "open-instrument.logic-derived-functional-hypothesis.v0_1" ||
    !textV0_1(hypothesis.hypothesisId) ||
    !textV0_1(context.targetWord)
  ) {
    return rejectedV0_1(["MALFORMED_RUNTIME_INPUT"], [
      checkV0_1("runtime_input_shape", false),
    ]);
  }

  const targetWordMatches =
    Boolean(textV0_1(context.targetWord)) &&
    normalizedWordV0_1(hypothesis.targetWord) ===
      normalizedWordV0_1(context.targetWord);
  checks.push(checkV0_1("target_word_binding", targetWordMatches));

  const targetSensePresent =
    Boolean(textV0_1(hypothesis.targetSenseId)) &&
    Boolean(textV0_1(hypothesis.targetSenseLabel));
  checks.push(checkV0_1("target_sense_present", targetSensePresent));

  const structuralAnchor = isRecordV0_1(hypothesis.structuralAnchor)
    ? hypothesis.structuralAnchor
    : null;
  const expansionChain = structuralAnchor
    ? stringArrayV0_1(structuralAnchor.expansionChain)
    : null;
  const operationIds = structuralAnchor
    ? stringArrayV0_1(structuralAnchor.reductionOperationIds)
    : null;
  const authorizedOperationIds = new Set([
    "peel_right_vowel_led_expansion",
    "peel_left_consonant_frame",
  ]);
  const structuralAnchorValid = Boolean(
    structuralAnchor &&
      textV0_1(structuralAnchor.hypothesisId) &&
      expansionChain &&
      expansionChain.length >= 2 &&
      operationIds &&
      operationIds.length > 0 &&
      operationIds.every((operationId) =>
        authorizedOperationIds.has(operationId),
      ),
  );
  checks.push(checkV0_1("structural_anchor_valid", structuralAnchorValid));

  const voicePath = stringArrayV0_1(hypothesis.voicePath);
  const voicePathValid = Boolean(voicePath && voicePath.length > 0);
  checks.push(checkV0_1("voice_path_present", voicePathValid));

  const doctrineProjection = projectSevenVoiceDoctrineV0_1(voicePath);
  const embeddedProjection = hypothesis.doctrineProjection;
  const doctrineProjectionValid =
    doctrineProjection.ok &&
    isRecordV0_1(embeddedProjection) &&
    JSON.stringify(doctrineProjection) === JSON.stringify(embeddedProjection);
  checks.push(checkV0_1("doctrine_projection_integrity", doctrineProjectionValid));

  const semanticBridgePresent = Boolean(textV0_1(hypothesis.semanticBridge));
  checks.push(checkV0_1("semantic_bridge_present", semanticBridgePresent));

  const truthBoundaryValid =
    hypothesis.aggregateStatus === "candidate_only" &&
    hypothesis.sourceKind === "logic_derived_functional_hypothesis" &&
    hypothesis.sourceStatus === "logic_derived_candidate" &&
    hypothesis.claimType === "functionalMotivation" &&
    hypothesis.functionalBridgeTruth === "hypothesis" &&
    hypothesis.historicalOriginClaim === "not_claimed" &&
    hypothesis.historicalTransmissionClaim === "not_claimed" &&
    hypothesis.winnerClaim === "not_claimed" &&
    hypothesis.languageSuperiorityClaim === "not_claimed" &&
    hypothesis.candidateTruthClaim === "not_claimed" &&
    hypothesis.userDecisionPosture === "user_decides" &&
    hypothesis.noSingleWinner === true;
  checks.push(checkV0_1("hypothesis_truth_boundary", truthBoundaryValid));

  const strongerEvidencePresent =
    context.strongerEvidencePresent === true ||
    context.canonicalCandidatePresent === true ||
    context.structuralOnly === true;
  checks.push(
    checkV0_1("stronger_evidence_precedence", !strongerEvidencePresent),
  );

  const reasonCodes: string[] = [];
  if (!targetWordMatches) reasonCodes.push("TARGET_WORD_MISMATCH");
  if (!targetSensePresent) reasonCodes.push("TARGET_SENSE_MISSING");
  if (!structuralAnchorValid) reasonCodes.push("STRUCTURAL_ANCHOR_INVALID");
  if (!voicePathValid) reasonCodes.push("VOICE_PATH_INVALID");
  if (!doctrineProjection.ok) {
    reasonCodes.push("DOCTRINE_PROJECTION_REJECTED");
  } else if (!doctrineProjectionValid) {
    reasonCodes.push("DOCTRINE_PROJECTION_MISMATCH");
  }
  if (!semanticBridgePresent) reasonCodes.push("SEMANTIC_BRIDGE_MISSING");
  if (!truthBoundaryValid) reasonCodes.push("TRUTH_BOUNDARY_VIOLATION");
  if (strongerEvidencePresent) {
    reasonCodes.push("STRONGER_EVIDENCE_OWNS_RESULT");
  }

  return reasonCodes.length === 0
    ? {
        schemaVersion:
          LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_VERIFICATION_SCHEMA_V0_1,
        status: "verified",
        accepted: true,
        reasonCodes: [],
        checks,
      }
    : rejectedV0_1(reasonCodes, checks);
}

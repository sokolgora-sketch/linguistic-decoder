import type { HeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import {
  buildFunctionalMotivationInterpretationV0_2,
  isFunctionalMotivationInterpretationV0_2,
  type FunctionalMotivationInterpretationV0_2,
} from "@/shared/openInstrument/functionalMotivationInterpretation.v0_2";
import type {
  MotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";

export const FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_3 =
  "open-instrument.functional-motivation-interpretation.v0_3" as const;

export type FunctionalMotivationCandidateInterpretationV0_3 = Omit<
  FunctionalMotivationInterpretationV0_2["candidates"][number],
  "winnerClaim" | "noSingleWinner"
>;

export type FunctionalMotivationClaimBoundaryV0_3 = Omit<
  FunctionalMotivationInterpretationV0_2["claimBoundary"],
  "winnerClaim"
>;

export type FunctionalMotivationInterpretationV0_3 = Omit<
  FunctionalMotivationInterpretationV0_2,
  "schemaVersion" | "candidates" | "claimBoundary" | "noSingleWinner"
> & Readonly<{
  schemaVersion: typeof FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_3;
  candidates: readonly FunctionalMotivationCandidateInterpretationV0_3[];
  claimBoundary: FunctionalMotivationClaimBoundaryV0_3;
  interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
}>;

function deepFreezeV0_3<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreezeV0_3(child);
    }
    Object.freeze(value);
  }
  return value;
}

function containsLegacySelectionFieldV0_3(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(containsLegacySelectionFieldV0_3);
  }
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) =>
    key === "noSingleWinner" || key === "winnerClaim" ||
    containsLegacySelectionFieldV0_3(child),
  );
}

/**
 * Lossless semantic migration of the old selection guards. Candidate order,
 * source facts, individual hypothesis status, evidence and unresolved fields
 * are copied unchanged; only the obsolete selection assertions are replaced
 * by the explicit, versioned decision policy.
 */
export function migrateFunctionalMotivationInterpretationV0_2ToV0_3(
  value: unknown,
): FunctionalMotivationInterpretationV0_3 | null {
  if (!isFunctionalMotivationInterpretationV0_2(value)) return null;

  const {
    schemaVersion: _legacySchemaVersion,
    noSingleWinner: _legacyNoAutomaticSelection,
    ...rest
  } = value;
  const { winnerClaim: _legacyBoundaryClaim, ...claimBoundary } = value.claimBoundary;
  const candidates = value.candidates.map((candidate) => {
    const {
      winnerClaim: _legacyCandidateClaim,
      noSingleWinner: _legacyNoAutomaticSelection,
      ...alternative
    } = candidate;
    return alternative;
  });

  return deepFreezeV0_3({
    ...rest,
    schemaVersion: FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_3,
    candidates,
    claimBoundary,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
  });
}

export function buildFunctionalMotivationInterpretationV0_3(input: {
  discovery: MotivationEngineDiscoveryV0_1;
  targetSense: FunctionalMotivationInterpretationV0_2["input"]["targetSense"];
  heart?: HeartInstrumentV1;
}): FunctionalMotivationInterpretationV0_3 {
  const migrated = migrateFunctionalMotivationInterpretationV0_2ToV0_3(
    buildFunctionalMotivationInterpretationV0_2(input),
  );
  if (!migrated) {
    throw new Error("V0_2 functional interpretation could not be projected to V0_3");
  }
  return migrated;
}

export function isFunctionalMotivationInterpretationV0_3(
  value: unknown,
): value is FunctionalMotivationInterpretationV0_3 {
  if (
    value === null || typeof value !== "object" || Array.isArray(value) ||
    containsLegacySelectionFieldV0_3(value)
  ) {
    return false;
  }
  const current = value as Record<string, unknown>;
  const boundary = current.claimBoundary;
  const candidates = current.candidates;
  if (
    current.schemaVersion !== FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_3 ||
    !isInterpretationDecisionPolicyV0_1(current.interpretationDecisionPolicy) ||
    boundary === null || typeof boundary !== "object" || Array.isArray(boundary) ||
    !Array.isArray(candidates) ||
    !candidates.every((candidate) => candidate !== null && typeof candidate === "object" && !Array.isArray(candidate))
  ) {
    return false;
  }

  // Reconstitute only the previous validator's required invariants in memory;
  // no legacy fields are emitted or accepted by this versioned contract.
  const legacyEquivalent = {
    ...current,
    schemaVersion: "open-instrument.functional-motivation-interpretation.v0_2",
    noSingleWinner: true,
    claimBoundary: { ...(boundary as Record<string, unknown>), winnerClaim: "not_claimed" },
    candidates: candidates.map((candidate) => ({
      ...(candidate as Record<string, unknown>),
      winnerClaim: "not_claimed",
      noSingleWinner: true,
    })),
  };
  delete (legacyEquivalent as Record<string, unknown>).interpretationDecisionPolicy;
  return isFunctionalMotivationInterpretationV0_2(legacyEquivalent);
}

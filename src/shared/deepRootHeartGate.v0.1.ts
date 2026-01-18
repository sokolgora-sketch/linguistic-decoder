// DeepRoot–Heart Alignment Gate v0.1
// Contract-first: types + reason codes only (behavior implemented later).

export type DeepRootHeartGateStatus =
  | "aligned"
  | "misaligned"
  | "insufficient_data";

export type DeepRootHeartGateReasonCode =
  | "HEART_PRIMARY_PATH_MISSING"
  | "CANDIDATE_PATH_MISSING"
  | "TERMINAL_VOWEL_CONFLICT";

export type DeepRootHeartGateV01 = {
  status: DeepRootHeartGateStatus;
  reasonCodes: DeepRootHeartGateReasonCode[];
  evidenceRefs: string[];
};

// Helper for stable “insufficient_data” objects.
export function gateInsufficient(
  reasons: DeepRootHeartGateReasonCode[],
  evidenceRefs: string[] = []
): DeepRootHeartGateV01 {
  return {
    status: "insufficient_data",
    reasonCodes: [...reasons].sort(),
    evidenceRefs: [...evidenceRefs],
  };
}

// Helper for stable “aligned/misaligned” objects.
export function gateResult(
  status: Exclude<DeepRootHeartGateStatus, "insufficient_data">,
  reasons: DeepRootHeartGateReasonCode[],
  evidenceRefs: string[] = []
): DeepRootHeartGateV01 {
  return {
    status,
    reasonCodes: [...reasons].sort(),
    evidenceRefs: [...evidenceRefs],
  };
}

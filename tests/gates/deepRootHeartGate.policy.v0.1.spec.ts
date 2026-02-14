import { decideDeepRootHeartGatePolicyV01 } from "@/shared/originClaim.deepRootHeartGatePolicy.v0.1";

describe("DeepRoot–Heart Gate v0.1 — policy", () => {
  test("allow when aligned", () => {
    const d = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "aligned", reasonCodes: [], evidenceRefs: [] },
    });
    expect(d).toEqual({ action: "allow", reasonCodes: [] });
  });

  test("strict blocks on misaligned", () => {
    const d = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "misaligned", reasonCodes: ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs: [] },
    });
    expect(d.action).toBe("block");
    expect(d.reasonCodes).toEqual(["TERMINAL_VOWEL_CONFLICT"]);
  });

  test("loose warns on misaligned", () => {
    const d = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: false,
      gate: { status: "misaligned", reasonCodes: ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs: [] },
    });
    expect(d.action).toBe("warn");
    expect(d.reasonCodes).toEqual(["TERMINAL_VOWEL_CONFLICT"]);
  });

  test("strict blocks on insufficient_data (current v0.1 behavior)", () => {
    const d = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "insufficient_data", reasonCodes: ["HEART_PRIMARY_PATH_MISSING"], evidenceRefs: [] },
    });
    expect(d.action).toBe("block");
    expect(d.reasonCodes).toEqual(["HEART_PRIMARY_PATH_MISSING"]);
  });
});

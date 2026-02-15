import { decideDeepRootHeartGatePolicyV01 } from "@/shared/originClaim.deepRootHeartGatePolicy.v0.1";

describe("originClaim deepRootHeartGate policy v0.1", () => {
  test("aligned => allow", () => {
    const d = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "aligned", reasonCodes: [], evidenceRefs: [] } as any,
    });
    expect(d).toEqual({ action: "allow", reasonCodes: [] });
  });

  test("misaligned => strict blocks, loose warns", () => {
    const a = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "misaligned", reasonCodes: ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs: [] } as any,
    });
    expect(a.action).toBe("block");

    const b = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: false,
      gate: { status: "misaligned", reasonCodes: ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs: [] } as any,
    });
    expect(b.action).toBe("warn");
  });

  test("missing/insufficient => warn (do not hard-cap on missing DeepRoot)", () => {
    const a = decideDeepRootHeartGatePolicyV01({ strictMediumPlus: true, gate: null });
    expect(a.action).toBe("warn");

    const b = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "insufficient_data", reasonCodes: ["DEEPROOT_FUNCTIONAL_PATH_MISSING"], evidenceRefs: [] } as any,
    });
    expect(b.action).toBe("warn");
  });
});

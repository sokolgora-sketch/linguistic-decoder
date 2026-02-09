import { decideDeepRootHeartGatePolicyV01 } from "@/shared/originClaim.deepRootHeartGatePolicy.v0.1";

describe("originClaim deepRootHeartGate policy v0.1", () => {
  test("aligned => allow", () => {
    const out = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "aligned", reasonCodes: [], evidenceRefs: [] } as any,
    });
    expect(out).toEqual({ action: "allow", reasonCodes: [] });
  });

  test("misaligned + strict => block", () => {
    const out = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "misaligned", reasonCodes: ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs: [] } as any,
    });
    expect(out.action).toBe("block");
    expect(out.reasonCodes).toEqual(["TERMINAL_VOWEL_CONFLICT"]);
  });

  test("misaligned + loose => warn", () => {
    const out = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: false,
      gate: { status: "misaligned", reasonCodes: ["RING_MISMATCH"], evidenceRefs: [] } as any,
    });
    expect(out.action).toBe("warn");
    expect(out.reasonCodes).toEqual(["RING_MISMATCH"]);
  });

  test("missing/insufficient => strict blocks, loose warns", () => {
    const a = decideDeepRootHeartGatePolicyV01({ strictMediumPlus: true, gate: null });
    expect(a.action).toBe("block");

    const b = decideDeepRootHeartGatePolicyV01({
      strictMediumPlus: true,
      gate: { status: "insufficient", reasonCodes: [], evidenceRefs: [] } as any,
    });
    expect(b.action).toBe("block");

    const c = decideDeepRootHeartGatePolicyV01({ strictMediumPlus: false, gate: null });
    expect(c.action).toBe("warn");
  });
});

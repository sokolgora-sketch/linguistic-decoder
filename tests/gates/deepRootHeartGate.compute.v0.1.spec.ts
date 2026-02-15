import { computeDeepRootHeartGateV01 } from "@/shared/deepRootHeartGate.v0.1.compute";

describe("DeepRoot–Heart Gate v0.1 — compute", () => {
  test("aligned when terminal vowel matches", () => {
    const g = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U→I",
      deepRootFunctionalPath: "U→I",
      evidenceRefs: ["heart.math7.primary", "deepRoot.functionalRoots[0].vowelPath", "heart.math7.primary"],
    });

    expect(g.status).toBe("aligned");
    expect(g.reasonCodes).toEqual([]);
    expect(g.evidenceRefs).toEqual(["heart.math7.primary", "deepRoot.functionalRoots[0].vowelPath"]);
  });

  test("misaligned when terminal vowel conflicts", () => {
    const g = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U→I",
      deepRootFunctionalPath: "U→A",
      evidenceRefs: ["heart.math7.primary"],
    });

    expect(g.status).toBe("misaligned");
    expect(g.reasonCodes).toEqual(["TERMINAL_VOWEL_CONFLICT"]);
    expect(g.evidenceRefs).toEqual(["heart.math7.primary"]);
  });

  test("insufficient_data when heart path missing or invalid", () => {
    const g = computeDeepRootHeartGateV01({
      heartPrimaryPath: null,
      deepRootFunctionalPath: "U→I",
      evidenceRefs: ["x"],
    });

    expect(g.status).toBe("insufficient_data");
    expect(g.reasonCodes).toEqual(["HEART_PRIMARY_PATH_MISSING"]);
    expect(g.evidenceRefs).toEqual(["x"]);
  });

  test("insufficient_data when deepRoot path missing or invalid", () => {
    const g = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U→I",
      deepRootFunctionalPath: "",
      evidenceRefs: [],
    });

    expect(g.status).toBe("insufficient_data");
    expect(g.reasonCodes).toEqual(["DEEPROOT_FUNCTIONAL_PATH_MISSING"]);
    expect(g.evidenceRefs).toEqual([]);
  });

  test("defensive parsing accepts U->I and U-I", () => {
    const a = computeDeepRootHeartGateV01({ heartPrimaryPath: "U->I", deepRootFunctionalPath: "U->I" });
    const b = computeDeepRootHeartGateV01({ heartPrimaryPath: "U-I", deepRootFunctionalPath: "U-I" });
    expect(a.status).toBe("aligned");
    expect(b.status).toBe("aligned");
  });
});

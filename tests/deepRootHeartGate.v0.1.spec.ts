import { computeDeepRootHeartGateV01 } from "@/shared/deepRootHeartGate.v0.1.compute";

describe("DeepRoot–Heart Alignment Gate v0.1", () => {
  test("aligned: terminal vowel matches", () => {
    const out = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U→I",
      candidateResolvedPath: "U→I",
      evidenceRefs: ["primaryPath.voicePath", "heart.math7.primary"],
    });

    expect(out.status).toBe("aligned");
    expect(out.reasonCodes).toEqual([]);
    expect(out.evidenceRefs).toEqual(["primaryPath.voicePath", "heart.math7.primary"]);
  });

  test("misaligned: terminal vowel differs", () => {
    const out = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U→I",
      candidateResolvedPath: "U→A",
      evidenceRefs: ["primaryPath.voicePath", "deepRoot.candidates[0].vowelPath"],
    });

    expect(out.status).toBe("misaligned");
    expect(out.reasonCodes).toEqual(["TERMINAL_VOWEL_CONFLICT"]);
  });

  test("insufficient_data: missing heart path", () => {
    const out = computeDeepRootHeartGateV01({
      heartPrimaryPath: null,
      candidateResolvedPath: "U→I",
      evidenceRefs: ["deepRoot.candidates[0].vowelPath"],
    });

    expect(out.status).toBe("insufficient_data");
    expect(out.reasonCodes).toEqual(["HEART_PRIMARY_PATH_MISSING"]);
  });

  test("insufficient_data: missing candidate path", () => {
    const out = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U→I",
      candidateResolvedPath: undefined,
      evidenceRefs: ["primaryPath.voicePath"],
    });

    expect(out.status).toBe("insufficient_data");
    expect(out.reasonCodes).toEqual(["CANDIDATE_PATH_MISSING"]);
  });

  test("accepts dash-delimited paths (adapter format)", () => {
    const out = computeDeepRootHeartGateV01({
      heartPrimaryPath: "U-I",
      candidateResolvedPath: "X-Y-I",
      evidenceRefs: ["primaryPath.voicePath"],
    });

    expect(out.status).toBe("aligned");
    expect(out.reasonCodes).toEqual([]);
  });

  test("determinism: repeated calls return identical object (including ordering)", () => {
    const input = {
      heartPrimaryPath: "U->I", // alternate arrow accepted
      candidateResolvedPath: "X→Y→I",
      evidenceRefs: ["a", "b", "a", "  ", "b", "c"],
    };

    const out1 = computeDeepRootHeartGateV01(input);
    const out2 = computeDeepRootHeartGateV01(input);

    expect(out1).toEqual(out2);
    // evidence refs should be stable uniq (first-seen order)
    expect(out1.evidenceRefs).toEqual(["a", "b", "c"]);
  });
});

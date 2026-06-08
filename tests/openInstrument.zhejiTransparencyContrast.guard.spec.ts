import { detectTransparencyContrastV0_1 } from "@/shared/openInstrument/zhejiTransparencyContrast.v0.1";

describe("Zheji transparency contrast v0.1", () => {
  it("groups non-null candidate languages by semanticTransparency.level", () => {
    const result = detectTransparencyContrastV0_1([
      {
        language: "Albanian",
        semanticTransparency: { level: "atomic" },
        candidateType: "strong_living_match",
      },
      {
        language: "Latin",
        semanticTransparency: { level: "metaphorical" },
        candidateType: "weak_resonance",
      },
      {
        language: "Chinese",
        semanticTransparency: { level: "opaque" },
        candidateType: "weak_resonance",
      },
    ]);

    expect(result).toEqual({
      hasContrast: true,
      matrix: {
        atomic: ["Albanian"],
        metaphorical: ["Latin"],
        opaque: ["Chinese"],
      },
    });
  });

  it("excludes null candidates and does not treat one populated bucket as contrast", () => {
    const result = detectTransparencyContrastV0_1([
      {
        language: "Albanian",
        semanticTransparency: { level: "atomic" },
      },
      {
        language: "Chinese",
        nullCandidate: true,
        semanticTransparency: { level: "opaque" },
      },
    ]);

    expect(result).toEqual({
      hasContrast: false,
      matrix: {
        atomic: ["Albanian"],
        metaphorical: [],
        opaque: [],
      },
    });
  });

  it("deduplicates same-language entries within the same bucket", () => {
    const result = detectTransparencyContrastV0_1([
      {
        language: "Albanian",
        semanticTransparency: { level: "atomic" },
      },
      {
        language: "Albanian",
        semanticTransparency: { level: "atomic" },
      },
    ]);

    expect(result.matrix.atomic).toEqual(["Albanian"]);
    expect(result.hasContrast).toBe(false);
  });

  it("does not read or mutate candidateType", () => {
    const candidate = {
      language: "Albanian",
      candidateType: "weak_resonance",
      semanticTransparency: { level: "atomic" },
    };

    const before = candidate.candidateType;
    const result = detectTransparencyContrastV0_1([candidate]);

    expect(candidate.candidateType).toBe(before);
    expect(result.matrix.atomic).toEqual(["Albanian"]);
  });
});

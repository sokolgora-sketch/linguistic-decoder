import { buildZhejiPromptContractSectionV0_1 } from "@/shared/openInstrument/zhejiTransparencyPrompt.v0.1";

describe("Zheji transparency prompt contract v0.1", () => {
  it("builds a compact candidate-level prompt section without derived contrast requests", () => {
    const result = buildZhejiPromptContractSectionV0_1({
      word: "study",
      segmentationId: "study.segmentation.003",
      chunks: ["SHTU", "DI"],
      voicePathHint: "U → I",
      doctrineHints: {
        U: "container, inside, adding, holding, depth",
        I: "insight, intellect, knowing, line, point",
      },
    });

    expect(result.metadata).toMatchObject({
      zhejiPromptContractApplied: true,
      sevenVoiceDoctrineReferenceIncluded: true,
      symbolicEvaluationAllowed: true,
      zhejiFieldsRequested: ["analysisLayers", "semanticTransparency"],
      transparencyContrastRequestedFromBrain: false,
    });

    expect(result.section).toContain("analysisLayers");
    expect(result.section).toContain("semanticTransparency");
    expect(result.section).toContain("semantic/function motivation");
    expect(result.section).toContain("Do not return transparencyContrast.");
    expect(result.section).toContain("Do not return transparencyContrastNote.");
    expect(result.section).toContain("Do not score, rank, choose a winner, claim origin, or modify candidateType.");
    expect(result.section).toContain("SHTU + DI");
    expect(result.section).toContain("U → I");
  });
  it("treats Zheji enrichment as additive and gracefully degradable", () => {
    const result = buildZhejiPromptContractSectionV0_1({
      word: "study",
      segmentationId: "study.segmentation.003",
      chunks: ["SHTU", "DI"],
      doctrineHints: {
        U: "container, inside, adding, holding, depth",
        I: "insight, intellect, knowing, line, point",
      },
    });

    expect(result.section).toContain("add analysisLayers only after preserving all required Brain candidate fields");
    expect(result.section).toContain("add semanticTransparency only after preserving all required Brain candidate fields");
    expect(result.section).toContain("use an empty array []");
    expect(result.section).toContain("Do not use null");
    expect(result.section).toContain("ENRICHMENT_WARNING");
    expect(result.section).toContain("not a reason to drop the structural Brain schema");
  });
});

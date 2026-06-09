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

  it("keeps opaque separate from null candidate enum semantics", () => {
    const result = buildZhejiPromptContractSectionV0_1({
      word: "study",
      segmentationId: "study.segmentation.004",
      chunks: ["S", "TU", "DI"],
      voicePathHint: "U → I",
      doctrineHints: {
        U: "container, inside, adding, holding, depth",
        I: "insight, intellect, knowing, line, point",
      },
    });

    expect(result.section).toContain("semanticTransparency.level must not be empty or null. If uncertain for a non-null candidate, use opaque.");
    expect(result.section).toContain("opaque is for non-null candidates only; do not use opaque as nullCandidates[].candidateType.");
    expect(result.section).toContain("Open Instrument is not an etymology task. It finds meaning/function motivation, not origin.");
    expect(result.section).toContain("functional identity card");
    expect(result.section).toContain("free operators");
    expect(result.section).toContain("Code F");
    expect(result.section).toContain("Code E");
    expect(result.section).toContain("Do not return transparencyContrast.");
    expect(result.section).toContain("Do not return transparencyContrastNote.");
    expect(result.section).not.toContain("polarInversion");
    expect(result.section).not.toContain("vector-conservation");
  });

});

import { validateZhejiTransparencyOutputV0_1 } from "@/shared/openInstrument/zhejiTransparencyValidation.v0.1";

const validCandidate = {
  segmentationId: "study.segmentation.003",
  chunk: "DI",
  language: "Albanian",
  candidateForm: "di",
  meaning: "know",
  functionFit: "direct knowledge function",
  sourceNote: "common Albanian lexical form",
  evidenceType: "living_lexical",
  candidateType: "strong_living_match",
  falseFriendRisk: "low",
  nullCandidate: false,
  notes: "semantic/function motivation only",
  analysisLayers: {
    formal: {
      isPresent: true,
      evidenceNote: "Living lexical form with direct meaning.",
    },
    symbolic: {
      isPresent: true,
      evidenceNote: "Aligns with I as knowing/insight.",
    },
  },
  semanticTransparency: {
    level: "atomic",
    reason: "Directly motivates knowing function.",
    decomposition: ["di"],
  },
};

describe("Zheji transparency validation v0.1", () => {
  it("accepts valid non-null candidate Zheji fields", () => {
    const result = validateZhejiTransparencyOutputV0_1({
      chunkCandidates: [validCandidate],
      rawBrainOutput: {
        chunkCandidates: [validCandidate],
      },
    });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("requires analysisLayers and semanticTransparency on non-null candidates", () => {
    const {
      analysisLayers: _analysisLayers,
      semanticTransparency: _semanticTransparency,
      ...candidateWithoutZhejiFields
    } = validCandidate;

    const result = validateZhejiTransparencyOutputV0_1({
      chunkCandidates: [candidateWithoutZhejiFields],
    });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "MISSING_ZHEJI_ANALYSIS_LAYERS",
        "MISSING_ZHEJI_SEMANTIC_TRANSPARENCY",
      ]),
    );
  });

  it("rejects invalid transparency levels and empty evidence notes when present", () => {
    const result = validateZhejiTransparencyOutputV0_1({
      chunkCandidates: [
        {
          ...validCandidate,
          analysisLayers: {
            formal: { isPresent: true, evidenceNote: "" },
            symbolic: { isPresent: false, evidenceNote: null },
          },
          semanticTransparency: {
            level: "winner",
            reason: "",
          },
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "INVALID_ZHEJI_ANALYSIS_LAYER",
        "INVALID_ZHEJI_TRANSPARENCY_LEVEL",
        "INVALID_ZHEJI_SEMANTIC_TRANSPARENCY",
      ]),
    );
  });

  it("rejects forbidden raw Brain output fields including derived contrast and origin/winner claims", () => {
    const result = validateZhejiTransparencyOutputV0_1({
      chunkCandidates: [validCandidate],
      rawBrainOutput: {
        transparencyContrast: { hasContrast: true },
        chunkCandidates: [
          {
            ...validCandidate,
            winner: "Albanian",
            originVerdict: "proved",
          },
        ],
      },
    });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.path)).toEqual(
      expect.arrayContaining([
        "transparencyContrast",
        "chunkCandidates.0.winner",
        "chunkCandidates.0.originVerdict",
      ]),
    );
  });

  it("does not require Zheji semantic fields on null candidates", () => {
    const result = validateZhejiTransparencyOutputV0_1({
      chunkCandidates: [
        {
          segmentationId: "study.segmentation.003",
          chunk: "SHTU",
          language: "Chinese",
          candidateForm: null,
          meaning: null,
          functionFit: "no candidate",
          sourceNote: "no suitable candidate found",
          evidenceType: "no_candidate",
          candidateType: "null_candidate",
          falseFriendRisk: "none",
          nullCandidate: true,
          notes: "null traceability preserved",
        },
      ],
    });

    expect(result.ok).toBe(true);
  });
});

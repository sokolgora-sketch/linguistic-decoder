import {
  brainInputFromHeartSegmentation,
  type BrainCandidateSearchInput,
} from "../src/shared/openInstrument/brainCandidateSearchPrompt.v0.1";
import {
  validateBrainCandidateSearchOutput,
  type BrainCandidateSearchOutput,
} from "../src/shared/openInstrument/brainCandidateSearchValidation.v0.1";
import { buildHeartChunkSegmentations } from "../src/shared/openInstrument/heartChunkSegmentation.v0.1";

const targetLanguages = [
  "Albanian",
  "Latin",
  "Greek",
  "Sanskrit",
  "Chinese",
  "Germanic",
  "Slavic",
  "Semitic",
];

function studyInput(): BrainCandidateSearchInput {
  const segmentation = buildHeartChunkSegmentations("study")[2];
  if (!segmentation) throw new Error("Expected study.segmentation.003.");
  return brainInputFromHeartSegmentation(segmentation, targetLanguages);
}

function validOutput(input = studyInput()): BrainCandidateSearchOutput {
  return {
    word: input.word,
    segmentationId: input.segmentationId,
    chunkCandidates: [
      {
        segmentationId: input.segmentationId,
        chunk: "SHTU",
        language: "Albanian",
        candidateForm: "shtoj",
        meaning: "to add, to increase",
        functionFit: "candidate meaning may align with U as adding under ZE-RO doctrine",
        sourceNote: "Albanian lexical candidate; source check required.",
        evidenceType: "living_lexical",
        candidateType: "strong_living_match",
        falseFriendRisk: "medium",
        nullCandidate: false,
        notes: "Candidate form need not exactly equal embryo target; relation requires review.",
      },
      {
        segmentationId: input.segmentationId,
        chunk: "DI",
        language: "Albanian",
        candidateForm: "di",
        meaning: "know",
        functionFit: "candidate meaning may align with I as knowing under ZE-RO doctrine",
        sourceNote: "Albanian lexical candidate; source check required.",
        evidenceType: "living_lexical",
        candidateType: "strong_living_match",
        falseFriendRisk: "medium",
        nullCandidate: false,
        notes: "Candidate is chunk-level only, not whole-word origin.",
      },
    ],
    nullCandidates: [],
    warnings: ["Short chunks have false-positive risk."],
    claimBoundary: {
      originClaim: false,
      scientificEvidence: false,
      publicationEvidence: false,
      developmentCandidateSearchOnly: true,
    },
  };
}

describe("Open Instrument Brain candidate search validation v0.1", () => {
  it("passes valid study.segmentation.003 output and does not require exact candidate form equality", () => {
    const input = studyInput();
    const result = validateBrainCandidateSearchOutput({
      heartInput: input,
      brainOutput: validOutput(input),
    });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.summary).toEqual({
      checkedCandidates: 2,
      checkedNullCandidates: 0,
      chunksCovered: ["SHTU", "DI"],
      missingChunks: [],
    });
  });

  it("fails when a top-level field is missing", () => {
    const output = validOutput() as Partial<BrainCandidateSearchOutput>;
    delete output.warnings;

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "MISSING_FIELD", path: "warnings" }),
      ]),
    );
  });

  it("fails wrong segmentationId", () => {
    const output = { ...validOutput(), segmentationId: "study.segmentation.999" };

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SEGMENTATION_ID_MISMATCH",
          path: "segmentationId",
        }),
      ]),
    );
  });

  it("fails unknown chunk", () => {
    const output = validOutput();
    output.chunkCandidates[0] = { ...output.chunkCandidates[0], chunk: "NEWCHUNK" };

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "UNKNOWN_CHUNK" })]),
    );
  });

  it("fails missing candidate required field", () => {
    const output = validOutput() as BrainCandidateSearchOutput & {
      chunkCandidates: Array<Record<string, unknown>>;
    };
    delete output.chunkCandidates[0].sourceNote;

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "MISSING_FIELD" })]),
    );
  });

  it("fails invalid candidateType", () => {
    const output = validOutput() as BrainCandidateSearchOutput & {
      chunkCandidates: Array<Record<string, unknown>>;
    };
    output.chunkCandidates[0].candidateType = "STRONG_LEXICAL";

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "INVALID_CANDIDATE_TYPE" })]),
    );
  });

  it("fails invalid evidenceType", () => {
    const output = validOutput() as BrainCandidateSearchOutput & {
      chunkCandidates: Array<Record<string, unknown>>;
    };
    output.chunkCandidates[0].evidenceType = "blog_guess";

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "INVALID_EVIDENCE_TYPE" })]),
    );
  });

  it("fails invalid falseFriendRisk", () => {
    const output = validOutput() as BrainCandidateSearchOutput & {
      chunkCandidates: Array<Record<string, unknown>>;
    };
    output.chunkCandidates[0].falseFriendRisk = "certain";

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "INVALID_FALSE_FRIEND_RISK" })]),
    );
  });

  it("fails enum fields returned as arrays", () => {
    const output = validOutput() as BrainCandidateSearchOutput & {
      chunkCandidates: Array<Record<string, unknown>>;
    };
    output.chunkCandidates[0].candidateType = ["strong_living_match"];
    output.chunkCandidates[0].evidenceType = ["living_lexical"];
    output.chunkCandidates[0].falseFriendRisk = ["medium"];

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "INVALID_CANDIDATE_TYPE" }),
        expect.objectContaining({ code: "INVALID_EVIDENCE_TYPE" }),
        expect.objectContaining({ code: "INVALID_FALSE_FRIEND_RISK" }),
      ]),
    );
  });

  it("fails invalid null candidate settings", () => {
    const input = studyInput();
    const output = validOutput(input);
    output.chunkCandidates = [];
    output.nullCandidates = [
      {
        segmentationId: input.segmentationId,
        chunk: "SHTU",
        language: "Chinese",
        candidateForm: "",
        meaning: "",
        functionFit: "",
        sourceNote: "",
        evidenceType: "living_lexical",
        candidateType: "weak_resonance",
        falseFriendRisk: "high",
        nullCandidate: true,
        notes: "",
      },
      {
        segmentationId: input.segmentationId,
        chunk: "DI",
        language: "Chinese",
        candidateForm: "",
        meaning: "",
        functionFit: "",
        sourceNote: "No credible candidate found.",
        evidenceType: "none",
        candidateType: "null_candidate",
        falseFriendRisk: "none",
        nullCandidate: true,
        notes: "Absence recorded as evidence.",
      },
    ];

    const result = validateBrainCandidateSearchOutput({
      heartInput: input,
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "INVALID_NULL_CANDIDATE" })]),
    );
  });

  it("fails when a Heart chunk has no candidate or null candidate", () => {
    const output = validOutput();
    output.chunkCandidates = output.chunkCandidates.filter((candidate) => candidate.chunk !== "DI");

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.summary.missingChunks).toEqual(["DI"]);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "MISSING_CHUNK_RESULT" })]),
    );
  });

  it("fails strong candidate with empty sourceNote", () => {
    const output = validOutput();
    output.chunkCandidates[0] = { ...output.chunkCandidates[0], sourceNote: "" };

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "STRONG_CANDIDATE_MISSING_SOURCE" }),
      ]),
    );
  });

  it("fails doctrine-only strong candidate", () => {
    const output = validOutput();
    output.chunkCandidates[0] = {
      ...output.chunkCandidates[0],
      evidenceType: "doctrine_alignment",
    };

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "DOCTRINE_ONLY_STRONG_CANDIDATE" }),
      ]),
    );
  });

  it("fails forbidden origin/proof claim phrase", () => {
    const output = validOutput();
    output.chunkCandidates[0] = {
      ...output.chunkCandidates[0],
      notes: "This proves origin.",
    };

    const result = validateBrainCandidateSearchOutput({
      heartInput: studyInput(),
      brainOutput: output,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "FORBIDDEN_ORIGIN_CLAIM" })]),
    );
  });
});

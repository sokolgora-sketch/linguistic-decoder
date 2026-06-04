import {
  BRAIN_CANDIDATE_TYPES,
  BRAIN_EVIDENCE_TYPES,
  BRAIN_FALSE_FRIEND_RISKS,
  brainInputFromHeartSegmentation,
  buildBrainCandidateSearchPrompt,
} from "../src/shared/openInstrument/brainCandidateSearchPrompt.v0.1";
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

describe("Open Instrument Brain candidate search prompt v0.1", () => {
  const studyShtuDi = buildHeartChunkSegmentations("study")[2];
  if (!studyShtuDi) {
    throw new Error("Expected study.segmentation.003 fixture.");
  }

  const input = brainInputFromHeartSegmentation(studyShtuDi, targetLanguages);
  const prompt = buildBrainCandidateSearchPrompt(input);
  const combined = `${prompt.systemPrompt}\n${prompt.userPrompt}`;
  const schemaJson = JSON.stringify(prompt.requiredOutputSchema);

  it("accepts study segmentation 003 from Heart segmentation helper", () => {
    expect(input.segmentationId).toBe("study.segmentation.003");
    expect(input.chunks).toEqual(["SHTU", "DI"]);
    expect(input.legalTransforms).toEqual(["S_TO_SH", "FINAL_Y_TO_I"]);
    expect(input.searchMode).toBe("chunk_candidate_search_v0.1");
  });

  it("requires strict JSON only", () => {
    expect(combined).toContain("Return strict JSON only");
    expect(combined).toContain("No prose outside JSON");
    expect(combined).toContain("Do not add prose");
  });

  it("includes required top-level output fields", () => {
    for (const field of [
      "word",
      "segmentationId",
      "chunkCandidates",
      "nullCandidates",
      "warnings",
      "claimBoundary",
    ]) {
      expect(schemaJson).toContain(field);
    }
  });

  it("includes required chunk candidate fields", () => {
    for (const field of [
      "segmentationId",
      "chunk",
      "language",
      "candidateForm",
      "meaning",
      "functionFit",
      "sourceNote",
      "evidenceType",
      "candidateType",
      "falseFriendRisk",
      "nullCandidate",
      "notes",
    ]) {
      expect(schemaJson).toContain(field);
    }
  });

  it("includes every candidate type", () => {
    for (const candidateType of BRAIN_CANDIDATE_TYPES) {
      expect(combined).toContain(candidateType);
      expect(schemaJson).toContain(candidateType);
    }
  });

  it("includes every evidence type", () => {
    for (const evidenceType of BRAIN_EVIDENCE_TYPES) {
      expect(combined).toContain(evidenceType);
      expect(schemaJson).toContain(evidenceType);
    }
  });

  it("includes every false-friend risk value", () => {
    for (const risk of BRAIN_FALSE_FRIEND_RISKS) {
      expect(combined).toContain(risk);
      expect(schemaJson).toContain(risk);
    }
  });

  it("requires null_candidate when no credible candidate exists", () => {
    expect(combined).toContain("Do not hide nulls");
    expect(combined).toContain(
      "If no credible candidate exists, return a null_candidate",
    );
    expect(schemaJson).toContain("null_candidate");
  });

  it("includes hard prohibitions", () => {
    for (const phrase of [
      "Do not create new segmentation",
      "Do not reorder chunks",
      "Do not invent transforms",
      "Do not change vowel path",
      "Do not claim origin",
      "Do not treat resonance as proof",
      "Do not hide nulls",
    ]) {
      expect(combined).toContain(phrase);
    }
  });

  it("preserves Heart segmentation input in user prompt", () => {
    expect(prompt.userPrompt).toContain("study.segmentation.003");
    expect(prompt.userPrompt).toContain("SHTU");
    expect(prompt.userPrompt).toContain("DI");
    expect(prompt.userPrompt).toContain("S_TO_SH");
    expect(prompt.userPrompt).toContain("FINAL_Y_TO_I");
    expect(prompt.userPrompt).toContain("ZE-RO doctrine");
  });

  it("sets claim boundary to no origin/scientific/publication claims", () => {
    expect(prompt.requiredOutputSchema.claimBoundary).toEqual({
      originClaim: false,
      scientificEvidence: false,
      publicationEvidence: false,
      developmentCandidateSearchOnly: true,
    });
  });
});

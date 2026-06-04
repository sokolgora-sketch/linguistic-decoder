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

  it("requires null candidates to preserve exact traceability fields", () => {
    expect(combined).toContain(
      "nullCandidates follow the same traceability rules as chunkCandidates",
    );
    expect(combined).toContain("Every object in nullCandidates must include segmentationId");
    expect(combined).toContain(
      "Every nullCandidates[].segmentationId must exactly equal the Heart input segmentationId",
    );
    expect(combined).toContain("Never omit segmentationId from null candidates");
    expect(combined).toContain("Never use a different segmentationId in null candidates");
    expect(combined).toContain(
      "Every null candidate must copy the exact Heart-approved chunk string",
    );
    expect(combined).toContain(
      "Missing or mismatched segmentationId in any null candidate makes the entire Brain output invalid",
    );
    expect(combined).toContain(
      "Null candidates are evidence of absence and must remain auditable",
    );
  });

  it("keeps null candidate traceability reinforced for study.segmentation.004", () => {
    const study004 = buildHeartChunkSegmentations("study").find(
      (segmentation) => segmentation.segmentationId === "study.segmentation.004",
    );
    if (!study004) {
      throw new Error("Expected study.segmentation.004 fixture.");
    }

    const prompt004 = buildBrainCandidateSearchPrompt(
      brainInputFromHeartSegmentation(study004, targetLanguages),
    );
    const combined004 = `${prompt004.systemPrompt}\n${prompt004.userPrompt}`;

    expect(combined004).toContain("study.segmentation.004");
    expect(combined004).toContain('"S"');
    expect(combined004).toContain('"TU"');
    expect(combined004).toContain('"DI"');
    expect(combined004).toContain(
      "nullCandidates follow the same traceability rules as chunkCandidates",
    );
    expect(combined004).toContain(
      "Every nullCandidates[].segmentationId must exactly equal the Heart input segmentationId",
    );
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

  it("requires enum fields to be scalar strings and never arrays", () => {
    expect(combined).toContain("Enum fields must be scalar strings, never arrays");
    expect(combined).toContain("Never wrap enum values in arrays");
    expect(combined).toContain(
      "Arrays are invalid for candidateType, evidenceType, and falseFriendRisk",
    );

    expect(prompt.requiredOutputSchema).toMatchObject({
      enumFieldsMustBeScalarStrings: true,
      arraysAreInvalidForEnumFields: true,
    });
  });

  it("forbids uppercase enum aliases from external terminology", () => {
    for (const forbidden of [
      "STRONG_LEXICAL",
      "NULL_CANDIDATE",
      "FALSE_FRIEND_RISK",
    ]) {
      expect(combined).toContain(forbidden);
    }
    expect(combined).toContain("Do not use uppercase enum aliases");
  });

  it("represents enum schema fields as scalar string descriptors, not direct arrays", () => {
    const firstCandidate = (
      prompt.requiredOutputSchema.chunkCandidates as Array<Record<string, unknown>>
    )[0] as Record<string, unknown>;
    const firstNullCandidate = (
      prompt.requiredOutputSchema.nullCandidates as Array<Record<string, unknown>>
    )[0] as Record<string, unknown>;

    for (const field of ["candidateType", "evidenceType", "falseFriendRisk"]) {
      expect(schemaJson).toContain(`"${field}"`);
      expect(Array.isArray(firstCandidate[field])).toBe(false);
      expect(Array.isArray(firstNullCandidate[field])).toBe(false);
      expect(firstCandidate[field]).toMatchObject({
        type: "string",
        requiredScalar: true,
        arraysAreInvalid: true,
      });
      expect(firstNullCandidate[field]).toMatchObject({
        type: "string",
        requiredScalar: true,
        arraysAreInvalid: true,
      });
    }

    expect(schemaJson).toContain('"allowedValues"');
  });

  it("requires exact segmentationId and exact Heart-approved chunk strings", () => {
    expect(combined).toContain("copy the exact segmentationId");
    expect(combined).toContain("use only exact chunk strings");
    expect(combined).toContain("HEART_APPROVED_INPUT_JSON");
  });

  it("includes study segmentation 002 and its exact Heart chunks when built from that input", () => {
    const studyStuDi = buildHeartChunkSegmentations("study").find(
      (segmentation) => segmentation.segmentationId === "study.segmentation.002",
    );
    if (!studyStuDi) {
      throw new Error("Expected study.segmentation.002 fixture.");
    }

    const segmentation002Prompt = buildBrainCandidateSearchPrompt(
      brainInputFromHeartSegmentation(studyStuDi, targetLanguages),
    );

    expect(segmentation002Prompt.userPrompt).toContain("study.segmentation.002");
    expect(segmentation002Prompt.userPrompt).toContain('"STU"');
    expect(segmentation002Prompt.userPrompt).toContain('"DI"');
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

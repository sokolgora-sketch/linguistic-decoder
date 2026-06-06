import {
  BRAIN_CANDIDATE_TYPES,
  BRAIN_EVIDENCE_TYPES,
  BRAIN_FALSE_FRIEND_RISKS,
  type BrainCandidateSearchInput,
} from "../src/shared/openInstrument/brainCandidateSearchPrompt.v0.1";
import {
  normalizeBrainCandidateEnums,
  type BrainCandidateEnumRepairAuditEntry,
} from "../src/shared/openInstrument/brainCandidateEnumRepair.v0.1";
import { validateBrainCandidateSearchOutput } from "../src/shared/openInstrument/brainCandidateSearchValidation.v0.1";

const HEART_INPUT: BrainCandidateSearchInput = {
  word: "study",
  normalizedWord: "study",
  segmentationId: "study.segmentation.004",
  chunks: ["S", "TU", "DI"],
  chunkVariants: [],
  voicePath: ["U", "Y"],
  legalTransforms: [],
  normalizationNotes: [],
  functionHints: [],
  targetLanguages: ["Albanian", "Latin", "Chinese", "Germanic"],
  searchMode: "chunk_candidate_search_v0.1",
};

function buildBrainOutput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    word: "study",
    segmentationId: "study.segmentation.004",
    chunkCandidates: [
      {
        segmentationId: "study.segmentation.004",
        chunk: "DI",
        language: "Latin",
        candidateForm: "di",
        meaning: "know",
        functionFit: "knowledge function",
        sourceNote: "attested lexical item",
        evidenceType: "living_lexical",
        candidateType: "strong_living_match",
        falseFriendRisk: "low",
        nullCandidate: false,
        notes: "retained as a living lexical candidate",
      },
    ],
    nullCandidates: [
      {
        segmentationId: "study.segmentation.004",
        chunk: "S",
        language: "Albanian",
        candidateForm: "",
        meaning: "",
        functionFit: "",
        sourceNote: "no credible candidate",
        evidenceType: "none",
        candidateType: "null_candidate",
        falseFriendRisk: "none",
        nullCandidate: true,
        notes: "absence explained",
      },
    ],
    warnings: [],
    claimBoundary: {
      originClaim: false,
      scientificEvidence: false,
      publicationEvidence: false,
      developmentCandidateSearchOnly: true,
    },
    ...overrides,
  };
}

function auditByPath(
  audit: BrainCandidateEnumRepairAuditEntry[],
  path: string,
): BrainCandidateEnumRepairAuditEntry {
  const entry = audit.find((candidate) => candidate.path === path);
  expect(entry).toBeDefined();
  return entry as BrainCandidateEnumRepairAuditEntry;
}

describe("Brain candidate enum repair helper", () => {
  it("preserves raw output and returns a separate normalized object", () => {
    const input = buildBrainOutput({
      chunkCandidates: [
        {
          segmentationId: "study.segmentation.004",
          chunk: "DI",
          language: "Latin",
          candidateForm: "di",
          meaning: "know",
          functionFit: "knowledge function",
          sourceNote: "attested lexical item",
          evidenceType: " living lexical ",
          candidateType: " strong living match ",
          falseFriendRisk: " low ",
          nullCandidate: false,
          notes: "retained as a living lexical candidate",
        },
      ],
    });

    const snapshot = JSON.parse(JSON.stringify(input));
    const result = normalizeBrainCandidateEnums(input);

    expect(input).toEqual(snapshot);
    expect(result.rawBrainOutput).toBe(input);
    expect(result.normalizedBrainOutput).not.toBe(input);
    expect(result.normalizedBrainOutput).toEqual(expect.any(Object));
  });

  it("leaves already canonical values unchanged", () => {
    const result = normalizeBrainCandidateEnums(buildBrainOutput());

    expect(result.normalizedBrainOutput).toEqual(buildBrainOutput());
    expect(result.audit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "chunkCandidates.0.candidateType",
          status: "unchanged",
          mappingRuleId: "already_canonical",
          normalizedValue: "strong_living_match",
        }),
        expect.objectContaining({
          path: "chunkCandidates.0.evidenceType",
          status: "unchanged",
          mappingRuleId: "already_canonical",
          normalizedValue: "living_lexical",
        }),
        expect.objectContaining({
          path: "chunkCandidates.0.falseFriendRisk",
          status: "unchanged",
          mappingRuleId: "already_canonical",
          normalizedValue: "low",
        }),
        expect.objectContaining({
          path: "nullCandidates.0.candidateType",
          status: "unchanged",
          mappingRuleId: "already_canonical",
          normalizedValue: "null_candidate",
        }),
        expect.objectContaining({
          path: "nullCandidates.0.evidenceType",
          status: "unchanged",
          mappingRuleId: "already_canonical",
          normalizedValue: "none",
        }),
        expect.objectContaining({
          path: "nullCandidates.0.falseFriendRisk",
          status: "unchanged",
          mappingRuleId: "already_canonical",
          normalizedValue: "none",
        }),
      ]),
    );
  });

  it("repairs safe formatting variants into canonical enum values", () => {
    // No semantic aliases beyond formatting normalization are supported here.
    const result = normalizeBrainCandidateEnums(
      buildBrainOutput({
        chunkCandidates: [
          {
            segmentationId: "study.segmentation.004",
            chunk: "DI",
            language: "Latin",
            candidateForm: "di",
            meaning: "know",
            functionFit: "knowledge function",
            sourceNote: "attested lexical item",
            evidenceType: " living lexical ",
            candidateType: " WEAK RESONANCE ",
            falseFriendRisk: " HIGH ",
            nullCandidate: false,
            notes: "retained as a living lexical candidate",
          },
        ],
        nullCandidates: [
          {
            segmentationId: "study.segmentation.004",
            chunk: "S",
            language: "Albanian",
            candidateForm: "",
            meaning: "",
            functionFit: "",
            sourceNote: "no credible candidate",
            evidenceType: " living-lexical ",
            candidateType: " null-candidate ",
            falseFriendRisk: " NONE ",
            nullCandidate: true,
            notes: "absence explained",
          },
        ],
      }),
    );

    expect(result.normalizedBrainOutput).toMatchObject({
      chunkCandidates: [
        {
          candidateType: "weak_resonance",
          evidenceType: "living_lexical",
          falseFriendRisk: "high",
        },
      ],
      nullCandidates: [
        {
          candidateType: "null_candidate",
          evidenceType: "living_lexical",
          falseFriendRisk: "none",
        },
      ],
    });

    expect(auditByPath(result.audit, "chunkCandidates.0.candidateType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "case_space_hyphen_underscore_normalization",
      originalValue: " WEAK RESONANCE ",
      normalizedValue: "weak_resonance",
    });

    expect(auditByPath(result.audit, "chunkCandidates.0.evidenceType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "case_space_hyphen_underscore_normalization",
      originalValue: " living lexical ",
      normalizedValue: "living_lexical",
    });

    expect(auditByPath(result.audit, "chunkCandidates.0.falseFriendRisk")).toMatchObject({
      status: "repaired",
      mappingRuleId: "case_space_hyphen_underscore_normalization",
      originalValue: " HIGH ",
      normalizedValue: "high",
    });

    expect(auditByPath(result.audit, "nullCandidates.0.candidateType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "case_space_hyphen_underscore_normalization",
      originalValue: " null-candidate ",
      normalizedValue: "null_candidate",
    });

    expect(auditByPath(result.audit, "nullCandidates.0.evidenceType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "case_space_hyphen_underscore_normalization",
      originalValue: " living-lexical ",
      normalizedValue: "living_lexical",
    });

    expect(auditByPath(result.audit, "nullCandidates.0.falseFriendRisk")).toMatchObject({
      status: "repaired",
      mappingRuleId: "case_space_hyphen_underscore_normalization",
      originalValue: " NONE ",
      normalizedValue: "none",
    });
  });

  it("repairs approved type-wrapper objects into canonical enum values", () => {
    const input = buildBrainOutput({
      chunkCandidates: [
        {
          segmentationId: "study.segmentation.004",
          chunk: "DI",
          language: "Latin",
          candidateForm: "di",
          meaning: "know",
          functionFit: "knowledge function",
          sourceNote: "attested lexical item",
          evidenceType: { type: " living lexical " },
          candidateType: { type: " weak resonance " },
          falseFriendRisk: { type: " LOW " },
          nullCandidate: false,
          notes: "retained as a living lexical candidate",
        },
      ],
      nullCandidates: [
        {
          segmentationId: "study.segmentation.004",
          chunk: "S",
          language: "Albanian",
          candidateForm: "",
          meaning: "",
          functionFit: "",
          sourceNote: "no credible candidate",
          evidenceType: { type: " none " },
          candidateType: { type: " null candidate " },
          falseFriendRisk: { type: " NONE " },
          nullCandidate: true,
          notes: "absence explained",
        },
        {
          segmentationId: "study.segmentation.004",
          chunk: "TU",
          language: "Latin",
          candidateForm: "",
          meaning: "",
          functionFit: "",
          sourceNote: "no credible candidate",
          evidenceType: { type: " none " },
          candidateType: { type: " null candidate " },
          falseFriendRisk: { type: " NONE " },
          nullCandidate: true,
          notes: "absence explained",
        },
      ],
    });

    const result = normalizeBrainCandidateEnums(input);
    const normalized = result.normalizedBrainOutput as Record<string, unknown>;
    const chunkCandidate = (normalized.chunkCandidates as Record<string, unknown>[])[0];
    const nullCandidates = normalized.nullCandidates as Record<string, unknown>[];
    const nullCandidate = nullCandidates[0];
    const tuNullCandidate = nullCandidates[1];

    expect(input.chunkCandidates[0].candidateType).toEqual({ type: " weak resonance " });
    expect(input.nullCandidates[0].candidateType).toEqual({ type: " null candidate " });
    expect(normalized).toMatchObject({
      chunkCandidates: [
        {
          candidateType: "weak_resonance",
          evidenceType: "living_lexical",
          falseFriendRisk: "low",
        },
      ],
      nullCandidates: [
        {
          candidateType: "null_candidate",
          evidenceType: "none",
          falseFriendRisk: "none",
        },
        {
          candidateType: "null_candidate",
          evidenceType: "none",
          falseFriendRisk: "none",
        },
      ],
    });

    expect(chunkCandidate.candidateType).toBe("weak_resonance");
    expect(chunkCandidate.evidenceType).toBe("living_lexical");
    expect(chunkCandidate.falseFriendRisk).toBe("low");
    expect(nullCandidate.candidateType).toBe("null_candidate");
    expect(nullCandidate.evidenceType).toBe("none");
    expect(nullCandidate.falseFriendRisk).toBe("none");
    expect(tuNullCandidate.candidateType).toBe("null_candidate");
    expect(tuNullCandidate.evidenceType).toBe("none");
    expect(tuNullCandidate.falseFriendRisk).toBe("none");

    expect(auditByPath(result.audit, "chunkCandidates.0.candidateType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "object_type_scalar_enum_wrapper",
      originalValue: { type: " weak resonance " },
      extractedValue: " weak resonance ",
      normalizedValue: "weak_resonance",
      objectShape: "type",
      carrierKey: "type",
    });

    expect(auditByPath(result.audit, "chunkCandidates.0.evidenceType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "object_type_scalar_enum_wrapper",
      originalValue: { type: " living lexical " },
      extractedValue: " living lexical ",
      normalizedValue: "living_lexical",
      objectShape: "type",
      carrierKey: "type",
    });

    expect(auditByPath(result.audit, "chunkCandidates.0.falseFriendRisk")).toMatchObject({
      status: "repaired",
      mappingRuleId: "object_type_scalar_enum_wrapper",
      originalValue: { type: " LOW " },
      extractedValue: " LOW ",
      normalizedValue: "low",
      objectShape: "type",
      carrierKey: "type",
    });

    expect(auditByPath(result.audit, "nullCandidates.0.candidateType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "object_type_scalar_enum_wrapper",
      originalValue: { type: " null candidate " },
      extractedValue: " null candidate ",
      normalizedValue: "null_candidate",
      objectShape: "type",
      carrierKey: "type",
    });

    expect(auditByPath(result.audit, "nullCandidates.1.evidenceType")).toMatchObject({
      status: "repaired",
      mappingRuleId: "object_type_scalar_enum_wrapper",
      originalValue: { type: " none " },
      extractedValue: " none ",
      normalizedValue: "none",
      objectShape: "type",
      carrierKey: "type",
    });

    const validation = validateBrainCandidateSearchOutput({
      heartInput: HEART_INPUT,
      brainOutput: result.normalizedBrainOutput,
    });

    expect(validation.ok).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it("leaves unknown enum strings unresolved", () => {
    const result = normalizeBrainCandidateEnums(
      buildBrainOutput({
        chunkCandidates: [
          {
            segmentationId: "study.segmentation.004",
            chunk: "DI",
            language: "Latin",
            candidateForm: "di",
            meaning: "know",
            functionFit: "knowledge function",
            sourceNote: "attested lexical item",
            evidenceType: "living_lexical",
            candidateType: "mystery_enum",
            falseFriendRisk: "low",
            nullCandidate: false,
            notes: "retained as a living lexical candidate",
          },
        ],
      }),
    );

    expect(result.normalizedBrainOutput).toMatchObject({
      chunkCandidates: [{ candidateType: "mystery_enum" }],
    });
    expect(result.unresolved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "chunkCandidates.0.candidateType",
          status: "unresolved",
          mappingRuleId: "unknown_enum_value",
        }),
      ]),
    );
  });

  it.each([
    {
      label: "missing carrier key",
      value: {},
      mappingRuleId: "object_missing_carrier_key",
    },
    {
      label: "multiple keys",
      value: { type: "null_candidate", value: "extra" },
      mappingRuleId: "object_multiple_carrier_keys",
    },
    {
      label: "non-scalar carrier",
      value: { type: ["null_candidate"] },
      mappingRuleId: "object_non_scalar_carrier_value",
    },
    {
      label: "unknown carrier string",
      value: { type: "mystery_enum" },
      mappingRuleId: "object_unknown_enum_value",
    },
  ])("leaves $label object wrappers unresolved", ({ value, mappingRuleId }) => {
    const result = normalizeBrainCandidateEnums(
      buildBrainOutput({
        chunkCandidates: [
          {
            segmentationId: "study.segmentation.004",
            chunk: "DI",
            language: "Latin",
            candidateForm: "di",
            meaning: "know",
            functionFit: "knowledge function",
            sourceNote: "attested lexical item",
            evidenceType: value,
            candidateType: "strong_living_match",
            falseFriendRisk: "low",
            nullCandidate: false,
            notes: "retained as a living lexical candidate",
          },
        ],
      }),
    );

    expect(result.unresolved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "chunkCandidates.0.evidenceType",
          status: "unresolved",
          mappingRuleId,
        }),
      ]),
    );
  });

  it.each([
    { value: ["weak_resonance"], label: "one-item array" },
    { value: ["weak_resonance", "strong_living_match"], label: "multi-item array" },
    { value: { type: ["weak_resonance"] }, label: "object" },
    { value: null, label: "null" },
    { value: 42, label: "number" },
    { value: true, label: "boolean" },
  ])("marks non-scalar %s as unresolved", ({ value }) => {
    const expectedMappingRuleId =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? "object_non_scalar_carrier_value"
        : "non_scalar_value";

    const result = normalizeBrainCandidateEnums(
      buildBrainOutput({
        chunkCandidates: [
          {
            segmentationId: "study.segmentation.004",
            chunk: "DI",
            language: "Latin",
            candidateForm: "di",
            meaning: "know",
            functionFit: "knowledge function",
            sourceNote: "attested lexical item",
            evidenceType: value,
            candidateType: "strong_living_match",
            falseFriendRisk: "low",
            nullCandidate: false,
            notes: "retained as a living lexical candidate",
          },
        ],
      }),
    );

    expect(result.unresolved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "chunkCandidates.0.evidenceType",
          status: "unresolved",
          mappingRuleId: expectedMappingRuleId,
        }),
      ]),
    );
  });

  it("does not invent missing semantic fields or alter unrelated fields", () => {
    const input = buildBrainOutput({
      chunkCandidates: [
        {
          segmentationId: "study.segmentation.004",
          chunk: "DI",
          language: "Latin",
          candidateForm: "di",
          meaning: "know",
          functionFit: "knowledge function",
          evidenceType: " living lexical ",
          candidateType: " weak resonance ",
          falseFriendRisk: " medium ",
          nullCandidate: false,
          notes: "retained as a living lexical candidate",
        },
      ],
      warnings: ["keep"],
    });

    const result = normalizeBrainCandidateEnums(input);
    const normalized = result.normalizedBrainOutput as Record<string, unknown>;
    const candidate = (normalized.chunkCandidates as Record<string, unknown>[])[0];

    expect(Object.prototype.hasOwnProperty.call(candidate, "sourceNote")).toBe(false);
    expect(candidate.chunk).toBe("DI");
    expect(candidate.language).toBe("Latin");
    expect(candidate.meaning).toBe("know");
    expect(normalized.word).toBe("study");
    expect(normalized.segmentationId).toBe("study.segmentation.004");
    expect(normalized.warnings).toEqual(["keep"]);
    expect(normalized.claimBoundary).toEqual({
      originClaim: false,
      scientificEvidence: false,
      publicationEvidence: false,
      developmentCandidateSearchOnly: true,
    });
  });

  it("keeps unresolved enum failures failure-compatible with the validator", () => {
    const normalized = normalizeBrainCandidateEnums(
      buildBrainOutput({
        chunkCandidates: [
          {
            segmentationId: "study.segmentation.004",
            chunk: "DI",
            language: "Latin",
            candidateForm: "di",
            meaning: "know",
            functionFit: "knowledge function",
            sourceNote: "attested lexical item",
            evidenceType: "living_lexical",
            candidateType: "mystery_enum",
            falseFriendRisk: "low",
            nullCandidate: false,
            notes: "retained as a living lexical candidate",
          },
        ],
      }),
    );

    const validation = validateBrainCandidateSearchOutput({
      heartInput: HEART_INPUT,
      brainOutput: normalized.normalizedBrainOutput,
    });

    expect(validation.ok).toBe(false);
    expect(validation.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_CANDIDATE_TYPE",
          path: "chunkCandidates.0.candidateType",
        }),
      ]),
    );
  });

  it("does not create candidates or invent explanations", () => {
    const input = {
      word: "study",
      segmentationId: "study.segmentation.004",
      chunkCandidates: [],
      nullCandidates: [],
      warnings: [],
      claimBoundary: {
        originClaim: false,
        scientificEvidence: false,
        publicationEvidence: false,
        developmentCandidateSearchOnly: true,
      },
    };

    const result = normalizeBrainCandidateEnums(input);

    expect(result.normalizedBrainOutput).toEqual(input);
    expect(Array.isArray((result.normalizedBrainOutput as Record<string, unknown>).chunkCandidates)).toBe(true);
    expect(Array.isArray((result.normalizedBrainOutput as Record<string, unknown>).nullCandidates)).toBe(true);
    expect(result.audit).toEqual([]);
    expect(result.unresolved).toEqual([]);
  });
});

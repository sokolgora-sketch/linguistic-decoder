import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createHash } from "node:crypto";

import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  type CmuDictCandidatePronunciationEvidenceVariantV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import {
  buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1,
  type CmuDictSharedSourcePronunciationInstanceV0_1,
} from "@/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1";
import {
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1,
  buildCmuDictProductionSpokenBridgePrerequisitesV0_1,
} from "@/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1";
import {
  ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1,
  normalizeEnglishLexicalJoinKeyV0_1,
} from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import {
  CMUDICT_PATH_B_CANDIDATE_NORMALIZATION_IDENTITY_V0_1,
  CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1,
  serializeCmuDictPathBNormalizationConformanceEvidenceV0_1,
  validateCmuDictPathBDownstreamNormalizationConformanceV0_1,
  type CmuDictPathBNormalizationConformanceInputV0_1,
} from "@/shared/openInstrument/cmudictPathBDownstreamNormalizationConformanceValidator.v0_1";

const DATASET_PATH = join(
  process.cwd(),
  "src/data/openInstrument/pronunciation/cmudict.dict",
);

function candidateVariant(
  sourceForm: string,
): CmuDictCandidatePronunciationEvidenceVariantV0_1 {
  const evidence = adaptCmuDictCandidateSourceEvidenceV0_1({
    candidateId: "candidate-stone",
    sourceId: "cmudict",
    sourceFamilyId: "cmudict-arpabet-en-us",
    sourceRecordId: sourceForm,
    sourceForm: sourceForm.replace(/\(\d+\)$/u, ""),
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(
      sourceForm.replace(/\(\d+\)$/u, ""),
    ),
    language: "English",
    sourceProvenance: { source: "frozen-cmudict-test-evidence" },
  });
  const variant = evidence.variants.find(
    (candidate) => candidate.sourceForm === sourceForm,
  );
  if (variant === undefined) throw new Error(`missing test variant: ${sourceForm}`);
  return variant;
}

function sharedVariant(
  sourceForm: string,
): CmuDictSharedSourcePronunciationInstanceV0_1 {
  const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
    candidateVariant(sourceForm),
  );
  if (result.status !== "authorized") throw new Error(result.reasonCode);
  return result.instance;
}

function conformanceInput(
  sourceForm = "stone",
): CmuDictPathBNormalizationConformanceInputV0_1 {
  const sharedSourceInstance = sharedVariant(sourceForm);
  const baseSourceForm = sharedSourceInstance.baseSourceForm;
  return {
    sharedSourceInstance,
    candidateNormalization: {
      role: "CANDIDATE",
      normalizerIdentity: CMUDICT_PATH_B_CANDIDATE_NORMALIZATION_IDENTITY_V0_1,
      sourceContractId: ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1,
      sourceContractVersion:
        ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1,
      normalizedOutput: normalizeEnglishLexicalJoinKeyV0_1(baseSourceForm),
    },
    productionNormalization: {
      role: "PRODUCTION",
      normalizerIdentity:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
      producerSchemaVersion:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1,
      producerProjectorId:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
      normalizedOutput: baseSourceForm.normalize("NFC").trim().toLowerCase(),
    },
  };
}

function cloneInput(
  input: CmuDictPathBNormalizationConformanceInputV0_1,
): CmuDictPathBNormalizationConformanceInputV0_1 {
  return JSON.parse(JSON.stringify(input)) as CmuDictPathBNormalizationConformanceInputV0_1;
}

describe("CMUdict Path B downstream normalization conformance validator v0.1", () => {
  it("returns bounded evidence for a real unannotated physical record", () => {
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(
      conformanceInput("stone"),
    );
    expect(result.status).toBe(
      CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1,
    );
    if (result.status === CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1) {
      expect(result.reasonCode).toBeNull();
      expect(result.evidenceOnly).toBe(true);
      expect(result.sourceEvidence.sourceLineNumber).toBe(116395);
      expect(result.sourceEvidence.physicalRecordId).toContain("line=116395");
      expect(result.normalization.exactOutputEquality).toBe(true);
      expect(result.authorityBoundary).toBe(
        "EVIDENCE_ONLY_NO_CANONICAL_GATE2_AUTHORITY",
      );
      expect(JSON.stringify(result)).not.toContain("SAME_REPRESENTATION");
      expect(JSON.stringify(result)).not.toContain("VOICE_RELATIONSHIP");
    }
  });

  it("retains physical numeric variants without collapsing them", () => {
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(
      conformanceInput("read(2)"),
    );
    expect(result.status).toBe(
      CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1,
    );
    if (result.status === CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1) {
      expect(result.sourceEvidence.sourceForm).toBe("read(2)");
      expect(result.sourceEvidence.baseSourceForm).toBe("read");
      expect(result.sourceEvidence.variantId).toBe("2");
      expect(result.sourceEvidence.variantOrder).toBeGreaterThan(0);
    }
  });

  it("retains annotated evidence while preserving ineligibility", () => {
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(
      conformanceInput("aalborg"),
    );
    expect(result.status).toBe(
      CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1,
    );
    if (result.status === CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1) {
      expect(result.sourceEvidence.opaqueAnnotationText).toBe("place, danish");
      expect(result.sourceEvidence.annotationEligibility).toBe("INELIGIBLE");
    }
  });

  it("is deterministic across repeated execution and serialization", () => {
    const input = conformanceInput("stone");
    const first = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(input);
    const second = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(
      cloneInput(input),
    );
    expect(first).toEqual(second);
    if (
      first.status === CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1 &&
      second.status === CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1
    ) {
      expect(serializeCmuDictPathBNormalizationConformanceEvidenceV0_1(first)).toBe(
        serializeCmuDictPathBNormalizationConformanceEvidenceV0_1(second),
      );
      expect(first.deterministicReproducibility.inputFingerprint).toMatch(/^[0-9a-f]{64}$/u);
      expect(first.deterministicReproducibility.outputFingerprint).toMatch(/^[0-9a-f]{64}$/u);
      expect(
        createHash("sha256")
          .update(serializeCmuDictPathBNormalizationConformanceEvidenceV0_1(first), "utf8")
          .digest("hex"),
      ).toBe(first.deterministicReproducibility.outputFingerprint);
      expect(first.deterministicReproducibility).toEqual(
        second.deterministicReproducibility,
      );
    }
  });

  it.each([
    ["wrong source SHA", (input: CmuDictPathBNormalizationConformanceInputV0_1) => {
      input.sharedSourceInstance.sourceArtifactSha256 = "0".repeat(64);
    }],
    ["wrong source byte count", (input: CmuDictPathBNormalizationConformanceInputV0_1) => {
      input.sharedSourceInstance.sourceArtifactBytes = 1;
    }],
    ["tampered raw line", (input: CmuDictPathBNormalizationConformanceInputV0_1) => {
      input.sharedSourceInstance.rawSourceLine = "stone S T OW1 N TAMPERED";
    }],
    ["forged physical record", (input: CmuDictPathBNormalizationConformanceInputV0_1) => {
      input.sharedSourceInstance.physicalRecordId = "forged";
    }],
  ])("fails closed for %s", (_label, mutate) => {
    const input = cloneInput(conformanceInput("stone"));
    mutate(input);
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(input);
    expect(result).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH",
      evidence: null,
    });
  });

  it.each([
    ["leading ASCII whitespace", " stone"],
    ["trailing ASCII whitespace", "stone "],
    ["non-breaking whitespace", "\u00a0stone"],
    ["non-ASCII source form", "stoné"],
    ["empty source form", ""],
  ])("rejects %s as outside the exact source-form domain", (_label, sourceForm) => {
    const input = cloneInput(conformanceInput("stone"));
    input.sharedSourceInstance.sourceForm = sourceForm;
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(input);
    expect(result).toEqual({
      status: "null",
      reasonCode:
        sourceForm === ""
          ? "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID"
          : "CMUDICT_PATH_B_NORMALIZATION_DOMAIN_MISMATCH",
      evidence: null,
    });
  });

  it("rejects invalid base/variant identity and duplicate collapse", () => {
    const input = cloneInput(conformanceInput("read(2)"));
    input.sharedSourceInstance.baseSourceForm = "reed";
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(input),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH",
      evidence: null,
    });

    const collapsed = cloneInput(conformanceInput("read(2)"));
    collapsed.sharedSourceInstance.variantOrder = 0;
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(collapsed),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH",
      evidence: null,
    });
  });

  it.each([
    ["candidate output", "candidateNormalization", "candidate"],
    ["production output", "productionNormalization", "production"],
  ])("rejects a supplied %s mismatch", (_label, role, kind) => {
    const input = cloneInput(conformanceInput("stone"));
    if (kind === "candidate") {
      input.candidateNormalization.normalizedOutput = "wrong";
    } else {
      input.productionNormalization.normalizedOutput = "wrong";
    }
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(input);
    expect(result.status).toBe("null");
    if (result.status === "null") {
      expect(result.reasonCode).toBe(
        kind === "candidate"
          ? "CMUDICT_PATH_B_NORMALIZATION_CANDIDATE_OUTPUT_MISMATCH"
          : "CMUDICT_PATH_B_NORMALIZATION_PRODUCTION_OUTPUT_MISMATCH",
      );
    }
    expect(role).toMatch(/Normalization/u);
  });

  it("rejects missing role identity, provenance, fingerprints, tags, and unknown fields", () => {
    const missingRole = cloneInput(conformanceInput("stone"));
    missingRole.candidateNormalization.normalizerIdentity = "wrong";
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(missingRole),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_ROLE_IDENTITY_MISSING",
      evidence: null,
    });

    const provenance = cloneInput(conformanceInput("stone"));
    provenance.sharedSourceInstance.sourceProvenanceRefs = [];
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(provenance),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_PROVENANCE_INCOMPLETE",
      evidence: null,
    });

    const fingerprint = cloneInput(conformanceInput("stone"));
    fingerprint.sharedSourceInstance.deterministicReproducibility.outputFingerprint =
      "0".repeat(64);
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(fingerprint),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_PROVENANCE_INCOMPLETE",
      evidence: null,
    });

    const authority = cloneInput(conformanceInput("stone"));
    authority.sharedSourceInstance.alignmentAuthorityTag = "wrong";
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(authority),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_AUTHORITY_NOT_APPROVED",
      evidence: null,
    });

    const unknown = {
      ...conformanceInput("stone"),
      unexpected: true,
    };
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(unknown),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID",
      evidence: null,
    });
  });

  it("does not treat arbitrary equal-output strings as physical evidence", () => {
    const input = cloneInput(conformanceInput("stone"));
    input.sharedSourceInstance.sourceForm = "STONE";
    input.sharedSourceInstance.baseSourceForm = "STONE";
    input.sharedSourceInstance.variantId = "1";
    input.sharedSourceInstance.rawSourceLine = "STONE S T OW1 N";
    const result = validateCmuDictPathBDownstreamNormalizationConformanceV0_1(input);
    expect(result).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH",
      evidence: null,
    });
  });

  it("rejects non-string and invalid input without escaping an exception", () => {
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1(null),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID",
      evidence: null,
    });
    expect(
      validateCmuDictPathBDownstreamNormalizationConformanceV0_1({
        sharedSourceInstance: "stone",
        candidateNormalization: null,
        productionNormalization: null,
      }),
    ).toEqual({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID",
      evidence: null,
    });
  });

  it("uses the real production prerequisite record as compatible Level A evidence", () => {
    const production = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    expect(production.status).toBe("defined");
    expect(production.variants[0]?.physicalEvidence.sourceLineNumber).toBe(116395);
    const raw = readFileSync(DATASET_PATH, "utf8");
    expect(raw.split(/\r?\n/u)[116394]).toBe("stone S T OW1 N");
  });
});

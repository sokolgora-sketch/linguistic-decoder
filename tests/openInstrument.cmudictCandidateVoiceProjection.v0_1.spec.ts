import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  type CmuDictCandidateAdapterInputV0_1,
  type CmuDictCandidatePronunciationEvidenceV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import {
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  projectCmuDictCandidateVoiceProjectionV0_1,
  type CmuDictCandidateVoiceProjectionV0_1,
} from "@/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1";

function candidate(
  sourceForm = "stone",
  overrides: Partial<CmuDictCandidateAdapterInputV0_1> = {},
): CmuDictCandidateAdapterInputV0_1 {
  return {
    candidateId: `candidate.${sourceForm}.v0_1`,
    sourceId: `english-kaikki-record.${sourceForm}.v0_1`,
    sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
    sourceForm,
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(sourceForm),
    language: "English",
    senseId: `sense.${sourceForm}.v0_1`,
    gloss: "fixture gloss; not used for Voice projection",
    sourceProvenance: {
      entryLocator: `fixture://english/${sourceForm}`,
      sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
    ...overrides,
  };
}

function evidence(sourceForm = "stone"): CmuDictCandidatePronunciationEvidenceV0_1 {
  return adaptCmuDictCandidateSourceEvidenceV0_1(candidate(sourceForm));
}

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mutateEvidence(
  sourceForm: string,
  mutate: (value: CmuDictCandidatePronunciationEvidenceV0_1) => void,
): CmuDictCandidatePronunciationEvidenceV0_1 {
  const value = copy(evidence(sourceForm));
  mutate(value);
  return value;
}

function firstVariant(value: CmuDictCandidatePronunciationEvidenceV0_1) {
  if (!value.variants[0]) throw new Error("fixture has no source variant");
  return value.variants[0];
}

describe("CMUdict candidate Voice projection v0.1", () => {
  it("accepts defined candidate source evidence", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence());
    expect(result.status).toBe("defined");
    expect(result.reasonCode).toBeNull();
    expect(result.variants.length).toBeGreaterThan(0);
  });

  it("uses the exact mapping identity and table", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence());
    expect(result.mappingId).toBe(
      "pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1",
    );
    expect(result.mappingId).toBe(CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1);
    expect(result.mappingTable).toBe("CMUDICT_ARPABET_VOICE_PROFILE_V0_1");
  });

  it("emits the ratified runtime authority tag and never the assessment tag", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence());
    expect(result.authorityTag).toBe(
      CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    );
    expect(JSON.stringify(result)).not.toContain("ASSESSMENT_ONLY_PENDING_DF_RATIFICATION");
  });

  it("preserves every defined source variant in physical source order", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("read"));
    expect(result.variants.map((variant) => variant.sourceEvidence.variantOrder)).toEqual([0, 1]);
    expect(result.variants.map((variant) => variant.sourceEvidence.sourceLineNumber)).toEqual(
      [...result.variants]
        .map((variant) => variant.sourceEvidence.sourceLineNumber)
        .sort((a, b) => a - b),
    );
  });

  it("preserves duplicate physical records and identical paths as distinct records", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("mormonism"));
    expect(result.variants).toHaveLength(2);
    expect(result.variants[0].sourceEvidence.variantId).not.toBe(
      result.variants[1].sourceEvidence.variantId,
    );
    expect(result.variants[0].canonicalVoicePath).toEqual(
      result.variants[1].canonicalVoicePath,
    );
  });

  it("requires each cited line to match the frozen CMUdict artifact", () => {
    const tampered = mutateEvidence("stone", (current) => {
      current.variants[0].rawSourceLine = "stone S T OW1 N E";
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(tampered).reasonCode).toBe(
      "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    );
  });

  it("requires each source variant to match the candidate join key", () => {
    const tampered = mutateEvidence("stone", (current) => {
      current.variants = [copy(firstVariant(evidence("read")))] as typeof current.variants;
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(tampered).reasonCode).toBe(
      "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    );
  });

  it("rejects reordered or duplicated physical variant ordering", () => {
    const tampered = mutateEvidence("read", (current) => {
      current.variants = [...current.variants].reverse();
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(tampered).reasonCode).toBe(
      "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    );
  });

  it("rejects a ledger that omits a physical source variant", () => {
    const tampered = mutateEvidence("read", (current) => {
      current.variants = [current.variants[0]] as typeof current.variants;
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(tampered).reasonCode).toBe(
      "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    );
  });

  it("keeps different Voice paths as separate records without an aggregate", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("read"));
    expect(result.variants.length).toBeGreaterThan(1);
    expect(result).not.toHaveProperty("canonicalVoicePath");
    expect(result.variants.map((variant) => variant.canonicalVoicePath)).toEqual(
      expect.arrayContaining([["E"], ["I"]]),
    );
  });

  it("rejects pronunciation-token divergence from preserved source evidence", () => {
    const tampered = mutateEvidence("stone", (current) => {
      current.variants[0].orderedRawArpabetTokens = ["AA1"];
      current.variants[0].losslessBaseStressViews = [
        { rawToken: "AA1", baseToken: "AA", stress: "1" },
      ];
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(tampered).reasonCode).toBe(
      "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    );
  });

  it("does not import candidate-level variant ambiguity", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("read"));
    expect(result.reasonCode).toBeNull();
    expect(result.variants.every((variant) => variant.reasonCode !== "PRONUNCIATION_VARIANT_AMBIGUOUS")).toBe(
      true,
    );
  });

  it("preserves candidate and source provenance", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("aalborg"));
    expect(result.candidateSourceFamilyId).toBe(
      "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    );
    expect(result.variants[0].sourceEvidence.rawSourceLine).toContain("aalborg");
    expect(result.variants[0].sourceEvidence.sourceLineNumber).toBeGreaterThan(0);
    expect(result.variants[0].sourceEvidence.orderedRawArpabetTokens).toContain("AO1");
  });

  it("preserves stress without changing Voice identity", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("abstract"));
    expect(result.variants[0].sourceEvidence.losslessBaseStressViews).not.toEqual(
      result.variants[1].sourceEvidence.losslessBaseStressViews,
    );
    expect(result.variants[0].canonicalVoicePath).toEqual(
      result.variants[1].canonicalVoicePath,
    );
  });

  it("preserves moving-nucleus two-event behavior without an inter-region", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence("stone"));
    const moving = result.variants[0];
    expect(moving.canonicalVoicePath).toEqual(["O", "U"]);
    expect(moving.nuclei[0].kind).toBe("moving_nucleus");
    expect(moving.nuclei[0].canonicalization?.canonicalEventCount).toBe(2);
  });

  it("rejects unauthorized source evidence", () => {
    const value = mutateEvidence("stone", (current) => {
      current.variants[0].authorityStatus = "UNAUTHORIZED" as never;
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(value);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED");
  });

  it("rejects source identity mismatch", () => {
    const value = mutateEvidence("stone", (current) => {
      current.variants[0].sourceProfileId = "wrong-profile" as never;
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(value).reasonCode).toBe(
      "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED",
    );
  });

  it("rejects artifact and revision identity mismatch", () => {
    const artifactMismatch = mutateEvidence("stone", (current) => {
      current.variants[0].sourceArtifactSha256 = "wrong-hash" as never;
    });
    const revisionMismatch = mutateEvidence("stone", (current) => {
      current.variants[0].sourceRevision = "wrong-revision" as never;
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(artifactMismatch).reasonCode).toBe(
      "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    );
    expect(projectCmuDictCandidateVoiceProjectionV0_1(revisionMismatch).reasonCode).toBe(
      "CMUDICT_SOURCE_REVISION_MISMATCH",
    );
  });

  it("rejects mapping identity tampering by keeping the output fixed and frozen", () => {
    const result = projectCmuDictCandidateVoiceProjectionV0_1(evidence());
    expect(Object.isFrozen(result)).toBe(true);
    expect(() => {
      (result as { mappingId: string }).mappingId = "wrong-mapping";
    }).toThrow();
    expect(result.mappingId).toBe(CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1);
  });

  it("propagates source Null distinctly from projection Null", () => {
    const sourceNull = mutateEvidence("stone", (current) => {
      current.status = "null";
      current.reasonCode = "CMUDICT_SOURCE_ARTIFACT_MISMATCH";
      current.variants = [];
    });
    const sourceResult = projectCmuDictCandidateVoiceProjectionV0_1(sourceNull);
    expect(sourceResult.status).toBe("null");
    expect(sourceResult.sourceEvidenceReasonCode).toBe("CMUDICT_SOURCE_ARTIFACT_MISMATCH");
    expect(sourceResult.reasonCode).toBe("CMUDICT_SOURCE_ARTIFACT_MISMATCH");

  });

  it("rejects an inconsistent source Null status/reason pair", () => {
    const inconsistent = mutateEvidence("stone", (current) => {
      current.status = "null";
      current.reasonCode = null;
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(inconsistent);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION");
  });

  it("rejects an unknown source status before projection", () => {
    const unknownStatus = mutateEvidence("stone", (current) => {
      current.status = "bogus" as never;
      current.reasonCode = null;
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(unknownStatus);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION");
  });

  it("rejects an unknown source reason before projection", () => {
    const unknownReason = mutateEvidence("stone", (current) => {
      current.status = "null";
      current.reasonCode = "BOGUS_SOURCE_REASON" as never;
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(unknownReason);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION");
  });

  it("rejects Null evidence that still carries source variants", () => {
    const contradictory = mutateEvidence("stone", (current) => {
      current.status = "null";
      current.reasonCode = "CMUDICT_SOURCE_ARTIFACT_MISMATCH";
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(contradictory);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION");
  });

  it("fails closed for malformed candidate envelope field types", () => {
    const malformed = mutateEvidence("stone", (current) => {
      current.candidateId = null as never;
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(malformed);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION");
  });

  it("fails closed for malformed source variant elements", () => {
    const malformed = mutateEvidence("stone", (current) => {
      current.variants = [null] as never;
    });
    const result = projectCmuDictCandidateVoiceProjectionV0_1(malformed);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION");
    expect(result.sourceEvidence.variants).toEqual([]);
  });

  it("accepts an explicitly undefined optional annotation", () => {
    const explicitUndefined = mutateEvidence("stone", (current) => {
      current.variants[0].opaqueAnnotationText = undefined;
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(explicitUndefined).status).toBe(
      "defined",
    );
  });

  it("reports malformed stress and unsupported ARPABET deterministically", () => {
    const malformed = mutateEvidence("stone", (current) => {
      const variant = current.variants[0];
      variant.rawPronunciation = "AA3";
      variant.rawSourceLine = `${variant.sourceForm} AA3`;
      variant.orderedRawArpabetTokens = ["AA3"];
      variant.losslessBaseStressViews = [{ rawToken: "AA3", baseToken: "AA", stress: "3" as never }];
    });
    const unsupported = mutateEvidence("stone", (current) => {
      const variant = current.variants[0];
      variant.rawPronunciation = "AX1";
      variant.rawSourceLine = `${variant.sourceForm} AX1`;
      variant.orderedRawArpabetTokens = ["AX1"];
      variant.losslessBaseStressViews = [{ rawToken: "AX1", baseToken: "AX", stress: "1" }];
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(malformed).reasonCode).toBe(
      "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    );
    expect(projectCmuDictCandidateVoiceProjectionV0_1(unsupported).reasonCode).toBe(
      "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    );
  });

  it("rejects unknown bases and stressed consonants using source-adapter authority", () => {
    const unknownBase = mutateEvidence("stone", (current) => {
      const variant = current.variants[0];
      variant.rawPronunciation = "ZZZ";
      variant.rawSourceLine = `${variant.sourceForm} ZZZ`;
      variant.orderedRawArpabetTokens = ["ZZZ"];
      variant.losslessBaseStressViews = [{ rawToken: "ZZZ", baseToken: "ZZZ", stress: null }];
    });
    const stressedConsonant = mutateEvidence("stone", (current) => {
      const variant = current.variants[0];
      variant.rawPronunciation = "S1";
      variant.rawSourceLine = `${variant.sourceForm} S1`;
      variant.orderedRawArpabetTokens = ["S1"];
      variant.losslessBaseStressViews = [{ rawToken: "S1", baseToken: "S", stress: "1" }];
    });
    expect(projectCmuDictCandidateVoiceProjectionV0_1(unknownBase).reasonCode).toBe(
      "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    );
    expect(projectCmuDictCandidateVoiceProjectionV0_1(stressedConsonant).reasonCode).toBe(
      "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    );
  });

  it("deep-freezes the complete result and is deterministic", () => {
    const first = projectCmuDictCandidateVoiceProjectionV0_1(evidence());
    const second = projectCmuDictCandidateVoiceProjectionV0_1(evidence());
    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.variants)).toBe(true);
    expect(Object.isFrozen(first.variants[0])).toBe(true);
    expect(Object.isFrozen(first.variants[0].sourceEvidence)).toBe(true);
    expect(Object.isFrozen(first.variants[0].normalizedSegments)).toBe(true);
  });

  it("contains no semantic, Gamma, ZC, bridge, or winner authority fields", () => {
    const serialized = JSON.stringify(projectCmuDictCandidateVoiceProjectionV0_1(evidence()));
    for (const forbidden of [
      "gamma",
      "Gamma",
      "zc",
      "ZC",
      "SAME_REPRESENTATION",
      "representationBridge",
      "winner",
      "semanticInterpretation",
      "senseSelector",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("does not perform input-role lookup or trimming", () => {
    const value = evidence("stone");
    const result = projectCmuDictCandidateVoiceProjectionV0_1(value);
    expect(result.candidateJoinKey).toBe("stone");
    expect(result.variants[0].sourceEvidence.sourceForm).toBe("stone");
  });
});

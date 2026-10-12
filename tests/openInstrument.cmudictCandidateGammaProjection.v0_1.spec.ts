import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";
import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  type CmuDictCandidateAdapterInputV0_1,
  type CmuDictCandidatePronunciationEvidenceV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import {
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1,
  projectCmuDictCandidateGammaProjectionV0_1,
} from "@/shared/openInstrument/cmudictCandidateGammaProjection.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import {
  CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  projectCmuDictCandidateVoiceProjectionV0_1,
  type CmuDictCandidateVoiceProjectionV0_1,
} from "@/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1";

function candidate(sourceForm = "stone"): CmuDictCandidateAdapterInputV0_1 {
  return {
    candidateId: `candidate.${sourceForm}.v0_1`,
    sourceId: `english-kaikki-record.${sourceForm}.v0_1`,
    sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
    sourceForm,
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(sourceForm),
    language: "English",
    senseId: `sense.${sourceForm}.v0_1`,
    gloss: "fixture gloss; not used by Gamma",
    sourceProvenance: {
      entryLocator: `fixture://english/${sourceForm}`,
      sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
  };
}

function evidence(sourceForm = "stone") {
  return adaptCmuDictCandidateSourceEvidenceV0_1(candidate(sourceForm));
}

function voice(sourceForm = "stone"): CmuDictCandidateVoiceProjectionV0_1 {
  return projectCmuDictCandidateVoiceProjectionV0_1(evidence(sourceForm));
}

function gamma(sourceForm = "stone") {
  return projectCmuDictCandidateGammaProjectionV0_1(voice(sourceForm));
}

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function keysDeep(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const child of value) keysDeep(child, keys);
    return keys;
  }
  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      keys.push(key);
      keysDeep(child, keys);
    }
  }
  return keys;
}

describe("CMUdict candidate Gamma projection v0.1", () => {
  it("uses the exact projector identity", () => {
    expect(gamma().projectorId).toBe(
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
    );
  });

  it("uses the exact ratified runtime authority tag", () => {
    expect(gamma().runtimeAuthorityTag).toBe(
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    );
  });

  it("uses the frozen schema version", () => {
    expect(gamma().schemaVersion).toBe(CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1);
  });

  it("projects one authoritative defined source variant", () => {
    const result = gamma();
    expect(result.status).toBe("defined");
    expect(result.reasonCode).toBeNull();
    expect(result.variants).toHaveLength(1);
    expect(result.variants[0].status).toBe("defined");
  });

  it("preserves exact consonant identity", () => {
    expect(gamma().variants[0].consonantRegions.flatMap((region) => region.sourceUnits)).toEqual([
      "S",
      "T",
      "N",
    ]);
  });

  it("preserves consonant source order", () => {
    const result = gamma();
    expect(result.variants[0].consonantRegions.map((region) => region.sourceSegmentIndices)).toEqual([
      [0, 1],
      [3],
    ]);
  });

  it("preserves repeated consonants", () => {
    const result = gamma("mormonism");
    const consonants = result.variants[0].consonantRegions.flatMap((region) => region.sourceUnits);
    expect(consonants.filter((unit) => unit === "M").length).toBeGreaterThanOrEqual(2);
  });

  it("preserves source segment indices", () => {
    const result = gamma();
    expect(result.variants[0].consonantRegions.flatMap((region) => region.sourceSegmentIndices)).toEqual([
      0,
      1,
      3,
    ]);
  });

  it("preserves source nuclei", () => {
    const result = gamma();
    expect(result.variants[0].nuclei).toEqual(voice().variants[0].nuclei);
  });

  it("emits a prefix region", () => {
    expect(gamma().variants[0].consonantRegions[0]).toMatchObject({
      regionKind: "SOURCE_PREFIX_REGION",
      beforeNucleusIndex: null,
      afterNucleusIndex: 0,
    });
  });

  it("emits an inter-nucleus region", () => {
    const result = gamma("abstract");
    expect(result.variants[0].consonantRegions.some(
      (region) => region.regionKind === "SOURCE_INTER_NUCLEUS_REGION",
    )).toBe(true);
  });

  it("emits a suffix region", () => {
    expect(gamma().variants[0].consonantRegions.at(-1)).toMatchObject({
      regionKind: "SOURCE_SUFFIX_REGION",
      beforeNucleusIndex: 0,
      afterNucleusIndex: null,
    });
  });

  it("emits multiple inter-nucleus regions when the source has multiple nuclei", () => {
    const result = gamma("abstract");
    expect(result.variants[0].consonantRegions.filter(
      (region) => region.regionKind === "SOURCE_INTER_NUCLEUS_REGION",
    ).length).toBeGreaterThan(0);
  });

  it("keeps a moving nucleus as one source nucleus", () => {
    const result = gamma();
    expect(result.variants[0].nuclei).toHaveLength(1);
    expect(result.variants[0].nuclei[0].kind).toBe("moving_nucleus");
  });

  it("does not create an artificial moving-nucleus inter-region", () => {
    const result = gamma();
    expect(result.variants[0].consonantRegions.filter(
      (region) => region.regionKind === "SOURCE_INTER_NUCLEUS_REGION",
    )).toHaveLength(0);
  });

  it("retains stress provenance", () => {
    const result = gamma("abstract");
    expect(result.variants[0].sourceEvidence.losslessBaseStressViews.length).toBeGreaterThan(0);
  });

  it("does not change Gamma identity for stress-bearing variants", () => {
    const result = gamma("abstract");
    expect(result.variants[0].consonantRegions).toEqual(result.variants[1].consonantRegions);
  });

  it("retains N source variants independently", () => {
    const result = gamma("read");
    expect(result.variants).toHaveLength(2);
  });

  it("preserves source variant order", () => {
    expect(gamma("read").variants.map((variant) => variant.variantOrder)).toEqual([0, 1]);
  });

  it("preserves physical locators", () => {
    const result = gamma();
    expect(result.variants[0].sourceLineNumber).toBeGreaterThan(0);
    expect(result.variants[0].rawSourceLine).toContain("stone");
  });

  it("preserves duplicate physical records independently", () => {
    const result = gamma("mormonism");
    expect(result.variants).toHaveLength(2);
    expect(result.variants[0].sourceLineNumber).not.toBe(result.variants[1].sourceLineNumber);
  });

  it("does not collapse identical Gamma outputs", () => {
    const result = gamma("mormonism");
    expect(result.variants[0].consonantRegions).toEqual(result.variants[1].consonantRegions);
    expect(result.variants).toHaveLength(2);
  });

  it("does not expose a candidate aggregate", () => {
    expect(gamma()).not.toHaveProperty("aggregate");
  });

  it("does not select a winner", () => {
    expect(gamma()).not.toHaveProperty("winner");
  });

  it("propagates source Null exactly", () => {
    const result = gamma("word-that-is-not-in-cmudict");
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
    expect(result.variants).toEqual([]);
  });

  it("propagates a per-variant Voice Null exactly", () => {
    const value = copy(voice("stone"));
    value.variants[0].status = "null";
    value.variants[0].reasonCode = "CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED";
    value.variants[0].normalizedSegments = [];
    value.variants[0].nuclei = [];
    value.variants[0].canonicalVoicePath = null;
    value.status = "null";
    value.reasonCode = "CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED";
    const result = projectCmuDictCandidateGammaProjectionV0_1(value);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED");
    expect(result.variants).toHaveLength(1);
    expect(result.variants[0].reasonCode).toBe(
      "CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED",
    );
  });

  it("fails closed for malformed null input", () => {
    const result = projectCmuDictCandidateGammaProjectionV0_1({ status: "null" });
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION");
  });

  it("fails closed for malformed defined input", () => {
    const result = projectCmuDictCandidateGammaProjectionV0_1({ status: "defined" });
    expect(result.status).toBe("null");
  });

  it("fails closed for primitive input", () => {
    expect(projectCmuDictCandidateGammaProjectionV0_1("stone").status).toBe("null");
  });

  it("fails closed for array input", () => {
    expect(projectCmuDictCandidateGammaProjectionV0_1([]).status).toBe("null");
  });

  it("fails closed for candidate/source identity mismatch", () => {
    const value = copy(voice());
    value.candidateSourceFamilyId = "wrong-family";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).reasonCode).toBe(
      "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION",
    );
  });

  it("fails closed for profile mismatch", () => {
    const value = copy(voice());
    value.variants[0].sourceEvidence.sourceProfileId = "wrong-profile";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for notation mismatch", () => {
    const value = copy(voice());
    value.variants[0].sourceEvidence.sourceNotation = "wrong-notation";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for revision mismatch", () => {
    const value = copy(voice());
    value.variants[0].sourceEvidence.sourceRevision = "wrong-revision";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for artifact mismatch", () => {
    const value = copy(voice());
    value.variants[0].sourceEvidence.sourceArtifactSha256 = "wrong-hash";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for variant identity mismatch", () => {
    const value = copy(voice());
    value.variants[0].sourceEvidence.variantId = "wrong-variant";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for variant order mismatch", () => {
    const value = copy(voice("read"));
    value.variants[1].sourceEvidence.variantOrder = 0;
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for pronunciation structure mismatch", () => {
    const value = copy(voice());
    value.variants[0].normalizedSegments[0].sourceUnits = ["X"];
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("fails closed for unauthorized Voice state", () => {
    const value = copy(voice());
    value.authorityTag = "UNAUTHORIZED";
    expect(projectCmuDictCandidateGammaProjectionV0_1(value).status).toBe("null");
  });

  it("accepts a valid zero-consonant pronunciation", () => {
    const result = gamma("a");
    expect(result.status).toBe("defined");
    expect(result.variants[0].consonantRegions.flatMap((region) => region.sourceUnits)).toEqual([]);
  });

  it("does not classify zero-consonant Gamma as Null", () => {
    expect(gamma("a").variants[0].status).toBe("defined");
  });

  it("preserves source provenance", () => {
    const result = gamma();
    expect(result.candidateSourceFamilyId).toBe(
      "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    );
    expect(result.variants[0].sourceEvidence.authorityStatus).toBe(
      "RATIFIED_SOURCE_EVIDENCE_ONLY",
    );
  });

  it("preserves source and Voice binding", () => {
    const result = gamma();
    expect(result.variants[0].sourceEvidence.variantId).toBe(
      voice().variants[0].sourceEvidence.variantId,
    );
  });

  it("uses the exact frozen source identity", () => {
    const result = gamma();
    expect(result.variants[0].sourceProfileId).toBe(CMUDICT_SOURCE_PROFILE_ID_V0_1);
    expect(result.variants[0].sourceNotation).toBe(CMUDICT_SOURCE_NOTATION_V0_1);
    expect(result.variants[0].sourceRevision).toBe(CMUDICT_SOURCE_REVISION_V0_1);
    expect(result.variants[0].sourceArtifactBytes).toBe(CMUDICT_DATA_BYTES_V0_1);
    expect(result.variants[0].sourceArtifactSha256).toBe(CMUDICT_DATA_SHA256_V0_1);
  });

  it("contains no ZC fields", () => {
    const keys = keysDeep(gamma());
    for (const forbidden of ["P", "I", "S", "D", "A", "R"]) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("contains no semantic fields", () => {
    const keys = keysDeep(gamma());
    expect(keys).not.toContain("semantic");
    expect(keys).not.toContain("semanticMeaning");
    expect(keys).not.toContain("meaning");
  });

  it("contains no representation bridge or SAME_REPRESENTATION fields", () => {
    const keys = keysDeep(gamma());
    expect(keys).not.toContain("representationBridge");
    expect(keys).not.toContain("SAME_REPRESENTATION");
  });

  it("does not import the existing spokenGamma helper", () => {
    expect(JSON.stringify(gamma())).not.toContain("spokenGamma");
  });

  it("does not import profileDerivedGamma", () => {
    expect(JSON.stringify(gamma())).not.toContain("profileDerivedGamma");
  });

  it("does not import gammaForHeartV0_2", () => {
    expect(JSON.stringify(gamma())).not.toContain("gammaForHeartV0_2");
  });

  it("does not perform lexical lookup or spelling fallback", () => {
    const result = gamma();
    expect(result.candidateJoinKey).toBe("stone");
    expect(result.variants[0].sourceEvidence.sourceForm).toBe("stone");
    expect(result.variants[0].sourceEvidence.baseSourceForm).toBe("stone");
  });

  it("does not reparse raw CMUdict in the Gamma output", () => {
    expect(gamma().variants[0].sourceEvidence.rawPronunciation).toBe("S T OW1 N");
  });

  it("is deterministic across repeated calls", () => {
    expect(gamma()).toEqual(gamma());
  });

  it("deep-freezes the complete projection", () => {
    const result = gamma();
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.variants)).toBe(true);
    expect(Object.isFrozen(result.variants[0])).toBe(true);
    expect(Object.isFrozen(result.variants[0].sourceEvidence)).toBe(true);
    expect(Object.isFrozen(result.variants[0].consonantRegions)).toBe(true);
  });

  it("retains the candidate Voice authority boundary", () => {
    expect(voice().authorityTag).toBe(
      CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    );
  });

  it("does not expose Discovery, API, or UI wiring", () => {
    const keys = keysDeep(gamma());
    for (const forbidden of ["discovery", "api", "ui", "route"]) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("does not manufacture a semantic or representation claim from Gamma", () => {
    expect(gamma().configurationAuthority).toBe(
      "OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1",
    );
    expect(gamma()).not.toHaveProperty("sameRepresentation");
  });

  it("does not mutate the source Voice input", () => {
    const input = voice();
    const before = JSON.stringify(input);
    gammaFromInput(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it("does not add a winner or rank variants", () => {
    const result = gamma("read");
    expect(result.variants.map((variant) => variant.variantOrder)).toEqual([0, 1]);
    expect(result).not.toHaveProperty("rank");
  });
});

function gammaFromInput(input: CmuDictCandidateVoiceProjectionV0_1) {
  return projectCmuDictCandidateGammaProjectionV0_1(input);
}

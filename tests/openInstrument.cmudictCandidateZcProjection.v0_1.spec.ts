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
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import {
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  projectCmuDictCandidateGammaProjectionV0_1,
  type CmuDictCandidateGammaProjectionV0_1,
} from "@/shared/openInstrument/cmudictCandidateGammaProjection.v0_1";
import {
  CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1,
  CMUDICT_CANDIDATE_ZC_PROJECTION_SCHEMA_V0_1,
  CMUDICT_CANDIDATE_ZC_PROJECTION_VARIANT_SCHEMA_V0_1,
  projectCmuDictCandidateZcProjectionV0_1,
} from "@/shared/openInstrument/cmudictCandidateZcProjection.v0_1";
import { ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1 } from "@/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import { projectCmuDictCandidateVoiceProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1";

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
    gloss: "fixture gloss; not used by candidate ZC",
    sourceProvenance: {
      entryLocator: `fixture://english/${sourceForm}`,
      sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
  };
}

function gamma(sourceForm = "stone"): CmuDictCandidateGammaProjectionV0_1 {
  const source = adaptCmuDictCandidateSourceEvidenceV0_1(candidate(sourceForm));
  return projectCmuDictCandidateGammaProjectionV0_1(
    projectCmuDictCandidateVoiceProjectionV0_1(source),
  );
}

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function zcShape(value: ReturnType<typeof projectCmuDictCandidateZcProjectionV0_1>) {
  return value.variants.map((variant) => {
    const zc = variant.zeroConsonantalStructuralComposition;
    return {
      p: zc.p,
      i: zc.i,
      s: zc.s,
      d: zc.d,
      a: zc.a,
      r: zc.r,
    };
  });
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

describe("CMUdict candidate ZC projection v0.1", () => {
  it("uses the exact projector and schema identities", () => {
    const result = projectCmuDictCandidateZcProjectionV0_1(gamma());
    expect(result.projectorId).toBe(CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1);
    expect(result.schemaVersion).toBe(CMUDICT_CANDIDATE_ZC_PROJECTION_SCHEMA_V0_1);
    expect(result.zcSchemaVersion).toBe(
      ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
    );
    expect(result.variants[0].schemaVersion).toBe(
      CMUDICT_CANDIDATE_ZC_PROJECTION_VARIANT_SCHEMA_V0_1,
    );
    expect(result.gammaProjectorId).toBe(
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
    );
    expect(result.gammaRuntimeAuthorityTag).toBe(
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    );
    expect(result).not.toHaveProperty("runtimeAuthorityTag");

    const nullResult = projectCmuDictCandidateZcProjectionV0_1(
      gamma("word-that-is-not-in-cmudict"),
    );
    expect(nullResult.zcSchemaVersion).toBe(
      ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
    );
  });

  it("projects P, I, S, D, A from Gamma regions only", () => {
    const source = gamma("abstract");
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    const variant = source.variants[0];
    const projected = result.variants[0].zeroConsonantalStructuralComposition;
    const prefix = variant.consonantRegions[0];
    const inter = variant.consonantRegions.filter(
      (region) => region.regionKind === "SOURCE_INTER_NUCLEUS_REGION",
    );
    const suffix = variant.consonantRegions.at(-1);
    const p = prefix.sourceSegmentIndices.length;
    const i = inter.map((region) => region.sourceSegmentIndices.length);
    const s = suffix.sourceSegmentIndices.length;
    expect(projected.p).toBe(p);
    expect(projected.i).toEqual(i);
    expect(projected.s).toBe(s);
    expect(projected.d).toEqual([p, ...i, s]);
    expect(projected.a).toBe(p - s);
  });

  it("preserves zero-length I regions and source region order", () => {
    const result = projectCmuDictCandidateZcProjectionV0_1(gamma("stone"));
    expect(result.variants[0].zeroConsonantalStructuralComposition.i).toEqual([]);
    expect(result.variants[0].zeroConsonantalStructuralComposition.d).toEqual([2, 1]);
  });

  it("derives R from exact sourceUnits identities with positions and order", () => {
    const source = gamma("mormonism");
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    const consonants = source.variants[0].normalizedSegments.filter(
      (segment) => segment.kind === "consonant",
    );
    const projected = result.variants[0].zeroConsonantalStructuralComposition;
    expect(projected.r.length).toBeGreaterThan(0);
    for (const recurrence of projected.r) {
      expect(recurrence.segmentIndices).toEqual(
        [...recurrence.segmentIndices].sort((left, right) => left - right),
      );
      expect(recurrence.occurrenceCount).toBe(recurrence.segmentIndices.length);
      expect(recurrence.segmentIndices.every((index) =>
        JSON.stringify(consonants.find((segment) => segment.segmentIndex === index)?.sourceUnits) ===
        JSON.stringify(recurrence.identity),
      )).toBe(true);
    }
    expect(projected.r).toEqual(
      [...projected.r].sort(
        (left, right) => left.segmentIndices[0] - right.segmentIndices[0],
      ),
    );
  });

  it("keeps moving nuclei as one structural nucleus without artificial I", () => {
    const source = gamma("stone");
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    expect(source.variants[0].nuclei).toHaveLength(1);
    expect(source.variants[0].canonicalVoicePath).toHaveLength(2);
    expect(result.variants[0].zeroConsonantalStructuralComposition.i).toHaveLength(0);
  });

  it("keeps a defined zero-consonant Gamma as defined ZC", () => {
    const result = projectCmuDictCandidateZcProjectionV0_1(gamma("a"));
    const projected = result.variants[0].zeroConsonantalStructuralComposition;
    expect(result.status).toBe("defined");
    expect(result.reasonCode).toBeNull();
    expect(projected.p).toBe(0);
    expect(projected.i.every((value) => value === 0)).toBe(true);
    expect(projected.s).toBe(0);
    expect(projected.d).toEqual([0, ...projected.i, 0]);
    expect(projected.a).toBe(0);
    expect(projected.r).toEqual([]);
  });

  it("keeps one independent ZC record per Gamma variant", () => {
    const source = gamma("read");
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    expect(result.variants).toHaveLength(source.variants.length);
    expect(result.variants.map((variant) => variant.variantOrder)).toEqual([0, 1]);
    expect(result.variants.map((variant) => variant.variantId)).toEqual(
      source.variants.map((variant) => variant.variantId),
    );
    expect(result).not.toHaveProperty("aggregate");
    expect(result).not.toHaveProperty("winner");
    expect(result).not.toHaveProperty("rank");
  });

  it("preserves duplicate physical variants even when ZC shapes collide", () => {
    const source = gamma("mormonism");
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    expect(result.variants).toHaveLength(source.variants.length);
    expect(result.variants[0].sourceLineNumber).not.toBe(
      result.variants[1].sourceLineNumber,
    );
    expect(zcShape(result)[0]).toEqual(zcShape(result)[1]);
    expect(result.variants[0].sourceEvidence).not.toBe(
      result.variants[1].sourceEvidence,
    );
  });

  it("preserves the complete candidate and source provenance chain", () => {
    const source = gamma();
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    const variant = result.variants[0];
    expect(result.candidateId).toBe(source.candidateId);
    expect(result.candidateSourceFamilyId).toBe(source.candidateSourceFamilyId);
    expect(variant.candidateSourceRecordId).toBe(source.candidateSourceRecordId);
    expect(variant.sourceEvidence.rawSourceLine).toBe(
      source.variants[0].rawSourceLine,
    );
    expect(variant.sourceLineNumber).toBe(source.variants[0].sourceLineNumber);
    expect(variant.gammaProjectorId).toBe(source.projectorId);
    expect(variant.gammaVariantSchemaVersion).toBe(source.variants[0].schemaVersion);
    expect(variant.sourceProfileId).toBe(CMUDICT_SOURCE_PROFILE_ID_V0_1);
    expect(variant.sourceNotation).toBe(CMUDICT_SOURCE_NOTATION_V0_1);
    expect(variant.sourceRevision).toBe(CMUDICT_SOURCE_REVISION_V0_1);
    expect(variant.sourceArtifactBytes).toBe(CMUDICT_DATA_BYTES_V0_1);
    expect(variant.sourceArtifactSha256).toBe(CMUDICT_DATA_SHA256_V0_1);
  });

  it("propagates Gamma Null without fabricating a variant", () => {
    const source = gamma("word-that-is-not-in-cmudict");
    const result = projectCmuDictCandidateZcProjectionV0_1(source);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
    expect(result.variants).toEqual([]);
  });

  it("fails closed for null, undefined, primitive, and array input", () => {
    for (const value of [null, undefined, "stone", 7, [], [gamma()]]) {
      const result = projectCmuDictCandidateZcProjectionV0_1(value);
      expect(result.status).toBe("null");
      expect(result.reasonCode).toBe(
        "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION",
      );
      expect(result.variants).toEqual([]);
    }
  });

  it.each([
    ["Gamma projector identity", (value: CmuDictCandidateGammaProjectionV0_1) => { value.projectorId = "wrong"; }],
    ["Gamma schema", (value: CmuDictCandidateGammaProjectionV0_1) => { value.schemaVersion = "wrong"; }],
    ["candidate identity", (value: CmuDictCandidateGammaProjectionV0_1) => { value.candidateSourceId = "wrong"; }],
    ["variant identity", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].variantId = "wrong"; }],
    ["variant order", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].variantOrder = 1; }],
    ["source profile", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].sourceProfileId = "wrong"; }],
    ["source notation", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].sourceNotation = "wrong"; }],
    ["source revision", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].sourceRevision = "wrong"; }],
    ["source artifact", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].sourceArtifactSha256 = "wrong"; }],
    ["Voice path vocabulary", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].canonicalVoicePath = ["INVALID_VOICE"]; }],
    ["Gamma mapping id", (value: CmuDictCandidateGammaProjectionV0_1) => { value.mappingId = "wrong"; }],
    ["Gamma mapping table", (value: CmuDictCandidateGammaProjectionV0_1) => { value.mappingTable = "wrong"; }],
    ["defined source metadata", (value: CmuDictCandidateGammaProjectionV0_1) => { value.sourceArtifactSha256 = "wrong"; }],
    ["invalid region topology", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].consonantRegions[0].sourceSegmentIndices = [999]; }],
    ["invalid source segment index", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].normalizedSegments[0].segmentIndex = 99; }],
    ["invalid recurrence source structure", (value: CmuDictCandidateGammaProjectionV0_1) => { value.variants[0].normalizedSegments[0].sourceUnits = []; }],
  ])("fails closed for %s", (_label, mutate) => {
    const value = copy(gamma("stone"));
    mutate(value);
    const result = projectCmuDictCandidateZcProjectionV0_1(value);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe(
      "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION",
    );
  });

  it("fails closed when the Gamma variant order/cardinality is inconsistent", () => {
    const value = copy(gamma("read"));
    value.variants.pop();
    const result = projectCmuDictCandidateZcProjectionV0_1(value);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe(
      "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION",
    );
  });

  it("is stress-invariant and does not use semantic or forbidden fields", () => {
    const result = projectCmuDictCandidateZcProjectionV0_1(gamma("read"));
    expect(zcShape(result)[0]).toEqual(zcShape(result)[1]);
    const keys = keysDeep(result);
    for (const forbidden of [
      "semantic",
      "meaning",
      "representationBridge",
      "SAME_REPRESENTATION",
      "aggregate",
      "winner",
      "rank",
    ]) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("deep-freezes output and does not mutate Gamma input", () => {
    const input = gamma();
    const before = JSON.stringify(input);
    const result = projectCmuDictCandidateZcProjectionV0_1(input);
    expect(JSON.stringify(input)).toBe(before);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.variants)).toBe(true);
    expect(Object.isFrozen(result.variants[0])).toBe(true);
    expect(Object.isFrozen(result.variants[0].sourceEvidence)).toBe(true);
    expect(
      Object.isFrozen(result.variants[0].zeroConsonantalStructuralComposition),
    ).toBe(true);
    expect(
      Object.isFrozen(result.variants[0].zeroConsonantalStructuralComposition.r),
    ).toBe(true);
  });

  it("keeps identical ZC lossy and non-equivalence claims explicit", () => {
    const result = projectCmuDictCandidateZcProjectionV0_1(gamma("mormonism"));
    expect(result.variants[0].zeroConsonantalStructuralComposition).toBeDefined();
    expect(result.variants[0].zeroConsonantalStructuralComposition).not.toHaveProperty(
      "gamma",
    );
    expect(result.variants[0].zeroConsonantalStructuralComposition).not.toHaveProperty(
      "meaning",
    );
  });

  it("contains only Gamma-bound structural/provenance output", () => {
    const result = projectCmuDictCandidateZcProjectionV0_1(gamma());
    expect(result).toMatchObject({
      projectorId: CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1,
      gammaProjectorId: CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
      status: "defined",
      reasonCode: null,
    });
    expect(result.variants[0]).toHaveProperty(
      "zeroConsonantalStructuralComposition",
    );
    expect(result.variants[0]).not.toHaveProperty("candidateVoice");
    expect(result.variants[0]).not.toHaveProperty("rawPronunciation");
  });
});

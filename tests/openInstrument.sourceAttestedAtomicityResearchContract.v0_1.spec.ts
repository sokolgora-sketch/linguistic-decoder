import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
} from "../src/shared/openInstrument/dalipajEmbryomorphemeExpandedSourceCorpus.v0_1";
import {
  createSourceAttestedAtomicityResearchV0_1,
  projectDalipajExpandedAtomicityResearchV0_1,
  validateSourceAttestedAtomicityResearchV0_1,
} from "../src/shared/openInstrument/sourceAttestedAtomicityResearchContract.v0_1";
import {
  discoverStructuralHypothesesV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

const EXPANDED_CORPUS_PATH = resolve(
  __dirname,
  "../src/shared/openInstrument/dalipajEmbryomorphemeExpandedSourceCorpus.v0_1.ts",
);

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function projectedInput(form: string) {
  const result = projectDalipajExpandedAtomicityResearchV0_1(form);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`missing source-attested form: ${form}`);
  return result.representation;
}

describe("source-attested atomicity research contract v0.1", () => {
  test("projects BI atomicity without exposing source meaning", () => {
    const result = projectDalipajExpandedAtomicityResearchV0_1("BI");

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.representation).toMatchObject({
      relationType: "SOURCE_ATTESTED_ATOMICITY",
      sourceForm: "BI",
      normalizedForm: "BI",
      sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED",
      canonicalVoicePath: ["I"],
      canonicalVoiceProjectionStatus: "FORM_DERIVED",
      semanticInputStatus: "SEALED_NOT_CONSUMED",
      runtimeAuthority: "NO",
      ordinaryChatIntegration: "NO",
      productionEvidencePromotion: "NO",
      canonicalPromotion: "NO",
      reviewedFunctionalTruth: "NO",
      historicalClaimAdoption: "NO",
    });
    expect(result.representation.sourceRefs).toHaveLength(1);
    expect(result.representation).not.toHaveProperty("sourceGloss");
    expect(result.representation).not.toHaveProperty("meaning");
    expect(result.representation).not.toHaveProperty("semanticBridge");
    expect(result.representation).not.toHaveProperty("targetSense");
    expect(result.representation).not.toHaveProperty("evidenceRefs");
    expect(validateSourceAttestedAtomicityResearchV0_1(result.representation)).toEqual({
      ok: true,
      representation: result.representation,
    });
  });

  test("derives Voices from form and accepts the additional frozen forms", () => {
    expect(projectedInput("LE").canonicalVoicePath).toEqual(["E"]);
    expect(projectedInput("ZA").canonicalVoicePath).toEqual(["A"]);
    expect(projectedInput("MA").canonicalVoicePath).toEqual(["A"]);
    expect(projectedInput("GJ")).toMatchObject({
      normalizedForm: "GJ",
      canonicalVoicePath: [],
      canonicalVoiceProjectionStatus: "NO_CANONICAL_VOICE_PATH",
    });
  });

  test("requires explicit atomicity attestation for a comparable form", () => {
    expect(projectDalipajExpandedAtomicityResearchV0_1("BA")).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_NOT_FOUND"],
    });

    const explicitlyAttested = createSourceAttestedAtomicityResearchV0_1({
      form: "BA",
      sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED",
      sourceRef: {
        sourceRecordId: "invented",
        sourceLocator: "invented",
        sourceClass: "PRIMARY_AUTHOR_SOURCE",
        sourceAuthority: "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT",
        confidence: "MEDIUM",
      },
    });
    expect(explicitlyAttested.ok).toBe(true);
    if (!explicitlyAttested.ok) return;
    expect(explicitlyAttested.representation.sourceForm).toBe("BA");
  });

  test("rejects semantic inputs and unexpected answer-bearing fields", () => {
    const clean = projectDalipajExpandedAtomicityResearchV0_1("BI");
    expect(clean.ok).toBe(true);
    if (!clean.ok) return;

    const contaminated = createSourceAttestedAtomicityResearchV0_1({
      form: "BI",
      sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED",
      sourceGloss: "godas",
      sourceRef: {
        sourceRecordId: clean.representation.sourceRefs[0].sourceRecordId,
        sourceLocator: clean.representation.sourceRefs[0].sourceLocator,
        sourceClass: "PRIMARY_AUTHOR_SOURCE",
        sourceAuthority: "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT",
        confidence: "MEDIUM",
      },
      targetSense: { id: "forbidden", label: "forbidden" },
    } as never);

    expect(contaminated).toEqual({
      ok: false,
      reasonCodes: ["FORBIDDEN_SEMANTIC_FIELD_PRESENT", "UNEXPECTED_FIELD_PRESENT"],
    });
  });

  test("keeps generic structural discovery and the frozen corpus unchanged", () => {
    const before = sha256File(EXPANDED_CORPUS_PATH);

    expect(discoverStructuralHypothesesV0_1("BI")).toEqual([]);
    expect(discoverStructuralHypothesesV0_1("BA")).toEqual([]);
    expect(discoverStructuralHypothesesV0_1("BIA").map((item) => item.embryo)).toEqual([
      "IA",
    ]);
    expect(DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
      (record) => record.form,
    )).toEqual(["BI", "LE", "ZA", "GJ", "MA"]);

    expect(sha256File(EXPANDED_CORPUS_PATH)).toBe(before);
  });

  test("is deterministic, deeply frozen, and never performs semantic comparison", () => {
    const first = projectDalipajExpandedAtomicityResearchV0_1("BI");
    const second = projectDalipajExpandedAtomicityResearchV0_1("BI");

    expect(second).toEqual(first);
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    expect(Object.isFrozen(first.representation)).toBe(true);
    expect(Object.isFrozen(first.representation.sourceRefs)).toBe(true);
    expect(Object.isFrozen(first.representation.sourceRefs[0])).toBe(true);
    expect(Object.isFrozen(first.representation.canonicalVoicePath)).toBe(true);
    expect(JSON.stringify(first.representation)).not.toContain("godas");
    expect(JSON.stringify(first.representation)).not.toContain("strike");
    expect(JSON.stringify(first.representation)).not.toContain("force");
  });

  test("rejects noncanonical source forms without changing canonical Voice rules", () => {
    expect(projectDalipajExpandedAtomicityResearchV0_1("Bı")).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_NOT_FOUND"],
    });
    expect(projectDalipajExpandedAtomicityResearchV0_1("bi")).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_NOT_FOUND"],
    });
    expect(projectDalipajExpandedAtomicityResearchV0_1("Bİ")).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_NOT_FOUND"],
    });
    expect(projectDalipajExpandedAtomicityResearchV0_1("BI ")).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_NOT_FOUND"],
    });
    expect(projectDalipajExpandedAtomicityResearchV0_1("Ẽ")).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_NOT_FOUND"],
    });

    const malformed = createSourceAttestedAtomicityResearchV0_1({
      form: "GJ",
      sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED",
      sourceRef: {
        sourceRecordId: "gj",
        sourceLocator: "source",
        sourceClass: "PRIMARY_AUTHOR_SOURCE",
        sourceAuthority: "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT",
        confidence: "MEDIUM",
      },
      expectedVoice: "U",
    } as never);
    expect(malformed).toEqual({
      ok: false,
      reasonCodes: ["FORBIDDEN_SEMANTIC_FIELD_PRESENT", "UNEXPECTED_FIELD_PRESENT"],
    });
  });
});

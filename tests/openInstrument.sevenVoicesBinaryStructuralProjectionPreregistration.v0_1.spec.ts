import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifySevenVoicesBinaryStructuralProjectionPreregistration } from "../scripts/openInstrumentSevenVoicesBinaryStructuralProjectionPreregistrationVerification.v0_1.mjs";

const root = process.cwd();
const artifactPath = resolve(
  root,
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/preregistration.json",
);

describe("Seven Voices binary structural projection preregistration v0.1", () => {
  test("validates the fixed-sentinel mapping universe and all control families", () => {
    const result = verifySevenVoicesBinaryStructuralProjectionPreregistration();
    expect(result.mappingUniverseCount).toBe(5040);
    expect(result.familyCounts).toEqual({
      UNRESTRICTED: 5040,
      CENTER_PRESERVING: 720,
      MIRROR_EDGE_PRESERVING: 528,
      CENTERED_MIRROR_EDGE: 144,
      PAIR_BLOCK_PRESERVING: 48,
      EXACT_RING_PRESERVING: 8,
      STRUCTURAL_V0_1: 1,
    });
  });

  test("freezes structural-only input and execution boundary", () => {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    expect(artifact.executionBoundary).toMatchObject({
      experimentExecuted: false,
      resultComputed: false,
      productionBinarySemanticsAuthorized: false,
      semanticClaimsMade: false,
      linguisticClaimsMade: false,
      productionAuthorityChanged: false,
    });
    expect(artifact.semanticFirewall.yDriftExcluded).toBe(true);
    expect(artifact.semanticFirewall.iYExcluded).toBe(true);
    expect(artifact.canonicalStructuralInput.voiceOrder).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
    expect(artifact.structuralV0_1.sentinel).toMatchObject({
      code: "000",
      kind: "EXPERIMENTAL_UNUSED_SENTINEL",
      isVoice: false,
    });
    expect(artifact.outputContract.classificationEnum).toEqual([
      "REDUNDANT",
      "PARTIALLY_ADDITIVE",
      "ADDITIVE",
      "LOSSY",
      "INVALID_EXPERIMENT",
    ]);
  });

  test("locks the mathematical distinction between GF(2)^3 and Q3", () => {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    expect(artifact.mathematicalStructures.gf2VectorSpace.linearSymmetryGroup).toBe("GL(3,2)");
    expect(artifact.mathematicalStructures.hammingCube.graph).toBe("Q3");
    expect(artifact.mathematicalStructures.nonConflationRule).toContain("reported separately");
    expect(artifact.mirrorEdgeDefinition.hammingDistance).toBe(1);
    expect(artifact.mirrorEdgeDefinition.oSelfMirror).toBe("not an ordinary edge");
  });
});

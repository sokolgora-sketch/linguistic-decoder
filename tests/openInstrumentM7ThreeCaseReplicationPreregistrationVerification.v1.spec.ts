import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyM7Preregistration } from "../scripts/openInstrumentM7ThreeCaseReplicationPreregistrationVerification.v1.mjs";

const root = process.cwd();
const artifactPath = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/preregistration.json");

describe("Open Instrument M7 three-case replication preregistration", () => {
  test("verifies deterministic durability hashes and three-case freeze", () => {
    const result = verifyM7Preregistration();
    expect(result.selectedWords).toEqual(["balance", "father", "start"]);
    expect(result.controllerHashes).toHaveLength(3);
    expect(result.blindHashes).toHaveLength(3);
  });

  test("keeps the preregistration research-free and target-blind payloads clean", () => {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    expect(artifact.protocolIntegrity.embryoResearchPerformed).toBe(false);
    expect(artifact.protocolIntegrity.blindRunsPerformed).toBe(false);
    expect(artifact.leakageAudit.targetWordInPayload).toBe(false);
    expect(artifact.leakageAudit.targetSenseIdInPayload).toBe(false);
    expect(artifact.blindPayloads).toHaveLength(3);
  });
});

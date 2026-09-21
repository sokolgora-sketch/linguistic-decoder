import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assembleTargetSafeWorkerInputForDryRun,
  validateTargetSafeWorkerEnvelope,
  verifyStrictBlindReplicationTargetSafeWorkerEnvelope,
} from "../scripts/openInstrumentStrictBlindReplicationTargetSafeWorkerEnvelopeVerification.v1.mjs";

const root = process.cwd();
const envelopePath = resolve(root, "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/target-safe-worker-envelope.v1.json");
const preregistrationPath = resolve(root, "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/preregistration.json");

describe("Open Instrument strict blind replication target-safe worker envelope v1", () => {
  test("verifies the generic envelope and all three unchanged blind payload identities", () => {
    const result = verifyStrictBlindReplicationTargetSafeWorkerEnvelope();
    expect(result.envelopeByteLength).toBeGreaterThan(0);
    expect(result.envelopeSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(result.payloadResults.map((payload) => payload.replicationSlot)).toEqual(["SBR-01", "SBR-02", "SBR-03"]);
  });

  test("assembles SBR-01 without target, controller, parent, or project context", () => {
    const assembled = assembleTargetSafeWorkerInputForDryRun("SBR-01");
    expect(assembled.sourceQueriesPerformed).toBe(0);
    expect(assembled.targetRevealed).toBe(false);
    expect(assembled.blindPayload.replicationSlot).toBe("SBR-01");
    const serializedEnvelope = JSON.stringify(assembled.envelope);
    expect(serializedEnvelope).not.toMatch(/(^|[^a-z0-9])direct([^a-z0-9]|$)/i);
    expect(serializedEnvelope).not.toMatch(/(^|[^a-z0-9])synergy([^a-z0-9]|$)/i);
    expect(serializedEnvelope).not.toMatch(/(^|[^a-z0-9])whole([^a-z0-9]|$)/i);
    expect(JSON.stringify(assembled.envelope)).not.toContain("targetSenseDefinition");
    expect(JSON.stringify(assembled.envelope)).not.toContain("structuralControllers");
  });

  test.each([
    ["target word leakage", "targetWord", "direct"],
    ["target definition leakage", "targetSenseDefinition", "going in a straight line"],
    ["controller leakage", "controller", { targetWord: "direct" }],
    ["candidate-pool leakage", "candidatePool", []],
    ["target-bearing chain leakage", "expansionChain", ["IR", "DIR", "DIRECT"]],
  ])("rejects %s", (_label, key, value) => {
    const envelope = JSON.parse(readFileSync(envelopePath, "utf8"));
    envelope.leak = { [key]: value };
    expect(() => validateTargetSafeWorkerEnvelope(envelope, { selectedWords: ["direct"], selectedSenseIds: ["sense"], selectedDefinitions: [typeof value === "string" ? value : "definition"] })).toThrow();
  });

  test.each([
    ["changed source universe", (envelope: any) => { envelope.sourceUniverse.traditions[0].id = "unauthorized"; }],
    ["changed NULL_IF_NONE rule", (envelope: any) => { envelope.nullIfNone.result = "INSUFFICIENT_CORRESPONDENCE"; }],
    ["changed outcome space", (envelope: any) => { envelope.outcomeContract.outcomeSpace = ["FUNCTIONAL_CORRESPONDENCE"]; }],
    ["missing durability gate", (envelope: any) => { envelope.durabilityContract.primaryAndSecondaryMustMatchExactly = false; }],
    ["changed blind payload identity", (envelope: any) => { envelope.blindPayloadContract.mustRemainByteIdentical = false; }],
  ])("rejects %s", (_label, mutate) => {
    const envelope = JSON.parse(readFileSync(envelopePath, "utf8"));
    mutate(envelope);
    expect(() => validateTargetSafeWorkerEnvelope(envelope, { selectedWords: ["direct"], selectedSenseIds: ["sense"], selectedDefinitions: ["definition"] })).toThrow();
  });

  test("does not alter the committed preregistration while validating the envelope", () => {
    const preregistration = JSON.parse(readFileSync(preregistrationPath, "utf8"));
    expect(preregistration.status).toBe("PREREGISTERED_BEFORE_BLIND_RESEARCH");
    expect(preregistration.structuralControllers.map((controller: { targetWord: string }) => controller.targetWord)).toEqual(["direct", "synergy", "whole"]);
  });
});

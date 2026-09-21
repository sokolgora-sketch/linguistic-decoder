import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertCompleteDurabilityGate,
  assertExactBlindPayload,
  REQUIRED_DURABILITY_GATE_FLAGS,
  verifyM7DurabilityReplacementAddendum,
} from "../scripts/openInstrumentM7DurabilityReplacementAddendumVerification.v1.mjs";

const root = process.cwd();
const addendumPath = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/durability-replacement-addendum.v1.json");
const preregistrationPath = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/preregistration.json");

describe("Open Instrument M7 durability replacement governance addendum", () => {
  test("verifies the immutable parent, payload identity, replacement scope, and dual-copy gate", () => {
    expect(verifyM7DurabilityReplacementAddendum()).toMatchObject({
      originalPreregistrationByteLength: 24321,
      originalPreregistrationSha256: "54d579f1af4bb597ccb4037d156dc27123742b487845ecd52fc80d84cc69cd3e",
      replacementRunIds: [
        "open-instrument-m7-three-case-replication-v1:M7-02-REPLACEMENT-02",
        "open-instrument-m7-three-case-replication-v1:M7-03-REPLACEMENT-03",
      ],
    });
  });

  test("does not mutate the original preregistration", () => {
    const original = readFileSync(preregistrationPath);
    expect(original.byteLength).toBe(24321);
    expect(readFileSync(addendumPath).byteLength).toBeGreaterThan(0);
  });

  test("requires every declared durability-gate condition", () => {
    const addendum = JSON.parse(readFileSync(addendumPath, "utf8"));
    expect(Object.keys(addendum.durabilityGate).sort()).toEqual([...REQUIRED_DURABILITY_GATE_FLAGS].sort());
    expect(() => assertCompleteDurabilityGate(addendum.durabilityGate)).not.toThrow();

    const weakenedGate = { ...addendum.durabilityGate, secondaryRecomputedFromDisk: false };
    expect(() => assertCompleteDurabilityGate(weakenedGate)).toThrow("secondaryRecomputedFromDisk");
  });

  test("requires exact equality with the original blind payload", () => {
    const addendum = JSON.parse(readFileSync(addendumPath, "utf8"));
    const preregistration = JSON.parse(readFileSync(preregistrationPath, "utf8"));
    const replacement = addendum.replacementRuns.find((item: { replicationSlot: string }) => item.replicationSlot === "M7-02");
    const original = preregistration.blindPayloads.find((item: { replicationSlot: string }) => item.replicationSlot === "M7-02");
    expect(() => assertExactBlindPayload(replacement.blindPayload, original, "M7-02")).not.toThrow();

    const withUnexpectedField = { ...replacement.blindPayload, unexpectedExtraField: true };
    expect(() => assertExactBlindPayload(withUnexpectedField, original, "M7-02")).toThrow("M7-02");
  });
});

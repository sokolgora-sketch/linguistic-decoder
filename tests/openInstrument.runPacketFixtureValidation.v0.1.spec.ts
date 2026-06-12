import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  validateRunPacketFixtureV0_1,
  type RunPacketFixtureValidationResultV0_1,
} from "../src/shared/openInstrument/runPacketFixtureValidation.v0.1";

const fixturePath = resolve(
  process.cwd(),
  "docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json",
);

function loadFixture(): unknown {
  return JSON.parse(readFileSync(fixturePath, "utf8"));
}

function expectInvalid(result: RunPacketFixtureValidationResultV0_1): void {
  expect(result.ok).toBe(false);
  expect(result.issues.length).toBeGreaterThan(0);
}

describe("Open Instrument run packet fixture validation v0.1", () => {
  it("accepts the static run packet fixture", () => {
    const result = validateRunPacketFixtureV0_1(loadFixture());

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("rejects a missing required top-level field", () => {
    const fixture = loadFixture() as Record<string, unknown>;
    delete fixture.packetId;

    const result = validateRunPacketFixtureV0_1(fixture);

    expectInvalid(result);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "MISSING_FIELD",
          path: "packetId",
        }),
      ]),
    );
  });

  it("rejects a wrong identity value", () => {
    const fixture = loadFixture() as Record<string, unknown>;
    fixture.runId = "fixture.open-instrument.run-packet.static.v9.9";

    const result = validateRunPacketFixtureV0_1(fixture);

    expectInvalid(result);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_VALUE",
          path: "runId",
        }),
      ]),
    );
  });

  it("rejects a true authorization field", () => {
    const fixture = loadFixture() as Record<string, unknown>;
    fixture.modelCallAuthorization = true;

    const result = validateRunPacketFixtureV0_1(fixture);

    expectInvalid(result);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_VALUE",
          path: "modelCallAuthorization",
        }),
      ]),
    );
  });

  it("rejects boundary drift", () => {
    const fixture = loadFixture() as Record<string, unknown>;
    fixture.claimBoundary = null;

    const result = validateRunPacketFixtureV0_1(fixture);

    expectInvalid(result);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_OBJECT",
          path: "claimBoundary",
        }),
      ]),
    );
  });
});

import runPacketFixture from "../docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json";
import { validateRunPacketFixtureV0_1 } from "../src/shared/openInstrument/runPacketFixtureValidation.v0.1";

describe("Open Instrument run packet fixture validation integration gate v0.1", () => {
  it("keeps the checked-in static run packet fixture passing the validation helper", () => {
    const result = validateRunPacketFixtureV0_1(runPacketFixture);

    expect(result).toEqual({
      ok: true,
      issues: [],
    });
  });

  it("keeps the gate scoped to static schema and traceability validation only", () => {
    const result = validateRunPacketFixtureV0_1(runPacketFixture);

    expect(result.ok).toBe(true);
    expect(runPacketFixture.provider).toBe("fixture");
    expect(runPacketFixture.model).toBe("none");
    expect(runPacketFixture.endpointType).toBe("none");
    expect(runPacketFixture.evidenceClassIntent).toBe("design-only");

    expect(runPacketFixture.modelCallAuthorization).toBe(false);
    expect(runPacketFixture.artifactCreationAuthorization).toBe(false);
    expect(runPacketFixture.rerunAuthorization).toBe(false);
    expect(runPacketFixture.openAiApiAuthorization).toBe(false);
  });

  it("fails closed if fixture authorization drifts toward execution", () => {
    const driftedFixture = {
      ...runPacketFixture,
      modelCallAuthorization: true,
    };

    const result = validateRunPacketFixtureV0_1(driftedFixture);

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "modelCallAuthorization",
        }),
      ]),
    );
  });

  it("fails closed if fixture provider identity drifts toward a live provider", () => {
    const driftedFixture = {
      ...runPacketFixture,
      provider: "openai",
    };

    const result = validateRunPacketFixtureV0_1(driftedFixture);

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "provider",
        }),
      ]),
    );
  });
});

import {
  verifyStoredV0_1C,
} from "../scripts/openInstrumentFrd02P4V0_1cSyntheticCalibrationExecution.v0_1";

describe("FRD-02 P4 v0.1c stored result integrity", () => {
  it("verifies the stored 232-evaluation result without executing science", () => {
    expect(verifyStoredV0_1C()).toEqual({
      jsonValid: true,
      evaluationCount: 232,
      fixtureCount: 29,
      replicateIdsComplete: true,
      noDuplicates: true,
      noOmissions: true,
      aggregateMatchesStored: true,
      scheduleHashMatches: true,
      attemptCount: 1,
      noRerun: true,
      realDataExecuted: false,
    });
  });
});

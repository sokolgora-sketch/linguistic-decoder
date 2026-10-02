import {
  buildFrozenScheduleProvenanceV0_1C,
} from "../scripts/openInstrumentFrd02P4V0_1cSyntheticCalibrationExecution.v0_1";

describe("FRD-02 P4 v0.1c execution wrapper preflight", () => {
  it("constructs the frozen 29-by-8 schedule without executing science", () => {
    const first = buildFrozenScheduleProvenanceV0_1C();
    const second = buildFrozenScheduleProvenanceV0_1C();

    expect(first.schedule).toHaveLength(232);
    expect(first.bytes).toBeGreaterThan(0);
    expect(first.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(first.sha256).toBe(second.sha256);
    expect(first.bytes).toBe(second.bytes);
    expect(first.firstEntry?.fixtureId).toBe("N0");
    expect(first.firstEntry?.replicateId).toBe("0");
    expect(first.lastEntry?.fixtureId).toBe("C9");
    expect(first.lastEntry?.replicateId).toBe("7");
    expect(new Set(first.schedule.map((entry) => `${entry.fixtureId}:${entry.replicateId}`)).size).toBe(232);
  });
});

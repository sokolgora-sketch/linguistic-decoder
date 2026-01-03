import { runSevenVoicesStressTestV1 } from "@/shared/sevenVoicesStressTest.v1";

/**
 * Contract lock for StressTest strictInput policy.
 * Goal: make strictInput behavior explicit and protected.
 */

describe("SevenVoicesStressTestV1 — strictInput policy contract (v1)", () => {
  it("strictInput=true rejects plain text letters (xyz -> no voices)", () => {
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "xyz", strictInput: true });

    expect(out).toMatchSnapshot();
    expect(out.voices).toEqual([]);
    expect(out.classification).toBeNull();
    expect(out.ui.label).toMatch(/No voice path detected/i);
    expect(out.ui.summary).toMatch(/No vowels/i);
  });

  it("strictInput=true accepts explicit voice paths", () => {
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "Y → Ë", strictInput: true });

    expect(out).toMatchSnapshot();
    expect(out.voices.length).toBeGreaterThan(0);
    expect(out.classification).not.toBeNull();
    expect(out.voicePath).toBe("Y → Ë");
  });

  it("strictInput=true is case-insensitive for voice letters", () => {
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "yë", strictInput: true });

    expect(out).toMatchSnapshot();
    expect(out.voices.length).toBeGreaterThan(0);
    expect(out.classification).not.toBeNull();
  });

  it("strictInput=false preserves legacy reality (xyz includes Y)", () => {
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "xyz", strictInput: false });

    expect(out).toMatchSnapshot();
    expect(out.voices.length).toBe(1);
    expect(out.voices[0]).toBe("Y");
    expect(out.classification).not.toBeNull();
  });
});

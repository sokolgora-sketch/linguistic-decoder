import { runSevenVoicesStressTestV1 } from "@/shared/sevenVoicesStressTest.v1";

/**
 * Contract lock for SevenVoicesStressTestV1 (v1)
 * Goal: prevent silent semantic drift in stress-test outputs.
 *
 * This is NOT "meaning correctness" testing.
 * This locks determinism + transparency (including weird edge behavior).
 */

describe("SevenVoicesStressTestV1 — contract lock (v1)", () => {
  it("locks output for a valid voice path", () => {
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "O → E" });

    expect(out).toMatchSnapshot();

    // Minimal invariants
    expect(out.voicePath).toBe("O → E");
    expect(out.ui.voicePath).toBe("O → E");
    expect(out.voices.length).toBeGreaterThan(0);
    expect(out.classification).not.toBeNull();
  });

  it("locks output when input has no vowel letters at all (classification must be null)", () => {
    // Use digits/punctuation only so we truly have zero vowels A,E,I,O,U,Y,Ë.
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "123-_=+!!" });

    expect(out).toMatchSnapshot();

    expect(out.voices.length).toBe(0);
    expect(out.classification).toBeNull();
    expect(out.ui.label).toMatch(/No voice path detected/i);
    expect(out.ui.summary).toMatch(/No vowels/i);
  });

  it("locks current edge behavior: lowercase 'xyz' is interpreted as Y (not null)", () => {
    // Current reality: parseVoicePath/classifier treat 'y' as voice Y even in plain text.
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "xyz" });

    expect(out).toMatchSnapshot();

    expect(out.voicePath).toBe("Y");
    expect(out.voices).toEqual(["Y"]);
    expect(out.classification).not.toBeNull();
    expect(out.classification?.to).toBe("Y");
  });

  it("locks output for a single vowel path", () => {
    const out = runSevenVoicesStressTestV1({ word: "", voicePathRaw: "O" });

    expect(out).toMatchSnapshot();

    expect(out.voicePath).toBe("O");
    expect(out.ui.voicePath).toBe("O");
    expect(out.voices.length).toBe(1);
    expect(out.classification).not.toBeNull();
  });
});

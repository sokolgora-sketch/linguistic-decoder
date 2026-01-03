import { normalizeVoicePath, parseVoicePath } from "@/shared/patternAtlas.v1";

/**
 * Contract lock for PatternAtlas IO (v1): parse + normalize.
 * Goal: prevent silent drift in what we consider a voice-path input and how it canonicalizes.
 *
 * Notes:
 * - This locks *current reality*, including edge cases (case handling, arrows, noise).
 * - If we later change behavior intentionally, update snapshots in the PR with justification.
 */

describe("PatternAtlas IO — contract lock (v1)", () => {
  it("locks canonical normalization forms", () => {
    const cases = [
      { raw: "O", norm: "O" },
      { raw: "O→E", norm: "O → E" },
      { raw: "O → E", norm: "O → E" },
      { raw: "O  →   E", norm: "O → E" },
      { raw: "YË", norm: "Y → Ë" },              // adjacency becomes arrowed path
      { raw: "Y → Ë", norm: "Y → Ë" },
      { raw: "ë", norm: "Ë" },                   // case normalization
      { raw: "a-e-i", norm: "A → E → I" },       // separators collapse to path
    ];

    for (const c of cases) {
      expect(normalizeVoicePath(c.raw)).toBe(c.norm);
    }
  });

  it("locks parsing semantics for typical inputs", () => {
    const cases = [
      { raw: "O", voices: ["O"] },
      { raw: "O→E", voices: ["O", "E"] },
      { raw: "O → E", voices: ["O", "E"] },
      { raw: "YË", voices: ["Y", "Ë"] },
      { raw: "a e i", voices: ["A", "E", "I"] },
      { raw: "123-_=+!!", voices: [] },          // truly no vowels
    ] as const;

    for (const c of cases) {
      expect(parseVoicePath(c.raw)).toEqual(c.voices);
    }
  });

  it("locks current edge reality: lowercase 'xyz' includes Y", () => {
    // Current behavior observed earlier: 'y' is treated as voice Y even in plain text.
    expect(parseVoicePath("xyz")).toEqual(["Y"]);
    expect(normalizeVoicePath("xyz")).toBe("Y");
  });

  it("snapshots a small IO battery for drift detection", () => {
    const battery = [
      "O",
      "O→E",
      "O → E",
      "YË",
      "ë",
      "a-e-i",
      "xyz",
      "123-_=+!!",
    ].map((raw) => ({
      raw,
      normalized: normalizeVoicePath(raw),
      voices: parseVoicePath(raw),
    }));

    expect(battery).toMatchSnapshot();
  });
});

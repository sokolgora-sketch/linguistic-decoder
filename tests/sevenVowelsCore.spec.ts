// tests/sevenVowelsCore.spec.ts
import {
  extractVowelPath,
  voiceVectorFromPath,
  computeRings,
  summarizeWordMath7,
  computeBalance,
  computeTension,
} from "../src/lib/sevenVowelsCore";

describe("sevenVowelsCore.extractVowelPath", () => {
  it("extracts vowels for 'study'", () => {
    expect(extractVowelPath("study")).toEqual(["U", "Y"]);
  });

  it("extracts vowels for 'matematikë'", () => {
    expect(extractVowelPath("matematikë")).toEqual(["A", "E", "A", "I", "Ë"]);
  });

  it("returns null when no vowels are present", () => {
    expect(extractVowelPath("brrr")).toBeNull();
  });
});

describe("sevenVowelsCore.voiceVectorFromPath", () => {
  it("builds vector for 'study'", () => {
    const path = extractVowelPath("study");
    const vec = voiceVectorFromPath(path);

    expect(vec).toEqual({
      A: 0,
      E: 0,
      I: 0,
      O: 0,
      U: 1,
      Y: 1,
      Ë: 0,
    });
  });

  it("builds vector for 'matematikë'", () => {
    const path = extractVowelPath("matematikë");
    const vec = voiceVectorFromPath(path);

    expect(vec).toEqual({
      A: 2,
      E: 1,
      I: 1,
      O: 0,
      U: 0,
      Y: 0,
      Ë: 1,
    });
  });

  it("returns zero vector for null path", () => {
    const vec = voiceVectorFromPath(null);

    expect(vec).toEqual({
      A: 0,
      E: 0,
      I: 0,
      O: 0,
      U: 0,
      Y: 0,
      Ë: 0,
    });
  });
});

describe("sevenVowelsCore.computeRings", () => {
  it("partitions 'matematikë' into rings", () => {
    const path = extractVowelPath("matematikë");
    const rings = computeRings(path);

    expect(rings).toEqual({
      inner: ["I"],
      middle: ["E"],
      outer: ["A", "A", "Ë"],
      mediator: null,
    });
  });

  it("detects mediator O in 'audio'", () => {
    const path = extractVowelPath("audio");
    // "audio" -> A, U, I, O
    const rings = computeRings(path);

    expect(rings).toEqual({
      inner: ["U", "I"],
      middle: [],
      outer: ["A"],
      mediator: "O",
    });
  });

  it("returns empty rings for null path", () => {
    const rings = computeRings(null);

    expect(rings).toEqual({
      inner: [],
      middle: [],
      outer: [],
      mediator: null,
    });
  });
});

describe("sevenVowelsCore.summarizeWordMath7", () => {
  it("produces a full summary for 'oceanography'", () => {
    const summary = summarizeWordMath7("oceanography");

    expect(summary.path).toEqual(["O", "E", "A", "O", "A", "Y"]);
    expect(summary.totalVoices).toBe(6);
    expect(summary.dominantVoices).toEqual(["A", "O"]); // A=2, O=2 (tie, A before O)

    // O+E+A+O+A+Y -> mid, out, out, mid
    // inner=0, middle=2, outer=2, mediator=O
    // totalRings = 4
    // avg = 4/3 = 1.33
    // diffs: 1.33, 0.67, 0.67 => sum = 2.67
    // norm = 2.67 / 4 = 0.66
    // score = 1 - 0.66 = 0.33
    expect(summary.balance.score).toBeCloseTo(0.333);
    expect(summary.balance.notes).toContain("strong imbalance between rings");

    // minRing=0, maxRing=2. ratio=0. score=1.
    expect(summary.tension.score).toBe(1);
    expect(summary.tension.notes).toContain("high tension between rings");
  });

  it("produces a full summary for 'study'", () => {
    const summary = summarizeWordMath7("study");

    expect(summary.path).toEqual(["U", "Y"]);
    expect(summary.totalVoices).toBe(2);
    expect(summary.dominantVoices).toEqual(["U", "Y"]);
    expect(summary.balance.score).toBeCloseTo(0.333);
    expect(summary.tension.score).toBe(1);
  });
});

describe("sevenVowelsCore.computeBalance & computeTension", () => {
  it("computes balance/tension for 'study'", () => {
    const path = extractVowelPath("study");
    const vec = voiceVectorFromPath(path);
    const balance = computeBalance(vec);
    const tension = computeTension(vec);

    expect(balance.score).toBeGreaterThan(0);
    expect(balance.score).toBeLessThan(1);
    expect(tension.score).toBeGreaterThan(0.5);
    expect(tension.score).toBeLessThanOrEqual(1);
  });

  it("has high balance and low tension when rings are even", () => {
    const vec = {
      A: 1,
      Ë: 1,
      E: 1,
      Y: 1,
      I: 1,
      U: 1,
      O: 0,
    };

    const balance = computeBalance(vec);
    const tension = computeTension(vec);

    expect(balance.score).toBeGreaterThan(0.9);
    expect(tension.score).toBeLessThan(0.1);
  });
});

describe("sevenVowelsCore.summarizeWordMath7", () => {
  it("creates a consistent summary for 'study'", () => {
    const summary = summarizeWordMath7("study");

    expect(summary.totalVoices).toBe(2);
    expect(summary.path).toEqual(["U", "Y"]);
    expect(summary.rings.inner).toEqual(["U"]);
    expect(summary.rings.middle).toEqual(["Y"]);
    expect(summary.rings.outer).toEqual([]);
    expect(summary.dominantVoices.sort()).toEqual(["U", "Y"].sort());
  });
});

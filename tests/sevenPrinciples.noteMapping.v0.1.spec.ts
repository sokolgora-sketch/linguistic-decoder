import { vowelToNote } from "@/shared/sevenPrinciples.v1";

describe("seven principles note mapping v0.1 (LOCK)", () => {
  it("locks the canonical vowel→note mapping", () => {
    const map = {
      A: vowelToNote("A"),
      E: vowelToNote("E"),
      I: vowelToNote("I"),
      O: vowelToNote("O"),
      U: vowelToNote("U"),
      Y: vowelToNote("Y"),
      "Ë": vowelToNote("Ë"),
    } as const;

    // Exact lock (change requires explicit decision + doc update)
    expect(map).toEqual({
      A: "C",
      E: "D",
      I: "E",
      O: "F",
      U: "G",
      Y: "A",
      "Ë": "B",
    });

    // No duplicates; only diatonic note set.
    const notes = Object.values(map);
    expect(new Set(notes).size).toBe(7);

    const allowed = new Set(["C", "D", "E", "F", "G", "A", "B"]);
    for (const n of notes) expect(allowed.has(n)).toBe(true);

    // Hard locks (redundant, but makes intent loud)
    expect(map.O).toBe("F");
    expect(map["Ë"]).toBe("B");
    expect(map.A).toBe("C");
  });
});

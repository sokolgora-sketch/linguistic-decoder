import { classifyVoicePath } from "@/shared/patternAtlas.v1";

/**
 * Contract lock for PatternAtlas classifier (v1).
 * Goal: prevent silent semantic drift in ring/polarity/summary classification.
 *
 * This is NOT "meaning correctness" testing.
 * This locks determinism + transparency for canonical inputs.
 */

describe("PatternAtlas classifier — contract lock (v1)", () => {
  it("locks canonical paths", () => {
    const cases = [
      { raw: "O", label: "single O" },
      { raw: "O → E", label: "O to E" },
      { raw: "A → Ë", label: "A to Ë" },
      { raw: "I → U", label: "I to U" },
      { raw: "Y → Ë", label: "Y to Ë" },
      // Edge reality: plain text containing 'y' becomes voice Y
      { raw: "xyz", label: "xyz treated as Y" },
    ] as const;

    const out = cases.map((c) => ({
      label: c.label,
      raw: c.raw,
      classification: classifyVoicePath(c.raw),
    }));

    expect(out).toMatchSnapshot();

    // Minimal invariants (do not overfit)
    for (const row of out) {
      expect(row.classification).toBeTruthy();
      expect(row.classification.normalized).toBeTruthy();
      expect(row.classification.polarity).toMatch(/centrifugal|centripetal|orbital/);
      expect(typeof row.classification.summary).toBe("string");
      expect(row.classification.summary.length).toBeGreaterThan(0);
    }
  });
});

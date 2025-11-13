
import { solveMatrix } from "./index";
import type { SolveMode } from "./types";

// Test cases based on user request
const cases: [string, SolveMode, string[]?][] = [
  ["damage","strict", ["A","E","Ë"]],
  ["study","strict",  ["U","I","Ë"]],
  ["mathematics","strict", ["A","E","A","I","Ë"]],
  ["philosophy","strict"] // No specific path, but has rules
];

// Helper to stringify a voice path for comparison
function vp(x:string[]){ return x.join(""); }

describe("Seven-Voices solver (v1.0)", () => {
  test.each(cases)("solves for '%s' in '%s' mode", (word, mode, exp) => {
    const r = solveMatrix(word, mode);
    const p = r.primaryPath.voicePath;

    if (Array.isArray(exp) && exp.length > 0) {
      // Expect an exact voice path match
      expect(vp(p)).toBe(vp(exp as string[]));
    } else {
      // Special case for 'philosophy' as requested:
      // must end in Ë, and the path before closure must contain E or I.
      expect(p[p.length-1]).toBe("Ë");
      const hasInstrument = p.slice(0,-1).some(v => v === "E" || v === "I");
      expect(hasInstrument).toBe(true);
    }
    
    // Ensure basic checksums are always present
    expect(r.primaryPath.checksums.find(c => c.type === 'V')).toBeDefined();
    expect(r.primaryPath.checksums.find(c => c.type === 'E')).toBeDefined();
  });
});

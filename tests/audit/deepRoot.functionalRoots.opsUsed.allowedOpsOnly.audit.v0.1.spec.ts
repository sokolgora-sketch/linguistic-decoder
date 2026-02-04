import { ALLOWED_OP_IDS_V0_1 } from "../../src/shared/ops/allowedOps.v0.1";

const SET = new Set(ALLOWED_OP_IDS_V0_1 as unknown as string[]);

function collectOps(obj: any): string[] {
  const fr = obj?.deepRoot?.functionalRoots;
  if (!Array.isArray(fr)) return [];
  const out: string[] = [];
  for (const r of fr) {
    if (Array.isArray(r?.opsUsed)) out.push(...r.opsUsed.map(String));
  }
  return out;
}

describe("audit: deepRoot.functionalRoots.opsUsed uses AllowedOpId only (v0.1)", () => {
  it("fixture study strict has only AllowedOpId in functionalRoots.opsUsed", () => {
    const payload = require("../__fixtures__/analyzeV1.study.strict.json");
    const ops = collectOps(payload);

    for (const op of ops) {
      expect(SET.has(op)).toBe(true);
      // extra guard: no arrows / prose
      expect(op).not.toMatch(/[→↔]/);
      expect(op).not.toMatch(/\s/);
    }
  });
});

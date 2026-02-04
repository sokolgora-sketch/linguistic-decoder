import { ALLOWED_OP_IDS_V0_1 } from "../src/shared/ops/allowedOps.v0.1";
import {
  OPS_SEMANTICS_V0_1,
  OPS_SEMANTICS_VERSION,
} from "../src/shared/ops/allowedOps.semantics.v0.1";

describe("allowed ops semantics v0.1 lock", () => {
  it("covers every AllowedOpId exactly once", () => {
    const ids = ALLOWED_OP_IDS_V0_1.slice().sort();
    const semIds = Object.keys(OPS_SEMANTICS_V0_1).slice().sort();

    expect(semIds).toEqual(ids);
  });

  it("locks semantics snapshot (prevent silent drift)", () => {
    expect({ v: OPS_SEMANTICS_VERSION, table: OPS_SEMANTICS_V0_1 }).toMatchSnapshot();
  });

  it("keeps labels stable + non-empty", () => {
    for (const id of ALLOWED_OP_IDS_V0_1) {
      const s = (OPS_SEMANTICS_V0_1 as any)[id];
      expect(typeof s.label).toBe("string");
      expect(s.label.trim().length).toBeGreaterThan(0);
    }
  });
});

import { ALLOWED_OP_IDS_V0_1 } from "@/shared/ops/allowedOps.v0.1";

describe("allowed ops v0.1 — lock", () => {
  it("op id list is stable (snapshot)", () => {
    expect(ALLOWED_OP_IDS_V0_1).toMatchSnapshot();
  });
});

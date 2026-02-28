import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { parseEvalSpecV0_1, EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";

describe("Eval Spec Contract v0.1", () => {
  it("parses fixture and matches SSOT constant", () => {
    const p = path.join(process.cwd(), "tests/evals/evals.spec.v0.1.json");
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const spec = parseEvalSpecV0_1(raw);

    expect(spec).toEqual(EVAL_SPEC_V0_1);
  });

  it("snapshot: spec is stable (drift visible)", () => {
    expect(EVAL_SPEC_V0_1).toMatchSnapshot();
  });
});

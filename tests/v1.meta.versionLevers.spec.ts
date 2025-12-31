import { analyzeWordV1 } from "../src/v1/analyzeWordV1";

describe("v1 meta version levers", () => {
  it("includes engine/contract/ruleset/canon versions", () => {
    const out = analyzeWordV1("study");

    expect(out.engineVersion).toBeTruthy();
    expect(out.meta).toBeTruthy();

    expect(out.meta.engineVersion).toBeTruthy();
    expect(out.meta.contractVersion).toBeTruthy();
    expect((out.meta as any).rulesetVersion).toBeTruthy();
    expect((out.meta as any).canonVersion).toBeTruthy();
  });
});

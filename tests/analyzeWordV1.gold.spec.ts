import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("analyzeWordV1 gold words v1", () => {
  it("matches snapshot for 'study' (v1.0.0)", async () => {
    const result = await analyzeWordV1("study", "strict");

    // Strip non-deterministic metadata like timestamps
    const { engine_meta, ...stable } = result as any;

    expect(stable).toMatchSnapshot();
  });
});

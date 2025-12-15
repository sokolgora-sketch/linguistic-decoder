import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("analyzeWordV1 gold words v1", () => {
  it("matches snapshot for 'study' (v1.0.0)", async () => {
    const result = await analyzeWordV1("study", "strict");

    // Strip non-deterministic metadata like timestamps
    const { engine_meta, ...stable } = result as any;

    expect(stable).toMatchSnapshot();

    // Add a minimal check for the new stress test feature
    expect(result.sevenVoices?.stressTest).toBeDefined();
  });

  it("matches snapshot for 'damage' (v1.0.0)", async () => {
    const result = await analyzeWordV1("damage", "strict");
    const { engine_meta, ...stable } = result as any;
    expect(stable).toMatchSnapshot();

    // Add a minimal check for the new stress test feature
    expect(result.sevenVoices?.stressTest).toBeDefined();
    expect(result.sevenVoices?.stressTest.matches.length).toBeGreaterThan(0);
  });
});

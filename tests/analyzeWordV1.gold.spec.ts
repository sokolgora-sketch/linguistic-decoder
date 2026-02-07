import { analyzeWordV1 } from "../src/engine/analyzeWordV1";
import { normalizeForSnapshotV0_1 } from "./_helpers/snapshotNormalize.v0.1";
import { stripV1Tags } from "./helpers/stableSnapshot";

describe("analyzeWordV1 gold words v1", () => {
  it("matches snapshot for 'study' (v1.0.0)", async () => {
    const result = await analyzeWordV1("study", "strict");

    // Strip non-deterministic metadata like timestamps
    const { engine_meta, ...stable } = result as any;

    expect(normalizeForSnapshotV0_1(stripV1Tags(stable as any))).toMatchSnapshot();
  });

  it("matches snapshot for 'damage' (v1.0.0)", async () => {
    const result = await analyzeWordV1("damage", "strict");
    const { engine_meta, ...stable } = result as any;
    expect(normalizeForSnapshotV0_1(stripV1Tags(stable as any))).toMatchSnapshot();
  });
});


import { analyzeWordV1 } from "../src/v1/analyzeWordV1";
import { AnalysisResultV1Schema } from "../src/v1/schemaV1";

describe("v1 contract (zod-guarded)", () => {
  const words = ["study", "father", "mother", "love", "hope", "damage"];

  test.each(words)("analyzeWordV1('%s') matches AnalysisResultV1 schema", (w) => {
    const result = analyzeWordV1(w);
    const parsed = AnalysisResultV1Schema.safeParse(result);
    expect(parsed.success).toBe(true);
  });
});

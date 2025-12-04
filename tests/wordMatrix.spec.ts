import { analyzeWord } from "@/engine/analyzeWord";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe("WordMatrix v1", () => {
  it("builds a matrix for study", () => {
    const result = enginePayloadToAnalysisResult(analyzeWord("study"));

    expect(result.wordMatrix).toBeDefined();
    expect(result.wordMatrix?.word).toBe("study");
    expect(result.wordMatrix?.primary.voicePath).toBeDefined();
  });
});

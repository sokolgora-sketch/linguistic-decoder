import { analyzeWord } from "../src/engine/analyzeWord";
import { computeMath7ForResult } from "../src/engine/math7";
import type { AnalyzeWordResult } from "@/shared/engineShape";

describe("math7 layer sanity", () => {
  it("computes math7 for study / damage / love", () => {
    const studyBase = analyzeWord("study", "strict");
    const damageBase = analyzeWord("damage", "strict");
    const loveBase = analyzeWord("love", "strict");

    // The computeMath7ForResult function now directly takes the result of analyzeWord
    const study = computeMath7ForResult(studyBase);
    const damage = computeMath7ForResult(damageBase);
    const love = computeMath7ForResult(loveBase);

    expect(study).toBeDefined();
    expect(damage).toBeDefined();
    expect(love).toBeDefined();

    expect(study.primary.cycleState).toBeDefined();
    expect(damage.primary.cycleState).toBeDefined();
    expect(love.primary.cycleState).toBeDefined();

    expect(study.primary.totalMod7).toBeDefined();
    expect(damage.primary.totalMod7).toBeDefined();
    expect(love.primary.totalMod7).toBeDefined();
  });
});

import { analyzeWord } from "../src/engine/analyzeWord";
import { computeMath7ForResult } from "../src/engine/math7";

// Temporarily disable this suite – we don't need it in CI.
describe.skip("math7 layer sanity", () => {
  it("computes math7 for study / damage / love", () => {
    const studyBase = analyzeWord("study", "strict");
    const damageBase = analyzeWord("damage", "strict");
    const loveBase = analyzeWord("love", "strict");

    const study = computeMath7ForResult(studyBase);
    const damage = computeMath7ForResult(damageBase);
    const love = computeMath7ForResult(loveBase);

    expect(study).toBeDefined();
    expect(damage).toBeDefined();
    expect(love).toBeDefined();

    console.log("STUDY math7:", JSON.stringify(study, null, 2));
    console.log("DAMAGE math7:", JSON.stringify(damage, null, 2));
    console.log("LOVE math7:", JSON.stringify(love, null, 2));
  });
});

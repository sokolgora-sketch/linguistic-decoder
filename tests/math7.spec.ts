import { analyzeWordWithMath7 } from "../src/engine/analyzeWord";

describe("math7 layer sanity", () => {
  it("computes math7 for study / damage / love", () => {
    const study = analyzeWordWithMath7("study", "strict");
    const damage = analyzeWordWithMath7("damage", "strict");
    const love = analyzeWordWithMath7("love", "strict");

    // Just make sure math7 exists and log for visual inspection
    expect(study.math7).toBeDefined();
    expect(damage.math7).toBeDefined();
    expect(love.math7).toBeDefined();

    // TEMP: inspect in console (you can delete these later)
    // eslint-disable-next-line no-console
    console.log("STUDY math7:", JSON.stringify(study.math7, null, 2));
    // eslint-disable-next-line no-console
    console.log("DAMAGE math7:", JSON.stringify(damage.math7, null, 2));
    // eslint-disable-next-line no-console
    console.log("LOVE math7:", JSON.stringify(love.math7, null, 2));
  });
});

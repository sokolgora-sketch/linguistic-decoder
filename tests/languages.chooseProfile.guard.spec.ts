import { chooseProfile } from "@/functions/languages";

describe("chooseProfile (auto)", () => {
  it("does not misclassify common English 'st' words as german", () => {
    expect(chooseProfile("study").id).not.toBe("german");
    expect(chooseProfile("stop").id).not.toBe("german");
    expect(chooseProfile("street").id).not.toBe("german");
  });

  it("still detects strong german markers", () => {
    expect(chooseProfile("straße").id).toBe("german"); // ß
    expect(chooseProfile("schloss").id).toBe("german"); // sch
    expect(chooseProfile("pfand").id).toBe("german"); // pf
  });
});

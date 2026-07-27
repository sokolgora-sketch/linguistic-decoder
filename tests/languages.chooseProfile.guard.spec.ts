import { chooseProfile } from "@/functions/languages";

describe("chooseProfile (auto)", () => {
  it("does not misclassify common English 'st' words as german", () => {
    expect(chooseProfile("study").id).not.toBe("german");
    expect(chooseProfile("stop").id).not.toBe("german");
    expect(chooseProfile("street").id).not.toBe("german");
  });

  it("still detects strong german markers", () => {
    expect(chooseProfile("straße").id).toBe("german");
    expect(chooseProfile("schloss").id).toBe("german");
    expect(chooseProfile("pfand").id).toBe("german");
  });

  it("does not infer Turkish from ambiguous j, c, or ç alone", () => {
    expect(chooseProfile("dij").id).toBe("latin");
    expect(chooseProfile("dije").id).toBe("latin");
    expect(chooseProfile("jeta").id).toBe("latin");
    expect(chooseProfile("jo").id).toBe("latin");
    expect(chooseProfile("çocuk").id).toBe("latin");
    expect(chooseProfile("çay").id).toBe("latin");
  });

  it("detects Turkish only from strong auto-profile cues", () => {
    expect(chooseProfile("jalın").id).toBe("turkish");
    expect(chooseProfile("ışık").id).toBe("turkish");
    expect(chooseProfile("şeker").id).toBe("turkish");
    expect(chooseProfile("yağmur").id).toBe("turkish");
  });

  it("detects Albanian from strong auto-profile cues", () => {
    expect(chooseProfile("gjuhë").id).toBe("albanian");
    expect(chooseProfile("zemër").id).toBe("albanian");
    expect(chooseProfile("rrugë").id).toBe("albanian");
  });

  it("preserves explicit profile overrides for ambiguous spellings", () => {
    expect(chooseProfile("çay", "turkish").id).toBe("turkish");
    expect(chooseProfile("çay", "albanian").id).toBe("albanian");
    expect(chooseProfile("dij", "turkish").id).toBe("turkish");
    expect(chooseProfile("dij", "albanian").id).toBe("albanian");
  });
});

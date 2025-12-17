import { classifyVoicePath, parseVoicePath, ringOf } from "@/shared/patternAtlas.v1";

describe("patternAtlas.v1", () => {
  it("parses voices from messy input", () => {
    expect(parseVoicePath("  o -> e ")).toEqual(["O", "E"]);
    expect(parseVoicePath("zemër")).toEqual(["E", "Ë"]);
    expect(parseVoicePath("OE")).toEqual(["O", "E"]);
  });

  it("ringOf matches canonical rings", () => {
    expect(ringOf("O")).toBe(0);
    expect(ringOf("I")).toBe(1);
    expect(ringOf("U")).toBe(1);
    expect(ringOf("E")).toBe(2);
    expect(ringOf("Y")).toBe(2);
    expect(ringOf("A")).toBe(3);
    expect(ringOf("Ë")).toBe(3);
  });

  it("classifies O → E as centrifugal (outward)", () => {
    const c = classifyVoicePath("O → E");
    expect(c.normalized).toBe("O → E");
    expect(c.steps).toBe(1);
    expect(c.ringFrom).toBe(0);
    expect(c.ringTo).toBe(2);
    expect(c.polarity).toBe("centrifugal");
  });

  it("classifies A → O as centripetal (inward)", () => {
    const c = classifyVoicePath("A -> O");
    expect(c.normalized).toBe("A → O");
    expect(c.polarity).toBe("centripetal");
    expect(c.ringFrom).toBe(3);
    expect(c.ringTo).toBe(0);
  });

  it("classifies E → Y as orbital (same ring)", () => {
    const c = classifyVoicePath("E→Y");
    expect(c.polarity).toBe("orbital");
    expect(c.ringFrom).toBe(2);
    expect(c.ringTo).toBe(2);
  });

  it("throws on empty input", () => {
    expect(() => classifyVoicePath("")).toThrow();
  });
});

import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";

describe("Albanian source-form identity v0.1", () => {
  it("uses NFC, trimming, and Albanian-locale case matching", () => {
    expect(sameAlbanianSourceForm("  DALLIM ", "dallim")).toBe(true);
    expect(sameAlbanianSourceForm("GJITHC\u0327KA", "gjithçka")).toBe(true);
  });

  it("does not equate unrelated lexical forms", () => {
    expect(sameAlbanianSourceForm("DALLIM", "DALLOJ")).toBe(false);
  });
});

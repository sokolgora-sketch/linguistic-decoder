import fs from "node:fs";

describe("ui guardrail: InstrumentPanel spectrum stays on typed readout boundary", () => {
  it("does not use any-casts or top-level VM fallback for sevenPrinciplesSpectrum", () => {
    const text = fs.readFileSync("src/ui/instrument/InstrumentPanel.tsx", "utf8");

    expect(text).not.toContain("(vm as any)?.sevenPrinciplesSpectrum");
    expect(text).not.toContain("(vm as any)?.readout?.sevenPrinciplesSpectrum");
    expect(text).toContain("vm.readout.sevenPrinciplesSpectrum");
  });
});

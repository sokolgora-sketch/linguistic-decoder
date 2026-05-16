import fs from "node:fs";

const DARK_SURFACE_FILES = [
  "src/ui/instrument/sections/MaskCarrierCard.v0.1.tsx",
  "src/ui/instrument/sections/SevenPrinciplesSpectrumCard.tsx",
];

describe("Open Instrument dark surface guard", () => {
  it("keeps inspected result cards out of light default surfaces", () => {
    for (const file of DARK_SURFACE_FILES) {
      const source = fs.readFileSync(file, "utf8");

      expect(source).not.toMatch(/\bbg-white(?:\/\d+)?\b/);
      expect(source).not.toMatch(/\bbg-neutral-50\b/);
      expect(source).not.toMatch(/\bbg-gray-50\b/);
      expect(source).not.toMatch(/\bbg-slate-50\b/);
    }
  });
});

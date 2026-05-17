import fs from "node:fs";

const DARK_SURFACE_FILES = [
  "src/components/OriginClaimCard.tsx",
  "src/ui/candidates/CandidatesAccordion.tsx",
  "src/ui/instrument/InstrumentPanel.tsx",
  "src/ui/instrument/DeepRootHeartGateSummaryCard.tsx",
  "src/ui/instrument/ResonancePanel.v0.1.tsx",
  "src/ui/instrument/VoicePathCompare.tsx",
  "src/ui/instrument/sections/CountsRatiosCard.tsx",
  "src/ui/instrument/sections/EvidencePackageCard.tsx",
  "src/ui/instrument/sections/EvidenceTraceCard.tsx",
  "src/ui/instrument/sections/MaskCarrierCard.v0.1.tsx",
  "src/ui/instrument/sections/MeaningCard.tsx",
  "src/ui/instrument/sections/OracleProposeWithEngineOracleCard.v0.1.tsx",
  "src/ui/instrument/sections/PhoneticIpaPanel.v0.1.tsx",
  "src/ui/instrument/sections/RawJsonCard.tsx",
  "src/ui/instrument/sections/ReadoutCard.tsx",
  "src/ui/instrument/sections/SevenPrinciplesSpectrumCard.tsx",
  "src/ui/instrument/sections/ToolBoundaryCard.tsx",
  "src/ui/instrument/sections/WorldLanguageTreeCard.tsx",
];

describe("Open Instrument dark surface guard", () => {
  it("keeps inspected result cards out of light default surfaces", () => {
    for (const file of DARK_SURFACE_FILES) {
      const source = fs.readFileSync(file, "utf8");

      expect(source).not.toMatch(/\bbg-white(?:\/\d+)?\b/);
      expect(source).not.toMatch(/\bbg-neutral-50\b/);
      expect(source).not.toMatch(/\bbg-gray-50\b/);
      expect(source).not.toMatch(/\bbg-slate-50\b/);
      expect(source).not.toMatch(/\bbg-muted\/(?:10|20)\b/);
      expect(source).not.toMatch(/\bborder-black\/10\b/);
      expect(source).not.toMatch(/@\/components\/ui\/(?:card|button)/);
    }
  });
});

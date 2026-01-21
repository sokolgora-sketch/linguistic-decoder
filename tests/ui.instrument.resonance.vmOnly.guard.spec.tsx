import fs from "fs";

describe("ui guardrail: Resonance panel is VM-only (v0.1)", () => {
  it("does not reference raw payload fields directly", () => {
    const p = "src/ui/instrument/ResonancePanel.v0.1.tsx";
    const t = fs.readFileSync(p, "utf8");

    // Hard bans: these strings should never appear in the panel.
    expect(t.includes(".raw")).toBe(false);
    expect(t.includes("payload")).toBe(false);
    expect(t.includes("enginePayload")).toBe(false);
    expect(t.includes("req.url")).toBe(false);
  });
});

import fs from "fs";

describe("ui guardrail: InstrumentPanel does not access vm.raw at render time", () => {
  it("does not reference vm.raw", () => {
    const t = fs.readFileSync("src/ui/instrument/InstrumentPanel.tsx", "utf8");
    expect(t).not.toMatch(/\bvm\.raw\b/);
    expect(t).not.toMatch(/toPrettyJson\(\s*vm\.raw\s*\)/);
  });
});

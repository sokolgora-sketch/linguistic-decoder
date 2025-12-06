// tests/engineMetaSummary.spec.ts

import { buildEngineMetaSummary } from "../src/lib/engineMetaSummary";

describe("buildEngineMetaSummary", () => {
  it("builds a structured summary object from a raw analysis payload", () => {
    const fakeRawAnalysis = {
      engineVersion: "2025-11-16-core-2",
      mode: "strict",
      alphabet: "auto",
    };

    const summary = buildEngineMetaSummary(fakeRawAnalysis);

    expect(summary.engineName).toBe("SevenVoices Core");
    expect(summary.versionLine).toBe("core-2");
    expect(summary.modeLabel).toBe("strict");
    expect(summary.alphabetLabel).toBe("auto");
    expect(summary.notes).toContain("Raw version: 2025-11-16-core-2");
  });

  it("handles partial or missing metadata gracefully", () => {
    const summary = buildEngineMetaSummary({ engineVersion: "test-v1" });

    expect(summary.engineName).toBe("SevenVoices Core");
    expect(summary.versionLine).toBe("test-v1");
    expect(summary.modeLabel).toBe("unknown");
    expect(summary.alphabetLabel).toBe("unknown");
  });

  it("handles completely empty metadata", () => {
    const summary = buildEngineMetaSummary({});

    expect(summary.engineName).toBe("SevenVoices Core");
    expect(summary.versionLine).toBe("unknown");
    expect(summary.modeLabel).toBe("unknown");
    expect(summary.alphabetLabel).toBe("unknown");
  });
});

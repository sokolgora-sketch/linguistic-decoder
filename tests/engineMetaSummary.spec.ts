import { buildEngineMetaSummary } from "@/lib/engineMetaSummary";
import type { EnginePayload } from "@/shared/engineShape";

describe("buildEngineMetaSummary", () => {
  it("maps engine meta + options into a summary", () => {
    const payload = {
      word: "study",
      meta: {
        engineVersion: "0.2.0-symbolic",
        createdAt: "2025-12-09T04:44:01.493Z",
        mode: "strict",
      },
      // if EnginePayload needs more fields, keep them minimal + `as any`
      options: {
        alphabet: "auto",
        mode: "strict",
      },
    } as unknown as EnginePayload;

    const summary = buildEngineMetaSummary(payload);

    expect(summary).toEqual({
      engineLabel: "SevenVoices Core",
      build: "0.2.0-symbolic",
      modeLabel: "strict",
      alphabetLabel: "auto",
      rawVersion: "0.2.0-symbolic",
      engineName: "SevenVoices Core",
      versionLine: "0.2.0-symbolic",
      notes: "Raw version: 0.2.0-symbolic",
    });
  });

  it("falls back to unknown when meta is missing", () => {
    const summary = buildEngineMetaSummary({} as EnginePayload);

    expect(summary).toEqual({
      engineLabel: "SevenVoices Core",
      build: "unknown",
      modeLabel: "unknown",
      alphabetLabel: "unknown",
      rawVersion: "unknown",
      engineName: "SevenVoices Core",
      versionLine: "unknown",
      notes: "Raw version: unknown",
    });
  });
});

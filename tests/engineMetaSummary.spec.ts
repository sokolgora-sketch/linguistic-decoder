// tests/engineMetaSummary.spec.ts

import { buildEngineMetaSummary } from "../src/lib/engineMetaSummary";

describe("buildEngineMetaSummary", () => {
  it("joins version, mode and alphabet with separators", () => {
    const text = buildEngineMetaSummary({
      engineVersion: "2025-11-16-core-2",
      mode: "strict",
      alphabet: "auto",
    });

    expect(text).toBe("2025-11-16-core-2 · strict · auto");
  });

  it("handles partial metadata", () => {
    const onlyVersion = buildEngineMetaSummary({
      engineVersion: "core-v1",
      mode: "",
      alphabet: null,
    });

    expect(onlyVersion).toBe("core-v1");

    const onlyMode = buildEngineMetaSummary({
      engineVersion: "   ",
      mode: "experimental",
      alphabet: "",
    });

    expect(onlyMode).toBe("experimental");
  });

  it("returns 'unknown' when everything is empty", () => {
    const text = buildEngineMetaSummary({
      engineVersion: "",
      mode: "   ",
      alphabet: null,
    });

    expect(text).toBe("unknown");
  });
});

import { buildPublicSharePayload } from "@/lib/publicSharePayload";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

describe("buildPublicSharePayload", () => {
  it("builds a full public record when data is present", () => {
    const fakeId = "abc123";

    const result = {
      word: "test",
      engineMeta: {
        engineLabel: "Test Engine",
      },
      heartSummary: {
        primary: "Heart: test: U → I (rings 1 → 1)",
      },
      zhejiSummary: {
        statement: "Zheji statement for test",
      },
      symbolicSummary: {
        summary: "Symbolic summary for test",
      },
    } as unknown as AnalyzeWordResultUI;

    const record = buildPublicSharePayload(result, fakeId, new Date("2025-01-02T03:04:05.000Z"));

    expect(record.id).toBe(fakeId);
    expect(record.word).toBe("test");
    expect(record.engineLabel).toBe("Test Engine");
    expect(record.heartSummary).toBe("Heart: test: U → I (rings 1 → 1)");
    expect(record.zhejiSummary).toBe("Zheji statement for test");
    expect(record.symbolicSummary).toBe("Symbolic summary for test");
    expect(record.version).toBe("v1");
    expect(record.createdAt).toBe("2025-01-02T03:04:05.000Z");
  });

  it("handles missing optional fields defensively", () => {
    const result = {
      word: "test",
      // no engineMeta, no summaries
    } as unknown as AnalyzeWordResultUI;

    const record = buildPublicSharePayload(result, "id-2", new Date("2025-01-02T03:04:05.000Z"));

    expect(record.id).toBe("id-2");
    expect(record.word).toBe("test");
    expect(record.engineLabel).toBe("SevenVoices Core");
    expect(record.heartSummary).toBe("");
    expect(record.zhejiSummary).toBeUndefined();
    expect(record.symbolicSummary).toBeUndefined();
    expect(record.version).toBe("v1");
    expect(record.createdAt).toBe("2025-01-02T03:04:05.000Z");
  });
});
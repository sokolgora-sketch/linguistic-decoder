import { savePublicShare, loadPublicShare } from "@/lib/publicShareStore";
import type { PublicShareRecord } from "@/lib/publicShare.types";

describe("publicShareStore", () => {
  it("saves and loads a record by id", async () => {
    const record: PublicShareRecord = {
      id: "id-1",
      word: "test",
      engineLabel: "Test Engine",
      heartSummary: "Heart summary for test",
      zhejiSummary: "Zheji summary for test",
      symbolicSummary: "Symbolic summary for test",
      createdAt: "2025-01-01T00:00:00.000Z",
      version: "v1",
    };

    await savePublicShare(record);

    const loaded = await loadPublicShare("id-1");
    expect(loaded).toEqual(record);
  });

  it("returns null when id is not found", async () => {
    const loaded = await loadPublicShare("missing-id");
    expect(loaded).toBeNull();
  });
});

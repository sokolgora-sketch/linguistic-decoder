import {
  historyItemToDocData,
  docToHistoryItem,
  type HistoryDocData,
  type HistoryItemCore,
} from "@/lib/historyFirestore";

describe("historyFirestore mapping", () => {
  const coreItem: HistoryItemCore = {
    cacheId: "test-id",
    word: "study",
    mode: "strict",
    alphabet: "auto",
    engineVersion: "2025-11-16-core-2",
    solveMs: 3,
    createdAt: 1733131200000,
  };

  it("maps HistoryItemCore to flat Firestore doc data", () => {
    const doc = historyItemToDocData(coreItem);

    expect(doc.word).toBe("study");
    expect(doc.mode).toBe("strict");
    expect(doc.alphabet).toBe("auto");
    expect(doc.engineVersion).toBe("2025-11-16-core-2");
    expect(doc.solveMs).toBe(3);
    expect(doc.createdAt).toBe(1733131200000);
  });

  it("maps Firestore doc data back into HistoryItemCore", () => {
    const doc: HistoryDocData = {
      cacheId: "test-id",
      word: "study",
      mode: "strict",
      alphabet: "auto",
      engineVersion: "2025-11-16-core-2",
      solveMs: 3,
      createdAt: 1733131200000,
    };

    const item = docToHistoryItem("test-id", doc);

    expect(item.word).toBe("study");
    expect(item.mode).toBe("strict");
    expect(item.alphabet).toBe("auto");
    expect(item.engineVersion).toBe("2025-11-16-core-2");
    expect(item.solveMs).toBe(3);
    expect(item.createdAt).toBe(1733131200000);
  });

  it("normalises missing solveMs to null on round-trip", () => {
    const doc: Partial<HistoryDocData> = {
      cacheId: "test-id-2",
      word: "hope",
      mode: "open",
      alphabet: "auto",
      engineVersion: "mock-v0",
      createdAt: 1733134800000,
    };

    const item = docToHistoryItem("test-id-2", doc);
    expect(item.solveMs).toBeNull();

    const backDoc = historyItemToDocData(item);
    expect(backDoc.solveMs).toBeNull();
  });
});

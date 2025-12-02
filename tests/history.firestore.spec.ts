import {
  historyItemToDoc,
  docToHistoryItem,
  type HistoryDocData,
} from "../src/lib/historyFirestore";
import type {
  HistoryItemCore,
  HistoryEngineMeta,
} from "../src/lib/history";

describe("historyFirestore mapping", () => {
  const meta: HistoryEngineMeta = {
    engineVersion: "2025-11-16-core-2",
    mode: "strict",
    alphabet: "auto",
    solveMs: 3,
  };

  const coreItem: HistoryItemCore = {
    word: "study",
    mode: "strict",
    alphabet: "auto",
    engineMeta: meta,
    createdAt: "2025-12-02T12:00:00.000Z",
  };

  it("maps HistoryItemCore to flat Firestore doc data", () => {
    const doc = historyItemToDoc(coreItem);

    expect(doc.word).toBe("study");
    expect(doc.mode).toBe("strict");
    expect(doc.alphabet).toBe("auto");
    expect(doc.engineVersion).toBe("2025-11-16-core-2");
    expect(doc.solveMs).toBe(3);
    expect(doc.createdAt).toBe("2025-12-02T12:00:00.000Z");
    expect(doc.payloadVersion).toBe(1);
  });

  it("maps Firestore doc data back into HistoryItemCore", () => {
    const doc: HistoryDocData = {
      word: "study",
      mode: "strict",
      alphabet: "auto",
      engineVersion: "2025-11-16-core-2",
      solveMs: 3,
      createdAt: "2025-12-02T12:00:00.000Z",
      payloadVersion: 1,
    };

    const item = docToHistoryItem(doc);

    expect(item.word).toBe("study");
    expect(item.mode).toBe("strict");
    expect(item.alphabet).toBe("auto");
    expect(item.engineMeta.engineVersion).toBe("2025-11-16-core-2");
    expect(item.engineMeta.mode).toBe("strict");
    expect(item.engineMeta.alphabet).toBe("auto");
    expect(item.engineMeta.solveMs).toBe(3);
    expect(item.createdAt).toBe("2025-12-02T12:00:00.000Z");
  });

  it("normalises missing solveMs to null on round-trip", () => {
    const doc: HistoryDocData = {
      word: "hope",
      mode: "open",
      alphabet: "auto",
      engineVersion: "mock-v0",
      createdAt: "2025-12-02T13:00:00.000Z",
    };

    const item = docToHistoryItem(doc);
    expect(item.engineMeta.solveMs).toBeNull();

    const backDoc = historyItemToDoc(item);
    expect(backDoc.solveMs).toBeNull();
  });
});
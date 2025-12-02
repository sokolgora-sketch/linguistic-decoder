import {
  formatHistoryEngineMeta,
  makeHistoryKey,
  type HistoryEngineMeta,
  type HistoryItemCore,
  makeHistoryItemFromAnalysis,
  type AnalysisLikeForHistory,
} from "../src/lib/history";

describe("history core helpers", () => {
  const meta: HistoryEngineMeta = {
    engineVersion: "2025-11-16-core-2",
    mode: "strict",
    alphabet: "auto",
    solveMs: 2,
  };

  const item: HistoryItemCore = {
    word: "study",
    mode: "strict",
    alphabet: "auto",
    engineMeta: meta,
    createdAt: "2025-12-02T12:00:00.000Z",
  };

  it("formats engine meta in a stable one-line string", () => {
    const line = formatHistoryEngineMeta(meta);

    expect(line).toContain("engine=2025-11-16-core-2");
    expect(line).toContain("mode=strict");
    expect(line).toContain("alphabet=auto");
    expect(line).toContain("solveMs=2");
  });

  it("handles missing solveMs safely", () => {
    const line = formatHistoryEngineMeta({
      ...meta,
      solveMs: null,
    });

    expect(line).toContain("solveMs=?");
  });

  it("builds a stable key for a history item", () => {
    const key = makeHistoryKey(item);

    expect(key).toContain("study");
    expect(key).toContain("strict");
    expect(key).toContain("auto");
    expect(key).toContain("2025-12-02T12:00:00.000Z");
  });
});

describe("makeHistoryItemFromAnalysis", () => {
  const base: AnalysisLikeForHistory = {
    word: "study",
    mode: "strict",
    alphabet: "auto",
    engineVersion: "2025-11-16-core-2",
    solveMs: 2,
  };

  const fixedNow = new Date("2025-12-02T12:00:00.000Z");

  const fakeNow = () => fixedNow;

  it("maps analysis meta into HistoryItemCore", () => {
    const item = makeHistoryItemFromAnalysis(base, fakeNow);

    expect(item.word).toBe("study");
    expect(item.mode).toBe("strict");
    expect(item.alphabet).toBe("auto");

    expect(item.engineMeta.engineVersion).toBe("2025-11-16-core-2");
    expect(item.engineMeta.mode).toBe("strict");
    expect(item.engineMeta.alphabet).toBe("auto");
    expect(item.engineMeta.solveMs).toBe(2);

    expect(item.createdAt).toBe("2025-12-02T12:00:00.000Z");
  });

  it("normalises missing solveMs to null", () => {
    const item = makeHistoryItemFromAnalysis(
      { ...base, solveMs: undefined },
      fakeNow
    );

    expect(item.engineMeta.solveMs).toBeNull();
  });
});

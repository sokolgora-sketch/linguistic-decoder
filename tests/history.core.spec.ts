import {
  formatHistoryEngineMeta,
  makeHistoryKey,
  type HistoryEngineMeta,
  type HistoryItemCore,
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

import {
  loadPersistedEvalsRunStateV0_1,
  savePersistedEvalsRunStateV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

describe("public Evals browser-local persistence v0.1", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = jest.fn() as typeof fetch;
  });

  afterEach(() => {
    localStorage.clear();
    globalThis.fetch = originalFetch;
  });

  it("reads existing browser-local saved runs and series without remote GET", async () => {
    const state = {
      savedRuns: [{ id: "local-run-1" }],
      runSeries: [{ id: "local-series-1" }],
    };
    localStorage.setItem("zro.evals.savedRuns.v0.1", JSON.stringify(state.savedRuns));
    localStorage.setItem("zro.evals.runSeries.v0.1", JSON.stringify(state.runSeries));

    await expect(loadPersistedEvalsRunStateV0_1()).resolves.toEqual(state);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("writes saved runs and series locally without remote POST", async () => {
    const state = {
      savedRuns: [{ id: "local-run-2" }],
      runSeries: [{ id: "local-series-2" }],
    };

    await expect(savePersistedEvalsRunStateV0_1(state as never)).resolves.toEqual(state);
    expect(JSON.parse(localStorage.getItem("zro.evals.savedRuns.v0.1")!)).toEqual(state.savedRuns);
    expect(JSON.parse(localStorage.getItem("zro.evals.runSeries.v0.1")!)).toEqual(state.runSeries);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

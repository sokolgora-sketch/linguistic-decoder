describe("Instrument UI: RunContext/EngineMeta pickers v0.1", () => {
  test("engineVersion/alphabet/mode/strictInput can be sourced from result.contract (no placeholders)", async () => {
    const mod: any = await import("@/ui/instrument/contractAdapter");

    const fn =
      mod.adaptAnalysisToTelemetryVM ??
      mod.adaptAnalysisToTelemetryVm ??
      mod.adaptAnalysisToInstrumentVM ??
      mod.adaptAnalysisToInstrumentVm ??
      mod.adaptAnalysisToVM ??
      null;

    expect(typeof fn).toBe("function");

    const resultLike: any = {
      word: "x",
      // these are intentionally missing at top-level to prove fallback works:
      contract: {
        engineVersion: "engine.test.v0",
        mode: "strict",
        alphabet: "auto",
        // strictInput omitted on purpose (should derive from mode)
      },
      meta: {
        created: "1970-01-01T00:00:00.000Z",
      },
      // minimal scaffolding to keep adapter defensive:
      candidates: [],
      primaryPath: { voicePath: [] },
      raw: {},
    };

    const vm: any = fn(resultLike);
    expect(vm).toBeTruthy();
    expect(vm.readout).toBeTruthy();

    expect(vm.readout.engineVersion?.kind).toBe("present");
    expect(vm.readout.engineVersion?.value).toBe("engine.test.v0");

    expect(vm.readout.alphabet?.kind).toBe("present");
    expect(vm.readout.alphabet?.value).toBe("auto");

    expect(vm.readout.strictInput?.kind).toBe("present");
    expect(vm.readout.strictInput?.value).toBe(true);
  });
});

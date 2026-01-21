require("./helpers/whatwgGlobals.cjs");

describe("Telemetry VM: rootMap wiring", () => {
  it("adapts /api/analyze-v1 rootMap into vm.rootMap (present)", async () => {
    const { GET } = require("../app/api/analyze-v1/route");
    const { adaptAnalysisToTelemetryVM } = require("../src/ui/instrument/contractAdapter");

    const res = await GET({ url: "http://localhost/api/analyze-v1?word=study&mode=strict" } as any);
    expect(res.status).toBe(200);

    const json = await res.json();
    const vm = adaptAnalysisToTelemetryVM(json);

    expect(vm).toBeTruthy();
    expect(vm.rootMap).toBeTruthy();
    expect(vm.rootMap.kind).toBe("present");

    const rm = vm.rootMap.value;

    // Shape
    expect(Array.isArray(rm.tokens)).toBe(true);
    expect(Array.isArray(rm.keys)).toBe(true);
    expect(Array.isArray(rm.spans)).toBe(true);
    expect(typeof rm.composedMeaning).toBe("string");

    // Spot-check known token for 'study'
    expect(rm.tokens[0]?.token).toBe("SHTU");
  });
});

import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

describe("ui telemetry vm contract v0.1.2 — resonanceProfileV1", () => {
  it("adapts resonanceProfileV1 into VM (study strict)", async () => {
    const { GET } = await import("../app/api/analyze-v1/route");
    const req: any = { url: "http://localhost/api/analyze-v1?word=study&mode=strict" };
    const res = await GET(req);
    const json = await res.json();

    const vm = adaptAnalysisToTelemetryVM(json);

    expect(vm.resonanceProfileV1).toBeTruthy();
    expect(vm.resonanceProfileV1.kind).toBe("present");
    if (vm.resonanceProfileV1.kind === "present") {
      expect(vm.resonanceProfileV1.value.version).toBeTruthy();
      expect(vm.resonanceProfileV1.value.surface).toBeTruthy();
      expect(vm.resonanceProfileV1.value.normalized).toBeTruthy();
    }
  });
});

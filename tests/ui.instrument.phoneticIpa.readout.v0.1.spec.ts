import * as api from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

describe("ui/instrument: phoneticIpaV0_1 readout v0.1", () => {
  it("VM exposes phoneticIpaV0_1 when API emits it", async () => {
    const req = new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "rhythm", ipa: "/ɹɪðəm/" }),
    });

    const res: any = await api.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    const vm = adaptAnalysisToTelemetryVM(json);

    expect(vm.readout.phoneticIpaV0_1.kind).toBe("present");
    if (vm.readout.phoneticIpaV0_1.kind === "present") {
      expect(vm.readout.phoneticIpaV0_1.value.ipa).toBe("/ɹɪðəm/");
      expect(vm.readout.phoneticIpaV0_1.value.voices).toEqual(["I", "Ë"]);
    }
  });

  it("VM marks phoneticIpaV0_1 missing when absent", async () => {
    const req = new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "study" }),
    });

    const res: any = await api.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    const vm = adaptAnalysisToTelemetryVM(json);

    expect(vm.readout.phoneticIpaV0_1.kind).toBe("missing");
  });
});

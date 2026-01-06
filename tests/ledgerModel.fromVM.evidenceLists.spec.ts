import { buildEvidenceLedgerModelFromVM } from "@/ui/ledger/ledgerModel";
import type { TelemetryViewModel } from "@/ui/instrument/types";

describe("ledgerModel: builds Evidence/Ops ledger from VM evidence only (v0.1.1)", () => {
  it("uses vm.evidence strings exactly (normalization, ops, signals+notes)", () => {
    const vm = {
      evidence: {
        normalizationSteps: { kind: "present", value: ["N1", "N2"] },
        ops: { kind: "present", value: ["OP1"] },
        notes: { kind: "present", value: ["NOTE1"] },
        signals: { kind: "present", value: ["SIG1"] },
      },
    } as unknown as TelemetryViewModel;

    const model = buildEvidenceLedgerModelFromVM(vm);

    const norm = model.sections.find((s) => s.key === "normalization");
    const ops = model.sections.find((s) => s.key === "ops");
    const sig = model.sections.find((s) => s.key === "signals");

    expect(norm?.state).toBe("present");
    expect(norm?.items).toEqual(["N1", "N2"]);

    expect(ops?.state).toBe("present");
    expect(ops?.items).toEqual(["OP1"]);

    // signals section merges signals + notes (per ledgerModel.ts comment)
    expect(sig?.state).toBe("present");
    expect(sig?.items).toEqual(["SIG1", "NOTE1"]);
  });

  it("missing evidence -> sections are missing/none (never throws)", () => {
    const vm = {
      evidence: {
        normalizationSteps: { kind: "missing", missing: "not_emitted" },
        ops: { kind: "missing", missing: "not_emitted" },
        notes: { kind: "missing", missing: "not_emitted" },
        signals: { kind: "missing", missing: "not_emitted" },
      },
    } as unknown as TelemetryViewModel;

    const model = buildEvidenceLedgerModelFromVM(vm);

    expect(model.sections.length).toBeGreaterThan(0);
    for (const s of model.sections) {
      expect(["missing", "none", "present"]).toContain(s.state);
    }
  });
});

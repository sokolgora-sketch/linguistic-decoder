import { backfillEvidencePackageSignalsCountV01 } from "../app/api/analyze-v1/evidencePackage.signalsCount.backfill.v0.1";

describe("api/analyze-v1 evidencePackage signalsCount backfill (v0.1)", () => {
  it("backfills summary.signalsCount from final evidence when counts.signals is missing", () => {
    const ep: any = {
      version: "evidence_package.v0.1",
      summary: { voicePathDelta: "DIVERGE" },
      // counts intentionally missing
    };

    backfillEvidencePackageSignalsCountV01({
      evidencePackage: ep,
      finalEvidenceSignalsLen: 8,
    });

    expect(ep.summary.signalsCount).toBe(8);
    expect(ep.counts.signals).toEqual({ kind: "present", value: 8 });
  });
});

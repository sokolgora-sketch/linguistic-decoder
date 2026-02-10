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

  it("prefers counts.signals over final evidence fallback when counts is present", () => {
    const ep: any = {
      version: "evidence_package.v0.1",
      counts: { signals: { kind: "present", value: 3 } },
      summary: { voicePathDelta: "DIVERGE", signalsCount: 999 }, // should be overwritten to 3
    };

    backfillEvidencePackageSignalsCountV01({
      evidencePackage: ep,
      finalEvidenceSignalsLen: 8,
    });

    expect(ep.counts.signals).toEqual({ kind: "present", value: 3 });
    expect(ep.summary.signalsCount).toBe(3);
  });

  it("normalizes raw/string counts.signals into POM wrapper + sets summary.signalsCount", () => {
    const ep1: any = { version: "evidence_package.v0.1", counts: { signals: 4 }, summary: {} };
    backfillEvidencePackageSignalsCountV01({ evidencePackage: ep1, finalEvidenceSignalsLen: 8 });
    expect(ep1.counts.signals).toEqual({ kind: "present", value: 4 });
    expect(ep1.summary.signalsCount).toBe(4);

    const ep2: any = { version: "evidence_package.v0.1", counts: { signals: "5" }, summary: {} };
    backfillEvidencePackageSignalsCountV01({ evidencePackage: ep2, finalEvidenceSignalsLen: 8 });
    expect(ep2.counts.signals).toEqual({ kind: "present", value: 5 });
    expect(ep2.summary.signalsCount).toBe(5);
  });
});

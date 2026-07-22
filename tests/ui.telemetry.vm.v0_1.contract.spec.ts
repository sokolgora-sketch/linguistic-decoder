import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

// Fixture = raw /api/analyze-v1 output.
// We snapshot the UI Telemetry VM AFTER stripping dev/raw surfaces.
import studyStrict from "./__fixtures__/analyzeV1.study.strict.json";

function stripVolatileFields(x: any) {
  // Recursively delete volatile keys that should never be snapshotted.
  const seen = new Set<any>();
  const walk = (o: any) => {
    if (!o || typeof o !== "object") return;
    if (seen.has(o)) return;
    seen.add(o);

    if (Object.prototype.hasOwnProperty.call(o, "generatedAt")) {
      o.generatedAt = "<generatedAt>";
    }

    if (Array.isArray(o)) {
      for (const v of o) walk(v);
      return;
    }

    for (const k of Object.keys(o)) walk(o[k]);
  };

  walk(x);
}

function stripVmForSnapshot(vm: any) {
  // Deep clone to avoid mutations leaking between tests.
  const x = JSON.parse(JSON.stringify(vm));

  // Remove volatile timestamps anywhere in the snapshot tree.
  stripVolatileFields(x);

  // Volatile fields: never snapshot timestamps.
  if (x?.originClaim?.meta && typeof x.originClaim.meta === "object") {
}

  // Strip ALL raw surfaces (dev-only / non-contract / unstable).
  delete x.raw;

  if (Array.isArray(x.candidates)) {
    x.candidates = x.candidates.map((c: any) => {
      const cc = { ...c };
      delete cc.raw;
      return cc;
    });
  }

  // math: PresentOrMissing<MathTelemetryVM>
  if (x.math?.kind === "present" && x.math?.value) {
    const mv = { ...x.math.value };
    delete mv.raw;
    x.math = { ...x.math, value: mv };
  }

  // rejections: { items: PresentOrMissing<RejectionItemVM[]> }
  if (x.rejections?.items?.kind === "present" && Array.isArray(x.rejections.items.value)) {
    x.rejections.items.value = x.rejections.items.value.map((r: any) => {
      const rr = { ...r };
      delete rr.raw;
      return rr;
    });
  }

  // createdAt is allowed to appear later; keep snapshots stable if it becomes present.
  if (x.readout?.createdAt?.kind === "present") {
    x.readout.createdAt = { kind: "present", value: "<createdAt>" };
  }

  return x;
}

describe("ui telemetry vm contract v0.1", () => {
  it("adapts analyze-v1 payload into stable Telemetry VM (study strict)", () => {
    const vm = adaptAnalysisToTelemetryVM(studyStrict as any);
    expect(stripVmForSnapshot(vm)).toMatchSnapshot();
  });

  it("keeps required top-level keys", () => {
    const vm = adaptAnalysisToTelemetryVM(studyStrict as any) as any;
    expect(Object.keys(vm).sort()).toEqual(
      ["analysisStatusV0_1", "candidates", "evidence", "math", "originClaim", "originClaimGates", "raw", "readout", "rejections", "resonanceProfileV1", "rootMap", "soundRoots"].sort()
    );
  });
});

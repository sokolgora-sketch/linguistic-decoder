/**
 * UI Telemetry VM Contract v0.1.1
 * - Extends v0.1 by asserting candidates[].ops/notes/signals are adapted when present.
 * - Keeps v0.1 snapshot untouched.
 */
import fs from "fs";
import path from "path";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

function loadFixture(rel: string) {
  const abs = path.join(process.cwd(), rel);
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

function stripVolatile(vm: any) {
  const out = JSON.parse(JSON.stringify(vm));

  // do NOT include raw surfaces in the snapshot
  delete out.raw;

  // createdAt is volatile
  if (out?.readout?.createdAt?.kind === "present") {
    out.readout.createdAt.value = "<createdAt>";
  }

  // candidate raw is volatile/noisy
  if (Array.isArray(out?.candidates)) {
    for (const c of out.candidates) delete c.raw;
  }

  // math raw is volatile/noisy
  if (out?.math?.kind === "present") delete out.math.value.raw;

  // rejections raw
  if (out?.rejections?.items?.kind === "present") {
    for (const r of out.rejections.items.value) delete r.raw;
  }

  // Canonicalize volatile timestamps anywhere in the snapshot tree.

  const scrubGeneratedAt = (root) => {

    const seen = new Set();

    const walk = (o) => {

      if (!o || typeof o !== "object") return;

      if (seen.has(o)) return;

      seen.add(o);

      if (Object.prototype.hasOwnProperty.call(o, "generatedAt")) {

        o.generatedAt = "<generatedAt>";

      }

      if (Array.isArray(o)) { for (const v of o) walk(v); return; }

      for (const k of Object.keys(o)) walk(o[k]);

    };

    walk(root);

  };

  scrubGeneratedAt(out);


  return out;
}

describe("ui telemetry vm contract v0.1.1 (candidates evidence lists)", () => {
  it("adapts candidate ops/notes/signals when present (study strict fixture)", () => {
    const payload = loadFixture("tests/__fixtures__/analyzeV1.study.strict.json");
    const vm = adaptAnalysisToTelemetryVM(payload);
    const stable = stripVolatile(vm);

    /**
     * Voice paths contract (Telemetry VM):
     *
     * - voicePathDetected  : detected / normalized UI path (post-normalization).
     * - voicePathFunctional: functional / DeepRoot path (e.g. U→I when present).
     * - voicePathSurface   : RAW surface vowels from the word's surface spelling.
     *   For analyze-v1 payloads, prefer payload.heartInstrumentV1.surfaceVowels
     *   when emitted (e.g. 'study' => U-Y), even if evidence/functional is U-I.
     *
     * Rationale:
     * We keep "surface" strictly about observed surface vowels, not "normalized"
     * or "functional" vowels, to avoid conflating layers in the instrument UI.
     */
    // Snapshot locks the VM shape (v0.1.1)
    // Volatile fields: never snapshot timestamps.
    if (stable?.originClaim?.meta && typeof stable.originClaim.meta === "object") {

    }

    expect(stable).toMatchSnapshot();

    // Sanity: candidates exist
    expect(Array.isArray(vm.candidates)).toBe(true);
  });
});

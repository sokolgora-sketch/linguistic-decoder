import { analyzeWordV1 } from "../src/engine/analyzeWordV1";
import { assertJsonSafe } from "./helpers/contractShape";
import * as AA from "../src/shared/analysisAdapter";

function expectNonEmptyString(x: any, label: string) {
  if (typeof x !== "string" || x.trim().length === 0) {
    throw new Error(`Expected non-empty string for ${label}, got: ${typeof x}`);
  }
}

function pickAdapterFn(): (payload: any) => any {
  const anyAA = AA as any;

  const fn =
    anyAA.enginePayloadToAnalysisResult ??
    anyAA.analysisAdapter ??
    anyAA.analysisResultToEnginePayload ?? // not ideal, but keep as fallback
    anyAA.default;

  if (typeof fn !== "function") {
    const keys = Object.keys(anyAA).sort().join(", ");
    throw new Error(
      `No adapter function found in src/shared/analysisAdapter exports. Found keys: [${keys}]`
    );
  }

  return fn;
}

describe("Public contract v1 — minimal narrative guarantees (analysisAdapter)", () => {
  const adapt = pickAdapterFn();

  for (const word of ["study", "damage"]) {
    it(`${word}/strict: heart.narrative exists and is sane`, async () => {
      const out = await analyzeWordV1(word, "strict");
      assertJsonSafe(out);

      const adapted = adapt(out as any);
      const heart = (adapted as any)?.heart;

      if (!heart || typeof heart !== "object") {
        throw new Error("Missing object 'heart' in adapted analysis payload");
      }

      expectNonEmptyString(heart.narrative, "adapted.heart.narrative");

      const low = String(heart.narrative).toLowerCase();
      expect(low).not.toContain("undefined");
      expect(low).not.toContain("null");
    });
  }
});

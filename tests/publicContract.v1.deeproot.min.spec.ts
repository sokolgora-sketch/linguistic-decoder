import { analyzeWordV1 } from "../src/engine/analyzeWordV1";
import { assertJsonSafe } from "./helpers/contractShape";
import * as AA from "../src/shared/analysisAdapter";

function pickAdapterFn(): (payload: any) => any {
  const anyAA = AA as any;
  const fn =
    anyAA.enginePayloadToAnalysisResult ??
    anyAA.analysisAdapter ??
    anyAA.default;

  if (typeof fn !== "function") {
    throw new Error(
      `Could not find analysis adapter fn export (expected enginePayloadToAnalysisResult | analysisAdapter | default).`
    );
  }
  return fn;
}

function hasAnyNonEmptyStringDeep(x: any): boolean {
  if (typeof x === "string") return x.trim().length > 0;
  if (!x || typeof x !== "object") return false;

  if (Array.isArray(x)) return x.some(hasAnyNonEmptyStringDeep);

  for (const v of Object.values(x)) {
    if (hasAnyNonEmptyStringDeep(v)) return true;
  }
  return false;
}

function containsBadLiteralsDeep(x: any): boolean {
  if (typeof x === "string") {
    const low = x.toLowerCase();
    return low.includes("undefined") || low.includes("null");
  }
  if (!x || typeof x !== "object") return false;
  if (Array.isArray(x)) return x.some(containsBadLiteralsDeep);
  return Object.values(x).some(containsBadLiteralsDeep);
}

function expectNonEmptyObject(x: any, label: string) {
  if (!x || typeof x !== "object" || Array.isArray(x)) {
    throw new Error(`Expected object for ${label}, got: ${Array.isArray(x) ? "array" : typeof x}`);
  }
  if (Object.keys(x).length === 0) {
    throw new Error(`Expected non-empty object for ${label}, got: empty object`);
  }
}

function pickMinRootsArray(deepRoot: any): any[] | undefined {
  if (!deepRoot || typeof deepRoot !== "object") return undefined;
  if (Array.isArray(deepRoot.hypotheses)) return deepRoot.hypotheses;
  if (Array.isArray(deepRoot.candidates)) return deepRoot.candidates; // legacy fallback
  return undefined;
}

describe("Public contract v1 — minimal DeepRoot guarantees (analysisAdapter)", () => {
  const adapt = pickAdapterFn();

  it("study/strict: deepRoot may be absent; if present it must be sane", async () => {
    const out = await analyzeWordV1("study", "strict");
    assertJsonSafe(out);

    const adapted = adapt(out as any);
    const deepRoot = (adapted as any).deepRoot;

    if (typeof deepRoot === "undefined") return;

    assertJsonSafe(deepRoot);
    expectNonEmptyObject(deepRoot, "adapted.deepRoot");

    const arr = pickMinRootsArray(deepRoot);
    if (typeof arr !== "undefined") {
      assertJsonSafe(arr);
    }

    if (!hasAnyNonEmptyStringDeep(deepRoot)) {
      throw new Error("adapted.deepRoot is present but contains no non-empty string payload");
    }

    if (containsBadLiteralsDeep(deepRoot)) {
      throw new Error("adapted.deepRoot contains degraded literals ('undefined' or 'null')");
    }
  });

  it("damage/strict: deepRoot may be absent; if present it must be sane", async () => {
    const out = await analyzeWordV1("damage", "strict");
    assertJsonSafe(out);

    const adapted = adapt(out as any);
    const deepRoot = (adapted as any).deepRoot;

    if (typeof deepRoot === "undefined") return;

    assertJsonSafe(deepRoot);
    expectNonEmptyObject(deepRoot, "adapted.deepRoot");

    const arr = pickMinRootsArray(deepRoot);
    if (typeof arr !== "undefined") {
      assertJsonSafe(arr);
    }

    if (!hasAnyNonEmptyStringDeep(deepRoot)) {
      throw new Error("adapted.deepRoot is present but contains no non-empty string payload");
    }

    if (containsBadLiteralsDeep(deepRoot)) {
      throw new Error("adapted.deepRoot contains degraded literals ('undefined' or 'null')");
    }
  });
});

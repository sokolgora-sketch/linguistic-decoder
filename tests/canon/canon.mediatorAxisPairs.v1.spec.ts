import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";
import { stripV1Tags } from "../helpers/stableSnapshot";

function stableNormalize<T>(obj: T): T {
  // clone via JSON for snapshot stability (no functions/Map/etc in our payloads)
  const clone: any = JSON.parse(JSON.stringify(obj));

  // Remove volatile timestamp (determinism across runs)
  if (clone?.engine_meta?.timestampIso) delete clone.engine_meta.timestampIso;

  return clone as T;
}

function hasSignal(out: any, sig: string): boolean {
  const candidates = out?.candidates ?? [];
  return candidates.some((c: any) => Array.isArray(c?.signals) && c.signals.includes(sig));
}

describe("canon mediator axis pairs v1 (strict) — N4 Po/Jo lock", () => {
  test("po and jo both carry the N4 mediator-axis signal", async () => {
    const poRaw = await analyzeWordV1("po", "strict");
    const joRaw = await analyzeWordV1("jo", "strict");

    const po = stableNormalize(poRaw);
    const jo = stableNormalize(joRaw);

    // Structural sanity
    expect(po.word).toBe("po");
    expect(jo.word).toBe("jo");
    expect(po.mode).toBe("strict");
    expect(jo.mode).toBe("strict");

    // Decision-geometry lock
    expect(hasSignal(po, "pattern:N4:mediator-axis")).toBe(true);
    expect(hasSignal(jo, "pattern:N4:mediator-axis")).toBe(true);

    // Snapshot report (stable)
    expect({ po: stripV1Tags(po as any), jo: stripV1Tags(jo as any) }).toMatchSnapshot();
  });
});

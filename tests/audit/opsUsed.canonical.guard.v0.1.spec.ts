import { ALLOWED_OP_IDS_V0_1, normalizeToAllowedOpId } from "../../src/shared/ops/allowedOps.v0.1";

const ALLOWED = new Set(ALLOWED_OP_IDS_V0_1 as readonly string[]);

function collectOpsUsedDeep(x: unknown, out: string[] = []): string[] {
  if (Array.isArray(x)) {
    for (const v of x) collectOpsUsedDeep(v, out);
    return out;
  }
  if (x && typeof x === "object") {
    const obj = x as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (k === "opsUsed" && Array.isArray(v)) {
        for (const item of v) out.push(String(item));
      } else {
        collectOpsUsedDeep(v, out);
      }
    }
  }
  return out;
}

describe("audit: opsUsed canonical (v0.1)", () => {
  it("normalizeToAllowedOpId maps known legacy tokens into AllowedOpId", () => {
    expect(normalizeToAllowedOpId("identity")).toBe("exact");
    expect(normalizeToAllowedOpId("s-to-sh")).toBe("s_to_sh");
    expect(normalizeToAllowedOpId("final-a-to-ë")).toBe("final_swap");
    expect(normalizeToAllowedOpId("insert-h-around-gu")).toBe("optional_h_added");
    expect(normalizeToAllowedOpId("compound")).toBe("compound");
  });

  it("no emitted opsUsed tokens fall outside AllowedOpId vocabulary", async () => {
    // Use the same v1 entrypoint used by existing gold tests.
    const mod = await import("../../src/v1/analyzeWordV1");
    const analyzeWordV1 = (mod as any).analyzeWordV1 as (word: string) => unknown;

    const result = analyzeWordV1("study");

    const ops = collectOpsUsedDeep(result);
    const unknown = ops.filter((t) => !ALLOWED.has(t));

    expect(unknown).toEqual([]);
  });
});

import fs from "node:fs";

import { GET, POST } from "../../app/api/evals/state/route";

describe("public Evals shared-state endpoint v0.1", () => {
  const originalMode = process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;

  afterEach(() => {
    if (originalMode === undefined) {
      delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
    } else {
      process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = originalMode;
    }
  });

  it.each([undefined, "deterministic_only", "invalid_mode"]) (
    "denies GET when persistence configuration is %p",
    async (configuration) => {
      if (configuration === undefined) {
        delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
      } else {
        process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = configuration;
      }

      const response = await GET();
      expect(response.status).toBe(404);
      expect(response.headers.get("cache-control")).toBe("no-store");
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: "Shared Evals state is disabled.",
        reason: "EVALS_SHARED_STATE_DISABLED",
      });
    },
  );

  it("denies POST before JSON parsing", async () => {
    const json = jest.fn(() => {
      throw new Error("JSON parsing must not occur");
    });

    const response = await POST({ json } as unknown as Request);

    expect(response.status).toBe(404);
    expect(json).not.toHaveBeenCalled();
  });

  it("contains no filesystem access or state migration code", () => {
    const source = fs.readFileSync("app/api/evals/state/route.ts", "utf8");

    expect(source).not.toContain("node:fs");
    expect(source).not.toContain("readFile");
    expect(source).not.toContain("writeFile");
    expect(source).not.toContain("evals-state.v0.1.json");
  });
});

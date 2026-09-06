/**
 * /api/analyze-v1 — stability smoke test (curl + real Next server)
 *
 * This test ensures that for a given input, critical fields
 * in the response remain stable across multiple identical requests.
 *
 * Runs a real Next server on a test port, calls it, then shuts it down.
 *
 * Builds and starts an isolated production server.
 */

import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { startNextServer } from "./helpers/ownedNextServer";

function nextDistDir(): string {
  const v = (process.env.NEXT_DIST_DIR ?? "").trim();
  return v.length ? v : ".next";
}

jest.setTimeout(420_000);

let BASE: string;

// The user's function for the test
function curlJson(url: string) {
  const out = execSync(
    `curl --max-time 30 -fsS -H "accept: application/json" "${url}"`,
    { encoding: "utf8" }
  );
  return JSON.parse(out);
}

describe("/api/analyze-v1 stability (repeat GET)", () => {
  let server: Awaited<ReturnType<typeof startNextServer>> | undefined;

  beforeAll(async () => {
    // CI reliability: `next dev` can race on manifests (pages-manifest.json).
    // Use production build + `next start` for determinism.
    rmSync(nextDistDir(), { recursive: true, force: true });
    execSync("npm run build", {
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    });

    server = await startNextServer("start");
    BASE = server.base;
  }, 420_000);

  afterAll(async () => {
    await server?.stop();
  }, 15_000);

  it("returns valid JSON and stable critical fields across repeats", () => {
    const url = `${BASE}/api/analyze-v1?word=study&mode=strict`;

    const N = 10;
    const seen: any[] = [];

    for (let i = 0; i < N; i++) {
      const j = curlJson(url);

      expect(j).toBeTruthy();
      expect(j.word).toBe("study");

      // Critical invariants (the “instrument truth”)
      expect(Array.isArray(j?.evidence?.surfaceVowels)).toBe(true);
      expect(Array.isArray(j?.primaryPath?.voicePath)).toBe(true);

      // Save for stability compare
      seen.push({
        evidence_surface: j.evidence.surfaceVowels,
        primaryPath: j.primaryPath.voicePath,
        deepRoot_vowelPath: j?.deepRoot?.functionalRoots?.[0]?.vowelPath ?? null,
      });
    }

    // Ensure all repeats match the first observation
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i]).toEqual(seen[0]);
    }
  });
});
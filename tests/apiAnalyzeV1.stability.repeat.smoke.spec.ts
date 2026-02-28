/**
 * /api/analyze-v1 — stability smoke test (curl + real Next server)
 *
 * This test ensures that for a given input, critical fields
 * in the response remain stable across multiple identical requests.
 *
 * Runs a real Next server on a test port, calls it, then shuts it down.
 *
 * NOTE:
 * - We intentionally use `next dev` here for CI reliability.
 * - Do NOT run `ensureNextBuild()` in this test: it can race with parallel tests
 *   and mutate `.next/` while the dev server is booting, causing ENOENT on manifests.
 */

import { execSync, spawn } from "node:child_process";
import { rmSync } from "node:fs";
import http from "node:http";

function nextDistDir(): string {
  const v = (process.env.NEXT_DIST_DIR ?? "").trim();
  return v.length ? v : ".next";
}

jest.setTimeout(420_000);

const PORT = 3012; // Using a different port from other tests
const BASE = `http://127.0.0.1:${PORT}`;

// Helper to make HTTP requests and parse JSON, adapted from other tests
async function getJson(url: string, method = "GET", body: any = null) {
  const bodyString = body ? JSON.stringify(body) : "";
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(bodyString),
      Accept: "application/json",
    },
  };

  return new Promise<any>((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode ?? 0, json, raw: data });
        } catch (e) {
          reject(new Error(`Expected JSON but got: ${data.slice(0, 300)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(bodyString);
    req.end();
  });
}

// Helper to wait for the server to be ready, adapted from other tests
async function waitForHttpReady(url: string, timeoutMs = 120000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const { status } = await getJson(url);
      if (status === 200) return;
    } catch {
      // ignore until ready
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  throw new Error(`Server did not become HTTP-ready: ${url}`);
}

// The user's function for the test
function curlJson(url: string) {
  const out = execSync(
    `curl -fsS -H "accept: application/json" "${url}"`,
    { encoding: "utf8" }
  );
  return JSON.parse(out);
}

describe("/api/analyze-v1 stability (repeat GET)", () => {
  let proc: ReturnType<typeof spawn> | null = null;
  let logs = "";

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

    proc = spawn("npm", ["run", "start", "--", "-p", String(PORT)], {
      env: {
        ...process.env,
        PORT: String(PORT),
        NEXT_TELEMETRY_DISABLED: "1",
        NODE_ENV: "production",
      },
      stdio: ["ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
    });

    // IMPORTANT: drain pipes or the child can stall and never become ready.
    proc.stdout?.setEncoding("utf8");
    proc.stderr?.setEncoding("utf8");
    proc.stdout?.on("data", (d) => {
      logs += d;
      if (logs.length > 200000) logs = logs.slice(-200000);
    });
    proc.stderr?.on("data", (d) => {
      logs += d;
      if (logs.length > 200000) logs = logs.slice(-200000);
    });

    try {
      await waitForHttpReady(`${BASE}/api/analyze-v1?word=study&mode=strict`);
    } catch (e) {
      console.error("Dev server failed to become ready. Last logs:\n", logs.slice(-4000));
      throw e;
    }
  }, 420_000);

  afterAll(async () => {
    if (!proc) return;

    // Graceful stop first
    try { proc.kill("SIGTERM"); } catch {}

    // Give it a moment to exit
    await new Promise((r) => setTimeout(r, 1500));

    // If still alive, kill hard. On *nix, kill the whole process group.
    if (proc.exitCode == null) {
      try {
        if (process.platform !== "win32" && proc.pid) {
          process.kill(-proc.pid, "SIGKILL");
        } else {
          proc.kill("SIGKILL");
        }
      } catch {}
    }

    proc = null;
  }, 60_000);

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
/**
 * /api/analyze-v1 — evidence wiring smoke (curl + real Next server)
 *
 * This is the integration lock:
 * - evidence.math7 present
 * - evidence.math7 deep-equals heart.math7
 * - raw.evidence mirrors root evidence
 *
 * Runs a real Next server on a test port, calls it, then shuts it down.
 */

import { spawn } from "node:child_process";
import http from "node:http";

jest.setTimeout(180_000);

const PORT = 3011;
const BASE = `http://localhost:${PORT}`;

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

function getJson(url: string) {
  return new Promise<any>((resolve, reject) => {
    http
      .get(url, (res) => {
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
      })
      .on("error", reject);
  });
}

function postJson(url: string, body: any) {
  const bodyString = JSON.stringify(body);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(bodyString),
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

describe("/api/analyze-v1 evidence smoke (curl)", () => {
  let proc: ReturnType<typeof spawn> | null = null;

  beforeAll(async () => {
    // Use "next start" on a built app if you want max realism.
    // For speed + reliability in CI here, dev is acceptable.
    proc = spawn("npm", ["run", "dev", "--", "-p", String(PORT)], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ["ignore", "pipe", "pipe"],
    });

    await waitForHttpReady(`${BASE}/api/analyze-v1?word=study&mode=strict`);
  }, 180_000);

  afterAll(async () => {
    if (!proc) return;
    proc.kill("SIGTERM");
    proc = null;
  });

  test(
    "GET wiring: evidence.math7 exists, equals heart.math7, raw.evidence mirrors evidence",
    async () => {
      const { status, json, raw } = await getJson(
        `${BASE}/api/analyze-v1?word=study&mode=strict`
      );

      expect(status).toBe(200);

      expect(json?.heart?.math7).toBeTruthy();
      expect(json?.evidence?.math7).toBeTruthy();
      expect(json.evidence.math7).toEqual(json.heart.math7);

      expect(json?.raw?.evidence).toBeTruthy();
      expect(json.raw.evidence).toEqual(json.evidence);

      // sanity: response wasn't HTML
      expect(raw.trim().startsWith("{")).toBe(true);
    },
    30000
  );

  test(
    "POST wiring: evidence.math7 exists, equals heart.math7, raw.evidence mirrors evidence",
    async () => {
      const { status, json, raw } = await postJson(`${BASE}/api/analyze-v1`, {
        word: "study",
        mode: "strict",
      });

      expect(status).toBe(200);

      expect(json?.heart?.math7).toBeTruthy();
      expect(json?.evidence?.math7).toBeTruthy();
      expect(json.evidence.math7).toEqual(json.heart.math7);

      expect(json?.raw?.evidence).toBeTruthy();
      expect(json.raw.evidence).toEqual(json.evidence);

      // sanity: response wasn't HTML
      expect(raw.trim().startsWith("{")).toBe(true);
    },
    30000
  );
});

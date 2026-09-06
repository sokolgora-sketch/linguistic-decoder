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

import { requestJson, startNextServer } from "./helpers/ownedNextServer";

jest.setTimeout(180_000);

let BASE: string;
const getJson = (url: string) => requestJson(url);
const postJson = (url: string, body: unknown) => requestJson(url, "POST", body);

describe("/api/analyze-v1 evidence smoke (curl)", () => {
  let server: Awaited<ReturnType<typeof startNextServer>> | undefined;

  beforeAll(async () => {
    server = await startNextServer("dev");
    BASE = server.base;
  }, 180_000);

  afterAll(async () => {
    await server?.stop();
  }, 15_000);

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


  test(
    "GET carrier lane: EvidencePackage keeps functional delta separate from carrier delta when ipa is provided",
    async () => {
      const ipa = encodeURIComponent("/ˈrɪð(ə)m/");
      const { status, json, raw } = await getJson(
        `${BASE}/api/analyze-v1?word=rhythm&mode=strict&ipa=${ipa}&language=English`
      );

      expect(status).toBe(200);

      const sum: any = json?.evidencePackage?.summary;
      expect(sum).toBeTruthy();

      // Functional and IPA carrier remain independent truth layers.
      // Slice G rhythm normalization:
      // surface Y -> functional I→Ë;
      // IPA carrier also emits I→Ë.
      expect(sum.voicePathSurface).toBe("Y");
      expect(sum.voicePathFunctional).toBe("I → Ë");
      expect(sum.voicePathDelta).toBe("DIVERGE");
      expect(sum.voicePathCarrier).toBe("I → Ë");
      expect(sum.voicePathCarrierDelta).toBe("DIVERGE");

      // sanity: response wasn't HTML
      expect(raw.trim().startsWith("{")).toBe(true);
    },
    30000
  );

  test(
    "POST carrier lane: EvidencePackage keeps functional delta separate from carrier delta when ipa is provided",
    async () => {
      const { status, json, raw } = await postJson(`${BASE}/api/analyze-v1`, {
        word: "rhythm",
        mode: "strict",
        ipa: "/ˈrɪð(ə)m/",
        language: "English",
      });

      expect(status).toBe(200);

      const sum: any = json?.evidencePackage?.summary;
      expect(sum).toBeTruthy();

      expect(sum.voicePathSurface).toBe("Y");
      expect(sum.voicePathFunctional).toBe("I → Ë");
      expect(sum.voicePathDelta).toBe("DIVERGE");
      expect(sum.voicePathCarrier).toBe("I → Ë");
      expect(sum.voicePathCarrierDelta).toBe("DIVERGE");

      // sanity: response wasn't HTML
      expect(raw.trim().startsWith("{")).toBe(true);
    },
    30000
  );
});

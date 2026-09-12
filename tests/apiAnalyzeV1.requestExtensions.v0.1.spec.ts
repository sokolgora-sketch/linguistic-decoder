import fs from "node:fs";
import path from "node:path";

import { GET, POST } from "../app/api/analyze-v1/route";

type JsonRecord = Record<string, any>;

async function post(body: unknown): Promise<{ status: number; json: JsonRecord }> {
  const response = await POST(
    new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );

  return { status: response.status, json: await response.json() };
}

async function get(
  params: Record<string, string> = {},
): Promise<{ status: number; json: JsonRecord }> {
  const url = new URL("http://localhost/api/analyze-v1");
  for (const [key, value] of Object.entries({ word: "study", ...params })) {
    url.searchParams.set(key, value);
  }

  const response = await GET(new Request(url));
  return { status: response.status, json: await response.json() };
}

function inputMetadata(json: JsonRecord): JsonRecord {
  return json?.meta?.inputs ?? {};
}

function seedEnabled(json: JsonRecord): boolean {
  return inputMetadata(json).brainCandidatesSeedFallback === true;
}

function hasSeedSideChannel(json: JsonRecord): boolean {
  return Array.isArray(json?.originClaim?.meta?.inputs?.brainCandidates);
}

describe("/api/analyze-v1 request extensions v0.1", () => {
  it("declares named extension fields while retaining top-level passthrough", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "app/api/analyze-v1/route.ts"),
      "utf8",
    );
    const start = source.indexOf("const BodySchema =");
    const end = source.indexOf(".passthrough();", start);
    const schemaBlock = source.slice(start, end + ".passthrough();".length);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(schemaBlock).toMatch(/targetSenseId\s*:/);
    expect(schemaBlock).toMatch(/targetSenseLabel\s*:/);
    expect(schemaBlock).toMatch(/opts\s*:/);
    expect(schemaBlock).toContain("brainCandidatesSeedFallback");
    expect(schemaBlock).toContain("seedBrainCandidates");
    expect(schemaBlock).toContain(".passthrough();");
  });

  it("preserves target-sense normalization and GET/POST parity", async () => {
    const targetSenseLabel = "  a fashion or manner  ";
    const getResult = await get({
      targetSenseId: "  explicit_sense  ",
      targetSenseLabel,
    });
    const postResult = await post({
      word: "study",
      targetSenseId: "  explicit_sense  ",
      targetSenseLabel,
    });

    expect(getResult.status).toBe(200);
    expect(postResult.status).toBe(200);
    expect(inputMetadata(getResult.json)).toMatchObject({
      targetSenseId: "explicit_sense",
      targetSenseLabel: "a fashion or manner",
    });
    expect(inputMetadata(postResult.json)).toMatchObject({
      targetSenseId: "explicit_sense",
      targetSenseLabel: "a fashion or manner",
    });
  });

  it("preserves an explicit target-sense ID without a label", async () => {
    const result = await post({
      word: "study",
      targetSenseId: "  explicit_only  ",
    });

    expect(result.status).toBe(200);
    expect(inputMetadata(result.json)).toMatchObject({
      targetSenseId: "explicit_only",
    });
    expect(inputMetadata(result.json)).not.toHaveProperty("targetSenseLabel");
  });

  it("preserves label-only ID derivation, Unicode normalization, and the length cap", async () => {
    const unicodeResult = await post({
      word: "study",
      targetSenseLabel: "  \u00C9lan / \u7269\u8A9E  ",
    });
    const longLabel = "x".repeat(120);
    const longResult = await post({
      word: "study",
      targetSenseLabel: ` ${longLabel} `,
    });

    expect(unicodeResult.status).toBe(200);
    expect(inputMetadata(unicodeResult.json)).toMatchObject({
      targetSenseId: "user_sense_\u00E9lan_\u7269\u8A9E",
      targetSenseLabel: "\u00C9lan / \u7269\u8A9E",
    });
    expect(longResult.status).toBe(200);
    expect(inputMetadata(longResult.json)).toMatchObject({
      targetSenseId: `user_sense_${"x".repeat(80)}`,
      targetSenseLabel: longLabel,
    });
  });

  it("preserves blank and wrong-type target-sense compatibility", async () => {
    const blankResult = await post({
      word: "study",
      targetSenseId: "   ",
      targetSenseLabel: "   ",
    });
    const wrongTypeResult = await post({
      word: "study",
      targetSenseId: 42,
      targetSenseLabel: false,
    });

    expect(blankResult.status).toBe(200);
    expect(wrongTypeResult.status).toBe(200);
    expect(inputMetadata(blankResult.json)).not.toHaveProperty("targetSenseId");
    expect(inputMetadata(blankResult.json)).not.toHaveProperty("targetSenseLabel");
    expect(inputMetadata(wrongTypeResult.json)).not.toHaveProperty("targetSenseId");
    expect(inputMetadata(wrongTypeResult.json)).not.toHaveProperty("targetSenseLabel");
  });

  it.each([
    ["brainCandidatesSeedFallback", true, true],
    ["brainCandidatesSeedFallback", false, false],
    ["brainCandidatesSeedFallback", "true", true],
    ["brainCandidatesSeedFallback", "false", true],
    ["brainCandidatesSeedFallback", 1, true],
    ["brainCandidatesSeedFallback", 0, false],
    ["brainCandidatesSeedFallback", null, false],
    ["brainCandidatesSeedFallback", [], true],
    ["brainCandidatesSeedFallback", {}, true],
    ["seedBrainCandidates", true, true],
    ["seedBrainCandidates", false, false],
    ["seedBrainCandidates", "true", true],
    ["seedBrainCandidates", "false", true],
    ["seedBrainCandidates", 1, true],
    ["seedBrainCandidates", 0, false],
    ["seedBrainCandidates", null, false],
    ["seedBrainCandidates", [], true],
    ["seedBrainCandidates", {}, true],
  ])(
    "preserves POST seed coercion for %s=%p",
    async (field, value, expectedEnabled) => {
      const result = await post({ word: "hope", opts: { [field]: value } });

      expect(result.status).toBe(200);
      expect(seedEnabled(result.json)).toBe(expectedEnabled);
      expect(hasSeedSideChannel(result.json)).toBe(expectedEnabled);
    },
  );

  it("keeps omitted seed options disabled and ignores unrelated opts members", async () => {
    const omitted = await post({ word: "hope" });
    const unrelated = await post({
      word: "hope",
      opts: { unrelated: "request_extension_unique_value" },
    });

    expect(omitted.status).toBe(200);
    expect(unrelated.status).toBe(200);
    expect(seedEnabled(omitted.json)).toBe(false);
    expect(seedEnabled(unrelated.json)).toBe(false);
    expect(hasSeedSideChannel(omitted.json)).toBe(false);
    expect(hasSeedSideChannel(unrelated.json)).toBe(false);
    expect(JSON.stringify(unrelated.json)).not.toContain(
      "request_extension_unique_value",
    );
  });

  it.each(["seed", "seedBrainCandidates", "brainCandidatesSeedFallback"])(
    "preserves exact GET query alias enablement for %s",
    async (alias) => {
      const enabled = await get({ word: "hope", [alias]: "1" });
      const disabled = await get({ word: "hope", [alias]: "true" });

      expect(enabled.status).toBe(200);
      expect(disabled.status).toBe(200);
      expect(seedEnabled(enabled.json)).toBe(true);
      expect(hasSeedSideChannel(enabled.json)).toBe(true);
      expect(seedEnabled(disabled.json)).toBe(false);
      expect(hasSeedSideChannel(disabled.json)).toBe(false);
    },
  );

  it("preserves unrelated top-level POST passthrough without forwarding it", async () => {
    const result = await post({
      word: "study",
      unexpected: "top_level_extension_unique_value",
    });

    expect(result.status).toBe(200);
    expect(JSON.stringify(result.json)).not.toContain(
      "top_level_extension_unique_value",
    );
  });
});

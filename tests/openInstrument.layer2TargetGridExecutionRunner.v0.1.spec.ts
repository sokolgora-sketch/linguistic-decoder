import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const runnerPath = path.join(process.cwd(), "scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs");

function runJson(args: string[]): unknown {
  return JSON.parse(execFileSync("node", [runnerPath, ...args], { encoding: "utf8" }));
}

describe("Open Instrument Layer 2 target-grid execution runner v0.1", () => {
  it("passes deterministic self-check without provider execution", () => {
    const result = runJson(["--self-check"]) as {
      ok: boolean;
      targetCount: number;
      requestCount: number;
      allNullClassification: string;
      reviewedOutputPath: string;
      providerIdentity: {
        providerFamily: string;
        providerName: string;
        model: string;
        endpointClass: string;
      };
    };

    expect(result.ok).toBe(true);
    expect(result.targetCount).toBe(8);
    expect(result.requestCount).toBe(8);
    expect(result.allNullClassification).toBe("TARGET_GRID_ALL_NULL_ACCEPTED");
    expect(result.reviewedOutputPath).toBe("docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json");
    expect(result.providerIdentity).toEqual({
      providerFamily: "local_only_openai_compatible",
      providerName: "ollama_openai_compat",
      model: "llama3.1:8b",
      endpointClass: "localhost_only",
    });
  });

  it("prints the exact reviewed target requests with prompt and body hashes", () => {
    const requests = runJson(["--print-reviewed-requests"]) as Array<{
      targetId: string;
      promptSha256: string;
      requestBodySha256: string;
      requestBody: {
        model: string;
        temperature: number;
        response_format?: {
          type: string;
        };
      };
    }>;

    expect(requests.map((request) => request.targetId)).toEqual([
      "comic::COM::Albanian",
      "comic::COM::Latin",
      "comic::COM::Greek",
      "comic::COM::Sanskrit",
      "comic::IC::Albanian",
      "comic::IC::Latin",
      "comic::IC::Greek",
      "comic::IC::Sanskrit",
    ]);

    expect(requests.every((request) => /^[0-9a-f]{64}$/.test(request.promptSha256))).toBe(true);
    expect(requests.every((request) => /^[0-9a-f]{64}$/.test(request.requestBodySha256))).toBe(true);
    expect(requests.every((request) => request.requestBody.model === "llama3.1:8b")).toBe(true);
    expect(requests.every((request) => request.requestBody.temperature === 0)).toBe(true);
    expect(requests.every((request) => request.requestBody.response_format?.type === "json_object")).toBe(true);
  });

  it("refuses execution without explicit reviewed execution flag", () => {
    expect(() => execFileSync("node", [runnerPath], { encoding: "utf8", stdio: "pipe" })).toThrow(/missing explicit --execute-reviewed-layer2-target-grid/);
  });

  it("contains runner implementation hooks and fail-closed checks", () => {
    const source = readFileSync(runnerPath, "utf8");

    expect(source).toContain('const RUNNER_SCHEMA_VERSION = "open-instrument.layer2-target-grid-execution-runner.v0.1"');
    expect(source).toContain('const REQUIRED_EXECUTION_FLAG = "--execute-reviewed-layer2-target-grid"');
    expect(source).toContain("function buildTargetPrompt");
    expect(source).toContain("function buildRequestBody");
    expect(source).toContain("PROVIDER_JSON_RESPONSE_CONTRACT_HARDENING_V0_1");
    expect(source).toContain('type: "json_object"');
    expect(source).toContain("function validateReviewedExecutionBaseOrThrow");
    expect(source).toContain("function validateProviderIdentityOrThrow");
    expect(source).toContain("function validateOutputPathOrThrow");
    expect(source).toContain("async function callProviderForTarget");
    expect(source).toContain("async function executeReviewedTargetGrid");
    expect(source).toContain("writeFileSync(outputPath");
    expect(source).toContain("fetch(endpoint");
  });

  it("keeps execution gated and reviewed-provider-only", () => {
    const source = readFileSync(runnerPath, "utf8");

    expect(source).toContain("Refusing to run: missing explicit");
    expect(source).toContain("local_only_openai_compatible");
    expect(source).toContain("ollama_openai_compat");
    expect(source).toContain("llama3.1:8b");
    expect(source).toContain("localhost_only");
    expect(source).toContain("http://127.0.0.1:11434/v1");
    expect(source).toContain("baseUrl must be reviewed localhost Ollama OpenAI-compatible endpoint");
    expect(source).not.toContain("apiKey");
    expect(source).not.toContain("authorization:");
    expect(source).not.toContain("Bearer");
    expect(source).not.toContain("api.openai.com");
    expect(source).not.toContain("deepseek");
  });

  it("captures provider non-JSON output as a deterministic invalidated target result", () => {
    const script = `
      import {
        PROVIDER_MESSAGE_CONTENT_JSON_OBJECT_ERROR,
        REVIEWED_PROVIDER_IDENTITY,
        buildProviderNonJsonInvalidatedTargetResult,
        buildRequestBody,
      } from "./scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs";

      const target = {
        word: "comic",
        stage: "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY",
        segmentation: "COM + IC",
        chunk: "COM",
        candidateLanguage: "Albanian",
        sourceLanguage: "English",
        targetId: "comic::COM::Albanian",
        targetStatus: "pending",
      };

      const request = buildRequestBody(target, REVIEWED_PROVIDER_IDENTITY);
      const result = buildProviderNonJsonInvalidatedTargetResult({
        target,
        request,
        messageContent: "not json provider prose",
        rawText: JSON.stringify({ choices: [{ message: { content: "not json provider prose" } }] }),
        error: new Error(PROVIDER_MESSAGE_CONTENT_JSON_OBJECT_ERROR),
      });

      console.log(JSON.stringify(result));
    `;

    const output = execFileSync("node", ["--input-type=module", "-e", script], {
      encoding: "utf8",
    });

    const result = JSON.parse(output);

    expect(result.outcomeClassification).toBe("TARGET_INVALIDATED");
    expect(result.validation.status).toBe("failed");
    expect(result.validation.errors).toContain("provider message content must be one JSON object");
    expect(result.response.candidate).toBeNull();
    expect(result.response.nullAccepted).toBe(false);
    expect(JSON.stringify(result.response)).not.toContain("not json provider prose");
    expect(result.providerRawPayloadSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(result.responseSha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("keeps non-JSON capture non-retrying and artifact-safe by construction", () => {
    const source = readFileSync(runnerPath, "utf8");

    expect(source).toContain("NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_V0_1");
    expect(source).toContain("buildProviderNonJsonInvalidatedTargetResult");
    expect(source).toContain("TARGET_INVALIDATED");
    expect(source).toContain("provider message content must be one JSON object");
    expect(source).toContain("allNonJsonInvalidatedArtifact");
    expect(source).toContain("every request must require provider JSON object response format");
    expect(source).not.toMatch(/retryProvider|retry provider|setTimeout\(/i);
  });

});

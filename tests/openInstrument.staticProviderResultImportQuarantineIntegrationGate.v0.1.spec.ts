import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const helperPath = path.join(root, "scripts/openInstrumentStaticProviderResultImportQuarantineValidation.v0.1.mjs");
const fixturePath = path.join(root, "docs/open-instrument/fixtures/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-static-fixture-v0.1.json");

const forbiddenKeys = [
  "providerOutput",
  "providerOutputText",
  "rawProviderOutput",
  "rawProviderResponse",
  "responseText",
  "rawResponseText",
  "modelOutput",
  "modelOutputText",
  "evidenceGranted",
  "evidencePromoted",
  "originClaim",
  "candidateTruthEvidence",
  "publicationText",
  "rankedCandidate",
  "score",
  "scoreValue",
  "runtimePayload",
  "apiPayload",
  "uiPayload",
  "secret",
  "apiKey",
];

function collectKeys(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((item) => collectKeys(item, keys));
    return keys;
  }

  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      keys.push(key);
      collectKeys(nested, keys);
    });
  }

  return keys;
}

describe("Open Instrument static provider-result import quarantine integration gate v0.1", () => {
  it("blocks execution, scoring, ranking, publication, runtime wiring, and evidence promotion", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.executionCount).toBe(1);
    expect(fixture.requestCount).toBe(1);
    expect(fixture.responseCaptureCount).toBe(1);
    expect(fixture.retryCount).toBe(0);
    expect(fixture.rerunCount).toBe(0);

    expect(fixture.nonExecutionStatement.providerExecutionStatus).toBe("provider_execution_not_authorized");
    expect(fixture.nonExecutionStatement.modelCallStatus).toBe("model_call_not_authorized");
    expect(fixture.nonExecutionStatement.localhostCallStatus).toBe("localhost_call_not_authorized");
    expect(fixture.nonExecutionStatement.ollamaCallStatus).toBe("ollama_call_not_authorized");
    expect(fixture.nonExecutionStatement.openAiCompatibleEndpointStatus).toBe("openai_compatible_endpoint_not_authorized");
    expect(fixture.nonExecutionStatement.retryStatus).toBe("retry_not_authorized");
    expect(fixture.nonExecutionStatement.rerunStatus).toBe("rerun_not_authorized");

    expect(fixture.evidencePromotionStatus).toBe("evidence_promotion_blocked");
    expect(fixture.publicationStatus).toBe("publication_blocked");
    expect(fixture.providerOutputScoringStatus).toBe("provider_output_scoring_blocked");
    expect(fixture.candidateRankingStatus).toBe("candidate_ranking_blocked");
    expect(fixture.runtimeApiUiWiringStatus).toBe("runtime_api_ui_wiring_blocked");
  });

  it("does not import raw provider-output text or promotion fields", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    const keys = collectKeys(fixture);

    forbiddenKeys.forEach((key) => {
      expect(keys).not.toContain(key);
    });
  });

  it("passes the helper as an integration gate", () => {
    const stdout = execFileSync("node", [helperPath], { cwd: root, encoding: "utf8" });
    const result = JSON.parse(stdout);

    expect(result.status).toBe("STATIC_PROVIDER_RESULT_IMPORT_QUARANTINE_VALID");
    expect(result.blockedEvidenceClasses).toEqual(
      expect.arrayContaining([
        "provider_output_evidence",
        "parser_compatibility_evidence",
        "reproducibility_evidence",
        "candidate_truth_evidence",
        "origin_evidence",
        "model_quality_evidence",
        "publication_evidence",
        "execution_safety_evidence",
      ]),
    );
  });
});

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SINGLE_CALL_RUNNER = "scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs";
const LAYER2_RUNNER = "scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs";

function requiredPromptFragments(): string[] {
  return [
    "<ISOLATION_AUDIT>",
    "attested_standalone_form",
    "reasonably_inferred is rejected",
    "claimBoundary",
    "nullAccepted",
    "candidate must be an object or null",
    "candidate.attestationStatus",
    "candidateLanguage",
    "developmentOnly",
    "publicationEvidence",
    "originEvidence",
    "winnerCrowned",
  ];
}

function expectContainsAll(text: string, fragments: string[]): void {
  for (const fragment of fragments) {
    expect(text).toContain(fragment);
  }
}

describe("Open Instrument functional embryo prompt-delivery attestation repair v0.1", () => {
  it("delivers Isolation Audit and attestation rules in the actual single-call runner prompt", () => {
    const output = execFileSync(
      "node",
      [
        SINGLE_CALL_RUNNER,
        "--print-reviewed-request",
        "--word",
        "comic",
        "--stage",
        "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY",
        "--segmentation",
        "COM + IC",
      ],
      { encoding: "utf8" },
    );

    const request = JSON.parse(output);
    const actualPrompt = [request.systemPrompt, request.userPrompt].join("\n");

    expectContainsAll(actualPrompt, requiredPromptFragments());
    expect(actualPrompt).toContain("candidate.chunk");
    expect(actualPrompt).toContain("candidate.language");
    expect(actualPrompt).toContain("Do not define the chunk using the full word meaning");
  });

  it("delivers identity echo, claim boundary, and attestation rules in every actual Layer 2 requestBody prompt", () => {
    const output = execFileSync("node", [LAYER2_RUNNER, "--print-reviewed-requests"], {
      encoding: "utf8",
    });

    const requests = JSON.parse(output);
    expect(requests).toHaveLength(8);

    for (const request of requests) {
      const requestBodyText = JSON.stringify(request.requestBody ?? request);
      expectContainsAll(requestBodyText, requiredPromptFragments());
      expect(requestBodyText).toContain("word");
      expect(requestBodyText).toContain("stage");
      expect(requestBodyText).toContain("segmentation");
      expect(requestBodyText).toContain("chunk");
      expect(requestBodyText).toContain("candidateLanguage");
      expect(requestBodyText).toContain("Echo word exactly from the target");
      expect(requestBodyText).toContain("Echo stage exactly from the target");
      expect(requestBodyText).toContain("Echo segmentation exactly from the target");
      expect(requestBodyText).toContain("Echo chunk exactly from the target");
      expect(requestBodyText).toContain("Echo candidateLanguage exactly from the target");
    }
  });

  it("keeps the repair non-executing and reviewed-local by construction", () => {
    const output = execFileSync("node", [LAYER2_RUNNER, "--print-reviewed-requests"], {
      encoding: "utf8",
    });

    const requests = JSON.parse(output);
    const joined = JSON.stringify(requests);
    const runnerSource = readFileSync(LAYER2_RUNNER, "utf8");

    expect(joined).toContain("llama3.1:8b");
    expect(runnerSource).toContain("local_only_openai_compatible");
    expect(runnerSource).toContain("ollama_openai_compat");
    expect(runnerSource).toContain("localhost_only");
    expect(runnerSource).toContain("http://127.0.0.1:11434/v1");
  });
});

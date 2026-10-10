import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { POST } from "@/app/api/analyze-v1/route";

import {
  ensureS4ProductValidationResultDirectoryV0_2,
  S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2,
  verifyS4ProductValidationV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS4.v0_2";

const LIVE_PROVIDER_VALIDATION_ENABLED = Boolean(process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT);

function persistedResult() {
  return JSON.parse(readFileSync(join(
    process.cwd(),
    "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s4-product-validation-v0.1/results.json",
  ), "utf8")) as {
    cases: Array<{
      input: string;
      newPositive: boolean;
      expanded: { candidates: Array<{ candidateLanguage: string; candidateForm: string; candidateGloss: string }> };
    }>;
  };
}

describe("multilingual Discovery substrate v0.2 S4 persistence preflight", () => {
  it("reuses the existing frozen procedure directory without replacing its procedure", () => {
    const rootDir = process.cwd();
    const procedurePath = join(rootDir, S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2);
    const before = readFileSync(procedurePath, "utf8");
    const resultDir = ensureS4ProductValidationResultDirectoryV0_2(rootDir);
    expect(existsSync(resultDir)).toBe(true);
    expect(readFileSync(procedurePath, "utf8")).toBe(before);
  });

  it("verifies finalized attempt-2 artifacts without invoking the provider", () => {
    const verified = verifyS4ProductValidationV0_2();
    expect(verified.manifestVerified).toBe(true);
    expect(verified.summary.TOTAL_INPUTS).toBe(1024);
    expect(verified.summary.VALID_INPUTS).toBe(688);
    expect(verified.summary.REGRESSED_INPUTS).toBe(0);
  });

  (LIVE_PROVIDER_VALIDATION_ENABLED ? it : it.skip)("projects a persisted English improvement through the API boundary", async () => {
    const result = persistedResult();
    const target = result.cases.find((entry) => entry.newPositive);
    expect(target).toBeDefined();
    const english = target?.expanded.candidates.find((candidate) => candidate.candidateLanguage === "English");
    expect(english).toBeDefined();
    const response = await POST(new Request("http://127.0.0.1/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: target?.input, mode: "strict", alphabet: "auto", language: "en", providerExecution: "automatic" }),
    }));
    expect(response.status).toBe(200);
    const payload = await response.json() as { motivationDiscoveryV0_1?: { candidates?: Array<Record<string, unknown>> } };
    const candidates = payload.motivationDiscoveryV0_1?.candidates ?? [];
    const liveEnglish = candidates.find((candidate) => candidate.candidateLanguage === "English" && candidate.candidateForm === english?.candidateForm);
    expect(liveEnglish).toBeDefined();
    expect(liveEnglish?.candidateVoicePath).toEqual([]);
    expect(liveEnglish?.historicalRelation).toBe("not_claimed");
    expect(liveEnglish?.userDecisionPosture).toBe("user_decides");
    expect(liveEnglish?.noSingleWinner).toBe(true);
    expect(JSON.stringify(payload)).not.toContain(process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT ?? "__unset__");
  }, 60_000);
});

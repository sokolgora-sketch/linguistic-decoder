#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { startNextServer } from "../../tests/helpers/ownedNextServer";

type PersistedResult = {
  cases: Array<{
    input: string;
    newPositive: boolean;
    expanded: { candidates: Array<{ candidateLanguage: string; candidateForm: string; candidateGloss: string }> };
  }>;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const result = JSON.parse(readFileSync(join(
    process.cwd(),
    "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s4-product-validation-v0.1/results.json",
  ), "utf8")) as PersistedResult;
  const target = result.cases.find((entry) => entry.newPositive);
  const english = target?.expanded.candidates.find((candidate) => candidate.candidateLanguage === "English");
  assert(target && english, "No persisted English new-positive representative was available.");

  const server = await startNextServer("start");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30_000);
    const response = await page.goto(`${server.base}/chat`, { waitUntil: "domcontentloaded" });
    assert(response?.ok(), `Expected /chat to load, got ${response?.status() ?? "no response"}.`);
    await page.getByRole("textbox", { name: "Word" }).fill(target.input);
    await page.getByRole("button", { name: "Analyze" }).click();
    await page.getByTestId("motivation-discovery-card").waitFor({ state: "visible" });
    const candidate = page.getByTestId("motivation-discovery-candidate").filter({ hasText: english.candidateForm });
    await candidate.first().waitFor({ state: "visible" });
    await candidate.first().getByText(english.candidateGloss, { exact: true }).waitFor({ state: "visible" });
    await candidate.first().getByText("English", { exact: true }).waitFor({ state: "visible" });
    console.log("S4_CHAT_ENGLISH_CANDIDATE_VISIBLE=PASS");
    console.log(`S4_CHAT_REPRESENTATIVE_INPUT=${target.input}`);
    console.log(`S4_CHAT_REPRESENTATIVE_FORM=${english.candidateForm}`);
  } finally {
    await browser.close();
    await server.stop();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});

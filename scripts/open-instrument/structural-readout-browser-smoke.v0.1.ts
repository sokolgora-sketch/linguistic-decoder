#!/usr/bin/env tsx

import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { chromium, type Browser, type Page, type Request } from "playwright";
import { startNextServer } from "../../tests/helpers/ownedNextServer";

type SmokeCase = {
  word: string;
  expectedVoices: string[];
  hasPinnedReference: boolean;
  expectedSourceSegmentation?: string;
  screenshot?: boolean;
  unsupportedStructuralInput?: boolean;
};

type InteractionPhase = "BEFORE_FIRST_ANALYZE" | "DURING_ANALYZE" | "AFTER_ANALYZE";
type ResourceClass = "EXTERNAL_REQUEST" | "API_CALL" | "ROUTE" | "ASSET" | "LOCAL_RESOURCE";
type ConsoleClassification = "UNCLASSIFIED" | "EXPECTED_OPTIONAL_FVR_NOT_AVAILABLE";

type InteractionContext = {
  index: number;
  word: string;
  startedAt: number;
  completedAt: number | null;
};

type InteractionTiming = {
  interactionIndex: number | null;
  word: string | null;
  phase: InteractionPhase;
  offsetFromAnalyzeMs: number | null;
};

type HttpErrorDiagnostic = {
  status: number;
  url: string;
  path: string;
  method: string;
  resourceType: string;
  resourceClass: ResourceClass;
  timing: InteractionTiming;
  responseBodyStatus: string | null;
  responseConceptId: string | null;
  expectedOptionalFvrNotAvailable: boolean;
};

type ConsoleDiagnostic = {
  diagnosticIndex: number;
  type: string;
  message: string;
  classification: ConsoleClassification;
  matchedHttpErrorIndex: number | null;
  location: { url: string; lineNumber: number; columnNumber: number };
  timing: InteractionTiming;
};

type CaseResult = {
  analyzeInteractionIndex: number;
  word: string;
  viewport: "desktop" | "mobile";
  expectedVoices: string;
  observedVoices: string | null;
  expectedGraphemes: string[];
  observedGraphemes: string[];
  cardVisible: boolean;
  structuralReadoutStatus: string | null;
  displayedWord: string | null;
  apiStatus: number | null;
  apiResponseWord: string | null;
  sourceStatus: string | null;
  sourceSegmentationStatus: string | null;
  sourceSegmentation: string | null;
  engineReductionComparison: string | null;
  engineAlternatives: string[];
  digraphExclusions: string | null;
  horizontalOverflowPx: number | null;
  browserErrors: string[];
  hydrationErrors: string[];
  localRequestFailures: string[];
  httpErrors: HttpErrorDiagnostic[];
  consoleDiagnostics: ConsoleDiagnostic[];
  screenshot: string | null;
  outcome: "PASS" | "FAIL";
  failure: string | null;
};

type InterpretationCaseResult = {
  word: string;
  viewport: "desktop" | "mobile";
  status: "PASS" | "FAIL";
  rawConcatenation: string | null;
  finalMechanicalSpelling: string | null;
  exactComparison: string | null;
  warningCodes: string[];
  sourceLookup: "NOT_REQUESTED" | "SYNTHETIC_FIXTURE_SELECTED_MANUALLY";
  proposalStatus: string | null;
  strictEmbryoMeaning: string | null;
  screenshot: string | null;
  failure: string | null;
};

type SmokeReport = {
  schemaVersion: "open-instrument.structural-and-interpretation-browser-smoke.v0.2";
  currentHead: string | null;
  expectedMain: string;
  page: string;
  browser: { name: string; version: string } | null;
  analyzeInteractions: number;
  blockedExternalHosts: string[];
  consoleErrors: string[];
  consoleDiagnostics: ConsoleDiagnostic[];
  httpErrors: HttpErrorDiagnostic[];
  pageErrors: string[];
  hydrationErrors: string[];
  cases: CaseResult[];
  interpretationCases: InterpretationCaseResult[];
  syntheticFjaloriRequests: string[];
  fatalError: string | null;
  outcome: "RUNNING" | "PASS" | "FAIL" | "BLOCKED";
};

const CASES: SmokeCase[] = [
  { word: "PLANET", expectedVoices: ["A", "E"], hasPinnedReference: true, screenshot: true },
  { word: "SHKRUAJ", expectedVoices: ["U", "A"], hasPinnedReference: true },
  { word: "SHKRIM", expectedVoices: ["I"], hasPinnedReference: true, expectedSourceSegmentation: "SHKR | IM" },
  { word: "SHKRONJË", expectedVoices: ["O", "Ë"], hasPinnedReference: true, expectedSourceSegmentation: "SHKR | ONJË", screenshot: true },
  { word: "JET", expectedVoices: ["E"], hasPinnedReference: false },
  { word: "JETË", expectedVoices: ["E", "Ë"], hasPinnedReference: false },
  { word: "BLETAR", expectedVoices: ["E", "A"], hasPinnedReference: false, screenshot: true },
  { word: "KANDIL", expectedVoices: ["A", "I"], hasPinnedReference: false },
  { word: "DRITARE", expectedVoices: ["I", "A", "E"], hasPinnedReference: false },
  { word: "BUKË", expectedVoices: ["U", "Ë"], hasPinnedReference: false },
  { word: "ËNDËRR", expectedVoices: ["Ë", "Ë"], hasPinnedReference: false, screenshot: true },
  { word: "RRUGË", expectedVoices: ["U", "Ë"], hasPinnedReference: false },
  { word: "GJUHË", expectedVoices: ["U", "Ë"], hasPinnedReference: false },
  { word: "ÇELËS", expectedVoices: ["E", "Ë"], hasPinnedReference: false },
  { word: "STUDY", expectedVoices: ["U", "Y"], hasPinnedReference: false },
  { word: "Résumé", expectedVoices: [], hasPinnedReference: false, unsupportedStructuralInput: true },
];

const ALBANIAN_DIGRAPHS = new Set(["dh", "gj", "ll", "nj", "rr", "sh", "th", "xh", "zh"]);
const PAGE_TIMEOUT_MS = 60_000;
const EXPECTED_OPTIONAL_FVR_404_CONSOLE =
  "Failed to load resource: the server responded with a status of 404 (Not Found)";
const STRUCTURAL_SMOKE_WORDS = new Set(CASES.map((testCase) => exactWord(testCase.word)));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function normalizedWord(value: string): string {
  return Array.from(value.normalize("NFC").trim().toLocaleLowerCase("en-US"))
    .filter((character) => /^[a-zçë]$/u.test(character))
    .join("");
}

function exactWord(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function expectedGraphemes(value: string): string[] {
  const characters = Array.from(normalizedWord(value));
  const graphemes: string[] = [];
  for (let index = 0; index < characters.length;) {
    const pair = `${characters[index] ?? ""}${characters[index + 1] ?? ""}`;
    if (ALBANIAN_DIGRAPHS.has(pair)) {
      graphemes.push(pair);
      index += 2;
    } else {
      graphemes.push(characters[index] ?? "");
      index += 1;
    }
  }
  return graphemes;
}

function normalizeVoicePath(value: string): string {
  return value.replace(/\s*→\s*/gu, "→").replace(/\s+/gu, " ").trim();
}

function safeSlug(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
}

function terminalFormsFromAlternative(alternative: string): string[] {
  const separator = alternative.lastIndexOf("|");
  assert(separator >= 0, `Rendered engine alternative has no component separator: ${alternative}`);
  return alternative.slice(separator + 1).trim().split(/\s+\+\s+/u).map((component) => {
    const open = component.lastIndexOf(" (");
    assert(open > 0, `Rendered terminal component has no Voice label: ${component}`);
    return component.slice(0, open).trim();
  });
}

function validateRenderedComponents(word: string, graphemes: string[], alternatives: string[]): void {
  const basis = normalizedWord(word);
  const boundaries = new Set<number>([0]);
  let cursor = 0;
  for (const grapheme of graphemes) {
    cursor += Array.from(grapheme).length;
    boundaries.add(cursor);
  }

  for (const alternative of alternatives) {
    const forms = terminalFormsFromAlternative(alternative);
    const normalizedForms = forms.map(normalizedWord);
    assert(normalizedForms.join("") === basis, `Rendered components do not reconstruct ${word}: ${forms.join("+")}`);
    let componentBoundary = 0;
    for (const form of normalizedForms.slice(0, -1)) {
      componentBoundary += Array.from(form).length;
      assert(boundaries.has(componentBoundary), `Rendered component boundary splits an Albanian grapheme in ${word}`);
    }
  }
}

function classifyResource(request: Request, localOrigin: string): ResourceClass {
  const requestUrl = new URL(request.url());
  const resourceType = request.resourceType();
  if (requestUrl.origin !== localOrigin) return "EXTERNAL_REQUEST";
  if (requestUrl.pathname.startsWith("/api/") || resourceType === "xhr" || resourceType === "fetch") return "API_CALL";
  if (resourceType === "document") return "ROUTE";
  if (
    ["font", "image", "media", "manifest", "script", "stylesheet"].includes(resourceType) ||
    requestUrl.pathname.startsWith("/_next/") ||
    /\.(?:css|mjs?|png|jpe?g|gif|svg|ico|woff2?|ttf|eot)$/iu.test(requestUrl.pathname)
  ) return "ASSET";
  return "LOCAL_RESOURCE";
}

function timingForInteraction(interaction: InteractionContext | null): InteractionTiming {
  if (!interaction) {
    return {
      interactionIndex: null,
      word: null,
      phase: "BEFORE_FIRST_ANALYZE",
      offsetFromAnalyzeMs: null,
    };
  }
  return {
    interactionIndex: interaction.index,
    word: interaction.word,
    phase: interaction.completedAt === null ? "DURING_ANALYZE" : "AFTER_ANALYZE",
    offsetFromAnalyzeMs: Math.max(0, Date.now() - interaction.startedAt),
  };
}

function nestedApiWord(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.word === "string") return record.word;
  if (typeof record.result === "object" && record.result !== null) {
    const nested = (record.result as Record<string, unknown>).word;
    if (typeof nested === "string") return nested;
  }
  return null;
}

async function main(): Promise<void> {
  const artifactDirectory = process.env.OPEN_INSTRUMENT_STRUCTURAL_SMOKE_ARTIFACT_DIR ??
    join(tmpdir(), "pr2283-structural-readout-smoke");
  const screenshotDirectory = join(artifactDirectory, "screenshots");
  await mkdir(screenshotDirectory, { recursive: true });

  const report: SmokeReport = {
    schemaVersion: "open-instrument.structural-and-interpretation-browser-smoke.v0.2",
    currentHead: process.env.OPEN_INSTRUMENT_PR_HEAD ?? null,
    expectedMain: "8a172fe697fbcd2c1a93f3b0baaa96ca6f3b52f4",
    page: "/chat?debug=1",
    browser: null,
    analyzeInteractions: 0,
    blockedExternalHosts: [],
    consoleErrors: [],
    consoleDiagnostics: [],
    httpErrors: [],
    pageErrors: [],
    hydrationErrors: [],
    cases: [],
    interpretationCases: [],
    syntheticFjaloriRequests: [],
    fatalError: null,
    outcome: "RUNNING",
  };

  let server: Awaited<ReturnType<typeof startNextServer>> | undefined;
  let browser: Browser | undefined;
  let page: Page | undefined;
  const blockedExternalHosts = new Set<string>();
  const consoleErrors: string[] = [];
  const consoleDiagnostics: ConsoleDiagnostic[] = [];
  const httpErrors: HttpErrorDiagnostic[] = [];
  const httpResponseInspections: Promise<void>[] = [];
  let currentInteraction: InteractionContext | null = null;
  const pageErrors: string[] = [];
  const hydrationErrors: string[] = [];
  const localRequestFailures: string[] = [];

  try {
    assert(
      report.currentHead !== null && /^[a-f0-9]{40}$/iu.test(report.currentHead),
      "OPEN_INSTRUMENT_PR_HEAD must contain the exact 40-character GitHub PR head SHA.",
    );
    server = await startNextServer("start");
    const localOrigin = new URL(server.base).origin;
    browser = await chromium.launch({ headless: true });
    report.browser = { name: "chromium", version: browser.version() };
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const syntheticFjaloriUrl = "https://fjalorishqip.org/api/v1/fjala/kan.json";
    const syntheticFjaloriPayload = {
      word: "kan",
      licence: "CC BY-SA 4.0",
      sources: ["synthetic-browser-fixture"],
      entries: [{
        pos: "verb",
        sources: ["synthetic-browser-fixture"],
        senses: [{
          gloss: "Synthetic browser fixture only; not lexical evidence.",
          lang: "en",
          source: "synthetic-browser-fixture",
        }],
      }],
    };
    await context.route("**/*", async (route) => {
      const request = route.request();
      const requestUrl = new URL(request.url());
      if (requestUrl.origin === localOrigin) {
        await route.continue();
      } else if (request.method() === "GET" && request.url() === syntheticFjaloriUrl) {
        report.syntheticFjaloriRequests.push(request.url());
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify(syntheticFjaloriPayload),
        });
      } else {
        blockedExternalHosts.add(requestUrl.hostname);
        await route.abort();
      }
    });
    page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text().slice(0, 500);
      const location = message.location();
      consoleErrors.push(text);
      consoleDiagnostics.push({
        diagnosticIndex: consoleDiagnostics.length,
        type: message.type(),
        message: text,
        classification: "UNCLASSIFIED",
        matchedHttpErrorIndex: null,
        location: {
          url: location.url,
          lineNumber: location.lineNumber,
          columnNumber: location.columnNumber,
        },
        timing: timingForInteraction(currentInteraction),
      });
      if (/hydration|hydrated|server html|text content does not match/iu.test(text)) {
        hydrationErrors.push(text);
      }
    });
    page.on("response", (response) => {
      const status = response.status();
      if (status < 400) return;
      const request = response.request();
      const requestUrl = new URL(request.url());
      const diagnostic: HttpErrorDiagnostic = {
        status,
        url: request.url(),
        path: `${requestUrl.pathname}${requestUrl.search}`,
        method: request.method(),
        resourceType: request.resourceType(),
        resourceClass: classifyResource(request, localOrigin),
        timing: timingForInteraction(currentInteraction),
        responseBodyStatus: null,
        responseConceptId: null,
        expectedOptionalFvrNotAvailable: false,
      };
      httpErrors.push(diagnostic);
      // This exact optional research route uses 404/not_available for concepts without an admitted FVR cohort.
      // Validate its JSON response and the current smoke input before classifying it as expected.
      if (
        status === 404 &&
        request.method() === "GET" &&
        request.resourceType() === "fetch" &&
        requestUrl.origin === localOrigin &&
        requestUrl.pathname === "/api/research/fvr"
      ) {
        httpResponseInspections.push((async () => {
          try {
            const body = await response.json() as Record<string, unknown>;
            const queryConcept = requestUrl.searchParams.get("concept");
            diagnostic.responseBodyStatus =
              typeof body.status === "string" ? body.status : null;
            diagnostic.responseConceptId =
              typeof body.conceptId === "string" ? body.conceptId : null;
            diagnostic.expectedOptionalFvrNotAvailable =
              diagnostic.resourceClass === "API_CALL" &&
              diagnostic.responseBodyStatus === "not_available" &&
              queryConcept !== null &&
              queryConcept === queryConcept.normalize("NFC").trim() &&
              diagnostic.responseConceptId === queryConcept &&
              STRUCTURAL_SMOKE_WORDS.has(exactWord(queryConcept));
          } catch {
            diagnostic.expectedOptionalFvrNotAvailable = false;
          }
        })());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message.slice(0, 500)));
    page.on("requestfailed", (request) => {
      if (new URL(request.url()).origin === localOrigin) {
        localRequestFailures.push(`${request.method()} ${new URL(request.url()).pathname}: ${request.failure()?.errorText ?? "failed"}`);
      }
    });

    const response = await page.goto(`${server.base}/chat?debug=1`, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_TIMEOUT_MS,
    });
    assert(response?.ok(), `Expected /chat?debug=1 to load, got ${response?.status() ?? "no response"}.`);
    await page.getByRole("textbox", { name: "Word", exact: true }).waitFor({ state: "visible" });
    await page.getByRole("region", { name: "Open Instrument ready" }).waitFor({ state: "visible" });

    let previousDisplayedWord: string | null = null;
    const runInterpretationCase = async (
      word: string,
      viewport: "desktop" | "mobile",
    ): Promise<InterpretationCaseResult> => {
      const interpretation: InterpretationCaseResult = {
        word,
        viewport,
        status: "FAIL",
        rawConcatenation: null,
        finalMechanicalSpelling: null,
        exactComparison: null,
        warningCodes: [],
        sourceLookup: "NOT_REQUESTED",
        proposalStatus: null,
        strictEmbryoMeaning: null,
        screenshot: null,
        failure: null,
      };
      try {
        assert(page, "Browser page was not initialized for the interpretation workbench.");
        const interpretationTab = page.getByRole("tab", { name: "My Interpretation", exact: true });
        await interpretationTab.click();
        assert(await interpretationTab.getAttribute("aria-selected") === "true", "My Interpretation tab did not become selected.");
        const workbench = page.getByTestId("single-word-motivation-workbench");
        await workbench.waitFor({ state: "visible" });
        const targetInput = workbench.getByRole("textbox", { name: "Exact target word", exact: true });
        assert(await targetInput.inputValue() === word, `Workbench target did not reset to ${word}.`);
        const mechanical = workbench.getByTestId("single-word-mechanical-result");

        if (word === "KANDIL") {
          assert(await mechanical.getAttribute("data-status") === "NOT_SUBMITTED", "KANDIL inherited a prior mechanical result.");
          assert(await workbench.getByLabel("Component 1 exact spelling").inputValue() === "", "KANDIL inherited a prior component draft.");
          assert(report.syntheticFjaloriRequests.length === 0, "A component source lookup ran before the user selected Check source.");

          const entries: Array<[string, string]> = [
            ["Target language", "Albanian"],
            ["Component 1 exact spelling", "KAN"],
            ["Component 1 proposed meaning", "have"],
            ["Component 1 grammatical role", "verb · user proposal"],
            ["Component 1 language", "Albanian"],
            ["Component 1 dialect", "Gheg"],
            ["Component 2 exact spelling", "DILL"],
            ["Component 2 proposed meaning", "sun"],
            ["Component 2 grammatical role", "noun · user proposal"],
            ["Component 2 language", "Albanian"],
            ["Component 2 dialect", "Gheg"],
            ["Proposed functional explanation", "Have sun / have light · user hypothesis"],
          ];
          for (const [label, value] of entries) await workbench.getByLabel(label, { exact: true }).fill(value);
          await workbench.getByLabel("Component 1 evidence status", { exact: true }).selectOption("USER_PROPOSED");
          await workbench.getByRole("button", { name: "Check source for component 1", exact: true }).click();
          const sourceGloss = workbench.getByTestId("fjalori-source-sense-gloss");
          await sourceGloss.waitFor({ state: "visible" });
          assert((await sourceGloss.innerText()).includes("Synthetic browser fixture only"), "Source fixture was not visibly labeled synthetic.");
          assert(report.syntheticFjaloriRequests.length === 1, "The manual source lookup did not use exactly one bounded fixture request.");
          assert(report.syntheticFjaloriRequests[0] === "https://fjalorishqip.org/api/v1/fjala/kan.json", "Unexpected source fixture request URL.");
          await workbench.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection", exact: true }).click();
          const assessment = workbench.getByLabel("USER_INTERPRETATION assessment for entry 1 sense 1", { exact: true });
          assert(await assessment.inputValue() === "", "A USER_INTERPRETATION assessment was auto-selected.");
          await assessment.selectOption("UNDECIDED");
          interpretation.sourceLookup = "SYNTHETIC_FIXTURE_SELECTED_MANUALLY";

          const proposal = workbench.getByTestId("single-word-proposal-result");
          interpretation.proposalStatus = "PROPOSED";
          interpretation.strictEmbryoMeaning = "UNKNOWN_OR_NULL";
          assert((await proposal.innerText()).includes("PROPOSED"), "Functional proposal was not kept as PROPOSED.");
          assert((await proposal.innerText()).includes("Strict embryo meaning: Unknown / Null"), "Strict embryo meaning was promoted.");
          assert((await proposal.innerText()).includes("A → I"), "The complete written Voice path changed after mechanical replay.");
          assert((await proposal.innerText()).includes("historical origin: not claimed"), "Mechanical replay promoted historical origin.");
          assert(await workbench.getByLabel("Component 1 evidence status", { exact: true }).inputValue() === "USER_PROPOSED", "Manual source inspection promoted component evidence status.");
          assert((await proposal.innerText()).includes("have"), "The user's proposed meaning was not retained.");

          await workbench.getByTestId("single-word-add-mechanical-operation").click();
          await workbench.getByLabel("Mechanical operation 1 type", { exact: true }).selectOption("SUBSTITUTE");
          await workbench.getByLabel("Mechanical operation 1 position", { exact: true }).fill("5");
          await workbench.getByLabel("Mechanical operation 1 expected text", { exact: true }).fill("LL");
          await workbench.getByLabel("Mechanical operation 1 replacement text", { exact: true }).fill("L");
          await workbench.getByTestId("single-word-examine-interpretation").click();
          assert(await mechanical.getAttribute("data-status") === "EXAMINED", "KANDIL mechanical replay was not examined.");
          const mechanicalText = await mechanical.innerText();
          assert(mechanicalText.includes("Raw component concatenation: KANDILL"), "KANDIL raw concatenation was incorrect.");
          assert(mechanicalText.includes("Final mechanical spelling: KANDIL"), "KANDIL replay result was incorrect.");
          assert(mechanicalText.includes("Exact comparison: MATCH"), "KANDIL exact comparison was incorrect.");
          assert(mechanicalText.includes("DIGRAPH_REMOVED"), "KANDIL LL digraph impact was not reported.");
          interpretation.rawConcatenation = "KANDILL";
          interpretation.finalMechanicalSpelling = "KANDIL";
          interpretation.exactComparison = "MATCH";
          interpretation.warningCodes = ["DIGRAPH_REMOVED"];
        } else if (word === "DRITARE") {
          assert(await mechanical.getAttribute("data-status") === "NOT_SUBMITTED", "DRITARE retained the previous word's replay result.");
          assert(await workbench.getByLabel("Component 1 exact spelling").inputValue() === "", "DRITARE retained the previous word's component draft.");
          assert(await workbench.getByTestId("fjalori-selected-sense").count() === 0, "DRITARE retained the previous word's source-sense selection.");
          assert(report.syntheticFjaloriRequests.length === 1, "A source request was triggered without a manual component action.");
          const entries: Array<[string, string]> = [
            ["Target language", "Albanian"],
            ["Component 1 exact spelling", "DRIT"],
            ["Component 1 language", "Albanian"],
            ["Component 2 exact spelling", "HARE"],
            ["Component 2 language", "Albanian"],
            ["Proposed functional explanation", "Owner-proposed segmentation only"],
          ];
          for (const [label, value] of entries) await workbench.getByLabel(label, { exact: true }).fill(value);
          await workbench.getByLabel("Component 1 not yet explained", { exact: true }).check();
          await workbench.getByLabel("Component 2 not yet explained", { exact: true }).check();
          await workbench.getByTestId("single-word-add-mechanical-operation").click();
          await workbench.getByLabel("Mechanical operation 1 type", { exact: true }).selectOption("OMIT");
          await workbench.getByLabel("Mechanical operation 1 position", { exact: true }).fill("4");
          await workbench.getByLabel("Mechanical operation 1 expected text", { exact: true }).fill("H");
          await workbench.getByTestId("single-word-examine-interpretation").click();
          const mechanicalText = await mechanical.innerText();
          assert(await mechanical.getAttribute("data-status") === "EXAMINED", "DRITARE mechanical replay was not examined.");
          assert(mechanicalText.includes("Raw component concatenation: DRITHARE"), "DRITARE raw concatenation was incorrect.");
          assert(mechanicalText.includes("Final mechanical spelling: DRITARE"), "DRITARE replay result was incorrect.");
          assert(mechanicalText.includes("DIGRAPH_CROSSES_COMPONENT_BOUNDARY") && mechanicalText.includes("DIGRAPH_REMOVED"), "DRITARE TH boundary impact was not reported.");
          assert(await workbench.getByLabel("Component 2 exact spelling", { exact: true }).inputValue() === "HARE", "The user spelling HARE was silently changed.");
          interpretation.rawConcatenation = "DRITHARE";
          interpretation.finalMechanicalSpelling = "DRITARE";
          interpretation.exactComparison = "MATCH";
          interpretation.warningCodes = ["DIGRAPH_CROSSES_COMPONENT_BOUNDARY", "DIGRAPH_REMOVED"];
        } else if (word === "BUKË") {
          assert(await mechanical.getAttribute("data-status") === "NOT_SUBMITTED", "BUKË was given an unsubmitted mechanical interpretation.");
          assert(await workbench.getByLabel("Component 1 exact spelling").inputValue() === "", "BUKË inherited an earlier component proposal.");
          assert(await workbench.getByTestId("fjalori-selected-sense").count() === 0, "BUKË inherited an earlier source-sense assessment.");
          assert(report.syntheticFjaloriRequests.length === 1, "BUKË triggered an unrequested source lookup.");
          interpretation.proposalStatus = "NOT_SUBMITTED";
          interpretation.strictEmbryoMeaning = "UNKNOWN_OR_NULL";
        } else if (viewport === "mobile") {
          assert(await mechanical.getAttribute("data-status") === "NOT_SUBMITTED", "Mobile target inherited a mechanical result.");
          assert(await workbench.getByLabel("Component 1 exact spelling").inputValue() === "", "Mobile target inherited a component draft.");
          interpretation.proposalStatus = "NOT_SUBMITTED";
          interpretation.strictEmbryoMeaning = "UNKNOWN_OR_NULL";
        } else {
          throw new Error(`No interpretation smoke case is defined for ${word}.`);
        }

        const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
        assert(overflow <= 1, `${viewport} interpretation tab has horizontal overflow (${overflow}px).`);
        const screenshotPath = join(screenshotDirectory, `${safeSlug(word)}.my-interpretation.${viewport}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" });
        interpretation.screenshot = relative(artifactDirectory, screenshotPath);
        interpretation.status = "PASS";
      } catch (error) {
        interpretation.failure = errorMessage(error).slice(0, 1000);
      }
      return interpretation;
    };

    const runCase = async (testCase: SmokeCase, viewport: "desktop" | "mobile"): Promise<void> => {
      const expectedBasis = normalizedWord(testCase.word);
      const expectedVoicePath = testCase.unsupportedStructuralInput
        ? "UNSUPPORTED_STRUCTURAL_INPUT"
        : testCase.expectedVoices.join(" → ");
      const expectedGraphemeList = testCase.unsupportedStructuralInput
        ? []
        : expectedGraphemes(testCase.word).map((grapheme) => grapheme.toLocaleUpperCase("en-US"));
      const result: CaseResult = {
        analyzeInteractionIndex: report.analyzeInteractions + 1,
        word: testCase.word,
        viewport,
        expectedVoices: expectedVoicePath,
        observedVoices: null,
        expectedGraphemes: expectedGraphemeList,
        observedGraphemes: [],
        cardVisible: false,
        structuralReadoutStatus: null,
        displayedWord: null,
        apiStatus: null,
        apiResponseWord: null,
        sourceStatus: null,
        sourceSegmentationStatus: null,
        sourceSegmentation: null,
        engineReductionComparison: null,
        engineAlternatives: [],
        digraphExclusions: null,
        horizontalOverflowPx: null,
        browserErrors: [],
        hydrationErrors: [],
        localRequestFailures: [],
        httpErrors: [],
        consoleDiagnostics: [],
        screenshot: null,
        outcome: "FAIL",
        failure: null,
      };
      const consoleOffset = consoleErrors.length;
      const consoleDiagnosticOffset = consoleDiagnostics.length;
      const httpErrorOffset = httpErrors.length;
      const pageErrorOffset = pageErrors.length;
      const hydrationOffset = hydrationErrors.length;
      const requestFailureOffset = localRequestFailures.length;
      let failureScreenshotPath: string | null = null;

      try {
        assert(page, "Browser page was not initialized.");
        await page.getByRole("textbox", { name: "Word", exact: true }).fill(testCase.word);
        const apiResponsePromise = page.waitForResponse((candidate) => {
          const candidateUrl = new URL(candidate.url());
          return candidateUrl.origin === localOrigin &&
            candidateUrl.pathname === "/api/analyze-v1";
        }, { timeout: PAGE_TIMEOUT_MS });
        report.analyzeInteractions += 1;
        currentInteraction = {
          index: report.analyzeInteractions,
          word: testCase.word,
          startedAt: Date.now(),
          completedAt: null,
        };
        await page.getByRole("button", { name: "Analyze" }).click();
        const apiResponse = await apiResponsePromise;
        result.apiStatus = apiResponse.status();
        assert(apiResponse.ok(), `Analyze API returned HTTP ${apiResponse.status()} for ${testCase.word}.`);
        result.apiResponseWord = nestedApiWord(await apiResponse.json());
        assert(
          result.apiResponseWord !== null && exactWord(result.apiResponseWord) === exactWord(testCase.word),
          `Analyze API response did not identify ${testCase.word}: ${result.apiResponseWord ?? "Unknown / Null"}.`,
        );

        await page.waitForFunction((target) => {
          const word = document.querySelector('[data-testid="instrument-word"]')?.textContent ?? "";
          return word.normalize("NFC").trim().toLocaleLowerCase("en-US") === target.word;
        }, { word: exactWord(testCase.word) }, { timeout: PAGE_TIMEOUT_MS });

        await page.getByText("Current analysis", { exact: true }).waitFor({ state: "visible" });
        const instrumentWord = page.getByTestId("instrument-word");
        result.displayedWord = (await instrumentWord.textContent())?.trim() ?? null;
        assert(result.displayedWord !== null, `Current word was not rendered for ${testCase.word}.`);
        assert(exactWord(result.displayedWord) === exactWord(testCase.word), `Stale or incorrect current-word result for ${testCase.word}: ${result.displayedWord}.`);
        if (previousDisplayedWord !== null && exactWord(previousDisplayedWord) !== exactWord(testCase.word)) {
          assert(exactWord(result.displayedWord) !== exactWord(previousDisplayedWord), `Previous result ${previousDisplayedWord} remained visible after analyzing ${testCase.word}.`);
        }
        previousDisplayedWord = result.displayedWord;

        const card = page.getByTestId("albanian-structural-evidence");
        if (testCase.unsupportedStructuralInput) {
          await page.waitForFunction(
            () => document.querySelector('[data-testid="albanian-structural-evidence"]') === null,
            undefined,
            { timeout: PAGE_TIMEOUT_MS },
          );
          assert(await card.count() === 0, `Unsupported form ${testCase.word} unexpectedly received a structural card.`);
          result.cardVisible = false;
          result.structuralReadoutStatus = "UNSUPPORTED_STRUCTURAL_INPUT_NULL";
          result.sourceStatus = "UNKNOWN_OR_NULL";
        } else {
          await page.waitForFunction((target) => {
            const word = document.querySelector('[data-testid="instrument-word"]')?.textContent ?? "";
            const voicePath = document.querySelector('[data-testid="albanian-structural-voice-path"]')?.textContent ?? "";
            return word.normalize("NFC").trim().toLocaleLowerCase("en-US") === target.word &&
              voicePath.replace(/\s*→\s*/gu, "→").replace(/\s+/gu, " ").trim() === target.voicePath.replace(/\s*→\s*/gu, "→");
          }, { word: expectedBasis, voicePath: expectedVoicePath }, { timeout: PAGE_TIMEOUT_MS });

          result.cardVisible = await card.isVisible();
          assert(result.cardVisible, `Structural card did not appear for ${testCase.word}.`);
          if (testCase.word === "STUDY") {
            await page.getByRole("heading", { name: "Reviewed functional evidence", exact: true }).waitFor({ state: "visible" });
          }
          result.structuralReadoutStatus = "STRUCTURAL_CARD_VISIBLE";
          result.observedVoices = (await card.getByTestId("albanian-structural-voice-path").innerText()).replace(/\s+/gu, " ").trim();
          assert(normalizeVoicePath(result.observedVoices) === normalizeVoicePath(expectedVoicePath), `Voice path mismatch for ${testCase.word}: ${result.observedVoices}.`);
          assert(result.observedVoices.split(/\s*→\s*/u).length === testCase.expectedVoices.length, `Written Voice event count mismatch for ${testCase.word}.`);

          result.observedGraphemes = (await card.getByTestId("albanian-structural-graphemes").innerText())
            .split("·").map((grapheme) => grapheme.trim()).filter(Boolean);
          assert(JSON.stringify(result.observedGraphemes) === JSON.stringify(expectedGraphemeList), `Grapheme segmentation mismatch for ${testCase.word}.`);

          const cardText = (await card.innerText()).replace(/\s+/gu, " ");
          assert(cardText.includes("does not establish Albanian lexical identity, meaning, pronunciation, or historical origin"), `Authority boundary text missing for ${testCase.word}.`);
          assert(await card.getByText("not_established", { exact: true }).isVisible(), `Pronunciation authority is not explicitly unestablished for ${testCase.word}.`);
          const detailedAuthority = (await card.locator("details").textContent()) ?? "";
          assert(detailedAuthority.includes("not_inferred_from_form") && detailedAuthority.includes("not_claimed"), `Lexical or historical authority was promoted for ${testCase.word}.`);

          if (testCase.hasPinnedReference) {
            const status = card.getByTestId("albanian-source-reference-status");
            result.sourceStatus = (await status.innerText()).trim();
            assert(result.sourceStatus === "SAME_FORM_SOURCE_REFERENCE", `Unexpected source status for ${testCase.word}: ${result.sourceStatus}.`);
            assert(cardText.includes("Matching spelling does not establish the input language"), `Same-form limitation is missing for ${testCase.word}.`);
          } else {
            result.sourceStatus = "NO_PINNED_SOURCE_REFERENCE";
            assert(await card.getByTestId("source-evidence-null").isVisible(), `Missing source evidence was not Null for ${testCase.word}.`);
          }

          if (testCase.expectedSourceSegmentation) {
            const segmentation = card.getByTestId("source-surface-segmentation");
            result.sourceSegmentation = (await segmentation.innerText()).replace(/\s+/gu, " ").trim();
            assert(result.sourceSegmentation.includes(testCase.expectedSourceSegmentation), `Expected source segmentation ${testCase.expectedSourceSegmentation} for ${testCase.word}; got ${result.sourceSegmentation}.`);
            result.sourceSegmentationStatus = (await card.getByTestId("source-surface-segmentation-status").innerText()).trim();
            assert(result.sourceSegmentationStatus.includes("SOURCE_REPORTED"), `Source boundary status is not explicit for ${testCase.word}: ${result.sourceSegmentationStatus}.`);
            assert(cardText.includes("Exact target-sense alignment: UNKNOWN"), `Target-sense alignment was promoted for ${testCase.word}.`);
            result.engineReductionComparison = (await card.getByTestId("engine-reduction-comparison").innerText()).replace(/\s+/gu, " ").trim();
            assert(result.engineReductionComparison.includes("NO_MATCHING_REDUCTION"), `Source boundary was incorrectly counted as an engine reduction for ${testCase.word}.`);
          }

          const engineHeading = card.getByRole("heading", { name: "Engine reductions and alternatives", exact: true });
          const engineRegion = engineHeading.locator("xpath=..");
          result.engineAlternatives = await engineRegion.locator("ul li").allTextContents();
          if (result.engineAlternatives.length === 0) {
            const nullText = await engineRegion.locator("p").first().innerText();
            assert(nullText.includes("structural alternatives are Null"), `Engine Null was not displayed for ${testCase.word}.`);
            result.engineAlternatives = [nullText];
          } else {
            validateRenderedComponents(testCase.word, expectedGraphemes(testCase.word), result.engineAlternatives);
          }

          const exclusion = card.getByText(/Excluded reductions split Albanian digraphs:/u);
          result.digraphExclusions = await exclusion.count() ? (await exclusion.innerText()).replace(/\s+/gu, " ").trim() : null;
          if (testCase.screenshot || viewport === "mobile") {
            await card.scrollIntoViewIfNeeded();
            const filename = `${safeSlug(testCase.word)}.${viewport}.png`;
            const screenshotPath = join(screenshotDirectory, filename);
            await card.screenshot({ path: screenshotPath, animations: "disabled" });
            result.screenshot = relative(artifactDirectory, screenshotPath);
          }
        }

        const shouldRunInterpretation =
          (viewport === "desktop" && ["KANDIL", "DRITARE", "BUKË"].includes(testCase.word)) ||
          (viewport === "mobile" && testCase.word === "ËNDËRR");
        if (shouldRunInterpretation) {
          const interpretation = await runInterpretationCase(testCase.word, viewport);
          report.interpretationCases.push(interpretation);
          assert(interpretation.status === "PASS", `My Interpretation smoke failed for ${testCase.word}: ${interpretation.failure ?? "unknown failure"}`);
        }

        result.horizontalOverflowPx = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
        assert(result.horizontalOverflowPx !== null && result.horizontalOverflowPx <= 1, `Horizontal overflow (${result.horizontalOverflowPx}px) at ${viewport} viewport for ${testCase.word}.`);
        result.browserErrors = [...consoleErrors.slice(consoleOffset), ...pageErrors.slice(pageErrorOffset)];
        result.hydrationErrors = hydrationErrors.slice(hydrationOffset);
        result.localRequestFailures = localRequestFailures.slice(requestFailureOffset);
        result.httpErrors = httpErrors.slice(httpErrorOffset);
        result.consoleDiagnostics = consoleDiagnostics.slice(consoleDiagnosticOffset);
        assert(pageErrors.length === pageErrorOffset, `Browser runtime error for ${testCase.word}: ${pageErrors.slice(pageErrorOffset).join("; ")}`);
        assert(result.hydrationErrors.length === 0, `Hydration error for ${testCase.word}: ${result.hydrationErrors.join("; ")}`);
        assert(result.localRequestFailures.length === 0, `Local request failed for ${testCase.word}: ${result.localRequestFailures.join("; ")}`);
        result.outcome = "PASS";
      } catch (error) {
        result.failure = errorMessage(error).slice(0, 1000);
        result.browserErrors = [...consoleErrors.slice(consoleOffset), ...pageErrors.slice(pageErrorOffset)];
        result.hydrationErrors = hydrationErrors.slice(hydrationOffset);
        result.localRequestFailures = localRequestFailures.slice(requestFailureOffset);
        result.httpErrors = httpErrors.slice(httpErrorOffset);
        result.consoleDiagnostics = consoleDiagnostics.slice(consoleDiagnosticOffset);
        if (page) {
          try {
            const failureName = `${safeSlug(testCase.word)}.${viewport}.failure.png`;
            failureScreenshotPath = join(screenshotDirectory, failureName);
            await page.screenshot({ path: failureScreenshotPath, fullPage: true, animations: "disabled" });
            result.screenshot = relative(artifactDirectory, failureScreenshotPath);
          } catch (screenshotError) {
            result.failure += `; failure screenshot: ${errorMessage(screenshotError).slice(0, 250)}`;
          }
        }
      }
      report.cases.push(result);
      if (currentInteraction) currentInteraction.completedAt = Date.now();
      console.log(`${viewport.toUpperCase()}_${safeSlug(testCase.word)}=${result.outcome}`);
    };

    for (const testCase of CASES) await runCase(testCase, "desktop");
    assert(page, "Browser page was not initialized before the mobile case.");
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileCase = CASES.find((testCase) => testCase.word === "ËNDËRR");
    assert(mobileCase, "The unfamiliar-word mobile case is missing.");
    await runCase(mobileCase, "mobile");
    await page.waitForTimeout(150);
    await Promise.all(httpResponseInspections);

    for (const [httpErrorIndex, httpError] of httpErrors.entries()) {
      if (!httpError.expectedOptionalFvrNotAvailable) continue;
      const matchingConsoleError = consoleDiagnostics.find((diagnostic) =>
        diagnostic.classification === "UNCLASSIFIED" &&
        diagnostic.message === EXPECTED_OPTIONAL_FVR_404_CONSOLE &&
        diagnostic.timing.interactionIndex === httpError.timing.interactionIndex
      );
      if (matchingConsoleError) {
        matchingConsoleError.classification = "EXPECTED_OPTIONAL_FVR_NOT_AVAILABLE";
        matchingConsoleError.matchedHttpErrorIndex = httpErrorIndex;
      }
    }

    const unexpectedHttpErrors = httpErrors.filter(
      (diagnostic) => !diagnostic.expectedOptionalFvrNotAvailable,
    );
    const unexpectedConsoleDiagnostics = consoleDiagnostics.filter(
      (diagnostic) => diagnostic.classification === "UNCLASSIFIED",
    );
    for (const result of report.cases) {
      result.httpErrors = httpErrors.filter(
        (diagnostic) => diagnostic.timing.interactionIndex === result.analyzeInteractionIndex,
      );
      result.consoleDiagnostics = consoleDiagnostics.filter(
        (diagnostic) => diagnostic.timing.interactionIndex === result.analyzeInteractionIndex,
      );
      const optionalConsoleCount = result.consoleDiagnostics.filter(
        (diagnostic) => diagnostic.classification === "EXPECTED_OPTIONAL_FVR_NOT_AVAILABLE",
      ).length;
      let optionalMessagesToRemove = optionalConsoleCount;
      result.browserErrors = result.browserErrors.filter((message) => {
        if (message === EXPECTED_OPTIONAL_FVR_404_CONSOLE && optionalMessagesToRemove > 0) {
          optionalMessagesToRemove -= 1;
          return false;
        }
        return true;
      });
      const caseFailures = [
        ...result.httpErrors
          .filter((diagnostic) => !diagnostic.expectedOptionalFvrNotAvailable)
          .map((diagnostic) => `Unexpected HTTP ${diagnostic.status} ${diagnostic.method} ${diagnostic.url} [${diagnostic.resourceClass}]`),
        ...result.consoleDiagnostics
          .filter((diagnostic) => diagnostic.classification === "UNCLASSIFIED")
          .map((diagnostic) => `Unexpected console error: ${diagnostic.message} at ${diagnostic.location.url}:${diagnostic.location.lineNumber}:${diagnostic.location.columnNumber}`),
      ];
      if (caseFailures.length > 0) {
        result.outcome = "FAIL";
        result.failure = [result.failure, ...caseFailures].filter(Boolean).join("; ").slice(0, 1000);
      }
    }

    if (blockedExternalHosts.size > 0) {
      report.fatalError = `Unexpected external requests were blocked: ${[...blockedExternalHosts].sort().join(", ")}`;
    }
    if (unexpectedHttpErrors.length > 0) {
      const details = unexpectedHttpErrors.map((item) => `${item.status} ${item.method} ${item.url} [${item.resourceClass}, ${item.resourceType}, ${item.timing.phase} #${item.timing.interactionIndex ?? "none"} +${item.timing.offsetFromAnalyzeMs ?? "n/a"}ms]`);
      report.fatalError = [report.fatalError, ...details].filter(Boolean).join("; ");
    }
    if (pageErrors.length > 0 || hydrationErrors.length > 0 || unexpectedConsoleDiagnostics.length > 0) {
      const details = unexpectedConsoleDiagnostics.map((item) => `${item.message} at ${item.location.url}:${item.location.lineNumber}:${item.location.columnNumber}`);
      report.fatalError = [report.fatalError, ...pageErrors, ...hydrationErrors, ...details].filter(Boolean).join("; ");
    }
    if (report.analyzeInteractions !== 17) {
      report.fatalError = [report.fatalError, `Expected 17 Analyze interactions, observed ${report.analyzeInteractions}.`].filter(Boolean).join("; ");
    }
    report.outcome = report.fatalError || report.cases.some((result) => result.outcome === "FAIL")
      ? "FAIL"
      : "PASS";
  } catch (error) {
    report.fatalError = errorMessage(error).slice(0, 1500);
    report.outcome = "BLOCKED";
  } finally {
    report.blockedExternalHosts = [...blockedExternalHosts].sort();
    report.consoleErrors = consoleErrors;
    report.consoleDiagnostics = consoleDiagnostics;
    report.httpErrors = httpErrors;
    report.pageErrors = pageErrors;
    report.hydrationErrors = hydrationErrors;
    if (browser) {
      await browser.close().catch((error: unknown) => {
        report.fatalError = [report.fatalError, `browser close: ${errorMessage(error)}`].filter(Boolean).join("; ");
        report.outcome = "FAIL";
      });
    }
    if (server) {
      await server.stop().catch((error: unknown) => {
        report.fatalError = [report.fatalError, `server stop: ${errorMessage(error)}`].filter(Boolean).join("; ");
        report.outcome = "FAIL";
      });
    }
    await writeFile(join(artifactDirectory, "result-matrix.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  console.log(`HTTP_ERROR_DIAGNOSTICS=${JSON.stringify(report.httpErrors)}`);
  console.log(`CONSOLE_ERROR_DIAGNOSTICS=${JSON.stringify(report.consoleDiagnostics)}`);
  assert(report.outcome === "PASS", `Hosted structural browser smoke ${report.outcome}: ${report.fatalError ?? "one or more cases failed"}`);
  assert(report.analyzeInteractions === 17, `Expected 17 Analyze interactions, observed ${report.analyzeInteractions}.`);
  console.log(`STRUCTURAL_BROWSER_SMOKE=${report.outcome}`);
  console.log(`ANALYZE_INTERACTIONS=${report.analyzeInteractions}`);
  console.log(`RESULT_MATRIX=${join(artifactDirectory, "result-matrix.json")}`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});

#!/usr/bin/env tsx

import { chromium, type Browser } from "playwright";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startNextServer } from "../../tests/helpers/ownedNextServer";

const TIMEOUT_MS = 120_000;
const REPLAY_FILES: Record<string, string> = {
  "administronjës": "zero-pr2300-administronjës.json",
  "shkencëtar": "zero-pr2300-shkencëtar.json",
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ViewportMeasurement = {
  width: number;
  height: number;
  scrollY: number;
  documentWidth: number;
  resultTop: number | null;
  primaryTargetTop: number | null;
  headerBottom: number | null;
  cardTop: number | null;
  cardBottom: number | null;
  cardIntersectsContentViewport: boolean;
  wordInputTop: number | null;
  wordInputBottom: number | null;
  wordInputFocused: boolean;
};

async function measure(page: import("playwright").Page): Promise<ViewportMeasurement> {
  return page.evaluate(() => {
    const result = document.querySelector<HTMLElement>(
      '[data-testid="settled-analysis-result"]',
    );
    const card = document.querySelector<HTMLElement>(
      '[data-testid="primary-albanian-reading"]',
    );
    const header = document.querySelector<HTMLElement>("header");
    const wordInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Word"]',
    );
    const cardRect = card?.getBoundingClientRect() ?? null;
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY,
      documentWidth: document.documentElement.scrollWidth,
      resultTop: result?.getBoundingClientRect().top ?? null,
      primaryTargetTop: document
        .querySelector<HTMLElement>('[data-testid="primary-reading-scroll-target"]')
        ?.getBoundingClientRect().top ?? null,
      headerBottom,
      cardTop: cardRect?.top ?? null,
      cardBottom: cardRect?.bottom ?? null,
      cardIntersectsContentViewport: Boolean(
        cardRect && cardRect.bottom > headerBottom && cardRect.top < window.innerHeight,
      ),
      wordInputTop: wordInput?.getBoundingClientRect().top ?? null,
      wordInputBottom: wordInput?.getBoundingClientRect().bottom ?? null,
      wordInputFocused: document.activeElement === wordInput,
    };
  });
}

async function waitForSettledWord(
  page: import("playwright").Page,
  expectedWord: string,
  requireMobileComposerJump = false,
): Promise<void> {
  await page.waitForFunction(
    (word) =>
      document.querySelector('[data-testid="instrument-word"]')?.textContent?.trim() === word &&
      document.querySelector<HTMLButtonElement>('button[aria-busy]')?.getAttribute("aria-busy") === "false",
    expectedWord,
    { timeout: TIMEOUT_MS },
  );
  await page.getByTestId("primary-albanian-reading").waitFor({ state: "visible" });
  if (requireMobileComposerJump) {
    await page.getByTestId("mobile-composer-jump").waitFor({ state: "visible" });
  }
}

async function main(): Promise<void> {
  let server: Awaited<ReturnType<typeof startNextServer>> | undefined;
  let browser: Browser | undefined;
  const browserErrors: string[] = [];
  const consoleErrors: string[] = [];
  const httpErrors: Array<{ status: number; url: string }> = [];
  const replayDirectory = process.env.OPEN_INSTRUMENT_AUTHENTIC_REPLAY_DIR;
  const replayPayloads = new Map<string, string>();
  let analyzeRequests = 0;

  try {
    if (replayDirectory) {
      for (const [word, filename] of Object.entries(REPLAY_FILES)) {
        const body = await readFile(join(replayDirectory, filename), "utf8");
        const payload = JSON.parse(body) as {
          word?: string;
          motivationDiscoveryV0_1?: {
            exactLexicalSourceStatus?: { status?: string };
            exactLexicalSourceFacts?: Array<{
              sourceRecordId?: string;
              senses?: Array<{ senseId?: string; glosses?: string[] }>;
            }>;
            albanianLexicalReading?: {
              functionalMeaningBridge?: {
                functionalHypothesis?: { functionalOperation?: string };
              };
            };
          };
        };
        const sourceFact = payload.motivationDiscoveryV0_1?.exactLexicalSourceFacts?.[0];
        assert(payload.word === word, `Authentic replay word mismatch for ${word}.`);
        assert(payload.motivationDiscoveryV0_1?.exactLexicalSourceStatus?.status === "MATCHES_FOUND", `Authentic source record missing for ${word}.`);
        assert(Boolean(sourceFact?.sourceRecordId && sourceFact.senses?.[0]?.senseId), `Exact source record and sense identity missing for ${word}.`);
        assert(payload.motivationDiscoveryV0_1?.albanianLexicalReading?.functionalMeaningBridge?.functionalHypothesis?.functionalOperation === "AGENT", `Expected the source-bounded AGENT result for ${word}.`);
        replayPayloads.set(word, body);
        console.log(`AUTHENTIC_REPLAY_RECORD_${word}=${JSON.stringify({ sourceRecordId: sourceFact?.sourceRecordId, senseId: sourceFact?.senses?.[0]?.senseId, glosses: sourceFact?.senses?.[0]?.glosses })}`);
      }
    }

    server = await startNextServer("dev");
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    if (replayPayloads.size > 0) {
      await context.route("**/api/analyze-v1?*", async (route) => {
        const requestedWord = new URL(route.request().url()).searchParams.get("word") ?? "";
        const body = replayPayloads.get(requestedWord);
        if (!body) {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body,
        });
      });
      console.log("AUTHENTIC_RESPONSE_REPLAY=YES");
    } else {
      console.log("AUTHENTIC_RESPONSE_REPLAY=NO");
    }
    const page = await context.newPage();
    page.setDefaultTimeout(TIMEOUT_MS);
    page.on("pageerror", (error) => browserErrors.push(`JavaScript exception: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") {
        const location = message.location().url;
        consoleErrors.push(`${message.text()}${location ? ` (${location})` : ""}`);
      }
    });
    page.on("response", (resource) => {
      if (resource.status() >= 400) httpErrors.push({ status: resource.status(), url: resource.url() });
    });
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.origin === server?.base && url.pathname === "/api/analyze-v1") {
        analyzeRequests += 1;
      }
    });

    const response = await page.goto(`${server.base}/chat`, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT_MS,
    });
    assert(response?.ok(), `Expected /chat to load, received HTTP ${response?.status() ?? "none"}.`);

    const alphabetProfile = page.getByRole("combobox", { name: "Alphabet profile" });
    await alphabetProfile.click();
    await page.getByRole("option", { name: "Albanian", exact: true }).click();

    const wordInput = page.getByRole("textbox", { name: "Word" });
    const analyzeButton = page.getByRole("button", { name: "Analyze", exact: true });

    await wordInput.fill("administronjës");
    await analyzeButton.click();
    await waitForSettledWord(page, "administronjës", true);
    const firstMobile = await measure(page);
    assert(firstMobile.width === 390 && firstMobile.height === 844, "Mobile viewport was not 390×844.");
    assert(firstMobile.cardIntersectsContentViewport, "First primary Albanian reading did not intersect the mobile viewport.");
    assert(
      firstMobile.primaryTargetTop !== null &&
        firstMobile.headerBottom !== null &&
        firstMobile.primaryTargetTop >= firstMobile.headerBottom,
      "First primary reading target was obscured by the sticky header.",
    );
    assert(firstMobile.documentWidth <= firstMobile.width, "First result introduced horizontal page overflow.");
    assert(await page.getByTestId("primary-albanian-reading").isVisible(), "First primary Albanian reading was not visible.");
    const firstCardText = await page.getByTestId("primary-albanian-reading").innerText();
    const firstSourceStatus = firstCardText.match(/Source status · ([A-Z_]+)/)?.[1] ?? "UNRECOGNIZED";
    console.log(`MOBILE_FIRST_ADMINISTRONJES=${JSON.stringify({ ...firstMobile, sourceStatus: firstSourceStatus })}`);
    if (replayPayloads.has("administronjës")) {
      assert(firstCardText.includes("en-administronjës-sq-noun-aYSRYity"), "Authentic administronjës sense identity was not visible in the card.");
      assert(firstCardText.includes("manager, administrator"), "Authentic administronjës gloss was not visible in the card.");
      assert(firstCardText.includes("Functional role: AGENT"), "Authentic source-backed AGENT result was not visible in the card.");
    }
    const cardClasses = await Promise.all([
      "primary-albanian-source-fact",
      "primary-albanian-functional-reading",
      "primary-albanian-structural-status",
      "primary-albanian-unknown-null",
    ].map(async (testId) => ({ testId, count: await page.getByTestId(testId).count() })));
    assert(cardClasses.every(({ count }) => count === 1), "The primary reading did not render all four evidence classes exactly once.");
    console.log(`MOBILE_FIRST_CARD_CLASSES=${JSON.stringify(cardClasses)}`);
    const firstCardSectionBounds = await page.evaluate(() => {
      const ids = [
        "primary-albanian-source-fact",
        "primary-albanian-functional-reading",
        "primary-albanian-structural-status",
        "primary-albanian-unknown-null",
      ];
      return ids.map((id) => {
        const element = document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
        const rect = element?.getBoundingClientRect();
        return {
          id,
          top: rect?.top ?? null,
          bottom: rect?.bottom ?? null,
          intersectsViewport: Boolean(rect && rect.bottom > 0 && rect.top < window.innerHeight),
        };
      });
    });
    assert(firstCardSectionBounds[0]?.intersectsViewport, "The source fact section was outside the mobile viewport.");
    assert(firstCardSectionBounds[1]?.intersectsViewport, "The functional reading section was outside the mobile viewport.");
    console.log(`MOBILE_FIRST_CARD_SECTION_BOUNDS=${JSON.stringify(firstCardSectionBounds)}`);
    const firstScreenshot = join(tmpdir(), "zero-pr2300-mobile-administronjes.png");
    await page.screenshot({ path: firstScreenshot });
    console.log(`MOBILE_FIRST_SCREENSHOT=${firstScreenshot}`);

    const composerJump = page.getByTestId("mobile-composer-jump");
    assert(await composerJump.isVisible(), "Mobile Analyze another word control was not visible with the result.");
    await composerJump.click();
    const composerPosition = await measure(page);
    assert(composerPosition.wordInputFocused, "Composer jump did not focus the Word input.");
    assert(
      composerPosition.wordInputTop !== null &&
        composerPosition.wordInputBottom !== null &&
        composerPosition.wordInputBottom > 0 &&
        composerPosition.wordInputTop < composerPosition.height,
      "Word input was not reachable in the mobile viewport after the composer jump.",
    );
    console.log(`MOBILE_COMPOSER_ACCESS=${JSON.stringify(composerPosition)}`);

    await wordInput.fill("shkencëtar");
    const secondRequestCount = analyzeRequests + 1;
    await analyzeButton.click();
    await waitForSettledWord(page, "shkencëtar", true);
    assert(analyzeRequests === secondRequestCount, `Expected one second analysis request, saw ${analyzeRequests}.`);
    const secondMobile = await measure(page);
    assert(secondMobile.cardIntersectsContentViewport, "Second primary Albanian reading did not intersect the mobile viewport.");
    assert(
      secondMobile.primaryTargetTop !== null &&
        secondMobile.headerBottom !== null &&
        secondMobile.primaryTargetTop >= secondMobile.headerBottom,
      "Second primary reading target was obscured by the sticky header.",
    );
    assert(secondMobile.documentWidth <= secondMobile.width, "Second result introduced horizontal page overflow.");
    assert((await page.getByTestId("instrument-word").textContent())?.trim() === "shkencëtar", "Second result retained a stale word target.");
    const secondCardText = await page.getByTestId("primary-albanian-reading").innerText();
    const secondSourceStatus = secondCardText.match(/Source status · ([A-Z_]+)/)?.[1] ?? "UNRECOGNIZED";
    console.log(`MOBILE_SECOND_SHKENCETAR=${JSON.stringify({ ...secondMobile, sourceStatus: secondSourceStatus })}`);
    const secondScreenshot = join(tmpdir(), "zero-pr2300-mobile-shkencetar.png");
    await page.screenshot({ path: secondScreenshot });
    console.log(`MOBILE_SECOND_SCREENSHOT=${secondScreenshot}`);
    if (replayPayloads.has("shkencëtar")) {
      assert(secondCardText.includes("en-shkencëtar-sq-noun-wtonALhR"), "Authentic shkencëtar sense identity was not visible in the card.");
      assert(secondCardText.includes("scientist"), "Authentic shkencëtar gloss was not visible in the card.");
      assert(secondCardText.includes("Functional role: AGENT"), "Authentic source-backed AGENT result was not visible in the card.");
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const desktop = await measure(page);
    assert(desktop.width === 1440 && desktop.height === 900, "Desktop viewport was not 1440×900.");
    assert(desktop.cardIntersectsContentViewport, "Desktop Albanian reading card was not visible at the page's result section.");
    assert(desktop.documentWidth <= desktop.width, "Desktop layout introduced horizontal overflow.");
    console.log(`DESKTOP_RESULT=${JSON.stringify(desktop)}`);
    const desktopScreenshot = join(tmpdir(), "zero-pr2300-desktop.png");
    await page.screenshot({ path: desktopScreenshot });
    console.log(`DESKTOP_SCREENSHOT=${desktopScreenshot}`);

    assert(analyzeRequests === 2, `Expected exactly two mobile analyses, saw ${analyzeRequests}.`);
    assert(browserErrors.length === 0, `Browser errors observed: ${browserErrors.join(" | ")}`);
    console.log("MOBILE_RESULT_SETTLEMENT=PASS");
    console.log("MOBILE_COMPOSER_ACCESS=PASS");
    console.log("DESKTOP_LAYOUT=PASS");
    console.log(`JAVASCRIPT_ERRORS=${JSON.stringify(browserErrors)}`);
    console.log(`CONSOLE_ERRORS=${JSON.stringify(consoleErrors)}`);
    console.log(`HTTP_ERRORS=${JSON.stringify(httpErrors)}`);
    if (replayPayloads.size > 0) console.log("AUTHENTIC_RESPONSE_REPLAY_CARD=PASS");
    await context.close();
  } finally {
    if (browser) await browser.close();
    if (server) await server.stop();
  }
}

main().catch((error) => {
  console.error("MOBILE_RESULT_SETTLEMENT_SMOKE=FAIL");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});

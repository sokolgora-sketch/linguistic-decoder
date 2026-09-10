#!/usr/bin/env tsx

import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import net from "node:net";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { chromium, type Browser } from "playwright";
import {
  serializeEvidencePackageExportV0_1,
  validateEvidencePackageExportV0_1,
} from "../../src/shared/openInstrument/evidencePackageExport.v0_1";
import { parseReproducibleRunBundleV0_1 } from "../../src/shared/openInstrument/reproducibleRunBundle.v0_1";
import { startNextServer } from "../../tests/helpers/ownedNextServer";

const PAGE_TIMEOUT_MS = 30_000;
const FORCE_FAILURE = process.env.OPEN_INSTRUMENT_BROWSER_SMOKE_FORCE_FAILURE === "1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function isPortClosed(url: string): Promise<boolean> {
  const port = Number(new URL(url).port);
  return await new Promise((resolve) => {
    const probe = net.createConnection({ host: "127.0.0.1", port });
    const close = (value: boolean) => {
      probe.destroy();
      resolve(value);
    };
    probe.once("connect", () => close(false));
    probe.once("error", () => close(true));
  });
}

async function main(): Promise<void> {
  let server: Awaited<ReturnType<typeof startNextServer>> | undefined;
  let browser: Browser | undefined;
  let downloadDirectory: string | undefined;
  let runError: unknown;

  try {
    downloadDirectory = await mkdtemp(join(tmpdir(), "open-instrument-browser-smoke-"));
    server = await startNextServer("start");
    const baseUrl = new URL(server.base);
    assert(baseUrl.protocol === "http:", "Browser smoke server must use HTTP.");
    assert(baseUrl.hostname === "127.0.0.1", "Browser smoke server must bind loopback.");
    console.log("SERVER_START=PASS");

    browser = await chromium.launch({ headless: true });
    console.log("BROWSER_LAUNCH=PASS");

    const context = await browser.newContext({ acceptDownloads: true });
    const externalRequests = new Set<string>();
    let analyzeRequests = 0;
    context.on("request", (request) => {
      const requestUrl = new URL(request.url());
      if (
        (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") &&
        (requestUrl.hostname !== baseUrl.hostname || requestUrl.port !== baseUrl.port)
      ) {
        externalRequests.add(request.url());
      }
      if (requestUrl.hostname === baseUrl.hostname && requestUrl.port === baseUrl.port && requestUrl.pathname === "/api/analyze-v1") {
        analyzeRequests += 1;
      }
    });

    const page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);
    const response = await page.goto(`${server.base}/chat`, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_TIMEOUT_MS,
    });
    assert(response?.ok(), `Expected /chat to load, received HTTP ${response?.status() ?? "no response"}.`);
    await page.getByRole("textbox", { name: "Word" }).waitFor({ state: "visible" });
    await page.getByRole("region", { name: "Open Instrument ready" }).waitFor({ state: "visible" });
    console.log("CHAT_PAGE_BROWSER_LOAD=PASS");
    console.log("CHAT_HYDRATION=PASS");

    await page.getByRole("textbox", { name: "Word" }).fill("study");
    await page.getByRole("button", { name: "Analyze" }).click();
    await page.getByTestId("open-instrument-shell").waitFor({ state: "visible" });
    await page.getByTestId("instrument-word").waitFor({ state: "visible" });
    assert((await page.getByTestId("instrument-word").textContent())?.trim() === "study", "Fresh result did not display study.");
    await page.getByText("Current analysis", { exact: true }).waitFor({ state: "visible" });
    assert(analyzeRequests === 1, `Expected one fresh analysis request, observed ${analyzeRequests}.`);
    console.log("FRESH_ANALYSIS=PASS");
    console.log("CURRENT_ANALYSIS_PROVENANCE=PASS");
    console.log(`ANALYZE_REQUESTS_AFTER_FRESH=${analyzeRequests}`);

    await page.getByRole("tab", { name: "Evidence" }).click();
    const evidenceDownloadPromise = page.waitForEvent("download", { timeout: PAGE_TIMEOUT_MS });
    await page.getByRole("button", { name: "Download Evidence Package" }).click();
    const evidenceDownload = await evidenceDownloadPromise;
    console.log("EVIDENCE_DOWNLOAD_EVENT_OBSERVED=PASS");

    const evidenceDownloadPath = join(
      downloadDirectory,
      basename(evidenceDownload.suggestedFilename() || "open-instrument-evidence-package.json"),
    );
    await evidenceDownload.saveAs(evidenceDownloadPath);
    const evidenceFile = await stat(evidenceDownloadPath);
    assert(evidenceFile.isFile() && evidenceFile.size > 0, "Evidence Package download did not produce a non-empty file.");
    console.log("EVIDENCE_PHYSICAL_DOWNLOAD_EXISTS=PASS");
    const evidenceBytes = await readFile(evidenceDownloadPath);
    assert(evidenceBytes.length > 0, "Evidence Package download contained no bytes.");
    console.log("EVIDENCE_DOWNLOADED_BYTES_READ=PASS");

    const evidenceText = evidenceBytes.toString("utf8");
    let evidenceValue: unknown;
    try {
      evidenceValue = JSON.parse(evidenceText);
    } catch {
      throw new Error("Evidence Package download was not valid JSON.");
    }
    assert(validateEvidencePackageExportV0_1(evidenceValue).ok, "Downloaded Evidence Package failed durable validation.");
    const canonicalEvidence = serializeEvidencePackageExportV0_1(evidenceValue as Parameters<typeof serializeEvidencePackageExportV0_1>[0]);
    assert(canonicalEvidence.ok && canonicalEvidence.value === evidenceText, "Downloaded Evidence Package bytes were not canonical.");
    assert(
      typeof evidenceValue === "object" && evidenceValue !== null && !Array.isArray(evidenceValue),
      "Downloaded Evidence Package was not an object.",
    );
    const evidenceRecord = evidenceValue as { schemaVersion?: unknown; input?: { word?: unknown } };
    assert(evidenceRecord.schemaVersion === "open-instrument.evidence-package-export.v0.1", "Evidence Package schema was unexpected.");
    assert(evidenceRecord.input?.word === "study", "Evidence Package input did not contain study.");
    for (const forbiddenKey of ["raw", "debug", "providerOutput", "providerRequest", "providerResponse", "runtime", "researchRows"]) {
      assert(!evidenceText.includes(`"${forbiddenKey}"`), `Evidence Package contained forbidden field ${forbiddenKey}.`);
    }
    console.log("EVIDENCE_DURABLE_SERIALIZATION=PASS");
    console.log("EVIDENCE_SCHEMA=PASS");
    console.log("EVIDENCE_FORBIDDEN_FIELDS=PASS");
    assert(analyzeRequests === 1, `Evidence Package download triggered an additional analysis request; observed ${analyzeRequests}.`);
    console.log(`ANALYZE_REQUESTS_AFTER_EVIDENCE_DOWNLOAD=${analyzeRequests}`);

    const downloadPromise = page.waitForEvent("download", { timeout: PAGE_TIMEOUT_MS });
    await page.getByRole("button", { name: "Download analysis" }).click();
    const download = await downloadPromise;
    console.log("DOWNLOAD_EVENT_OBSERVED=PASS");

    const downloadPath = join(downloadDirectory, basename(download.suggestedFilename() || "open-instrument-analysis.json"));
    await download.saveAs(downloadPath);
    const downloadedFile = await stat(downloadPath);
    assert(downloadedFile.isFile() && downloadedFile.size > 0, "Browser download did not produce a non-empty file.");
    console.log("PHYSICAL_DOWNLOAD_EXISTS=PASS");
    const downloadedBytes = await readFile(downloadPath);
    assert(downloadedBytes.length > 0, "Downloaded file contained no bytes.");
    console.log("DOWNLOADED_BYTES_READ=PASS");

    const parsed = await parseReproducibleRunBundleV0_1(downloadedBytes.toString("utf8"));
    assert(parsed.ok, `Downloaded bundle failed production parsing: ${parsed.reason}`);
    assert(parsed.value.schemaVersion === "open-instrument.reproducible-run-bundle.v0.1", "Downloaded bundle schema was unexpected.");
    assert(parsed.value.fingerprint.algorithm === "sha256", "Downloaded bundle fingerprint algorithm was unexpected.");
    assert(parsed.value.fingerprint.value.length > 0, "Downloaded bundle fingerprint was empty.");
    assert(parsed.value.result.word === "study", "Downloaded bundle result did not contain study.");
    console.log("DOWNLOADED_BUNDLE_PARSE=PASS");
    console.log("PRODUCTION_BUNDLE_PARSER_USED=YES");
    console.log("DOWNLOADED_BUNDLE_FINGERPRINT=PASS");

    await page.locator('input[type="file"][aria-label="Open saved analysis"]').setInputFiles(downloadPath);
    await page.getByText("Imported local snapshot", { exact: true }).waitFor({ state: "visible" });
    await page.getByText(`Bundle schema: ${parsed.value.schemaVersion}`, { exact: true }).waitFor({ state: "visible" });
    await page.getByText(`Bundle fingerprint: ${parsed.value.fingerprint.value}`, { exact: true }).waitFor({ state: "visible" });
    assert((await page.getByTestId("instrument-word").textContent())?.trim() === "study", "Imported result did not display study.");
    assert(analyzeRequests === 1, `Import triggered an additional analysis request; observed ${analyzeRequests}.`);
    console.log("FILE_REOPEN=PASS");
    console.log("IMPORTED_LOCAL_SNAPSHOT=PASS");
    console.log("IMPORTED_SCHEMA_MATCH=PASS");
    console.log("IMPORTED_FINGERPRINT_MATCH=PASS");
    console.log(`ANALYZE_REQUESTS_AFTER_IMPORT=${analyzeRequests}`);
    console.log("IMPORT_REANALYSIS=NO");

    if (externalRequests.size > 0) {
      throw new Error(`Browser smoke observed non-loopback requests: ${[...externalRequests].join(", ")}`);
    }
    console.log("LOOPBACK_ONLY=PASS");

    if (FORCE_FAILURE) {
      throw new Error("Intentional browser smoke cleanup probe failure.");
    }
  } catch (error) {
    runError = error;
  }

  const cleanupErrors: Error[] = [];
  if (browser) {
    try {
      await browser.close();
      console.log("BROWSER_CLEANUP=PASS");
    } catch (error) {
      cleanupErrors.push(error instanceof Error ? error : new Error(String(error)));
      console.log("BROWSER_CLEANUP=FAIL");
    }
  }
  if (server) {
    try {
      const baseUrl = server.base;
      await server.stop();
      assert(await isPortClosed(baseUrl), "Owned Next server port remained open after cleanup.");
      console.log("SERVER_CLEANUP=PASS");
    } catch (error) {
      cleanupErrors.push(error instanceof Error ? error : new Error(String(error)));
      console.log("SERVER_CLEANUP=FAIL");
    }
  }
  if (downloadDirectory) {
    try {
      await rm(downloadDirectory, { recursive: true, force: true });
      await stat(downloadDirectory).then(
        () => { throw new Error("Temporary download directory remained after cleanup."); },
        () => undefined,
      );
      console.log("TEMP_DOWNLOAD_CLEANUP=PASS");
    } catch (error) {
      cleanupErrors.push(error instanceof Error ? error : new Error(String(error)));
      console.log("TEMP_DOWNLOAD_CLEANUP=FAIL");
    }
  }

  if (runError || cleanupErrors.length > 0) {
    const details = [runError, ...cleanupErrors]
      .filter(Boolean)
      .map((error) => error instanceof Error ? error.stack ?? error.message : String(error))
      .join("\n");
    throw new Error(details);
  }
}

main().catch((error) => {
  console.error("\nERROR: Open Instrument browser handoff smoke failed");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});

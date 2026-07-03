#!/usr/bin/env node

/**
 * Open Instrument live smoke v0.1.
 *
 * This is a local production-smoke runner:
 * - builds the app;
 * - starts next start on a local port;
 * - checks /chat and /;
 * - checks real /api/analyze-v1 responses with lane-correct proof words;
 * - optionally runs focused regression tests.
 *
 * It does not call external model providers.
 * It does not promote evidence.
 * It does not make origin, winner, or superiority claims.
 */

import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import net from "node:net";

const args = new Set(process.argv.slice(2));
const skipBuild = args.has("--skip-build");
const skipFocusedTests = args.has("--skip-focused-tests");
const host = process.env.OPEN_INSTRUMENT_LIVE_SMOKE_HOST ?? "127.0.0.1";
const requestedPort = process.env.OPEN_INSTRUMENT_LIVE_SMOKE_PORT
  ? Number(process.env.OPEN_INSTRUMENT_LIVE_SMOKE_PORT)
  : null;

const focusedTests = [
  "tests/apiAnalyzeV1.reviewedDaRuntimeProjection.liveWords.v0_1.spec.ts",
  "tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts",
  "tests/reviewedExternalLexiconSourceRowRegistry.diLocatorArchiveAssessment.v0_1.spec.ts",
  "tests/docs.uiTelemetryContract.liveSurface.v0_1.spec.ts",
];

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { stdio: "inherit", shell: false });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasText(value, needle) {
  return String(value ?? "").includes(needle);
}

function rootMapKeys(data) {
  return Array.isArray(data?.rootMap?.keys) ? data.rootMap.keys : [];
}

function evidenceText(data) {
  return JSON.stringify(data?.rootMap ?? {});
}

function hasKey(data, token) {
  return rootMapKeys(data).some((key) => key?.token === token);
}

function hasReviewedDaEvidence(data) {
  const text = evidenceText(data);
  return (
    hasText(text, "reviewed functional free-operator evidence") &&
    hasText(text, "Dedvukaj & Ndoci 2023 PLSA") &&
    hasText(text, "10.3765/plsa.v8i1.5501") &&
    hasText(text, "historicalOriginClaim=not_claimed") &&
    hasText(text, "winnerClaim=not_claimed") &&
    hasText(text, "languageSuperiorityClaim=not_claimed") &&
    hasText(text, "userDecisionPosture=user_decides")
  );
}

function hasReviewedDiProjection(data) {
  const text = evidenceText(data);
  return (
    hasText(text, "reviewed.external.di.knowledge.candidate.v0_1") ||
    hasText(text, "reviewed functional free-operator evidence: di") ||
    hasText(text, "Direct DPEWA/FGJSH locator")
  );
}

async function isPortAvailable(port) {
  return await new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

async function choosePort() {
  if (requestedPort) {
    assert(await isPortAvailable(requestedPort), `Requested port is not available: ${requestedPort}`);
    return requestedPort;
  }

  for (let port = 3112; port <= 3122; port += 1) {
    if (await isPortAvailable(port)) return port;
  }

  throw new Error("No available live-smoke port found in 3112..3122.");
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    const body = await response.text();
    assert(response.ok, `${url} returned HTTP ${response.status}`);
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url) {
  const text = await fetchText(url);
  return JSON.parse(text);
}

async function waitForServer(baseUrl) {
  const deadline = Date.now() + 30_000;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      await fetchText(`${baseUrl}/chat`);
      return;
    } catch (error) {
      lastError = error;
      await delay(500);
    }
  }

  throw new Error(`Server did not become ready: ${lastError?.message ?? "unknown error"}`);
}

function summarize(word, data) {
  return {
    word,
    rootMapPresent: data?.rootMap != null,
    rootMapTokens: Array.isArray(data?.rootMap?.tokens)
      ? data.rootMap.tokens.map((token) => token?.token).filter(Boolean)
      : [],
    rootMapKeys: rootMapKeys(data).map((key) => ({
      token: key?.token,
      language: key?.language,
      gloss: key?.gloss,
      status: key?.status,
      evidence: key?.evidence,
    })),
    reviewedDaEvidenceVisible: hasReviewedDaEvidence(data),
    reviewedDiRuntimeProjectionVisible: hasReviewedDiProjection(data),
  };
}

async function main() {
  if (!skipBuild) {
    console.log("\n=== production build ===");
    run("npm", ["run", "build"]);
  }

  const port = await choosePort();
  const baseUrl = `http://${host}:${port}`;
  console.log(`\n=== start next server: ${baseUrl} ===`);

  const server = spawn("npm", ["run", "start", "--", "-p", String(port), "-H", host], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  server.stdout.on("data", (chunk) => process.stdout.write(String(chunk)));
  server.stderr.on("data", (chunk) => process.stderr.write(String(chunk)));

  try {
    await waitForServer(baseUrl);

    console.log("\n=== live route smoke ===");
    const chatHtml = await fetchText(`${baseUrl}/chat`);
    const rootHtml = await fetchText(`${baseUrl}/`);

    assert(chatHtml.includes("ZË-RO"), "/chat missing ZË-RO text");
    assert(chatHtml.includes("Open Instrument"), "/chat missing Open Instrument text");
    assert(chatHtml.includes("Evidence"), "/chat missing Evidence text");
    assert(rootHtml.includes("ZË-RO"), "/ missing ZË-RO text");
    assert(rootHtml.includes("Open Instrument"), "/ missing Open Instrument text");

    console.log(JSON.stringify({
      chat: { ok: true, bytes: chatHtml.length },
      root: { ok: true, bytes: rootHtml.length },
    }, null, 2));

    console.log("\n=== live api smoke ===");
    const words = ["da", "dam", "study", "damage", "xyz"];
    const results = {};

    for (const word of words) {
      const url = `${baseUrl}/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`;
      results[word] = await fetchJson(url);
      console.log(JSON.stringify(summarize(word, results[word]), null, 2));
    }

    assert(hasKey(results.da, "DA"), "Expected da to expose DA as a RootMap key.");
    assert(hasReviewedDaEvidence(results.da), "Expected da to expose reviewed DA functional evidence.");

    assert(hasKey(results.dam, "DA"), "Expected dam to expose DA as a RootMap key.");
    assert(hasReviewedDaEvidence(results.dam), "Expected dam to expose reviewed DA functional evidence.");

    assert(hasKey(results.study, "DI"), "Expected study to expose DI as ordinary RootMap carrier evidence.");
    assert(!hasReviewedDiProjection(results.study), "Expected study to keep reviewed DI runtime projection absent.");

    assert(!hasReviewedDaEvidence(results.damage), "Expected damage to avoid broad English semantic DA evidence.");
    assert(!hasReviewedDaEvidence(results.xyz), "Expected xyz to avoid reviewed DA evidence.");
    assert(!hasReviewedDiProjection(results.xyz), "Expected xyz to avoid reviewed DI runtime projection.");

    if (!skipFocusedTests) {
      console.log("\n=== focused regression proof ===");
      for (const test of focusedTests) {
        run("npm", ["test", "--", test, "--runInBand"]);
      }
    }

    console.log("\n✅ open-instrument live smoke passed\n");
  } finally {
    server.kill("SIGTERM");
    await delay(500);
  }
}

main().catch((error) => {
  console.error("\nERROR: open-instrument live smoke failed");
  console.error(error);
  process.exit(1);
});

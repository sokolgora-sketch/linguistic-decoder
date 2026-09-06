#!/usr/bin/env tsx

/**
 * Open Instrument live smoke v0.1.
 *
 * This is a local production-smoke runner:
 * - builds the app;
 * - starts next start on a local port;
 * - checks /chat and /;
 * - derives real /api/analyze-v1 proof cases from canonical operator profiles;
 * - optionally runs focused regression tests.
 *
 * It does not call external model providers.
 * It does not promote evidence.
 * It does not make origin, winner, or superiority claims.
 */

import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import { setTimeout as delay } from "node:timers/promises";

import {
  buildCanonicalOperatorLiveSmokeCasesV0_1,
  getCanonicalOperatorLiveSmokeWordsV0_1,
  type CanonicalOperatorLiveSmokeCaseV0_1,
} from "./canonical-operator-live-smoke-cases.v0.1";

import {
  sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1,
} from "../../src/data/sevenVoiceFunctionalRecurrenceResearchCohorts.v0_1";

import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
} from "../../src/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

const args = new Set(process.argv.slice(2));
const skipBuild = args.has("--skip-build");
const skipFocusedTests = args.has("--skip-focused-tests");

const host =
  process.env.OPEN_INSTRUMENT_LIVE_SMOKE_HOST ?? "127.0.0.1";

const requestedPort = process.env.OPEN_INSTRUMENT_LIVE_SMOKE_PORT
  ? Number(process.env.OPEN_INSTRUMENT_LIVE_SMOKE_PORT)
  : null;

const focusedTests = [
  "tests/canonicalOperatorProfile.v0_1.spec.ts",
  "tests/canonicalOperatorSharedContract.v0_1.spec.ts",
  "tests/openInstrument.canonicalOperatorLiveSmoke.profileDriven.v0_1.spec.ts",
  "tests/apiAnalyzeV1.reviewedDaRuntimeProjection.liveWords.v0_1.spec.ts",
  "tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts",
  "tests/apiAnalyzeV1.reviewedDiRuntimeBlocker.contract.v0_1.spec.ts",
  "tests/docs.uiTelemetryContract.liveSurface.v0_1.spec.ts",
  "tests/openInstrument.sevenVoiceFunctionalRecurrenceResearchCatalog.catalogWide.v0_1.spec.ts",
  "tests/openInstrument.crossLanguageRecurrenceCard.v0_1.spec.tsx",
];

function run(command: string, commandArgs: readonly string[]): void {
  const result = spawnSync(command, [...commandArgs], {
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw new Error(message);
}

function rootMapKeys(data: any): readonly any[] {
  return Array.isArray(data?.rootMap?.keys)
    ? data.rootMap.keys
    : [];
}

function rootMapKey(
  data: any,
  token: string,
): any | null {
  return (
    rootMapKeys(data).find(
      (key) => key?.token === token,
    ) ?? null
  );
}

function rootMapKeyEvidenceText(
  data: any,
  token: string,
): string {
  const key = rootMapKey(data, token);

  return Array.isArray(key?.evidence)
    ? key.evidence.join("\n")
    : "";
}

function hasKey(data: any, token: string): boolean {
  return rootMapKey(data, token) != null;
}

function hasExactReviewedProjection(
  data: any,
  token: string,
  evidenceText: string,
): boolean {
  return rootMapKeyEvidenceText(
    data,
    token,
  ).includes(evidenceText);
}

function hasCitationBearingReviewedEvidence(
  data: any,
  token: string,
): boolean {
  const evidence = rootMapKeyEvidenceText(data, token);

  return /\breviewed\b|\bcitation\b|\bdoi\b|https?:\/\//i.test(
    evidence,
  );
}

async function isPortAvailable(port: number): Promise<boolean> {
  return await new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, host);
  });
}

async function choosePort(): Promise<number> {
  if (requestedPort != null) {
    assert(
      Number.isInteger(requestedPort) && requestedPort > 0,
      `Invalid requested port: ${requestedPort}`,
    );

    assert(
      await isPortAvailable(requestedPort),
      `Requested port is not available: ${requestedPort}`,
    );

    return requestedPort;
  }

  for (let port = 3112; port <= 3122; port += 1) {
    if (await isPortAvailable(port)) return port;
  }

  throw new Error("No available live-smoke port found in 3112..3122.");
}

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    const body = await response.text();

    assert(
      response.ok,
      `${url} returned HTTP ${response.status}`,
    );

    return body;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url: string): Promise<any> {
  return JSON.parse(await fetchText(url));
}

async function waitForServer(baseUrl: string): Promise<void> {
  const deadline = Date.now() + 30_000;
  let lastError: unknown = null;

  while (Date.now() < deadline) {
    try {
      await fetchText(`${baseUrl}/chat`);
      return;
    } catch (error) {
      lastError = error;
      await delay(500);
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "unknown error";

  throw new Error(`Server did not become ready: ${message}`);
}

const EXPECTED_ANALYSIS_STATUS_BY_WORD_V0_1: Readonly<Record<string, string>> = {
  da: "reviewed_functional_evidence",
  dam: "reviewed_functional_evidence",
  damage: "reviewed_functional_evidence",
  di: "reviewed_functional_evidence",
  study: "reviewed_functional_evidence",
  studim: "reviewed_functional_evidence",
  data: "candidate_only",
  dij: "candidate_only",
  dije: "candidate_only",
  dit: "candidate_only",
  mode: "structural_unreviewed",
  made: "structural_unreviewed",
  dome: "structural_unreviewed",
  xyz: "null_no_supported_candidate",
};

const ALLOWED_ANALYSIS_STATUSES_V0_1 = new Set([
  "reviewed_functional_evidence",
  "research_functional_hypothesis",
  "candidate_only",
  "structural_unreviewed",
  "null_no_supported_candidate",
]);

function assertAnalysisStatusV0_1(
  word: string,
  data: any,
): void {
  const analysisStatus = data?.analysisStatusV0_1;

  assert(
    analysisStatus != null && typeof analysisStatus === "object",
    `Expected ${word} to expose analysisStatusV0_1.`,
  );

  assert(
    analysisStatus.schemaVersion === "open-instrument.analysis-status.v0_1",
    `Expected ${word} to expose the analysis status v0.1 schema.`,
  );

  assert(
    ALLOWED_ANALYSIS_STATUSES_V0_1.has(analysisStatus.status),
    `Expected ${word} to expose an allowed analysis status.`,
  );

  const expectedStatus =
    EXPECTED_ANALYSIS_STATUS_BY_WORD_V0_1[word];

  if (expectedStatus) {
    assert(
      analysisStatus.status === expectedStatus,
      `Expected ${word} analysis status ${expectedStatus}; received ${String(analysisStatus.status)}.`,
    );
  }

  assert(
    analysisStatus.userDecisionPosture === "user_decides",
    `Expected ${word} to preserve user_decides.`,
  );

  assert(
    analysisStatus.claimBoundary?.historicalOriginClaim === "not_claimed" &&
      analysisStatus.claimBoundary?.historicalTransmissionClaim === "not_claimed" &&
      analysisStatus.claimBoundary?.winnerClaim === "not_claimed" &&
      analysisStatus.claimBoundary?.languageSuperiorityClaim === "not_claimed" &&
      analysisStatus.claimBoundary?.linguisticOwnershipClaim === "not_claimed" &&
      analysisStatus.claimBoundary?.candidateTruthClaim === "not_claimed" &&
      analysisStatus.claimBoundary?.structuralOutputIsCandidateTruth === false &&
      analysisStatus.claimBoundary?.nullIsValid === true,
    `Expected ${word} to preserve all analysis-status claim boundaries.`,
  );
}
function summarizeWord(
  word: string,
  data: any,
  cases: readonly CanonicalOperatorLiveSmokeCaseV0_1[],
): Record<string, unknown> {
  assertAnalysisStatusV0_1(word, data);
  return {
    word,
    rootMapPresent: data?.rootMap != null,
    rootMapTokens: Array.isArray(data?.rootMap?.tokens)
      ? data.rootMap.tokens
          .map((token: any) => token?.token)
          .filter(Boolean)
      : [],
    rootMapKeys: rootMapKeys(data).map((key) => ({
      token: key?.token,
      language: key?.language,
      gloss: key?.gloss,
      status: key?.status,
      evidence: key?.evidence,
    })),
    canonicalOperatorChecks: cases.map((smokeCase) => ({
      operatorId: smokeCase.operatorId,
      sourceId: smokeCase.sourceId,
      expectation: smokeCase.expectation,
      evidenceVisible: hasExactReviewedProjection(
        data,
        smokeCase.embryo,
        smokeCase.evidenceText,
      ),
      citationBearingEvidenceVisible:
        hasCitationBearingReviewedEvidence(
          data,
          smokeCase.embryo,
        ),
    })),
  };
}

function assertSmokeCase(
  smokeCase: CanonicalOperatorLiveSmokeCaseV0_1,
  data: any,
): void {
  const evidenceVisible = hasExactReviewedProjection(
    data,
    smokeCase.embryo,
    smokeCase.evidenceText,
  );

  const citationBearingEvidenceVisible =
    hasCitationBearingReviewedEvidence(
      data,
      smokeCase.embryo,
    );

  if (smokeCase.expectation === "evidence_present") {
    assert(
      hasKey(data, smokeCase.embryo),
      `Expected ${smokeCase.word} to expose ${smokeCase.embryo} for ${smokeCase.operatorId}.`,
    );

    assert(
      evidenceVisible,
      `Expected ${smokeCase.word} to expose reviewed ${smokeCase.operatorId} evidence from ${smokeCase.sourceId}.`,
    );

    return;
  }

  assert(
    !evidenceVisible,
    `Expected ${smokeCase.word} to avoid reviewed ${smokeCase.operatorId} evidence from ${smokeCase.sourceId}.`,
  );

  assert(
    !citationBearingEvidenceVisible,
    `Expected ${smokeCase.word} to avoid citation-bearing reviewed ${smokeCase.operatorId} metadata on the ${smokeCase.embryo} RootMap key.`,
  );
}

async function main(): Promise<void> {
  const smokeCases =
    buildCanonicalOperatorLiveSmokeCasesV0_1();

  const words =
    getCanonicalOperatorLiveSmokeWordsV0_1();

  assert(smokeCases.length > 0, "No canonical live-smoke cases resolved.");
  assert(words.length > 0, "No canonical live-smoke words resolved.");

  if (!skipBuild) {
    console.log("\n=== production build ===");
    run("npm", ["run", "build"]);
  }

  const port = await choosePort();
  const baseUrl = `http://${host}:${port}`;

  console.log(`\n=== start next server: ${baseUrl} ===`);

  const server = spawn(
    "npm",
    ["run", "start", "--", "-p", String(port), "-H", host],
    {
      env: {
        ...process.env,
        OPEN_INSTRUMENT_AUTO_PROPOSER: "0",
        OPEN_INSTRUMENT_AUTO_CARRIER: "0",
        PROPOSER_PROVIDER: "mock",
      },
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    },
  );

  server.stdout.on("data", (chunk) => {
    process.stdout.write(String(chunk));
  });

  server.stderr.on("data", (chunk) => {
    process.stderr.write(String(chunk));
  });

  try {
    await waitForServer(baseUrl);

    console.log("\n=== live route smoke ===");

    const chatHtml = await fetchText(`${baseUrl}/chat`);
    const rootHtml = await fetchText(`${baseUrl}/`);

    assert(chatHtml.includes("ZË-RO"), "/chat missing ZË-RO text");
    assert(
      chatHtml.includes("Open Instrument"),
      "/chat missing Open Instrument text",
    );
    assert(
      chatHtml.includes("Analyze one word"),
      "/chat missing Analyze one word text",
    );
    assert(
      chatHtml.includes("Functional motivation"),
      "/chat missing Functional motivation text",
    );
    assert(rootHtml.includes("ZË-RO"), "/ missing ZË-RO text");
    assert(
      rootHtml.includes("Open Instrument"),
      "/ missing Open Instrument text",
    );

    console.log(
      JSON.stringify(
        {
          chat: {
            ok: true,
            bytes: chatHtml.length,
          },
          root: {
            ok: true,
            bytes: rootHtml.length,
          },
        },
        null,
        2,
      ),
    );

    console.log("\n=== cross-language recurrence research surface smoke ===");

    assert(
      sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1.length > 0,
      "Expected at least one FVR research cohort in the catalog.",
    );

    const recurrenceSummaries:
      Record<string, unknown> =
      {};

    for (
      const entry
      of sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1
    ) {
      const queryConcept =
        entry.aliases[0] ??
        entry.conceptId;

      const expected =
        buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
          entry.conceptId,
        );

      assert(
        expected?.status ===
          "available",
        `Expected admitted local FVR surface for ${entry.conceptId}.`,
      );

      const live =
        await fetchJson(
          `${baseUrl}/api/research/fvr?concept=${encodeURIComponent(
            queryConcept,
          )}`,
        );

      assert(
        live?.status ===
          "available",
        `Expected live FVR surface for ${entry.conceptId}.`,
      );

      assert(
        live?.conceptId ===
          expected.conceptId,
        `Expected live FVR concept id ${entry.conceptId}.`,
      );

      assert(
        live?.cohortId ===
          expected.cohortId,
        `Expected live FVR cohort id for ${entry.conceptId}.`,
      );

      assert(
        JSON.stringify(
          live
            ?.sharedCanonicalVoices,
        ) ===
          JSON.stringify(
            expected
              .sharedCanonicalVoices,
          ),
        `Expected live canonical recurrence for ${entry.conceptId}.`,
      );

      assert(
        JSON.stringify(
          live
            ?.sharedFunctionalNucleus,
        ) ===
          JSON.stringify(
            expected
              .sharedFunctionalNucleus,
          ),
        `Expected live functional nucleus for ${entry.conceptId}.`,
      );

      assert(
        JSON.stringify(
          live?.observations,
        ) ===
          JSON.stringify(
            expected.observations,
          ),
        `Expected live admitted observations for ${entry.conceptId}.`,
      );

      assert(
        JSON.stringify(
          live?.truth,
        ) ===
          JSON.stringify(
            expected.truth,
          ),
        `Expected live FVR truth boundary for ${entry.conceptId}.`,
      );

      assert(
        JSON.stringify(
          live?.claimBoundary,
        ) ===
          JSON.stringify(
            expected.claimBoundary,
          ),
        `Expected live FVR claim boundary for ${entry.conceptId}.`,
      );

      recurrenceSummaries[
        entry.conceptId
          .toLocaleLowerCase(
            "en-US",
          )
      ] = {
        status:
          live.status,
        conceptId:
          live.conceptId,
        sharedFunctionalNucleus:
          live
            .sharedFunctionalNucleus,
        comparisonForms:
          live
            .observations
            .map(
              (row: any) =>
                row
                  ?.comparisonForm,
            ),
        functionalVoiceMeaningTruth:
          live
            ?.truth
            ?.functionalVoiceMeaningTruth,
      };
    }

    const unknownRecurrenceResponse =
      await fetch(
        `${baseUrl}/api/research/fvr?concept=${encodeURIComponent(
          "__unknown_fvr_catalog_smoke__",
        )}`,
      );

    assert(
      unknownRecurrenceResponse.status ===
        404,
      "Expected unknown FVR concept to remain fail-closed with 404.",
    );

    console.log(
      JSON.stringify(
        {
          ...recurrenceSummaries,
          unknownConcept: {
            status:
              unknownRecurrenceResponse
                .status,
          },
        },
        null,
        2,
      ),
    );

    console.log("\n=== canonical profile-backed live api smoke ===");

    const results: Record<string, any> = {};

    for (const word of words) {
      const url =
        `${baseUrl}/api/analyze-v1` +
        `?word=${encodeURIComponent(word)}` +
        "&mode=strict&alphabet=auto";

      results[word] = await fetchJson(url);

      const wordCases = smokeCases.filter(
        (smokeCase) => smokeCase.word === word,
      );

      console.log(
        JSON.stringify(
          summarizeWord(word, results[word], wordCases),
          null,
          2,
        ),
      );
    }

    console.log("\n=== canonical operator assertions ===");

    for (const smokeCase of smokeCases) {
      const data = results[smokeCase.word];

      assert(
        data != null,
        `Missing fetched result for ${smokeCase.word}.`,
      );

      assertSmokeCase(smokeCase, data);

      console.log(
        JSON.stringify(
          {
            operatorId: smokeCase.operatorId,
            sourceId: smokeCase.sourceId,
            word: smokeCase.word,
            expectation: smokeCase.expectation,
            passed: true,
          },
          null,
          2,
        ),
      );
    }

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

main().catch((error: unknown) => {
  console.error("\nERROR: open-instrument live smoke failed");
  console.error(error);
  process.exit(1);
});

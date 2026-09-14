#!/usr/bin/env tsx

import { webcrypto } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";
import { resolveCandidateEvidenceReferenceV0_1 } from "@/ui/candidates/EvidenceReferenceLink";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import {
  buildReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";
// The stable fingerprint utility is an existing executable seam. Keep its
// timestamp-removal policy in one place rather than reproducing it here.
import {
  stableRegressionFingerprintForAnalyzeV1Json,
} from "./openInstrumentAnalyzeV1StableRegressionFingerprint.v0.1.mjs";
import {
  aggregateAnalysisCapabilityBaselineV1,
  buildAnalysisCapabilityBaselineCaseV1,
  buildAnalysisCapabilityBaselineV1,
  parseAnalysisCapabilityBaselineManifestV1,
  parseAnalysisCapabilityBaselineV1,
  serializeAnalysisCapabilityBaselineV1,
  type AnalysisCapabilityBaselineCaseV1,
  type AnalysisCapabilityBaselineManifestV1,
  type AnalysisCapabilityBaselineV1,
  type BaselineEvidenceReferenceMeasurementV1,
} from "@/shared/openInstrument/analysisCapabilityBaseline.v1";

type UnknownRecord = Record<string, unknown>;

const DEFAULT_MANIFEST_PATH =
  "tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json";
const DEFAULT_OUTPUT_PATH =
  "tests/fixtures/openInstrument/analysis-capability-baseline.v1.json";

const PROVIDER_ENV_KEYS = [
  "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT",
  "OPEN_INSTRUMENT_AUTO_PROPOSER",
  "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER",
  "OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER",
] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function presentValue(value: unknown): unknown {
  return isRecord(value) && value.kind === "present" ? value.value : null;
}

function presentString(value: unknown): string | null {
  const unwrapped = presentValue(value);
  return typeof unwrapped === "string" && unwrapped.trim().length > 0
    ? unwrapped.trim()
    : null;
}

function presentStringArray(value: unknown): string[] {
  const unwrapped = presentValue(value);
  return Array.isArray(unwrapped)
    ? unwrapped.filter((item): item is string => typeof item === "string")
    : [];
}

function responseUrl(input: AnalysisCapabilityBaselineCaseV1): string {
  const params = new URLSearchParams({
    word: input.word,
    mode: input.mode,
    alphabet: input.alphabet,
  });

  if (input.ipa !== undefined) params.set("ipa", input.ipa);
  if (input.targetSenseId !== undefined) {
    params.set("targetSenseId", input.targetSenseId);
  }
  if (input.targetSenseLabel !== undefined) {
    params.set("targetSenseLabel", input.targetSenseLabel);
  }

  return `http://open-instrument.local/api/analyze-v1?${params.toString()}`;
}

function disableProviderExecution(): Record<string, string | undefined> {
  const previous: Record<string, string | undefined> = {};
  for (const key of PROVIDER_ENV_KEYS) {
    previous[key] = process.env[key];
  }

  process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT = "0";
  process.env.OPEN_INSTRUMENT_AUTO_PROPOSER = "0";
  delete process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER;
  delete process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER;
  return previous;
}

function restoreProviderEnvironment(previous: Record<string, string | undefined>): void {
  for (const key of PROVIDER_ENV_KEYS) {
    const value = previous[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function providerExecutionObserved(value: unknown, parentKey = ""): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => providerExecutionObserved(item, parentKey));
  }
  if (!isRecord(value)) return false;

  for (const [key, child] of Object.entries(value)) {
    if (
      (key === "providerOutput" ||
        key === "providerRequest" ||
        key === "providerResponse" ||
        key === "providerAttempted" ||
        key === "providerExecutionObserved" ||
        key === "realProvider") &&
      child === true
    ) {
      return true;
    }

    if (
      key === "attempted" &&
      child === true &&
      /provider|proposal|alignment/i.test(parentKey)
    ) {
      return true;
    }

    if (providerExecutionObserved(child, key)) return true;
  }

  return false;
}

async function requestAnalysis(
  input: AnalysisCapabilityBaselineCaseV1,
): Promise<unknown> {
  const response = await GET(new NextRequest(responseUrl(input)));
  const body: unknown = await response.json();
  if (response.status !== 200) {
    throw new Error(
      `${input.caseId}: Analyze V1 returned HTTP ${response.status}: ${JSON.stringify(body)}`,
    );
  }
  return body;
}

function evidenceMeasurements(
  viewModel: unknown,
): readonly (readonly BaselineEvidenceReferenceMeasurementV1[])[] {
  const rows = isRecord(viewModel) && Array.isArray(viewModel.candidates)
    ? viewModel.candidates
    : [];

  return rows.map((candidate) => {
    if (!isRecord(candidate)) return [];

    const refs = presentStringArray(candidate.evidenceRefs);
    const sourceId = presentString(candidate.sourceId);
    const sourceStatus = presentString(candidate.sourceStatus);

    return refs.map((ref) => {
      const resolution = resolveCandidateEvidenceReferenceV0_1(
        { sourceId, sourceStatus },
        ref,
      );

      return {
        ref,
        kind: resolution.kind,
        ...(resolution.sourceStatus
          ? { sourceStatus: resolution.sourceStatus }
          : {}),
        navigable: resolution.navigable,
        hasLocator: Boolean(resolution.locator),
        hasSafeUrl: Boolean(resolution.safeUrl),
      } satisfies BaselineEvidenceReferenceMeasurementV1;
    });
  });
}

async function buildCaseResult(
  input: AnalysisCapabilityBaselineCaseV1,
): Promise<ReturnType<typeof buildAnalysisCapabilityBaselineCaseV1>> {
  const firstRaw = await requestAnalysis(input);
  const secondRaw = await requestAnalysis(input);

  if (
    providerExecutionObserved(firstRaw) ||
    providerExecutionObserved(secondRaw)
  ) {
    throw new Error(`${input.caseId}: provider execution was observed`);
  }

  const firstViewModel = adaptAnalysisToTelemetryVM(firstRaw);
  const firstBundle = await buildReproducibleRunBundleV0_1({
    result: firstRaw,
    ...(input.ipa !== undefined ? { ipa: input.ipa } : {}),
    ...(input.targetSenseLabel !== undefined
      ? { targetSenseLabel: input.targetSenseLabel }
      : {}),
  });
  return buildAnalysisCapabilityBaselineCaseV1({
    input,
    publicResult: firstBundle.result,
    viewModel: firstViewModel,
    fingerprint: stableRegressionFingerprintForAnalyzeV1Json(firstRaw).sha256,
    repeatedFingerprint: stableRegressionFingerprintForAnalyzeV1Json(secondRaw).sha256,
    evidenceMeasurements: evidenceMeasurements(firstViewModel),
    providerExecutionObserved: false,
  });
}

export async function generateAnalysisCapabilityBaselineV1(
  manifest: AnalysisCapabilityBaselineManifestV1,
): Promise<AnalysisCapabilityBaselineV1> {
  const previousProviderEnvironment = disableProviderExecution();

  try {
    const cases = [];
    for (const input of manifest.cases) {
      cases.push(await buildCaseResult(input));
    }

    const baseline = buildAnalysisCapabilityBaselineV1({
      manifest,
      cases,
    });

    parseAnalysisCapabilityBaselineV1(
      serializeAnalysisCapabilityBaselineV1(baseline),
    );
    return baseline;
  } finally {
    restoreProviderEnvironment(previousProviderEnvironment);
  }
}

function readManifest(path: string): AnalysisCapabilityBaselineManifestV1 {
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
  return parseAnalysisCapabilityBaselineManifestV1(raw);
}

function printUsage(): void {
  console.log(
    [
      "Usage: tsx scripts/openInstrumentAnalysisCapabilityBaseline.v1.ts [options]",
      `  --manifest <path>  manifest path (default: ${DEFAULT_MANIFEST_PATH})`,
      `  --out <path>       artifact path (default: ${DEFAULT_OUTPUT_PATH})`,
      "  --check            generate in memory and compare with --out",
      "  --help             show this help",
    ].join("\n"),
  );
}

function parseArgs(args: readonly string[]): {
  manifestPath: string;
  outputPath: string;
  check: boolean;
} {
  let manifestPath = DEFAULT_MANIFEST_PATH;
  let outputPath = DEFAULT_OUTPUT_PATH;
  let check = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--check") {
      check = true;
      continue;
    }
    if (arg === "--manifest" || arg === "--out") {
      const value = args[index + 1];
      if (!value) throw new Error(`${arg} requires a path`);
      if (arg === "--manifest") manifestPath = value;
      else outputPath = value;
      index += 1;
      continue;
    }
    throw new Error(`unknown argument '${arg}'`);
  }

  return { manifestPath, outputPath, check };
}

async function main(): Promise<void> {
  if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: webcrypto,
    });
  }

  const options = parseArgs(process.argv.slice(2));
  const manifestPath = resolve(process.cwd(), options.manifestPath);
  const outputPath = resolve(process.cwd(), options.outputPath);
  const manifest = readManifest(manifestPath);
  const baseline = await generateAnalysisCapabilityBaselineV1(manifest);
  const serialized = serializeAnalysisCapabilityBaselineV1(baseline);

  if (options.check) {
    const existing = readFileSync(outputPath, "utf8");
    if (existing !== serialized) {
      throw new Error(
        `baseline artifact mismatch: ${options.outputPath} is not reproducible`,
      );
    }
  } else {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, serialized, "utf8");
  }

  console.log(
    JSON.stringify(
      {
        artifact: options.outputPath,
        schemaVersion: baseline.schemaVersion,
        corpusVersion: baseline.corpusVersion,
        caseCount: baseline.caseCount,
        valid: baseline.valid,
        aggregate: aggregateAnalysisCapabilityBaselineV1(baseline.cases),
      },
      null,
      2,
    ),
  );
}

if (process.argv[1]?.endsWith("openInstrumentAnalysisCapabilityBaseline.v1.ts")) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

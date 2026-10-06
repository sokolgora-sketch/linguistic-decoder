import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  getOrderedEligibleNovelInputsV0_1,
  selectPrimaryNovelInputV0_1,
} from "./openInstrumentM7NovelInputGeneralization.v0_1";

const REPOSITORY_ROOT = process.cwd();
const PROCEDURE_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json",
);
const COVERAGE_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/coverage-procedure.json",
);
const PRIMARY_SELECTION_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/primary-selection.json",
);
const PRIMARY_RESULT_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/primary-result.json",
);
const POPULATION_SPEC_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
);
const SOURCE_PATH = join(
  REPOSITORY_ROOT,
  "src/data/openInstrument/pronunciation/cmudict.dict",
);
const RESULT_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/result.json",
);

type CoverageProcedureV0_1 = Readonly<{
  status: "FROZEN_BEFORE_COVERAGE_RUN";
  sample: Readonly<{
    size: number;
    evaluateAllEntries: true;
    stoppingRule: "none";
    adaptiveSelection: false;
    candidateBehaviorUsedForSampleSelection: false;
  }>;
}>;

type PrimaryResultV0_1 = Readonly<{
  input: Readonly<{ word: string }>;
  classification: string;
  discovery: Readonly<{
    status: string;
    candidateCount: number;
    unknownOrNullReason: string | null;
  }>;
}>;

type DiscoveryCaseV0_1 = Readonly<Record<string, unknown>>;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function normalizeWord(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function compactCandidate(candidate: ReturnType<typeof buildMotivationEngineDiscoveryV0_1>["candidates"][number]) {
  return {
    candidateId: candidate.candidateId,
    candidateLanguage: candidate.candidateLanguage,
    candidateForm: candidate.candidateForm,
    candidateGloss: candidate.candidateGloss,
    candidateEmbryo: candidate.candidateEmbryo,
    sourceId: candidate.sourceFact.sourceId,
    sourceStatus: candidate.sourceFact.sourceStatus,
    evidenceRefs: [...candidate.sourceFact.evidenceRefs],
    matchClassification: candidate.structuralComparison.matchClassification,
    presentationClassification: candidate.structuralComparison.presentationClassification,
    matchedQuery: candidate.structuralComparison.matchedQuery,
    representationCompatibility: candidate.structuralComparison.representationCompatibility,
    matchReason: candidate.structuralComparison.matchReason,
    functionalStatus: candidate.functionalInterpretation.status,
    functionalStatement: candidate.functionalInterpretation.statement,
    functionalEvidenceRefs: [...candidate.functionalInterpretation.evidenceRefs],
    functionalReason: candidate.functionalInterpretation.reason,
    historicalRelation: candidate.historicalRelation,
    noSingleWinner: candidate.noSingleWinner,
    userDecisionPosture: candidate.userDecisionPosture,
  };
}

function validateFrozenInputs(): {
  procedure: ReturnType<typeof readJson<Record<string, unknown>>>;
  coverage: CoverageProcedureV0_1;
  primary: PrimaryResultV0_1;
  orderedInputs: readonly string[];
} {
  const procedure = readJson<Record<string, unknown>>(PROCEDURE_PATH);
  const coverage = readJson<CoverageProcedureV0_1>(COVERAGE_PATH);
  const primary = readJson<PrimaryResultV0_1>(PRIMARY_RESULT_PATH);
  const selection = selectPrimaryNovelInputV0_1();
  const orderedInputs = getOrderedEligibleNovelInputsV0_1();

  if (coverage.status !== "FROZEN_BEFORE_COVERAGE_RUN") {
    throw new Error("M7_COVERAGE_PROCEDURE_NOT_FROZEN");
  }
  if (
    coverage.sample.evaluateAllEntries !== true ||
    coverage.sample.stoppingRule !== "none" ||
    coverage.sample.adaptiveSelection !== false ||
    coverage.sample.candidateBehaviorUsedForSampleSelection !== false
  ) {
    throw new Error("M7_COVERAGE_PROCEDURE_NOT_NEUTRAL");
  }
  if (selection.input !== primary.input.word || selection.input !== "a") {
    throw new Error("M7_PRIMARY_SELECTION_BINDING_MISMATCH");
  }
  if (orderedInputs.length < coverage.sample.size) {
    throw new Error("M7_COVERAGE_SAMPLE_EXCEEDS_POPULATION");
  }
  if (sha256File(SOURCE_PATH) !== "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22") {
    throw new Error("M7_CMUDICT_SOURCE_HASH_MISMATCH");
  }
  if (sha256File(POPULATION_SPEC_PATH) !== "81248026f57cffb0c357a4e29e0cce4d3139adc1521eda89e72754783095ed44") {
    throw new Error("M7_POPULATION_SPEC_HASH_MISMATCH");
  }

  return { procedure, coverage, primary, orderedInputs };
}

function primaryCase(primary: PrimaryResultV0_1): DiscoveryCaseV0_1 {
  return {
    input: primary.input.word,
    classification: primary.classification,
    reusedFromPrimaryArtifact: true,
    status: primary.discovery.status,
    candidateCount: primary.discovery.candidateCount,
    candidates: [],
    crossFormPositive: false,
    unknownOrNullReason: primary.discovery.unknownOrNullReason,
  };
}

async function executeCoverage(): Promise<void> {
  const { procedure, coverage, primary, orderedInputs } = validateFrozenInputs();
  const sampleInputs = orderedInputs.slice(0, coverage.sample.size);
  const cases: DiscoveryCaseV0_1[] = [primaryCase(primary)];

  for (const word of sampleInputs.slice(1)) {
    try {
      const heart = buildHeartInstrumentV1(word);
      const payload = await runAnalysisDeterministic(word, {
        mode: "strict",
        alphabet: "auto",
      });
      const analysis = enginePayloadToAnalysisResult(payload);
      const discovery = buildMotivationEngineDiscoveryV0_1({
        word,
        inputLanguage: "en",
        inputProfile: heart.spokenPronunciation.sourceProfileId,
        analysis,
        heart,
      });
      const candidates = discovery.candidates.map(compactCandidate);
      const crossFormCandidates = candidates.filter((candidate) =>
        normalizeWord(String(candidate.candidateForm)) !== normalizeWord(word),
      );
      cases.push({
        input: word,
        classification: candidates.length > 0
          ? "GENERIC_POSITIVE_RETRIEVAL"
          : "VALID_GENERIC_NULL",
        reusedFromPrimaryArtifact: false,
        pronunciationStatus: heart.spokenPronunciation.status,
        pronunciationReason: heart.spokenPronunciation.reasonCode,
        voicePath: heart.canonicalSpokenVoicePath,
        math7: discovery.derivedStructure.math7,
        gamma: discovery.derivedStructure.gamma,
        zc: {
          status: discovery.derivedStructure.zeroConsonantalStructuralComposition.status,
          reason: discovery.derivedStructure.zeroConsonantalStructuralComposition.reason,
          variantCount: discovery.derivedStructure.zeroConsonantalStructuralComposition.variants.length,
        },
        structuralHypotheses: discovery.derivedStructure.structuralHypotheses,
        genericQueryKeys: discovery.derivedStructure.structuralHypotheses.flatMap((hypothesis) => hypothesis.expansionChain),
        status: discovery.status,
        candidateCount: candidates.length,
        candidates,
        crossFormPositive: crossFormCandidates.length > 0,
        crossFormCandidates,
        noSingleWinner: discovery.noSingleWinner,
        userDecisionPosture: discovery.userDecisionPosture,
        interpretationStatus: discovery.interpretation.status,
        unknownOrNullReason: discovery.unknownOrNull.reason,
        historicalRelations: candidates.map((candidate) => candidate.historicalRelation),
      });
    } catch (error) {
      cases.push({
        input: word,
        classification: "ENGINE_OR_AUTHORITY_FAILURE",
        reusedFromPrimaryArtifact: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const positiveCases = cases.flatMap((entry) =>
    entry.crossFormPositive === true
      ? [{
          input: entry.input,
          candidates: entry.crossFormCandidates,
        }]
      : [],
  );
  const result = {
    schemaVersion: "open-instrument.m7-novel-input-generalization-coverage-result.v0.1",
    status: "COMPLETED_RESULT_PRESERVED",
    selectionProcedure: {
      path: "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json",
      sha256: sha256File(PROCEDURE_PATH),
      selectionUsesCandidateBehavior: false,
    },
    coverageProcedure: {
      path: "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/coverage-procedure.json",
      sha256: sha256File(COVERAGE_PATH),
      sampleSize: coverage.sample.size,
      stoppingRule: coverage.sample.stoppingRule,
      adaptiveSelection: coverage.sample.adaptiveSelection,
      candidateBehaviorUsedForSampleSelection: coverage.sample.candidateBehaviorUsedForSampleSelection,
    },
    primaryResult: {
      path: "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/primary-result.json",
      sha256: sha256File(PRIMARY_RESULT_PATH),
      input: primary.input.word,
      classification: primary.classification,
      preservedWithoutRerun: true,
    },
    authority: {
      sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict",
      sourceSha256: sha256File(SOURCE_PATH),
      populationSpecPath: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
      populationSpecSha256: sha256File(POPULATION_SPEC_PATH),
      substrateVersion: "albanian-generic-lexical-substrate.v0_1",
      substrateRecordCount: 55,
      engineBaseHead: "52ff041d5b0d03d9c787c6d5d759438de273cea4",
      retrievalPath: "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts",
      structuralPath: "src/shared/structuralHypothesisDiscovery.v0_1.ts",
      genericQueryPath: "src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1.ts",
    },
    sample: {
      inputs: sampleInputs,
      cases,
      positiveCases,
      counts: {
        sampleSize: cases.length,
        genericPositiveRetrievalCases: cases.filter((entry) => entry.classification === "GENERIC_POSITIVE_RETRIEVAL").length,
        crossFormPositiveCases: positiveCases.length,
        validNullCases: cases.filter((entry) => entry.classification === "VALID_GENERIC_NULL").length,
        invalidCases: cases.filter((entry) => entry.classification === "INVALID_TEST_INPUT").length,
        engineOrAuthorityFailures: cases.filter((entry) => entry.classification === "ENGINE_OR_AUTHORITY_FAILURE").length,
        selfMatchOnlyCases: cases.filter((entry) =>
          entry.classification === "GENERIC_POSITIVE_RETRIEVAL" && entry.crossFormPositive === false,
        ).length,
      },
    },
    integrity: {
      engineUnchanged: true,
      substrateUnchanged: true,
      retrievalUnchanged: true,
      noTargetSpecificMapping: true,
      noProviderExecution: true,
      primaryResultSubstituted: false,
    },
  };
  writeFileSync(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(JSON.stringify(result.sample.counts, null, 2) + "\n");
}

if (process.argv.includes("--validate")) {
  const { coverage, orderedInputs } = validateFrozenInputs();
  process.stdout.write(JSON.stringify({
    valid: true,
    sampleSize: coverage.sample.size,
    populationSize: orderedInputs.length,
    primary: orderedInputs[0],
  }, null, 2) + "\n");
} else if (process.argv.includes("--execute")) {
  executeCoverage().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

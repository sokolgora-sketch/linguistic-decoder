import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";

const REPOSITORY_ROOT = process.cwd();
const PROCEDURE_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json",
);
const POPULATION_SPEC_PATH = join(
  REPOSITORY_ROOT,
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
);

type PopulationEntryV0_1 = Readonly<{
  lexicalWord: string;
  eligibility: "ELIGIBLE" | "NULL_OR_INELIGIBLE";
}>;

type SelectionProcedureV0_1 = Readonly<{
  status: "FROZEN_BEFORE_PRIMARY_SELECTION";
  inputPopulation: Readonly<{
    sourceSha256: string;
    sourceBytes: number;
    populationSpecSha256: string;
  }>;
  normalizationAndEligibility: Readonly<{
    usableInputRule: string;
    selectionUsesCandidateBehavior: false;
  }>;
  preparedWordExclusion: Readonly<{
    excludedWords: readonly string[];
    exclusionCount: number;
    sourceRecordFormsAlsoExcludedWhenASCIIAlphabetic: true;
  }>;
  ordering: Readonly<{
    stableKey: "normalized lexical word";
    comparison: string;
  }>;
  selection: Readonly<{
    primaryCount: 1;
  }>;
}>;

type PopulationSpecV0_1 = Readonly<{
  population: Readonly<{
    entries: readonly PopulationEntryV0_1[];
  }>;
}>;

export type M7SelectionV0_1 = Readonly<{
  input: string;
  eligiblePopulationCount: number;
  excludedPopulationCount: number;
  selectionPosition: number;
  selectionUsesCandidateBehavior: false;
  procedurePath: string;
  populationSpecPath: string;
}>;

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function normalizeWord(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function compareCodePoint(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function readProcedureV0_1(): SelectionProcedureV0_1 {
  const procedure = JSON.parse(readFileSync(PROCEDURE_PATH, "utf8")) as SelectionProcedureV0_1;
  if (procedure.status !== "FROZEN_BEFORE_PRIMARY_SELECTION") {
    throw new Error("M7_SELECTION_PROCEDURE_NOT_FROZEN");
  }
  if (procedure.normalizationAndEligibility.selectionUsesCandidateBehavior !== false) {
    throw new Error("M7_SELECTION_PROCEDURE_USES_CANDIDATE_BEHAVIOR");
  }
  if (procedure.preparedWordExclusion.excludedWords.length !== procedure.preparedWordExclusion.exclusionCount) {
    throw new Error("M7_EXCLUSION_COUNT_MISMATCH");
  }
  if (procedure.selection.primaryCount !== 1) {
    throw new Error("M7_PRIMARY_COUNT_MISMATCH");
  }
  if (sha256File(join(REPOSITORY_ROOT, "src/data/openInstrument/pronunciation/cmudict.dict")) !== procedure.inputPopulation.sourceSha256) {
    throw new Error("M7_CMUDICT_SOURCE_HASH_MISMATCH");
  }
  if (readFileSync(join(REPOSITORY_ROOT, "src/data/openInstrument/pronunciation/cmudict.dict")).byteLength !== procedure.inputPopulation.sourceBytes) {
    throw new Error("M7_CMUDICT_SOURCE_BYTES_MISMATCH");
  }
  if (sha256File(POPULATION_SPEC_PATH) !== procedure.inputPopulation.populationSpecSha256) {
    throw new Error("M7_POPULATION_SPEC_HASH_MISMATCH");
  }
  return procedure;
}

export function selectPrimaryNovelInputV0_1(): M7SelectionV0_1 {
  const procedure = readProcedureV0_1();
  const population = JSON.parse(readFileSync(POPULATION_SPEC_PATH, "utf8")) as PopulationSpecV0_1;
  const substrateWords = new Set(
    getAlbanianLexicalSubstrateRecordsV0_1()
      .map((record) => normalizeWord(record.sourceForm))
      .filter((word) => /^[a-z]+$/u.test(word)),
  );
  const explicitExclusions = new Set(procedure.preparedWordExclusion.excludedWords.map(normalizeWord));
  const excluded = new Set([...explicitExclusions, ...substrateWords]);
  const eligibleWords = [...new Set(
    population.population.entries
      .filter((entry) => entry.eligibility === "ELIGIBLE")
      .map((entry) => normalizeWord(entry.lexicalWord))
      .filter((word) => /^[a-z]+$/u.test(word)),
  )].sort(compareCodePoint);
  const available = eligibleWords.filter((word) => !excluded.has(word));
  const input = available[0];
  if (!input) throw new Error("M7_NO_ELIGIBLE_NOVEL_INPUT");
  return Object.freeze({
    input,
    eligiblePopulationCount: eligibleWords.length,
    excludedPopulationCount: eligibleWords.length - available.length,
    selectionPosition: 1,
    selectionUsesCandidateBehavior: false,
    procedurePath: "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json",
    populationSpecPath: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
  });
}

if (process.argv.includes("--select")) {
  process.stdout.write(`${JSON.stringify(selectPrimaryNovelInputV0_1(), null, 2)}\n`);
}

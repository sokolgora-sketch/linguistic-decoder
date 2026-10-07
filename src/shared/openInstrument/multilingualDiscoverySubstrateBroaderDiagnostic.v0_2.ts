import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "./albanianLexicalSubstrate.v0_1";

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.broader-stratified-diagnostic-procedure.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_SCHEMA_VERSION_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-broader-stratified-diagnostic-procedure.v0.1" as const;

export const BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2 = 1024 as const;

export const BROADER_DIAGNOSTIC_POPULATION_SPEC_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json" as const;

export const BROADER_DIAGNOSTIC_PREPARATION_PROCEDURE_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json" as const;

export const BROADER_DIAGNOSTIC_EXPECTED_PREPARED_POPULATION_COUNT_V0_2 =
  117389 as const;

export const BROADER_DIAGNOSTIC_SELECTION_ID_V0_2 =
  "ORDINAL_STRATIFIED_PREPARED_POPULATION_LOWER_ENDPOINT_N1024" as const;

type PopulationEntryV0_2 = Readonly<{
  lexicalWord: string;
  eligibility: "ELIGIBLE" | "NULL_OR_INELIGIBLE";
}>;

type PopulationSpecV0_2 = Readonly<{
  population: Readonly<{
    entries: readonly PopulationEntryV0_2[];
  }>;
}>;

type PreparationProcedureV0_2 = Readonly<{
  preparedWordExclusion: Readonly<{
    excludedWords: readonly string[];
  }>;
}>;

export type BroaderDiagnosticPreparedPopulationV0_2 = Readonly<{
  raw: readonly string[];
  prepared: readonly string[];
  rawPositionByWord: ReadonlyMap<string, number>;
}>;

function readJsonV0_2<T>(rootDir: string, relativePath: string): T {
  return JSON.parse(
    readFileSync(join(rootDir, relativePath), "utf8"),
  ) as T;
}

function normalizeWordV0_2(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function compareTextV0_2(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Reconstructs only the pre-frozen prepared input population.
 *
 * This helper intentionally does not import the query generator, pronunciation
 * engine, candidate adapters, or any result artifact. It uses only the frozen
 * lexical exclusion forms needed to reconstruct the prepared population, so it
 * is safe to use while freezing the selection procedure.
 */
export function reconstructBroaderDiagnosticPreparedPopulationV0_2(
  rootDir = process.cwd(),
): BroaderDiagnosticPreparedPopulationV0_2 {
  const population = readJsonV0_2<PopulationSpecV0_2>(
    rootDir,
    BROADER_DIAGNOSTIC_POPULATION_SPEC_PATH_V0_2,
  );
  const preparation = readJsonV0_2<PreparationProcedureV0_2>(
    rootDir,
    BROADER_DIAGNOSTIC_PREPARATION_PROCEDURE_PATH_V0_2,
  );
  const explicitExclusions = new Set(
    preparation.preparedWordExclusion.excludedWords.map(normalizeWordV0_2),
  );
  const substrateFormExclusions = new Set(
    getAlbanianLexicalSubstrateRecordsV0_1()
      .map((record) => normalizeWordV0_2(record.sourceForm))
      .filter((word) => /^[a-z]+$/u.test(word)),
  );
  const raw = [
    ...new Set(
      population.population.entries
        .filter((entry) => entry.eligibility === "ELIGIBLE")
        .map((entry) => normalizeWordV0_2(entry.lexicalWord))
        .filter((word) => /^[a-z]+$/u.test(word)),
    ),
  ].sort(compareTextV0_2);
  const excluded = new Set([
    ...explicitExclusions,
    ...substrateFormExclusions,
  ]);
  const prepared = raw.filter((word) => !excluded.has(word));
  return {
    raw,
    prepared,
    rawPositionByWord: new Map(
      raw.map((word, index) => [word, index + 1]),
    ),
  };
}

/**
 * Selects one lower endpoint from each equal ordinal stratum. The selected
 * positions are 1-indexed and are derived only from the prepared population
 * length and the frozen sample size.
 */
export function selectBroaderDiagnosticPreparedPositionsV0_2(
  preparedPopulationCount: number,
  sampleSize = BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2,
): readonly number[] {
  if (!Number.isInteger(preparedPopulationCount) || preparedPopulationCount < 1) {
    throw new Error("BROADER_DIAGNOSTIC_INVALID_POPULATION_COUNT");
  }
  if (!Number.isInteger(sampleSize) || sampleSize < 1 || sampleSize > preparedPopulationCount) {
    throw new Error("BROADER_DIAGNOSTIC_INVALID_SAMPLE_SIZE");
  }
  return Object.freeze(
    Array.from({ length: sampleSize }, (_, index) =>
      Math.floor((index * preparedPopulationCount) / sampleSize) + 1,
    ),
  );
}

export function selectBroaderDiagnosticPreparedInputsV0_2(
  preparedPopulation: readonly string[],
  sampleSize = BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2,
): readonly string[] {
  const positions = selectBroaderDiagnosticPreparedPositionsV0_2(
    preparedPopulation.length,
    sampleSize,
  );
  return Object.freeze(
    positions.map((position) => preparedPopulation[position - 1]!),
  );
}

export function sha256BroaderDiagnosticSelectionV0_2(
  selectedInputs: readonly string[],
): string {
  return createHash("sha256")
    .update(JSON.stringify(selectedInputs), "utf8")
    .digest("hex");
}

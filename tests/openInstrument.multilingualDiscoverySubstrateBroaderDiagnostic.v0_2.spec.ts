import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BROADER_DIAGNOSTIC_EXPECTED_PREPARED_POPULATION_COUNT_V0_2,
  BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2,
  MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2,
  reconstructBroaderDiagnosticPreparedPopulationV0_2,
  selectBroaderDiagnosticPreparedInputsV0_2,
  selectBroaderDiagnosticPreparedPositionsV0_2,
  sha256BroaderDiagnosticSelectionV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateBroaderDiagnostic.v0_2";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2";

const ROOT = process.cwd();
const PROCEDURE_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-procedure-v0.1/procedure.json",
);
const MANIFEST_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-procedure-v0.1/hash-manifest.json",
);
const S3_DIRECTORY = join(
  ROOT,
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1",
);
const S3_HASHES = {
  sample: "8ba957d57f5f2509f2acc2b875a5427e075942d2a9c52d63b9208590045cc2cd",
  paired: "b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03",
  summary: "1985db5f7d8d7fd59c6ca741f30d1814ffa469f95c141ff7e9aef109da11ebea",
  manifest: "7fa23b2eb80cc2b78ecd880295d71f5a542e561918747cdf7082bf76f2055497",
} as const;

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

type ProcedureFixtureV0_2 = Readonly<{
  procedureId: string;
  status: string;
  executionFirewall: Readonly<{
    authoritativeAttempts: number;
    resultArtifactCreated: boolean;
    s3EvaluationExecuted: boolean;
  }>;
  postS3DecisionAuthority: Readonly<{
    s3AuthoritativeAttempts: number;
    s3Outcome: string;
  }>;
  substrateAuthority: Readonly<{
    total: number;
    languageCounts: Readonly<Record<string, number>>;
    fingerprint: string;
    asciiLatinKeys: readonly string[];
    diacriticLatinKeys: readonly string[];
    candidateVoicePathPolicy: string;
  }>;
}>;

function readProcedure(): ProcedureFixtureV0_2 {
  return JSON.parse(readFileSync(PROCEDURE_PATH, "utf8")) as ProcedureFixtureV0_2;
}

describe("multilingual Discovery substrate broader diagnostic definition", () => {
  it("freezes the procedure as definition-only and binds preserved S3 authority", () => {
    const procedure = readProcedure();
    expect(procedure.procedureId).toBe(MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2);
    expect(procedure.status).toBe("DEFINED_NOT_EXECUTED");
    expect(procedure.executionFirewall.authoritativeAttempts).toBe(0);
    expect(procedure.executionFirewall.resultArtifactCreated).toBe(false);
    expect(procedure.executionFirewall.s3EvaluationExecuted).toBe(false);
    const s3ArtifactNames = {
      sample: "sample.json",
      paired: "paired-results.json",
      summary: "summary.json",
      manifest: "hash-manifest.json",
    } as const;
    for (const [name, hash] of Object.entries(S3_HASHES)) {
      expect(sha256File(join(S3_DIRECTORY, s3ArtifactNames[name as keyof typeof s3ArtifactNames]))).toBe(hash);
    }
    expect(procedure.postS3DecisionAuthority.s3AuthoritativeAttempts).toBe(1);
    expect(procedure.postS3DecisionAuthority.s3Outcome).toBe("NO_MEASURABLE_EXISTING_ONLY_IMPROVEMENT");
  });

  it("reconstructs the prepared population without query or candidate inspection", () => {
    const population = reconstructBroaderDiagnosticPreparedPopulationV0_2();
    expect(population.raw.length).toBe(117473);
    expect(population.prepared.length).toBe(BROADER_DIAGNOSTIC_EXPECTED_PREPARED_POPULATION_COUNT_V0_2);
    expect(population.prepared).toEqual([...population.prepared].sort());
    expect(new Set(population.prepared).size).toBe(population.prepared.length);
  });

  it("selects exactly one deterministic lower endpoint per ordinal stratum", () => {
    const population = reconstructBroaderDiagnosticPreparedPopulationV0_2();
    const positions = selectBroaderDiagnosticPreparedPositionsV0_2(population.prepared.length);
    const inputs = selectBroaderDiagnosticPreparedInputsV0_2(population.prepared);
    expect(positions).toHaveLength(BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2);
    expect(inputs).toHaveLength(BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2);
    expect(new Set(positions).size).toBe(positions.length);
    expect(positions[0]).toBe(1);
    expect(positions.at(-1)).toBe(Math.floor((1023 * population.prepared.length) / 1024) + 1);
    expect(inputs[0]).toBe(population.prepared[0]);
    expect(inputs.at(-1)).toBe(population.prepared[positions.at(-1)! - 1]);
    expect(sha256BroaderDiagnosticSelectionV0_2(inputs)).toHaveLength(64);
  });

  it("freezes the post-S1 substrate boundary and Latin expressivity split", () => {
    const procedure = readProcedure();
    const latin = getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2();
    const albanian = getAlbanianLexicalSubstrateRecordsV0_1();
    expect(albanian).toHaveLength(55);
    expect(latin).toHaveLength(21);
    expect(procedure.substrateAuthority.total).toBe(76);
    expect(procedure.substrateAuthority.languageCounts).toEqual({ Albanian: 55, Latin: 21, Other: 0 });
    expect(procedure.substrateAuthority.fingerprint).toBe("1c4714a1d9a7550c1c037b4ce62ca85e9ff24966f2e8d447c038bce001b45d81");
    expect(procedure.substrateAuthority.asciiLatinKeys).toHaveLength(13);
    expect(procedure.substrateAuthority.diacriticLatinKeys).toHaveLength(8);
    expect(procedure.substrateAuthority.candidateVoicePathPolicy).toBe("NULL_UNAUTHORIZED");
  });

  it("reproduces the procedure and implementation hash bindings", () => {
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as {
      artifacts: readonly { path: string; bytes: number; sha256: string }[];
      implementation: readonly { path: string; sha256: string }[];
    };
    const procedureArtifact = manifest.artifacts.find((entry) => entry.path.endsWith("/procedure.json"));
    expect(procedureArtifact).toBeDefined();
    expect(procedureArtifact?.bytes).toBe(readFileSync(PROCEDURE_PATH).byteLength);
    expect(procedureArtifact?.sha256).toBe(sha256File(PROCEDURE_PATH));
    for (const entry of manifest.implementation) {
      expect(sha256File(join(ROOT, entry.path))).toBe(entry.sha256);
    }
    expect(sha256File(join(ROOT, "src/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2.ts")))
      .toBe("98dcb948a47c62f5763565113fc2dc9a9acb81ab94c15e54b4d0b7aaa0ee96df");
    expect(sha256File(join(ROOT, "src/shared/structuralHypothesisDiscovery.v0_1.ts")))
      .toBe("96fba8363df8b3d59caf6d7dc9ac9ad88007d15432bec4b647b83484a25555db");
    expect(sha256File(join(ROOT, "src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1.ts")))
      .toBe("f49ff4f0b877887b466002ce465feb58adbb07204cc6560c3caaa0364d95a0a0");
  });

  it("does not create or bind a diagnostic result artifact", () => {
    expect(existsSync(join(
      ROOT,
      "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/result.json",
    ))).toBe(false);
  });
});

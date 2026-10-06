import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  classifyReachabilityForWordV0_1,
} from "@/scripts/openInstrumentM7SubstrateReachableGeneralization.v0_1";

const ROOT = process.cwd();
const ORIGINAL_DIRECTORY = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1",
);
const SUCCESSOR_DIRECTORY = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1",
);

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("M7 substrate-reachable generalization correction v0.1", () => {
  it("preserves the original M7 artifacts immutably", () => {
    expect(sha256(join(ORIGINAL_DIRECTORY, "selection-procedure.json"))).toBe(
      "de0363366f854230b178011c36a52818add15664f57a7241105bdbc6fb9b8eb7",
    );
    expect(sha256(join(ORIGINAL_DIRECTORY, "primary-selection.json"))).toBe(
      "c402b51ab936e29967dc5f53b2b43da541e1399513a5eb70890677ea52b53d23",
    );
    expect(sha256(join(ORIGINAL_DIRECTORY, "primary-result.json"))).toBe(
      "cacbb9dbc9b12a785063b4506f5ad05a52a0e402b7cb99a35e51ea5819f8b841",
    );
    expect(sha256(join(ORIGINAL_DIRECTORY, "result.json"))).toBe(
      "ea109f02539b80baf03b5d7491385aac3a4067045513e630911d4f2f0c7e98d6",
    );
  });

  it("keeps ambiguous pronunciation upstream of substrate reachability", () => {
    const first = classifyReachabilityForWordV0_1("a");
    const second = classifyReachabilityForWordV0_1("a");
    expect(first).toEqual(second);
    expect(first.classification).toBe("UPSTREAM_PRONUNCIATION_NULL");
    expect(first.pronunciationReason).toBe("PRONUNCIATION_VARIANT_AMBIGUOUS");
    expect(first.genericQueryKeys).toEqual([]);
  });

  it("classifies the frozen successor primary through query generation only", () => {
    const first = classifyReachabilityForWordV0_1("aiello");
    const second = classifyReachabilityForWordV0_1("aiello");
    expect(first).toEqual(second);
    expect(first.classification).toBe("SUBSTRATE_REACHABLE");
    expect(first.genericQueryKeys).toEqual(["AIE", "AIELLO"]);
    expect(first.voicePath).toEqual(["A", "I", "E", "O", "U"]);
  });

  it("freezes a reachable sample whose entries all have query keys", () => {
    const path = join(SUCCESSOR_DIRECTORY, "reachable-sample.json");
    if (!existsSync(path)) return;
    const sample = JSON.parse(readFileSync(path, "utf8")) as {
      status: string;
      substrateEvaluationNotStarted: boolean;
      entries: Array<{ genericQueryKeys: string[]; classification?: string }>;
    };
    expect(sample.status).toBe("FROZEN_BEFORE_SUBSTRATE_EVALUATION");
    expect(sample.substrateEvaluationNotStarted).toBe(true);
    expect(sample.entries).toHaveLength(512);
    expect(sample.entries.every((entry) => entry.genericQueryKeys.length > 0)).toBe(true);
    expect(sample.entries.every((entry) => entry.classification === undefined)).toBe(true);
  });

  it("does not contain a selected-input-to-candidate special case", () => {
    const source = readFileSync(
      join(ROOT, "scripts/openInstrumentM7SubstrateReachableGeneralization.v0_1.ts"),
      "utf8",
    );
    expect(source).not.toContain('"aiello"');
    expect(source).not.toMatch(/word\s*===\s*["'`]/);
    expect(classifyReachabilityForWordV0_1.toString()).not.toContain("queryGenericFunctionalWitnessesV1");
  });

  it("preserves the single successor substrate evaluation and its positive cases", () => {
    const resultPath = join(SUCCESSOR_DIRECTORY, "result.json");
    const manifestPath = join(SUCCESSOR_DIRECTORY, "hash-manifest.json");
    expect(existsSync(resultPath)).toBe(true);
    expect(existsSync(manifestPath)).toBe(true);
    const result = JSON.parse(readFileSync(resultPath, "utf8")) as {
      status: string;
      primary: { input: string; resultClass: string };
      sample: {
        counts: {
          sampleSize: number;
          crossFormPositiveCases: number;
          selfMatchOnlyCases: number;
          substrateNoMatchCases: number;
          invalidCases: number;
          engineOrAuthorityFailures: number;
        };
        positiveCases: Array<{ input: string; genericQueryKeys: string[]; candidates: Array<{ candidateId: string }> }>;
      };
      execution: {
        phaseAExecutionAttempts: number;
        phaseBExecutionAttempts: number;
        noRerun: boolean;
        substrateResponseUsedForEligibility: boolean;
        realDataExecuted: boolean;
      };
    };
    expect(result.status).toBe("COMPLETED_RESULT_PRESERVED");
    expect(result.primary).toMatchObject({ input: "aiello", resultClass: "SUBSTRATE_NO_MATCH" });
    expect(result.sample.counts).toEqual({
      sampleSize: 512,
      crossFormPositiveCases: 4,
      selfMatchOnlyCases: 0,
      substrateNoMatchCases: 508,
      invalidCases: 0,
      engineOrAuthorityFailures: 0,
    });
    expect(result.sample.positiveCases.map((entry) => entry.input)).toEqual([
      "ata",
      "ate",
      "ati",
      "atom",
    ]);
    expect(result.sample.positiveCases.map((entry) => entry.genericQueryKeys)).toEqual([
      ["AT"],
      ["AT"],
      ["AT"],
      ["AT"],
    ]);
    expect(result.sample.positiveCases.map((entry) => entry.candidates.map((candidate) => candidate.candidateId))).toEqual([
      ["motivation-discovery:ata:ata:AT:0:reviewed.external.albanian-at.father.candidate.v0_1"],
      ["motivation-discovery:ate:ate:AT:0:reviewed.external.albanian-at.father.candidate.v0_1"],
      ["motivation-discovery:ati:ati:AT:0:reviewed.external.albanian-at.father.candidate.v0_1"],
      ["motivation-discovery:atom:atom:AT+M:0:reviewed.external.albanian-at.father.candidate.v0_1"],
    ]);
    expect(result.execution).toMatchObject({
      phaseAExecutionAttempts: 1,
      phaseBExecutionAttempts: 1,
      noRerun: true,
      substrateResponseUsedForEligibility: false,
      realDataExecuted: false,
    });
    expect(sha256(resultPath)).toBe(
      "411178ed01f6d0c5d4a4b6af4821bb3d5e9ebe6c299cdcc7b24101823727b5d3",
    );
  });

  it("binds repaired result query keys to the frozen Phase A sample", () => {
    const sample = JSON.parse(
      readFileSync(join(SUCCESSOR_DIRECTORY, "reachable-sample.json"), "utf8"),
    ) as { entries: Array<{ input: string; genericQueryKeys: string[] }> };
    const result = JSON.parse(
      readFileSync(join(SUCCESSOR_DIRECTORY, "result.json"), "utf8"),
    ) as {
      sample: {
        cases: Array<{ input: string; classification?: string; genericQueryKeys: string[] }>;
        counts: { sampleSize: number; crossFormPositiveCases: number; selfMatchOnlyCases: number; substrateNoMatchCases: number };
      };
      primary: { input: string; resultClass: string };
      serializationRepair: {
        repairClass: string;
        preRepairResultSha256: string;
        preRepairManifestSha256: string;
        scientificResultChanged: boolean;
        scientificReexecution: boolean;
      };
    };
    const attempt = JSON.parse(
      readFileSync(join(SUCCESSOR_DIRECTORY, "phase-b-attempt.json"), "utf8"),
    ) as {
      status: string;
      attempt: number;
      noRerun: boolean;
      scientificResultChanged: boolean;
      scientificReexecution: boolean;
      realDataExecuted: boolean;
    };
    const phaseAKeys = new Map(sample.entries.map((entry) => [entry.input, entry.genericQueryKeys]));
    const positiveCases = result.sample.cases.filter((entry) => entry.classification === "GENERIC_CROSS_FORM_POSITIVE");

    expect(result.sample.cases.map((entry) => entry.input)).toEqual(sample.entries.map((entry) => entry.input));
    expect(positiveCases).toHaveLength(4);
    for (const entry of positiveCases) {
      expect(entry.genericQueryKeys).toEqual(phaseAKeys.get(entry.input));
    }
    expect(result.sample.counts).toMatchObject({
      sampleSize: 512,
      crossFormPositiveCases: 4,
      selfMatchOnlyCases: 0,
      substrateNoMatchCases: 508,
    });
    expect(result.primary).toMatchObject({
      input: "aiello",
      resultClass: "SUBSTRATE_NO_MATCH",
    });
    expect(result.serializationRepair).toEqual(expect.objectContaining({
      repairClass: "SERIALIZATION_ONLY",
      preRepairResultSha256: "013c361f8148d6c057cc62191977332513faafcf0a2d20c66b2a6e4dcdd90e05",
      preRepairManifestSha256: "cf9b4cd3a2b0f5250a33feec2a5fd7541b18f453077a27b8f193148c6555237b",
      scientificResultChanged: false,
      scientificReexecution: false,
    }));
    expect(attempt).toMatchObject({
      status: "COMPLETED_POST_EXECUTION_METADATA_REPAIR",
      attempt: 1,
      noRerun: true,
      scientificResultChanged: false,
      scientificReexecution: false,
      realDataExecuted: false,
    });

    const source = readFileSync(
      join(ROOT, "scripts/openInstrumentM7SubstrateReachableGeneralization.v0_1.ts"),
      "utf8",
    );
    expect(source).toContain("genericQueryKeys: [...entry.genericQueryKeys]");
    expect(source).not.toContain(
      "genericQueryKeys: discovery.derivedStructure.structuralHypotheses.flatMap((hypothesis) => hypothesis.expansionChain)",
    );
  });
});

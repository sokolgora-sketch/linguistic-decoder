import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import {
  getLatinLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/latinLexicalSubstrate.v0_1";
import {
  getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2";

const ROOT = process.cwd();
const PROCEDURE_PATH = path.join(
  ROOT,
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/procedure.json",
);
const MANIFEST_PATH = path.join(
  ROOT,
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/hash-manifest.json",
);

type FrozenRecord = {
  sourceRecordId: string;
  sourceForm: string;
  currentLookupForm: string;
  proposedRetrievalKey: string;
  sourceTradition: string;
  citationIds: string[];
  attestation: string;
  sourceStatus: string;
  transformationApplied: string;
  transformationReason: string;
  collisionStatus: string;
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function sha256(filePath: string): string {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function proposedKey(sourceForm: string): string {
  return sourceForm
    .normalize("NFC")
    .toLocaleUpperCase("en-US")
    .replace(/[ĀĂ]/g, "A")
    .replace(/[ĒĔ]/g, "E")
    .replace(/[ĪĬ]/g, "I")
    .replace(/[ŌŎ]/g, "O")
    .replace(/[ŪŬ]/g, "U");
}

function actualLatinRecords() {
  return [
    ...getLatinLexicalSubstrateRecordsV0_1(),
    ...getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2(),
  ];
}

describe("retrieval-key authority and reachability definition v0.1", () => {
  const procedure = readJson<{
    status: string;
    procedureId: string;
    authorityDecision: {
      currentDecision: string;
      gate: {
        currentEvidence: {
          explicitSourceTraditionAuthorization: boolean;
          explicitSourceTraditionProhibition: boolean;
          operatorCoverage: string;
          sourceTruthInvariants: string;
          collisionPolicyFrozen: string;
          currentDecision: string;
        };
        postFreezeEvidenceMayChangeDecision: boolean;
        decisionMustBeReboundByNewProcedureVersion: boolean;
      };
    };
    operator: {
      operatorId: string;
      status: string;
      sourceFormMutated: boolean;
      citationMutated: boolean;
      glossMutated: boolean;
      attestationMutated: boolean;
      pronunciationAuthorityGranted: boolean;
      historicalEquivalenceGranted: boolean;
      functionalEquivalenceGranted: boolean;
      semanticEquivalenceGranted: boolean;
    };
    currentRepresentationContract: {
      matching: string;
      matchingAlternativesAuthorized: boolean;
    };
    collisionPolicy: {
      newCollisionAcceptance: string;
      unacceptableCollisionPredicate: string;
      classCRequires: string[];
      classDRequires: string[];
    };
    latinTestSet: {
      recordCount: number;
      currentAsciiCount: number;
      currentDiacriticCount: number;
      records: FrozenRecord[];
    };
    arms: Record<string, { queryGeneratorSame: boolean; populationSame: boolean }>;
    metrics: string[];
    decisionClasses: Record<string, string>;
    populationAuthority: {
      rawEligiblePopulationCount: number;
      preparedPopulationCount: number;
      explicitExclusionWords: string[];
      inheritedSubstrateExclusionWords: string[];
      combinedExclusionWords: string[];
      exclusionSetFingerprint: string;
      preparedPopulationFingerprint: string;
      inputPopulationFingerprint: string;
    };
    antiCircularity: { authoritativeAttemptsMax: number; noSingleWinner: boolean; userDecides: boolean };
    executionFirewall: {
      authoritativeAttempts: number;
      resultArtifactCreated: boolean;
      s3Rerun: boolean;
      broaderDiagnosticRerun: boolean;
      s4Started: boolean;
    };
  }>(PROCEDURE_PATH);

  test("freezes a definition without a result or runtime authorization", () => {
    expect(procedure.status).toBe("DEFINED_NOT_EXECUTED");
    expect(procedure.procedureId).toBe(
      "open-instrument.multilingual-discovery-substrate-v0.2.retrieval-key-authority-and-reachability.v0.1",
    );
    expect(procedure.operator.operatorId).toBe(
      "open-instrument.retrieval-key-canonicalization.latin-scholarly-quantity.v0.1",
    );
    expect(procedure.operator.status).toBe("PROPOSED_NOT_AUTHORIZED_FOR_RUNTIME");
    expect(procedure.authorityDecision.currentDecision).toBe("INSUFFICIENT_EVIDENCE");
    expect(procedure.authorityDecision.gate.currentEvidence).toEqual({
      explicitSourceTraditionAuthorization: false,
      explicitSourceTraditionProhibition: false,
      operatorCoverage: "PASS",
      sourceTruthInvariants: "PASS",
      collisionPolicyFrozen: "PASS",
      currentDecision: "INSUFFICIENT_EVIDENCE",
    });
    expect(procedure.authorityDecision.gate.postFreezeEvidenceMayChangeDecision).toBe(false);
    expect(procedure.authorityDecision.gate.decisionMustBeReboundByNewProcedureVersion).toBe(true);
    expect(procedure.currentRepresentationContract.matchingAlternativesAuthorized).toBe(false);
    expect(procedure.collisionPolicy.newCollisionAcceptance).toBe("ZERO_NEW_COLLISIONS");
    expect(procedure.collisionPolicy.unacceptableCollisionPredicate).toContain("Any Arm B retrieval-key collision");
    expect(procedure.collisionPolicy.classCRequires).toEqual(expect.arrayContaining([
      "newCollisionCount = 0",
      "all truthGate fields pass",
    ]));
    expect(procedure.collisionPolicy.classDRequires).toEqual(expect.arrayContaining([
      "newCollisionCount > 0 or any truthGate field fails",
    ]));
    expect(procedure.executionFirewall.authoritativeAttempts).toBe(0);
    expect(procedure.executionFirewall.resultArtifactCreated).toBe(false);
    expect(procedure.executionFirewall.s3Rerun).toBe(false);
    expect(procedure.executionFirewall.broaderDiagnosticRerun).toBe(false);
    expect(procedure.executionFirewall.s4Started).toBe(false);
    expect(fs.existsSync(path.join(path.dirname(PROCEDURE_PATH), "result.json"))).toBe(false);
  });

  test("preserves exact source authority and freezes the 21-record Latin set", () => {
    const actual = actualLatinRecords();
    const frozenById = new Map(
      procedure.latinTestSet.records.map((record) => [record.sourceRecordId, record]),
    );

    expect(actual).toHaveLength(21);
    expect(procedure.latinTestSet.recordCount).toBe(21);
    expect(procedure.latinTestSet.records).toHaveLength(21);
    expect(new Set(frozenById.keys()).size).toBe(21);

    for (const record of actual) {
      const frozen = frozenById.get(record.sourceRecordId);
      expect(frozen).toBeDefined();
      expect(frozen?.sourceForm).toBe(record.sourceForm);
      expect(frozen?.currentLookupForm).toBe(record.lookupForm);
      expect(frozen?.proposedRetrievalKey).toBe(proposedKey(record.sourceForm));
      expect(frozen?.sourceTradition).toBe(record.sourceTraditionId);
      expect(frozen?.citationIds).toEqual([record.citation.citationId]);
      expect(frozen?.attestation).toBe(record.attestationTruth);
      expect(frozen?.sourceStatus).toBe(record.sourceStatus);
      expect(record.sourceForm).toBe(record.sourceForm);
      expect(record.gloss).toBeTruthy();
    }

    const ascii = procedure.latinTestSet.records.filter((record) => /^[A-Z]+$/.test(record.currentLookupForm));
    const diacritic = procedure.latinTestSet.records.filter((record) => !/^[A-Z]+$/.test(record.currentLookupForm));
    expect(ascii).toHaveLength(13);
    expect(diacritic).toHaveLength(8);
    expect(procedure.latinTestSet.currentAsciiCount).toBe(13);
    expect(procedure.latinTestSet.currentDiacriticCount).toBe(8);
  });

  test("freezes a paired exact-key experiment with unchanged population and query generation", () => {
    expect(procedure.arms.ARM_A.queryGeneratorSame).toBe(true);
    expect(procedure.arms.ARM_A.populationSame).toBe(true);
    expect(procedure.arms.ARM_B.queryGeneratorSame).toBe(true);
    expect(procedure.arms.ARM_B.populationSame).toBe(true);
    expect(procedure.currentRepresentationContract.matching).toContain("record.lookupForm === input.embryo");
    expect(procedure.metrics).toEqual(expect.arrayContaining([
      "preparedPopulationCount",
      "distinctGeneratedQueryKeys",
      "currentLatinKeysReached",
      "canonicalLatinKeysReached",
      "retrievalKeyCollisionCount",
      "absoluteReachabilityDelta",
      "validNullCount",
    ]));
    expect(procedure.decisionClasses).toEqual(expect.objectContaining({
      CLASS_A: "NO_LATIN_REACHABILITY_UNDER_EITHER_REPRESENTATION",
      CLASS_C: "CANONICAL_RETRIEVAL_REPRESENTATION_INCREASES_LATIN_KEY_REACHABILITY_WITHOUT_UNACCEPTABLE_COLLISIONS",
      CLASS_E: "OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE",
    }));
    expect(procedure.antiCircularity.authoritativeAttemptsMax).toBe(1);
    expect(procedure.antiCircularity.noSingleWinner).toBe(true);
    expect(procedure.antiCircularity.userDecides).toBe(true);
  });

  test("materializes the exact prepared-population exclusion and fingerprint authority", () => {
    const population = procedure.populationAuthority;
    expect(population.rawEligiblePopulationCount).toBe(117473);
    expect(population.preparedPopulationCount).toBe(117389);
    expect(population.explicitExclusionWords).toHaveLength(84);
    expect(population.inheritedSubstrateExclusionWords).toHaveLength(31);
    expect(population.combinedExclusionWords).toHaveLength(109);
    expect(population.explicitExclusionWords).toEqual([...population.explicitExclusionWords].sort());
    expect(population.inheritedSubstrateExclusionWords).toEqual([...population.inheritedSubstrateExclusionWords].sort());
    expect(population.combinedExclusionWords).toEqual([...population.combinedExclusionWords].sort());
    expect(new Set([
      ...population.explicitExclusionWords,
      ...population.inheritedSubstrateExclusionWords,
    ])).toEqual(new Set(population.combinedExclusionWords));
    expect(population.exclusionSetFingerprint).toBe(
      "c0d23a68f7ea0610e145cd7426a47a88bdf4158f7ead036272d69d3e4f2e9c2d",
    );
    expect(population.preparedPopulationFingerprint).toBe(
      "751987cbf7cd71d527ff0fc16f1e316fd6066a870eb11bc72aece51e9cf428a2",
    );
    expect(population.inputPopulationFingerprint).toBe(
      "931a9f4502e394d2f0e49ae45d4fc5ddc21d63cc960c115a741702baf4cf0aec",
    );
  });

  test("binds procedure and protected result identities without changing them", () => {
    const manifest = readJson<{
      artifacts: Array<{ path: string; bytes: number; sha256: string }>;
      execution: { authoritativeAttempts: number; resultArtifactCreated: boolean };
    }>(MANIFEST_PATH);
    const procedureBytes = fs.statSync(PROCEDURE_PATH).size;
    const procedureSha = sha256(PROCEDURE_PATH);
    expect(manifest.artifacts).toContainEqual({
      path: "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/procedure.json",
      bytes: procedureBytes,
      sha256: procedureSha,
    });
    expect(manifest.execution.authoritativeAttempts).toBe(0);
    expect(manifest.execution.resultArtifactCreated).toBe(false);

    const protectedHashes: Record<string, string> = {
      "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/paired-results.json": "b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03",
      "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/results.json": "51019087d2199f8506267c3e6a4fbdb8824962641a6ed49abaa7e2c7bcc59ee6",
      "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json": "52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e",
    };
    for (const [relativePath, expected] of Object.entries(protectedHashes)) {
      expect(sha256(path.join(ROOT, relativePath))).toBe(expected);
    }
  });
});

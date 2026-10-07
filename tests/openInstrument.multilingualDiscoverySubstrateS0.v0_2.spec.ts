import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import baselineArtifact from "../docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json";
import manifestArtifact from "../docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/hash-manifest.json";
import {
  buildMultilingualDiscoverySubstrateS0BaselineV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2";

const REPOSITORY_BASELINE_HEAD = "ac9a17f9f40709e0da209cef64d86ba224cac778";
const BASELINE_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json";
const MANIFEST_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/hash-manifest.json";

function canonicalJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function readRepositoryFile(relativePath: string): Buffer {
  return fs.readFileSync(path.join(process.cwd(), relativePath));
}

describe("multilingual Discovery substrate v0.2 S0 baseline freeze", () => {
  const reconstructed = buildMultilingualDiscoverySubstrateS0BaselineV0_2({
    repositoryBaselineHead: REPOSITORY_BASELINE_HEAD,
  });

  test("reconstructs the frozen 57 / 95 / 54+41 baseline", () => {
    expect(reconstructed.directSubstrate.total).toBe(57);
    expect(reconstructed.directSubstrate.languageCounts).toEqual({
      Albanian: 55,
      Latin: 2,
    });
    expect(reconstructed.directSubstrate.uniqueNormalizedSourceForms).toBe(57);
    expect(reconstructed.directSubstrate.uniqueQueryKeys).toBe(57);
    expect(reconstructed.directSubstrate.duplicateNormalizedSourceForms).toEqual([]);
    expect(reconstructed.directSubstrate.queryKeyCollisions).toEqual([]);
    expect(reconstructed.catalog.rawRowCount).toBe(98);
    expect(reconstructed.catalog.loadedRowCount).toBe(95);
    expect(reconstructed.catalog.loaderQuarantinedRowCount).toBe(3);
    expect(reconstructed.catalog.counts).toEqual({
      currentlyProjected: 54,
      notProjected: 41,
      s1Selected: 19,
      admissionUnresolved: 6,
      adapterDeferred: 2,
      boundaryExcluded: 14,
      preliminaryEligible: 81,
    });
    expect(reconstructed.catalog.loadedRows
      .filter((row) => row.s0Classification === "S1_SELECTED")
      .every((row) => !reconstructed.directSubstrate.queryKeyCollisions
        .some((collision) => collision.key === row.normalizedQueryKey)))
      .toBe(true);
    expect(reconstructed.catalog.sourceTraditionCounts).toEqual({
      "NONE": 35,
      "fjale.fjalor-shqip.albanian-shter.v0_1": 1,
      "fjale.fjalor-shqip.albanian-shterp.v0_1": 2,
      "fjale.fjalor-shqip.albanian-shterpezoj.v0_1": 1,
      "fjale.fjalor-shqip.v0_1": 26,
      "fjalori.online.albanian-mat.v0_1": 1,
      "fjalori.online.albanian-shter.v0_1": 1,
      "fjalori.online.albanian-shterp.v0_1": 2,
      "kaikki.wiktionary.albanian-mas.v0_1": 1,
      "logeion.lsj.v0_1": 1,
      "scaife.lewis-short.v0_1": 24,
      "scaife.middle-liddell.v0_1": 4,
    });
  });

  test("freezes the exact S1 cohort without projecting it", () => {
    expect(reconstructed.s1Cohort.count).toBe(19);
    expect(reconstructed.s1Cohort.targetWordSelectionPresent).toBe(false);
    expect(reconstructed.s1Cohort.externalFetchRequired).toBe(false);
    expect(reconstructed.s1Cohort.reAttestationRequired).toBe(false);
    expect(reconstructed.s1Cohort.newAdapterRequired).toBe(false);
    const selectedIds = new Set(
      reconstructed.s1Cohort.rows.map((row) => row.researchEvidenceId),
    );
    expect(
      reconstructed.directSubstrate.records.some((record) =>
        selectedIds.has(record.recordId),
      ),
    ).toBe(false);
    expect(
      reconstructed.catalog.loadedRows
        .filter((row) => selectedIds.has(row.researchEvidenceId))
        .every((row) => row.currentlyProjected === false),
    ).toBe(true);
  });

  test("freezes the held and excluded rows under existing contract reasons", () => {
    expect(reconstructed.heldAndExcluded.admissionUnresolved).toHaveLength(6);
    expect(reconstructed.heldAndExcluded.adapterDeferred).toHaveLength(2);
    expect(reconstructed.heldAndExcluded.boundaryExcluded).toHaveLength(14);
    expect(
      reconstructed.heldAndExcluded.admissionUnresolved,
    ).toEqual(expect.arrayContaining([
      "research.external.greek-eremos-empty-devoid.v0_1",
      "research.external.karoly-ak-flow.gjak.v0_1",
      "research.external.latin-cor-heart.scale50.v0_1",
      "research.external.latin-edo-eat.scale50.v0_1",
      "research.external.latin-mens-mind.scale50.v0_1",
      "research.external.latin-belligero-war.scale50.v0_1",
    ]));
    expect(
      reconstructed.heldAndExcluded.adapterDeferred,
    ).toEqual(expect.arrayContaining([
      "research.external.greek-oikodomeo-build.scale50.cohortG.v0_1",
      "research.external.greek-phero-carry.scale50.cohortG.v0_1",
    ]));
    const unresolvedRows = reconstructed.catalog.loadedRows.filter(
      (row) => row.s0Classification === "ADMISSION_UNRESOLVED",
    );
    expect(unresolvedRows.every((row) =>
      row.reasonCodes.includes("PROVENANCE_MISSING") &&
      row.reasonCodes.includes("TARGET_BINDING_MALFORMED"),
    )).toBe(true);
    expect(reconstructed.evaluationProcedure.expandedResultsInspected).toBe(false);
  });

  test("binds canonical artifact bytes, input fingerprints, and procedure identity", () => {
    const artifactBytes = Buffer.from(canonicalJson(baselineArtifact), "utf8");
    const manifestBytes = Buffer.from(canonicalJson(manifestArtifact), "utf8");
    const artifactBinding = manifestArtifact.artifacts.find(
      (artifact) => artifact.path === BASELINE_PATH,
    );
    expect(artifactBinding).toBeDefined();
    expect(artifactBinding?.bytes).toBe(artifactBytes.byteLength);
    expect(artifactBinding?.sha256).toBe(sha256(artifactBytes));
    expect(artifactBytes.byteLength).toBe(293579);
    expect(sha256(artifactBytes)).toBe(
      "52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e",
    );
    expect(manifestBytes.byteLength).toBe(2675);
    expect(sha256(manifestBytes)).toBe(
      "38d57de7082b4d719b76aa5cf34e177c5e0d811a1a11341bba9535fafcbf764f",
    );
    expect(baselineArtifact).toEqual(reconstructed);
    expect(reconstructed.evaluationProcedure.procedureId).toBe(
      "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s3-coverage-procedure.v0.1",
    );
    expect(reconstructed.evaluationProcedure.sampleSize).toBe(512);
    expect(reconstructed.evaluationProcedure.baselineSubstrateRecordCount).toBe(57);
    expect(reconstructed.evaluationProcedure.baselineSubstrateFingerprint).toBe(
      sha256(JSON.stringify(reconstructed.directSubstrate.records)),
    );
    expect(manifestArtifact.procedureId).toBe(reconstructed.procedureId);
    expect(manifestArtifact.artifacts).toHaveLength(1);
    for (const input of manifestArtifact.inputs) {
      const inputBytes = readRepositoryFile(input.path);
      expect(input.bytes).toBe(inputBytes.byteLength);
      expect(input.sha256).toBe(sha256(inputBytes));
    }
    expect(MANIFEST_PATH).toContain("hash-manifest.json");
  });

  test("keeps the S0 artifact outside the production runtime seam", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/from ["'].*api|from ["'].*InstrumentPanel/);
    expect(source).not.toMatch(/create.*WitnessAdapter/);
    expect(manifestArtifact.execution.s1Projected).toBe(false);
    expect(manifestArtifact.execution.expandedResultsInspected).toBe(false);
  });
});

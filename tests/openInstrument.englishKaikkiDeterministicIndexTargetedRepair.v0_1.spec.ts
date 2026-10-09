import { readFileSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  assertPhysicalCompletenessV0_1,
  serializeMissingOrdinalsSha256V0_1,
} from "@/../scripts/openInstrumentEnglishKaikkiDeterministicIndexTargetedRepair.v0_1";
import { BucketWritersV0_1, DEFAULT_BUCKET_BUFFER_BYTES } from "@/../scripts/openInstrumentEnglishKaikkiDeterministicIndexBuild.v0_1";

describe("English Kaikki targeted completeness repair", () => {
  it("records the repaired artifact and additive authority binding", () => {
    const evidence = JSON.parse(
      readFileSync(
        "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/authority-identity-correction-reconciliation.json",
        "utf8",
      ),
    ) as any;
    expect(evidence.status).toBe("TARGETED_6597_POSTING_COMPLETENESS_REPAIR_PASS");
    expect(evidence.parentAuthority.machineContractSha256).toBe(
      "0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8",
    );
    expect(evidence.repairedArtifact.artifactIdentitySha256).toBe(
      "0bc436e346a903193a326534f4bfd643e7bc0721cffecd74df8912f706777ae9",
    );
    expect(evidence.physicalCompletenessProof).toMatchObject({
      countA: 1492836,
      countB: 1492836,
      countC: 1492836,
      missingRecordOrdinals: 0,
    });
  });

  it("binds the forensic missing-ordinal serialization", () => {
    expect(serializeMissingOrdinalsSha256V0_1([1384, 1385, 5376])).toBe(
      "f92ea1f45df80a6b812e0330bbe0c204e3b1af05e5273cd5ac13667a3d40c174",
    );
  });

  it("rejects a physically incomplete postings count even when all counters agree", () => {
    expect(() =>
      assertPhysicalCompletenessV0_1({
        countA: 1486239,
        countB: 1486239,
        countC: 1486239,
        manifestPostingsWritten: 1486239,
      }),
    ).toThrow("PHYSICAL_COUNT_A_MISMATCH");
  });

  it("flushes a buffered-only bucket below the file-opening threshold on close", async () => {
    const directory = await mkdtemp(join(tmpdir(), "open-instrument-bucket-regression-"));
    try {
      const writers = new BucketWritersV0_1(directory, DEFAULT_BUCKET_BUFFER_BYTES);
      const payload = Buffer.from("{\"recordOrdinal\":1}\n", "utf8");
      await writers.append(17, payload);
      await writers.close();
      await expect(readFile(join(directory, "bucket-017.ndjson"))).resolves.toEqual(payload);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});

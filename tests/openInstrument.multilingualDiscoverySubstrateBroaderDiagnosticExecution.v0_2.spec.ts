import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  BROADER_DIAGNOSTIC_HASH_MANIFEST_PATH_V0_2,
  BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2,
  BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2,
  BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2,
  verifyStoredBroaderDiagnosticResultV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateBroaderDiagnosticExecution.v0_2";

describe("multilingual substrate v0.2 broader diagnostic stored result", () => {
  it("verifies the single stored result without re-executing the scientific engine", () => {
    const rootDir = process.cwd();
    expect(existsSync(join(rootDir, BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2))).toBe(true);
    expect(existsSync(join(rootDir, BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2))).toBe(true);
    expect(existsSync(join(rootDir, BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2))).toBe(true);
    expect(existsSync(join(rootDir, BROADER_DIAGNOSTIC_HASH_MANIFEST_PATH_V0_2))).toBe(true);
    expect(verifyStoredBroaderDiagnosticResultV0_2(rootDir)).toEqual({
      ok: true,
      scientificEngineReexecuted: false,
      aggregateAccountingVerified: true,
      hashesVerified: true,
    });
  });
});

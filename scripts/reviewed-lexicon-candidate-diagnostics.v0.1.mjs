import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const tempDir = mkdtempSync(join(tmpdir(), "zero-reviewed-lexicon-diagnostics-"));
const outputPath = join(tempDir, "report.json");
const testPath = "tests/tmp.reviewedLexiconCandidateDiagnostics.audit.local.spec.ts";

const testSource = `
import { writeFileSync } from "node:fs";
import {
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("temporary reviewed lexicon candidate diagnostics audit", () => {
  it("writes the candidate diagnostics report", () => {
    const rows = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.map((row) => {
      const gate = evaluateReviewedExternalLexiconEvidenceGateV0_1(row);
      const productionSafe = isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row);
      const promotionChecklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

      return {
        sourceId: row.sourceId,
        candidateId: row.candidateId,
        productionSafe,
        liveStatus: productionSafe ? "promotion_ready_candidate" : "non_live_candidate",
        validationOutcome: gate.validationOutcome,
        validationReasons: gate.validationReasons,
        evidenceCategories: gate.evidenceCategories,
        freeOperatorDiagnostic: gate.freeOperatorDiagnostic,
        nonLiveReason: productionSafe
          ? null
          : "Candidate registry row is blocked from production by pending citation metadata and NON-LIVE CANDIDATE boundary.",
        promotionChecklist,
        promotionChecklistFailedItems: promotionChecklist.items.filter((item) => !item.passed),
        userDecisionPosture: gate.userDecisionPosture,
      };
    });

    writeFileSync(
      ${JSON.stringify(outputPath)},
      JSON.stringify({ reportVersion: "reviewed-lexicon-candidate-diagnostics.v0.1", rows }, null, 2),
    );

    expect(rows.length).toBeGreaterThan(0);
  });
});
`;

try {
  writeFileSync(testPath, testSource);
  execFileSync("npm", ["test", "--", testPath, "--runInBand", "--silent"], {
    stdio: "pipe",
    encoding: "utf8",
  });
  process.stdout.write(readFileSync(outputPath, "utf8"));
  process.stdout.write("\n");
} finally {
  rmSync(testPath, { force: true });
  rmSync(tempDir, { recursive: true, force: true });
}

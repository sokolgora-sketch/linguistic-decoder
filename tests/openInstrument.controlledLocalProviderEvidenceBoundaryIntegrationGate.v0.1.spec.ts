import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const helper = path.join(repoRoot, "scripts/openInstrumentControlledLocalProviderEvidenceBoundaryValidation.v0.1.mjs");
const fixturePath = path.join(repoRoot, "docs/open-instrument/fixtures/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-static-fixture-v0.1.json");
const schemaPath = path.join(repoRoot, "docs/open-instrument/schemas/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-schema-v0.1.json");

describe("Open Instrument controlled local-provider evidence boundary integration gate v0.1", () => {
  it("keeps the checked-in static boundary fixture passing the validation helper", () => {
    expect(() => {
      execFileSync(process.execPath, [helper], {
        cwd: repoRoot,
        stdio: "pipe",
      });
    }).not.toThrow();
  });

  it("keeps the boundary implementation scoped to static files and validation only", () => {
    const helperSource = fs.readFileSync(helper, "utf8");
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

    expect(helperSource).toContain("static evidence-boundary validation only");
    expect(helperSource).not.toMatch(/from ["']openai["']/);
    expect(helperSource).not.toMatch(/fetch\(/);
    expect(helperSource).not.toMatch(/axios/);
    expect(fixture.nonExecutionDeclaration.providerRunOccurred).toBe(false);
    expect(fixture.nonExecutionDeclaration.modelCallOccurred).toBe(false);
    expect(fixture.authorizationGates.runtimeApiUiWiringAuthorized).toBe(false);
    expect(schema.requiredFalseAuthorizationGates).toContain("candidateTruthEvidenceAuthorized");
  });

  it("keeps candidate-truth origin model-quality publication and execution-safety evidence blocked", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.evidenceBoundary.evidenceClassesDenied).toEqual(
      expect.arrayContaining([
        "candidate_truth_evidence",
        "origin_evidence",
        "model_quality_evidence",
        "publication_evidence",
        "execution_safety_evidence",
      ]),
    );

    expect(fixture.authorizationGates.candidateTruthEvidenceAuthorized).toBe(false);
    expect(fixture.authorizationGates.originEvidenceAuthorized).toBe(false);
    expect(fixture.authorizationGates.modelQualityEvidenceAuthorized).toBe(false);
    expect(fixture.authorizationGates.publicationEvidenceAuthorized).toBe(false);
    expect(fixture.authorizationGates.executionSafetyEvidenceAuthorized).toBe(false);
  });
});

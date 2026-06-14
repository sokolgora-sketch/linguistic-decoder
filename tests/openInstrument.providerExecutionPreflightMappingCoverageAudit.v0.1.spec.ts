import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const helperPath = path.join(
  repoRoot,
  "scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs",
);

const paths = {
  mappingDesign:
    "docs/open-instrument/open-instrument-provider-execution-preflight-fixture-contract-checklist-mapping-design-v0.1.md",
  mappingReview:
    "docs/open-instrument/open-instrument-provider-execution-preflight-fixture-contract-checklist-mapping-design-review-v0.1.md",
  auditDesign:
    "docs/open-instrument/open-instrument-provider-execution-preflight-mapping-coverage-audit-design-v0.1.md",
  auditReview:
    "docs/open-instrument/open-instrument-provider-execution-preflight-mapping-coverage-audit-design-review-v0.1.md",
  checklistContractDesign:
    "docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-v0.1.md",
  checklistContractReview:
    "docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-review-v0.1.md",
  fixture:
    "docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json",
};

const envKeys = {
  mappingDesign:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_DESIGN_PATH",
  auditDesign:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_DESIGN_PATH",
  fixture:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_FIXTURE_PATH",
};

function readDoc(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readFixture(): Record<string, unknown> {
  return JSON.parse(readDoc(paths.fixture)) as Record<string, unknown>;
}

function writeTempFile(prefix: string, filename: string, content: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function runAudit(extraEnv: Record<string, string> = {}): string {
  return execFileSync(process.execPath, [helperPath], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });
}

function expectAuditRejected(extraEnv: Record<string, string>): void {
  expect(() => runAudit(extraEnv)).toThrow();
}

describe("Open Instrument provider execution preflight mapping coverage audit v0.1", () => {
  it("passes the checked-in provider execution preflight mapping coverage audit", () => {
    const output = runAudit();

    expect(output).toContain(
      "Open Instrument provider execution preflight mapping coverage audit v0.1",
    );
    expect(output).toContain("Boundary: no provider execution, no model call, no OpenAI API use.");
    expect(output).toContain(
      "Open Instrument provider execution preflight mapping coverage audit passed.",
    );
    expect(output).toContain('"providerExecutionAuthorized": false');
    expect(output).toContain('"modelCallAuthorized": false');
    expect(output).toContain('"openAiApiUseAuthorized": false');
    expect(output).toContain('"runtimeApiUiWiringAuthorized": false');
    expect(output).toContain('"providerIdentity"');
    expect(output).toContain('"authorizationGates"');
    expect(output).toContain('"evidenceBoundaryStatus"');
  });

  it("fails closed when a required mapping section is missing", () => {
    const degradedMappingDesign = readDoc(paths.mappingDesign).replace(
      "## providerIdentity mapping",
      "## provider identity mapping REMOVED",
    );
    const tempMappingDesignPath = writeTempFile(
      "oi-mapping-coverage-",
      "mapping-design.md",
      degradedMappingDesign,
    );

    expectAuditRejected({
      [envKeys.mappingDesign]: tempMappingDesignPath,
    });
  });

  it("fails closed when a required fixture section is missing", () => {
    const fixture = readFixture();
    delete fixture.authorizationGates;

    const tempFixturePath = writeTempFile(
      "oi-mapping-coverage-",
      "fixture.json",
      JSON.stringify(fixture, null, 2),
    );

    expectAuditRejected({
      [envKeys.fixture]: tempFixturePath,
    });
  });

  it("fails closed when audit fail-closed coverage is missing", () => {
    const degradedAuditDesign = readDoc(paths.auditDesign).replaceAll(
      "fail closed if any mapping creates evidence claims",
      "evidence claim guard removed",
    );
    const tempAuditDesignPath = writeTempFile(
      "oi-mapping-coverage-",
      "audit-design.md",
      degradedAuditDesign,
    );

    expectAuditRejected({
      [envKeys.auditDesign]: tempAuditDesignPath,
    });
  });

  it("fails closed when mapping text authorizes provider execution", () => {
    const unsafeMappingDesign = `${readDoc(paths.mappingDesign)}\nprovider execution is authorized\n`;
    const tempMappingDesignPath = writeTempFile(
      "oi-mapping-coverage-",
      "unsafe-mapping-design.md",
      unsafeMappingDesign,
    );

    expectAuditRejected({
      [envKeys.mappingDesign]: tempMappingDesignPath,
    });
  });

  it("does not import runtime, API, UI, provider, or OpenAI modules", () => {
    const helperSource = fs.readFileSync(helperPath, "utf8");

    expect(helperSource).not.toContain("fetch(");
    expect(helperSource).not.toContain("api.openai.com");
    expect(helperSource).not.toContain("new OpenAI");
    expect(helperSource).not.toContain("openai.chat");
    expect(helperSource).not.toContain("/api/analyze");
    expect(helperSource).not.toContain("app/api");
    expect(helperSource).not.toContain("components/");
  });
});

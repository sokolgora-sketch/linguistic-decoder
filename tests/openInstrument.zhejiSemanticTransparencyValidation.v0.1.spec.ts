import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const schemaPath =
  "docs/open-instrument/schemas/zheji-semantic-transparency/zheji-semantic-transparency-schema-v0.1.json";
const fixturePath =
  "docs/open-instrument/fixtures/zheji-semantic-transparency/zheji-semantic-transparency-static-fixture-v0.1.json";
const helperPath = "scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs";

function readFixture(): any {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function writeTempFixture(mutator: (fixture: any) => void): string {
  const fixture = readFixture();
  mutator(fixture);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "zheji-semantic-transparency-"));
  const tempPath = path.join(tempDir, "fixture.json");
  fs.writeFileSync(tempPath, JSON.stringify(fixture, null, 2));
  return tempPath;
}

function runValidator(tempFixturePath = fixturePath): any {
  const helperUrl = pathToFileURL(path.resolve(helperPath)).href;
  const code = `
    import { validateZhejiSemanticTransparencyPassiveArtifacts } from ${JSON.stringify(helperUrl)};
    const result = validateZhejiSemanticTransparencyPassiveArtifacts({
      schemaPath: ${JSON.stringify(path.resolve(schemaPath))},
      fixturePath: ${JSON.stringify(path.resolve(tempFixturePath))},
      helperPath: ${JSON.stringify(path.resolve(helperPath))}
    });
    console.log(JSON.stringify(result));
  `;

  const run = spawnSync(process.execPath, ["--input-type=module", "-e", code], {
    encoding: "utf8",
  });

  if (run.status !== 0) {
    throw new Error(`validator process failed\nSTDOUT:\n${run.stdout}\nSTDERR:\n${run.stderr}`);
  }

  return JSON.parse(run.stdout.trim());
}

describe("Zheji Semantic Transparency passive artifacts v0.1", () => {
  it("validates the accepted passive schema and static fixture", () => {
    const result = runValidator();

    expect(result).toMatchObject({
      ok: true,
      checked: {
        caseCount: 3,
      },
    });
    expect(result.errors).toEqual([]);
  });

  it("contains candidate, null, and blocked fixture cases", () => {
    const fixture = readFixture();
    const statuses = fixture.cases.map((testCase: any) => testCase.transparency_status);

    expect(statuses).toContain("candidate_transparency");
    expect(statuses).toContain("null_no_transparency");
    expect(statuses).toContain("blocked_forbidden_claim");
  });

  it("fails when source note is missing", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[0].source_note = "";
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("source_note");
  });

  it("fails when origin proof wording appears in claim-bearing text", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[0].diagnostic_notes.push("this proves the true origin");
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("forbidden claim wording");
  });

  it("fails when ownership claim wording appears in claim-bearing text", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[0].diagnostic_notes.push("this language owns the word");
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("forbidden claim wording");
  });

  it("allows required source-note denial language without treating it as a forbidden claim", () => {
    const fixture = readFixture();

    for (const testCase of fixture.cases) {
      expect(testCase.source_note).toContain("final etymology");
      expect(testCase.source_note).toContain("publication-grade proof");
    }

    const result = runValidator();

    expect(result.ok).toBe(true);
  });

  it("fails when provider-only support is accepted as strong evidence", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[0].transparency_status = "strong_candidate_transparency";
      fixture.cases[0].isolation_audit.provider_only_check.status = "fail";
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("provider-only support cannot be accepted as strong evidence");
  });

  it("fails when Code F and Code E are coupled to the same object", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[0].code_e = fixture.cases[0].code_f;
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("code_f and code_e must be independent objects");
  });

  it("fails when null status lacks null_reason", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[1].null_reason = null;
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("null_no_transparency requires null_reason");
  });

  it("fails when forbidden origin audit is not blocked", () => {
    const tempFixturePath = writeTempFixture((fixture) => {
      fixture.cases[2].transparency_status = "candidate_transparency";
      fixture.cases[2].isolation_audit.origin_claim_check.status = "fail";
    });

    const result = runValidator(tempFixturePath);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("failed origin/ownership audit must force blocked_forbidden_claim");
  });

  it("keeps the validation helper free from runtime/API/UI/provider imports", () => {
    const helperText = fs.readFileSync(helperPath, "utf8");

    expect(helperText).not.toMatch(/fetch\s*\(/);
    expect(helperText).not.toMatch(/from\s+["'][^"']*(?:src\/|app\/|pages\/|components\/|ui\/|api\/)[^"']*["']/);
    expect(helperText).not.toMatch(/require\(["'][^"']*(?:src\/|app\/|pages\/|components\/|ui\/|api\/)[^"']*["']\)/);
    expect(helperText).not.toMatch(new RegExp("Open" + "AI", "i"));
    expect(helperText).not.toMatch(new RegExp("oll" + "ama", "i"));
    expect(helperText).not.toMatch(new RegExp("local" + "host", "i"));
    expect(helperText).not.toMatch(new RegExp("process" + "\\.env\\.[A-Z0-9_]*" + "KEY", "i"));
  });
});

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const helperPath = path.join(root, "scripts/openInstrumentStaticProviderResultImportQuarantineValidation.v0.1.mjs");
const schemaPath = path.join(root, "docs/open-instrument/schemas/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-schema-v0.1.json");
const fixturePath = path.join(root, "docs/open-instrument/fixtures/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-static-fixture-v0.1.json");

describe("Open Instrument static provider-result import quarantine validation v0.1", () => {
  it("validates the static quarantine fixture through the helper", () => {
    const stdout = execFileSync("node", [helperPath], { cwd: root, encoding: "utf8" });
    const result = JSON.parse(stdout);

    expect(result.status).toBe("STATIC_PROVIDER_RESULT_IMPORT_QUARANTINE_VALID");
    expect(result.providerName).toBe("ollama");
    expect(result.modelName).toBe("llama3.1:8b");
    expect(result.responseSha256).toBe("4ed28de890a82de2106400038b5115ef34a1bf11e6df273f7eac0ed51983ebda");
    expect(result.importStatus).toBe("static_import_validated");
    expect(result.quarantineStatus).toBe("quarantined_candidate_only");
    expect(result.evidencePromotionStatus).toBe("evidence_promotion_blocked");
    expect(result.errors).toEqual([]);
  });

  it("keeps the schema and fixture in the approved static quarantine boundary", () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
    expect(fs.existsSync(fixturePath)).toBe(true);

    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(schema.additionalProperties).toBe(false);
    expect(fixture.recordKind).toBe("open_instrument_static_provider_result_import_quarantine");
    expect(fixture.schemaVersion).toBe("0.1");
    expect(fixture.secretStatus).toBe("secrets_absent");
  });
});

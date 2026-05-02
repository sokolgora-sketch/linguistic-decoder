import { readFileSync } from "node:fs";

const src = readFileSync("src/ui/evals/EvalsPageClient.v0.1.tsx", "utf8");

describe("evals saved run provenance correction guard v0.1", () => {
  it("exposes a metadata-only correction action for saved runs", () => {
    expect(src).toContain("function saveSelectedSavedRunProvenanceCorrection()");
    expect(src).toContain("Save provenance");
    expect(src).toContain("This does not edit runId, buckets, verdicts, or stats.");
  });

  it("places the provenance save action beside the selected saved run row", () => {
    expect(src).toContain("{selected ? (");
    expect(src).toContain("title=\"Save edited provider/model/label/sourceEngine metadata to this loaded saved run.\"");
    expect(src).toContain("use Save provenance beside the selected saved run");
    expect(src).not.toContain("Save provenance correction</button>");
  });

  it("updates managed provenance fields on workbench, run input meta, report meta, and report markdown", () => {
    expect(src).toContain("EVALS_MANAGED_PROVENANCE_KEYS_V0_1");
    expect(src).toContain("currentProvenanceMetaFromForm");
    expect(src).toContain("applyManagedProvenanceMetaV0_1");
    expect(src).toContain("patchEvalRunInputTextMetaV0_1");
    expect(src).toContain("patchReportMarkdownMetaV0_1");
    expect(src).toContain("meta: applyManagedProvenanceMetaV0_1(");
    expect(src).toContain("inputText: patchEvalRunInputTextMetaV0_1(selected.workbench.inputText, patch)");
  });

  it("persists the corrected saved run and reloads the corrected checkpoint", () => {
    expect(src).toContain("writeSavedRuns(nextRows);");
    expect(src).toContain("setSavedRuns(nextRows);");
    expect(src).toContain("restoreWorkbench(nextWorkbench);");
    expect(src).toContain("setNotice(`Saved provenance correction:");
  });

  it("does not expose runId editing as part of provenance correction", () => {
    const fnStart = src.indexOf("function saveSelectedSavedRunProvenanceCorrection()");
    expect(fnStart).toBeGreaterThanOrEqual(0);
    const fnEnd = src.indexOf("function deleteSavedRunById", fnStart);
    const fn = src.slice(fnStart, fnEnd);
    expect(fn).not.toContain("runId:");
    expect(fn).not.toContain("setRunId");
  });
});

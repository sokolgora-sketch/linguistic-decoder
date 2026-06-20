import fs from "node:fs";
import path from "node:path";

const promptPath = path.join(
  process.cwd(),
  "src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts",
);

function promptSource(): string {
  return fs.readFileSync(promptPath, "utf8");
}

describe("Open Instrument Brain candidate-search prompt Isolation Audit hardening v0.1", () => {
  it("adds the Isolation Audit block to the Brain candidate-search prompt", () => {
    const source = promptSource();

    expect(source).toContain("<ISOLATION_AUDIT>");
    expect(source).toContain("</ISOLATION_AUDIT>");
    expect(source).toContain("sourceNote makes each candidate auditable");
  });

  it("requires isolated standalone proof before atomic description", () => {
    const source = promptSource();

    expect(source).toContain("Before describing any candidate as atomic");
    expect(source).toContain("isolated standalone form");
    expect(source).toContain("plain standalone definition or gloss");
    expect(source).toContain("standalone meaning from contextual interpretation");
  });

  it("rejects metaphor, resonance, and target-word convenience as atomic proof", () => {
    const source = promptSource();

    expect(source).toContain("must not use metaphor");
    expect(source).toContain("symbolic resonance");
    expect(source).toContain("target-word convenience");
    expect(source).toContain("atomic proof");
  });

  it("preserves the current candidateType enum contract instead of adding unsupported enum values", () => {
    const source = promptSource();

    expect(source).toContain("existing allowed candidateType");
    expect(source).toContain("weak_resonance");
    expect(source).toContain("likely_false_friend");
    expect(source).toContain("null_candidate");
    expect(source).toContain("do not put unsupported labels into candidateType");
  });

  it("keeps fallback labels in sourceNote or notes only", () => {
    const source = promptSource();

    expect(source).toContain("metaphorical");
    expect(source).toContain("derived");
    expect(source).toContain("opaque");
    expect(source).toContain("may appear in sourceNote or notes only");
  });

  it("keeps null candidates auditable under the current null-candidate contract", () => {
    const source = promptSource();

    expect(source).toContain("If the candidate is null");
    expect(source).toContain("non-empty null explanation");
    expect(source).toContain("current null-candidate contract");
  });
});

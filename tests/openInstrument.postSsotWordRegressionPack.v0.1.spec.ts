import { readFileSync } from "fs";
import path from "path";

const repoRoot = path.resolve(__dirname, "..");
const evidenceDoc = path.join(
  repoRoot,
  "docs/open-instrument/post-ssot-word-regression-pack-v0.1.md",
);

function readEvidence(): string {
  return readFileSync(evidenceDoc, "utf8");
}

describe("post-SSOT word regression pack v0.1", () => {
  it("records the post-SSOT reviewed base", () => {
    const text = readEvidence();

    expect(text).toContain("Status: POST_SSOT_WORD_REGRESSION_PACK_RECORDED_PENDING_REVIEW.");
    expect(text).toContain("Short SHA: 4ccb9901");
    expect(text).toContain(
      "Full SHA: 4ccb99019353ce8cc607ce3d728318cd8136079a",
    );
    expect(text).toContain(
      "Subject: docs(open-instrument): review seven-voice ordered views symbolic core consumer wiring implementation v0.1",
    );
  });

  it("records normalized deterministic hashes for all words", () => {
    const text = readEvidence();

    expect(text).toContain(
      "| study | 1dfc39a9ddaaa122948bbadd18f6ab99e7d8f8a96ad8eb5e90a0d389f1d10203 | 0f7ec3e8645afe006fa04e42c813fcf6a79f704cfd1ad90d57fd7cd729bd8c72 | 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec | 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec | YES | 0.2.0-symbolic | UI | UNITY>INSIGHT | 2 |",
    );
    expect(text).toContain(
      "| damage | 5b0a110925ac817b8eaf017bc510736bdb1bb7ab5b74f811b60a4049595f6c07 | 2b6d6b2a0bd88ffb5dee49ab7ba60335910dcda0be6ff2c7567c9d064080b9d8 | 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb | 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb | YES | 0.2.0-symbolic | AE | TRUTH>EXPANSION | 2 |",
    );
    expect(text).toContain(
      "| mystery | 933190de8772935d1bc71416bfa747815ee05b9bd13e72b09e3f368b0e68420a | 536369c10b74d2739c15afc8f8f2b69cca8de37b7a0c80c20b369913cbb7d8ef | 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1 | 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1 | YES | 0.2.0-symbolic | YEI | REFLECTION>EXPANSION>INSIGHT | 0 |",
    );
    expect(text).toContain(
      "| water | 33cb24f205236a032bcb8d16ae061f856a95c0e647ee8ce3000379926a462505 | 72e18a842b4e88f1a4781b51340c0133d0f6f528348539513dd0b41c2867ae56 | 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d | 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d | YES | 0.2.0-symbolic | AE | TRUTH>EXPANSION | 0 |",
    );
  });

  it("locks the timestamp normalization rule and regression-only boundary", () => {
    const text = readEvidence();

    expect(text).toContain("REGRESSION_SCOPE_ONLY=YES");
    expect(text).toContain("RAW_HASH_CAN_DIFFER_DUE_TO_TIMESTAMP_FIELDS=YES");
    expect(text).toContain("NORMALIZED_HASH_MATCH_REQUIRED=YES");
    expect(text).toContain(
      "This proves post-SSOT API/Math7/Heart output is deterministic after removing known volatile timestamps.",
    );
    expect(text).toContain("This does not prove unresolved etymology claims.");
    expect(text).toContain(
      "For damage, this does not prove da, dëm, ndarje, or mythic-register decomposition.",
    );
  });
});

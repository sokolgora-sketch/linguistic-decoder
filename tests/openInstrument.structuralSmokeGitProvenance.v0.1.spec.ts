import { readFileSync } from "node:fs";
import {
  resolveStructuralSmokeCheckoutHeadSha,
  resolveStructuralSmokeGitProvenance,
} from "../scripts/open-instrument/structuralSmokeGitProvenance.v0.1";

const checkoutSha = "1111111111111111111111111111111111111111";
const featureSha = "2222222222222222222222222222222222222222";
const baseSha = "3333333333333333333333333333333333333333";

describe("structural browser smoke Git provenance", () => {
  it("uses the verified GitHub workflow SHA without requiring git ownership access", () => {
    const readGitHead = jest.fn(() => checkoutSha);
    expect(resolveStructuralSmokeCheckoutHeadSha(featureSha, readGitHead)).toBe(featureSha);
    expect(readGitHead).not.toHaveBeenCalled();
  });

  it("uses runtime git provenance for local runs without a workflow SHA", () => {
    const readGitHead = jest.fn(() => checkoutSha);
    expect(resolveStructuralSmokeCheckoutHeadSha(null, readGitHead)).toBe(checkoutSha);
    expect(readGitHead).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed workflow SHA rather than falling back to a possibly stale checkout", () => {
    const readGitHead = jest.fn(() => checkoutSha);
    expect(() => resolveStructuralSmokeCheckoutHeadSha("stale", readGitHead)).toThrow(/exact 40-character/);
    expect(readGitHead).not.toHaveBeenCalled();
  });

  it("keeps the checked-out commit, PR feature head, base, and smoke result distinct", () => {
    const provenance = resolveStructuralSmokeGitProvenance({
      eventName: "pull_request",
      eventPayload: { pull_request: { head: { sha: featureSha }, base: { ref: "main", sha: baseSha } } },
      checkoutHeadSha: checkoutSha,
      explicitFeatureHeadSha: featureSha,
      explicitBaseRef: "main",
      explicitBaseSha: baseSha,
      githubSha: null,
    });

    expect(provenance).toEqual({
      source: "GITHUB_ACTION_EVENT",
      eventName: "pull_request",
      testedCheckoutHeadSha: checkoutSha,
      testedFeatureHeadSha: featureSha,
      verifiedPrBase: { ref: "main", sha: baseSha },
    });
  });

  it("rejects caller inputs that disagree with the PR event instead of recording stale base metadata", () => {
    expect(() => resolveStructuralSmokeGitProvenance({
      eventName: "pull_request",
      eventPayload: { pull_request: { head: { sha: featureSha }, base: { ref: "main", sha: baseSha } } },
      checkoutHeadSha: checkoutSha,
      explicitFeatureHeadSha: featureSha,
      explicitBaseRef: "main",
      explicitBaseSha: "4444444444444444444444444444444444444444",
      githubSha: null,
    })).toThrow(/does not match the GitHub pull_request event base SHA/);
  });

  it("requires a verified explicit base when the smoke is run outside a pull request event", () => {
    expect(() => resolveStructuralSmokeGitProvenance({
      eventName: "manual",
      eventPayload: null,
      checkoutHeadSha: checkoutSha,
      explicitFeatureHeadSha: featureSha,
      explicitBaseRef: null,
      explicitBaseSha: null,
      githubSha: null,
    })).toThrow(/explicit verified feature-head and PR-base inputs/);
  });

  it("records no PR base for a main push rather than labeling the pushed commit as a PR base", () => {
    expect(resolveStructuralSmokeGitProvenance({
      eventName: "push",
      eventPayload: { after: featureSha },
      checkoutHeadSha: checkoutSha,
      explicitFeatureHeadSha: featureSha,
      explicitBaseRef: null,
      explicitBaseSha: null,
      githubSha: featureSha,
    })).toMatchObject({
      source: "GITHUB_ACTION_EVENT",
      testedCheckoutHeadSha: checkoutSha,
      testedFeatureHeadSha: featureSha,
      verifiedPrBase: null,
    });
  });

  it("has no hard-coded expectedMain SHA and preserves browser outcome as a separate result field", () => {
    const script = readFileSync("scripts/open-instrument/structural-readout-browser-smoke.v0.1.ts", "utf8");
    expect(script).not.toMatch(/expectedMain\s*:\s*["'][a-f0-9]{40}["']/iu);
    expect(script).not.toContain("8a172fe697fbcd2c1a93f3b0baaa96ca6f3b52f4");
    expect(script).toContain("gitProvenance: StructuralSmokeGitProvenance | null");
    expect(script).toContain('outcome: "RUNNING" | "PASS" | "FAIL" | "BLOCKED"');
  });
});

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const reportPath = path.join(
  root,
  "docs/open-instrument/reports/jo-third-operator-source-readiness-decision-v0.1.md",
);

const profilePath = path.join(
  root,
  "src/shared/canonicalOperatorProfile.v0_1.ts",
);

const admissionPath = path.join(
  root,
  "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
);

const sourceRegistryPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
);

const runtimeAuthorizationPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
);

const operationPolicyPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
);

const report = fs.readFileSync(reportPath, "utf8");
const profileSource = fs.readFileSync(profilePath, "utf8");
const admissionSource = fs.readFileSync(admissionPath, "utf8");
const sourceRegistry = fs.readFileSync(sourceRegistryPath, "utf8");
const runtimeAuthorization = fs.readFileSync(
  runtimeAuthorizationPath,
  "utf8",
);
const operationPolicy = fs.readFileSync(operationPolicyPath, "utf8");

describe("JO third-operator source-readiness decision v0.1", () => {
  it("records a decision-only review posture", () => {
    expect(report).toContain("Status: READINESS_DECISION_ONLY.");
    expect(report).toContain(
      "`JO_STRONGEST_SOURCE_REVIEW_CANDIDATE`",
    );
    expect(report).toContain(
      "`DEDICATED_JO_SOURCE_READINESS_REVIEW`",
    );
    expect(report).toContain(
      "No source row, runtime owner or governance owner is created",
    );
  });

  it("records the exact DPEWA JO article identity", () => {
    for (const marker of [
      "`JO part.`",
      "`25210`",
      "dictionary/?lemmaid=25210",
      "f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e",
      "`EXACT_ATTESTED_HEADWORD_ARTICLE`",
      "`Simplex`",
      "Bardhyl Demiraj",
      "Olav Hackstein",
      "`FGJSSH 745f.`",
      "reconstructed:",
      "false",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("bounds the current JO lexical meaning without overclaiming", () => {
    expect(report).toContain("answer-particle refusal");
    expect(report).toContain("rejection or contradiction");
    expect(report).toContain("general negation");
    expect(report).toMatch(
      /does not collapse those uses into one unrestricted runtime\s+function/,
    );
  });

  it("records why PO remains a distinct higher-complexity review", () => {
    for (const marker of [
      "`PO 1 cnj.`",
      "`PO 2`",
      "conjunction",
      "particle or preverb",
      "homonym and grammatical-isolation burden",
    ]) {
      expect(report).toContain(marker);
    }

    expect(report).toContain(
      "does not declare JO linguistically superior to PO",
    );
  });

  it("keeps TERR separate from TER", () => {
    expect(report).toContain(
      "TERR has an exact attested noun article",
    );
    expect(report).toContain(
      "TERR is a valid exact lexical identity",
    );
    expect(report).toContain(
      "It does not validate the smaller TER identity",
    );
    expect(report).toContain(
      "TER must not inherit the meaning of TERR",
    );
    expect(report).toContain(
      "No shortening operation from TERR to TER is authorized",
    );
  });

  it("keeps reconstructed SHTU evidence non-production", () => {
    expect(report).toContain("`*SHTÚ`");
    expect(report).toContain("explicitly reconstructed");
    expect(report).toContain(
      "without a separate reconstruction-admission policy",
    );
    expect(report).toContain(
      "No such policy exists in the current lane",
    );
  });

  it("records null exact-DPEWA results without universal absence claims", () => {
    for (const candidate of ["LIGJ", "AT", "ND"]) {
      expect(report).toMatch(
        new RegExp(`- ${candidate}[.;]`),
      );
    }

    expect(report).toContain(
      "does not prove that no relevant evidence exists anywhere",
    );
  });

  it("keeps DA and DI as the only current production owners", () => {
    expect(report).toContain(
      "`reviewed.external.gheg-da.damage.candidate.v0_1`",
    );
    expect(report).toContain(
      "`reviewed.external.di.knowledge.candidate.v0_1`",
    );
    expect(report).toContain(
      "The current canonical operators remain:",
    );
    expect(report).toContain("- DA;");
    expect(report).toContain("- DI.");
    expect(report).toContain(
      "No JO identifier currently exists in any reviewed production owner",
    );
  });

  it("does not add JO to current canonical profile source", () => {
    expect(profileSource).toMatch(/operatorId:\s*"DA"/);
    expect(profileSource).toMatch(/operatorId:\s*"DI"/);
    expect(profileSource).not.toMatch(/operatorId:\s*"JO"/);
  });

  it("does not add JO to canon-lock admission", () => {
    expect(admissionSource).toContain('"DA"');
    expect(admissionSource).toContain('"DI"');
    expect(admissionSource).not.toContain('"JO"');
  });

  it("keeps JO candidate-registered but outside production membership", () => {
    expect(sourceRegistry).toContain(
      "reviewed.external.gheg-da.damage.candidate.v0_1",
    );
    expect(sourceRegistry).toContain(
      "reviewed.external.di.knowledge.candidate.v0_1",
    );
    expect(sourceRegistry).toContain(
      "reviewed.external.jo.refusal.candidate.v0_1",
    );

    const productionMembership =
      sourceRegistry.match(
        /const PRODUCTION_SOURCE_ROW_IDS_V0_1 = new Set<string>\(\[([\s\S]*?)\]\);/,
      )?.[1] ?? "";

    expect(productionMembership).not.toContain(
      "reviewed.external.jo.refusal.candidate.v0_1",
    );
  });

  it("does not authorize JO for reviewed runtime projection", () => {
    expect(runtimeAuthorization).not.toMatch(
      /reviewed\.external\.[^"\n]*jo[^"\n]*candidate/i,
    );
  });

  it("does not add a JO evidence-operation policy", () => {
    expect(operationPolicy).not.toMatch(
      /operatorId:\s*"JO"/,
    );
  });

  it("locks the required next-review proof matrix", () => {
    for (const marker of [
      "Direct positive controls",
      "Larger-form controls",
      "Cross-operator negative controls",
      "Unrelated-input controls",
      "Operation policy",
      "Carrier policy",
      "Citation isolation",
      "Shared architecture",
      "complete JO citation availability",
      "partial JO citation rejection",
      "no DA citation leakage",
      "no DI citation leakage",
      "no PO citation leakage",
      "substring collision matrix",
      "prefix collision matrix",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("requires the reusable architecture and forbids bespoke branching", () => {
    for (const marker of [
      "reviewed source-row registry",
      "machine authorization",
      "production membership",
      "runtime projection",
      "canonical operator profile",
      "operation policy",
      "carrier policy",
      "profile-backed live smoke",
      "canon-lock admission",
      "a bespoke RootMap branch",
      "a bespoke API branch",
      "a bespoke UI branch",
      "a duplicate source registry",
      "a duplicate citation registry",
      "a hidden polarity-specific runtime path",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("preserves all claim boundaries and user decision posture", () => {
    for (const marker of [
      "historical origin",
      "historical transmission",
      "borrowing direction",
      "linguistic ownership",
      "candidate truth",
      "winner status",
      "language superiority",
      "scientific evidence",
      "publication-grade Open Instrument evidence",
      "`user_decides`",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("keeps the lane non-runtime and non-governance", () => {
    for (const marker of [
      "JO production source-row creation",
      "JO machine authorization",
      "JO production membership",
      "JO runtime projection",
      "JO canonical profile registration",
      "JO operation-policy registration",
      "JO carrier-policy registration",
      "JO live-smoke registration",
      "JO canon-lock admission",
      "RootMap modification",
      "API modification",
      "UI modification",
    ]) {
      expect(report).toContain(marker);
    }

    expect(report).toContain(
      "No production candidate has been promoted.",
    );
  });
});

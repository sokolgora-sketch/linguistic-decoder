import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const reportPath = path.join(
  root,
  "docs/open-instrument/reports/jo-third-operator-scope-operation-carrier-control-matrix-v0.1.md",
);

const sourceRegistryPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
);

const runtimeAuthorizationPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
);

const runtimeProjectionPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts",
);

const operationPolicyPath = path.join(
  root,
  "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
);

const profilePath = path.join(
  root,
  "src/shared/canonicalOperatorProfile.v0_1.ts",
);

const admissionPath = path.join(
  root,
  "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
);

const report = fs.readFileSync(reportPath, "utf8");
const sourceRegistry = fs.readFileSync(sourceRegistryPath, "utf8");
const runtimeAuthorization = fs.readFileSync(
  runtimeAuthorizationPath,
  "utf8",
);
const runtimeProjection = fs.readFileSync(
  runtimeProjectionPath,
  "utf8",
);
const operationPolicy = fs.readFileSync(
  operationPolicyPath,
  "utf8",
);
const profiles = fs.readFileSync(profilePath, "utf8");
const admission = fs.readFileSync(admissionPath, "utf8");

describe(
  "JO third-operator scope, operation, carrier and control matrix v0.1",
  () => {
    it("records a design-only posture", () => {
      expect(report).toContain(
        "Status: `SCOPE_AND_CONTROL_MATRIX_DESIGN_ONLY`",
      );
      expect(report).toContain(
        "`JO_SCOPE_OPERATION_CARRIER_AND_CONTROL_MATRIX_DESIGNED`",
      );
      expect(report).toContain(
        "`JO_SOURCE_ROW_DESIGN_REVIEW`",
      );
      expect(report).toContain(
        "`JO_SOURCE_ROW_OR_RUNTIME_IMPLEMENTATION`",
      );
    });

    it("preserves exact reviewed JO source identity", () => {
      for (const marker of [
        "`JO part.`",
        "`25210`",
        "dictionary/?lemmaid=25210",
        "f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e",
        "`EXACT_ATTESTED_HEADWORD_ARTICLE`",
        "`UNCHANGED_FROM_PR1737_REVIEW`",
        "`JO_PRODUCTION_OR_GOVERNANCE_OWNER=NONE`",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("chooses the smallest proposed functional scope", () => {
      expect(report).toContain(
        "`standalone_refusal_or_explicit_rejection`",
      );
      expect(report).toContain(
        "standalone “no” used as an answer, refusal, rejection, or direct",
      );
      expect(report).toContain(
        "`general_sentence_level_negation`",
      );
      expect(report).toContain(
        "excluded from the proposed v0.1 scope",
      );
    });

    it("proposes exact-only operation and jo-only carrier", () => {
      expect(report).toContain('Proposed effective operation list:');
      expect(report).toContain('- `["exact"]`');
      expect(report).toContain('Proposed carrier list:');
      expect(report).toContain('- `["jo"]`');
      expect(report).toContain(
        "No larger carrier form is admitted by this report",
      );
    });

    it("locks exactly one proposed direct-positive form", () => {
      expect(report).toContain(
        "| `JO-P01` | `jo` | `jo` | `exact` | `jo` | present |",
      );
      expect(report).toContain(
        "The positive matrix contains exactly one direct form",
      );
      expect(report).toContain("- `jo`");
      expect(report).toContain(
        "No larger positive proof word is accepted by this design",
      );
    });

    it("locks PO, DA and DI cross-operator controls", () => {
      for (const marker of [
        "| `JO-N01` | `po` | absent |",
        "| `JO-N02` | `da` | absent |",
        "| `JO-N03` | `di` | absent |",
        "PO affirmative or conjunction material",
        "DA split/divide evidence",
        "DI know/knowledge evidence",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("locks substring, prefix, suffix and separated-letter controls", () => {
      for (const marker of [
        "| `JO-N04` | `major` |",
        "| `JO-N05` | `enjoy` |",
        "| `JO-N06` | `joke` |",
        "| `JO-N07` | `joint` |",
        "| `JO-N08` | `banjo` |",
        "| `JO-N09` | `judo` |",
        "Substring containment is insufficient",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("locks conceptual polarity and broad-negation isolation", () => {
      for (const marker of [
        "`JO-N10`",
        "`JO-N11`",
        "`JO-N12`",
        "Doctrine is not reviewed lexical evidence",
        "Conceptual polarity does not create a production source row",
        "Proposed scope is standalone refusal or explicit rejection",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("locks candidate-specific citation isolation", () => {
      for (const marker of [
        "`JO-C01`",
        "`JO-C02`",
        "`JO-C03`",
        "`JO-C04`",
        "`JO-C05`",
        "`JO-C06`",
        "`JO-C07`",
        "`JO-C08`",
        "`JO-C09`",
        "`JO-C10`",
        "`JO-C11`",
        "Generic DPEWA portal or search page only",
        "PO article or citation supplied for JO",
        "DA citation supplied for JO",
        "DI citation supplied for JO",
        "block and require source-field reassessment",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("defines the future source-row review fields without creating a row", () => {
      for (const marker of [
        "proposed source ID",
        "embryo:",
        "`JO`",
        "language:",
        "`sq`",
        "isolated standalone form:",
        "`jo`",
        "bounded lexical function:",
        "`standalone refusal or explicit rejection`",
        "exact post identifier",
        "reviewed source hash",
        "article authors",
        "review identity",
        "review date",
        "This report does not create that source row",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("requires reusable shared architecture", () => {
      for (const marker of [
        "reviewed source-row registry",
        "evidence validation",
        "functional readiness",
        "machine authorization",
        "production membership",
        "runtime projection",
        "canonical operator profile",
        "evidence-operation policy",
        "carrier policy",
        "profile-backed live smoke",
        "canon-lock admission",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("forbids bespoke JO branching", () => {
      for (const marker of [
        "a bespoke JO RootMap branch",
        "a bespoke JO analyze-v1 branch",
        "a bespoke JO UI branch",
        "a hidden polarity-specific runtime path",
        "a duplicate source registry",
        "a duplicate citation registry",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("keeps DA and DI as the only current canonical owners", () => {
      expect(profiles).toMatch(/operatorId:\s*"DA"/);
      expect(profiles).toMatch(/operatorId:\s*"DI"/);
      expect(profiles).not.toMatch(/operatorId:\s*"JO"/);

      expect(admission).toContain('"DA"');
      expect(admission).toContain('"DI"');
      expect(admission).not.toContain('"JO"');
    });

    it("keeps JO candidate-registered but outside production membership", () => {
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

    it("does not authorize or project JO at runtime", () => {
      expect(runtimeAuthorization).not.toMatch(
        /reviewed\.external\.[^"\n]*jo[^"\n]*candidate/i,
      );
      expect(runtimeProjection).not.toMatch(
        /reviewed\.external\.[^"\n]*jo[^"\n]*candidate/i,
      );
    });

    it("reflects the later reviewed Stage-2 JO exact-only operation and carrier policy", () => {
      expect(operationPolicy).toContain(
        'sourceId: "reviewed.external.jo.refusal.candidate.v0_1"',
      );
      expect(operationPolicy).toMatch(
        /embryo:\s*"JO"/,
      );
      expect(operationPolicy).toContain(
        'allowedEvidenceOps: ["exact"]',
      );
      expect(operationPolicy).toContain(
        'allowedEvidenceCarrierForms: ["jo"]',
      );
    });

    it("preserves claim boundaries and user decision posture", () => {
      for (const marker of [
        "historical origin",
        "historical transmission",
        "borrowing direction",
        "linguistic ownership",
        "winner status",
        "language superiority",
        "scientific proof",
        "publication-grade Open Instrument proof",
        "candidate truth",
        "general grammatical-negation ownership",
        "`user_decides`",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("keeps source-row and runtime work explicitly unauthorized", () => {
      for (const marker of [
        "production source-row creation",
        "functional machine authorization",
        "production membership",
        "runtime projection",
        "canonical profile registration",
        "evidence-operation-policy registration",
        "carrier-policy registration",
        "live-smoke registration",
        "canon-lock admission",
        "RootMap modification",
        "analyze-v1 modification",
        "UI modification",
      ]) {
        expect(report).toContain(marker);
      }
    });
  },
);

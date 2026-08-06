import fs from "node:fs";
import path from "node:path";

const DOCUMENT_PATH = path.join(
  process.cwd(),
  "docs/open-instrument/reports/petro-zheji-primary-source-and-symbolic-algorithm-fidelity-baseline-v0.1.md",
);

const documentText = fs.readFileSync(
  DOCUMENT_PATH,
  "utf8",
);

describe(
  "Petro Zheji primary-source and Symbolic Algorithm fidelity baseline milestone v0.1",
  () => {
    it("opens the exact milestone without declaring it complete", () => {
      expect(documentText).toContain(
        "Status: MILESTONE_OPENED.",
      );

      expect(documentText).toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1",
      );

      expect(documentText).toContain(
        "PETRO_ZHEJI_FIDELITY_BASELINE_MILESTONE_OPENED",
      );

      expect(documentText).not.toContain(
        "Status: MILESTONE_CLOSED.",
      );
    });

    it("records the inspected baseline without treating file count as fidelity", () => {
      expect(documentText).toContain(
        "Zheji-named tracked-path count: `175`",
      );

      expect(documentText).toContain(
        "It is not proof that 175 files implement Petro Zheji.",
      );

      expect(documentText).toContain(
        "include every tracked path containing `zheji`, case-insensitively;",
      );

      expect(documentText).toContain(
        "result: `175` tracked paths;",
      );

      expect(documentText).toContain(
        "omitted six",
      );

      expect(documentText).toContain(
        "The current repository therefore lacks the source baseline required to classify existing Zheji-named components as direct implementations.",
      );
    });

    it("requires the complete replay history to be audited without treating it as a primary source", () => {
      for (const requiredText of [
        "original `study.segmentation.003` replay",
        "reinforced `.004` replay",
        "comic generalization replay",
        "limit generalization replay",
        "These artifacts must be audited.",
        "They must not be treated as Petro Zheji primary sources.",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("locks the primary-source hierarchy and bibliography requirements", () => {
      for (const requiredText of [
        "Level 1 — Petro Zheji primary works",
        "Level 2 — Edition and publication records",
        "Level 3 — Serious secondary analysis",
        "Level 4 — General web commentary",
        "Level 5 — Open Instrument internal material",
        "`Shqipja dhe Sanskritishtja`",
        "`Roli Mesianik i Shqipes`",
        "`Libri i Aforizmave`",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("requires page-cited reconstruction of central Petro Zheji concepts", () => {
      for (const requiredText of [
        "`Algoritmi Simbolik`",
        "`Kodi F`",
        "`Kodi E`",
        "`operatorët e lirë`",
        "`çiftet ekuivokale`",
        "Symbolic-figure requirements",
        "Symbolic-equation requirements",
        "Semantic-spectrum requirements",
        "Mythic and cosmogonic requirements",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("locks the provenance classes", () => {
      for (const provenanceClass of [
        "PETRO_ZHEJI_DIRECT",
        "PETRO_ZHEJI_SOURCE_BASED_RECONSTRUCTION",
        "ZHEJI_INSPIRED",
        "ZERO_SEVEN_VOICES_ORIGINAL",
        "OPEN_INSTRUMENT_ORIGINAL",
        "MODEL_HYPOTHESIS",
        "HISTORICAL_LINGUISTICS_CONTEXT",
        "UNKNOWN",
      ]) {
        expect(documentText).toContain(
          provenanceClass,
        );
      }

      expect(documentText).toContain(
        "`PETRO_ZHEJI_DIRECT` requires an exact page-cited primary-source basis.",
      );
    });

    it("separates Petro Zheji, Seven Voices, and Open Instrument engineering", () => {
      for (const requiredText of [
        "Petro Zheji fidelity layer",
        "ZË-RO Seven-Voices layer",
        "Open Instrument evidence layer",
        "These structures must not be attributed directly to Petro Zheji without primary-source evidence.",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("requires a page-cited worked-example corpus and scientific controls", () => {
      expect(documentText).toContain(
        "The v0.1 target is at least `10` complete page-cited examples.",
      );

      for (const requiredText of [
        "blind words",
        "unrelated-language controls",
        "phonetic false-positive controls",
        "substring-force controls",
        "operator ablation",
        "deterministic repetition",
        "Null and unresolved outcomes",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("blocks unsupported attribution and all unauthorized implementation", () => {
      for (const requiredText of [
        "DeepRoot is Petro Zheji's Symbolic Algorithm",
        "Seven Voices was directly defined by Petro Zheji",
        "Albanian primordiality is a platform-established fact",
        "Runtime implementation: not authorized.",
        "API changes: not authorized.",
        "UI changes: not authorized.",
        "Provider or model execution: not authorized.",
        "Zheji replay: not authorized.",
        "Operator promotion: not authorized.",
        "JO, PO, and MAT: not authorized.",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("selects the primary-source inventory and edition-policy design as the only next lane", () => {
      expect(documentText).toContain(
        "`DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_V0_1`",
      );

      expect(documentText).toContain(
        "That next lane is documentation and research design only.",
      );
    });
  },
);

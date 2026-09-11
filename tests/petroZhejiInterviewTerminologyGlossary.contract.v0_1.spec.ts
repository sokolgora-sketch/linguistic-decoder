import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ClaimBoundary = {
  fact: string;
  inference: string;
  unknown: string[];
};

type GlossaryEntry = {
  termId: string;
  originalTerm: string;
  normalizedLabel: string;
  language: string;
  sourceTermStatus: "SOURCE_LANGUAGE_TERM" | "ENGLISH_CONCEPTUAL_LABEL";
  sourceId: string;
  sourceClass: string;
  sourceLocation: string;
  citationStability: string;
  evidenceStatus: string;
  directStatementStatus: string;
  boundedDefinition: string;
  englishExplanation: string;
  claimBoundary: ClaimBoundary;
  bookPageVerificationStatus: string;
  runtimeEquivalenceStatus: string;
  notes: string[];
};

type Glossary = {
  schemaVersion: string;
  status: string;
  parentMilestone: string;
  sourceId: string;
  sourceClass: string;
  citationStability: string;
  completeAlgorithmSpecification: boolean;
  petroZhejiDirectPromotion: boolean;
  claimBoundary: string;
  entries: GlossaryEntry[];
};

type InventoryRecord = {
  sourceId: string;
  sourceClass: string;
  verificationStatus: string;
  citationStability: string;
  editionSelectionRole: string;
};

const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(TEST_DIRECTORY, "..");
const GLOSSARY_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/evidence/petro-zheji-interview-terminology-glossary-v0.1.json",
);
const INVENTORY_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/evidence/petro-zheji-primary-source-inventory-v0.1.json",
);

const glossary = JSON.parse(
  fs.readFileSync(GLOSSARY_PATH, "utf8"),
) as Glossary;
const inventory = JSON.parse(
  fs.readFileSync(INVENTORY_PATH, "utf8"),
) as { records: InventoryRecord[] };

const INTERVIEW_SOURCE_ID = "pz-primary-interview-gjata-mapo-2013-v0.1";
const SOURCE_CLASS = "PETRO_ZHEJI_PRIMARY_INTERVIEW";
const CITATION_STABILITY = "DIGITAL_LOCATION_ONLY";
const BOOK_PENDING = "BOOK_PAGE_VERIFICATION_PENDING";
const RUNTIME_NOT_ESTABLISHED = "NOT_ESTABLISHED";

describe("Petro Zheji interview terminology glossary v0.1", () => {
  it("uses the bounded interview glossary schema and status", () => {
    expect(glossary.schemaVersion).toBe(
      "open-instrument.petro-zheji-interview-terminology-glossary.v0.1",
    );
    expect(glossary.status).toBe("INTERVIEW_GROUNDED_BOOK_PAGE_PENDING");
    expect(glossary.parentMilestone).toBe(
      "PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1",
    );
    expect(glossary.completeAlgorithmSpecification).toBe(false);
    expect(glossary.petroZhejiDirectPromotion).toBe(false);
  });

  it("resolves every entry to the merged interview source", () => {
    const source = inventory.records.find(
      (record) => record.sourceId === INTERVIEW_SOURCE_ID,
    );

    expect(source).toMatchObject({
      sourceId: INTERVIEW_SOURCE_ID,
      sourceClass: SOURCE_CLASS,
      verificationStatus: "CONTENT_LOCATED",
      citationStability: CITATION_STABILITY,
      editionSelectionRole: "REJECTED_FOR_BASELINE",
    });
    expect(glossary.sourceId).toBe(INTERVIEW_SOURCE_ID);
    expect(glossary.sourceClass).toBe(SOURCE_CLASS);
    expect(glossary.citationStability).toBe(CITATION_STABILITY);
    expect(source).toBeDefined();
    expect(
      glossary.entries.every(
        (entry) =>
          entry.sourceId === INTERVIEW_SOURCE_ID &&
          entry.sourceClass === SOURCE_CLASS &&
          entry.citationStability === CITATION_STABILITY,
      ),
    ).toBe(true);
  });

  it("contains the seven bounded interview terms without duplicate IDs", () => {
    expect(glossary.entries).toHaveLength(7);
    expect(
      new Set(glossary.entries.map((entry) => entry.termId)).size,
    ).toBe(glossary.entries.length);
    expect(glossary.entries.map((entry) => entry.termId)).toEqual([
      "PZ-INTERVIEW-GLOSSARY-AS-001",
      "PZ-INTERVIEW-GLOSSARY-E-001",
      "PZ-INTERVIEW-GLOSSARY-F-001",
      "PZ-INTERVIEW-GLOSSARY-THIRD-INCLUDED-001",
      "PZ-INTERVIEW-GLOSSARY-THIRD-EXCLUDED-001",
      "PZ-INTERVIEW-GLOSSARY-EQUATION-001",
      "PZ-INTERVIEW-GLOSSARY-CROSS-LANGUAGE-001",
    ]);
  });

  it("requires fact, inference, unknown, book, and runtime boundaries for every entry", () => {
    for (const entry of glossary.entries) {
      expect(entry.bookPageVerificationStatus).toBe(BOOK_PENDING);
      expect(entry.runtimeEquivalenceStatus).toBe(RUNTIME_NOT_ESTABLISHED);
      expect(entry.claimBoundary.fact).toEqual(expect.any(String));
      expect(entry.claimBoundary.inference).toEqual(expect.any(String));
      expect(entry.claimBoundary.unknown.length).toBeGreaterThan(0);
      expect(entry.notes.length).toBeGreaterThan(0);
    }
  });

  it("preserves the interview-only Algoritmi Simbolik boundary", () => {
    const entry = glossary.entries[0];

    expect(entry.originalTerm).toBe("Algoritmi Simbolik");
    expect(entry.directStatementStatus).toBe("DIRECT_INTERVIEW_STATEMENT");
    expect(entry.boundedDefinition).toContain("inner mathematics of the symbol");
    expect(entry.claimBoundary.unknown.join(" ")).toContain(
      "complete formal algorithm",
    );
    expect(glossary.completeAlgorithmSpecification).toBe(false);
  });

  it("keeps Code E separate from runtime equivalence", () => {
    const entry = glossary.entries[1];

    expect(entry.originalTerm).toBe("Kodi E");
    expect(entry.boundedDefinition).toContain("included third");
    expect(entry.runtimeEquivalenceStatus).toBe(RUNTIME_NOT_ESTABLISHED);
    expect(JSON.stringify(entry)).not.toContain("x = -x");
  });

  it("keeps Code F separate from runtime equivalence", () => {
    const entry = glossary.entries[2];

    expect(entry.originalTerm).toBe("Kodi F");
    expect(entry.boundedDefinition).toContain("excluded third");
    expect(entry.runtimeEquivalenceStatus).toBe(RUNTIME_NOT_ESTABLISHED);
    expect(JSON.stringify(entry)).not.toContain("x = x");
  });

  it("represents included and excluded third as bounded relationships", () => {
    const included = glossary.entries[3];
    const excluded = glossary.entries[4];

    expect(included.normalizedLabel).toBe("Tertium Datur / included third");
    expect(excluded.normalizedLabel).toBe("Tertium Non Datur / excluded third");
    expect(included.directStatementStatus).toBe(
      "BOUNDED_INTERVIEW_RELATIONSHIP",
    );
    expect(excluded.directStatementStatus).toBe(
      "BOUNDED_INTERVIEW_RELATIONSHIP",
    );
    expect(included.claimBoundary.unknown.join(" ")).toContain(
      "formal logical equivalence",
    );
    expect(excluded.claimBoundary.unknown.join(" ")).toContain(
      "formal logical equivalence",
    );
  });

  it("does not present English conceptual labels as source-language terms", () => {
    expect(
      glossary.entries.slice(0, 3).every(
        (entry) =>
          entry.sourceTermStatus === "SOURCE_LANGUAGE_TERM" &&
          entry.language === "Albanian",
      ),
    ).toBe(true);
    expect(
      glossary.entries.slice(3).every(
        (entry) =>
          entry.sourceTermStatus === "ENGLISH_CONCEPTUAL_LABEL" &&
          entry.language === "English",
      ),
    ).toBe(true);
  });

  it("records symbolic equations without inventing a grammar", () => {
    const entry = glossary.entries[5];

    expect(entry.originalTerm).toBe("symbolic equations");
    expect(entry.directStatementStatus).toBe("DIRECT_INTERVIEW_REFERENCE");
    expect(entry.boundedDefinition).toContain("equations");
    expect(entry.claimBoundary.unknown.join(" ")).toContain(
      "formal equation grammar",
    );
  });

  it("records cross-language applicability as a source statement only", () => {
    const entry = glossary.entries[6];

    expect(entry.normalizedLabel).toBe("Applicability beyond Albanian");
    expect(entry.directStatementStatus).toBe("DIRECT_INTERVIEW_STATEMENT");
    expect(entry.boundedDefinition).toContain("other languages");
    expect(entry.claimBoundary.unknown.join(" ")).toContain(
      "empirical validation",
    );
  });

  it("does not include unsupported book-only terminology", () => {
    const serialized = JSON.stringify(glossary);

    expect(serialized).not.toContain("operatorët e lirë");
    expect(serialized).not.toContain("çiftet ekuivokale");
    expect(serialized).not.toContain("semantic spectrum");
    expect(serialized).not.toContain("symbolic figure");
    expect(serialized).not.toContain("mythic mapping");
  });

  it("does not claim page-stable evidence, baseline selection, or direct runtime attribution", () => {
    const serialized = JSON.stringify(glossary);

    expect(serialized).not.toContain("PAGE_STABLE");
    expect(serialized).not.toContain("FIDELITY_BASELINE_SELECTED");
    expect(serialized).not.toContain("PETRO_ZHEJI_DIRECT");
    expect(serialized).not.toContain("VERIFIED_PETRO_ZHEJI_ALGORITHM");
    expect(serialized).not.toContain("FIDELITY_COMPLETE");
  });

  it("keeps the parent milestone open and inventory counts unchanged", () => {
    expect(glossary.status).toBe("INTERVIEW_GROUNDED_BOOK_PAGE_PENDING");
    expect(inventory.records).toHaveLength(5);
    expect(
      inventory.records.filter(
        (record) => record.verificationStatus === "PAGE_CITATION_REVIEWED",
      ),
    ).toHaveLength(0);
    expect(
      inventory.records.filter(
        (record) =>
          record.sourceClass === "PETRO_ZHEJI_PRIMARY_PUBLISHED_WORK" ||
          record.sourceClass === "PETRO_ZHEJI_PRIMARY_ARTICLE_OR_MANUSCRIPT",
      ),
    ).toHaveLength(0);
  });
});

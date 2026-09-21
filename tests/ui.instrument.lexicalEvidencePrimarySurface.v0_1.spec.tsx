/** @jest-environment jsdom */

import { readFileSync } from "node:fs";

import React from "react";
import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { buildCandidateRowsFromVM } from "../src/ui/candidates/candidateModel";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";
import { EmbryoExpansionContextCardV0_1 } from "../src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";

type AnyRecord = Record<string, any>;

const baselineManifest = JSON.parse(
  readFileSync(
    "tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json",
    "utf8",
  ),
) as { cases: AnyRecord[] };

afterEach(() => {
  cleanup();
});

async function analyze(input: AnyRecord): Promise<AnyRecord> {
  const params = new URLSearchParams({
    word: input.word,
    mode: input.mode,
    alphabet: input.alphabet,
  });

  if (typeof input.targetSenseId === "string") {
    params.set("targetSenseId", input.targetSenseId);
  }

  if (typeof input.targetSenseLabel === "string") {
    params.set("targetSenseLabel", input.targetSenseLabel);
  }

  const response = await GET(
    new Request(`http://localhost/api/analyze-v1?${params.toString()}`),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function renderCard(body: AnyRecord) {
  const vm = adaptAnalysisToTelemetryVM(body);

  render(
    <EmbryoExpansionContextCardV0_1
      vm={vm}
      showPrimaryEvidence
    />,
  );

  return vm;
}

describe("Open Instrument lexical evidence primary surface v0.1", () => {
  it("surfaces lexical evidence beside Null without changing the analytical status", async () => {
    const body = await analyze({
      word: "rain",
      mode: "strict",
      alphabet: "auto",
    });

    const vm = adaptAnalysisToTelemetryVM(body);

    render(<InstrumentPanel payload={body} />);

    expect(body.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(screen.getAllByTestId("functional-motivation-card")).toHaveLength(2);

    const lexical = screen.getByTestId("lexical-source-evidence-primary");
    expect(lexical).toHaveTextContent("Lexical source evidence");
    expect(lexical).toHaveTextContent("Source form: shi");
    expect(lexical).toHaveTextContent(
      "Source meaning: rain; atmospheric precipitation falling as drops",
    );
    expect(lexical).toHaveTextContent("Evidence sources");
    expect(lexical).toHaveTextContent(
      "Ref: research.external.fjale-shi-rain.scale50.citation.v0_1",
    );
    expect(lexical).toHaveTextContent(
      "This is lexical evidence, not functional motivation or historical origin.",
    );
    expect(vm.candidates.some((candidate) =>
      candidate.evidenceBasis?.kind === "present" &&
      candidate.evidenceBasis.value === "functional_correspondence",
    )).toBe(false);
  });

  it("surfaces lexical evidence beside a structural-unreviewed result without promoting it", async () => {
    const body = await analyze({
      word: "sea",
      mode: "strict",
      alphabet: "auto",
    });

    renderCard(body);

    expect(body.analysisStatusV0_1.status).toBe("structural_unreviewed");
    const lexical = screen.getByTestId("lexical-source-evidence-primary");
    expect(lexical).toHaveTextContent("Source form: det");
    expect(lexical).toHaveTextContent("Source form: mare");
    expect(screen.queryByText("Research functional hypothesis")).not.toBeInTheDocument();
    expect(screen.getByText("No supported functional candidate yet.")).toBeInTheDocument();
  });

  it("surfaces target-bound lexical evidence for candle while preserving the structural result", async () => {
    const body = await analyze({
      word: "candle",
      mode: "strict",
      alphabet: "auto",
      targetSenseLabel: "a wax light source",
    });

    renderCard(body);

    expect(body.analysisStatusV0_1.status).toBe("structural_unreviewed");
    const lexical = screen.getByTestId("lexical-source-evidence-primary");
    expect(lexical).toHaveTextContent("Source form: QIRI");
    expect(lexical).toHaveTextContent("Source form: candēla");
    expect(lexical).not.toHaveTextContent(/functional correspondence/i);
  });

  it("does not create a lexical block when the result has no evidence", async () => {
    const body = await analyze({
      word: "xyz",
      mode: "strict",
      alphabet: "auto",
    });

    renderCard(body);

    expect(body.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(screen.queryByTestId("lexical-source-evidence-primary")).not.toBeInTheDocument();
  });

  it("leaves reviewed functional presentation intact and does not relabel it as lexical-only", async () => {
    const body = await analyze({
      word: "study",
      mode: "strict",
      alphabet: "auto",
    });

    renderCard(body);

    expect(body.analysisStatusV0_1.status).toBe("reviewed_functional_evidence");
    expect(screen.getByText("Evidence: Reviewed")).toBeInTheDocument();
    expect(screen.queryByTestId("lexical-source-evidence-primary")).not.toBeInTheDocument();
    expect(screen.getByText(/Functional motivation, not historical etymology\./)).toBeInTheDocument();
  });

  it("deduplicates a repeated lexical evidence reference in the primary surface", async () => {
    const body = await analyze({
      word: "rain",
      mode: "strict",
      alphabet: "auto",
    });
    const lexicalCandidate = body.candidates[0];

    const duplicateBody = {
      ...body,
      candidates: [
        lexicalCandidate,
        {
          ...lexicalCandidate,
          candidateId: "duplicate-lexical-candidate",
          id: "duplicate-lexical-candidate",
        },
      ],
    };

    renderCard(duplicateBody);

    expect(screen.getAllByText("Source form: shi")).toHaveLength(1);
    expect(screen.getAllByText(
      "Ref: research.external.fjale-shi-rain.scale50.citation.v0_1",
    )).toHaveLength(1);
  });

  it("reconciles primary lexical-surface eligibility and visibility across the baseline cohort", async () => {
    let totalCasesWithEvidenceRefs = 0;
    let totalCasesWithLexicalEquivalenceEvidence = 0;
    let totalEligibleForPrimaryLexicalBlock = 0;
    let totalPrimaryLexicalBlockVisible = 0;

    for (const input of baselineManifest.cases) {
      const body = await analyze(input);
      const vm = adaptAnalysisToTelemetryVM(body);
      const rows = buildCandidateRowsFromVM(vm);
      const casesWithRefs = rows.some((row) =>
        Array.isArray(row.evidenceRefs) && row.evidenceRefs.length > 0,
      );
      const lexicalRows = rows.filter((row) =>
        row.evidenceBasis === "lexical_equivalence" &&
        Array.isArray(row.evidenceRefs) &&
        row.evidenceRefs.length > 0,
      );

      if (casesWithRefs) totalCasesWithEvidenceRefs += 1;
      if (lexicalRows.length > 0) {
        totalCasesWithLexicalEquivalenceEvidence += 1;
        totalEligibleForPrimaryLexicalBlock += 1;
      }

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
          showPrimaryEvidence
        />,
      );

      const visible = Boolean(
        screen.queryByTestId("lexical-source-evidence-primary"),
      );
      if (visible) totalPrimaryLexicalBlockVisible += 1;
      cleanup();
    }

    expect(totalCasesWithEvidenceRefs).toBe(44);
    expect(totalCasesWithLexicalEquivalenceEvidence).toBeGreaterThan(0);
    expect(totalPrimaryLexicalBlockVisible).toBe(totalEligibleForPrimaryLexicalBlock);

    console.log(
      JSON.stringify({
        TOTAL_BASELINE_CASES_WITH_EVIDENCE_REFS: totalCasesWithEvidenceRefs,
        TOTAL_CASES_WITH_LEXICAL_EQUIVALENCE_EVIDENCE:
          totalCasesWithLexicalEquivalenceEvidence,
        TOTAL_ELIGIBLE_FOR_PRIMARY_LEXICAL_BLOCK:
          totalEligibleForPrimaryLexicalBlock,
        TOTAL_PRIMARY_LEXICAL_BLOCK_VISIBLE:
          totalPrimaryLexicalBlockVisible,
      }),
    );
  });
});

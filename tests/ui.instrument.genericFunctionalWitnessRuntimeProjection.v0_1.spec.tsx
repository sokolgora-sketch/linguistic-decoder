/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { EmbryoExpansionContextCardV0_1 } from "../src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";
import {
  buildGenericFunctionalWitnessRuntimeProjectionV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessRuntimeProjection.v1";

async function analyze(word: string): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("Lane 4 witness presentation", () => {
  it("keeps a generic doctrinal reading visible with Evidence Null", async () => {
    const body = await analyze("banana");
    const vm = adaptAnalysisToTelemetryVM(body);

    render(
      <EmbryoExpansionContextCardV0_1
        vm={vm}
        showPrimaryEvidence
      />,
    );

    expect(screen.getByText("Seven-Voices doctrinal reading")).toBeInTheDocument();
    expect(screen.getByText("Functional witnesses")).toBeInTheDocument();
    expect(
      screen.getByText(
        "No external evidence was found for this embryo. The doctrinal reading remains separate from this Evidence Null.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("No supported functional candidate yet.")).not.toBeInTheDocument();
  });

  it("renders a source witness and UNKNOWN correspondence without upgrading it", async () => {
    const body = await analyze("banana");
    const generic = body.candidates.find(
      (candidate: any) => candidate?.claimType === "genericFunctionalHypothesis",
    );
    expect(generic).toBeTruthy();

    generic.genericFunctionalWitnessRuntimeProjectionV1 =
      buildGenericFunctionalWitnessRuntimeProjectionV1(
        {
          targetWord: "banana",
          structuralHypothesis: {
            hypothesisId: "logic-structural:banana:SHI:fixture",
            embryo: "SHI",
          } as any,
        },
        [
          {
            adapterId: "fixture.source",
            query(input) {
              return {
                ok: true,
                records:
                  input.embryo === "SHI"
                    ? [
                        {
                          queryForm: "SHI",
                          sourceId: "fixture.shi",
                          evidenceFamily: "lexical_dictionary",
                          language: "Albanian",
                          languageVariety: "Gheg",
                          sourceForm: "shi",
                          sourceFormNormalization: "EXACT_PRESERVED",
                          gloss: "fixture source gloss",
                          citationRefs: ["fixture.shi.citation"],
                          embryoRelation: "exact_form",
                          relationOperationIds: ["fixture_exact_form"],
                          attestationTruth: "fact",
                          sourceStatus: "research_candidate",
                          sourceProvenance: {
                            sourceRecordId: "fixture.shi",
                            sourceTraditionId: "fixture.tradition",
                            sourceTitle: "Fixture source",
                            sourceDateOrVersion: "fixture v1",
                            sourceUrlOrArchiveRef: "fixture://shi",
                            entryLocator: "SHI",
                            sourceHashOrArchiveHash: null,
                            languageVariety: "Gheg",
                          },
                        },
                        {
                          queryForm: "SHI",
                          sourceId: "fixture.shi.second",
                          evidenceFamily: "dialect_lexicon",
                          language: "Albanian",
                          languageVariety: "Tosk",
                          sourceForm: "shia",
                          sourceFormNormalization: "EXACT_PRESERVED",
                          gloss: "second fixture source gloss",
                          citationRefs: ["fixture.shi.second.citation"],
                          embryoRelation: "exact_form",
                          relationOperationIds: ["fixture_exact_form_second"],
                          attestationTruth: "fact",
                          sourceStatus: "research_candidate",
                          sourceProvenance: {
                            sourceRecordId: "fixture.shi.second",
                            sourceTraditionId: "fixture.tradition.second",
                            sourceTitle: "Second fixture source",
                            sourceDateOrVersion: "fixture v1",
                            sourceUrlOrArchiveRef: "fixture://shia",
                            entryLocator: "SHIA",
                            sourceHashOrArchiveHash: null,
                            languageVariety: "Tosk",
                          },
                        },
                      ]
                    : [],
              };
            },
          },
        ],
      );

    const vm = adaptAnalysisToTelemetryVM(body);
    render(
      <EmbryoExpansionContextCardV0_1
        vm={vm}
        showPrimaryEvidence
      />,
    );

    expect(screen.getByText("Functional witnesses")).toBeInTheDocument();
    expect(screen.getByText("shi")).toBeInTheDocument();
    expect(screen.getByText("shia")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Functional correspondence: Unknown \/ unresolved/),
    ).toHaveLength(2);
    expect(screen.getAllByText(/Historical relation: Not claimed\./)).toHaveLength(2);
    expect(screen.getByText("No single witness is selected. User decides.")).toBeInTheDocument();
    expect(screen.queryByText(/comes from|proves|true root/i)).not.toBeInTheDocument();
  });

  it.each(["pater", "mater"])(
    "renders the reviewed AT witness for natural %s input",
    async (word) => {
      const vm = adaptAnalysisToTelemetryVM(await analyze(word));

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
          showPrimaryEvidence
        />,
      );

      const witness = screen
        .getAllByTestId("generic-functional-witness")
        .find((element) => element.textContent?.includes("at"));

      expect(witness).toBeDefined();
      expect(witness).toHaveTextContent("at");
      expect(witness).toHaveTextContent("The Albanian inherited lexicon");
      expect(witness).toHaveTextContent(
        "Functional correspondence: Unknown / unresolved",
      );
      expect(witness).toHaveTextContent("Historical relation: Not claimed.");
      expect(witness).not.toHaveTextContent(/comes from|proves|winner/i);
    },
  );

  it("renders a non-primary witness under its owning structural candidate", async () => {
    const body = await analyze("bamoar");
    const amoCandidate = body.candidates.find(
      (candidate: any) =>
        candidate?.embryo === "AMO" &&
        candidate?.genericFunctionalWitnessRuntimeProjectionV1?.discovery
          ?.matches?.some((match: any) => match?.sourceForm === "amo"),
    );

    expect(amoCandidate).toBeTruthy();

    const vm = adaptAnalysisToTelemetryVM(body);
    render(
      <EmbryoExpansionContextCardV0_1
        vm={vm}
        showPrimaryEvidence
      />,
    );

    const secondary = screen.getByTestId(
      "non-primary-generic-functional-witnesses",
    );
    expect(secondary).toHaveTextContent("Structural candidate: AMO");
    expect(secondary).toHaveTextContent("amo");
    expect(secondary).toHaveTextContent("Lewis and Short Latin Dictionary");
    expect(secondary).toHaveTextContent(
      "Functional correspondence: Unknown / unresolved",
    );
    expect(secondary).toHaveTextContent("Historical relation: Not claimed.");
    expect(secondary).toHaveTextContent("No single witness is selected. User decides.");

    const primary = screen.getByTestId("functional-motivation-card");
    expect(primary).toHaveTextContent("Candidate");
    expect(primary.textContent).toContain("A");
  });

  it("preserves the existing Structural Null presentation", async () => {
    const vm = adaptAnalysisToTelemetryVM(await analyze("xyz"));

    render(
      <EmbryoExpansionContextCardV0_1
        vm={vm}
        showPrimaryEvidence
      />,
    );

    expect(screen.getByText("No supported functional candidate yet.")).toBeInTheDocument();
    expect(screen.queryByText("Functional witnesses")).not.toBeInTheDocument();
  });

  it("does not regress reviewed, research, or canonical Voice behavior", async () => {
    const study = adaptAnalysisToTelemetryVM(await analyze("study"));
    const sterile = adaptAnalysisToTelemetryVM(await analyze("sterile"));
    const myself = adaptAnalysisToTelemetryVM(await analyze("myself"));

    expect(study.candidates.some((candidate) =>
      candidate.claimType?.kind === "present" &&
      candidate.claimType.value === "functionalMotivation",
    )).toBe(true);
    expect(sterile.candidates.some((candidate) =>
      candidate.sourceKind?.kind === "present" &&
      candidate.sourceKind.value === "multi_source_research_witness",
    )).toBe(true);
    expect(myself.candidates.some((candidate) =>
      candidate.functionalComponents?.kind === "present" &&
      candidate.functionalComponents.value.some((component) =>
        component.embryo === "Y",
      ),
    )).toBe(true);
  });
});

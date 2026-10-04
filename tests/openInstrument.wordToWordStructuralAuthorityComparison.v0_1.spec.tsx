require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import {
  comparisonEmptyValidV0_1,
  comparisonMissingV0_1,
  comparisonNotApplicableV0_1,
  comparisonNullV0_1,
  comparisonUnsupportedV0_1,
  comparisonValueV0_1,
  compareTelemetryViewModelsV0_1,
  deriveComparisonRelationV0_1,
} from "../src/ui/instrument/wordToWordComparison.v0_1";
import { WordToWordStructuralAuthorityComparisonCard } from "../src/ui/instrument/sections/WordToWordStructuralAuthorityComparisonCard.v0_1";

async function analyze(word: string): Promise<any> {
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);
  expect(response.status).toBe(200);
  return response.json();
}

function rowById(projection: ReturnType<typeof compareTelemetryViewModelsV0_1>, id: string) {
  const row = projection.rows.find((candidate) => candidate.id === id);
  expect(row).toBeDefined();
  return row!;
}

describe("word-to-word structural and authority comparison v0.1", () => {
  test("derives the complete frozen state matrix without collapsing side state", () => {
    expect(deriveComparisonRelationV0_1(comparisonValueV0_1(1), comparisonValueV0_1(1))).toBe("EQUAL");
    expect(deriveComparisonRelationV0_1(comparisonValueV0_1(1), comparisonValueV0_1(2))).toBe("DIFFERENT");
    expect(deriveComparisonRelationV0_1(comparisonValueV0_1("left"), comparisonMissingV0_1())).toBe("LEFT_ONLY");
    expect(deriveComparisonRelationV0_1(comparisonMissingV0_1(), comparisonValueV0_1("right"))).toBe("RIGHT_ONLY");
    expect(deriveComparisonRelationV0_1(comparisonMissingV0_1(), comparisonMissingV0_1())).toBe("BOTH_NULL");

    const sameReason = deriveComparisonRelationV0_1(comparisonNullV0_1("A"), comparisonNullV0_1("A"));
    const differentReason = deriveComparisonRelationV0_1(comparisonNullV0_1("A"), comparisonNullV0_1("B"));
    expect(sameReason).toBe("BOTH_NULL");
    expect(differentReason).toBe("BOTH_NULL");
    expect(comparisonNullV0_1("A").reason).toBe("A");
    expect(comparisonNullV0_1("B").reason).toBe("B");

    expect(deriveComparisonRelationV0_1(comparisonNullV0_1("A"), comparisonMissingV0_1())).toBe("BOTH_NULL");
    expect(deriveComparisonRelationV0_1(comparisonMissingV0_1(), comparisonNullV0_1("A"))).toBe("BOTH_NULL");
    expect(deriveComparisonRelationV0_1(comparisonEmptyValidV0_1([]), comparisonEmptyValidV0_1([]))).toBe("EQUAL");
    expect(deriveComparisonRelationV0_1(comparisonUnsupportedV0_1(), comparisonUnsupportedV0_1())).toBe("BOTH_NULL");
    expect(deriveComparisonRelationV0_1(comparisonNotApplicableV0_1(), comparisonNotApplicableV0_1())).toBe("BOTH_NULL");
    expect(deriveComparisonRelationV0_1(comparisonUnsupportedV0_1(), comparisonNotApplicableV0_1())).toBe("BOTH_NULL");
    expect(deriveComparisonRelationV0_1(comparisonNotApplicableV0_1(), comparisonUnsupportedV0_1())).toBe("BOTH_NULL");

    expect(comparisonValueV0_1(0).state).toBe("VALUE");
    expect(comparisonValueV0_1("").state).toBe("VALUE");
  });

  test("compares current control words without semantic interpretation", async () => {
    const stone = adaptAnalysisToTelemetryVM(await analyze("stone"));
    const home = adaptAnalysisToTelemetryVM(await analyze("home"));
    const make = adaptAnalysisToTelemetryVM(await analyze("make"));
    const name = adaptAnalysisToTelemetryVM(await analyze("name"));
    const study = adaptAnalysisToTelemetryVM(await analyze("study"));
    const missing = adaptAnalysisToTelemetryVM(await analyze("zzzzzz-v0-1-missing"));

    const stoneHome = compareTelemetryViewModelsV0_1(stone, home);
    expect(rowById(stoneHome, "voicePath")).toMatchObject({ relation: "EQUAL" });
    expect(rowById(stoneHome, "voicePath")?.left.value).toEqual(["O", "U"]);
    expect(rowById(stoneHome, "voicePath")?.right.value).toEqual(["O", "U"]);
    expect(stoneHome.rows.find((row) => row.id.endsWith(":gamma"))?.relation).toBe("DIFFERENT");

    const makeName = compareTelemetryViewModelsV0_1(make, name);
    expect(rowById(makeName, "voicePath")).toMatchObject({ relation: "EQUAL" });
    expect(makeName.rows.find((row) => row.id.endsWith(":gamma"))?.relation).toBe("DIFFERENT");

    const studyStone = compareTelemetryViewModelsV0_1(study, stone);
    expect(rowById(studyStone, "functionalStatus").left.state).toBe("VALUE");
    expect(rowById(studyStone, "functionalStatus").right.state).toBe("NULL");
    expect(rowById(studyStone, "functionalEvidenceRefs").left.value).not.toEqual(
      rowById(studyStone, "functionalEvidenceRefs").right.value,
    );

    const validNull = compareTelemetryViewModelsV0_1(stone, missing);
    expect(rowById(validNull, "spokenPronunciation").left.state).toBe("VALUE");
    expect(rowById(validNull, "spokenPronunciation").right.state).toBe("NULL");
    expect(rowById(validNull, "spokenPronunciation").right.reason).toBe("PRONUNCIATION_NOT_FOUND");
    expect(rowById(validNull, "voicePath").right.state).toBe("MISSING");
    expect(validNull.rows.some((row) => /similar|winner|score|rank/i.test(row.label))).toBe(false);
  });

  test("renders an additive two-result workflow with the claim boundary", async () => {
    const stone = adaptAnalysisToTelemetryVM(await analyze("stone"));
    const home = adaptAnalysisToTelemetryVM(await analyze("home"));

    const view = render(<WordToWordStructuralAuthorityComparisonCard current={stone} />);
    fireEvent.click(screen.getByRole("button", { name: "Use current as LEFT" }));
    view.rerender(<WordToWordStructuralAuthorityComparisonCard current={home} />);
    fireEvent.click(screen.getByRole("button", { name: "Use current as RIGHT" }));

    const card = screen.getByTestId("word-to-word-comparison");
    expect(within(card).getByTestId("comparison-slot-left")).toHaveTextContent("stone");
    expect(within(card).getByTestId("comparison-slot-right")).toHaveTextContent("home");
    expect(within(card).getByTestId("comparison-row-voicePath")).toHaveTextContent("EQUAL");
    expect(within(card).getByText(/does not assign semantic meaning/i)).toBeVisible();
    expect(within(card).getByTestId("word-comparison-rows")).not.toHaveTextContent(/similarity|winner|ranking|score/i);
  });
});

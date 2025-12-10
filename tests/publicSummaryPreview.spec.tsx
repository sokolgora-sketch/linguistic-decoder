import React from "react";
import { render, screen } from "@testing-library/react";
import { PublicSummaryPreview } from "@/components/PublicSummaryPreview";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import { buildPublicSummarySnippet } from "@/lib/shareSnippetPublic";

jest.mock("@/lib/shareSnippetPublic", () => ({
  buildPublicSummarySnippet: jest.fn().mockReturnValue("Word: test\nEngine: Test Engine"),
}));

const mockedBuild = buildPublicSummarySnippet as jest.Mock;

function makeResult(): AnalyzeWordResultUI {
  return {
    // minimal shape for the preview
    word: "test",
  } as unknown as AnalyzeWordResultUI;
}

describe("PublicSummaryPreview", () => {
  it("renders nothing when there is no result", () => {
    const { container } = render(<PublicSummaryPreview result={null} />);
    expect(container.textContent).toBe("");
  });

  it("renders the public summary when result is present", () => {
    mockedBuild.mockReturnValueOnce("Word: test\nEngine: Test Engine");

    render(<PublicSummaryPreview result={makeResult()} />);

    expect(buildPublicSummarySnippet).toHaveBeenCalled();

    // If these are missing, getByText will throw and the test will fail.
    screen.getByText(/Public summary preview/);
    screen.getByText(/Word: test/);
    screen.getByText(/Engine: Test Engine/);
  });
});
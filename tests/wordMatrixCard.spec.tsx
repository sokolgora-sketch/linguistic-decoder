import React from "react";
import { render, screen } from "@testing-library/react";

import WordMatrixCard, {
  WordMatrixSummary,
} from "../src/components/WordMatrixCard";

describe("WordMatrixCard", () => {
  it("renders nothing when summary is null", () => {
    const { container } = render(<WordMatrixCard summary={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the word and the entries", () => {
    const summary: WordMatrixSummary = {
      word: "study",
      entries: [
        { label: "Root", value: "STU" },
        { label: "Path", value: "U → I" },
      ],
    };

    render(<WordMatrixCard summary={summary} />);

    // title
    expect(screen.getByText("Word Matrix")).toBeInTheDocument();
    // word
    expect(screen.getByText("study")).toBeInTheDocument();
    // at least one row
    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.getByText("STU")).toBeInTheDocument();
  });
});
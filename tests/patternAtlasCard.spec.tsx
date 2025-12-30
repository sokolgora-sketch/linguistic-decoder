import React from "react";
import { render, screen } from "@testing-library/react";
import PatternAtlasCard from "@/components/PatternAtlasCard";

describe("PatternAtlasCard", () => {
  it("renders the atlas card for a valid path", () => {
    render(<PatternAtlasCard voicePath="O → E" />);
    expect(screen.getByText("Pattern Atlas (v1)")).toBeInTheDocument();
    expect(screen.getByText("O → E")).toBeInTheDocument();
    expect(screen.getByText("centrifugal")).toBeInTheDocument();
    expect(screen.getByText(/Moves centrifugal/i)).toBeInTheDocument();
  });
});

import { fireEvent, screen } from "@testing-library/react";

export function openInstrumentOverviewDetails(): void {
  const details = screen.getByTestId("instrument-tab-details-overview");
  if (details.hasAttribute("open")) return;
  const summary = details.querySelector("summary");
  if (!summary) throw new Error("Overview disclosure summary is missing");
  fireEvent.click(summary);
}

import { fireEvent, screen, within } from "@testing-library/react";

export function openInstrumentOverviewDetails(): void {
  const details = screen.getByTestId("instrument-tab-details-overview");
  if (details.hasAttribute("open")) return;
  fireEvent.click(within(details).getByText("More overview, sources, and analysis"));
}

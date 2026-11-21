import { humanReadableStatusLabelV0_1 } from "@/ui/instrument/sections/humanReadableStatusLabel.v0_1";

describe("human-readable research status labels", () => {
  it.each([
    ["UNKNOWN_OR_NULL", "Not established"],
    ["PARTIAL_NULL", "Explanation incomplete"],
    ["SOURCE_FACT", "Source-reported evidence"],
    ["USER_PROPOSED", "Proposed; not source-reported"],
    ["USER_PROPOSAL", "Your proposal"],
    ["CITATION_ENTERED_UNVERIFIED", "Citation not independently verified"],
    ["EXPLORATORY_HYPOTHESIS", "Exploratory proposal"],
    ["no_single_winner", "No option is selected automatically"],
    ["user_decides", "You decide"],
  ])("presents %s as plain language without mutating its contract value", (status, expected) => {
    expect(humanReadableStatusLabelV0_1(status)).toBe(expected);
  });

  it("keeps readable non-code labels and uses a plain fallback", () => {
    expect(humanReadableStatusLabelV0_1("source response available")).toBe("source response available");
    expect(humanReadableStatusLabelV0_1(null, "No record supplied")).toBe("No record supplied");
  });
});

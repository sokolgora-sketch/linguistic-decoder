import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ZroChatPage from "@/components/ZroChatPage";

const SUCCESS_PAYLOAD = {
  word: "study",
  engineVersion: "0.2.0-symbolic",
  primaryPath: { voicePath: ["U", "I"], ringPath: [1, 1], levelPath: [], ops: [] },
  evidence: {},
  candidates: [],
  rootMap: { tokens: [], keys: [], carriers: [], spans: [], composedMeaning: "" },
  originClaim: {
    policy: "no_single_winner",
    gatesActive: false,
    summary: { confidence: "weak", note: "test payload" },
    candidates: [],
  },
};

function countAnalyzeV1Fetches(): number {
  return (global.fetch as jest.Mock).mock.calls.filter(
    ([input]) => String(input).includes("/api/analyze-v1?")
  ).length;
}

describe("/chat submit empty-state transition contract", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("replaces the empty state with instrument result state after the first successful analyze run", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => SUCCESS_PAYLOAD,
    } as any);

    render(<ZroChatPage />);

    expect(screen.getByText("Analyze one word")).toBeInTheDocument();
    expect(screen.queryByTestId("open-instrument-shell")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Analyze" })).toHaveAttribute("aria-busy", "false");
    });

    await screen.findByTestId("open-instrument-shell");

    expect(screen.queryByText("Analyze one word")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(countAnalyzeV1Fetches()).toBe(1);
  });

  it("keeps the empty state visible when submit is attempted with blank input and does not call fetch", async () => {
    global.fetch = jest.fn();

    render(<ZroChatPage />);

    expect(screen.getByText("Analyze one word")).toBeInTheDocument();
    expect(screen.queryByTestId("open-instrument-shell")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByRole("alert");
    expect(screen.getByText("Type a word before analyzing.")).toBeInTheDocument();

    expect(screen.getByText("Analyze one word")).toBeInTheDocument();
    expect(screen.queryByTestId("open-instrument-shell")).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

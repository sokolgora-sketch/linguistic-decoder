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

describe("/chat retry-after-error contract", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("clears the visible error banner and renders result state when a retry succeeds after an HTTP failure", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ error: "boom" }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => SUCCESS_PAYLOAD,
      } as any);

    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByText("Engine error.");
    expect(screen.getByTestId("open-instrument-shell")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    await screen.findByTestId("open-instrument-shell");
    expect(screen.queryByText("Engine error.")).not.toBeInTheDocument();
    expect(screen.queryByText("Open Instrument ready")).not.toBeInTheDocument();

    expect(countAnalyzeV1Fetches()).toBe(2);
  });

  it("clears the visible error banner and renders result state when a retry succeeds after a thrown network failure", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("socket hang up"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => SUCCESS_PAYLOAD,
      } as any);

    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByText("Network error.");
    expect(screen.queryByTestId("open-instrument-shell")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    await screen.findByTestId("open-instrument-shell");
    expect(screen.queryByText("Network error.")).not.toBeInTheDocument();
    expect(screen.queryByText("Open Instrument ready")).not.toBeInTheDocument();

    expect(countAnalyzeV1Fetches()).toBe(2);
  });
});

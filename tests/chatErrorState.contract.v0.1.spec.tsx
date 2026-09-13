import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ZroChatPage from "@/components/ZroChatPage";

describe("/chat error-state contract", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    {
      reason: "MISSING_WORD",
      error: 'Missing "word" query param. Use: /api/analyze-v1?word=study',
    },
    {
      reason: "INVALID_MODE",
      error: 'Invalid "mode". Expected: "strict" or "open".',
    },
    {
      reason: "INVALID_ALPHABET",
      error:
        'Invalid "alphabet". Expected one of: "auto", "albanian", "latin", "sanskrit", "ancient_greek", "pie", "turkish", "german".',
    },
    {
      reason: "INVALID_REQUEST_BODY",
      error: 'Missing/invalid "word". Expected: { word: string }',
    },
    {
      reason: "MALFORMED_JSON",
      error:
        'Invalid JSON body. Expected: { word: string, mode?: "strict"|"open", alphabet?: string }',
    },
  ])(
    "surfaces the structured $reason request error without rendering it as analysis",
    async ({ reason, error }) => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({
          error,
          reason,
          issues: [{ path: ["word"], message: "internal detail" }],
        }),
      } as any);

      render(<ZroChatPage />);

      fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
      fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(`Request error: ${error}`);
      expect(screen.queryByText("Engine error.")).not.toBeInTheDocument();
      expect(screen.getByText("Analyze one word")).toBeInTheDocument();
      expect(screen.queryByTestId("open-instrument-shell")).not.toBeInTheDocument();
    },
  );

  it("surfaces Engine error on non-ok HTTP responses and clears busy state", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ error: "boom" }),
    } as any);

    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");

    await screen.findByText("Engine error.");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Analyze" })).toHaveAttribute("aria-busy", "false");
    });

    expect(screen.getByLabelText("Word")).not.toBeDisabled();
    expect(screen.getByLabelText("IPA")).not.toBeDisabled();
  });

  it("surfaces Network error on thrown fetch failures and clears busy state", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("socket hang up"));

    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");

    await screen.findByText("Network error.");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Analyze" })).toHaveAttribute("aria-busy", "false");
    });

    expect(screen.getByLabelText("Word")).not.toBeDisabled();
    expect(screen.getByLabelText("IPA")).not.toBeDisabled();
  });
});

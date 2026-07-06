import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ZroChatPage from "@/components/ZroChatPage";

describe("/chat error-state contract", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

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

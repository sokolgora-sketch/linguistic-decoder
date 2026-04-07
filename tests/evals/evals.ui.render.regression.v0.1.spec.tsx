import { describe, it, expect } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

function getModeSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[0] as HTMLSelectElement;
}

function getTaskSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[1] as HTMLSelectElement;
}

function forceOpenDetails(summaryText: string) {
  const summary = screen.getByText(summaryText).closest("summary");
  if (!summary) throw new Error(`Missing summary for: ${summaryText}`);

  const details = summary.closest("details");
  if (!details) throw new Error(`Missing details for: ${summaryText}`);

  details.setAttribute("open", "");
}

function getDetailsBySummaryText(summaryText: string): HTMLDetailsElement {
  const summary = screen.getByText(summaryText).closest("summary");
  if (!summary) throw new Error(`Missing summary for: ${summaryText}`);

  const details = summary.closest("details");
  if (!details) throw new Error(`Missing details for: ${summaryText}`);

  return details as HTMLDetailsElement;
}

describe("Evals UI rendered mode regression v0.1", () => {
  it("defaults to full run bundle mode with collapsed upstream provenance", () => {
    render(<EvalsPageClientV0_1 />);

    expect(getModeSelect()).toHaveValue("run_bundle");
    expect(getTaskSelect()).toBeDisabled();
      expect(
        screen.getByText("Public beta — bring model outputs, not prompts")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Use this page to score model-generated ladder or evalRun JSON against ZË-RO's deterministic eval instrument."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Accepted input")).toBeInTheDocument();
      expect(screen.getByText("Privacy")).toBeInTheDocument();
      expect(screen.getByText("Workflow")).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "Help" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: /Report feedback/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Copy page link" })
        ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Task comes from bundle. This selector is only used when wrapping buckets-only JSON."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("TASK PROMPT — USED ONLY FOR BUCKETS-ONLY MODE")
    ).toBeInTheDocument();

    forceOpenDetails("TASK PROMPT — USED ONLY FOR BUCKETS-ONLY MODE");
    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled();

    expect(
      screen.getByText(
        "Full run bundle mode expects task provenance to come from the uploaded evalRun.v0.1 bundle. Switch to Buckets only mode to copy a ZË-RO task prompt."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Run metadata")).toBeInTheDocument();
    expect(
      screen.getByText("Optional report metadata for this scored run.")
    ).toBeInTheDocument();

    const upstreamPanel = getDetailsBySummaryText("Upstream engine provenance");
    expect(upstreamPanel).not.toHaveAttribute("open");

    expect(
      screen.getByText(
        "Only fill sourceEngine* when the JSON being scored already came from an upstream ZË-RO engine/export."
      )
    ).toBeInTheDocument();

    forceOpenDetails("Upstream engine provenance");
    expect(upstreamPanel).toHaveAttribute("open");

    expect(
      screen.getByRole("button", { name: "Autofill analyze-v1" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Clear sourceEngine*" })
    ).toBeDisabled();

    expect(
      screen.getByText(
        "Only use this when the JSON being scored was produced by the current /api/analyze-v1 route."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Leave sourceEngine* blank for hand-pasted buckets, external model outputs, or synthetic examples. The scorer cannot infer upstream engine provenance by itself."
      )
    ).toBeInTheDocument();
  });

  it("switches to buckets-only mode and keeps upstream provenance manual-only behind the collapsed panel", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getModeSelect(), {
      target: { value: "task_buckets" },
    });

    expect(getModeSelect()).toHaveValue("task_buckets");
    expect(getTaskSelect()).toBeEnabled();

    expect(
      screen.getByText("Select the task used to wrap V1..V7 bucket JSON into evalRun.v0.1.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("TASK PROMPT — CLICK TO EXPAND & COPY TO MODEL")
    ).toBeInTheDocument();

    forceOpenDetails("TASK PROMPT — CLICK TO EXPAND & COPY TO MODEL");
    expect(screen.getByRole("button", { name: "Copy" })).toBeEnabled();

    const upstreamPanel = getDetailsBySummaryText("Upstream engine provenance");
    expect(upstreamPanel).not.toHaveAttribute("open");

    forceOpenDetails("Upstream engine provenance");
    expect(upstreamPanel).toHaveAttribute("open");

    expect(
      screen.getByText(
        "Only fill sourceEngine* when the JSON being scored already came from an upstream ZË-RO engine/export."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Autofill analyze-v1" })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Clear sourceEngine*" })
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(
        "Leave sourceEngine* blank for hand-pasted buckets, external model outputs, or synthetic examples. The scorer cannot infer upstream engine provenance by itself."
      )
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("e.g. zero-api")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. analyze-v1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. 845bb5a")).toBeInTheDocument();
  });
});

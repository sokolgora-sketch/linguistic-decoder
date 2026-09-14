/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ZroChatPage from "@/components/ZroChatPage";

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const SUCCESS_RESULT = {
  word: "candle",
  mode: "strict",
  alphabet: "auto",
  engineVersion: "0.2.0-symbolic",
  primaryPath: {
    voicePath: ["A"],
    ringPath: [1],
    levelPath: [],
    ops: [],
  },
  evidence: {},
  candidates: [],
  rootMap: { tokens: [], keys: [], carriers: [], spans: [], composedMeaning: "" },
  originClaim: {
    policy: "no_single_winner",
    gatesActive: false,
    summary: { confidence: "weak", note: "request-context test payload" },
    candidates: [],
  },
};

const NULL_RESULT = {
  ...SUCCESS_RESULT,
  analysisStatusV0_1: {
    schemaVersion: "open-instrument.analysis-status.v0_1",
    status: "null_no_supported_candidate",
    summary: "No supported canonical candidate is available. Null is a valid result.",
    reviewedOperators: [],
    candidateOnlyOperators: [],
    researchHypothesisEmbryos: [],
    structuralTokens: [],
    claimBoundary: {
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      linguisticOwnershipClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      structuralOutputIsCandidateTruth: false,
      nullIsValid: true,
    },
    userDecisionPosture: "user_decides",
  },
};

function mockSuccessfulFetch(result = SUCCESS_RESULT) {
  (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
    if (String(input).includes("/api/analyze-v1?")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => result,
      } as Response);
    }

    return Promise.resolve({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({}),
    } as Response);
  });
}

function prepareDom() {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: jest.fn(),
  });
}

describe("Open Instrument target-sense result context v0.1", () => {
  beforeEach(() => {
    prepareDom();
    (global.fetch as jest.Mock).mockClear();
    mockSuccessfulFetch();
  });

  it("shows the exact trimmed successful-run target sense and ignores later input edits", async () => {
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "candle" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "  a wax light source  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    const context = await screen.findByTestId("instrument-target-sense");
    expect(context).toHaveTextContent(
      "Intended sense (request context): a wax light source",
    );

    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "a different submitted label" },
    });
    expect(context).toHaveTextContent("a wax light source");
    expect(context).not.toHaveTextContent("a different submitted label");
  });

  it("updates context for a new successful run of the same word", async () => {
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "candle" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "a wax light source" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));
    await screen.findByText("Intended sense (request context):");

    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "a different submitted label" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => {
      expect(screen.getByTestId("instrument-target-sense")).toHaveTextContent(
        "Intended sense (request context): a different submitted label",
      );
    });
    expect(screen.getByTestId("instrument-target-sense")).not.toHaveTextContent(
      "a wax light source",
    );
  });

  it("omits context for missing and whitespace-only target senses", async () => {
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "candle" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => {
      expect(screen.queryByTestId("instrument-target-sense")).not.toBeInTheDocument();
    });
  });

  it("does not pair a failed new request with the previous successful context", async () => {
    let analyzeCalls = 0;
    (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
      if (!String(input).includes("/api/analyze-v1?")) {
        return Promise.resolve({ ok: false, status: 404, json: async () => ({}) } as Response);
      }

      analyzeCalls += 1;
      if (analyzeCalls === 1) {
        return Promise.resolve({ ok: true, status: 200, json: async () => SUCCESS_RESULT } as Response);
      }

      return Promise.resolve({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({
          error: 'Missing "word". Provide a non-empty string.',
          reason: "MISSING_WORD",
        }),
      } as Response);
    });

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "candle" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "a wax light source" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));
    await screen.findByTestId("instrument-target-sense");

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "other" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "a new request context" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByText(
      'Request error: Missing "word". Provide a non-empty string.',
    );
    expect(screen.queryByTestId("instrument-target-sense")).not.toBeInTheDocument();
  });

  it("keeps request context separate from a canonical Null result", async () => {
    mockSuccessfulFetch(NULL_RESULT);
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "candle" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "a wax light source" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    expect(await screen.findByTestId("instrument-target-sense")).toHaveTextContent(
      "Intended sense (request context): a wax light source",
    );
    expect(
      await screen.findByRole("heading", { name: "Null — no supported candidate" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("No supported functional candidate yet.").length).toBeGreaterThan(0);
    expect(screen.queryByText("View candidate record")).not.toBeInTheDocument();
  });
});

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { webcrypto } from "node:crypto";

import ZroChatPage from "@/components/ZroChatPage";
import { downloadText } from "@/lib/downloadJson";
import {
  buildReproducibleRunBundleV0_1,
  parseReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";

jest.mock("@/lib/downloadJson", () => ({
  downloadText: jest.fn(),
}));

const mockedDownloadText = downloadText as jest.MockedFunction<typeof downloadText>;

const claimBoundary = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  linguisticOwnershipClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  structuralOutputIsCandidateTruth: false,
  nullIsValid: true,
};

function makeResult(overrides: Record<string, unknown> = {}) {
  return {
    word: "study",
    sanitized: "study",
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    alphabet: ["A", "E", "I", "O", "U", "Y", "Ë"],
    strictInput: true,
    primaryPath: { voicePath: ["U", "I"], ringPath: [1, 1], levelPath: [], ops: [] },
    heart: { math7: { primary: { basis: "UI", principlesPath: ["UNITY"] } } },
    heartPrimaryPath: ["U", "I"],
    functionalVoiceNormalizationV0_1: {
      functionalPath: ["U", "I"],
      status: "normalized",
    },
    candidates: [
      {
        id: "structural.study",
        language: "Internal",
        form: "study-embryo",
        candidateId: "structural.study",
        displayForm: "study-embryo",
        candidateLanguage: "Internal",
        targetWord: "study",
        targetSenseId: "study-sense",
        targetSenseLabel: "learning activity",
        status: "unknown",
        discoveryStatus: "structural_hypothesis",
        claimType: "structuralHypothesis",
        sourceKind: "logic_derived_structural_hypothesis",
        claimBoundary: "structural hypothesis only; not reviewed lexical evidence",
        functionalSupportStatus: "unknown",
        independentStandaloneMeaning: null,
        candidateTruthClaim: "not_claimed",
        historicalOriginClaim: "not_claimed",
        userDecisionPosture: "user_decides",
        validationOutcome: "not_evaluated",
        rankGroup: "structuralHypothesis",
        vowelPath: ["U", "I"],
        functionalStatement: "A bounded structural hypothesis.",
        evidenceRefs: [],
      },
    ],
    deepRoot: { status: "candidate_only", embryo: "study" },
    rootMap: { tokens: [], keys: [], carriers: [], spans: [], composedMeaning: "" },
    evidence: {},
    analysisStatusV0_1: {
      schemaVersion: "open-instrument.analysis-status.v0_1",
      status: "candidate_only",
      summary: "Candidate-only analysis.",
      reviewedOperators: [],
      candidateOnlyOperators: ["study"],
      researchHypothesisEmbryos: [],
      structuralTokens: [],
      claimBoundary,
      userDecisionPosture: "user_decides",
    },
    originClaim: "not_claimed",
    originClaimGates: { winnerClaim: "not_claimed" },
    resonanceProfileV1: { status: "present", path: ["U", "I"] },
    ...overrides,
  };
}

async function makeBundle(
  result = makeResult(),
  input: { ipa?: string; targetSenseLabel?: string } = {},
) {
  return buildReproducibleRunBundleV0_1({
    result,
    ...input,
    createdAt: "2026-09-10T00:00:00.000Z",
  });
}

function fileFrom(text: string): File {
  return {
    name: "saved-analysis.json",
    text: async () => text,
  } as unknown as File;
}

function mockSuccessfulAnalysis(result = makeResult()) {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => result,
    } as any)
    .mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ status: "not_available" }),
    } as any);
}

function analyzeFetchCount() {
  return (global.fetch as jest.Mock).mock.calls.filter(([input]) =>
    String(input).includes("/api/analyze-v1?"),
  ).length;
}

function researchFetchCount() {
  return (global.fetch as jest.Mock).mock.calls.filter(([input]) =>
    String(input).includes("/api/research/fvr?"),
  ).length;
}

beforeAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: webcrypto,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  mockedDownloadText.mockReset();
});

describe("reproducible run bundle UI handoff v0.1", () => {
  it("does not expose download for an invalid or error payload", () => {
    global.fetch = jest.fn();

    render(<ZroChatPage />);

    expect(screen.getByText("Open saved analysis")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download analysis" })).not.toBeInTheDocument();
  });

  it("downloads canonical current analysis content with input metadata and a valid fingerprint", async () => {
    mockSuccessfulAnalysis();
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "learning activity" },
    });
    fireEvent.change(screen.getByLabelText("IPA"), { target: { value: "/ˈstʌdi/" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByTestId("open-instrument-shell");
    const download = await screen.findByRole("button", { name: "Download analysis" });
    fireEvent.click(download);

    await waitFor(() => expect(mockedDownloadText).toHaveBeenCalledTimes(1));
    const [filename, serialized] = mockedDownloadText.mock.calls[0];
    expect(filename).toBe("open-instrument-study.json");

    const parsed = await parseReproducibleRunBundleV0_1(serialized);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.result.word).toBe("study");
    expect(parsed.value.input).toEqual({
      ipa: "/ˈstʌdi/",
      targetSenseLabel: "learning activity",
    });
    expect(analyzeFetchCount()).toBe(1);
    expect(researchFetchCount()).toBe(1);
  });

  it("marks a completed fresh analysis as current without exposing a fingerprint", async () => {
    mockSuccessfulAnalysis();
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByText("Current analysis");
    expect(screen.queryByText("Imported local snapshot")).not.toBeInTheDocument();
    expect(screen.queryByText(/Bundle fingerprint:/)).not.toBeInTheDocument();
    expect(analyzeFetchCount()).toBe(1);
  });

  it("shows validated provenance for an imported local snapshot", async () => {
    global.fetch = jest.fn();
    const bundle = await makeBundle();

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serializeReproducibleRunBundleV0_1(bundle))] },
    });

    await screen.findByText("Imported local snapshot");
    expect(screen.getByText(bundle.schemaVersion)).toBeInTheDocument();
    expect(screen.getByText(bundle.fingerprint.value)).toBeInTheDocument();
    expect(screen.getByText(bundle.createdAt as string)).toBeInTheDocument();
    expect(
      screen.getByText(/Bundle fingerprint matched the saved analysis input and result\./),
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not fabricate snapshot time when an imported bundle omits createdAt", async () => {
    global.fetch = jest.fn();
    const bundle = await makeBundle();
    const withoutCreatedAt = { ...bundle };
    delete withoutCreatedAt.createdAt;

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serializeReproducibleRunBundleV0_1(withoutCreatedAt))] },
    });

    await screen.findByText("Imported local snapshot");
    expect(screen.queryByText(/Snapshot time:/)).not.toBeInTheDocument();
    expect(screen.getByText(bundle.fingerprint.value)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("resets imported provenance to current after a fresh successful analysis", async () => {
    global.fetch = jest.fn();
    const bundle = await makeBundle(makeResult({ word: "saved" }));

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serializeReproducibleRunBundleV0_1(bundle))] },
    });
    await screen.findByText("Imported local snapshot");

    mockSuccessfulAnalysis(makeResult({ word: "fresh" }));
    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "fresh" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByText("Current analysis");
    expect(screen.queryByText("Imported local snapshot")).not.toBeInTheDocument();
    expect(screen.queryByText(bundle.fingerprint.value)).not.toBeInTheDocument();
    expect(screen.getByTestId("instrument-word")).toHaveTextContent("fresh");
    expect(analyzeFetchCount()).toBe(1);
  });

  it("keeps imported provenance attached to the displayed snapshot after a failed fresh request", async () => {
    global.fetch = jest.fn();
    const bundle = await makeBundle(makeResult({ word: "saved" }));

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serializeReproducibleRunBundleV0_1(bundle))] },
    });
    await screen.findByText("Imported local snapshot");

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: async () => ({ error: "failed" }),
    } as any);
    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "retry" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    await screen.findByText("Engine error.");
    expect(screen.getByText("Imported local snapshot")).toBeInTheDocument();
    expect(screen.getByText(bundle.fingerprint.value)).toBeInTheDocument();
    expect(screen.getByTestId("instrument-word")).toHaveTextContent("saved");
    expect(screen.queryByText("Current analysis")).not.toBeInTheDocument();
    expect(screen.getByText("Engine error.")).toBeInTheDocument();
  });

  it("exports the completed run metadata instead of later draft edits", async () => {
    mockSuccessfulAnalysis();
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "learning activity" },
    });
    fireEvent.change(screen.getByLabelText("IPA"), { target: { value: "/ˈstʌdi/" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));
    await screen.findByRole("button", { name: "Download analysis" });

    fireEvent.change(screen.getByLabelText("Intended sense"), {
      target: { value: "draft replacement sense" },
    });
    fireEvent.change(screen.getByLabelText("IPA"), { target: { value: "/draft/" } });
    fireEvent.click(screen.getByRole("button", { name: "Download analysis" }));

    await waitFor(() => expect(mockedDownloadText).toHaveBeenCalledTimes(1));
    const [, serialized] = mockedDownloadText.mock.calls[0];
    const parsed = await parseReproducibleRunBundleV0_1(serialized);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.input).toEqual({
      ipa: "/ˈstʌdi/",
      targetSenseLabel: "learning activity",
    });
  });

  it("disables local snapshot handoff while analysis is pending", async () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<ZroChatPage />);

    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));

    expect(screen.getByLabelText("Open saved analysis")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Download analysis" })).not.toBeInTheDocument();
  });

  it("reopens a saved result locally, restores inputs, preserves Null and metadata, and makes no fetch", async () => {
    global.fetch = jest.fn();
    const bundle = await makeBundle(
      makeResult({
        word: "saved",
        sanitized: "saved",
        candidates: [],
        analysisStatusV0_1: {
          ...makeResult().analysisStatusV0_1,
          status: "null_no_supported_candidate",
          summary: "No supported candidate.",
          candidateOnlyOperators: [],
        },
      }),
      { ipa: "/ˈseɪvd/", targetSenseLabel: "archived learning action" },
    );

    render(<ZroChatPage />);
    const fileInput = screen.getByLabelText("Open saved analysis");
    fireEvent.change(fileInput, {
      target: { files: [fileFrom(serializeReproducibleRunBundleV0_1(bundle))] },
    });

    await screen.findByTestId("open-instrument-shell");
    expect(screen.getByTestId("instrument-word")).toHaveTextContent("saved");
    expect(
      screen.getByRole("heading", { name: "Null — no supported candidate" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Word")).toHaveValue("saved");
    expect(screen.getByLabelText("IPA")).toHaveValue("/ˈseɪvd/");
    expect(screen.getByLabelText("Intended sense")).toHaveValue("archived learning action");
    expect(screen.getAllByText("No supported functional candidate yet.").length).toBeGreaterThan(0);
    expect(screen.getByText("Imported local snapshot")).toBeInTheDocument();
    expect(screen.getByText(bundle.fingerprint.value)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("reopens structural discovery and functional normalization data without replay", async () => {
    global.fetch = jest.fn();
    const bundle = await makeBundle();
    const serialized = serializeReproducibleRunBundleV0_1(bundle);
    const parsed = await parseReproducibleRunBundleV0_1(serialized);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.result.candidates[0].discoveryStatus).toBe("structural_hypothesis");

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serialized)] },
    });

    await screen.findByTestId("open-instrument-shell");
    fireEvent.click(screen.getByRole("tab", { name: "Candidates" }));
    fireEvent.click(screen.getByText("Other candidate records"));
    expect(screen.getByText("study-embryo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Roots / Meaning" }));
    expect(screen.getAllByText("Functional").length).toBeGreaterThan(0);
    expect(screen.getAllByText("U-I").length).toBeGreaterThan(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("clears stale recurrence research on import and never requests research", async () => {
    const fvr = {
      status: "available",
      sharedFunctionalNucleus: ["U"],
      observations: [],
    };
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => makeResult() } as any)
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => fvr } as any);

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));
    await screen.findByTestId("cross-language-recurrence-card");

    const bundle = await makeBundle(makeResult({ word: "saved" }));
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serializeReproducibleRunBundleV0_1(bundle))] },
    });

    await waitFor(() => expect(screen.getByTestId("instrument-word")).toHaveTextContent("saved"));
    expect(screen.queryByTestId("cross-language-recurrence-card")).not.toBeInTheDocument();
    expect(analyzeFetchCount()).toBe(1);
    expect(researchFetchCount()).toBe(1);
  });

  it.each([
    ["malformed JSON", "not-json", "The saved analysis file is not valid JSON."],
    [
      "unsupported version",
      async () => {
        const bundle = await makeBundle();
        return JSON.stringify({ ...bundle, schemaVersion: "future.v9" });
      },
      "This saved analysis version is not supported.",
    ],
    [
      "fingerprint mismatch",
      async () => {
        const bundle = await makeBundle();
        const tampered = JSON.parse(serializeReproducibleRunBundleV0_1(bundle));
        tampered.result.word = "tampered";
        return JSON.stringify(tampered);
      },
      "The saved analysis fingerprint does not match its contents.",
    ],
  ])("fails closed for %s and preserves the prior valid result", async (_name, source, error) => {
    mockSuccessfulAnalysis();
    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Word"), { target: { value: "study" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze" }));
    await screen.findByTestId("instrument-word");

    const text = typeof source === "string" ? source : await source();
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(text)] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(error as string);
    expect(screen.getByTestId("instrument-word")).toHaveTextContent("study");
    expect(screen.queryByText("Imported local snapshot")).not.toBeInTheDocument();
    expect(analyzeFetchCount()).toBe(1);
    expect(researchFetchCount()).toBe(1);
  });
});

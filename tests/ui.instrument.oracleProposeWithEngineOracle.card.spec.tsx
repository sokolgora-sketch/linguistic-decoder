import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { OracleProposeWithEngineOracleCardV01 } from "../src/ui/instrument/sections/OracleProposeWithEngineOracleCard.v0.1";

describe("OracleProposeWithEngineOracleCard v0.1", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders (no fetch)", () => {
    render(
      <OracleProposeWithEngineOracleCardV01
        word="study"
        mode="strict"
        onCopy={() => void 0}
      />
    );

    expect(screen.getByText(/Propose with Engine Oracle/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Run oracle proposal/i })).toBeTruthy();
  });

  test("surfaces verifier-rejected proposer candidates with reason codes", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        ok: true,
        word: "study",
        mode: "strict",
        provider: "mock",
        oracle: { primaryVoicePath: ["U", "I"] },
        proposal: {
          candidates: [
            {
              language: "Atlantian",
              form: "xqz",
            },
            {
              language: "Latin",
              form: "studium",
            },
          ],
        },
        proposalVerification: {
          results: [
            {
              form: "xqz",
              pass: false,
              extractedVowelPath: [],
              checks: [
                {
                  id: "LANG_KNOWN",
                  pass: false,
                  reason: "Language is not in the v0.1 registry.",
                },
                {
                  id: "ROOT_HAS_VOWEL",
                  pass: false,
                  reason: "Candidate form has no extracted Seven-Voice vowels.",
                },
              ],
            },
            {
              form: "studium",
              pass: true,
              extractedVowelPath: ["U", "I"],
              checks: [
                {
                  id: "LANG_KNOWN",
                  pass: true,
                  reason: "Language is known.",
                },
              ],
            },
          ],
        },
        claimVerification: { passed: false },
      }),
    } as unknown as typeof fetch);

    const onCopy = jest.fn();

    render(
      <OracleProposeWithEngineOracleCardV01
        word="study"
        mode="strict"
        onCopy={onCopy}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Run oracle proposal/i }));

    expect(await screen.findByText("Rejected proposals")).toBeInTheDocument();
    expect(screen.getByText("rejected=1")).toBeInTheDocument();
    expect(screen.getByText("Atlantian")).toBeInTheDocument();
    expect(screen.getByText("xqz")).toBeInTheDocument();
    expect(screen.getByText("LANG_KNOWN")).toBeInTheDocument();
    expect(screen.getByText("ROOT_HAS_VOWEL")).toBeInTheDocument();
    expect(screen.getByText(/use a documented human language name or code/i)).toBeInTheDocument();
    expect(screen.getByText(/revise decomposition action, instrument, unit, or statement/i)).toBeInTheDocument();
    expect(screen.queryByText("studium")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Copy rejected diagnostics/i }));

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy.mock.calls[0][0]).toBe("Rejected diagnostics copied.");

    const copied = JSON.parse(String(onCopy.mock.calls[0][1]));
    expect(copied).toMatchObject({
      diagnostic: "open-instrument.rejected-proposals.v0.1",
      word: "study",
      mode: "strict",
      provider: "mock",
      rejectedCount: 1,
      message: "Verifier-rejected proposals emitted.",
      rejectedProposals: [
        {
          form: "xqz",
          language: "Atlantian",
          extractedVowelPath: [],
          failedChecks: [
            {
              id: "LANG_KNOWN",
              reason: "Language is not in the v0.1 registry.",
              repairHint: "Repair: use a documented human language name or code, such as English, Albanian, Latin, Ancient Greek, or Sanskrit.",
            },
            {
              id: "ROOT_HAS_VOWEL",
              reason: "Candidate form has no extracted Seven-Voice vowels.",
              repairHint: "Repair: revise decomposition action, instrument, unit, or statement so the root/function material contains at least one extracted vowel from the candidate.",
            },
          ],
        },
      ],
    });
  });

  test("shows an empty rejected-proposals state after a clean proposer result", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        ok: true,
        word: "study",
        mode: "strict",
        provider: "mock",
        oracle: { primaryVoicePath: ["U", "I"] },
        proposal: {
          candidates: [
            {
              language: "Latin",
              form: "studium",
            },
          ],
        },
        proposalVerification: {
          results: [
            {
              form: "studium",
              pass: true,
              extractedVowelPath: ["U", "I"],
              checks: [
                {
                  id: "LANG_KNOWN",
                  pass: true,
                  reason: "Language is known.",
                },
              ],
            },
          ],
        },
        claimVerification: { passed: true },
      }),
    } as unknown as typeof fetch);

    const onCopy = jest.fn();

    render(
      <OracleProposeWithEngineOracleCardV01
        word="study"
        mode="strict"
        onCopy={onCopy}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Run oracle proposal/i }));

    expect(await screen.findByText("Rejected proposals")).toBeInTheDocument();
    expect(screen.getByText("rejected=0")).toBeInTheDocument();
    expect(screen.getByText("No rejected proposals emitted.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Copy rejected diagnostics/i }));

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy.mock.calls[0][0]).toBe("Rejected diagnostics copied.");

    const copied = JSON.parse(String(onCopy.mock.calls[0][1]));
    expect(copied).toMatchObject({
      diagnostic: "open-instrument.rejected-proposals.v0.1",
      word: "study",
      mode: "strict",
      provider: "mock",
      rejectedCount: 0,
      message: "No rejected proposals emitted.",
      rejectedProposals: [],
    });
  });
  test("surfaces repair guidance for illegal opsUsed failures", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        ok: true,
        word: "study",
        mode: "strict",
        provider: "mock",
        oracle: { primaryVoicePath: ["U", "I"] },
        proposal: {
          candidates: [
            {
              language: "English",
              form: "study",
            },
          ],
        },
        proposalVerification: {
          results: [
            {
              form: "study",
              pass: false,
              extractedVowelPath: ["U", "I"],
              checks: [
                {
                  id: "OPS_ALLOWED",
                  pass: false,
                  reason: "Illegal opsUsed token(s): final y read as /i/",
                },
              ],
            },
          ],
        },
        claimVerification: { passed: false },
      }),
    } as unknown as typeof fetch);

    const onCopy = jest.fn();

    render(
      <OracleProposeWithEngineOracleCardV01
        word="study"
        mode="strict"
        onCopy={onCopy}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Run oracle proposal/i }));

    expect(await screen.findByText("Rejected proposals")).toBeInTheDocument();
    expect(screen.getByText("OPS_ALLOWED")).toBeInTheDocument();
    expect(screen.getByText(/remove illegal opsUsed entries/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Copy rejected diagnostics/i }));

    const copied = JSON.parse(String(onCopy.mock.calls[0][1]));
    expect(copied.rejectedProposals[0].failedChecks[0]).toMatchObject({
      id: "OPS_ALLOWED",
      reason: "Illegal opsUsed token(s): final y read as /i/",
      repairHint: "Repair: remove illegal opsUsed entries or replace them with allowed operation IDs. If unsure, use an empty opsUsed array.",
    });
  });

});

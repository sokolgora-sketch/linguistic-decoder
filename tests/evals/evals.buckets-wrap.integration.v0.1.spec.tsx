import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";
import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";

const BUCKETS = {
  V1: ["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"],
  V2: ["o","oo","ooo","oooo","ooooo","oooooo","ooooooo","oooooooo","ooooooooo","oooooooooo"],
  V3: ["e","ee","eee","eeee","eeeee","eeeeee","eeeeeee","eeeeeeee","eeeeeeeee","eeeeeeeeee"],
  V4: ["ë","ëë","ëëë","ëëëë","ëëëëë","ëëëëëë","ëëëëëëë","ëëëëëëëë","ëëëëëëëëë","ëëëëëëëëëë"],
  V5: ["u","uu","uuu","uuuu","uuuuu","uuuuuu","uuuuuuu","uuuuuuuu","uuuuuuuuu","uuuuuuuuuu"],
  V6: ["y","yy","yyy","yyyy","yyyyy","yyyyyy","yyyyyyy","yyyyyyyy","yyyyyyyyy","yyyyyyyyyy"],
  V7: ["i","ii","iii","iiii","iiiii","iiiiii","iiiiiii","iiiiiiii","iiiiiiiii","iiiiiiiiii"],
};

function getModeSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[0] as HTMLSelectElement;
}

function getTaskSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[1] as HTMLSelectElement;
}

function getRunIdInput(): HTMLInputElement {
  return screen.getByDisplayValue("ui.run.v0.1") as HTMLInputElement;
}

function getProviderInput(): HTMLInputElement {
  return screen.getByPlaceholderText("e.g. openai") as HTMLInputElement;
}

function getModelInput(): HTMLInputElement {
  return screen.getByPlaceholderText("e.g. gpt-4o") as HTMLInputElement;
}

function getLabelInput(): HTMLInputElement {
  return screen.getByPlaceholderText("e.g. fresh-chat") as HTMLInputElement;
}

function getJsonTextarea(): HTMLTextAreaElement {
  const box = screen
    .getAllByRole("textbox")
    .find((el) => el.tagName.toLowerCase() === "textarea");

  if (!(box instanceof HTMLTextAreaElement)) {
    throw new Error("Paste JSON textarea not found");
  }

  return box;
}

function fillUi() {
  fireEvent.change(getRunIdInput(), {
    target: { value: "wrap.integration.v0.1" },
  });
  fireEvent.change(getProviderInput(), {
    target: { value: "openai" },
  });
  fireEvent.change(getModelInput(), {
    target: { value: "gpt-4o" },
  });
  fireEvent.change(getLabelInput(), {
    target: { value: "fresh-chat" },
  });
  fireEvent.change(getJsonTextarea(), {
    target: { value: JSON.stringify(BUCKETS, null, 2) },
  });
}

describe("Evals buckets-wrap integration v0.1", () => {
  const fetchMock = jest.fn();
  const writeText = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    writeText.mockReset();

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    fetchMock.mockImplementation(async (_input: unknown, init?: RequestInit) => {
      const runJson = JSON.parse(String(init?.body ?? "{}"));
      const run = parseEvalRunBundleV0_1(runJson);
      const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
      const md = renderEvalReportMdV0_1(report);

      return new Response(JSON.stringify({ ok: true, report, md }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    writeText.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("restricts buckets-only selector to T2 ladder", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getModeSelect(), { target: { value: "task_buckets" } });

    expect(getModeSelect()).toHaveValue("task_buckets");
    expect(getTaskSelect()).toBeEnabled();
    expect(getTaskSelect()).toHaveValue("T2_LADDER_V0_1");

    const options = within(getTaskSelect()).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveValue("T2_LADDER_V0_1");
  });

  it("auto-wraps exact V1..V7 buckets to T2 ladder from full-run mode", async () => {
    render(<EvalsPageClientV0_1 />);
    fillUi();

    fireEvent.click(screen.getByRole("button", { name: "Score run" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const reqInit = fetchMock.mock.calls[0][1] as RequestInit;
    const sent = JSON.parse(String(reqInit?.body ?? "{}"));

    expect(sent.evalRunVersion).toBe("evalRun.v0.1");
    expect(sent.tasks[0]?.taskId).toBe("T2_LADDER_V0_1");
    expect(sent.meta).toEqual({
      provider: "openai",
      model: "gpt-4o",
      label: "fresh-chat",
    });

    expect(
      screen.getByText(
        "Detected buckets-only JSON while in Full run bundle mode. Auto-wrapping into evalRun.v0.1."
      )
    ).toBeInTheDocument();
  });

  it("copies CSV row after wrapped score using presenceMean permutation provenance", async () => {
    render(<EvalsPageClientV0_1 />);
    fillUi();

    fireEvent.click(screen.getByRole("button", { name: "Score run" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: "Copy CSV Row" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    const csv = String(writeText.mock.calls[0][0] ?? "");
    expect(csv).toContain("wrap.integration.v0.1");
    expect(csv).toContain("openai");
    expect(csv).toContain("gpt-4o");
    expect(csv).toContain("p_perm_src=p_spearman");
  });
});

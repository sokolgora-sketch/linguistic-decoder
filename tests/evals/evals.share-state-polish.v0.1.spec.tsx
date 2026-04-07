import { beforeEach, describe, expect, it } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

function getModeSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[0] as HTMLSelectElement;
}

function getTaskSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[1] as HTMLSelectElement;
}

describe("Evals share + state-link polish v0.1", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/evals");
  });

  it("restores buckets-only mode and task from shareable URL state", async () => {
    window.history.replaceState(
      {},
      "",
      "/evals?mode=task_buckets&task=T2_LADDER_V0_1"
    );

    render(<EvalsPageClientV0_1 />);

    await waitFor(() => {
      expect(getModeSelect()).toHaveValue("task_buckets");
      expect(getTaskSelect()).toHaveValue("T2_LADDER_V0_1");
    });
  });

  it("locks copy page link to stable buckets-mode state only", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "src/ui/evals/EvalsPageClient.v0.1.tsx"),
      "utf8"
    );

    expect(src).toContain('href.searchParams.set("mode", "task_buckets")');
    expect(src).toContain('href.searchParams.set("task", selectedTask?.taskId ?? taskId)');
  });
});

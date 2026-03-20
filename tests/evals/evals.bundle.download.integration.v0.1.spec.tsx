import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

function getModeSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[0] as HTMLSelectElement;
}

function getSourceEngineIdInput(): HTMLInputElement {
  return screen.getByPlaceholderText("e.g. zero-api") as HTMLInputElement;
}

function getSourceEngineVersionInput(): HTMLInputElement {
  return screen.getByPlaceholderText("e.g. analyze-v1") as HTMLInputElement;
}

function getSourceEngineBuildInput(): HTMLInputElement {
  return screen.getByPlaceholderText("e.g. 845bb5a") as HTMLInputElement;
}

async function blobToText(blob: Blob): Promise<string> {
  if (typeof (blob as Blob & { text?: () => Promise<string> }).text === "function") {
    return await (blob as Blob & { text: () => Promise<string> }).text();
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsText(blob);
  });
}

function installDownloadHarness() {
  let capturedBlob: Blob | null = null;
  const anchors: HTMLAnchorElement[] = [];

  const oldCreate = URL.createObjectURL;
  const oldRevoke = URL.revokeObjectURL;

  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: (blob: Blob) => {
      capturedBlob = blob;
      return "blob:df-test";
    },
  });

  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    writable: true,
    value: jest.fn(),
  });

  const originalAppendChild = document.body.appendChild.bind(document.body);
  const appendChildSpy = jest
    .spyOn(document.body, "appendChild")
    .mockImplementation(((node: Node) => {
      if (node instanceof HTMLAnchorElement) {
        anchors.push(node);
      }
      return originalAppendChild(node);
    }) as typeof document.body.appendChild);

  const clickSpy = jest
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});

  return {
    getBlob(): Blob | null {
      return capturedBlob;
    },
    getLastAnchor(): HTMLAnchorElement | undefined {
      return anchors[anchors.length - 1];
    },
    restore() {
      appendChildSpy.mockRestore();
      clickSpy.mockRestore();

      Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        writable: true,
        value: oldCreate,
      });

      Object.defineProperty(URL, "revokeObjectURL", {
        configurable: true,
        writable: true,
        value: oldRevoke,
      });
    },
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Evals bundle download integration v0.1", () => {
  it("downloads a wrapped evalRun bundle when raw V1..V7 buckets are sitting in full-run mode", async () => {
    render(<EvalsPageClientV0_1 />);
    const harness = installDownloadHarness();

    try {
      fireEvent.click(screen.getByRole("button", { name: "Load example" }));

      fireEvent.change(getModeSelect(), {
        target: { value: "run_bundle" },
      });

      expect(getModeSelect()).toHaveValue("run_bundle");

      fireEvent.click(screen.getByRole("button", { name: "Download Bundle" }));

      await waitFor(() => expect(harness.getBlob()).not.toBeNull());

      const text = await blobToText(harness.getBlob() as Blob);
      const bundle = JSON.parse(text);

      expect(bundle.evalRunVersion).toBe("evalRun.v0.1");
      expect(bundle.evalSpecVersion).toBe("evalSpec.v0.1");
      expect(bundle.specId).toBe("public-grounding-probe.v0.1");
      expect(bundle.tasks[0]?.taskId).toBe("T2_LADDER_V0_1");
      expect(bundle.tasks[0]?.inputShape).toBe("bucketed_single_tokens");
      expect(Array.isArray(bundle.tasks[0]?.buckets?.V1)).toBe(true);

      const lastAnchor = harness.getLastAnchor();
      expect(lastAnchor).toBeTruthy();
      expect(lastAnchor?.href).toBe("blob:df-test");
      expect(lastAnchor?.download).toContain("evals.example.synthetic.ladder.v0.1");
      expect(lastAnchor?.download).toContain(".json");

      expect(
        screen.getByText(
          "Downloaded evalRun bundle. Raw V1..V7 input was auto-wrapped through T2_LADDER_V0_1."
        )
      ).toBeInTheDocument();

      expect(getModeSelect()).toHaveValue("task_buckets");
    } finally {
      harness.restore();
    }
  });

  it("downloads the effective buckets-only run bundle directly from T2 mode", async () => {
    render(<EvalsPageClientV0_1 />);
    const harness = installDownloadHarness();

    try {
      fireEvent.click(screen.getByRole("button", { name: "Load example" }));
      expect(getModeSelect()).toHaveValue("task_buckets");

      fireEvent.click(screen.getByRole("button", { name: "Download Bundle" }));

      await waitFor(() => expect(harness.getBlob()).not.toBeNull());

      const text = await blobToText(harness.getBlob() as Blob);
      const bundle = JSON.parse(text);

      expect(bundle.evalRunVersion).toBe("evalRun.v0.1");
      expect(bundle.evalSpecVersion).toBe("evalSpec.v0.1");
      expect(bundle.tasks[0]?.taskId).toBe("T2_LADDER_V0_1");
      expect(bundle.tasks[0]?.inputShape).toBe("bucketed_single_tokens");

      const lastAnchor = harness.getLastAnchor();
      expect(lastAnchor).toBeTruthy();
      expect(lastAnchor?.href).toBe("blob:df-test");
      expect(lastAnchor?.download).toContain("evals.example.synthetic.ladder.v0.1");
      expect(lastAnchor?.download).toContain(".json");

      expect(screen.getByText("Downloaded evalRun bundle.")).toBeInTheDocument();
    } finally {
      harness.restore();
    }
  });

  it("preserves source-engine provenance in the downloaded bundle", async () => {
    render(<EvalsPageClientV0_1 />);
    const harness = installDownloadHarness();

    try {
      fireEvent.click(screen.getByRole("button", { name: "Load example" }));
      expect(getModeSelect()).toHaveValue("task_buckets");

      fireEvent.change(getSourceEngineIdInput(), {
        target: { value: "zero-api" },
      });
      fireEvent.change(getSourceEngineVersionInput(), {
        target: { value: "analyze-v1" },
      });
      fireEvent.change(getSourceEngineBuildInput(), {
        target: { value: "845bb5a" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Download Bundle" }));

      await waitFor(() => expect(harness.getBlob()).not.toBeNull());

      const text = await blobToText(harness.getBlob() as Blob);
      const bundle = JSON.parse(text);

      expect(bundle.meta).toEqual({
        sourceEngineId: "zero-api",
        sourceEngineVersion: "analyze-v1",
        sourceEngineBuild: "845bb5a",
      });

      expect(bundle.tasks[0]?.taskId).toBe("T2_LADDER_V0_1");
      expect(screen.getByText("Downloaded evalRun bundle.")).toBeInTheDocument();
    } finally {
      harness.restore();
    }
  });
});

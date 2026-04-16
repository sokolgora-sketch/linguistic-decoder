import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

async function blobToText(blob: Blob): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read CSV blob"));
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
  const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation(((node: Node) => {
    if (node instanceof HTMLAnchorElement) anchors.push(node);
    return originalAppendChild(node);
  }) as typeof document.body.appendChild);

  const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  return {
    getBlob() {
      return capturedBlob;
    },
    getLastAnchor() {
      return anchors[anchors.length - 1];
    },
    restore() {
      appendChildSpy.mockRestore();
      clickSpy.mockRestore();
      Object.defineProperty(URL, "createObjectURL", { configurable: true, writable: true, value: oldCreate });
      Object.defineProperty(URL, "revokeObjectURL", { configurable: true, writable: true, value: oldRevoke });
    },
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Evals Summary CSV download integration v0.1", () => {
  it("downloads a summary CSV from /evals", async () => {
    render(<EvalsPageClientV0_1 />);
    const harness = installDownloadHarness();

    try {
      fireEvent.click(screen.getByRole("button", { name: "Download Summary CSV" }));
      await waitFor(() => expect(harness.getBlob()).not.toBeNull());

      const text = await blobToText(harness.getBlob() as Blob);
      expect(text).toContain("ZË-RO Evals Summary CSV");
      expect(text).toContain("Run Summary");
      expect(text).toContain("T5 Summary");
      expect(text).toContain("Bucket Stats");
      expect(text).toContain("runId,taskId,language,vowel,anchorLow,anchorHigh,verdict,normalizedPosition");
      expect(text).toContain("ui.run.v0.1");

      const lastAnchor = harness.getLastAnchor();
      expect(lastAnchor).toBeTruthy();
      expect(lastAnchor?.href).toBe("blob:df-test");
      expect(lastAnchor?.download).toContain("evals.summary");
      expect(lastAnchor?.download).toContain(".csv");

      expect(screen.getByText("Downloaded Summary CSV.")).toBeInTheDocument();
    } finally {
      harness.restore();
    }
  });
});

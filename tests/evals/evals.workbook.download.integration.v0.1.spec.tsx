import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ExcelJS from "exceljs/dist/exceljs.min.js";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof (blob as Blob & { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer === "function") {
    return await (blob as Blob & { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer();
  }

  return await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read workbook blob"));
    reader.readAsArrayBuffer(blob);
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

describe("Evals workbook download integration v0.1", () => {
  it("downloads a real xlsx workbook from /evals", async () => {
    render(<EvalsPageClientV0_1 />);
    const harness = installDownloadHarness();

    try {
      fireEvent.click(screen.getByRole("button", { name: "Download Workbook" }));
      await waitFor(() => expect(harness.getBlob()).not.toBeNull());

      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(await blobToArrayBuffer(harness.getBlob() as Blob));

      expect(wb.worksheets.map((ws) => ws.name)).toEqual([
        "Run Summary",
        "Bucket Stats",
        "Pilot Planner",
        "Pilot Summary",
        "Raw Report",
      ]);

      expect(wb.getWorksheet("Pilot Summary")?.getCell("B2").value).toBe("DEEP_INTERIOR_BENCHMARK");
      expect(wb.getWorksheet("Pilot Summary")?.getCell("B6").value).toBe("SOFT_COLLAPSE_HIGH_CONTROL");

      const lastAnchor = harness.getLastAnchor();
      expect(lastAnchor).toBeTruthy();
      expect(lastAnchor?.href).toBe("blob:df-test");
      expect(lastAnchor?.download).toContain("evals.workbook");
      expect(lastAnchor?.download).toContain(".xlsx");

      expect(screen.getByText("Downloaded Evals workbook.")).toBeInTheDocument();
    } finally {
      harness.restore();
    }
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

// Prevent act(...) warnings from the real toast hook (it forces a state update).
const toastSpy = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy }),
}));

test("InstrumentPanel derives ops/notes/signals counts from emitted evidence arrays", () => {
  const payload: unknown = {
    word: "study",
    sanitized: "study",
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    candidates: [],
    evidence: {
      ops: [{}, {}, {}],
      notes: [{}, {}],
      signals: [{}, {}, {}, {}],
      normalizationSteps: [{}],
    },
    heart: { mode: "strict", alphabet: "Latin" },
    primaryPath: { voicePath: ["U", "I"] },
  };

  // Mock clipboard: Copy Summary writes the contract summary
  const writeText = jest.fn().mockResolvedValue(undefined);
  (globalThis as any).navigator = (globalThis as any).navigator ?? {};
  (globalThis as any).navigator.clipboard = { writeText };

  render(<InstrumentPanel payload={payload} />);

  const btn = screen.getByRole("button", { name: /copy summary/i });
  fireEvent.click(btn);

  expect(writeText).toHaveBeenCalledTimes(1);
  const copied = String(writeText.mock.calls[0][0]);
  expect(copied).toContain("ops=3");
  expect(copied).toContain("notes=2");
  expect(copied).toContain("signals=4");

  // Guard: never leak object stringification into UI
  expect(document.body.textContent || "").not.toMatch(/\[object Object\]/);
});

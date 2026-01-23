import React from "react";
import { render, screen, within } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

// InstrumentPanel uses the useToast hook, which we need to mock for tests.
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

function findNearestAncestorWithPre(start: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = start;
  while (el) {
    if (el.querySelector("pre")) return el;
    el = el.parentElement;
  }
  return null;
}

describe("ui instrument: originClaim gates renders from VM", () => {
  test("shows ON/OFF and counts from VM only", () => {
    const payload = {
      word: "test-word",
      originClaim: {
        policy: { gatesActive: true },
        candidates: [
          { reasonCodes: ["KEEP", "A"] },
          { reasonCodes: ["KEEP", "B"] },
          { reasonCodes: ["DROP"] },
        ],
      },
    };

    render(<InstrumentPanel payload={payload as any} />);

    expect(screen.getByText("OriginClaim Gates")).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toHaveTextContent("Status: ON");
    expect(screen.getByText(/Candidates:/)).toHaveTextContent("Candidates: 3");

    // Scope to the section that actually contains the counts <pre>.
    const heading = screen.getByText("Reason code counts");
    const block = findNearestAncestorWithPre(heading as HTMLElement);
    expect(block).toBeTruthy();

    const pre = (block as HTMLElement).querySelector("pre");
    expect(pre).toBeTruthy();

    expect(pre as HTMLElement).toHaveTextContent(/"KEEP":\s*2/);
    expect(pre as HTMLElement).toHaveTextContent(/"A":\s*1/);
    expect(pre as HTMLElement).toHaveTextContent(/"B":\s*1/);
    expect(pre as HTMLElement).toHaveTextContent(/"DROP":\s*1/);
  });

  test("OFF renders when active=false", () => {
    const payload = {
      word: "test-word",
      originClaim: {
        policy: { gatesActive: false },
        candidates: [{}, {}, {}, {}, {}, {}, {}],
      },
    };

    render(<InstrumentPanel payload={payload as any} />);
    expect(screen.getByText(/Status:/)).toHaveTextContent("Status: OFF");
    expect(screen.getByText(/Candidates:/)).toHaveTextContent("Candidates: 7");
  });
});

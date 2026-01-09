import React from "react";
import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

// InstrumentPanel uses the useToast hook, which we need to mock for tests.
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("ui instrument: originClaim gates renders from VM", () => {
  test("shows ON/OFF and counts from VM only", () => {
    // This payload will be adapted into a VM by the InstrumentPanel.
    // We are testing that the panel correctly renders the data from the *adapted VM*.
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

    render(<InstrumentPanel payload={payload} />);

    // Assertions are based on the expected VM state derived from the payload above.
    expect(screen.getByText("OriginClaim Gates")).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toHaveTextContent("Status: ON");
    expect(screen.getByText(/Candidates:/)).toHaveTextContent("Candidates: 3");
    expect(screen.getByText("Reason code counts")).toBeInTheDocument();

    const reasonCountsPre = screen.getByText(/{/i).closest('pre');
    expect(reasonCountsPre).toHaveTextContent(/"KEEP": 2/);
    expect(reasonCountsPre).toHaveTextContent(/"A": 1/);
    expect(reasonCountsPre).toHaveTextContent(/"B": 1/);
    expect(reasonCountsPre).toHaveTextContent(/"DROP": 1/);
  });

  test("OFF renders when active=false", () => {
    const payload = {
       word: "test-word",
      originClaim: {
        policy: { gatesActive: false },
        candidates: [{}, {}, {}, {}, {}, {}, {}],
      },
    };

    render(<InstrumentPanel payload={payload} />);
    expect(screen.getByText(/Status:/)).toHaveTextContent("Status: OFF");
    expect(screen.getByText(/Candidates:/)).toHaveTextContent("Candidates: 7");
  });
});

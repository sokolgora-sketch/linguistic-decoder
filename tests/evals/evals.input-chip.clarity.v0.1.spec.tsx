import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

function getInputTextarea(): HTMLTextAreaElement {
  return screen.getByPlaceholderText(/evalRunVersion/) as HTMLTextAreaElement;
}

describe("Evals input chip clarity v0.1", () => {
  it("labels evalRun bundle input explicitly", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getInputTextarea(), {
      target: { value: '{"evalRunVersion":"evalRun.v0.1"}' },
    });

    expect(
      screen.getByText("Detected input · evalRun.v0.1 bundle")
    ).toBeInTheDocument();
  });

  it("labels buckets-only input explicitly", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getInputTextarea(), {
      target: {
        value:
          '{"V1":["wide"],"V2":["stone"],"V3":["room"],"V4":["center"],"V5":["river"],"V6":["blade"],"V7":["point"]}',
      },
    });

    expect(
      screen.getByText("Detected input · buckets-only V1..V7 JSON")
    ).toBeInTheDocument();
  });

  it("shows invalid JSON guidance before scoring", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getInputTextarea(), {
      target: { value: '{"evalRunVersion":' },
    });

    expect(
      screen.getByText("Invalid JSON — fix syntax before scoring")
    ).toBeInTheDocument();
  });
});

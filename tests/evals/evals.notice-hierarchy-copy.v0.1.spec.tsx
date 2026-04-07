import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

function getInputTextarea(): HTMLTextAreaElement {
  return screen.getByPlaceholderText(/evalRunVersion/) as HTMLTextAreaElement;
}

describe("Evals notice hierarchy + upload/paste copy v0.1", () => {
  it("renders clearer upload and paste guidance", () => {
    render(<EvalsPageClientV0_1 />);

    expect(document.body.textContent).toContain(
      "Bring either a saved evalRun.v0.1 bundle or raw V1..V7 buckets-only JSON. The input chip confirms what the workbench detected before scoring."
    );

    expect(document.body.textContent).toContain(
      "Upload a saved evalRun bundle or raw V1..V7 buckets-only JSON."
    );

    expect(document.body.textContent).toContain(
      "bundles or raw V1..V7 buckets-only JSON."
    );

    expect(document.body.textContent).toContain(
      "buckets-only JSON directly into the workbench."
    );
  });

  it("still distinguishes invalid and warning states during input review", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getInputTextarea(), {
      target: { value: '{"evalRunVersion":' },
    });

    expect(
      screen.getByText("Invalid JSON — fix syntax before scoring")
    ).toBeInTheDocument();

    fireEvent.change(getInputTextarea(), {
      target: {
        value:
          '{"V1":["wide"],"V2":["stone"],"V3":["room"],"V4":["center"],"V5":["river"],"V6":["blade"],"V7":["point"]}',
      },
    });

    expect(
      screen.getByText("Detected input · buckets-only V1..V7 JSON")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Buckets detected in bundle mode")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Switch to buckets-only mode" })
    ).toBeInTheDocument();
  });
});

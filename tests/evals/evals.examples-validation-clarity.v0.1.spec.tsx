import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

function getModeSelect(): HTMLSelectElement {
  return screen.getAllByRole("combobox")[0] as HTMLSelectElement;
}

function getInputTextarea(): HTMLTextAreaElement {
  return screen.getByPlaceholderText(/evalRunVersion/) as HTMLTextAreaElement;
}

describe("Evals examples + validation clarity v0.1", () => {
  it("renames the example action to synthetic example", () => {
    render(<EvalsPageClientV0_1 />);

    expect(
      screen.getByRole("button", { name: "Load synthetic example" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Load example" })
    ).not.toBeInTheDocument();
  });

  it("clarifies bundle-mode handling for raw bucket input", () => {
    render(<EvalsPageClientV0_1 />);

    fireEvent.change(getModeSelect(), {
      target: { value: "run_bundle" },
    });

    fireEvent.change(getInputTextarea(), {
      target: {
        value:
          '{"V1":["wide"],"V2":["stone"],"V3":["room"],"V4":["center"],"V5":["river"],"V6":["blade"],"V7":["point"]}',
      },
    });

    expect(
      screen.getByText("Buckets detected in bundle mode")
    ).toBeInTheDocument();

    expect(document.body.textContent).toContain(
      "Scoring and PDF export will auto-wrap into"
    );

    expect(
      screen.getByRole("button", { name: "Switch to buckets-only mode" })
    ).toBeInTheDocument();
  });
});

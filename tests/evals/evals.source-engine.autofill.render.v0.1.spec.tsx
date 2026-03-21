import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

describe("Evals source-engine autofill render v0.1", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fills sourceEngine* inputs from runtime provenance endpoint", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        sourceEngineId: "analyze-v1",
        sourceEngineVersion: "v1.0.0",
        sourceEngineBuild: "15656f9",
      }),
    } as Response);

    render(<EvalsPageClientV0_1 />);

    fireEvent.click(screen.getByRole("button", { name: "Autofill analyze-v1" }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("e.g. zero-api")).toHaveValue("analyze-v1");
    });

    expect(screen.getByPlaceholderText("e.g. analyze-v1")).toHaveValue("v1.0.0");
    expect(screen.getByPlaceholderText("e.g. 845bb5a")).toHaveValue("15656f9");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/evals/source-engine-provenance",
      expect.objectContaining({
        method: "GET",
        cache: "no-store",
      })
    );
  });

  it("clears sourceEngine* inputs without touching the runtime fetch path", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        sourceEngineId: "analyze-v1",
        sourceEngineVersion: "v1.0.0",
        sourceEngineBuild: "15656f9",
      }),
    } as Response);

    render(<EvalsPageClientV0_1 />);

    const clearBtn = screen.getByRole("button", { name: "Clear sourceEngine*" });
    expect(clearBtn).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Autofill analyze-v1" }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("e.g. zero-api")).toHaveValue("analyze-v1");
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear sourceEngine*" }));

    expect(screen.getByPlaceholderText("e.g. zero-api")).toHaveValue("");
    expect(screen.getByPlaceholderText("e.g. analyze-v1")).toHaveValue("");
    expect(screen.getByPlaceholderText("e.g. 845bb5a")).toHaveValue("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

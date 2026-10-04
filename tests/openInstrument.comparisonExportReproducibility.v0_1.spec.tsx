require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { webcrypto } from "node:crypto";
import { GET } from "../app/api/analyze-v1/route";
import { stableStringify } from "../src/shared/engineContract.v1";
import {
  buildReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
} from "../src/shared/openInstrument/reproducibleRunBundle.v0_1";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import {
  buildComparisonExportArtifactV0_1,
  parseComparisonExportArtifactV0_1,
  serializeComparisonExportArtifactV0_1,
} from "../src/ui/instrument/comparisonExportReproducibility.v0_1";
import { projectRecentAnalysisResultsV0_1 } from "../src/ui/instrument/recentAnalysisResults.v0_1";
import { WordToWordStructuralAuthorityComparisonCard } from "../src/ui/instrument/sections/WordToWordStructuralAuthorityComparisonCard.v0_1";
import { downloadText } from "@/lib/downloadJson";

jest.mock("@/lib/downloadJson", () => ({
  downloadText: jest.fn(),
}));

const mockedDownloadText = downloadText as jest.MockedFunction<typeof downloadText>;

beforeAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: webcrypto,
  });
});

async function analyze(word: string): Promise<Record<string, unknown>> {
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);
  expect(response.status).toBe(200);
  return response.json();
}

async function bundle(result: Record<string, unknown>) {
  return buildReproducibleRunBundleV0_1({
    result,
    createdAt: "2026-10-04T00:00:00.000Z",
  });
}

async function artifactWithRecomputedFingerprint(
  artifact: Awaited<ReturnType<typeof buildComparisonExportArtifactV0_1>>,
) {
  const body = {
    artifactKind: artifact.artifactKind,
    schemaVersion: artifact.schemaVersion,
    comparisonContractId: artifact.comparisonContractId,
    left: (() => {
      const value = { ...artifact.left };
      delete value.createdAt;
      return value;
    })(),
    right: (() => {
      const value = { ...artifact.right };
      delete value.createdAt;
      return value;
    })(),
    sourceFingerprints: artifact.sourceFingerprints,
    comparison: artifact.comparison,
  };
  const digest = await webcrypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${stableStringify(body)}\n`),
  );
  const value = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return {
    ...artifact,
    artifactFingerprint: {
      ...artifact.artifactFingerprint,
      value,
    },
  };
}

function fileFrom(text: string): File {
  return {
    name: "comparison.json",
    text: async () => text,
  } as unknown as File;
}

describe("comparison export / reproducibility v0.1", () => {
  test("round-trips ordered source bundles and recomputes through the trusted comparison path", async () => {
    const study = await bundle(await analyze("study"));
    const stone = await bundle(await analyze("stone"));
    const artifact = await buildComparisonExportArtifactV0_1({
      left: study,
      right: stone,
    });

    const parsed = await parseComparisonExportArtifactV0_1(
      serializeComparisonExportArtifactV0_1(artifact),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.left.result.word).toBe("study");
    expect(parsed.value.right.result.word).toBe("stone");
    expect(parsed.value.sourceFingerprints.left).toEqual(study.fingerprint);
    expect(parsed.value.sourceFingerprints.right).toEqual(stone.fingerprint);
    expect(parsed.value.comparison.claimBoundary).toBe(
      "structural_authority_comparison_only",
    );

    const functionalStatus = parsed.value.comparison.rows.find(
      (row) => row.id === "functionalStatus",
    );
    expect(functionalStatus?.left.state).toBe("MISSING");
    expect(functionalStatus?.right.state).toBe("MISSING");

    const liveComparison = (await import("../src/ui/instrument/wordToWordComparison.v0_1"))
      .compareTelemetryViewModelsV0_1(
        adaptAnalysisToTelemetryVM(await analyze("study")),
        adaptAnalysisToTelemetryVM(await analyze("stone")),
      );
    expect(liveComparison.rows.find((row) => row.id === "functionalStatus")?.left.state).toBe(
      "VALUE",
    );
  });

  test("keeps LEFT/RIGHT order and rejects integrity or stored-projection tampering", async () => {
    const stone = await bundle(await analyze("stone"));
    const home = await bundle(await analyze("home"));
    const artifact = await buildComparisonExportArtifactV0_1({
      left: stone,
      right: home,
    });

    const reversed = await buildComparisonExportArtifactV0_1({
      left: home,
      right: stone,
    });
    expect(reversed.left.result.word).toBe("home");
    expect(reversed.right.result.word).toBe("stone");

    const tamperedSource = JSON.parse(serializeComparisonExportArtifactV0_1(artifact));
    tamperedSource.left.result.word = "changed";
    await expect(parseComparisonExportArtifactV0_1(tamperedSource)).resolves.toEqual({
      ok: false,
      reason: "INVALID_LEFT_SOURCE_BUNDLE",
    });

    const tamperedProjection = {
      ...artifact,
      comparison: {
        ...artifact.comparison,
        rows: artifact.comparison.rows.map((row) =>
          row.id === "voicePath"
            ? { ...row, relation: "DIFFERENT" as const }
            : row,
        ),
      },
    };
    const tamperedProjectionWithValidHash = await artifactWithRecomputedFingerprint(
      tamperedProjection,
    );
    await expect(
      parseComparisonExportArtifactV0_1(tamperedProjectionWithValidHash),
    ).resolves.toEqual({
      ok: false,
      reason: "STORED_PROJECTION_MISMATCH",
    });

    await expect(parseComparisonExportArtifactV0_1("not-json")).resolves.toEqual({
      ok: false,
      reason: "MALFORMED_JSON",
    });
  });

  test("adds local export and reopen controls without reanalysis", async () => {
    const stonePayload = await analyze("stone");
    const homePayload = await analyze("home");
    const recentResults = projectRecentAnalysisResultsV0_1(
      [{ id: "home-result", role: "assistant", instrumentPayload: homePayload }],
      adaptAnalysisToTelemetryVM,
    );

    const view = render(
      <WordToWordStructuralAuthorityComparisonCard
        current={adaptAnalysisToTelemetryVM(stonePayload)}
        currentPayload={stonePayload}
        recentResults={recentResults}
      />,
    );
    const card = screen.getByTestId("word-to-word-comparison");
    fireEvent.click(within(card).getByRole("button", { name: "Use current as LEFT" }));
    fireEvent.click(
      within(card).getByRole("button", { name: /Use home · recent #1 as RIGHT/ }),
    );
    global.fetch = jest.fn();
    fireEvent.click(within(card).getByRole("button", { name: "Export comparison" }));

    await waitFor(() => expect(mockedDownloadText).toHaveBeenCalledTimes(1));
    const serialized = mockedDownloadText.mock.calls[0]?.[1];
    expect(serialized).toEqual(expect.any(String));
    expect(serialized).toContain("open-instrument.comparison-export-reproducibility");
    expect(global.fetch).not.toHaveBeenCalled();

    view.unmount();
    render(<WordToWordStructuralAuthorityComparisonCard current={null} />);
    fireEvent.change(screen.getByLabelText("Open comparison artifact"), {
      target: { files: [fileFrom(serialized as string)] },
    });

    await waitFor(() =>
      expect(screen.getByTestId("comparison-slot-left")).toHaveTextContent("stone"),
    );
    expect(screen.getByTestId("comparison-slot-right")).toHaveTextContent("home");
    expect(screen.getByTestId("comparison-row-voicePath")).toHaveTextContent("EQUAL");
  });
});

'use client';

import React from "react";
import { downloadText } from "@/lib/downloadJson";
import {
  buildReproducibleRunBundleV0_1,
  parseReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
  type ReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";
import {
  buildComparisonExportArtifactV0_1,
  parseComparisonExportArtifactV0_1,
  serializeComparisonExportArtifactV0_1,
  type ComparisonExportArtifactV0_1,
} from "@/ui/instrument/comparisonExportReproducibility.v0_1";

export type ComparisonExportSideInputV0_1 = Readonly<{
  bundle?: ReproducibleRunBundleV0_1 | null;
  payload?: unknown | null;
  ipa?: string;
  targetSenseLabel?: string;
}>;

type Props = Readonly<{
  left: ComparisonExportSideInputV0_1 | null;
  right: ComparisonExportSideInputV0_1 | null;
  disabled?: boolean;
  onImport: (artifact: ComparisonExportArtifactV0_1) => void;
}>;

function hasSource(side: ComparisonExportSideInputV0_1 | null): boolean {
  return Boolean(side?.bundle) || (side?.payload !== undefined && side?.payload !== null);
}

async function materializeSourceBundle(
  side: ComparisonExportSideInputV0_1,
  label: "LEFT" | "RIGHT",
): Promise<ReproducibleRunBundleV0_1> {
  if (side.bundle) {
    const parsed = await parseReproducibleRunBundleV0_1(
      serializeReproducibleRunBundleV0_1(side.bundle),
    );
    if (!parsed.ok) throw new Error(`${label} source bundle is invalid`);
    return parsed.value;
  }
  if (side.payload === undefined || side.payload === null) {
    throw new Error(`${label} has no validated source result`);
  }
  return buildReproducibleRunBundleV0_1({
    result: side.payload,
    ...(side.ipa !== undefined ? { ipa: side.ipa } : {}),
    ...(side.targetSenseLabel !== undefined
      ? { targetSenseLabel: side.targetSenseLabel }
      : {}),
  });
}

export function ComparisonExportReproducibilityControlsV0_1({
  left,
  right,
  disabled = false,
  onImport,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const ready = hasSource(left) && hasSource(right);

  async function handleExport() {
    if (!left || !right || !ready) {
      setError("Select two source results before exporting a comparison.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const artifact = await buildComparisonExportArtifactV0_1({
        left: await materializeSourceBundle(left, "LEFT"),
        right: await materializeSourceBundle(right, "RIGHT"),
      });
      downloadText(
        "open-instrument-comparison-v0.1.json",
        serializeComparisonExportArtifactV0_1(artifact),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Comparison export failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const parsed = await parseComparisonExportArtifactV0_1(await file.text());
      if (!parsed.ok) {
        setError(`Unable to open comparison: ${parsed.reason}`);
        return;
      }
      onImport(parsed.value);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Comparison import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="mt-4 rounded-lg border border-[#303a45] bg-[#10161e] p-3"
      data-testid="comparison-export-controls"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ea4ba]">
            Comparison artifact
          </div>
          <p className="mt-1 text-xs text-[#9eacb9]">
            Export or reopen the exact ordered LEFT/RIGHT comparison locally.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={disabled || busy || !ready}
            className="rounded border border-[#355a7a] bg-[#111a24] px-3 py-2 text-xs font-semibold text-[#cfe6ff] hover:border-[#66809a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Working…" : "Export comparison"}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || busy}
            className="rounded border border-[#394553] px-3 py-2 text-xs font-semibold text-[#b8c3cf] hover:border-[#66809a] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Open comparison
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            aria-label="Open comparison artifact"
            className="hidden"
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>
      {!ready ? (
        <p className="mt-2 text-[11px] text-[#778896]">
          Select two established results before exporting.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 break-words text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

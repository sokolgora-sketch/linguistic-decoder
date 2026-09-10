"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/downloadJson";
import {
  buildReproducibleRunBundleV0_1,
  parseReproducibleRunBundleV0_1,
  projectAnalyzeV1ForReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
  type ReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";
import { MT } from "@/ui/typography/marketingType.v0.1";

type Props = {
  payload: unknown;
  completedInput?: {
    ipa?: string;
    targetSenseLabel?: string;
  };
  disabled?: boolean;
  onImport: (bundle: ReproducibleRunBundleV0_1) => void;
};

function exportablePayload(payload: unknown): boolean {
  try {
    projectAnalyzeV1ForReproducibleRunBundleV0_1(payload);
    return true;
  } catch {
    return false;
  }
}

function importError(reason: string): string {
  switch (reason) {
    case "malformed_json":
      return "The saved analysis file is not valid JSON.";
    case "unsupported_schema_version":
      return "This saved analysis version is not supported.";
    case "fingerprint_mismatch":
      return "The saved analysis fingerprint does not match its contents.";
    case "invalid_bundle_shape":
      return "The saved analysis file is not a valid Open Instrument bundle.";
    default:
      return "The saved analysis file could not be opened.";
  }
}

export function ReproducibleRunBundleControls({
  payload,
  completedInput,
  disabled = false,
  onImport,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const canExport = React.useMemo(() => exportablePayload(payload), [payload]);
  const controlsDisabled = disabled || busy;

  async function handleDownload() {
    if (!canExport || controlsDisabled) return;

    setBusy(true);
    setError(null);
    try {
      const bundle = await buildReproducibleRunBundleV0_1({
        result: payload,
        ...completedInput,
      });
      const serialized = serializeReproducibleRunBundleV0_1(bundle);
      const safeWord = bundle.result.word.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "analysis";
      downloadText(`open-instrument-${safeWord}.json`, serialized);
    } catch {
      setError("This analysis cannot be downloaded as a saved analysis.");
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || controlsDisabled) return;

    setBusy(true);
    setError(null);
    try {
      const parsed = await parseReproducibleRunBundleV0_1(await file.text());
      if (!parsed.ok) {
        setError(importError(parsed.reason));
        return;
      }
      onImport(parsed.value);
    } catch {
      setError("The saved analysis file could not be read.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-label="Saved analysis"
      className="rounded-[12px] border border-[#2f3742] bg-[#10161e] p-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`${MT.fieldLabel} text-[11px] text-[#8ea4ba]`}>
          Local snapshot
        </span>
        {canExport ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleDownload()}
            disabled={controlsDisabled}
            aria-busy={controlsDisabled ? "true" : "false"}
          >
            Download analysis
          </Button>
        ) : null}
        <label
          htmlFor="open-instrument-saved-analysis"
          tabIndex={controlsDisabled ? -1 : 0}
          aria-disabled={controlsDisabled ? "true" : "false"}
          onKeyDown={(event) => {
            if (controlsDisabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Open saved analysis
        </label>
        <input
          ref={inputRef}
          id="open-instrument-saved-analysis"
          type="file"
          accept="application/json,.json"
          aria-label="Open saved analysis"
          className="sr-only"
          onChange={(event) => void handleFileChange(event)}
          disabled={controlsDisabled}
        />
      </div>
      <div className="mt-2 text-xs text-[#9fb1bf]">
        Local JSON snapshot only; opening it does not run analysis again.
      </div>
      {error ? (
        <div role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </div>
      ) : null}
    </section>
  );
}

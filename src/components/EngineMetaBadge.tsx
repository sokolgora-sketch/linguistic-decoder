// src/components/EngineMetaBadge.tsx
import React from "react";
import { buildEngineMetaSummary } from "../lib/engineMetaSummary";

type Props = {
  // We keep this loose on purpose – no type drama in the main UI.
  result: any | null;
  className?: string;
};

export function EngineMetaBadge({ result, className }: Props) {
  if (!result) return null;

  const summary = buildEngineMetaSummary({
    engineVersion:
      result.core?.engineVersion ??
      result.engineVersion ??
      result.core?.snapshot?.engineVersion ??
      result.snapshot?.engineVersion,
    mode:
      result.core?.input?.mode ??
      result.input?.mode ??
      result.mode,
    alphabet:
      result.core?.input?.alphabet ??
      result.input?.alphabet,
  });

  if (summary === "unknown") return null;

  return (
    <div
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground " +
        (className ?? "")
      }
    >
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span>{summary}</span>
    </div>
  );
}

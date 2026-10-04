'use client';

import React from "react";
import type { TelemetryViewModel } from "@/ui/telemetry/types";
import {
  compareTelemetryViewModelsV0_1,
  type ComparisonProjectionV0_1,
  type ComparisonSideV0_1,
} from "@/ui/instrument/wordToWordComparison.v0_1";
import { MT } from "@/ui/typography/marketingType.v0.1";

type StoredResult = Readonly<{
  word: string;
  vm: TelemetryViewModel;
}>;

type Props = Readonly<{
  current: TelemetryViewModel | null;
}>;

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((item) => typeof item === "string")) {
      return value.join(" → ");
    }
    if (value.every((item) => typeof item === "number")) {
      return `[${value.join(", ")}]`;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  if (typeof value === "string") return value || "\"\"";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatSide(side: ComparisonSideV0_1): string {
  if (side.state === "VALUE" || side.state === "EMPTY_VALID") {
    return `${side.state}: ${formatValue(side.value)}`;
  }
  return side.reason ? `${side.state}: ${side.reason}` : side.state;
}

function relationLabel(relation: ComparisonProjectionV0_1["rows"][number]["relation"]): string {
  return relation;
}

function ResultSlot({
  label,
  result,
  onClear,
}: {
  label: string;
  result: StoredResult | null;
  onClear: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#303a45] bg-[#10161e] p-3" data-testid={`comparison-slot-${label.toLowerCase()}`}>
      <div className={`${MT.fieldLabel} text-[11px] text-[#8ea4ba]`}>{label}</div>
      {result ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="break-words text-sm font-semibold text-[#f5f7fb]">{result.word}</span>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded border border-[#394553] px-2 py-1 text-[11px] text-[#b8c3cf] hover:border-[#66809a] hover:text-white"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="mt-2 text-sm text-[#8d9aa8]">No result selected.</div>
      )}
    </div>
  );
}

function ComparisonRows({ projection }: { projection: ComparisonProjectionV0_1 }) {
  return (
    <div className="space-y-2" data-testid="word-comparison-rows">
      {projection.rows.map((comparisonRow) => (
        <div
          key={comparisonRow.id}
          className="grid gap-2 rounded-lg border border-[#2c3540] bg-[#10161e] p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto_minmax(0,1.35fr)] md:items-center"
          data-testid={`comparison-row-${comparisonRow.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`}
        >
          <div className="text-xs font-semibold text-[#c5ced8]">{comparisonRow.label}</div>
          <div className="break-words font-mono text-[11px] text-[#d9e3ed]">{formatSide(comparisonRow.left)}</div>
          <div className="rounded border border-[#355a7a] bg-[#111a24] px-2 py-1 text-center font-mono text-[10px] font-semibold text-[#cfe6ff]">
            {relationLabel(comparisonRow.relation)}
          </div>
          <div className="break-words font-mono text-[11px] text-[#d9e3ed]">{formatSide(comparisonRow.right)}</div>
        </div>
      ))}
    </div>
  );
}

export function WordToWordStructuralAuthorityComparisonCard({ current }: Props) {
  const [left, setLeft] = React.useState<StoredResult | null>(null);
  const [right, setRight] = React.useState<StoredResult | null>(null);

  const projection = React.useMemo(
    () => (left && right ? compareTelemetryViewModelsV0_1(left.vm, right.vm) : null),
    [left, right],
  );

  const currentWord = current?.readout.word ?? null;
  const setCurrent = (side: "left" | "right") => {
    if (!current) return;
    const result = { word: currentWord ?? "not emitted", vm: current };
    if (side === "left") setLeft(result);
    else setRight(result);
  };

  return (
    <section
      aria-label="ZË-RO structural and authority comparison"
      className="rounded-[14px] border border-[#2f3742] bg-[#13171d] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] sm:p-5"
      data-testid="word-to-word-comparison"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className={`${MT.sectionLabel} text-[#8ea4ba]`}>ZË-RO structural / authority comparison</div>
          <h2 className="mt-2 text-lg font-semibold text-[#f5f7fb]">Compare two established results</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#b8c3cf]">
            This comparison reports established structural, authority, status, and provenance differences. It does not assign semantic meaning, historical origin, or a winner.
          </p>
        </div>
        {current ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCurrent("left")}
              className="rounded border border-[#355a7a] bg-[#111a24] px-3 py-2 text-xs font-semibold text-[#cfe6ff] hover:border-[#66809a]"
            >
              Use current as LEFT
            </button>
            <button
              type="button"
              onClick={() => setCurrent("right")}
              className="rounded border border-[#355a7a] bg-[#111a24] px-3 py-2 text-xs font-semibold text-[#cfe6ff] hover:border-[#66809a]"
            >
              Use current as RIGHT
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ResultSlot label="LEFT" result={left} onClear={() => setLeft(null)} />
        <ResultSlot label="RIGHT" result={right} onClear={() => setRight(null)} />
      </div>

      {projection ? (
        <div className="mt-4">
          <div className="mb-2 grid gap-2 px-1 text-[10px] uppercase tracking-[0.16em] text-[#7f93a6] md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto_minmax(0,1.35fr)]">
            <span>Field</span>
            <span>LEFT</span>
            <span>Relation</span>
            <span>RIGHT</span>
          </div>
          <ComparisonRows projection={projection} />
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-[#394553] px-4 py-3 text-sm text-[#9eacb9]">
          Analyze and assign two results to compare their exact structural and authority fields.
        </div>
      )}
    </section>
  );
}

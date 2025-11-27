
"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { HistoryEntry } from "@/shared/history";
import { VOICE_COLOR_MAP } from "@/shared/voiceColors";
import type { Vowel } from "@/shared/engineShape";

type Props = {
  history: HistoryEntry[];
};

const LEVEL_LABEL: Record<string, string> = {
  low: "Low",
  mid: "Mid",
  high: "High",
};

export function ComparePanel({ history }: Props) {
  const [leftId, setLeftId] = useState<string | undefined>();
  const [rightId, setRightId] = useState<string | undefined>();

  const left = useMemo(
    () => history.find((h) => h.id === leftId),
    [history, leftId],
  );
  const right = useMemo(
    () => history.find((h) => h.id === rightId),
    [history, rightId],
  );

  const canCompare = !!left && !!right && left.id !== right.id;

  const primarySummary = (entry?: HistoryEntry) => {
    if (!entry) return null;
    const { core, math7 } = entry.result;
    const p = core.primaryPath;
    const heart = math7?.heart;
    const coreMath = math7?.primary;

    return {
      voicePath: p.voicePath, // already "U → I"
      levelPath: p.levelPath, // "low → high"
      ringPath: p.ringPath,   // "1 → 1"
      state: coreMath?.cycleState,
      totalMod7: coreMath?.totalMod7,
      principlesPath:
        coreMath?.principlesPath?.join(" → "),
      heartPrinciple: heart?.principle ?? "—",
      heartVoices: heart?.voices?.join(" → ") ?? "",
    };
  };

  const leftSummary = primarySummary(left);
  const rightSummary = primarySummary(right);

  const diffLabel = (field: keyof NonNullable<typeof leftSummary>) => {
    if (!leftSummary || !rightSummary) return "";
    const l = leftSummary[field];
    const r = rightSummary[field];
    if (l === r) return "SAME";
    return "DIFFERENT";
  };

  const renderDot = (vowel: string | undefined) => {
    if (!vowel) return null;
    const color = VOICE_COLOR_MAP[vowel as Vowel];
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
        style={{ backgroundColor: color ?? "transparent", color: "#020617" }}
      >
        {vowel}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Two Words</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pick words */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-xs uppercase text-slate-400">Left word</div>
            <Select
              value={leftId}
              onValueChange={(v) => setLeftId(v === rightId ? rightId : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose from history" />
              </SelectTrigger>
              <SelectContent>
                {history.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.word}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase text-slate-400">Right word</div>
            <Select
              value={rightId}
              onValueChange={(v) => setRightId(v === leftId ? leftId : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose from history" />
              </SelectTrigger>
              <SelectContent>
                {history.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.word}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!canCompare && (
          <p className="text-xs text-slate-500">
            Pick two different words from history to see a side-by-side
            comparison.
          </p>
        )}

        {canCompare && left && right && leftSummary && rightSummary && (
          <>
            {/* Side by side core summary */}
            <div className="grid gap-4 md:grid-cols-2">
              <MiniSummaryCard
                label="Left"
                entry={left}
                summary={leftSummary}
                align="right"
              />
              <MiniSummaryCard
                label="Right"
                entry={right}
                summary={rightSummary}
                align="left"
              />
            </div>

            {/* Differences */}
            <Card className="border-dashed bg-slate-950/40">
              <CardContent className="space-y-1.5 p-4 text-xs">
                <div className="font-semibold text-slate-200">
                  Quick differences
                </div>
                <DiffLine
                  label="Primary voice path"
                  left={leftSummary.voicePath}
                  right={rightSummary.voicePath}
                  status={diffLabel("voicePath")}
                />
                <DiffLine
                  label="Level path"
                  left={leftSummary.levelPath}
                  right={rightSummary.levelPath}
                  status={diffLabel("levelPath")}
                />
                <DiffLine
                  label="Ring path"
                  left={leftSummary.ringPath}
                  right={rightSummary.ringPath}
                  status={diffLabel("ringPath")}
                />
                <DiffLine
                  label="Core principles path"
                  left={leftSummary.principlesPath}
                  right={rightSummary.principlesPath}
                  status={diffLabel("principlesPath")}
                />
                <DiffLine
                  label="Heart principle"
                  left={leftSummary.heartPrinciple}
                  right={rightSummary.heartPrinciple}
                  status={diffLabel("heartPrinciple")}
                />
              </CardContent>
            </Card>

            {/* Small legend */}
            <p className="text-[10px] text-slate-500">
              This panel is read-only. It uses cached analyses from the current
              session; re-run a word above if you want to refresh its math or
              candidates.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

type MiniSummaryProps = {
  label: string;
  entry: HistoryEntry;
  summary: NonNullable<ReturnType<typeof primarySummary>>;
  align: "left" | "right";
};

function MiniSummaryCard({ label, entry, summary, align }: MiniSummaryProps) {
  const meta = entry.result.core.input;
  const primary = entry.result.core.primaryPath;

  return (
    <Card className="border-slate-600/40 bg-slate-950/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
          <span>{label}</span>
          <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
        </div>
        <CardTitle className="flex items-center gap-2 text-sm">
          {entry.word}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 text-xs">
        <Line label="Primary path" value={primary.voicePath} />
        <Line label="Levels" value={primary.levelPath} />
        <Line label="Rings" value={primary.ringPath} />
        <Line label="Core principle" value={summary.principlesPath} />
        <Line
          label="Heart principle"
          value={`${summary.heartPrinciple} ${
            summary.heartVoices ? `(${summary.heartVoices})` : ""
          }`}
        />
        <Line label="Core state" value={summary.state ?? meta?.state ?? "—"} />
      </CardContent>
    </Card>
  );
}

function Line({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono text-slate-200">{value ?? "—"}</span>
    </div>
  );
}

function DiffLine({
  label,
  left,
  right,
  status,
}: {
  label: string;
  left: string | number | null | undefined;
  right: string | number | null | undefined;
  status: string;
}) {
  const same = status === "SAME";
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-slate-400">{label}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            same ? "bg-emerald-900/60 text-emerald-200" : "bg-amber-900/60 text-amber-200"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="grid gap-2 text-[11px] md:grid-cols-2">
        <span className="font-mono text-slate-200">L: {left ?? '—'}</span>
        <span className="font-mono text-slate-200">R: {right ?? '—'}</span>
      </div>
    </div>
  );
}

const primarySummary = (entry?: HistoryEntry) => {
    if (!entry) return null;
    const { core, math7 } = entry.result;
    const p = core.primaryPath;
    const heart = math7?.heart;
    const coreMath = math7?.primary;

    return {
      voicePath: p.voicePath, // already "U → I"
      levelPath: p.levelPath, // "low → high"
      ringPath: p.ringPath,   // "1 → 1"
      state: coreMath?.cycleState,
      totalMod7: coreMath?.totalMod7,
      principlesPath:
        coreMath?.principlesPath?.join(" → "),
      heartPrinciple: heart?.principle ?? "—",
      heartVoices: heart?.voices?.join(" → ") ?? "",
    };
  };

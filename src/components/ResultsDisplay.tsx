'use client';

import React, { useMemo } from "react";
import { Card } from "./ui/card";
import type { CClass } from "../functions/languages";
import { classRange } from "../functions/languages";
import type {
  EnginePayload,
  AnalysisResult_DEPRECATED,
  Vowel,
} from "../shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { VOICE_COLOR_MAP } from "../shared/voiceColors";
import WhyThisPath from "./WhyThisPath";
import { Candidates } from "./Candidates";
import { PrinciplesBlock } from "./PrinciplesBlock";
import { SymbolicReadingCard } from "./SymbolicReadingCard";
import { Button } from "@/components/ui/button";
import { downloadJson } from "@/lib/downloadJson";

const LEVEL_LABEL: Record<number, string> = {
  1: "High",
  0: "Mid",
  [-1]: "Low",
} as any;

function ConsonantInfo({ analysis }: { analysis: AnalysisResult_DEPRECATED }) {
  const windows = analysis.core.consonants.clusters?.map((c) => c.cluster) || [];
  const windowClasses =
    analysis.core.consonants.clusters?.map((c) => c.classes[0]) || [];
  const ringPath = analysis.core.voices.ringPath;
  const edgeWindows = analysis.debug?.rawEnginePayload?.edgeWindows || [];

  const hasInteriorWindows = windows.length > 0;
  const hasEdgeWindows = edgeWindows.length > 0;

  if (!hasInteriorWindows && !hasEdgeWindows) {
    return null;
  }

  return (
    <div className="mt-2.5">
      <h4 className="mb-1 text-xs text-slate-500">Consonant Influence</h4>

      {hasInteriorWindows && (
        <div className="flex flex-col gap-1.5">
          {windows.map((w, i) => {
            const cClass = windowClasses[i] as CClass;
            const [lo, hi] = classRange(cClass);
            let hopInfo = "";
            if (ringPath && i < ringPath.length - 1) {
              const delta = Math.abs(ringPath[i + 1] - ringPath[i]);
              const isOptimal = delta >= lo && delta <= hi;
              hopInfo = `|Δring| = ${delta} ${isOptimal ? "✓" : "✗"}`;
            }

            return (
              <Card
                key={i}
                className="flex items-center justify-between p-2.5 text-sm font-code"
              >
                <span>
                  '{w}' is{" "}
                  <span className="font-semibold">{cClass}</span> (prefers{" "}
                  {lo}–{hi})
                </span>
                <span className="font-semibold">{hopInfo}</span>
              </Card>
            );
          })}
        </div>
      )}

      {hasEdgeWindows && (
        <div className="mt-2 border-t pt-2 text-xs text-muted-foreground">
          <b>Edge:</b> {edgeWindows.join(" · ")}
        </div>
      )}
    </div>
  );
}

export function PathRow({
  title,
  block,
  analysis,
}: {
  title: string;
  block: any;
  analysis: AnalysisResult_DEPRECATED;
}) {
  if (!block || !block.voicePath || !block.voicePath.length) {
    return (
      <Card className="p-4">
        <h3 className="mb-2 text-sm font-bold tracking-wide">{title}</h3>
        <div className="text-xs opacity-60">— no path —</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="mb-2 text-sm font-bold tracking-wide">{title}</h3>

      <div className="flex flex-wrap items-center gap-2">
        {block.voicePath.map((v: Vowel, i: number) => (
          <React.Fragment key={`v-${i}`}>
            <Chip v={v} />
            {i < block.voicePath.length - 1 && <Arrow />}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        <InfoLine
          label="Voice Path"
          value={block.voicePath.join(" → ")}
        />
        <InfoLine
          label="Level Path"
          value={block.levelPath.map((l: number) => LEVEL_LABEL[l]).join(" → ")}
        />
        <InfoLine label="Ring Path" value={block.ringPath.join(" → ")} />
      </div>

      {title === "Primary Path" && <ConsonantInfo analysis={analysis} />}
    </Card>
  );
}

function InfoLine({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-1 p-2.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`font-semibold ${mono ? "font-code" : ""}`}>
        {value || "—"}
      </span>
    </Card>
  );
}

const Arrow = () => (
  <span className="font-bold text-muted-foreground">→</span>
);

const Chip = ({ v }: { v: string | number }) => {
  const chipStyle =
    v in VOICE_COLOR_MAP
      ? { backgroundColor: VOICE_COLOR_MAP[v as Vowel], color: "#020617" }
      : {};
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 py-1 px-2.5 text-sm font-bold"
      style={chipStyle}
    >
      {String(v)}
    </span>
  );
};

export function ResultsDisplay({ analysis: raw }: { analysis: EnginePayload }) {
  const analysis = useMemo(
    () => enginePayloadToAnalysisResult(raw),
    [raw],
  );

  if (!analysis) return null;

  const { core, candidates, symbolic } = analysis;
  const voices = core?.voices;
  const hasPrimaryVoices =
    voices?.vowelVoices && voices.vowelVoices.length > 0;

  const handleExportJson = () => {
    if (!analysis) return;

    const rawWord = core?.word || "analysis";
    const safeWord =
      String(rawWord)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-") || "analysis";

    downloadJson(`analysis-${safeWord}.json`, analysis);
  };

  const hasCandidates = Array.isArray(candidates) && candidates.length > 0;
  const hasSymbolic = !!symbolic;
  const hasFrontier =
    core?.heartPaths?.frontierCount &&
    core.heartPaths.frontierCount > 0 &&
    Array.isArray(raw.frontierPaths) &&
    raw.frontierPaths.length > 0;

  const nothingStructured =
    !hasPrimaryVoices && !hasCandidates && !hasSymbolic && !hasFrontier;

  return (
    <div className="space-y-4">
      {/* Primary path */}
      {hasPrimaryVoices && (
        <PathRow
          title="Primary Path"
          analysis={analysis}
          block={{
            voicePath: voices.vowelVoices,
            ringPath: voices.ringPath || [],
            levelPath:
              voices.levelPath?.map((l: string) =>
                l === "high" ? 1 : l === "low" ? -1 : 0,
              ) || [],
          }}
        />
      )}

      {/* Why this path + principles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WhyThisPath primary={raw.primaryPath} />
        <PrinciplesBlock analysis={analysis} />
      </div>

      {/* Candidates */}
      {hasCandidates && <Candidates candidates={candidates} />}

      {/* Symbolic reading */}
      {hasSymbolic && <SymbolicReadingCard symbolic={symbolic} />}

      {/* Frontier alternates */}
      {hasFrontier && (
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-bold tracking-wide">
            Frontier (near-optimal alternates)
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {raw.frontierPaths.map((f, idx) => {
              const altVoice = f.voicePath?.[0];
              const altBadgeStyle =
                altVoice && altVoice in VOICE_COLOR_MAP
                  ? {
                      backgroundColor: VOICE_COLOR_MAP[altVoice as Vowel],
                      color: "#020617",
                    }
                  : {};

              return (
                <Card key={idx} className="border-accent p-3">
                  <div className="mb-2 flex items-center gap-2 font-bold">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                      style={altBadgeStyle}
                    >
                      {altVoice ?? "?"}
                    </div>
                    {`alt-${idx}`}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {f.voicePath?.map((v: Vowel, i: number) => (
                      <React.Fragment key={i}>
                        <Chip v={v} />
                        {i < f.voicePath.length - 1 && <Arrow />}
                      </React.Fragment>
                    ))}
                  </div>

                  <hr className="my-2 border-border" />

                  <div className="mt-1.5 text-xs text-slate-500">
                    Levels:{" "}
                    {f.levelPath
                      ?.map((l: number) => LEVEL_LABEL[l])
                      .join(" → ")}
                  </div>
                  <div className="text-xs text-slate-500">
                    Rings: {f.ringPath?.join(" → ")}
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {/* Fallback: show raw analysis if nothing else is structured */}
      {nothingStructured && (
        <Card className="mt-2 p-4">
          <p className="text-xs text-muted-foreground">
            No structured analysis fields were available for this word. Raw
            output:
          </p>
          <pre className="mt-2 max-h-64 overflow-auto rounded bg-black/40 p-2 text-[11px] leading-snug text-slate-100">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </Card>
      )}

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={handleExportJson}>
          Export JSON
        </Button>
      </div>
    </div>
  );
}

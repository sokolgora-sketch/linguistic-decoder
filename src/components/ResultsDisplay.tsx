"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Candidates } from "./Candidates";
import { FrontierCandidates } from "./FrontierCandidates"; // ignore if missing
import { EngineMetaCard } from "./EngineMetaCard";
import WordMatrixCard from "./WordMatrixCard";
import { buildWordMatrixUI } from "@/lib/wordMatrix";
import { buildEngineMetaSummary } from "../lib/engineMetaSummary";
import type { AnalyzeWordResultUI } from "../shared/resultsUI";
import WordMatrixLegend from "./WordMatrixLegend";
import { HeartInstrumentV1Section } from "@/components/heart/HeartInstrumentV1Section";

type ResultsDisplayProps = {
  analysis: AnalyzeWordResultUI | null;
};

export function ResultsDisplay({ analysis }: ResultsDisplayProps) {
  if (!analysis) return null;
const wordMatrixSummary = analysis ? buildWordMatrixUI(analysis) : null;
const engineMetaSummary = buildEngineMetaSummary(analysis?.meta);

  return (
    <div className="space-y-6">
      {/* HEART SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle>Heart summary</CardTitle>
          <CardDescription>
            Primary Seven-vowel path for <b>{analysis.word}</b>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex flex-wrap gap-6">
            <div>
              <b>Vowel path</b>
              <div>{analysis.primaryPath?.voicePath || "—"}</div>
            </div>
            <div>
              <b>Level path</b>
              <div>{analysis.primaryPath?.levelPath || "—"}</div>
            </div>
            <div>
              <b>Ring path</b>
              <div>{analysis.primaryPath?.ringPath || "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {wordMatrixSummary && (
        <>
          <WordMatrixCard summary={wordMatrixSummary} />
          <WordMatrixLegend />
        </>
      )}

      {/* ENGINE META */}
      <EngineMetaCard summary={engineMetaSummary} />

      {/* HEART INSTRUMENT */}
      {analysis?.heartInstrumentV1 ? (
        <HeartInstrumentV1Section data={analysis.heartInstrumentV1} />
      ) : null}

      {/* FRONTIER */}
      <Card>
        <CardHeader>
          <CardTitle>Frontier candidates</CardTitle>
          <CardDescription>
            Alternate legal paths the Mind can explore inside the same rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.frontier && Array.isArray(analysis.frontier) && (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr className="text-left">
                  <th className="py-2 pr-4 font-medium">ALT</th>
                  <th className="py-2 pr-4 font-medium">VOICE PATH</th>
                  <th className="py-2 pr-4 font-medium">LEVEL PATH</th>
                  <th className="py-2 pr-4 font-medium">RING PATH</th>
                </tr>
              </thead>
              <tbody>
                {analysis.frontier.map((f: any, idx: number) => (
                  <tr
                    key={f.id || idx}
                    className="border-b border-slate-900/40 last:border-none"
                  >
                    <td className="py-1 pr-4">{f.id}</td>
                    <td className="py-1 pr-4">{f.voicePath}</td>
                    <td className="py-1 pr-4">{f.levelPath}</td>
                    <td className="py-1 pr-4">{f.ringPath}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* CANON / LANGUAGE FAMILIES */}
      {analysis.languageFamilies && (
        <Card>
          <CardHeader>
            <CardTitle>Language families (canon layer)</CardTitle>
            <CardDescription>
              How different languages carry this Seven-vowel path.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr className="text-left">
                  <th className="py-2 pr-4 font-medium">Language</th>
                  <th className="py-2 pr-4 font-medium">Form</th>
                  <th className="py-2 pr-4 font-medium">Gloss</th>
                  <th className="py-2 pr-4 font-medium">Voice Path</th>
                  <th className="py-2 pr-4 font-medium">Passes</th>
                </tr>
              </thead>
              <tbody>
                {analysis.languageFamilies.map((f: any, i: number) => (
                  <tr key={i} className="border-b border-slate-900/4d last:border-none">
                    <td className="py-2 pr-4">{f.language || "—"}</td>
                    <td className="py-2 pr-4">{f.form || "—"}</td>
                    <td className="py-2 pr-4">{f.gloss || "—"}</td>
                    <td className="py-2 pr-4">{f.voicePath || "—"}</td>
                    <td className="py-2 pr-4">{f.passes ? "yes" : "no"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

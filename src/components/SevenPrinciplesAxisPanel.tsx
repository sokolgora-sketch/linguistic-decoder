'use client';

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type SevenPrinciplesAxisPanelProps = {
  // From AnalyzeWordResult.languageFamilies
  families?: any[] | null;
};

const PRINCIPLE_AXES = [
  { id: "love",        label: "Love / Relationship" },
  { id: "religion",    label: "Religion / Myth / Story" },
  { id: "mathematics", label: "Mathematics / Measure / Logic" },
  { id: "law",         label: "Law / Order / Rules" },
  { id: "power",       label: "Power / Conflict / Control" },
  { id: "creation",    label: "Creation / Art / Making" },
];

function SevenPrinciplesAxisPanel({ families }: SevenPrinciplesAxisPanelProps) {
  const axes = useMemo(() => {
    const counts: Record<string, { count: number; notes: string[] }> = {};

    // init buckets
    for (const axis of PRINCIPLE_AXES) {
      counts[axis.id] = { count: 0, notes: [] };
    }

    if (families) {
      for (const fam of families) {
        const symbolic = Array.isArray(fam?.symbolic) ? fam.symbolic : [];
        for (const tag of symbolic) {
          const key = String(tag?.axis || "").toLowerCase();
          if (!counts[key]) continue;

          counts[key].count += 1;

          if (tag?.note && !counts[key].notes.includes(tag.note)) {
            counts[key].notes.push(tag.note);
          }
        }
      }
    }

    const maxCount = Math.max(
      1,
      ...Object.values(counts).map((v) => v.count || 0),
    );

    return PRINCIPLE_AXES.map((axis) => {
      const data = counts[axis.id];
      const count = data?.count ?? 0;
      const widthPct = maxCount ? (count / maxCount) * 100 : 0;

      return {
        ...axis,
        count,
        widthPct,
        notesPreview: (data?.notes ?? [])[0] ?? "",
      };
    });
  }, [families]);

  const totalHits = axes.reduce((sum, a) => sum + a.count, 0);
  if (!totalHits) return null; // nothing to show, stay out of the way

  return (
    <Card className="mt-6 border border-slate-700/70 bg-slate-900/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-slate-100">
          Seven-Principles Overlay
        </CardTitle>
        <p className="mt-1 text-xs text-slate-400">
          How this word lights up your six principle-axes based on the symbolic tags.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {axes.map((axis) => (
          <div key={axis.id} className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-medium uppercase tracking-wide">
                {axis.label}
              </span>
              <span className="tabular-nums text-slate-400">
                {axis.count}
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-slate-800/80">
              <div
                className="h-1.5 rounded-full bg-emerald-400"
                style={{
                  width:
                    axis.count > 0
                      ? `${Math.max(axis.widthPct, 10)}%`
                      : "0%",
                }}
              />
            </div>

            {axis.notesPreview && (
              <p className="text-[10px] text-slate-500 line-clamp-2">
                {axis.notesPreview}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SevenPrinciplesAxisPanel;
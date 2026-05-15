"use client";

import type { UICandidateRow } from "@/ui/candidates/candidateModel";
import type { EvidenceLedgerModel } from "@/ui/ledger/ledgerModel";
import type { PresentOrMissing, RootMapVM, TelemetryReadout, Vowel } from "@/ui/telemetry/types";

function pomText<T>(pom: PresentOrMissing<T> | undefined, format: (value: T) => string): string {
  if (!pom) return "not emitted";
  if (pom.kind === "present") return format(pom.value);
  return "not emitted";
}

function vowelPathText(path: PresentOrMissing<Vowel[]> | undefined): string {
  return pomText(path, (vowels) => (vowels.length ? vowels.join("-") : "none"));
}

function sourceKindSummary(rows: UICandidateRow[]): string {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const kind = row.sourceKind?.trim();
    if (!kind) continue;
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }

  if (!counts.size) return "not emitted";

  return Array.from(counts.entries())
    .map(([kind, count]) => `${kind} x${count}`)
    .join(", ");
}

function emittedCandidatePathSummary(rows: UICandidateRow[]): string {
  const emitted = rows.filter((row) => row.vowelPath).length;
  return `${emitted}/${rows.length}`;
}

function rootMapStatus(rootMap: PresentOrMissing<RootMapVM> | undefined): string {
  if (!rootMap) return "not emitted";
  return rootMap.kind === "present" ? "present" : "not emitted";
}

function TraceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-right text-xs font-mono">{value}</div>
    </div>
  );
}

export function EvidenceTraceCard({
  readout,
  ledgerModel,
  candidateRows,
  rootMap,
}: {
  readout: TelemetryReadout;
  ledgerModel: EvidenceLedgerModel | null;
  candidateRows: UICandidateRow[] | null;
  rootMap: PresentOrMissing<RootMapVM> | undefined;
}) {
  const rows = candidateRows ?? [];
  const ledgerSections = Array.isArray(ledgerModel?.sections) ? ledgerModel.sections : [];
  const ledgerSources = ledgerSections.map((section) => `${section.source ?? section.key}: ${section.state}`);

  return (
    <section className="rounded-xl border p-4">
      <div className="text-sm font-semibold">Evidence trace</div>
      <div className="mt-1 text-xs text-muted-foreground">
        Compact map of emitted VM fields behind this readout.
      </div>

      <div className="mt-4 space-y-2">
        <TraceRow label="input word" value={readout.word ? `word=${readout.word}` : "not emitted"} />
        <TraceRow label="normalized form" value={`norm=${pomText(readout.normalizedWord, String)}`} />
        <TraceRow label="voice path" value={`path=${vowelPathText(readout.voicePath)}`} />
        <TraceRow label="surface path" value={`surface=${vowelPathText(readout.voicePathSurface)}`} />
        <TraceRow label="functional path" value={`functional=${vowelPathText(readout.voicePathFunctional)}`} />
        <TraceRow label="path delta" value={`delta=${readout.voicePathDelta}`} />
        <TraceRow label="candidate rows" value={`rows=${rows.length}`} />
        <TraceRow label="candidate source kinds" value={`sources=${sourceKindSummary(rows)}`} />
        <TraceRow label="candidate paths emitted" value={`paths=${rows.length ? emittedCandidatePathSummary(rows) : "not emitted"}`} />
        <TraceRow label="RootMap hypothesis" value={`rootMap=${rootMapStatus(rootMap)}`} />
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Ledger sources</div>
        {ledgerSources.length ? (
          <ul className="mt-2 space-y-1.5 text-xs text-neutral-300">
            {ledgerSources.map((source) => (
              <li key={source} className="font-mono">
                {source}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-xs text-muted-foreground">not emitted</div>
        )}
      </div>
    </section>
  );
}

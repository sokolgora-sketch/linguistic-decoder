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
    <div className="flex items-baseline justify-between gap-3 rounded-[8px] border border-[#27313d] bg-[#0d1117] px-3 py-2">
      <div className="min-w-0 break-words text-xs text-[#8ea4ba]">{label}</div>
      <div className="text-right text-xs font-mono text-[#f5f7fb]">{value}</div>
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
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase text-[#8ea4ba]">overview field trace</div>
        <div className="mt-1 text-base font-semibold text-[#f5f7fb]">Evidence trace</div>
        <div className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
          Compact inspection map of emitted VM fields behind this readout.
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
        <TraceRow label="input word" value={readout.word ? `word=${readout.word}` : "not emitted"} />
        <TraceRow label="normalized form" value={`norm=${pomText(readout.normalizedWord, String)}`} />
        <TraceRow label="voice path" value={`path=${vowelPathText(readout.voicePath)}`} />
        <TraceRow label="surface path" value={`surface=${vowelPathText(readout.voicePathSurface)}`} />
        <TraceRow label="functional path" value={`functional=${vowelPathText(readout.voicePathFunctional)}`} />
        <TraceRow label="path delta" value={`delta=${readout.voicePathDelta}`} />
        <TraceRow label="candidate rows emitted" value={`rows=${rows.length}`} />
        <TraceRow label="candidate provenance kinds" value={`provenance=${sourceKindSummary(rows)}`} />
        <TraceRow label="candidate vowel paths emitted" value={`paths=${rows.length ? emittedCandidatePathSummary(rows) : "not emitted"}`} />
        <TraceRow label="RootMap hypothesis" value={`rootMap=${rootMapStatus(rootMap)}`} />
      </div>

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
        <div className="text-[11px] font-semibold uppercase text-[#8ea4ba]">Ledger sources</div>
        {ledgerSources.length ? (
          <ul className="mt-2 space-y-1.5 text-xs text-[#d7dde7]">
            {ledgerSources.map((source) => (
              <li key={source} className="font-mono">
                {source}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-xs text-[#7d8ea3]">not emitted</div>
        )}
      </div>

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: VM field trace only; not a proof chain; no forced answer.
      </div>
    </section>
  );
}

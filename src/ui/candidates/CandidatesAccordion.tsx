import React, { useState } from "react";
import type { UICandidateRow } from "./candidateModel";
import { toPrettyJson } from "@/ui/instrument/prettyJson";

function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      className="max-w-full rounded-md border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
      onClick={() => navigator.clipboard.writeText(text)}
      type="button"
    >
      {label}
    </button>
  );
}

function CandidateChip({
  children,
  tone = "neutral",
  title,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red";
  title?: string;
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-400/40 bg-blue-500/10 text-blue-100"
      : tone === "green"
        ? "border-green-400/40 bg-green-500/10 text-green-100"
        : tone === "amber"
          ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
          : tone === "red"
            ? "border-red-400/40 bg-red-500/10 text-red-100"
            : "border-slate-700 bg-black/25 text-slate-300";

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-md border px-2 py-0.5 text-xs font-mono leading-5 break-all ${toneClass}`}
      title={title}
    >
      {children}
    </span>
  );
}

function gateTone(status: string | null | undefined): "neutral" | "green" | "amber" | "red" {
  if (status === "aligned") return "green";
  if (status === "misaligned") return "red";
  if (status === "insufficient") return "amber";
  return "neutral";
}

export function CandidatesAccordion({ rows }: { rows: UICandidateRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!rows.length) {
    return (
      <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
        <h2 className="text-base font-semibold text-slate-100">Candidates</h2>
        <div className="mt-2 text-sm text-slate-500">None emitted.</div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Candidates</h2>
          <div className="mt-1 text-xs text-slate-500">Inspection rows only. Provenance shows how a row entered the engine; alignment shows DeepRoot–Heart status.</div>
        </div>
        <CandidateChip tone="blue">{rows.length} emitted</CandidateChip>
      </div>

      <div className="space-y-2">
        {rows.map((c) => {
          const isOpen = openId === c.id;
          return (
            <div key={c.id} className="min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-black/25">
              <button
                type="button"
                className="w-full min-w-0 px-3 py-3 text-left transition hover:bg-slate-900/50"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : c.id)}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CandidateChip>{c.language}</CandidateChip>
                      {c.sourceKind ? (
                        <CandidateChip
                          title="Provenance: how this candidate entered the engine. SEED = entered by the researcher; not a discovered or proven result."
                        >
                          {`Provenance: ${c.sourceKind}`}
                        </CandidateChip>
                      ) : null}
                      {c.status ? <CandidateChip tone="amber">{c.status}</CandidateChip> : null}
                      <span className="break-all font-mono text-sm text-slate-100">{c.form}</span>
                    </div>

                    {c.functionalStatement ? (
                      <div className="break-words text-sm text-slate-400">
                        {c.functionalStatement}
                      </div>
                    ) : null}

                    {c.deepRootHeartGateStatus === "misaligned" &&
                     Array.isArray(c.deepRootHeartGateReasons) &&
                     c.deepRootHeartGateReasons.length ? (
                      <div className="break-all font-mono text-xs text-slate-500">
                        {c.deepRootHeartGateReasons.join(", ")}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                    {c.vowelPath ? (
                      <CandidateChip tone="blue">{c.vowelPath}</CandidateChip>
                    ) : (
                      <CandidateChip>vowel path not emitted</CandidateChip>
                    )}

                    {c.deepRootHeartGateStatus ? (
                      <CandidateChip
                        tone={gateTone(c.deepRootHeartGateStatus)}
                        title="DeepRoot–Heart alignment status for this candidate row."
                      >
                        {`Alignment: ${c.deepRootHeartGateStatus}`}
                      </CandidateChip>
                    ) : null}
                  </div>
                </div>

                {Array.isArray(c.deepRootHeartGateEvidenceRefs) && c.deepRootHeartGateEvidenceRefs.length ? (
                  <div className="mt-2 break-all font-mono text-xs text-slate-500">
                    Gate evidence: {c.deepRootHeartGateEvidenceRefs.join(", ")}
                  </div>
                ) : null}
              </button>

              {isOpen ? (
                <div className="border-t border-slate-800 bg-black/20 px-3 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-slate-500">
                      Deterministic inspection record.
                    </div>
                    <CopyButton
                      label="Copy Candidate JSON"
                      text={toPrettyJson(c.raw)}
                    />
                  </div>

                    {c.deepRootHeartGateStatus === "misaligned" ? (
                      <div className="mt-3 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-100">
                        <div>
                          Alignment: <span className="font-mono">misaligned</span>
                        </div>
                        {Array.isArray(c.deepRootHeartGateReasons) && c.deepRootHeartGateReasons.length ? (
                            <div className="mt-1 break-all font-mono">
                            {c.deepRootHeartGateReasons.join(", ")}
                          </div>
                        ) : (
                          <div className="mt-1 text-red-200/70">No reason codes emitted.</div>
                        )}
                      </div>
                    ) : null}

                  <pre className="mt-3 max-h-80 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md border border-slate-800 bg-black/35 p-3 text-xs text-slate-200">
{toPrettyJson(c.raw)}
                  </pre>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

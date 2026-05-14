import React, { useMemo, useState } from "react";
import type { UICandidateRow } from "./candidateModel";
import { toPrettyJson } from "@/ui/instrument/prettyJson";

function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      className="rounded-md border px-3 py-1 text-sm"
      onClick={() => navigator.clipboard.writeText(text)}
      type="button"
    >
      {label}
    </button>
  );
}

export function CandidatesAccordion({ rows }: { rows: UICandidateRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!rows.length) {
    return (
      <section className="rounded-xl border p-4">
        <h2 className="text-base font-semibold">Candidates</h2>
        <div className="mt-2 text-sm opacity-70">None emitted.</div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Candidates</h2>
        <div className="text-xs opacity-60">{rows.length} emitted</div>
      </div>

      <div className="space-y-2">
        {rows.map((c) => {
          const isOpen = openId === c.id;
          return (
            <div key={c.id} className="rounded-lg border">
              <button
                type="button"
                className="w-full px-3 py-2 text-left"
                onClick={() => setOpenId(isOpen ? null : c.id)}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border px-2 py-0.5 text-xs">
                    {c.language}
                  </span>
                  {c.sourceKind ? (
                    <span
                      className="rounded-md border px-2 py-0.5 text-xs font-mono opacity-70"
                      title="Provenance: how this candidate entered the engine. SEED = entered by the researcher; not a discovered or proven result."
                    >
                      {c.sourceKind}
                    </span>
                  ) : null}
                  {c.status ? (
                    <span className="rounded-md border px-2 py-0.5 text-xs opacity-80">
                      {c.status}
                    </span>
                  ) : null}
                  <span className="font-mono text-sm">{c.form}</span>
                  {c.vowelPath ? (
                    <span className="ml-auto font-mono text-xs opacity-80">
                      {c.vowelPath}
                    </span>
                  ) : (
                    <span className="ml-auto text-xs opacity-60">
                      Vowel path not emitted.
                    </span>
                  )}

                    {c.deepRootHeartGateStatus ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="rounded-md border px-2 py-0.5 text-xs opacity-80 font-mono">
                          {`Gate: ${c.deepRootHeartGateStatus}`}
                        {Array.isArray(c.deepRootHeartGateEvidenceRefs) && c.deepRootHeartGateEvidenceRefs.length ? (
                          <div className="mt-1 text-xs opacity-70">
                            Evidence: {c.deepRootHeartGateEvidenceRefs.join(", ")}
                          </div>
                        ) : null}
                        </span>

                        {c.deepRootHeartGateStatus === "misaligned" &&
                         Array.isArray(c.deepRootHeartGateReasons) &&
                         c.deepRootHeartGateReasons.length ? (
                          <span className="text-xs font-mono opacity-70">
                            {c.deepRootHeartGateReasons.join(", ")}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                </div>

                {c.functionalStatement ? (
                  <div className="mt-1 text-sm opacity-80">
                    {c.functionalStatement}
                  </div>
                ) : null}
              </button>

              {isOpen ? (
                <div className="border-t px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs opacity-60">
                      Deterministic view (no ranking).
                    </div>
                    <CopyButton
                      label="Copy Candidate JSON"
                      text={toPrettyJson(c.raw)}
                    />
                  </div>

                    {c.deepRootHeartGateStatus === "misaligned" ? (
                      <div className="mt-2 rounded-md border p-2 text-xs">
                        <div className="opacity-70">
                          Gate: <span className="font-mono">misaligned</span>
                        </div>
                        {Array.isArray(c.deepRootHeartGateReasons) && c.deepRootHeartGateReasons.length ? (
                          <div className="mt-1 font-mono">
                            {c.deepRootHeartGateReasons.join(", ")}
                          </div>
                        ) : (
                          <div className="mt-1 opacity-60">No reason codes emitted.</div>
                        )}
                      </div>
                    ) : null}

                  <pre className="mt-3 max-h-80 overflow-auto rounded-md border p-2 text-xs">
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

"use client";

type GateRowLike = {
  deepRootHeartGateStatus?: string | null;
  deepRootHeartGateReasons?: string[] | null;
};

type ReasonCount = { code: string; count: number };

function asStr(x: unknown): string | null {
  return typeof x === "string" && x.length ? x : null;
}
function asStrArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  const out: string[] = [];
  for (const v of x) if (typeof v === "string" && v.length) out.push(v);
  return out;
}

function buildSummary(rows: readonly GateRowLike[]) {
  let total = 0;
  let aligned = 0;
  let misaligned = 0;
  let insufficient = 0;
  let missing = 0;

  const reasonFreq = new Map<string, number>();

  for (const r of rows ?? []) {
    total++;
    const status = asStr((r as any)?.deepRootHeartGateStatus) ?? "missing";

    if (status === "aligned") aligned++;
    else if (status === "misaligned") misaligned++;
    else if (
      status === "insufficient_data" ||
      status === "insufficient"
    ) insufficient++;
    else missing++;

    if (status === "misaligned") {
      for (const code of asStrArray((r as any)?.deepRootHeartGateReasons)) {
        reasonFreq.set(code, (reasonFreq.get(code) ?? 0) + 1);
      }
    }
  }

  const topReasons: ReasonCount[] = Array.from(reasonFreq.entries())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code))
    .slice(0, 8);

  return { total, aligned, misaligned, insufficient, missing, topReasons };
}

export function DeepRootHeartGateSummaryCard(props: { rows: readonly GateRowLike[] }) {
  const rows = Array.isArray(props.rows) ? props.rows : [];
  const s = buildSummary(rows);

  return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-100">Gate Summary</h3>
          <div className="mt-1 font-mono text-xs text-slate-500">DeepRoot–Heart Alignment (per candidate)</div>
        </div>
        <div className="rounded-md border border-blue-400/40 bg-blue-500/10 px-2 py-1 font-mono text-xs text-blue-100">
          <span>{`Gate rows: ${s.total}`}</span>
        </div>
      </header>

      <div className="grid gap-3">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-green-400/30 bg-green-500/10 p-3 font-mono text-sm text-green-100">{`Aligned: ${s.aligned}`}</div>
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 font-mono text-sm text-red-100">{`Misaligned: ${s.misaligned}`}</div>
          <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 font-mono text-sm text-amber-100">{`Insufficient: ${s.insufficient}`}</div>
          <div className="rounded-lg border border-slate-800 bg-black/25 p-3 font-mono text-sm text-slate-300">{`Missing: ${s.missing}`}</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-black/25 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-500">Top misalignment reasons</div>
          {s.topReasons.length ? (
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              {s.topReasons.map((x) => (
                <li key={x.code} className="font-mono">
                  {x.code} — {x.count}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 text-xs text-slate-500 font-mono">None</div>
          )}
        </div>
      </div>
    </section>
  );
}

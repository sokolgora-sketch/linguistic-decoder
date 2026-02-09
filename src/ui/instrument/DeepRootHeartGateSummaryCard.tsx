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
    else if (status === "insufficient") insufficient++;
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
    <section className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-neutral-100">Gate Summary</h3>
          <div className="mt-1 font-mono text-xs text-neutral-400">DeepRoot–Heart Alignment (per candidate)</div>
        </div>
        <div className="text-xs text-neutral-400">
          <span>{`Gate rows: ${s.total}`}</span>
        </div>
      </header>

      <div className="grid gap-3">
        <div className="grid gap-1 text-sm text-neutral-200 font-mono">
          <div>{`Aligned: ${s.aligned}`}</div>
          <div>{`Misaligned: ${s.misaligned}`}</div>
          <div>{`Insufficient: ${s.insufficient}`}</div>
          <div>{`Missing: ${s.missing}`}</div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-400">Top misalignment reasons</div>
          {s.topReasons.length ? (
            <ul className="mt-2 space-y-1 text-xs text-neutral-300">
              {s.topReasons.map((x) => (
                <li key={x.code} className="font-mono">
                  {x.code} — {x.count}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 text-xs text-neutral-400 font-mono">None</div>
          )}
        </div>
      </div>
    </section>
  );
}

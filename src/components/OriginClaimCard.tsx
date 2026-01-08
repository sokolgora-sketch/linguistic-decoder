import React from "react";
import type { OriginClaimV1 } from "../shared/originClaim.v1";

function cap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function OriginClaimCard({
  originClaim,
}: {
  originClaim: OriginClaimV1 | null | undefined;
}) {
  if (!originClaim) return null;

  const rows = (originClaim.candidates ?? []).slice(0, 10);

  return (
    <section className="rounded-xl border p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">Origin Claim</h3>
        <div className="text-xs opacity-80">
          policy: <span className="font-mono">{originClaim.policy}</span>
        </div>
      </div>

      <div className="mt-2 text-sm">
        <div>
          summary:{" "}
          <span className="font-semibold">
            {cap(originClaim.summary?.confidence ?? "unknown")}
          </span>
        </div>
        {originClaim.summary?.note ? (
          <div className="mt-1 text-xs opacity-80">{originClaim.summary.note}</div>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {rows.length === 0 ? (
          <div className="text-xs opacity-70">No candidates.</div>
        ) : (
          rows.map((c) => {
            const reason = (c.reasons ?? [])[0] ?? "";
            return (
              <div key={c.id} className="rounded-lg border px-3 py-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-semibold">{c.language}</span>
                    {c.form ? <span className="opacity-80"> · {c.form}</span> : null}
                  </div>
                  <div className="text-xs opacity-80">
                    <span className="font-mono">{c.status}</span> ·{" "}
                    <span className="font-mono">{c.confidence}</span>
                  </div>
                </div>

                {reason ? <div className="mt-1 text-xs opacity-80">{reason}</div> : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

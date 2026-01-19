// RootMap Panel (v0.1.x)
// Goal: render RootMap as a scientific instrument view (VM-only, no raw payload access).

'use client';

import React from "react";
import type { Maybe } from "../telemetry/rootMapVM.v0.1";
import type { RootMapVM } from "../telemetry/rootMapVM.v0.1";

type Props = {
  rootMap: Maybe<RootMapVM>;
};

function MissingView({
  missing,
  detail,
  note,
}: {
  missing: string;
  detail?: string;
  note?: string;
}) {
  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <div>
        <span className="font-medium">RootMap</span>: not available{" "}
        <span className="text-xs">({missing})</span>
      </div>
      {detail ? <div className="text-xs">{detail}</div> : null}
      {note ? <div className="text-xs">note: {note}</div> : null}
    </div>
  );
}

export function RootMapPanelV01({ rootMap }: Props) {
  if (rootMap.kind !== "present") {
    return (
      <MissingView
        missing={rootMap.missing}
        detail={rootMap.detail}
        note={rootMap.note}
      />
    );
  }

  const { tokens, keys, carriers, spans, composedMeaning } = rootMap.value;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Root Map</h3>

      {tokens.length > 0 && (
        <section>
          <h4 className="text-xs font-medium text-muted-foreground">Tokens</h4>
          <ul className="mt-1 text-sm">
            {tokens.map((t, i) => (
              <li key={i}>
                <strong>{t.token}</strong>
                {t.role ? ` · ${t.role}` : ""}
                {t.vowel_path ? ` · ${t.vowel_path}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {keys.length > 0 && (
        <section>
          <h4 className="text-xs font-medium text-muted-foreground">Keys</h4>
          <ul className="mt-1 text-sm space-y-1">
            {keys.map((k, i) => (
              <li key={i}>
                <strong>{k.token}</strong>
                {k.language ? ` (${k.language})` : ""}
                {k.gloss ? ` — ${k.gloss}` : ""}
                {(k.ops?.length ?? 0) > 0 && (
                  <div className="text-xs text-muted-foreground">
                    ops: {(k.ops ?? []).join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {carriers.length > 0 && (
        <section>
          <h4 className="text-xs font-medium text-muted-foreground">Carriers</h4>
          <ul className="mt-1 text-sm">
            {carriers.map((c, i) => (
              <li key={i}>
                <strong>{c.token}</strong>
                {c.carrierForm ? ` → ${c.carrierForm}` : ""}
                {c.language ? ` (${c.language})` : ""}
                {c.note ? ` · ${c.note}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {spans.length > 0 && (
        <section>
          <h4 className="text-xs font-medium text-muted-foreground">Spans</h4>
          <ul className="mt-1 text-sm">
            {spans.map((s, i) => (
              <li key={i}>
                <strong>{s.token}</strong>
                {typeof s.start === "number" && typeof s.end === "number"
                  ? ` [${s.start}–${s.end}]`
                  : ""}
                {s.note ? ` · ${s.note}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {composedMeaning && (
        <section>
          <h4 className="text-xs font-medium text-muted-foreground">
            Composed Meaning
          </h4>
          <div className="mt-1 text-sm">{composedMeaning}</div>
        </section>
      )}
    </div>
  );
}

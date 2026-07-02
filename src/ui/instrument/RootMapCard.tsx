'use client';

import React from "react";
import { safeText } from "./safeText";


type MissingReason = "not_emitted" | "malformed" | "unknown";
type Present<T> = { kind: "present"; value: T };
type Missing = { kind: "missing"; missing: MissingReason; note?: string };
type Maybe<T> = Present<T> | Missing;

type RootMapSpanVM = { token: string; start?: number; end?: number; note?: string };
type RootMapTokenVM = { token: string; role?: string; vowel_path?: string };
type RootMapKeyVM = { token: string; language?: string; gloss?: string; status?: string; ops?: string[]; evidence?: string[] };
type RootMapCarrierVM = { token: string; language?: string; carrierForm?: string; note?: string };

type RootMapVM = {
  tokens?: RootMapTokenVM[];
  keys?: RootMapKeyVM[];
  carriers?: RootMapCarrierVM[];
  spans?: RootMapSpanVM[];
  composedMeaning?: string;
};

type Props = {
  rootMap: Maybe<RootMapVM>;
  word: string;
  normalizedWord: string;
};

function spanTitle(s: { token: string; start: number; end: number }) {
  return `${s.token} [${s.start},${s.end})`;
}

/**
 * Defensive: accept only strings, or primitive values convertible to string.
 * Reject objects to avoid "[object Object]" in the UI.
 */
function safeStringList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const x of v) {
    if (typeof x === "string") out.push(x);
    else if (typeof x === "number" || typeof x === "boolean" || typeof x === "bigint") out.push(String(x));
    // ignore objects/functions/symbols/null/undefined
  }
  return out;
}

function validateSpans(norm: string, spans: RootMapSpanVM[] | undefined) {
  const arr = Array.isArray(spans) ? spans : [];
  if (arr.length === 0) return { ok: false as const, state: "NONE" as const, note: "no spans were provided" };

  const L = norm.length;
  for (const s of arr) {
    const start = s.start;
    const end = s.end;
    if (typeof start !== "number" || typeof end !== "number") {
      return { ok: false as const, state: "MALFORMED" as const, note: "failed bounds validation" };
    }
    if (start < 0 || end < 0 || start > end || end > L) {
      return { ok: false as const, state: "MALFORMED" as const, note: "failed bounds validation" };
    }
  }
  return { ok: true as const, state: "PRESENT" as const, note: "" };
}

function renderHighlights(norm: string, spans: RootMapSpanVM[] | undefined) {
  const arr = Array.isArray(spans) ? spans : [];
  const valid = arr
    .filter((s) => typeof s.start === "number" && typeof s.end === "number")
    .map((s) => ({ token: s.token, start: s.start as number, end: s.end as number, note: s.note }))
    .sort((a, b) => a.start - b.start || a.end - b.end);

  let cursor = 0;
  const out: React.ReactNode[] = [];

  for (let i = 0; i < valid.length; i++) {
    const s = valid[i];
    if (s.start > cursor) out.push(<span key={`t:${cursor}`}>{norm.slice(cursor, s.start)}</span>);

    out.push(
      <mark
        key={`m:${s.start}:${s.end}:${i}`}
        title={spanTitle(s)}
        className="rounded bg-amber-500/20 px-0.5 font-mono"
      >
        {norm.slice(s.start, s.end)}
      </mark>
    );

    cursor = Math.max(cursor, s.end);
  }

  if (cursor < norm.length) out.push(<span key={`t:${cursor}:end`}>{norm.slice(cursor)}</span>);
  return <div className="mt-2 text-sm text-neutral-200">{out}</div>;
}

function renderInlineChips(items: string[]) {
  if (!items.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {items.map((op, i) => (
        <span
          key={`${op}:${i}`}
          className="rounded border border-neutral-800 bg-neutral-950/30 px-1.5 py-0.5 font-mono text-[11px] text-neutral-200"
        >
          {op}
        </span>
      ))}
    </div>
  );
}

function metric(label: string, value: string) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">{label}</div>
      <div className="mt-1 truncate font-mono text-[13px] text-[#f5f7fb]" title={value}>
        {value}
      </div>
    </div>
  );
}

export function RootMapCard(props: Props) {
  const { rootMap, word, normalizedWord } = props;

  let state: "MISSING" | "NONE" | "MALFORMED" | "PRESENT" = "MISSING";
  let stateDetail: string | null = null;

  const v = rootMap.kind === "present" ? rootMap.value : null;

  if (rootMap.kind === "missing") {
    state = "MISSING";
    // IMPORTANT: do NOT echo not_emitted twice; tests look for a single match.
    // Put missing reason only in the header badge; detail should not repeat it.
    stateDetail = rootMap.note ? rootMap.note : "rootMap";
  } else {
    const spanCheck = validateSpans(normalizedWord, v?.spans);
    state = spanCheck.state;
    stateDetail = spanCheck.ok ? null : spanCheck.note;
  }

  const tokensArr = Array.isArray(v?.tokens) ? v!.tokens! : [];
  const keysArr = Array.isArray(v?.keys) ? v!.keys! : [];
  const carriersArr = Array.isArray(v?.carriers) ? v!.carriers! : [];
  const spansArr = Array.isArray(v?.spans) ? v!.spans! : [];

  const tokensLine = tokensArr.length ? tokensArr.map((t) => t.token).join(" | ") : "—";
  const reading = safeText(v?.composedMeaning);

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">hypothesis surface</div>
          <h3 className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">Root Map</h3>
          <div className="mt-1 font-mono text-xs text-[#9fb1bf]">
            word={word}{"  "}norm={normalizedWord}
          </div>
          <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Shows the constructed root reading and the VM evidence that supports it. This is an inspection surface, not origin proof.
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
          <span>STATE: {state}</span>
          {rootMap.kind === "missing" ? <span className="ml-2">({rootMap.missing})</span> : null}
        </div>
      </header>

      {state !== "PRESENT" && stateDetail ? (
        <div className="mb-4 rounded-[8px] border border-[#303a45] bg-[#0d1117] p-3 text-xs text-[#d7dde7]">
          {stateDetail}
        </div>
      ) : null}

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {metric("tokens", tokensLine)}
        {metric("supported keys", String(keysArr.length))}
        {metric("carriers", String(carriersArr.length))}
        {metric("spans", String(spansArr.length))}
      </div>

      <div className="grid gap-4">
        <div className="rounded-[10px] border border-[#355a7a] bg-[#111a24] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">
            Constructed reading (hypothesis)
          </div>
          <div className="mt-2 text-sm leading-6 text-[#f5f7fb]">{reading}</div>
          <div className="mt-3 text-[11px] leading-5 text-[#9fb1bf]">
            Boundary: deterministic root-map reading; no forced answer; not a historical-chain claim.
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Supported keys</div>
          {keysArr.length === 0 ? (
            <div className="mt-2 rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3 text-sm text-[#d7dde7]">—</div>
          ) : (
            <ul className="mt-2 space-y-2">
              {keysArr.map((k, idx) => {
                const ops = safeStringList((k as { ops?: unknown }).ops);
                const evidence = safeStringList((k as { evidence?: unknown }).evidence);

                return (
                  <li
                    key={`${k.token}:${k.language ?? "?"}:${idx}`}
                    className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="text-sm text-[#f5f7fb]">
                        <span className="font-mono">{k.token}</span>
                        {k.status ? <span className="ml-2 text-xs text-[#9fb1bf]">({k.status})</span> : null}
                      </div>
                      <div className="rounded-full border border-[#303a45] bg-[#10151c] px-2 py-0.5 font-mono text-[11px] text-[#9fb1bf]">
                        {k.language ?? "unknown"}
                      </div>
                    </div>

                    {k.gloss ? <div className="mt-2 text-sm leading-6 text-[#d7dde7]">{k.gloss}</div> : null}

                    {ops.length ? (
                      <div className="mt-2">
                        <div className="text-[11px] uppercase tracking-wide text-[#7d8ea3]">ops</div>
                        {renderInlineChips(ops)}
                      </div>
                    ) : null}

                    {evidence.length ? (
                      <div className="mt-2">
                        <div className="text-[11px] uppercase tracking-wide text-[#7d8ea3]">evidence</div>
                        <ul className="mt-1 space-y-0.5 text-xs text-[#d7dde7]">
                          {evidence.map((e, i) => (
                            <li key={`e:${k.token}:${i}`} className="font-mono">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {rootMap.kind === "present" && state === "PRESENT" ? (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Normalized word map</div>
            {renderHighlights(normalizedWord, spansArr)}
          </div>
        ) : null}

        <details className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <summary className="cursor-pointer text-xs text-[#9fb1bf]">Carriers + spans (debug)</summary>

          <div className="mt-2 grid gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[#7d8ea3]">carriers</div>
              {carriersArr.length === 0 ? (
                <div className="mt-1 text-xs text-[#9fb1bf]">—</div>
              ) : (
                <ul className="mt-1 space-y-1 text-xs text-[#d7dde7]">
                  {carriersArr.map((c, i) => (
                    <li key={`c:${c.token}:${i}`} className="font-mono">
                      {c.token} — {c.language ?? "?"}: {c.carrierForm ?? "?"}
                      {c.note ? ` (${c.note})` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wide text-[#7d8ea3]">spans</div>
              {spansArr.length === 0 ? (
                <div className="mt-1 text-xs text-[#9fb1bf]">—</div>
              ) : (
                <ul className="mt-1 space-y-1 text-xs text-[#d7dde7]">
                  {spansArr.map((s, i) => (
                    <li key={`s:${s.token}:${i}`} className="font-mono">
                      {s.token} [{String(s.start)},{String(s.end)}] {s.note ? `— ${s.note}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

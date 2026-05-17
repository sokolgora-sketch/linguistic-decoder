'use client';

import React from "react";
import { safeText } from "./safeText";

type MissingReason = "not_emitted" | "malformed" | "unknown";
type Present<T> = { kind: "present"; value: T };
type Missing = { kind: "missing"; missing: MissingReason; note?: string };
type Maybe<T> = Present<T> | Missing;

type SoundRootsWarningVM = { code: string; domain: string };
type SoundRootsMatchVM = { domain: string; root?: string; carrier?: string; gloss?: string; note?: string };

type SoundRootsVM = {
  matches: SoundRootsMatchVM[];
  domains: string[];
  claimedDomains: string[];
  missingDomains: string[];
  warnings: SoundRootsWarningVM[];
};

type Props = {
  soundRoots: Maybe<SoundRootsVM>;
  word: string;
  normalizedWord: string;
};

function chips(items: string[]) {
  const arr = Array.isArray(items) ? items : [];
  if (!arr.length) return <div className="mt-2 text-sm text-[#d7dde7]">—</div>;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {arr.map((x, i) => (
        <span
          key={`${x}:${i}`}
          className="rounded-full border border-[#303a45] bg-[#0d1117] px-2 py-1 font-mono text-[11px] text-[#d7dde7]"
        >
          {x}
        </span>
      ))}
    </div>
  );
}

function metric(label: string, value: string) {
  return (
    <div className="rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">{label}</div>
      <div className="mt-1 font-mono text-[13px] text-[#f5f7fb]">{value}</div>
    </div>
  );
}

export function SoundRootsCard(props: Props) {
  const { soundRoots, word, normalizedWord } = props;

  const v = soundRoots.kind === "present" ? soundRoots.value : null;
  const state = soundRoots.kind === "present" ? "PRESENT" : "MISSING";
  const detail =
    soundRoots.kind === "missing"
      ? (soundRoots.note ? soundRoots.note : "soundRoots")
      : null;

  const domains = v?.domains ?? [];
  const claimed = v?.claimedDomains ?? [];
  const missing = v?.missingDomains ?? [];
  const warnings = Array.isArray(v?.warnings) ? v!.warnings : [];
  const matches = Array.isArray(v?.matches) ? v!.matches : [];

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">semantic signal surface</div>
          <h3 className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">SoundRoots</h3>
          <div className="mt-1 font-mono text-xs text-[#9fb1bf]">
            word={word}{"  "}norm={normalizedWord}
          </div>
          <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Compares matched sound-root domains with domains claimed by gloss keywords. Warnings mark unsupported claims.
          </p>
        </div>
        <div className="shrink-0 rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
          <span>STATE: {state}</span>
          {soundRoots.kind === "missing" ? <span className="ml-2">({soundRoots.missing})</span> : null}
        </div>
      </header>

      {state !== "PRESENT" && detail ? (
        <div className="mb-4 rounded-[8px] border border-[#303a45] bg-[#0d1117] p-3 text-xs text-[#d7dde7]">
          {detail}
        </div>
      ) : null}

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {metric("matched", String(domains.length))}
        {metric("claimed", String(claimed.length))}
        {metric("missing", String(missing.length))}
        {metric("warnings", String(warnings.length))}
      </div>

      <div className="grid gap-4">
        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Domains matched</div>
          {chips(domains)}
        </div>

        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Claimed domains</div>
          <div className="mt-1 text-[12px] leading-5 text-[#9fb1bf]">From gloss keywords, shown separately from matched domains.</div>
          {chips(claimed)}
        </div>

        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Missing domains</div>
          <div className="mt-1 text-[12px] leading-5 text-[#9fb1bf]">Claimed domains not matched by the current SoundRoots surface.</div>
          {chips(missing)}
        </div>

        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Warnings</div>
          {warnings.length === 0 ? (
            <div className="mt-2 text-sm text-[#d7dde7]">—</div>
          ) : (
            <ul className="mt-2 space-y-1 text-xs text-[#d7dde7]">
              {warnings.map((w, i) => (
                <li key={`${w.code}:${w.domain}:${i}`} className="font-mono">
                  {w.code} — {w.domain}
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <summary className="cursor-pointer text-xs text-[#9fb1bf]">Matches (debug)</summary>

          {matches.length === 0 ? (
            <div className="mt-2 text-xs text-[#9fb1bf]">—</div>
          ) : (
            <ul className="mt-2 space-y-2 text-xs text-[#d7dde7]">
              {matches.map((m, i) => (
                <li key={`${m.domain}:${i}`} className="rounded-[8px] border border-[#303a45] bg-[#10151c] p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-mono text-sm text-[#f5f7fb]">{safeText(m.domain)}</div>
                    <div className="text-xs text-[#9fb1bf]">
                      {m.root ? `root=${safeText(m.root)}` : "root=—"}
                    </div>
                  </div>
                  {m.gloss ? <div className="mt-1 text-sm text-[#d7dde7]">{safeText(m.gloss)}</div> : null}
                  <div className="mt-1 text-xs text-[#9fb1bf]">
                    carrier={safeText(m.carrier)} {m.note ? `— ${safeText(m.note)}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </section>
  );
}

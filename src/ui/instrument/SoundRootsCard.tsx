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
  if (!arr.length) return <div className="mt-1 text-sm text-neutral-300">—</div>;
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {arr.map((x, i) => (
        <span
          key={`${x}:${i}`}
          className="rounded border border-neutral-800 bg-neutral-950/30 px-1.5 py-0.5 font-mono text-[11px] text-neutral-200"
        >
          {x}
        </span>
      ))}
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
    <section className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-neutral-100">SoundRoots</h3>
          <div className="mt-1 font-mono text-xs text-neutral-400">
            word={word}{"  "}norm={normalizedWord}
          </div>
        </div>
        <div className="text-xs text-neutral-400">
          <span>STATE: {state}</span>
          {soundRoots.kind === "missing" ? <span className="ml-2">({soundRoots.missing})</span> : null}
        </div>
      </header>

      {state !== "PRESENT" && detail ? (
        <div className="mb-3 rounded-lg border border-neutral-800 bg-neutral-950/30 p-2 text-xs text-neutral-300">
          {detail}
        </div>
      ) : null}

      <div className="grid gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-400">Domains (matched)</div>
          {chips(domains)}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-400">Claimed domains (gloss keywords)</div>
          {chips(claimed)}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-400">Missing domains (claimed - matched)</div>
          {chips(missing)}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-400">Warnings</div>
          {warnings.length === 0 ? (
            <div className="mt-1 text-sm text-neutral-300">—</div>
          ) : (
            <ul className="mt-2 space-y-1 text-xs text-neutral-300">
              {warnings.map((w, i) => (
                <li key={`${w.code}:${w.domain}:${i}`} className="font-mono">
                  {w.code} — {w.domain}
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className="rounded-lg border border-neutral-800 bg-neutral-950/20 p-2">
          <summary className="cursor-pointer text-xs text-neutral-400">Matches (debug)</summary>

          {matches.length === 0 ? (
            <div className="mt-2 text-xs text-neutral-400">—</div>
          ) : (
            <ul className="mt-2 space-y-2 text-xs text-neutral-300">
              {matches.map((m, i) => (
                <li key={`${m.domain}:${i}`} className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="text-sm text-neutral-100 font-mono">{safeText(m.domain)}</div>
                    <div className="text-xs text-neutral-400">
                      {m.root ? `root=${safeText(m.root)}` : "root=—"}
                    </div>
                  </div>
                  {m.gloss ? <div className="mt-1 text-sm text-neutral-200">{safeText(m.gloss)}</div> : null}
                  <div className="mt-1 text-xs text-neutral-400">
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

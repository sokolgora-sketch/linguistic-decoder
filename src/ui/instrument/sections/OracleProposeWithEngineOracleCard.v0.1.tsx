'use client';

import React from "react";
import { safeText } from "../safeText";

type Mode = "strict" | "open";

type Props = {
  word: string;
  mode: Mode;
  onCopy?: (label: string, text: string) => void;
};

type VM = {
  ok: boolean;
  word: string;
  mode: Mode;
  provider: string;

  oraclePrimaryPath: string[];
  claimVerificationOk: boolean | null;

  error?: string;

  proposerRawText?: string;
  responsePretty?: string;
  claimPacketPretty?: string;
};

function asStrArray(x: unknown): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)).filter(Boolean) : [];
}

function pretty(x: unknown): string {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

function buildVM(raw: unknown, fallbackWord: string, fallbackMode: Mode): VM {
  const r: any = raw ?? {};
  const ok = !!r && typeof r === "object" && r.ok === true;

  const word = String(r.word ?? fallbackWord ?? "");
  const mode: Mode = r.mode === "open" ? "open" : fallbackMode;

  const provider = String(r.provider ?? "");

  const oraclePrimaryPath = asStrArray(r?.oracle?.primaryVoicePath);

  // verifier shape may evolve; conservative boolean extraction only
  const cv = r?.claimVerification;
  const claimVerificationOk =
    typeof cv?.ok === "boolean"
      ? cv.ok
      : typeof cv?.passed === "boolean"
        ? cv.passed
        : typeof cv?.isValid === "boolean"
          ? cv.isValid
          : null;

  const proposerRawText = typeof r?.proposerRawText === "string" ? r.proposerRawText : "";

  const responsePretty = pretty(
    r && typeof r === "object"
      ? { ...(r as any), proposerRawText: typeof (r as any)?.proposerRawText === "string" ? "[omitted: see proposerRawText section]" : (r as any)?.proposerRawText }
      : r
  );
const claimPacketPretty = r?.claimPacket ? pretty(r.claimPacket) : "";

  const error = typeof r?.error === "string" ? r.error : undefined;

  return {
    ok,
    word,
    mode,
    provider,
    oraclePrimaryPath,
    claimVerificationOk,
    error,
    proposerRawText,
    responsePretty,
    claimPacketPretty,
  };
}

export function OracleProposeWithEngineOracleCardV01(props: Props) {
  const word = String(props.word ?? "").trim();
  const mode: Mode = props.mode === "open" ? "open" : "strict";

  const [provider, setProvider] = React.useState<string>("mock"); // safe default (no network)
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [vm, setVm] = React.useState<VM | null>(null);

  async function run() {
    if (!word) return;

    setStatus("loading");
    setVm(null);

    try {
      const body: any = { word, mode };
      const p = String(provider ?? "").trim();
      if (p) body.provider = p;

      const res = await fetch("/api/propose-with-engine-oracle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      const next = buildVM(json, word, mode);

      setVm(next);
      setStatus(next.ok ? "done" : "error");
    } catch (e: any) {
      setVm({
        ok: false,
        word,
        mode,
        provider: String(provider ?? ""),
        oraclePrimaryPath: [],
        claimVerificationOk: null,
        error: String(e?.message ?? e ?? "Request failed"),
      });
      setStatus("error");
    }
  }

  const canRun = !!word && status !== "loading";

  return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div>
        <div className="text-sm font-semibold text-slate-100">Propose with Engine Oracle</div>
        <div className="mt-1 text-xs text-slate-500">
          Builds an oracle from engine v1 (surface vowels → strict terminal-Y hint), runs proposer once, then verifies the ClaimPacket.
        </div>
      </div>
      <div className="mt-4 space-y-3 min-w-0">
        <div className="grid gap-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Provider</div>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="mock | gemini | openai | ..."
            className="w-full rounded-md border border-slate-700 bg-black/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="text-xs text-slate-500">
            Default is <span className="font-mono">mock</span> (safe). Use a real provider only when you intend to spend tokens.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-black/20 disabled:text-slate-600"
            onClick={() => void run()}
            disabled={!canRun}
          >
            {status === "loading" ? "Running…" : "Run oracle proposal"}
          </button>

          {vm?.responsePretty && props.onCopy ? (
            <button
              type="button"
              className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              onClick={() => props.onCopy?.("Oracle response copied.", vm.responsePretty!)}
            >
              Copy response
            </button>
          ) : null}

          {vm?.claimPacketPretty && props.onCopy ? (
            <button
              type="button"
              className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              onClick={() => props.onCopy?.("ClaimPacket copied.", vm.claimPacketPretty!)}
            >
              Copy ClaimPacket
            </button>
          ) : null}
        </div>

        {/* Summary */}
        {vm ? (
          <div className="rounded-lg border border-slate-800 bg-black/25 p-3 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">
                Status:{" "}
                <span className="font-mono">
                  {vm.ok ? "ok" : "error"}
                </span>
                {vm.claimVerificationOk !== null ? (
                  <>
                    {" · verifier="}
                    <span className="font-mono">{vm.claimVerificationOk ? "pass" : "fail"}</span>
                  </>
                ) : null}
              </div>
              <div className="text-xs text-slate-500">
                provider=<span className="font-mono">{safeText(vm.provider)}</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-500">oracle.primaryVoicePath</div>
            <div className="mt-1 font-mono text-xs">
              {vm.oraclePrimaryPath.length ? vm.oraclePrimaryPath.join(" → ") : "not_emitted"}
            </div>

            {vm.error ? (
              <div className="mt-2 text-xs text-red-300">
                error: <span className="font-mono">{safeText(vm.error)}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Proposer raw text (if available) */}
        {vm?.proposerRawText ? (
          <div>
            <div className="text-xs text-slate-500">proposerRawText</div>
            <pre className="mt-1 max-h-48 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-black/35 p-3 text-xs text-slate-200">
{vm.proposerRawText}
            </pre>
          </div>
        ) : null}

        {/* Full response (text only) */}
        {vm?.responsePretty ? (
          <div>
            <div className="text-xs text-slate-500">response</div>
            <pre className="mt-1 max-h-64 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-black/35 p-3 text-xs text-slate-200">
{vm.responsePretty}
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}

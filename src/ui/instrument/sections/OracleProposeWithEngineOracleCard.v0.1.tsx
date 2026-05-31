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
  rejectedDiagnosticsPretty?: string;
  rejectedProposals: RejectedProposalVM[];
};

type RejectedProposalVM = {
  id: string;
  form: string;
  language: string;
  extractedVowelPath: string[];
  failedChecks: Array<{ id: string; reason: string }>;
};

function asStrArray(x: unknown): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)).filter(Boolean) : [];
}

function asDisplayString(x: unknown, fallback: string): string {
  return typeof x === "string" && x.trim() ? x.trim() : fallback;
}

function pretty(x: unknown): string {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

function buildRejectedProposalsVM(raw: any): RejectedProposalVM[] {
  const results = Array.isArray(raw?.proposalVerification?.results) ? raw.proposalVerification.results : [];
  const candidates = Array.isArray(raw?.proposal?.candidates) ? raw.proposal.candidates : [];

  return results
    .map((result: any, index: number): RejectedProposalVM | null => {
      if (!result || typeof result !== "object" || result.pass !== false) return null;

      const checks = Array.isArray(result.checks) ? result.checks : [];
      const failedChecks = checks
        .filter((check: any) => check && typeof check === "object" && check.pass === false)
        .map((check: any) => ({
          id: asDisplayString(check.id, "UNKNOWN_CHECK"),
          reason: asDisplayString(check.reason, "No reason emitted."),
        }));

      return {
        id: `rejected-${index}`,
        form: asDisplayString(result.form ?? candidates[index]?.form, "form not emitted"),
        language: asDisplayString(candidates[index]?.language, "language not emitted"),
        extractedVowelPath: asStrArray(result.extractedVowelPath),
        failedChecks,
      };
    })
    .filter((row: RejectedProposalVM | null): row is RejectedProposalVM => !!row);
}


function buildRejectedDiagnosticsPretty(raw: any, rows: RejectedProposalVM[], fallbackWord: string, fallbackMode: Mode): string {
  const payload = {
    diagnostic: "open-instrument.rejected-proposals.v0.1",
    word: String(raw?.word ?? fallbackWord ?? ""),
    mode: raw?.mode === "open" ? "open" : fallbackMode,
    provider: String(raw?.provider ?? "not_emitted"),
    rejectedCount: rows.length,
    message: rows.length ? "Verifier-rejected proposals emitted." : "No rejected proposals emitted.",
    rejectedProposals: rows.map((row) => ({
      form: row.form,
      language: row.language,
      extractedVowelPath: row.extractedVowelPath,
      failedChecks: row.failedChecks.map((check) => ({
        id: check.id,
        reason: check.reason,
      })),
    })),
  };

  return pretty(payload);
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
  const rejectedProposals = buildRejectedProposalsVM(r);
  const rejectedDiagnosticsPretty = buildRejectedDiagnosticsPretty(r, rejectedProposals, word, mode);

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
    rejectedDiagnosticsPretty,
    rejectedProposals,
  };
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">{label}</div>
      <div className="mt-1 min-w-0 break-words font-mono text-[13px] text-[#f5f7fb]">{value}</div>
    </div>
  );
}

function RejectedProposalsPanel({ rows }: { rows: RejectedProposalVM[] }) {
  return (
    <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-[#f5f7fb]">Rejected proposals</div>
          <div className="mt-1 text-xs leading-5 text-[#7d8ea3]">
            Verifier-rejected candidates from the proposer attempt. These are shown so the heart constraining the brain stays visible.
          </div>
        </div>
        <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-red-100">
          rejected={rows.length}
        </span>
      </div>

      {rows.length ? (
        <div className="mt-3 space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="rounded-[8px] border border-red-400/25 bg-red-500/10 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-[#303a45] bg-black/20 px-2 py-0.5 font-mono text-xs text-[#d7dde7]">
                      {safeText(row.language)}
                    </span>
                    <span className="break-all font-mono text-sm text-[#f5f7fb]">{safeText(row.form)}</span>
                  </div>
                  <div className="mt-2 text-xs text-[#7d8ea3]">
                    extracted path:{" "}
                    <span className="font-mono text-[#d7dde7]">
                      {row.extractedVowelPath.length ? row.extractedVowelPath.join(" → ") : "not_emitted"}
                    </span>
                  </div>
                </div>
              </div>

              {row.failedChecks.length ? (
                <div className="mt-3 space-y-2">
                  {row.failedChecks.map((check) => (
                    <div key={`${row.id}-${check.id}`} className="rounded-[8px] border border-red-400/20 bg-black/20 p-2">
                      <div className="font-mono text-xs text-red-100">{safeText(check.id)}</div>
                      <div className="mt-1 break-words text-xs leading-5 text-red-100/80">{safeText(check.reason)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-xs text-red-100/70">No failed check reasons emitted.</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[8px] border border-[#27313d] bg-black/20 p-3 text-xs text-[#7d8ea3]">
          No rejected proposals emitted.
        </div>
      )}
    </div>
  );
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
        rejectedDiagnosticsPretty: buildRejectedDiagnosticsPretty(
          { word, mode, provider: String(provider ?? ""), proposalVerification: { results: [] } },
          [],
          word,
          mode
        ),
        rejectedProposals: [],
        error: String(e?.message ?? e ?? "Request failed"),
      });
      setStatus("error");
    }
  }

  const canRun = !!word && status !== "loading";
  const providerLabel = String(provider ?? "").trim() || "mock";
  const runStatus = status === "idle" ? "ready" : status;

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">advanced audit action</div>
          <div className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">Propose with Engine Oracle</div>
          <div className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Optional proposer diagnostic for the current readout. It runs one proposal attempt, then checks the returned ClaimPacket.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
            provider={safeText(providerLabel)}
          </span>
          <span className="rounded-full border border-[#3d4a34] bg-[#142015] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#b9e6b9]">
            {safeText(runStatus)}
          </span>
        </div>
      </header>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Metric label="word" value={word ? `word=${word}` : "missing"} />
        <Metric label="mode" value={mode} />
        <Metric label="network" value={providerLabel === "mock" ? "mock-safe" : "provider"} />
      </div>

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: optional diagnostic only; does not change this readout; no automatic origin proof; no forced answer.
      </div>

      <div className="mt-4 min-w-0 space-y-3">
        <div className="grid gap-2">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Provider</div>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="mock | gemini | openai | ..."
            className="w-full rounded-[8px] border border-[#303a45] bg-[#0d1117] px-3 py-2 text-sm text-[#f5f7fb] placeholder:text-[#66778c] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="text-xs text-[#7d8ea3]">
            Default is <span className="font-mono text-[#d7dde7]">mock</span> and safe. Real providers can spend tokens.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-[8px] border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:border-[#303a45] disabled:bg-[#0d1117] disabled:text-[#66778c]"
            onClick={() => void run()}
            disabled={!canRun}
          >
            {status === "loading" ? "Running…" : "Run oracle proposal"}
          </button>

          {vm?.responsePretty && props.onCopy ? (
            <button
              type="button"
              className="rounded-[8px] border border-[#303a45] bg-[#0d1117] px-3 py-1.5 text-sm font-semibold text-[#d7dde7] transition hover:border-[#4b5b6c] hover:bg-[#151b24]"
              onClick={() => props.onCopy?.("Oracle response copied.", vm.responsePretty!)}
            >
              Copy response
            </button>
          ) : null}

          {vm?.claimPacketPretty && props.onCopy ? (
            <button
              type="button"
              className="rounded-[8px] border border-[#303a45] bg-[#0d1117] px-3 py-1.5 text-sm font-semibold text-[#d7dde7] transition hover:border-[#4b5b6c] hover:bg-[#151b24]"
              onClick={() => props.onCopy?.("ClaimPacket copied.", vm.claimPacketPretty!)}
            >
              Copy ClaimPacket
            </button>
          ) : null}

          {vm?.rejectedDiagnosticsPretty && props.onCopy ? (
            <button
              type="button"
              className="rounded-[8px] border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-100 transition hover:border-red-300 hover:bg-red-500/20"
              onClick={() => props.onCopy?.("Rejected diagnostics copied.", vm.rejectedDiagnosticsPretty!)}
            >
              Copy rejected diagnostics
            </button>
          ) : null}
        </div>

        {/* Summary */}
        {vm ? (
          <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-sm text-[#d7dde7]">
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
              <div className="text-xs text-[#7d8ea3]">
                provider=<span className="font-mono">{safeText(vm.provider)}</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-[#7d8ea3]">oracle.primaryVoicePath</div>
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

        {vm ? <RejectedProposalsPanel rows={vm.rejectedProposals} /> : null}

        {/* Proposer raw text (if available) */}
        {vm?.proposerRawText ? (
          <div>
            <div className="text-xs text-[#7d8ea3]">proposerRawText</div>
            <pre className="mt-1 max-h-48 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3 text-xs text-[#d7dde7]">
{vm.proposerRawText}
            </pre>
          </div>
        ) : null}

        {/* Full response (text only) */}
        {vm?.responsePretty ? (
          <div>
            <div className="text-xs text-[#7d8ea3]">response</div>
            <pre className="mt-1 max-h-64 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3 text-xs text-[#d7dde7]">
{vm.responsePretty}
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}

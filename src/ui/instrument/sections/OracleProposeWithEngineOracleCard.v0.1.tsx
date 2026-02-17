'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  // verifier shape may evolve; best-effort boolean extraction only
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

  const responsePretty = pretty(r);
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Propose with Engine Oracle</CardTitle>
        <div className="text-xs opacity-70">
          Builds an oracle from engine v1 (surface vowels → strict terminal-Y hint), runs proposer once, then verifies the ClaimPacket.
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <div className="text-xs opacity-70">Provider</div>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="mock | gemini | openai | ..."
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          />
          <div className="text-xs opacity-60">
            Default is <span className="font-mono">mock</span> (safe). Use a real provider only when you intend to spend tokens.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void run()} disabled={!canRun}>
            {status === "loading" ? "Running…" : "Run oracle proposal"}
          </Button>

          {vm?.responsePretty && props.onCopy ? (
            <Button variant="secondary" onClick={() => props.onCopy?.("Oracle response copied.", vm.responsePretty!)}>
              Copy response
            </Button>
          ) : null}

          {vm?.claimPacketPretty && props.onCopy ? (
            <Button variant="secondary" onClick={() => props.onCopy?.("ClaimPacket copied.", vm.claimPacketPretty!)}>
              Copy ClaimPacket
            </Button>
          ) : null}
        </div>

        {/* Summary */}
        {vm ? (
          <div className="rounded-lg border p-3 text-sm">
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
              <div className="text-xs opacity-70">
                provider=<span className="font-mono">{safeText(vm.provider)}</span>
              </div>
            </div>

            <div className="mt-2 text-xs opacity-70">oracle.primaryVoicePath</div>
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
            <div className="text-xs opacity-70">proposerRawText</div>
            <pre className="mt-1 max-h-48 overflow-auto rounded-lg border bg-black/10 p-2 text-xs">
{vm.proposerRawText}
            </pre>
          </div>
        ) : null}

        {/* Full response (text only) */}
        {vm?.responsePretty ? (
          <div>
            <div className="text-xs opacity-70">response</div>
            <pre className="mt-1 max-h-64 overflow-auto rounded-lg border bg-black/10 p-2 text-xs">
{vm.responsePretty}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function isObj(x: unknown): x is Record<string, any> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function safeGet(root: any, path: string[]): any {
  let cur = root;
  for (const k of path) {
    if (!isObj(cur)) return undefined;
    cur = cur[k];
  }
  return cur;
}

function asString(x: unknown): string | null {
  return typeof x === "string" && x.trim().length > 0 ? x : null;
}

function asStringArray(x: unknown): string[] | null {
  if (!Array.isArray(x)) return null;
  const out = x.filter((v) => typeof v === "string" && v.length > 0);
  return out.length ? out : null;
}

function copyText(txt: string) {
  void navigator.clipboard.writeText(txt);
}

function pill(text: string) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
      {text}
    </span>
  );
}

function statusBadge(status?: string | null) {
  const s = (status ?? "").toLowerCase();
  if (s === "pass") return <Badge className="bg-emerald-900/40 text-emerald-200 border-emerald-900">PASS</Badge>;
  if (s === "fail") return <Badge className="bg-red-900/40 text-red-200 border-red-900">FAIL</Badge>;
  return <Badge variant="outline" className="border-zinc-700 text-zinc-300">UNKNOWN</Badge>;
}

function confidenceBadge(tag?: string | null) {
  const t = (tag ?? "").toLowerCase();
  if (t === "strong") return <Badge className="bg-emerald-900/30 text-emerald-200 border-emerald-900">strong</Badge>;
  if (t === "medium") return <Badge className="bg-amber-900/30 text-amber-200 border-amber-900">medium</Badge>;
  if (t === "weak") return <Badge className="bg-zinc-800 text-zinc-200 border-zinc-700">weak</Badge>;
  if (t === "insufficient") return <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800">insufficient</Badge>;
  return <Badge variant="outline" className="border-zinc-700 text-zinc-300">n/a</Badge>;
}

export interface CandidatesCardProps {
  result: unknown | null;
  className?: string;
}

type CandidateVM = {
  id: string;
  language: string;
  form: string;
  status: string | null;
  confidence: string | null;
  vowelPath: string | null;
  functionalStatement: string | null;
  fitTag: string | null;
  raw: any;
};

function pickCandidates(result: any): any[] {
  const c1 = safeGet(result, ["candidates"]);
  if (Array.isArray(c1)) return c1;
  const c2 = safeGet(result, ["raw", "candidates"]);
  if (Array.isArray(c2)) return c2;
  return [];
}

function normalizeCandidate(c: any): CandidateVM {
  const id = asString(c?.id) ?? "cand:unknown";
  const language = asString(c?.language) ?? "Unknown";
  const form = asString(c?.form) ?? asString(c?.lemma) ?? "—";
  const status = asString(c?.status) ?? null;

  const confidence =
    asString(c?.confidenceTag) ??
    asString(c?.confidence) ??
    asString(c?.fitTag) ??
    null;

  const vowelPath =
    asString(c?.vowelPath) ??
    asString(safeGet(c, ["voices", "voiceSequence"])) ??
    null;

  const functionalStatement =
    asString(c?.functionalStatement) ??
    asString(c?.function) ??
    asString(c?.note) ??
    null;

  const fitTag = asString(c?.fitTag) ?? null;

  return { id, language, form, status, confidence, vowelPath, functionalStatement, fitTag, raw: c };
}

function pickOriginClaimSummary(result: any): string | null {
  const s =
    asString(safeGet(result, ["originClaim", "summary", "note"])) ??
    asString(safeGet(result, ["raw", "originClaim", "summary", "note"])) ??
    null;
  return s;
}

function pickOriginClaimConfidence(result: any): string | null {
  return (
    asString(safeGet(result, ["originClaim", "summary", "confidence"])) ??
    asString(safeGet(result, ["raw", "originClaim", "summary", "confidence"])) ??
    null
  );
}

export default function CandidatesCard({ result, className }: CandidatesCardProps) {
  const list = result ? pickCandidates(result) : [];
  const vms = list.map(normalizeCandidate);

  const ocNote = result ? pickOriginClaimSummary(result) : null;
  const ocConf = result ? pickOriginClaimConfidence(result) : null;

  const passed = vms.filter((c) => (c.status ?? "").toLowerCase() === "pass").length;
  const failed = vms.filter((c) => (c.status ?? "").toLowerCase() === "fail").length;

  return (
    <Card className={["bg-zinc-950 text-zinc-100 border-zinc-800", className ?? ""].join(" ")}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Candidates</CardTitle>
        <div className="mt-1 text-xs text-zinc-400">
          Deterministic view over the candidate list. No ranking. No “winner”.
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!result ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
            No result yet.
          </div>
        ) : vms.length === 0 ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
            No candidates emitted.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              {pill(`count=${vms.length}`)}
              {pill(`pass=${passed}`)}
              {pill(`fail=${failed}`)}
              {ocConf ? pill(`originClaim.confidence=${ocConf}`) : pill("originClaim.confidence=N/A")}
            </div>

            <div className="space-y-2">
              {vms.map((c) => (
                <Collapsible key={c.id} defaultOpen={false}>
                  <div className="rounded-md border border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-start justify-between gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-zinc-700 text-zinc-200">
                            {c.language}
                          </Badge>
                          <span className="font-mono text-sm text-zinc-100">{c.form}</span>
                          {statusBadge(c.status)}
                          {confidenceBadge(c.confidence)}
                          {c.vowelPath ? pill(`path=${c.vowelPath}`) : pill("path=N/A")}
                          {c.fitTag ? pill(`fit=${c.fitTag}`) : null}
                        </div>

                        <div className="mt-2 text-sm text-zinc-200">
                          {c.functionalStatement ? (
                            <span>{c.functionalStatement}</span>
                          ) : (
                            <span className="text-zinc-400">No functional statement available.</span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-200">
                            Details
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-zinc-200"
                          onClick={() => copyText(JSON.stringify(c.raw, null, 2))}
                        >
                          Copy Candidate JSON
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="border-t border-zinc-800 p-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                            <div className="mb-2 text-xs text-zinc-400">Candidate fields</div>
                            <div className="space-y-1 text-xs text-zinc-200">
                              <div><span className="text-zinc-400">id:</span> <span className="font-mono">{c.id}</span></div>
                              <div><span className="text-zinc-400">language:</span> {c.language}</div>
                              <div><span className="text-zinc-400">form:</span> <span className="font-mono">{c.form}</span></div>
                              <div><span className="text-zinc-400">status:</span> {c.status ?? "N/A"}</div>
                              <div><span className="text-zinc-400">confidence:</span> {c.confidence ?? "N/A"}</div>
                              <div><span className="text-zinc-400">vowelPath:</span> {c.vowelPath ?? "N/A"}</div>
                              <div><span className="text-zinc-400">fitTag:</span> {c.fitTag ?? "N/A"}</div>
                            </div>
                          </div>

                          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                            <div className="mb-2 text-xs text-zinc-400">Raw JSON</div>
                            <pre className="whitespace-pre-wrap break-words text-xs text-zinc-200">
                              {JSON.stringify(c.raw, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-300">
              <div className="text-zinc-400">SUMMARY (from OriginClaim)</div>
              <div className="mt-1">
                {ocNote ? ocNote : "No OriginClaim summary available."}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

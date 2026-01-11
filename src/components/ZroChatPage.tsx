"use client";

import React from "react";
import { buildInstrumentVmV1 } from "@/ui/instrument/instrumentVm.v1";
import ChatShell from "@/components/ChatShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; result?: unknown; error?: string };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

type Obj = Record<string, unknown>;

function asObj(v: unknown): Obj | null {
  return v && typeof v === "object" ? (v as Obj) : null;
}

function get(o: Obj | null, key: string): unknown {
  return o ? o[key] : undefined;
}

function getStr(o: Obj | null, key: string): string | null {
  const v = get(o, key);
  return typeof v === "string" ? v : null;
}

function firstCandidate(result: unknown): Obj | null {
  const r = asObj(result);
  const cands = get(r, "candidates");
  if (!Array.isArray(cands) || cands.length < 1) return null;
  return asObj(cands[0]);
}

function pickVowelPath(result: unknown): string | null {
  const r = asObj(result);
  const c0 = firstCandidate(result);
  return (
    getStr(r, "vowelPath") ??
    getStr(r, "vowel_path") ??
    getStr(c0, "vowelPath") ??
    getStr(c0, "vowel_path")
  );
}

function pickEngineVersion(result: unknown): string | null {
  const r = asObj(result);
  const meta = asObj(get(r, "meta"));
  return (
    getStr(r, "engineVersion") ??
    getStr(r, "engine_version") ??
    getStr(meta, "engineVersion")
  );
}

function pickTopCandidateLang(result: unknown): string {
  const c0 = firstCandidate(result);
  return getStr(c0, "language") ?? getStr(c0, "lang") ?? "unknown";
}

function pickWordShown(result: unknown): string {
  const r = asObj(result);
  return getStr(r, "word") ?? getStr(r, "normalizedWord") ?? "";
}


function splitVowelPath(vowelPath: string | null): string[] {
  if (typeof vowelPath !== "string") return [];
  return vowelPath
    .split(/[-–—→\s]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function VowelChips({ path }: { path: string[] }) {
  if (!path.length) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {path.map((v, i) => (
        <Badge key={`${v}-${i}`} variant="secondary" className="text-xs">
          {v}
        </Badge>
      ))}
    </div>
  );
}

function VoiceRow() {
  const order = ["O", "I", "U", "E", "Y", "A", "Ë"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {order.map((v) => (
        <Badge key={v} variant="outline" className="text-xs">
          {v}
        </Badge>
      ))}
      <span className="text-xs text-muted-foreground ml-1">Seven-vowel</span>
    </div>
  );
}

export default function ZroChatPage() {
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showRaw, setShowRaw] = React.useState(false);

  const [validation, setValidation] = React.useState<string | null>(null);
  const [statusBanner, setStatusBanner] = React.useState<string | null>(null);

  // proof-of-life debug (visible in UI)
  const [debug, setDebug] = React.useState<string>("");

  const [messages, setMessages] = React.useState<Msg[]>([
    { id: uid(), role: "assistant", text: "Type a word and press Analyze." },
  ]);

  const errMsg = (e: unknown, fallback = "Request failed.") =>
    e instanceof Error ? e.message : fallback;

  const safeString = (v: unknown) => {
    try {
      return typeof v === "string" ? v : JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  };

  const pickErr = (j: unknown): unknown => {
    if (!j || typeof j !== "object") return null;
    const o = j as Record<string, unknown>;
    return o.error ?? o.message ?? null;
  };

  async function run(wordRaw: string) {
    if (busy) return;

    const word = wordRaw.trim();

    if (!word) {
      setValidation("Type a word before analyzing.");
      setStatusBanner(null);
      setDebug("validation: empty word");
      return;
    }

    setValidation(null);
    setStatusBanner(null);

    const userMsg: Msg = { id: uid(), role: "user", text: word };
    const assistantMsg: Msg = { id: uid(), role: "assistant", text: "Analyzing…" };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setBusy(true);

    const url = `/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`;
    setDebug(`clicked → url=${url}`);

    try {
      const res = await fetch(url, { method: "GET" });
      setDebug((d) => `${d}\nstatus=${res.status}`);

      let text = "";
      try {
        if (typeof res.text === "function") {
          text = await res.text();
        } else if (typeof res.json === "function") {
          const j = await res.json();
          text = JSON.stringify(j);
        } else {
          text = "";
        }
      } catch (e: unknown) {
        text = "";
        setDebug((d) => `${d}\nREAD BODY ERROR: ${errMsg(e, String(e))}`);
      }

      setDebug((d) => `${d}\nbody[0..200]=${safeString(text).slice(0, 200).replace(/\s+/g, " ")}...`);

      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e: unknown) {
        json = null;
        setDebug((d) => `${d}\nJSON.parse ERROR: ${errMsg(e, String(e))}`);
      }

      if (!res.ok) {
        setStatusBanner("Engine error");

        const err = pickErr(json) ?? `HTTP ${res.status}`;

        setMessages((m) =>
          m.map((x) =>
            x.id === assistantMsg.id
              ? { ...x, text: "Request failed.", error: safeString(err), result: json ?? undefined }
              : x
          )
        );
        return;
      }

      setMessages((m) =>
        m.map((x) =>
          x.id === assistantMsg.id ? { ...x, text: "Result:", result: json ?? undefined } : x
        )
      );

      setDebug((d) => `${d}\nsetMessages(result)=ok`);
    } catch (e: unknown) {
      setStatusBanner("Network error");
      setDebug(`NET_ERR: ${errMsg(e, String(e))}`);

      setMessages((m) =>
        m.map((x) =>
          x.id === assistantMsg.id
            ? { ...x, text: "Request failed.", error: errMsg(e) }
            : x
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const composer = (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Enter a word</div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setValidation(null);
            setStatusBanner(null);
            setDebug("");
          }}
          placeholder="study"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void run(input);
            }
          }}
          className="h-11"
        />
        <Button
          type="button"
          className="h-11"
          onClick={() => void run(input)}
          disabled={busy}
          aria-busy={busy ? "true" : "false"}
        >
          {busy ? "Working…" : "Analyze"}
        </Button>
      </div>
    </div>
  );

  return (
    <ChatShell title="ZË-RO" subtitle="Seven-vowel word decoder." composer={composer}>
      <div className="space-y-4">
        {(validation || statusBanner) && (
          <div role="alert" className="text-sm text-red-400">
            {validation || statusBanner}
          </div>
        )}

        {/* proof-of-life debug output */}
        {debug ? (
          <pre className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{debug}</pre>
        ) : null}

        <div className="mb-6" />

        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Voices</div>
              <div className="text-xs text-muted-foreground">
                Shown in ring order (not A/E/I/O/U/Y/Ë)
              </div>
            </div>
            <VoiceRow />
          </CardContent>
        </Card>

        <div className="space-y-3">
          {messages.map((m) => {
            const isUser = m.role === "user";
            const result = m.role === "assistant" ? m.result : undefined;

            const vowelPath = pickVowelPath(result);

            const engineVersion = pickEngineVersion(result);

            const instrumentVm = buildInstrumentVmV1(result);
            const telemetryVm = adaptAnalysisToTelemetryVM(result);

            const candidateLang = pickTopCandidateLang(result);

            const wordShown = pickWordShown(result);

            const chips = splitVowelPath(vowelPath);

            return (
              <div key={m.id} className={isUser ? "flex justify-end" : "flex justify-start"}>
                <div className="w-full max-w-6xl">
                  <Card className={isUser ? "border-muted" : ""}>
                    <CardContent className="py-4 space-y-3">
                      <div className="text-sm whitespace-pre-wrap">{m.text}</div>

                      {m.role === "assistant" && m.error ? (
                        <div className="text-sm text-red-400 whitespace-pre-wrap">{m.error}</div>
                      ) : null}

                      {result ? (
                        <>
                          <Separator />

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground">Word</div>
                              <div className="text-sm font-medium">{wordShown || "—"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Engine</div>
                              <div className="text-sm font-medium">{engineVersion || "—"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Top candidate</div>
                              <div className="text-sm font-medium">{candidateLang || "—"}</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground">Vowel path</div>
                            <VowelChips path={chips} />
                          </div>

                          <Separator />

                          <InstrumentPanel vm={telemetryVm} />

                          <Collapsible open={showRaw} onOpenChange={setShowRaw}>
                            <div className="flex items-center justify-between">
                              <CollapsibleTrigger asChild>
                                <Button type="button" variant="secondary" size="sm">
                                  {showRaw ? "Hide raw" : "Show raw"}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                              <pre className="mt-2 text-xs whitespace-pre-wrap opacity-90">
                                {safeString(result)}
                              </pre>
                            </CollapsibleContent>
                          </Collapsible>
                        </>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChatShell>
  );
}

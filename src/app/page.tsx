
"use client";

import * as React from "react";
import { useActionState } from "react";
import { analyzeWordAction } from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type EngineResult = Awaited<ReturnType<typeof analyzeWordAction>> extends { ok:true; data: { analysis: infer D } } ? D : never;

const COLORS: Record<string,string> = { A:"#ef4444", E:"#f59e0b", I:"#eab308", O:"#10b981", U:"#3b82f6", Y:"#6366f1", "Ë":"#8b5cf6" };

function PathChips({ path }: { path: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {path.map((v, i) => (
        <React.Fragment key={i}>
          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLORS[v] || "#3F51B5" }} />
            {v}
          </span>
          {i < path.length - 1 && <span className="font-bold text-amber-600">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Page() {
  const { toast } = useToast();
  const [word, setWord] = React.useState("damage");
  const [mode, setMode] = React.useState<"strict"|"open">("strict");

  // Server Action wiring
  async function submit(_: any, fd: FormData) {
    const res = await analyzeWordAction(fd);
    if (!res.ok) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
      return null;
    }
    // local history (stateless)
    try {
      const k = "ld:history:v1";
      const cur: any[] = JSON.parse(localStorage.getItem(k) || "[]");
      const item = { word: res.data.analysis.word, mode: res.data.analysis.mode, primary: res.data.analysis.primary.voice_path, at: Date.now() };
      const key = (x:any) => `${x.word}|${x.mode}|${x.primary.join("")}`;
      const next = [item, ...cur.filter(x => key(x) !== key(item))].slice(0, 50);
      localStorage.setItem(k, JSON.stringify(next));
    } catch {}

    return res.data.analysis as EngineResult;
  }
  const [state, formAction, pending] = useActionState(submit, null as any as EngineResult | null);

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Linguistic Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form action={formAction} className="flex flex-col gap-3 md:flex-row">
            <Input name="word" value={word} onChange={e=>setWord(e.target.value)} placeholder="Enter a word…" />
            <input type="hidden" name="mode" value={mode} />
            <div className="flex gap-2">
              <Button type="submit" disabled={pending || !word.trim()}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Analyze
              </Button>
              <Button type="button" variant={mode==="strict"?"secondary":"outline"} onClick={()=>setMode("strict")}>Strict</Button>
              <Button type="button" variant={mode==="open"?"secondary":"outline"} onClick={()=>setMode("open")}>Open</Button>
            </div>
          </form>

          <Separator />

          {!state ? (
            <div className="text-sm text-muted-foreground">Type a word and click Analyze.</div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader><CardTitle className="text-base">Primary Path</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <PathChips path={state.primary.voice_path} />
                  <div className="text-xs font-mono">Levels: {state.primary.level_path.join(" → ")}</div>
                  <div className="text-xs font-mono">Rings: {state.primary.ring_path.join(" → ")}</div>
                  <div className="text-xs font-mono">Checksums: V={state.primary.checksums.V} · E={state.primary.checksums.E} · C={state.primary.checksums.C}</div>
                  {"kept" in state.primary && <div className="text-xs">Keeps: {state.primary.kept}</div>}
                  {!!state.primary.ops?.length && (
                    <div className="text-xs">Ops: {state.primary.ops.join("; ")}</div>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader><CardTitle className="text-base">Frontier (near-optimal)</CardTitle></CardHeader>
                <CardContent>
                  {!state.frontier?.length ? (
                    <div className="text-xs text-muted-foreground">No alternates.</div>
                  ) : (
                    <ScrollArea className="h-56 pr-2">
                      <div className="space-y-3">
                        {state.frontier.map((f, i) => (
                          <div key={i} className="rounded-md border p-2">
                            <div className="text-xs mb-1 font-medium">Alt #{i+1}</div>
                            <PathChips path={f.voice_path} />
                            <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] font-mono">
                              <div>V={f.checksums.V}</div><div>E={f.checksums.E}</div><div>C={f.checksums.C}</div>
                            </div>
                            {"kept" in f && <div className="text-[11px]">Keeps: {f.kept}</div>}
                            <div className="text-[11px]">Levels: {f.level_path.join(" → ")}</div>
                            <div className="text-[11px]">Rings: {f.ring_path.join(" → ")}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {state && (
        <Card>
          <CardHeader><CardTitle className="text-base">API Echo (normalized)</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(state, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

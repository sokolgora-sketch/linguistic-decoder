"use client";
import React, { useState } from "react";
import { solveWord } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

type Mode = "strict"|"open";
type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie";

function normalizeExpected(s?: string) {
  if (!s) return "";
  const only = s.toUpperCase().replace(/[^AEIOUYË]/g, "");
  return only.split("").join("→");
}
function joinPath(v?: string[]) { return (v||[]).join("→"); }

function toCSV(rows: string[][]) {
  return rows.map(r => r.map(x => `"${(x ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
}
function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function EvalPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<{accuracy:number|null; labeled:number; total:number}>({accuracy:null, labeled:0, total:0});
  const [busy, setBusy] = useState(false);
  const [modeDefault, setModeDefault] = useState<Mode>("strict");
  const [alphabetDefault, setAlphabetDefault] = useState<Alphabet>("auto");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try {
      const text = await f.text();
      const lines = text.split(/\r?\n/).filter(x => x.trim().length>0);
      const header = lines[0].split(",").map(h => h.trim().toLowerCase());
      const idx = (name:string)=> header.indexOf(name);
      const iWord = idx("word"); if (iWord<0) throw new Error('CSV needs "word" column');
      const iExp  = idx("expected");
      const iMode = idx("mode");
      const iAlpha = idx("alphabet");

      const manifest = getManifest(process.env.NEXT_PUBLIC_ENGINE_VERSION);
      const out: any[] = [];
      let labeled=0, correct=0;

      for (let i=1;i<lines.length;i++) {
        const cols = lines[i].split(",").map(c=>c.trim());
        const word = cols[iWord];
        const expected = normalizeExpected(iExp>=0 ? cols[iExp] : "");
        const mode = (cols[iMode] as Mode) || modeDefault;
        const alphabet = (cols[iAlpha] as Alphabet) || alphabetDefault;

        const opts = mode === "strict"
          ? { beamWidth:8, maxOps:1, allowDelete:false, allowClosure:false, opCost:{sub:1,del:3,ins:2}, alphabet, manifest, edgeWeight: manifest.edgeWeight }
          : { beamWidth:8, maxOps:2, allowDelete:true, allowClosure:true,  opCost:{sub:1,del:3,ins:2}, alphabet, manifest, edgeWeight: manifest.edgeWeight };

        const res:any = solveWord(word, opts, alphabet);
        const predicted = joinPath(res?.primaryPath?.voicePath);
        const ok = expected ? (predicted === expected) : null;
        if (expected) { labeled++; if (ok) correct++; }
        out.push({ word, expected, predicted, ok, mode, alphabet });
      }

      setRows(out);
      setMetrics({
        accuracy: labeled ? +(correct/labeled).toFixed(4) : null,
        labeled, total: out.length
      });
    } catch (err:any) {
      alert(err?.message || String(err));
    } finally {
      setBusy(false);
      (e.target as HTMLInputElement).value = "";
    }
  }

  function downloadPreds() {
    const head = ["word","expected","predicted","ok","mode","alphabet"];
    const body = rows.map(r => [r.word, r.expected, r.predicted, r.ok===null?"":(r.ok?1:0), r.mode, r.alphabet]);
    download("predictions.csv", toCSV([head, ...body]));
  }
  function downloadConfusion() {
    const labels = Array.from(new Set<string>([
      ...rows.filter(r=>r.expected).map(r=>r.expected),
      ...rows.map(r=>r.predicted)
    ].filter(Boolean))).sort();
    const map = new Map<string, number>();
    for (const r of rows) {
      if (!r.expected) continue;
      const key = `${r.expected}|${r.predicted}`;
      map.set(key, (map.get(key)||0)+1);
    }
    const head = ["expected \\ predicted", ...labels];
    const table: string[][] = [head];
    for (const exp of labels) {
      const row = [exp, ...labels.map(pred => String(map.get(`${exp}|${pred}`)||0))];
      table.push(row);
    }
    download("confusion.csv", toCSV(table));
  }

  return (
    <div className="border rounded-lg p-3 space-y-2 bg-card">
      <div className="font-semibold">Batch Eval</div>
      <div className="text-xs opacity-80">Upload CSV with headers: <code>word,expected,mode,alphabet</code></div>
      <div className="flex gap-2 items-center">
        <label className="text-xs">Default mode</label>
        <select className="border rounded px-2 py-1 text-sm bg-background" value={modeDefault} onChange={e=>setModeDefault(e.target.value as Mode)}>
          <option value="strict">strict</option>
          <option value="open">open</option>
        </select>
        <label className="text-xs">Default alphabet</label>
        <select className="border rounded px-2 py-1 text-sm bg-background" value={alphabetDefault} onChange={e=>setAlphabetDefault(e.target.value as Alphabet)}>
          <option value="auto">auto</option>
          <option value="albanian">albanian</option>
          <option value="latin">latin</option>
          <option value="sanskrit">sanskrit</option>
          <option value="ancient_greek">ancient_greek</option>
          <option value="pie">pie</option>
        </select>

        <label className="border rounded px-2 py-1 text-sm cursor-pointer ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
          {busy ? "Processing…" : "Upload CSV"}
          <input type="file" accept=".csv" className="hidden" onChange={onFile} />
        </label>
      </div>

      <div className="text-xs opacity-80">
        Labeled: <b>{metrics.labeled}</b> / Total: <b>{metrics.total}</b>
        {metrics.accuracy !== null && <> · Accuracy: <b>{(metrics.accuracy*100).toFixed(2)}%</b></>}
      </div>

      {rows.length > 0 && (
        <div className="flex gap-2">
          <button className="border rounded px-2 py-1 text-sm" onClick={downloadPreds}>Download predictions.csv</button>
          <button className="border rounded px-2 py-1 text-sm" onClick={downloadConfusion}>Download confusion.csv</button>
        </div>
      )}

      {rows.length > 0 && (
        <div className="max-h-64 overflow-auto border rounded">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="text-left p-2">word</th>
                <th className="text-left p-2">expected</th>
                <th className="text-left p-2">predicted</th>
                <th className="text-left p-2">ok</th>
                <th className="text-left p-2">mode</th>
                <th className="text-left p-2">alphabet</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900/50 dark:even:bg-slate-800/50">
                  <td className="p-2 font-medium">{r.word}</td>
                  <td className="p-2 text-green-700 dark:text-green-400">{r.expected}</td>
                  <td className="p-2 font-semibold">{r.predicted}</td>
                  <td className="p-2 text-center">{r.ok===null ? "—" : (r.ok ? "✅" : "❌")}</td>
                  <td className="p-2">{r.mode}</td>
                  <td className="p-2">{r.alphabet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

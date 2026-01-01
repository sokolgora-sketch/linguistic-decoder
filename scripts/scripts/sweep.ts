#!/usr/bin/env ts-node
require("ts-node/register"); require("tsconfig-paths/register");

import fs from "fs";
import { runAnalysis } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { Alphabet } from "@/lib/runAnalysis";

type Mode = "strict"|"open";
function norm(s?: string){ if(!s) return ""; return s.toUpperCase().replace(/[^AEIOUYË]/g,"").split("").join("→"); }
function readCSV(p:string){ return fs.readFileSync(p,"utf8").split(/\r?\n/).filter(x=>x.trim()).map(l=>l.split(",").map(x=>x.trim())); }

const file = process.argv[2] || "data/gold.csv";
const rows = readCSV(file);
const header = rows[0].map(h=>h.toLowerCase());
const iWord = header.indexOf("word");
const iExp  = header.indexOf("expected");
const iMode = header.indexOf("mode");
const data  = rows.slice(1);

type Ex = { word:string; expected:string; mode:Mode };
const set: Ex[] = data.map(r=>({
  word: r[iWord],
  expected: norm(iExp>=0 ? r[iExp] : ""),
  mode: (iMode>=0 ? r[iMode] : "strict") as Mode
})).filter(x=>x.word);

const manifestBase = getManifest(process.env.NEXT_PUBLIC_ENGINE_VERSION);
const edges = [0.15, 0.25, 0.35];
const insCosts = [2,3];
const delCosts = [3,4];

function optsStrict(edge:number, ins:number, del:number){
  const manifest = { ...manifestBase, edgeWeight: edge, opCost: { sub:1, del, ins } };
  return {
    beamWidth:8, maxOps:1, allowDelete:false, allowClosure:false,
    opCost: manifest.opCost,
    alphabet:"auto" as const,
    manifest,
    edgeWeight: edge
  };
}

console.log("edge,ins,del,accuracy,labeled,total");
for (const edge of edges){
  for (const ins of insCosts){
    for (const del of delCosts){
      let labeled=0, correct=0;
      for (const r of set){
        if (!r.expected || r.mode!=="strict") continue;
        const out:any = runAnalysis(r.word, optsStrict(edge,ins,del) as any, "auto");
        const pred = (out?.primaryPath?.voicePath||[]).join("→");
        labeled++; if (pred === r.expected) correct++;
      }
      const acc = labeled? (correct/labeled).toFixed(4) : "NA";
      console.log(`${edge},${ins},${del},${acc},${labeled},${set.length}`);
    }
  }
}

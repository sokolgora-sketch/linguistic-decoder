
import type { EnginePayload } from "@/shared/engineShape";

export const PRINCIPLES: Record<string, {label:string; color:string}> = {
  A: { label:"Truth",              color:"#E53935" },  // Red
  E: { label:"Expansion",          color:"#FB8C00" },  // Orange
  I: { label:"Insight",            color:"#FDD835" },  // Yellow
  O: { label:"Balance",            color:"#43A047" },  // Green
  U: { label:"Unity",              color:"#1E88E5" },  // Blue
  Y: { label:"Network Integrity",  color:"#3949AB" },  // Indigo
  Ë: { label:"Evolution",          color:"#8E24AA" },  // Violet
};

const ORDER = ["A","E","I","O","U","Y","Ë"] as const;

export function summarizePrinciples(engine: EnginePayload) {
  const vp: string[] = engine?.primaryPath?.voicePath ?? [];
  const counts: Record<string, number> = {A:0,E:0,I:0,O:0,U:0,Y:0,Ë:0};
  vp.forEach(v => { if (counts[v] !== undefined) counts[v]++; });

  // Dominant = by count, tie-break by ORDER index
  const dominant = ORDER
    .map(k=>({k, n:counts[k]}))
    .sort((a,b)=> b.n - a.n || ORDER.indexOf(a.k as any) - ORDER.indexOf(b.k as any))
    .slice(0,3)
    .filter(x=>x.n>0);

  const pathLabels = vp.map(v => PRINCIPLES[v].label);
  const sevenWords = ORDER.map(v => PRINCIPLES[v].label).join(" ");

  return {
    counts,
    dominant: dominant.map(d => ({ voice:d.k, label:PRINCIPLES[d.k].label, hits:d.n })),
    pathLabel: pathLabels.join(" → "),
    sevenWords, // fixed 7-word checksum line
  };
}

import fs from "fs";
import path from "path";

function stableJson(x: any): string {
  const seen = new WeakSet();
  const sorter = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    if (seen.has(obj)) return "[[circular]]";
    seen.add(obj);

    if (Array.isArray(obj)) return obj.map(sorter);

    const out: Record<string, any> = {};
    for (const k of Object.keys(obj).sort()) out[k] = sorter(obj[k]);
    return out;
  };
  return JSON.stringify(sorter(x), null, 2);
}

export function writeCanonC2DiffReportV01(args: {
  outPathMd: string;
  baselineVersion: string;
  trainVersion: string;
  holdoutVersion: string;
  totals: { cases: number; drift: number; ok: number };
  drifts: Array<{ id: string; word: string; baseline: any; current: any }>;
}) {
  const lines: string[] = [];
  lines.push(`# Canon C2 Diff Report v0.1`);
  lines.push("");
  lines.push(`- baseline: \`${args.baselineVersion}\``);
  lines.push(`- train: \`${args.trainVersion}\``);
  lines.push(`- holdout: \`${args.holdoutVersion}\``);
  lines.push("");
  lines.push(`## Summary`);
  lines.push("");
  lines.push(`- cases: **${args.totals.cases}**`);
  lines.push(`- ok: **${args.totals.ok}**`);
  lines.push(`- drift: **${args.totals.drift}**`);
  lines.push("");

  if (args.drifts.length === 0) {
    lines.push(`✅ No drift detected.`);
    lines.push("");
  } else {
    lines.push(`## Drifted cases`);
    lines.push("");
    for (const d of args.drifts) {
      lines.push(`### ${d.id} — \`${d.word}\``);
      lines.push("");
      lines.push(`**Baseline**`);
      lines.push("");
      lines.push("```json");
      lines.push(stableJson(d.baseline));
      lines.push("```");
      lines.push("");
      lines.push(`**Current**`);
      lines.push("");
      lines.push("```json");
      lines.push(stableJson(d.current));
      lines.push("```");
      lines.push("");
    }
  }

  fs.mkdirSync(path.dirname(args.outPathMd), { recursive: true });
  fs.writeFileSync(args.outPathMd, lines.join("\n"), "utf8");
}

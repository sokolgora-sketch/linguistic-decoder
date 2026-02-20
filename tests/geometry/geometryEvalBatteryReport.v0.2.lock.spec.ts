import fs from "fs";
import path from "path";

import battery from "./__fixtures__/maskVsCarrierGeometryBattery.v0.2.json";
import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import { vectorDeltaSummaryV0_1 } from "@/shared/geometry/vectorDeltaSummary.v0.1";

type Row = { id: string; word: string; ipa: string };

function fingerprint(t: any) {
  return `d=${t.totalDist}|nr=${t.netRadial}|in=${t.inwardCount}|out=${t.outwardCount}|c=${t.circularCount}`;
}

function renderReport(rows: Row[]): string {
  const computed = rows.map((r) => {
    const mask = extractOrthographyVoicesFromWordV0_1(r.word);
    const carrier = extractCarrierVoicesFromIpaV0_1(r.ipa);

    const maskVoices = (mask as any)?.voices ?? [];
    const carrierVoices = (carrier as any)?.voices ?? [];

    const maskGeom = vectorDeltaSummaryV0_1(Array.isArray(maskVoices) ? maskVoices : []);
    const carrierGeom = vectorDeltaSummaryV0_1(Array.isArray(carrierVoices) ? carrierVoices : []);

    return {
      ...r,
      maskVoices,
      carrierVoices,
      maskSig: maskGeom.signature,
      carrierSig: carrierGeom.signature,
      maskFP: fingerprint(maskGeom.totals),
      carrierFP: fingerprint(carrierGeom.totals)
    };
  });

  // group by carrier fingerprint (quick “twin” visibility)
  const groups = new Map<string, string[]>();
  for (const c of computed) {
    const key = c.carrierFP;
    const prev = groups.get(key) ?? [];
    prev.push(c.id);
    groups.set(key, prev);
  }

  const lines: string[] = [];
  lines.push("# Geometry Eval Battery Report v0.2");
  lines.push("");
  lines.push("> Deterministic report. No timestamps.");
  lines.push("");
  lines.push(`Rows: ${computed.length}`);
  lines.push("");
  lines.push("## Rows");
  lines.push("");

  for (const c of computed) {
    lines.push(`### ${c.id}`);
    lines.push(`- word: \`${c.word}\``);
    lines.push(`- ipa: \`${c.ipa}\``);
    lines.push(`- mask voices: \`${Array.isArray(c.maskVoices) ? c.maskVoices.join(" ") : ""}\``);
    lines.push(`- carrier voices: \`${Array.isArray(c.carrierVoices) ? c.carrierVoices.join(" ") : ""}\``);
    lines.push(`- mask: \`${c.maskFP}\``);
    lines.push(`- carrier: \`${c.carrierFP}\``);
    lines.push(`- mask sig: \`${c.maskSig}\``);
    lines.push(`- carrier sig: \`${c.carrierSig}\``);
    lines.push("");
  }

  lines.push("## Groups by carrier fingerprint");
  lines.push("");
  const sorted = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [fp, ids] of sorted) {
    if (ids.length < 2) continue; // only show potential “twins”
    lines.push(`- \`${fp}\`: ${ids.map((x) => `\`${x}\``).join(", ")}`);
  }
  lines.push("");

  return lines.join("\n");
}

test("Geometry Eval Battery v0.2 markdown report matches committed file", () => {
  const rows = battery as unknown as Row[];
  const md = renderReport(rows);

  const outPath = path.join(process.cwd(), "docs/reports/geometry-eval-battery.v0.2.md");

  if (process.env.WRITE_REPORT === "1") {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, md, "utf8");
  }

  if (!fs.existsSync(outPath)) {
    throw new Error("Missing docs/reports/geometry-eval-battery.v0.2.md. Run with WRITE_REPORT=1 to generate it.");
  }

  const existing = fs.readFileSync(outPath, "utf8");
  expect(existing).toBe(md);
});

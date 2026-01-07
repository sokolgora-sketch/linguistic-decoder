/**
 * Guardrail: UI adaptation from raw payload must be centralized.
 *
 * Allowed:
 * - src/ui/instrument/InstrumentPanel.tsx (the one place we adapt)
 * - src/ui/instrument/contractAdapter.ts (the adapter itself)
 * - src/ui/telemetry/contractAdapter.ts (re-export shim)
 *
 * Everything else: NO importing adaptAnalysisToTelemetryVM.
 */
import fs from "fs";
import path from "path";

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      out.push(...walk(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function norm(p: string) {
  return p.replace(/\\/g, "/");
}

describe("ui guardrail: contractAdapter import scope", () => {
  it("only InstrumentPanel (and adapter modules) reference adaptAnalysisToTelemetryVM", () => {
    const root = process.cwd();
    const uiRoot = path.join(root, "src", "ui");

    const allowed = new Set([
      "src/ui/instrument/InstrumentPanel.tsx",
      "src/ui/instrument/contractAdapter.ts",
      "src/ui/telemetry/contractAdapter.ts",
    ]);

    const files = walk(uiRoot).filter((p) => p.endsWith(".ts") || p.endsWith(".tsx"));

    const offenders: string[] = [];

    for (const abs of files) {
      const rel = norm(abs).replace(norm(root) + "/", "");
      const text = fs.readFileSync(abs, "utf8");

      // Only detect real imports/usage, not incidental text.
      const referencesAdapter =
        text.includes("adaptAnalysisToTelemetryVM") ||
        text.includes("ui/instrument/contractAdapter");

      if (!referencesAdapter) continue;
      if (allowed.has(rel)) continue;

      offenders.push(rel);
    }

    expect(offenders).toEqual([]);
  });
});
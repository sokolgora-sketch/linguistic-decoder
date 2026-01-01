import fs from "node:fs";

const p = "src/lib/historyFirestore.ts";
let s = fs.readFileSync(p, "utf8");

// 1) Expand args type block inside saveHistoryRecord signature.
const argsBlockRe =
  /export async function saveHistoryRecord\(\s*args:\s*\{\s*cacheId:\s*string;\s*payload:\s*EnginePayload;\s*createdAt\?:\s*number;\s*word\?:\s*string;\s*engineVersion\?:\s*string;\s*mode\?:\s*string;\s*alphabet\?:\s*string;\s*\}\s*,\s*_uid\?:\s*string,\s*\):\s*Promise<void>\s*\{/m;

if (!argsBlockRe.test(s)) {
  console.error("PATCH FAILED: saveHistoryRecord signature args block not in expected shape.");
  process.exit(1);
}

s = s.replace(
  argsBlockRe,
  `export async function saveHistoryRecord(
  args: {
    cacheId: string;
    payload: EnginePayload;
    createdAt?: number;
    word?: string;
    engineVersion?: string;
    mode?: string;
    alphabet?: string;
    heartSummary?: string;
    // Future-proofing: optional bag for new metadata without breaking build again.
    extra?: Record<string, unknown>;
  },
  _uid?: string,
): Promise<void> {`,
);

// 2) Ensure we compute heartSummary (prefer explicit arg; fallback from payload if present)
if (!s.includes("const heartSummary")) {
  // Insert after alphabet declaration if it exists; otherwise after mode declaration.
  if (s.includes("const alphabet =")) {
    s = s.replace(
      /const alphabet = .*?\n\n/s,
      (m) =>
        `${m}  const heartSummary = args.heartSummary ?? (payload as any)?.heart?.narrative ?? (payload as any)?.heartSummary ?? "";\n\n`,
    );
  } else {
    s = s.replace(
      /const mode = .*?\n\n/s,
      (m) =>
        `${m}  const heartSummary = args.heartSummary ?? (payload as any)?.heart?.narrative ?? (payload as any)?.heartSummary ?? "";\n\n`,
    );
  }
}

// 3) Add heartSummary + extra into docData write (stored loosely via "as any" already)
if (!s.includes("heartSummary:")) {
  s = s.replace(
    /alphabet:\s*\(typeof alphabet === "string" \? alphabet : undefined\),\n\s*uid:\s*\(typeof _uid === "string" \? _uid : undefined\),/m,
    `alphabet: (typeof alphabet === "string" ? alphabet : undefined),
    heartSummary: (typeof heartSummary === "string" ? heartSummary : undefined),
    uid: (typeof _uid === "string" ? _uid : undefined),
    extra: (args.extra && typeof args.extra === "object" ? args.extra : undefined),`,
  );
}

// 4) Expand HistoryDocData type to include heartSummary/extra (optional)
s = s.replace(
  /export type HistoryDocData = \{\n([\s\S]*?)\n\};/m,
  (m) => {
    let out = m;
    if (!out.includes("heartSummary?:")) out = out.replace(/\n\};$/, `\n  heartSummary?: string;\n};`);
    if (!out.includes("extra?:")) out = out.replace(/\n\};$/, `\n  extra?: Record<string, unknown>;\n};`);
    return out;
  },
);

fs.writeFileSync(p, s, "utf8");
console.log("Patched:", p, "(added heartSummary + extra to saveHistoryRecord args/doc)");

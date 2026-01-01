import fs from "node:fs";

const p = "src/lib/historyFirestore.ts";
let s = fs.readFileSync(p, "utf8");

// 1) Expand args type in signature
// From: saveHistoryRecord(args: { cacheId: string; payload: EnginePayload; createdAt?: number; }, _uid?: string)
// To:   saveHistoryRecord(args: { cacheId: string; payload: EnginePayload; createdAt?: number; word?: string; engineVersion?: string; mode?: string; alphabet?: string; }, _uid?: string)

const sigRe =
  /export async function saveHistoryRecord\s*\(\s*args:\s*\{\s*cacheId:\s*string;\s*payload:\s*EnginePayload;\s*createdAt\?:\s*number;\s*\}\s*,\s*_uid\?:\s*string\s*\)\s*:\s*Promise<void>\s*\{/m;

if (!sigRe.test(s)) {
  console.error("PATCH FAILED: saveHistoryRecord signature not in expected shape.");
  console.error("Open src/lib/historyFirestore.ts and find 'export async function saveHistoryRecord' to confirm.");
  process.exit(1);
}

s = s.replace(
  sigRe,
  `export async function saveHistoryRecord(
  args: {
    cacheId: string;
    payload: EnginePayload;
    createdAt?: number;
    word?: string;
    engineVersion?: string;
    mode?: string;
    alphabet?: string;
  },
  _uid?: string,
): Promise<void> {`,
);

// 2) Update body to prefer explicit args.word/mode/engineVersion (keep existing fallback logic)
const wordRe = /const word\s*=\s*([\s\S]*?);\n\n\s*const mode\s*=\s*([\s\S]*?);\n\s*const engineVersion\s*=\s*([\s\S]*?);\n/m;

if (!wordRe.test(s)) {
  console.error("PATCH FAILED: could not find the word/mode/engineVersion block in saveHistoryRecord.");
  process.exit(1);
}

s = s.replace(
  wordRe,
  `const word =
    args.word ??
    (payload as any)?.word ??
    (payload as any)?.sanitized ??
    (payload as any)?.basis ??
    "";

  const mode = args.mode ?? (payload as any)?.mode ?? "strict";

  const engineVersion =
    args.engineVersion ??
    (payload as any)?.engineVersion ??
    (payload as any)?.engine_meta?.engineVersion ??
    null;

`,
);

// 3) Ensure alphabet is included in written doc (optional field, harmless)
if (!s.includes("const alphabet =")) {
  // Insert after mode declaration (we just rewrote that block, so anchor on `const mode =`)
  s = s.replace(
    /const mode = .*?;\n\n/s,
    (m) => `${m}  const alphabet = args.alphabet ?? (payload as any)?.alphabet ?? "auto";\n\n`,
  );
}

// 4) Add alphabet + uid into docData if not present
// Find docData object and include mode/word already present; add alphabet + uid.
s = s.replace(
  /const docData:\s*HistoryDocData\s*=\s*\{\s*cacheId,\s*word,\s*mode,\s*engineVersion,\s*createdAt,\s*\};/m,
  `const docData: HistoryDocData = {
    cacheId,
    word,
    mode,
    engineVersion,
    createdAt,
    // extra metadata (kept optional/loose on purpose)
    alphabet: (typeof alphabet === "string" ? alphabet : undefined),
    uid: (typeof _uid === "string" ? _uid : undefined),
  } as any;`,
);

// 5) Expand HistoryDocData type to allow alphabet/uid (optional) if not already present
if (!/alphabet\?:\s*string/.test(s) || !/uid\?:\s*string/.test(s)) {
  s = s.replace(
    /export type HistoryDocData = \{\n([\s\S]*?)\n\};/m,
    (m) => {
      if (m.includes("alphabet?:") && m.includes("uid?:")) return m;
      // Inject before closing brace
      return m.replace(/\n\};$/, `\n  alphabet?: string;\n  uid?: string;\n};`);
    },
  );
}

fs.writeFileSync(p, s, "utf8");
console.log("Patched:", p, "(saveHistoryRecord args expanded to include word/engineVersion/mode/alphabet)");

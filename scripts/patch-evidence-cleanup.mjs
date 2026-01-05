import fs from "node:fs";

const FILE = "app/api/analyze-v1/route.ts";
let src = fs.readFileSync(FILE, "utf8");

function replaceFn(name, replacement) {
  // Replace: function NAME(...) { ... }  (non-greedy, across lines)
  const re = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}`, "m");
  if (!re.test(src)) {
    console.error("ERROR: could not find function:", name);
    process.exit(1);
  }
  src = src.replace(re, replacement.trim());
}

replaceFn(
  "buildEvidenceV1FromPayload",
  `
function buildEvidenceV1FromPayload(payload: any) {
  const voicePath = Array.isArray(payload?.primaryPath?.voicePath)
    ? [...payload.primaryPath.voicePath]
    : [];
  const ringPath = Array.isArray(payload?.primaryPath?.ringPath)
    ? [...payload.primaryPath.ringPath]
    : [];
  const levelPath = Array.isArray(payload?.primaryPath?.levelPath)
    ? [...payload.primaryPath.levelPath]
    : [];
  const ops = Array.isArray(payload?.primaryPath?.ops) ? [...payload.primaryPath.ops] : [];

  const sig = new Set<string>(Array.isArray(payload?.signals) ? payload.signals : []);
  sig.add("EVIDENCE_V1");
  sig.delete("EVIDENCE_MISSING_FALLBACK");

  const math7 =
    payload?.math7 ??
    payload?.math7Summary ??
    payload?.primaryPath?.math7 ??
    payload?.data?.math7 ??
    payload?.engine?.math7 ??
    payload?.heart?.math7 ??
    payload?.raw?.heart?.math7 ??
    null;

  const solveMs =
    payload?.solveMs ??
    payload?.data?.solveMs ??
    payload?.engine?.solveMs ??
    null;

  return {
    basis: String(payload?.word ?? ""),
    surfaceVowels: voicePath,
    ringPath,
    levelPath,
    ops,
    math7,
    solveMs,
    cacheHit: payload?.cacheHit ?? null,
    recomputed: payload?.recomputed ?? null,
    normalizationSteps: [],
    notes: [],
    signals: Array.from(sig),
  };
}
`
);

replaceFn(
  "backfillEvidenceMath7",
  `
function backfillEvidenceMath7(params: {
  evidence: any;
  ensured: any;
  out: any;
  heartInstrumentV1?: any;
}) {
  const { evidence, ensured, out, heartInstrumentV1 } = params;

  const math7 =
    evidence?.math7 ??
    ensured?.heart?.math7 ??
    ensured?.raw?.heart?.math7 ??
    out?.heart?.math7 ??
    out?.raw?.heart?.math7 ??
    heartInstrumentV1?.math7 ??
    null;

  if (math7 != null && evidence?.math7 == null) {
    evidence.math7 = math7;
    evidence.signals = Array.isArray(evidence.signals) ? evidence.signals : [];
    if (!evidence.signals.includes("EVIDENCE_MATH7_BACKFILL")) {
      evidence.signals.push("EVIDENCE_MATH7_BACKFILL");
    }
  }

  return evidence;
}
`
);

fs.writeFileSync(FILE, src, "utf8");
console.log("OK: cleaned up buildEvidenceV1FromPayload + backfillEvidenceMath7");

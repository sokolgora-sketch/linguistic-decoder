// Canonical shape your UI will use everywhere.
export type Vowel = 'A'|'E'|'I'|'O'|'U'|'Y'|'Ë';

export type EnginePath = {
  voicePath: Vowel[];
  ringPath: number[];
  levelPath: number[];
  ops?: string[];
  checksums?: { V: number; E: number; C: number; };
  kept?: number;
};

export type EnginePayload = {
  engineVersion: string;
  word: string;
  mode: 'strict' | 'open';
  alphabet: string;
  primaryPath: EnginePath;
  frontierPaths?: EnginePath[];
  windows?: string[];
  windowClasses?: string[];
  signals?: string[];
  solveMs?: number;
  cacheHit?: boolean;
  recomputed?: boolean;
  languageFamilies?: Record<string, { form:string; map:string[]; functional:string }[]> | null;
};

// --- normalizer accepts API/local/malformed and returns EnginePayload or throws ---
function isArray(x:any){ return Array.isArray(x); }
function isObj(x:any){ return x && typeof x === 'object'; }

function camelFromSnake(p:any): EnginePath | undefined {
  if (!isObj(p)) return undefined;
  // support snake_case alt keys
  const voicePath = p.voicePath ?? p.voice_path;
  const ringPath  = p.ringPath  ?? p.ring_path;
  const levelPath = p.levelPath ?? p.level_path;
  const checksums = p.checksums;
  const ops       = p.ops;
  const kept      = p.kept;
  if (!isArray(voicePath) || !isArray(ringPath) || !isArray(levelPath)) return undefined;
  return { voicePath, ringPath, levelPath, ops, checksums, kept };
}

export function normalizeEnginePayload(raw:any): EnginePayload {
  if (!raw) throw new Error("normalizeEnginePayload: empty payload");

  // Unwrap common wrappers: {analysis:{...}}, {data:{...}}
  const a = raw.analysis ?? raw.data ?? raw;

  // Try direct camel
  let primary = a.primaryPath;
  // Try nested/alt shapes: primary, primary_path
  primary = primary ?? a.primary ?? a.primary_path;

  // Try convert snake→camel if needed
  if (primary && !primary.voicePath) {
    primary = camelFromSnake(primary);
  }

  if (!primary || !isArray(primary.voicePath) || !isArray(primary.ringPath) || !isArray(primary.levelPath)) {
    const keys = isObj(a) ? Object.keys(a) : String(a);
    throw new Error("normalizeEnginePayload: bad primaryPath; keys=" + JSON.stringify(keys));
  }

  // Frontier may be under different keys and may be snake case; normalize list
  const rawFrontier = a.frontierPaths ?? a.frontier ?? a.frontier_paths ?? [];
  const frontier: EnginePath[] = (isArray(rawFrontier) ? rawFrontier : []).map((p:any) => {
    const n = camelFromSnake(p) ?? p;
    return {
      voicePath: n.voicePath ?? [],
      ringPath:  n.ringPath  ?? [],
      levelPath: n.levelPath ?? [],
      ops: n.ops ?? [],
      checksums: n.checksums ?? { V:0, E:0, C:0 },
      kept: n.kept
    };
  }).filter(p => p.voicePath.length > 0);

  return {
    engineVersion: a.engineVersion ?? "unknown",
    word: String(a.word ?? ""),
    mode: a.mode === "open" ? "open" : "strict",
    alphabet: String(a.alphabet ?? "auto"),
    primaryPath: {
      voicePath: primary.voicePath,
      ringPath:  primary.ringPath,
      levelPath: primary.levelPath,
      ops:       primary.ops ?? [],
      checksums: primary.checksums ?? { V:0, E:0, C:0 },
      kept: primary.kept
    },
    frontierPaths: frontier,
    windows: a.windows ?? [],
    windowClasses: a.windowClasses ?? [],
    signals: a.signals ?? [],
    solveMs: a.solveMs,
    cacheHit: raw.cacheHit, // from wrapper
    recomputed: raw.recomputed,
    languageFamilies: a.languageFamilies ?? raw.languageFamilies,
  };
}

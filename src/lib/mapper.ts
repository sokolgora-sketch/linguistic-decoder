
import { toMappingRecord } from "@/lib/schemaAdapter";
import type { EnginePayload, LanguageFamily } from "@/shared/engineShape";
import { logError } from "./logError";


// Optional remote mapper (e.g., Cloud Function or Next API). Leave blank to use local.
const REMOTE_URL = process.env.NEXT_PUBLIC_MAPPER_URL; // e.g., https://<region>-<proj>.cloudfunctions.net/mapFamilies

function scoreIn(v: string[], set: Set<string>) { return v.filter(ch => set.has(ch)).length; }
function startsWith(v: string[], x: string) { return v[0] === x; }
function endsWith(v: string[], x: string) { return v[v.length-1] === x; }

function localHeuristic(engine: EnginePayload): LanguageFamily[] {
  const vp = engine.primaryPath?.voicePath ?? [];
  const rings = engine.primaryPath?.ringPath ?? [];
  const sig: string[] = [];

  // Simple signals
  sig.push(`vp=${vp.join("")}`, `rings=${rings.join(",")}`);

  // Buckets
  const vowels = new Set(vp);
  const hasA = vowels.has("A"), hasE = vowels.has("E"), hasI = vowels.has("I"),
        hasO = vowels.has("O"), hasU = vowels.has("U"), hasY = vowels.has("Y"), hasË = vowels.has("Ë");

  const families: LanguageFamily[] = [];

  // Albanian: presence of Ë or YË closures; A/E alternations common; U→I path frequent
  if (hasË || (hasY && endsWith(vp,"Ë"))) {
    families.push({
      familyId: "albanian",
      label: "Albanian",
      confidence: hasË ? 0.85 : 0.6,
      rationale: hasË ? "Ë closure present; characteristic in Albanian phonology." :
                        "Y→Ë tendency consistent with Albanian vowel system.",
      forms: [],
      signals: [...sig, "rule=ë-closure"]
    });
  }

  // Latin: strong A/E core, AE diphthong feel, U→I leveling in derivations
  if ((hasA && hasE) || startsWith(vp,"A")) {
    families.push({
      familyId: "latin",
      label: "Latin",
      confidence: (hasA && hasE) ? 0.75 : 0.55,
      rationale: "A–E path common in Latin roots and derivational patterns.",
      forms: [],
      signals: [...sig, "rule=ae-core"]
    });
  }

  // (Ancient) Greek: presence of I/O dipoles, mid (O) mediation, EI/IO sequences
  if ((hasI && hasO) || (hasE && hasI)) {
    families.push({
      familyId: "ancient_greek",
      label: "Ancient Greek",
      confidence: (hasI && hasO) ? 0.7 : 0.5,
      rationale: "I↔O or E↔I alternations align with Greek vowel shifts and diphthongs.",
      forms: [],
      signals: [...sig, "rule=io/ei"]
    });
  }

  // Sanskrit: high vowels with A backbone; A-centric chains, IA/AI pivots
  if (hasA && (hasI || hasU)) {
    families.push({
      familyId: "sanskrit",
      label: "Sanskrit",
      confidence: 0.6,
      rationale: "A-centric chain with high vowels (I/U) typical in Indo-Aryan roots.",
      forms: [],
      signals: [...sig, "rule=a+high"]
    });
  }

  // PIE (placeholder): balanced spread across A/E/O with occasional U/I
  const hits = scoreIn(vp, new Set(["A","E","O"]));
  if (hits >= 2) {
    families.push({
      familyId: "pie",
      label: "Proto-Indo-European",
      confidence: 0.5,
      rationale: "Core A/E/O distribution aligns with PIE reconstructions.",
      forms: [],
      signals: [...sig, "rule=aeo-core"]
    });
  }

  // Germanic: U/I dominance, UI/IO pairs
  if ((hasU && hasI) || startsWith(vp,"U")) {
    families.push({
      familyId: "germanic",
      label: "Germanic",
      confidence: (hasU && hasI) ? 0.6 : 0.45,
      rationale: "U↔I alternations frequent in Germanic vowel shifts.",
      forms: [],
      signals: [...sig, "rule=ui"]
    });
  }

  // Slavic: strong I/E with Y (hard/soft alternations proxy)
  if ((hasI && hasE) || hasY) {
    families.push({
      familyId: "slavic",
      label: "Slavic",
      confidence: hasY ? 0.55 : 0.4,
      rationale: "I/E prominence (and Y) suggest Slavic-like vowel behavior.",
      forms: [],
      signals: [...sig, "rule=ie/y"]
    });
  }

  if (families.length === 0) {
    families.push({
      familyId: "unknown", label: "Unknown", confidence: 0.2,
      rationale: "No strong vowel-path signals for known families.",
      forms: [], signals: sig
    });
  }

  // Deterministic ordering (by confidence desc, then id)
  families.sort((a,b)=> b.confidence - a.confidence || a.familyId.localeCompare(b.familyId));
  return families.slice(0, 5);
}

export async function mapWordToLanguageFamilies(engine: EnginePayload): Promise<LanguageFamily[]> {
  // If a remote mapper is configured, try it first.
  if (REMOTE_URL) {
    try {
      const body = toMappingRecord(engine);
      const res = await fetch(REMOTE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.languageFamilies)) {
          // sanitize minimal
          return json.languageFamilies.map((x:any)=>({
            familyId: (x.familyId ?? "unknown"),
            label: x.label ?? String(x.familyId ?? "Unknown"),
            confidence: typeof x.confidence === "number" ? x.confidence : 0.5,
            rationale: x.rationale ?? "",
            forms: Array.isArray(x.forms) ? x.forms : [],
            signals: Array.isArray(x.signals) ? x.signals : []
          }));
        }
      }
      // fall through to local if remote fails
      logError({where: "mapper-fallback", message: `Remote mapper returned status ${res.status}`, detail: {word: engine.word}});
      console.warn("Remote mapper failed or returned bad shape; using local heuristic");
    } catch (e: any) {
      logError({where: "mapper-error", message: e.message, detail: {word: engine.word, stack: e.stack}});
      console.warn("Remote mapper error; using local heuristic", e);
    }
  }
  return localHeuristic(engine);
}

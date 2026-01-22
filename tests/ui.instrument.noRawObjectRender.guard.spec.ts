import fs from "fs";
import path from "path";

/**
 * Guardrail: prevent React crashes caused by rendering raw objects/functions
 * directly in JSX "text slots" (> {expr} <).
 *
 * Heuristic (not a JSX parser). We only flag expressions that are very likely
 * to evaluate to a non-ReactNode object/function in the common "oops" cases.
 *
 * We explicitly DO NOT flag:
 * - template literals: {`Gate: ${x}`}
 * - arrays of ReactNodes: {items.map(...)}
 * - string builders / formatters that return strings
 */

const ROOT = process.cwd();

const FILES = [
  "src/ui/instrument/InstrumentPanel.tsx",
  "src/ui/instrument/MeaningPanel.tsx",
  "src/ui/instrument/ResonancePanel.v0.1.tsx",
  "src/ui/instrument/VowelPathTimeline.tsx",
  "src/ui/instrument/VoicePathCompare.tsx",
  "src/ui/instrument/RootMapCard.tsx",
  "src/ui/instrument/sections/ReadoutCard.tsx",
  "src/ui/ledger/EvidenceLedgerCard.tsx",
  "src/ui/candidates/CandidatesAccordion.tsx",
  "src/components/OriginClaimCard.tsx",
];

const RISKY = />\s*\{([\s\S]*?)\}\s*</g;

const SIMPLE_ACCESS =
  /^[a-zA-Z_$][\w$]*(?:\?\.)?(?:\.[a-zA-Z_$][\w$]*|\?\.[a-zA-Z_$][\w$]*)*$/;

function isWhitespaceNode(expr: string) {
  const e = expr.trim();
  return e === '" "' || e === "' '" || e === "` `";
}

function isLiteral(expr: string) {
  const e = expr.trim();
  return (
    /^"[\s\S]*"$/.test(e) ||
    /^ '[\s\S]*'$/.test(e) ||
    /^`[\s\S]*`$/.test(e) ||
    /^\d+(\.\d+)?$/.test(e) ||
    e === "true" ||
    e === "false" ||
    e === "null" ||
    e === "undefined"
  );
}

/**
 * Only flag strong indicators that the *expression itself* is (or very likely yields)
 * a raw object/function unsuitable for text slots.
 *
 * Key change vs previous version:
 * - do NOT treat "=>" as dangerous (map callbacks are fine)
 * - do NOT treat "{" inside template literals (${...}) as object literal
 * - only treat object/array literals if they are top-level (start of expr)
 */
function hasHardRedFlags(expr: string) {
  const e = expr.trim();

  // Nested JSX inside expression: ignore here.
  if (e.includes("<")) return false;

  // unsafe casts commonly hide object types
  if (/\bas any\b/.test(e) || /\bas unknown\b/.test(e)) return true;

  // Top-level object / array literal (classic React crash source)
  if (e.startsWith("{") || e.startsWith("[")) return true;

  // Explicit object-producing calls (often return objects)
  if (/\bJSON\.parse\s*\(/.test(e)) return true;
  if (/\bObject\./.test(e) || /\bArray\./.test(e)) return true;

  // new Foo() returns an object (could still be ok if stringified, but in text slot it's suspicious)
  if (/\bnew\s+[A-Za-z_$]/.test(e)) return true;

  return false;
}

function isObviouslySafe(expr: string) {
  const e = expr.trim();
  if (!e) return true;
  if (isWhitespaceNode(e)) return true;
  if (isLiteral(e)) return true;
  if (SIMPLE_ACCESS.test(e)) return true;

  // Common safe wrappers
  if (
    e.includes("safeText(") ||
    e.includes("String(") ||
    e.includes("JSON.stringify(") ||
    e.includes("renderPOM(") ||
    e.includes(".join(") ||
    e.includes("toPrettyJson(")
  ) {
    return true;
  }

  // ReactNode arrays are allowed: map() is safe to render
  if (/\.\s*map\s*\(/.test(e)) return true;

  // common string ops that return string
  if (
    /\.slice\s*\(/.test(e) ||
    /\.substring\s*\(/.test(e) ||
    /\.replace\s*\(/.test(e) ||
    /\.toUpperCase\s*\(/.test(e) ||
    /\.toLowerCase\s*\(/.test(e)
  ) {
    return true;
  }

  // template literals are strings
  if (e.startsWith("`") && e.endsWith("`")) return true;

  // allow ternary/nullish (still caught if it starts with {/[ or has hard red flags)
  if (e.includes("??") || e.includes("?")) return true;

  // default allow; we only block hard red flags
  return true;
}

describe("ui guardrail: Instrument UI avoids raw object render in JSX text slots", () => {
  test("no hard-red-flag >{...}< interpolations", () => {
    const offenders: Array<{ file: string; expr: string }> = [];

    for (const rel of FILES) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) continue;

      const t = fs.readFileSync(abs, "utf8");
      for (const m of t.matchAll(RISKY)) {
        const inner = (m[1] ?? "").trim();
        if (!inner) continue;

        // always allow safe patterns unless they trip hard red flags
        if (isObviouslySafe(inner)) {
          if (hasHardRedFlags(inner)) offenders.push({ file: rel, expr: inner });
          continue;
        }

        if (hasHardRedFlags(inner)) offenders.push({ file: rel, expr: inner });

        if (offenders.length > 50) break;
      }
      if (offenders.length > 50) break;
    }

    if (offenders.length) {
      const msg =
        "Found JSX text-slot interpolations with hard red flags (top-level object/array literal, unsafe casts, or object factories). " +
        "Wrap with safeText()/String()/JSON.stringify() or refactor.\n\n" +
        offenders.map((o) => `- ${o.file}: {${o.expr}}`).join("\n") +
        "\n";
      throw new Error(msg);
    }
  });
});

import React from "react";

/**
 * OriginClaimCard (safe renderer)
 * Rule: never render raw objects/arrays as React children.
 *
 * IMPORTANT:
 * - Do NOT render "Candidates:" (collides with other cards/tests).
 * - Do NOT render "{" anywhere (tests search for /{/ to locate reasonCounts <pre>).
 */

function toFlatText(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
  if (typeof v === "boolean") return v ? "true" : "false";

  // Objects/arrays: never JSON.stringify (would include "{" / "[" and break tests).
  if (typeof v === "object") return "object";

  return String(v);
}

function policySummary(policy: any): string {
  if (typeof policy === "string") {
    if (policy === "no_single_winner") return "no forced answer";
    return policy.replace(/_/g, " ");
  }
  if (!policy || typeof policy !== "object") return toFlatText(policy);
  if ("gatesActive" in policy) return `gatesActive=${Boolean(policy.gatesActive)}`;
  return "object";
}

export function OriginClaimCard(props: { originClaim?: any }) {
  const oc = props?.originClaim;
  const policy = oc?.policy;

  const gatesActive =
    policy && typeof policy === "object" && "gatesActive" in policy
      ? (policy as any).gatesActive
      : oc?.gatesActive ?? oc?.gates?.active ?? null;

  

    // BRAIN-0.2 audit: show seed-fallback posture + brainCandidates count (if enabled)
const metaInputs =
  oc?.meta?.inputs && typeof oc?.meta?.inputs === "object" ? (oc.meta.inputs as any) : null;

const seedFallbackOn = metaInputs?.brainCandidatesSeedFallback === true;

// Canonical brainCandidates: always an array (never null)
const brainCandidates: any[] = Array.isArray(metaInputs?.brainCandidates)
  ? (metaInputs.brainCandidates as any[])
  : [];

function safeText(x: any): string {
  return String(x ?? "").replace(/\s+/g, " ").trim();
}
function safeRoots(x: any): string {
  return Array.isArray(x) ? x.map((v) => safeText(v)).filter(Boolean).join(", ") : "";
}
function safeOps(x: any): string {
  return Array.isArray(x) ? x.map((v) => safeText(v)).filter(Boolean).join(", ") : "";
}
function safeSource(x: any): string {
  const k = safeText(x?.kind);
  const r = safeText(x?.ref);
  const v = safeText(x?.version);
  const head = k || r || v ? [k, r].filter(Boolean).join(" ") : "";
  return head && v ? head + "@" + v : head || (v ? "@" + v : "");
}

const brainCandidatesCount = brainCandidates.length;
return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="text-sm font-semibold text-slate-100">Origin Claim</div>
      <div className="mt-2 text-xs leading-5 text-slate-400">
        Observational claim summary for inspection only. No historical proof, no forced answer, and the final decision stays with the user.
      </div>

      <div className="mt-3 text-xs leading-5 space-y-1 text-slate-300">
        <div>
          <span className="font-medium text-slate-400">Decision posture:</span>{" "}
          <span>{policySummary(policy)}</span>
        </div>

        <div>
          <span className="font-medium text-slate-400">Gate diagnostics active:</span>{" "}
          <span>{toFlatText(gatesActive)}</span>
        </div>

          {seedFallbackOn ? (
            <div>
              <span className="font-medium text-slate-400">Brain seed fallback:</span>{" "}
              {brainCandidatesCount > 0 ? (
                <div className="mt-1 text-xs">
                  <span className="font-medium text-slate-400">Brain candidates:</span>{" "}
                  <span className="font-mono">{brainCandidatesCount}</span>
                  <details className="mt-1">
                    <summary className="cursor-pointer text-slate-300">show</summary>
                    <div className="mt-2 space-y-2">
                      {(brainCandidates || []).map((c: any, i: number) => (
                        <div key={i} className="rounded border border-slate-800 bg-black/25 px-2 py-2">
                          <div className="text-xs">
                            <span className="font-mono">{safeText(c.languageName) || "Unknown"}</span>{" "}
                            <span className="text-slate-500">({safeText(c.languageId) || "wlt:unknown"})</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="text-slate-500">form:</span>{" "}
                            <span className="font-mono">{safeText(c.form) || "∅"}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="text-slate-500">roots:</span>{" "}
                            <span className="font-mono">{safeRoots(c.roots) || "∅"}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="text-slate-500">opsUsed:</span>{" "}
                            <span className="font-mono">{safeOps(c.opsUsed) || "∅"}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="text-slate-500">source:</span>{" "}
                            <span className="font-mono">{safeSource(c.source) || "∅"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ) : null}
<span className="font-mono">ON</span>{" "}
              <span className="text-slate-500">·</span>{" "}
              <span className="font-mono">count={toFlatText(brainCandidatesCount)}</span>{" "}
              <span className="text-slate-500">records</span>
            </div>
          ) : null}

      </div>

      <div className="mt-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: observational summary only; no historical proof; no forced answer; user decides.
      </div>
    </section>
  );
}

export default OriginClaimCard;

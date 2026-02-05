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

      const brainCandidates0 =
        metaInputs && Array.isArray((metaInputs as any).brainCandidates)
          ? ((metaInputs as any).brainCandidates as any[])
          : null;

      function flatJoin0(arr: any): string {
        return Array.isArray(arr) ? arr.map((x) => toFlatText(x)).filter(Boolean).join(", ") : "—";
      }

      function sourceLine0(src: any): string {
        const kind = toFlatText(src?.kind);
        const ref = toFlatText(src?.ref);
        const ver = toFlatText(src?.version);
        const head = [kind, ref].filter((x) => x && x !== "—" && x !== "object").join(" ");
        if (!head && (!ver || ver === "—" || ver === "object")) return "—";
        if (head && ver && ver !== "—" && ver !== "object") return head + "@" + ver;
        return head || (ver && ver !== "—" && ver !== "object" ? "@" + ver : "—");
      }


    const brainCandidates = Array.isArray((metaInputs as any)?.brainCandidates)
      ? ((metaInputs as any).brainCandidates as any[])
      : null;
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
      return head && v ? head + "@" + v : (head || (v ? "@" + v : ""));
    }
    const brainCandidatesCount0 = Array.isArray(brainCandidates0) ? brainCandidates0.length : 0;
return (
    <section>
      <div className="text-sm font-semibold">Origin Claim</div>

      <div className="mt-2 text-xs leading-5 space-y-1">
        <div>
          <span className="font-medium">Policy:</span>{" "}
          <span>{policySummary(policy)}</span>
        </div>

        <div>
          <span className="font-medium">Gates active:</span>{" "}
          <span>{toFlatText(gatesActive)}</span>
        </div>

          {seedFallbackOn ? (
            <div>
              <span className="font-medium">Brain seed fallback:</span>{" "}
              {brainCandidatesCount0 > 0 ? (
                <div className="mt-1 text-xs">
                  <span className="font-medium">Brain candidates:</span>{" "}
                  <span className="font-mono">{brainCandidatesCount0}</span>
                  <details className="mt-1">
                    <summary className="cursor-pointer opacity-80">show</summary>
                    <div className="mt-2 space-y-2">
                      {(brainCandidates || []).map((c: any, i: number) => (
                        <div key={i} className="rounded border border-black/10 px-2 py-2">
                          <div className="text-xs">
                            <span className="font-mono">{safeText(c.languageName) || "Unknown"}</span>{" "}
                            <span className="opacity-60">({safeText(c.languageId) || "wlt:unknown"})</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="opacity-70">form:</span>{" "}
                            <span className="font-mono">{safeText(c.form) || "∅"}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="opacity-70">roots:</span>{" "}
                            <span className="font-mono">{safeRoots(c.roots) || "∅"}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="opacity-70">opsUsed:</span>{" "}
                            <span className="font-mono">{safeOps(c.opsUsed) || "∅"}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <span className="opacity-70">source:</span>{" "}
                            <span className="font-mono">{safeSource(c.source) || "∅"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ) : null}
<span className="font-mono">ON</span>{" "}
              <span className="opacity-70">·</span>{" "}
              <span className="font-mono">count={toFlatText(brainCandidatesCount0)}</span>{" "}
              <span className="opacity-70">records</span>
            </div>
          ) : null}

      </div>
    </section>
  );
}

export default OriginClaimCard;
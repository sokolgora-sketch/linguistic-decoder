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

    const brainCandidatesCount = Array.isArray(metaInputs?.brainCandidates)
      ? metaInputs.brainCandidates.length
      : 0;
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
              <span className="font-mono">ON</span>{" "}
              <span className="opacity-70">·</span>{" "}
              <span className="font-mono">{toFlatText(brainCandidatesCount)}</span>{" "}
              <span className="opacity-70">records</span>
            </div>
          ) : null}

      </div>
    </section>
  );
}

export default OriginClaimCard;
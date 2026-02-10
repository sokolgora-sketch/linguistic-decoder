# EvidencePackage signalsCount invariant (v0.1)

For /api/analyze-v1 responses, EvidencePackage must always expose a stable signal count for consumers. Specifically: `evidencePackage.summary.signalsCount` is always a finite number whenever the response has `evidence.signals` (array). When `evidencePackage.counts.signals` is missing or malformed, the API backfills from `final.evidence.signals.length` (authoritative in the analyze-v1 response). This prevents UI/exports from silently showing 0/undefined due to Telemetry VM omissions.

Additionally, `evidencePackage.counts.signals` is standardized at attach-time to the PresentOrMissing wrapper shape: `{ kind: "present", value: number }`. Source of truth is implemented in `app/api/analyze-v1/evidencePackage.signalsCount.backfill.v0.1.ts` and invoked in both POST and GET handlers in `app/api/analyze-v1/route.ts`.

# UI Telemetry Contract v0.1 — merged

What changed
- Chat UI renders InstrumentPanel strictly from TelemetryViewModel (VM-only rule).
- Removed render-time fallback paths that attempted to build VM from raw result objects.
- Fixed Analyze keyboard test failure caused by missing VM evidence lists during render.

Why it matters
- UI is now a scientific instrument: it reads a defined VM contract, not ad-hoc payloads.
- Prevents “undefined evidence” crashes and cascade states (Analyze stuck disabled).

Verification
- npm run gate:quick
- next build (production) passes

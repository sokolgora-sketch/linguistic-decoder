export function backfillEvidencePackageSignalsCountV01(args: {
  evidencePackage: any;
  finalEvidenceSignalsLen?: number | null;
}): void {
  const ep = args?.evidencePackage;
  if (!ep || typeof ep !== "object") return;

  const unwrap = (x: any) =>
    x && typeof x === "object" && (x.kind === "present" || x.kind === "missing")
      ? x.kind === "present"
        ? x.value
        : undefined
      : x;

  // Prefer counts.signals if present (wrapped or raw)
  const countsSignalsRaw = unwrap((ep as any)?.counts?.signals);

  let n: number | undefined;

  if (typeof countsSignalsRaw === "number" && Number.isFinite(countsSignalsRaw)) {
    n = countsSignalsRaw;
  } else if (typeof countsSignalsRaw === "string") {
    const parsed = Number(countsSignalsRaw);
    if (Number.isFinite(parsed)) n = parsed;
  } else if (
    typeof args.finalEvidenceSignalsLen === "number" &&
    Number.isFinite(args.finalEvidenceSignalsLen)
  ) {
    n = args.finalEvidenceSignalsLen;
  }

  if (!Number.isFinite(n as any)) return;

  // Standardize counts.signals to POM-present wrapper
  if (!(ep as any).counts || typeof (ep as any).counts !== "object") (ep as any).counts = {};
  (ep as any).counts.signals = { kind: "present", value: n };

  if (!(ep as any).summary || typeof (ep as any).summary !== "object") (ep as any).summary = {};
  (ep as any).summary.signalsCount = n;
}

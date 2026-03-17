export type SpearmanDiagnosisKind = "stable" | "weak" | "inversion";

export type SpearmanDiagnosisMeta = {
  kind: SpearmanDiagnosisKind;
  label: string;
  color: string;
  hint: string;
};

export function getSpearmanDiagnosisKind(
  rho: number | null | undefined,
): SpearmanDiagnosisKind | null {
  if (typeof rho !== "number" || !Number.isFinite(rho)) return null;
  if (rho > 0) return "inversion";
  if (rho <= -0.7) return "stable";
  return "weak";
}

export function getSpearmanDiagnosisMeta(
  rho: number | null | undefined,
): SpearmanDiagnosisMeta | null {
  const kind = getSpearmanDiagnosisKind(rho);
  if (!kind) return null;

  if (kind === "inversion") {
    return {
      kind,
      label: "Order inverted",
      color: "#f87171",
      hint: "Spearman ρ is above zero, so the output reverses the expected negative aperture order.",
    };
  }

  if (kind === "weak") {
    return {
      kind,
      label: "Weak alignment",
      color: "#f59e0b",
      hint: "Spearman ρ is not yet negative enough for strong monotonic alignment.",
    };
  }

  return {
    kind,
    label: "Aligned",
    color: "#22c55e",
    hint: "Spearman ρ is strongly negative, so the bucket order is aligned with the expected aperture slope.",
  };
}

import {
  getSpearmanDiagnosisKind,
  getSpearmanDiagnosisMeta,
} from "@/shared/evals/getSpearmanDiagnosis.v0.1";

describe("Evals diagnosis thresholds guard v0.1", () => {
  it("treats strong negative rho as stable", () => {
    expect(getSpearmanDiagnosisKind(-0.964)).toBe("stable");
    expect(getSpearmanDiagnosisKind(-0.7)).toBe("stable");
  });

  it("treats weak or flat negative-to-zero rho as weak", () => {
    expect(getSpearmanDiagnosisKind(-0.699)).toBe("weak");
    expect(getSpearmanDiagnosisKind(-0.2)).toBe("weak");
    expect(getSpearmanDiagnosisKind(0)).toBe("weak");
  });

  it("treats positive rho as inversion", () => {
    expect(getSpearmanDiagnosisKind(0.001)).toBe("inversion");
    expect(getSpearmanDiagnosisKind(0.485)).toBe("inversion");
  });

  it("returns null for non-finite input", () => {
    expect(getSpearmanDiagnosisKind(null)).toBeNull();
    expect(getSpearmanDiagnosisKind(undefined)).toBeNull();
    expect(getSpearmanDiagnosisKind(Number.NaN)).toBeNull();
  });

  it("exposes stable metadata copy and color", () => {
    expect(getSpearmanDiagnosisMeta(-0.964)).toEqual({
      kind: "stable",
      label: "Aligned",
      color: "#22c55e",
      hint: "Spearman ρ is strongly negative, so the bucket order is aligned with the expected aperture slope.",
    });
  });
});

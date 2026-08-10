export type EvidencePackageVowelV0_1 =
  | "A"
  | "E"
  | "I"
  | "O"
  | "U"
  | "Y"
  | "Ë";

const ALLOWED =
  new Set<EvidencePackageVowelV0_1>([
    "A",
    "E",
    "I",
    "O",
    "U",
    "Y",
    "Ë",
  ]);

export function normalizeEvidencePackagePathV0_1(
  value: unknown,
): EvidencePackageVowelV0_1[] | null {
  const validate = (
    parts: string[],
  ): EvidencePackageVowelV0_1[] | null => {
    const normalized =
      parts
        .map((item) =>
          item
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean);

    if (
      normalized.length === 0 ||
      !normalized.every((item) =>
        ALLOWED.has(
          item as EvidencePackageVowelV0_1,
        ),
      )
    ) {
      return null;
    }

    return normalized as EvidencePackageVowelV0_1[];
  };

  if (Array.isArray(value)) {
    return validate(
      value.map((item) =>
        String(item),
      ),
    );
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value
      .replace(/[→–—]/g, "-")
      .replace(/\s+/g, "")
      .toUpperCase();

  return validate(
    normalized.includes("-")
      ? normalized.split("-")
      : normalized.split(""),
  );
}

export function selectEvidencePackageFunctionalPathV0_1(
  params: {
    deepRootPath: unknown;
    emittedFunctionalPath: unknown;
    detectedPath: unknown;
  },
): EvidencePackageVowelV0_1[] | null {
  return (
    normalizeEvidencePackagePathV0_1(
      params.deepRootPath,
    ) ??
    normalizeEvidencePackagePathV0_1(
      params.emittedFunctionalPath,
    ) ??
    normalizeEvidencePackagePathV0_1(
      params.detectedPath,
    )
  );
}

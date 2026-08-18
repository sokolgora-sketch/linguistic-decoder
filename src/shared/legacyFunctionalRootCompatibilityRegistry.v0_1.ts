import type { AllowedOpId } from "./ops/allowedOps.v0.1";

export const LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1 =
  "legacy-functional-root-compatibility-registry.v0_1" as const;

export type FunctionalRootHypothesisV1 = {
  id: string;
  language: string;
  surfaceForms: string[];
  roots: string[];
  gloss: string;
  plainFunctionalExplanation?: string;
  opsUsed: AllowedOpId[];
  vowelPath?: string;
  notes?: string[];
};

export type LegacyFunctionalRootCompatibilityEntryV0_1 = {
  registryVersion:
    typeof LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1;
  normalizedInput: string;
  output: FunctionalRootHypothesisV1;
  compatibilityBoundary: {
    status: "legacy_compatibility_only";
    reviewedSourceAuthorization: false;
    canonicalOperatorProfileBacked: false;
    runtimeExpansionAuthorized: false;
    historicalOriginClaim: "not_claimed";
    historicalTransmissionClaim: "not_claimed";
    winnerClaim: "not_claimed";
    candidateTruthClaim: "not_claimed";
    userDecisionPosture: "user_decides";
  };
  migrationStatus:
    "requires_dedicated_review_before_retirement";
  migrationReason: string;
};

const compatibilityBoundaryV0_1 = {
  status: "legacy_compatibility_only",
  reviewedSourceAuthorization: false,
  canonicalOperatorProfileBacked: false,
  runtimeExpansionAuthorized: false,
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  userDecisionPosture: "user_decides",
} as const;

export const legacyFunctionalRootCompatibilityRegistryV0_1: readonly LegacyFunctionalRootCompatibilityEntryV0_1[] =
  [
    {
      registryVersion:
        LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1,
      normalizedInput: "study",
      output: {
        id: "sq.shtu+di.v1",
        language: "sq",
        surfaceForms: ["study", "studim"],
        roots: ["shtu", "di"],
        gloss:
          "Functional reading: shtu (not yours / added-on) + di (know) → making knowledge yours through learning.",
        plainFunctionalExplanation:
          "Adding or increasing knowledge; making knowledge yours through learning.",
        opsUsed: ["s_to_sh", "y_to_i"],
        vowelPath: "U→I",
        notes: [
          "english carrier → sq functional reading",
          "note: studim treated as nominal closure of the same carrier family",
          "Deterministic pilot hypothesis (v1).",
          "No historical-chain claim; functional decomposition only.",
        ],
      },
      compatibilityBoundary: compatibilityBoundaryV0_1,
      migrationStatus:
        "requires_dedicated_review_before_retirement",
      migrationReason:
        "The legacy composite includes SHTU, which is not represented by a canonical operator profile.",
    },
    {
      registryVersion:
        LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1,
      normalizedInput: "damage",
      output: {
        id: "sq.dem.v1",
        language: "sq",
        surfaceForms: ["damage", "dëm"],
        roots: ["dëm"],
        gloss:
          "Functional reading: dëm (harm / loss / injury) as a minimal carrier for the damage concept.",
        opsUsed: [],
        vowelPath: "A→Ë",
        notes: [
          "english surface → sq carrier (short form)",
          "note: this is a minimal-root hypothesis, not a historical-chain claim",
          "Deterministic pilot hypothesis (v1.1).",
          "No winner; functional carrier only.",
        ],
      },
      compatibilityBoundary: compatibilityBoundaryV0_1,
      migrationStatus:
        "requires_dedicated_review_before_retirement",
      migrationReason:
        "The legacy dëm output is not identical to the canon-locked DA operator projection.",
    },
    {
      registryVersion:
        LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1,
      normalizedInput: "father",
      output: {
        id: "proto.at.pat.v1",
        language: "proto",
        surfaceForms: ["father", "pater", "atë"],
        roots: ["AT", "PAT"],
        gloss:
          "Functional root AT / PAT: origin, projection, source of lineage and authority.",
        opsUsed: [],
        vowelPath: "A→Ë",
        notes: [
          "surface → proto carrier",
          "no winner; family-level functional root",
          "Proto functional family (non-historical claim).",
          "Carrier across IE and Albanian.",
        ],
      },
      compatibilityBoundary: compatibilityBoundaryV0_1,
      migrationStatus:
        "requires_dedicated_review_before_retirement",
      migrationReason:
        "The legacy AT/PAT family is not represented by a canonical operator profile.",
    },
  ];

function normalizeInputV0_1(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

function cloneFunctionalRootV0_1(
  value: FunctionalRootHypothesisV1,
): FunctionalRootHypothesisV1 {
  const cloned: FunctionalRootHypothesisV1 = {
    ...value,
    surfaceForms: [...value.surfaceForms],
    roots: [...value.roots],
    opsUsed: [...value.opsUsed],
  };

  if (value.notes) {
    cloned.notes = [...value.notes];
  }

  return cloned;
}

export function resolveLegacyFunctionalRootCompatibilityV0_1(
  normalizedInput: string,
): FunctionalRootHypothesisV1 | null {
  const normalized = normalizeInputV0_1(normalizedInput);

  if (!normalized) return null;

  const entry =
    legacyFunctionalRootCompatibilityRegistryV0_1.find(
      (candidate) =>
        candidate.normalizedInput === normalized,
    );

  return entry
    ? cloneFunctionalRootV0_1(entry.output)
    : null;
}

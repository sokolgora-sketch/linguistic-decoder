// src/shared/deepRoot.rootMap.builder.v1.ts
//
// DeepRoot RootMap v0.1 — Functional Key Decoder
// Deterministic builder: prefers Heart alignment, then reviewed operation admission, then stable order.
//
// Inputs are *already* curated by:
// - segmenter.v1
// - carrierMatcher.v1
// - protoRoots.v1 (curated truth table)
//
// No language-origin scoring and no winner claim. Selection remains deterministic and evidence-bounded.

import type { MinRootHypothesis } from "./deepRoot.minRoots.v1";
import type {
  RootMapV1,
  RootTokenRoleV1,
  RootTokenV1,
  RootKeyV1,
  RootCarrierV1,
  RootKeyStatusV1,
  RootSpanV1,
} from "./deepRoot.rootMap.v1";
import { getProtoRootV1 } from "./protoRoots.v1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import { getReviewedExternalLexiconProductionSourceRowsV0_1 } from "./reviewedExternalLexiconSourceRowRegistry.v0_1";
import { projectReviewedExternalLexiconProductionRowForRuntimeV0_1 } from "./reviewedExternalLexiconRuntimeProjection.v0_1";
import { evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1 } from "./reviewedExternalLexiconEvidenceOperationPolicy.v0_1";
import { discoverCanonicalOperatorCandidatesV0_1 } from "./canonicalOperatorDiscovery.v0_1";

function roleHintToTokenRole(roleHint?: string): RootTokenRoleV1 {
  switch (roleHint) {
    case "Action":
      return "action";
    case "Function":
    case "Instrument":
      return "instrument";
    case "Unit":
    case "Result":
      return "unit";
    case "Modifier":
      return "modifier";
    default:
      return "unknown";
  }
}


function lastVowelFromAnyPath(v: unknown): string | null {
  // Accept: ["U","I"], "U-I", "U→I", "UI"
  if (Array.isArray(v)) {
    const last = v[v.length - 1];
    const s = String(last ?? "").toUpperCase();
    return s && /^[AEIOUYË]$/.test(s) ? s : null;
  }
  const s = String(v ?? "").toUpperCase();
  const m = extractSevenVowelsFromString(String(s ?? ""));
  if (!m || m.length === 0) return null;
  return m[m.length - 1] ?? null;
}

function hypothesisTerminalVowel(h: any): string | null {
  // Prefer decomposition.function if present; else use last protoRoot vowel.
  const func = h?.decomposition?.function;
  const fromFunc = func ? lastVowelFromAnyPath(func) : null;
  if (fromFunc) return fromFunc;

  const roots = Array.isArray(h?.protoRoots) ? h.protoRoots : [];
  if (!roots.length) return null;
  return lastVowelFromAnyPath(roots[roots.length - 1]);
}

function extractVowelPath(s: string): string | undefined {
  // Keep it simple + deterministic: uppercase, scan for the canonical vowels.
  const up = String(s ?? "").toUpperCase();
  const m = extractSevenVowelsFromString(String(up ?? ""));
  if (!m || m.length === 0) return undefined;
  return m.join("-");
}

function keyStatusForCarrier(
  carrier: { lang?: string; ops?: string[] } | null,
  carrierGloss?: string,
  carrierNotes?: string,
  reviewedEvidenceAvailable = false,
  reviewedEvidenceAuthorized = false,
): RootKeyStatusV1 {
  if (!carrier) return "speculative";

  // A reviewed production row whose carrier/operation policy is
  // explicitly authorized is runtime-supported evidence.
  //
  // This check must precede generic dialect-note classification:
  // exact reviewed Gheg DA is authorized, while transformed DA
  // remains unauthorized because its operation policy fails.
  if (reviewedEvidenceAuthorized) {
    return "supported";
  }

  const text =
    `${carrierGloss ?? ""} ${carrierNotes ?? ""}`
      .toLocaleLowerCase("en-US");

  if (
    text.includes("gheg") ||
    text.includes("dialect attestation")
  ) {
    return "dialect_attested_pending_review";
  }

  if (text.includes("weak")) {
    return "carrier_only";
  }

  if (
    reviewedEvidenceAvailable &&
    !reviewedEvidenceAuthorized
  ) {
    return "candidate_only";
  }

  return "supported";
}

function buildSpansOrNull(params: {
  basis: string;
  protoRoots: string[];
  carriers: any[]; // upstream may include segment, but TS type may not
}): RootSpanV1[] | null {
  const basis = String(params.basis ?? "");
  const basisLower = basis.toLowerCase();
  if (!basisLower) return null;

  // Need a segment for every protoRoot (all-or-nothing).
  const segmentsByRoot = new Map<string, string>();
  for (const r of params.protoRoots) {
    const hit = Array.isArray(params.carriers)
      ? params.carriers.find((c) => c && c.protoRootId === r)
      : null;

    const seg = String(hit?.segment ?? "").trim();
    if (!seg) return null;
    segmentsByRoot.set(r, seg);
  }

  const spans: RootSpanV1[] = [];
  let cursor = 0;

  for (const r of params.protoRoots) {
    const seg = segmentsByRoot.get(r);
    if (!seg) return null;

    const segLower = seg.toLowerCase();

    // Deterministic cursor walk: search from cursor only.
    const idx = basisLower.indexOf(segLower, cursor);

      // v0.1 spans policy (deterministic):
      // - normal case: segment must be found left-to-right within basis
      // - special-case: if the *final* segment is not found, allow an "implied trailing"
      //   span at the current cursor. This supports decompositions where a final unit
      //   marker is conceptually present but not literally present in the surface basis.
      if (idx < 0) {
        const isLast = r === params.protoRoots[params.protoRoots.length - 1];
        const isSingleChar = segLower.length === 1;
        if (!isLast || !isSingleChar) return null;

        const start = cursor;
        const end = cursor + 1;

        {
      const span: any = { token: r, start, end, source: "surface" };
        // implied trailing span: do not emit note
        spans.push(span);
}

        cursor = end;
        continue;
      }
    const start = idx;
    const end = idx + seg.length;

    // note policy: emit when segment differs from token (case-sensitive)
    const note = seg !== String(r) ? `segment=${segLower}` : undefined;

    // Enforce left-to-right monotonicity.
    if (start < cursor) return null;

    // Optional note: only when segment meaningfully differs from token (case-insensitive).

    {
      const span: any = { token: r, start, end, source: "surface" };
      if (note) span.note = note;
      spans.push(span);
    }

    cursor = end;
  }

  return spans.length > 0 ? spans : null;
}


type ReviewedFunctionalRuntimeEvidenceV0_1 = {
  sourceId: string;
  embryo: string;
  language: string;
  evidenceText: string;
};

type ReviewedRootMapKeyProvenanceV0_1 = {
  sourceId: string;
  embryo: string;
  language: string;
  evidenceText: string;
  carrierForm: string;
  segment: string;
  ops: string[];
};

const reviewedRootMapKeyProvenanceV0_1 =
  new WeakMap<
    RootKeyV1,
    ReviewedRootMapKeyProvenanceV0_1
  >();

type TrustedRootMapProvenanceV0_1 = {
  basis: string;
  normalizedBasis: string;
};

const trustedRootMapProvenanceV0_1 =
  new WeakMap<
    RootMapV1,
    TrustedRootMapProvenanceV0_1
  >();

function normalizeTrustedRootMapBasisV0_1(
  value: unknown,
): string {
  return String(value ?? "")
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("en-US");
}

function deepFreezeRootMapValueV0_1<T>(
  value: T,
): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  for (
    const nestedValue of
    Object.values(record)
  ) {
    deepFreezeRootMapValueV0_1(
      nestedValue,
    );
  }

  Object.freeze(value);

  return value;
}

function registerTrustedRootMapV0_1(
  rootMap: RootMapV1,
  basis: string,
): RootMapV1 {
  const canonicalBasis =
    String(basis ?? "")
      .normalize("NFC")
      .trim();

  const normalizedBasis =
    normalizeTrustedRootMapBasisV0_1(
      canonicalBasis,
    );

  if (!normalizedBasis) {
    return deepFreezeRootMapValueV0_1(
      rootMap,
    );
  }

  deepFreezeRootMapValueV0_1(
    rootMap,
  );

  trustedRootMapProvenanceV0_1.set(
    rootMap,
    {
      basis: canonicalBasis,
      normalizedBasis,
    },
  );

  return rootMap;
}

function resolveTrustedRootMapBasisV0_1(
  rootMap:
    | RootMapV1
    | null
    | undefined,
  targetWord: unknown,
): string | null {
  if (
    !rootMap ||
    typeof rootMap !== "object"
  ) {
    return null;
  }

  const provenance =
    trustedRootMapProvenanceV0_1.get(
      rootMap,
    );

  if (!provenance) {
    return null;
  }

  const requestedTarget =
    normalizeTrustedRootMapBasisV0_1(
      targetWord,
    );

  if (
    !requestedTarget ||
    requestedTarget !==
      provenance.normalizedBasis
  ) {
    return null;
  }

  if (!Object.isFrozen(rootMap)) {
    return null;
  }

  return provenance.basis;
}

function buildReviewedFunctionalRuntimeEvidenceByEmbryoV0_1(): ReadonlyMap<
  string,
  ReviewedFunctionalRuntimeEvidenceV0_1
> {
  const entries: Array<
    readonly [string, ReviewedFunctionalRuntimeEvidenceV0_1]
  > = [];

  for (
    const row of
    getReviewedExternalLexiconProductionSourceRowsV0_1()
  ) {
    const projection =
      projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
        row,
      );

    if (!projection) continue;

    entries.push([
      projection.embryo,
      {
        sourceId: projection.sourceId,
        embryo: projection.embryo,
        language: row.candidateLanguage,
        evidenceText:
          `reviewed functional free-operator evidence: ${projection.evidenceText}; historicalOriginClaim=${projection.claimBoundary.historicalOriginClaim}; winnerClaim=${projection.claimBoundary.winnerClaim}; languageSuperiorityClaim=${projection.claimBoundary.languageSuperiorityClaim}; userDecisionPosture=${projection.claimBoundary.userDecisionPosture}`,
      },
    ]);
  }

  return new Map(entries);
}

function buildTargetAuthorizedReviewedFunctionalRuntimeEvidenceByEmbryoV0_1(
  targetWord: string,
): ReadonlyMap<
  string,
  ReviewedFunctionalRuntimeEvidenceV0_1
> {
  const eligibleOperators =
    new Set(
      discoverCanonicalOperatorCandidatesV0_1(
        targetWord,
      )
        .filter(
          (candidate) =>
            candidate.reviewedEvidenceEligible ===
            true,
        )
        .map(
          (candidate) =>
            candidate.operatorId
              .trim()
              .toUpperCase(),
        ),
    );

  const trustedEvidence =
    buildReviewedFunctionalRuntimeEvidenceByEmbryoV0_1();

  return new Map(
    [...trustedEvidence.entries()].filter(
      ([embryo]) =>
        eligibleOperators.has(
          embryo.trim().toUpperCase(),
        ),
    ),
  );
}


function hypothesisHasAllowedReviewedTerminalEvidenceV0_1(
  hypothesis: MinRootHypothesis,
  reviewedEvidenceByEmbryo: ReadonlyMap<
    string,
    ReviewedFunctionalRuntimeEvidenceV0_1
  >,
): boolean {
  const protoRoots = Array.isArray(
    (hypothesis as any)?.protoRoots,
  )
    ? (hypothesis as any).protoRoots
    : [];

  const terminalProtoRoot = String(
    protoRoots[protoRoots.length - 1] ?? "",
  ).trim();

  if (!terminalProtoRoot) return false;

  const reviewedFunctionalEvidence =
    reviewedEvidenceByEmbryo.get(terminalProtoRoot);

  if (!reviewedFunctionalEvidence) return false;

  const carriers = Array.isArray(
    (hypothesis as any)?.carriers,
  )
    ? (hypothesis as any).carriers
    : [];

  const terminalCarrier = carriers.find(
    (carrier: any) =>
      String(carrier?.protoRootId ?? "") === terminalProtoRoot,
  );

  if (!terminalCarrier) return false;

  const terminalCarrierLanguage =
    String(
      terminalCarrier?.lang ?? "",
    )
      .trim()
      .toLocaleLowerCase("en-US");

  const reviewedEvidenceLanguage =
    String(
      reviewedFunctionalEvidence.language ??
        "",
    )
      .trim()
      .toLocaleLowerCase("en-US");

  if (
    !terminalCarrierLanguage ||
    !reviewedEvidenceLanguage ||
    terminalCarrierLanguage !==
      reviewedEvidenceLanguage
  ) {
    return false;
  }

  return evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1({
    sourceId: reviewedFunctionalEvidence.sourceId,
    embryo: reviewedFunctionalEvidence.embryo,
    ops: terminalCarrier?.ops,
    segment: terminalCarrier?.segment,
    carrierForm: terminalCarrier?.carrierForm,
  }).allowed;
}

function rootMapKeyHasReviewedFunctionalEvidenceV0_1(
  key: RootKeyV1,
  authorizedEvidenceByEmbryo: ReadonlyMap<
    string,
    ReviewedFunctionalRuntimeEvidenceV0_1
  >,
): boolean {
  if (key.status !== "supported") {
    return false;
  }

  const provenance =
    reviewedRootMapKeyProvenanceV0_1.get(
      key,
    );

  if (!provenance) {
    return false;
  }

  const token =
    String(key.token ?? "")
      .trim()
      .toUpperCase();

  if (
    !token ||
    token !==
      provenance.embryo
        .trim()
        .toUpperCase()
  ) {
    return false;
  }

  const trusted =
    authorizedEvidenceByEmbryo.get(
      token,
    );

  if (!trusted) {
    return false;
  }

  if (
    trusted.sourceId !==
      provenance.sourceId ||
    trusted.embryo !==
      provenance.embryo ||
    trusted.evidenceText !==
      provenance.evidenceText
  ) {
    return false;
  }

  const keyLanguage =
    String(key.language ?? "")
      .trim()
      .toLowerCase();

  const trustedLanguage =
    String(trusted.language ?? "")
      .trim()
      .toLowerCase();

  const provenanceLanguage =
    String(provenance.language ?? "")
      .trim()
      .toLowerCase();

  if (
    !keyLanguage ||
    !trustedLanguage ||
    !provenanceLanguage ||
    keyLanguage !== trustedLanguage ||
    keyLanguage !== provenanceLanguage
  ) {
    return false;
  }

  const currentOps =
    Array.isArray(key.ops)
      ? key.ops.map((op) =>
          String(op),
        )
      : [];

  if (
    currentOps.length !==
      provenance.ops.length ||
    currentOps.some(
      (op, index) =>
        op !== provenance.ops[index],
    )
  ) {
    return false;
  }

  const policy =
    evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
      {
        sourceId:
          provenance.sourceId,
        embryo:
          provenance.embryo,
        ops:
          provenance.ops,
        segment:
          provenance.segment,
        carrierForm:
          provenance.carrierForm,
      },
    );

  if (!policy.allowed) {
    return false;
  }

  const evidence =
    Array.isArray(key.evidence)
      ? key.evidence
      : [];

  return evidence.some(
    (line) =>
      typeof line === "string" &&
      line.trim() ===
        provenance.evidenceText &&
      line.trim() ===
        trusted.evidenceText,
  );
}


export type ReviewedFunctionalCandidateProjectionV0_1 =
  Record<string, unknown>;

export function buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
  params: {
    rootMap: RootMapV1 | null | undefined;
    targetWord: string;
  },
): ReviewedFunctionalCandidateProjectionV0_1[] {
  const requestedTargetWord =
    String(
      params.targetWord ?? "",
    ).trim();

  if (!requestedTargetWord) {
    return [];
  }

  const targetWord =
    resolveTrustedRootMapBasisV0_1(
      params.rootMap,
      requestedTargetWord,
    );

  if (!targetWord) {
    return [];
  }

  const keys = Array.isArray(params.rootMap?.keys)
    ? params.rootMap.keys
    : [];

  const authorizedEvidenceByEmbryo =
    buildTargetAuthorizedReviewedFunctionalRuntimeEvidenceByEmbryoV0_1(
      targetWord,
    );

  const reviewedEmbryos = new Set(
    keys
      .filter((key) =>
        rootMapKeyHasReviewedFunctionalEvidenceV0_1(
          key,
          authorizedEvidenceByEmbryo,
        ),
      )
      .map((key) => String(key?.token ?? "").trim())
      .filter(Boolean),
  );

  if (reviewedEmbryos.size === 0) {
    return [];
  }

  return getReviewedExternalLexiconProductionSourceRowsV0_1()
    .filter((row) => reviewedEmbryos.has(row.embryo))
    .map((row) => ({
      id: row.candidateId,
      language: row.candidateLanguage,
      family: "reviewed-external-lexicon",
      form: row.isolatedStandaloneForm,

      decomposition: {
        parts: [],
        functionalStatement: row.semanticBridge,
      },

      voices: {
        voiceSequence: [],
        ringPath: [],
        dominantVoices: {},
      },

      ruleChecks: {
        soundPathOk: false,
        functionalDecompOk: true,
        sevenVoicesAlignmentOk: false,
        consonantMeaningOk: false,
        harmonyOk: false,
      },

      principleSignals: {
        truthOk: false,
        expansionOk: false,
        insightOk: false,
        balanceOk: false,
        unityOk: false,
        networkIntegrityOk: false,
        evolutionOk: false,
      },

      status: "experimental",
      confidenceTag: "speculative",

      sourceId: row.sourceId,
      sourceKind: row.sourceKind,
      sourceStatus: row.sourceStatus,

      candidateId: row.candidateId,
      displayForm: row.displayForm,
      candidateLanguage: row.candidateLanguage,
      functionalStatement: row.semanticBridge,
      gloss: row.plainStandaloneGloss,

      claimType: "functionalMotivation",
      originClaim: "not_claimed",
      historicalRelation: "not_evaluated",

      embryo: row.embryo,
      embryoLanguage: row.candidateLanguage,
      isolatedStandaloneForm:
        row.isolatedStandaloneForm,
      plainStandaloneGloss:
        row.plainStandaloneGloss,
      sourceNote: row.sourceNote,

      segmentation: {
        embryo: row.embryo,
        targetWord,
      },

      semanticBridge: row.semanticBridge,
      expansionChain: [
        row.embryo,
        targetWord.toUpperCase(),
      ],

      validationOutcome: "validated",
      validationReasons: [
        "reviewed_production_source_row",
        "live_rootmap_reviewed_functional_evidence",
      ],

      rankGroup: "validatedFunctionalMotivation",
      rankScore: 100,
      rankReason:
        "reviewed production source row matches live RootMap reviewed functional evidence",

      claimBoundary:
        "functional motivation evidence only; not historical origin",

      userDecisionPosture: "user_decides",
    }));
}

export function buildFunctionalCandidateCompositionsFromRootMapV0_1(
  params: {
    rootMap: RootMapV1 | null | undefined;
    targetWord: string;
  },
): ReviewedFunctionalCandidateProjectionV0_1[] {
  const requestedTargetWord =
    String(
      params.targetWord ?? "",
    ).trim();

  if (!requestedTargetWord) {
    return [];
  }

  const targetWord =
    resolveTrustedRootMapBasisV0_1(
      params.rootMap,
      requestedTargetWord,
    );

  if (!targetWord) {
    return [];
  }

  const tokens = Array.isArray(
    params.rootMap?.tokens,
  )
    ? params.rootMap.tokens
        .map((item) =>
          String(item?.token ?? "")
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean)
    : [];

  if (tokens.length < 2) {
    return [];
  }

  const keys = Array.isArray(
    params.rootMap?.keys,
  )
    ? params.rootMap.keys
    : [];

  const authorizedEvidenceByEmbryo =
    buildTargetAuthorizedReviewedFunctionalRuntimeEvidenceByEmbryoV0_1(
      targetWord,
    );

  const keyByToken = new Map(
    keys.map((key) => [
      String(key?.token ?? "")
        .trim()
        .toUpperCase(),
      key,
    ]),
  );

  const components = tokens.map(
    (token) => {
      const key = keyByToken.get(token);

      if (!key) {
        return null;
      }

      // First-class functional composition requires each
      // participating RootMap key to be fully eligible.
      //
      // Non-supported statuses remain diagnostic/context-only
      // material and must not be relabeled as structural evidence
      // merely because another component has reviewed evidence.
      if (key.status !== "supported") {
        return null;
      }

      const language =
        String(key.language ?? "").trim();

      const plainMeaning =
        String(key.gloss ?? "").trim();

      if (!language || !plainMeaning) {
        return null;
      }

      return {
        embryo: token,
        language,
        plainMeaning,
        evidenceState:
          rootMapKeyHasReviewedFunctionalEvidenceV0_1(
            key,
            authorizedEvidenceByEmbryo,
          )
            ? "reviewed"
            : "structural",
      };
    },
  );

  if (
    components.some(
      (component) => component == null,
    )
  ) {
    return [];
  }

  const concreteComponents =
    components.filter(
      (
        component,
      ): component is NonNullable<
        (typeof components)[number]
      > => component != null,
    );

  const languages = Array.from(
    new Set(
      concreteComponents.map(
        (component) =>
          component.language
            .trim()
            .toLowerCase(),
      ),
    ),
  );

  if (languages.length !== 1) {
    return [];
  }

  const reviewedCount =
    concreteComponents.filter(
      (component) =>
        component.evidenceState ===
        "reviewed",
    ).length;

  // Structural RootMap material alone is not enough to
  // promote a functional candidate.
  if (reviewedCount === 0) {
    return [];
  }

  const allReviewed =
    reviewedCount ===
    concreteComponents.length;

  const language =
    concreteComponents[0].language;

  const expression =
    tokens.join(" + ");

  const composedMeaning =
    String(
      params.rootMap?.composedMeaning ??
        "",
    ).trim();

  if (!composedMeaning) {
    return [];
  }

  const candidateId =
    `rootmap-composition:${language.toLowerCase()}:${tokens
      .map((token) =>
        token.toLowerCase(),
      )
      .join("+")}`;

  return [
    {
      id: candidateId,
      language,
      family:
        "rootmap-functional-composition",
      form: expression,

      decomposition: {
        parts: [...tokens],
        functionalStatement:
          composedMeaning,
      },

      status: "experimental",
      confidenceTag: "speculative",
      sourceKind:
        "rootmap_functional_composition",

      candidateId,
      displayForm: expression,
      candidateLanguage: language,
      functionalStatement:
        composedMeaning,
      gloss: composedMeaning,

      claimType:
        "functionalMotivation",
      originClaim: "not_claimed",
      historicalRelation:
        "not_evaluated",

      // A multi-embryo expression is not itself
      // represented as one isolated standalone embryo.
      embryo: null,
      embryoLanguage: null,
      isolatedStandaloneForm: null,
      plainStandaloneGloss: null,

      sourceNote:
        "Composition projected from live RootMap component evidence. Component review states remain separate; this is functional motivation, not historical-origin or winner evidence.",

      segmentation: {
        kind: "functionalComposition",
        components:
          concreteComponents,
      },

      semanticBridge:
        composedMeaning,

      expansionChain: [
        ...tokens,
        targetWord.toUpperCase(),
      ],

      // Component-level lexical review does not validate the
      // composition-level semantic bridge. Until a separately
      // reviewed composition bridge exists, the composed candidate
      // remains Partial even when every component is reviewed.
      validationOutcome:
        "partial",

      validationReasons:
        allReviewed
          ? [
              "rootmap_multi_embryo_composition",
              "all_components_reviewed_functional_evidence",
              "composition_semantic_bridge_not_reviewed",
            ]
          : [
              "rootmap_multi_embryo_composition",
              "mixed_component_evidence",
              "at_least_one_reviewed_functional_component",
              "composition_semantic_bridge_not_reviewed",
            ],

      rankGroup:
        "partialFunctionalMotivation",

      rankScore:
        70,

      rankReason:
        allReviewed
          ? "all component lexical evidence is reviewed, but the composition-level semantic bridge remains unreviewed"
          : "multi-embryo functional composition has mixed reviewed and structural component evidence; the composition-level semantic bridge remains unreviewed",

      claimBoundary:
        "partial functional composition only; component evidence does not authorize the composition-level semantic bridge; not historical origin or fully reviewed candidate truth",

      userDecisionPosture:
        "user_decides",
    },
  ];
}


export function buildRootMapV1(params: {
basis: string;
  minRoots: MinRootHypothesis[] | null | undefined;
  heartPrimaryPath?: unknown; // optional: prefer Heart-aligned hypothesis
}): RootMapV1 | null {
  const reviewedEvidenceByEmbryo = buildReviewedFunctionalRuntimeEvidenceByEmbryoV0_1();
  const basis = String(params.basis ?? "").trim();
  const providedMinRoots =
    Array.isArray(params.minRoots)
      ? params.minRoots
      : [];

  if (!basis) return null;

  if (providedMinRoots.length === 0) {
    return registerTrustedRootMapV0_1(
      {
        tokens: [],
        keys: [],
        composedMeaning: "",
        notes: [
          "No minRoots hypotheses available; RootMap not emitted.",
        ],
      },
      basis,
    );
  }

  const normalizedBasis =
    normalizeTrustedRootMapBasisV0_1(
      basis,
    );

  const basisMatchedMinRoots =
    providedMinRoots.filter(
      (hypothesis) =>
        normalizeTrustedRootMapBasisV0_1(
          hypothesis?.basis,
        ) === normalizedBasis,
    );

  // Legacy structural fixtures may predate the required hypothesis.basis
  // field. They may still produce bounded structural RootMap output, but
  // they can never authorize reviewed evidence or trusted projections.
  const legacyUnscopedMinRoots =
    providedMinRoots.filter(
      (hypothesis) =>
        normalizeTrustedRootMapBasisV0_1(
          hypothesis?.basis,
        ) === "",
    );

  const minRoots =
    basisMatchedMinRoots.length > 0
      ? basisMatchedMinRoots
      : legacyUnscopedMinRoots;

  const selectedHypothesisBasisTrusted =
    basisMatchedMinRoots.length > 0;

  // Explicitly mismatched hypotheses are rejected rather than
  // attributed to the caller-provided RootMap basis.
  if (minRoots.length === 0) {
    return registerTrustedRootMapV0_1(
      {
        tokens: [],
        keys: [],
        composedMeaning: "",
        notes: [
          "No minRoots hypotheses matched the RootMap basis; RootMap not emitted.",
        ],
      },
      basis,
    );
  }

  // Target-word reviewed evidence authorization is owned by
  // canonical operator discovery. A matching reviewed carrier and
  // allowed operation are necessary but not sufficient by themselves.
  const reviewedEvidenceEligibleOperators =
    new Set(
      discoverCanonicalOperatorCandidatesV0_1(
        basis,
      )
        .filter(
          (candidate) =>
            candidate.reviewedEvidenceEligible ===
            true,
        )
        .map(
          (candidate) =>
            candidate.operatorId,
        ),
    );


  // Deterministic selection:
  //
  // 1. Preserve exact Heart-terminal alignment when available.
  // 2. If the canonical Heart terminal has no exact hypothesis, prefer the
  //    first hypothesis whose terminal carrier operation is admitted by the
  //    reviewed evidence policy.
  // 3. Otherwise retain stable source order.
  //
  // This does not promote candidate evidence into the authoritative Heart
  // path. It only prevents an unsupported generic transformation from winning
  // merely because it appears first.

  const heartTerm = lastVowelFromAnyPath(
    params.heartPrimaryPath,
  );

  const heartAlignedHypothesis = heartTerm
    ? minRoots.find(
        (hypothesis) =>
          hypothesisTerminalVowel(hypothesis) === heartTerm,
      )
    : undefined;

  const reviewedOperationAdmittedHypothesis =
    heartTerm && !heartAlignedHypothesis
      ? minRoots.find((hypothesis) =>
          hypothesisHasAllowedReviewedTerminalEvidenceV0_1(
            hypothesis,
            reviewedEvidenceByEmbryo,
          ),
        )
      : undefined;

  const h =
    heartAlignedHypothesis ??
    reviewedOperationAdmittedHypothesis ??
    minRoots[0];

  const tokens: RootTokenV1[] = [];
  const keys: RootKeyV1[] = [];
  const carriersOut: RootCarrierV1[] = [];

  for (let i = 0; i < h.protoRoots.length; i++) {
    const protoRootId = h.protoRoots[i];
    const proto = getProtoRootV1(protoRootId);

    const chosenCarrier =
      Array.isArray(h.carriers) ? h.carriers.find((c) => c.protoRootId === protoRootId) : null;

    const role: RootTokenRoleV1 = proto?.roleHint
      ? roleHintToTokenRole(proto.roleHint)
      : // fallback: use derived decomposition hints if proto is missing
        (i === 0 && h.decomposition?.action ? "action" : "unknown");

    const token: RootTokenV1 = {
      token: protoRootId,
      role,
      vowel_path: extractVowelPath(protoRootId),
    };
    tokens.push(token);

    // Build key entry (the “explainer”)
    const gloss = proto?.gloss ?? "unknown";
    const language = String(chosenCarrier?.lang ?? "unknown");
    const carrierForm = String(chosenCarrier?.carrierForm ?? "");
    const ops = Array.isArray(chosenCarrier?.ops) ? chosenCarrier!.ops : [];

    const evidence: string[] = [];

    // Keep evidence short bullets, no essays.
    if (carrierForm) evidence.push(`${language}: ${carrierForm}`);
    if (ops.length > 0) evidence.push(`ops: ${ops.join(", ")}`);

    const protoCarrierHit =
      proto?.carriers && carrierForm
        ? proto.carriers.find((c) => c.lang === chosenCarrier?.lang && c.form === carrierForm)
        : undefined;

    if (protoCarrierHit?.gloss) {
      evidence.push(`gloss: ${protoCarrierHit.gloss}`);
    }

    const reviewedFunctionalEvidence =
      reviewedEvidenceByEmbryo.get(protoRootId);

    const evidenceOperationEvaluation =
      reviewedFunctionalEvidence
        ? evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
            {
              sourceId: reviewedFunctionalEvidence.sourceId,
              embryo: reviewedFunctionalEvidence.embryo,
              ops,
              segment: chosenCarrier?.segment,
              carrierForm,
            },
          )
        : null;

    const reviewedEvidenceTargetAuthorized =
      reviewedEvidenceEligibleOperators.has(
        protoRootId,
      );

    const reviewedEvidenceLanguageAuthorized =
      Boolean(
        reviewedFunctionalEvidence,
      ) &&
      language
        .trim()
        .toLocaleLowerCase("en-US") ===
        String(
          reviewedFunctionalEvidence?.language ??
            "",
        )
          .trim()
          .toLocaleLowerCase("en-US");

    const reviewedEvidenceAuthorized =
      selectedHypothesisBasisTrusted &&
      Boolean(reviewedFunctionalEvidence) &&
      evidenceOperationEvaluation?.allowed ===
        true &&
      reviewedEvidenceTargetAuthorized &&
      reviewedEvidenceLanguageAuthorized;

    const carrierNoteContainsReviewedCitationMetadata =
      Boolean(
        protoCarrierHit?.notes &&
          /\breviewed\b|\bcitation\b|\bdoi\b|https?:\/\//i.test(
            protoCarrierHit.notes,
          ),
      );

    const shouldExposeCarrierNote =
      Boolean(
        protoCarrierHit?.notes &&
          /dialect attestation|gheg|weak|homophone|do not use/i.test(
            protoCarrierHit.notes,
          ),
      );

    const carrierNoteOperationAllowed =
      !carrierNoteContainsReviewedCitationMetadata ||
      reviewedEvidenceAuthorized;

    if (
      shouldExposeCarrierNote &&
      carrierNoteOperationAllowed &&
      protoCarrierHit?.notes
    ) {
      evidence.push(`note: ${protoCarrierHit.notes}`);
    }

    if (
      reviewedFunctionalEvidence &&
      reviewedEvidenceAuthorized &&
      !evidence.includes(
        reviewedFunctionalEvidence.evidenceText,
      )
    ) {
      evidence.push(reviewedFunctionalEvidence.evidenceText);
    }

    const status: RootKeyStatusV1 = keyStatusForCarrier(
      chosenCarrier ?? null,
      protoCarrierHit?.gloss,
      protoCarrierHit?.notes,
      Boolean(reviewedFunctionalEvidence),
      reviewedEvidenceAuthorized,
    );

    const key: RootKeyV1 = {
      token: protoRootId,
      language,
      gloss,
      evidence:
        evidence.length > 0
          ? evidence
          : [
              "No carrier evidence (speculative).",
            ],
      status,
      ops:
        ops.length > 0
          ? [...ops]
          : undefined,
    };

    keys.push(key);

    if (
      reviewedEvidenceAuthorized &&
      reviewedFunctionalEvidence &&
      evidenceOperationEvaluation?.allowed ===
        true
    ) {
      reviewedRootMapKeyProvenanceV0_1.set(
        key,
        {
          sourceId:
            reviewedFunctionalEvidence.sourceId,
          embryo:
            reviewedFunctionalEvidence.embryo,
          language,
          evidenceText:
            reviewedFunctionalEvidence.evidenceText,
          carrierForm,
          segment:
            String(
              chosenCarrier?.segment ?? "",
            ),
          ops: [...ops],
        },
      );
    }

    // Optional carriers list (secondary “carriers”, not keys)
    if (proto?.carriers) {
      for (const c of proto.carriers) {
        // Don’t duplicate the chosen carrier; RootMap keys already cover it.
        if (c.lang === chosenCarrier?.lang && c.form === carrierForm) continue;
        carriersOut.push({
          token: protoRootId,
          language: c.lang,
          carrierForm: c.form,
          note: c.gloss ? `gloss: ${c.gloss}` : undefined,
        });
      }
    }
  }

  const composedMeaning = tokens
    .map((t) => {
      const proto = getProtoRootV1(t.token);
      return proto?.gloss ?? t.token;
    })
    .filter(Boolean)
    .join(" + ");

  const notes: string[] = [];
  if (!h.checks?.opsWithinLimits) notes.push("Hypothesis opsWithinLimits=false (unexpected); check upstream guardrails.");
  if (!h.checks?.skeletonExplained) notes.push("Hypothesis skeletonExplained=false (unexpected); check upstream guardrails.");

  // Spans: only emit if we can do it deterministically (all-or-nothing).
  const spans = buildSpansOrNull({
    basis,
    protoRoots: h.protoRoots,
    carriers: Array.isArray(h.carriers) ? (h.carriers as any[]) : [],
  });

  const rootMap: RootMapV1 = {
    tokens,
    keys,
    carriers:
      carriersOut.length > 0
        ? carriersOut
        : undefined,
    spans:
      spans ?? undefined,
    composedMeaning,
    notes:
      notes.length > 0
        ? notes
        : undefined,
  };

  if (!selectedHypothesisBasisTrusted) {
    // Structural-only legacy RootMaps are immutable but deliberately
    // absent from private trusted RootMap provenance.
    return deepFreezeRootMapValueV0_1(
      rootMap,
    );
  }

  return registerTrustedRootMapV0_1(
    rootMap,
    basis,
  );
}

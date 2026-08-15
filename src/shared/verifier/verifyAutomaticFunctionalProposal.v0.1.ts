import {
  buildAutomaticFunctionalProposalContextV0_1,
  type AutomaticFunctionalProposalResultV0_1,
  type FunctionalCandidateProposalV0_1,
} from "@/shared/orchestrator/automaticFunctionalCandidateProposal.v0.1";
import {
  extractSevenVowelsFromString,
} from "@/shared/math7.core";

export const AUTOMATIC_FUNCTIONAL_PROPOSAL_VERIFICATION_SCHEMA_V0_1 =
  "open-instrument.automatic-functional-proposal-verification.v0_1" as const;

export type AutomaticFunctionalProposalVerificationCheckV0_1 = {
  id: string;
  pass: boolean;
  detail: string;
};

export type AutomaticFunctionalProposalVerificationClassificationV0_1 =
  | "Proposed"
  | "rejected"
  | "deduplicated_existing";

export type AutomaticFunctionalProposalVerificationCandidateV0_1 = {
  proposalIndex: number;
  language: string;
  candidateExpression: string;
  classification:
    AutomaticFunctionalProposalVerificationClassificationV0_1;
  checks:
    AutomaticFunctionalProposalVerificationCheckV0_1[];
  promotedCandidateId: string | null;
};

export type AutomaticFunctionalProposalVerificationV0_1 = {
  schemaVersion:
    typeof AUTOMATIC_FUNCTIONAL_PROPOSAL_VERIFICATION_SCHEMA_V0_1;
  status:
    | "not_applicable"
    | "verified_proposed"
    | "deduplicated_only"
    | "rejected_all";
  provider: string | null;
  promotionPolicy: "proposed_only";
  acceptedCount: number;
  rejectedCount: number;
  deduplicatedCount: number;
  results:
    AutomaticFunctionalProposalVerificationCandidateV0_1[];
  promotedCandidates: Array<Record<string, unknown>>;
};

export type VerifyAutomaticFunctionalProposalReqV0_1 = {
  analysis: unknown;
  automaticProposal:
    AutomaticFunctionalProposalResultV0_1;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function text(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.normalize("NFKC").trim();

  return normalized || null;
}

function normalizedWord(
  value: unknown,
): string {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase();
}

function normalizedToken(
  value: unknown,
): string {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toUpperCase();
}

function expressionParts(
  value: unknown,
): string[] {
  const candidate =
    text(value);

  if (!candidate) {
    return [];
  }

  return candidate
    .split(/\s*\+\s*/u)
    .map(normalizedToken)
    .filter(Boolean);
}

function expressionKey(
  value: unknown,
): string {
  return expressionParts(value)
    .join("+");
}

function normalizedLanguageKey(
  value: unknown,
): string {
  const raw =
    String(value ?? "")
      .normalize("NFKC")
      .trim()
      .toLowerCase();

  const aliases:
    Record<string, string> = {
      sq: "albanian",
      albanian: "albanian",
      en: "english",
      english: "english",
      de: "german",
      german: "german",
      fr: "french",
      french: "french",
      it: "italian",
      italian: "italian",
      es: "spanish",
      spanish: "spanish",
    };

  return aliases[raw] ?? raw;
}

function languageLabelUsable(
  value: unknown,
): boolean {
  const raw =
    normalizedLanguageKey(value);

  if (!raw) {
    return false;
  }

  const blocked =
    new Set([
      "unknown",
      "und",
      "n/a",
      "na",
      "proto",
      "proto-language",
      "proto-indo-european",
      "pie",
      "latin",
      "la",
      "ancient greek",
      "sanskrit",
    ]);

  if (blocked.has(raw)) {
    return false;
  }

  return !(
    raw.startsWith("proto-") ||
    raw.startsWith("proto ")
  );
}

function glossTerms(
  value: unknown,
): Set<string> {
  const raw =
    String(value ?? "")
      .normalize("NFKC")
      .toLowerCase();

  return new Set(
    raw
      .split(/[^\p{L}\p{N}]+/u)
      .map((item) => item.trim())
      .filter(
        (item) =>
          item.length >= 2,
      ),
  );
}

function glossesOverlap(
  left: unknown,
  right: unknown,
): boolean {
  const a =
    glossTerms(left);

  const b =
    glossTerms(right);

  if (
    a.size === 0 ||
    b.size === 0
  ) {
    return true;
  }

  for (const item of a) {
    if (b.has(item)) {
      return true;
    }
  }

  return false;
}

function normalizeTransform(
  value: unknown,
): string {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase();
}

function proposalWithinBounds(
  candidate:
    FunctionalCandidateProposalV0_1,
): boolean {
  if (
    candidate.candidateExpression.length >
      160 ||
    candidate.embryos.length === 0 ||
    candidate.embryos.length > 8 ||
    candidate.semanticBridge.length >
      1000 ||
    candidate.functionalExplanation.length >
      1000 ||
    candidate.requiredTransforms.length >
      12
  ) {
    return false;
  }

  return candidate.embryos.every(
    (embryo) =>
      embryo.form.length > 0 &&
      embryo.form.length <= 80 &&
      embryo.gloss.length > 0 &&
      embryo.gloss.length <= 240,
  );
}

function existingCandidateKeys(
  analysis: unknown,
): Set<string> {
  const root =
    isRecord(analysis)
      ? analysis
      : {};

  const rows =
    Array.isArray(
      root["candidates"],
    )
      ? root["candidates"]
      : [];

  const keys =
    new Set<string>();

  for (const row of rows) {
    if (!isRecord(row)) {
      continue;
    }

    const language =
      text(
        row[
          "candidateLanguage"
        ],
      ) ??
      text(row["language"]);

    const expression =
      text(row["displayForm"]) ??
      text(row["form"]) ??
      text(row["embryo"]);

    if (
      !language ||
      !expression
    ) {
      continue;
    }

    const key =
      `${normalizedLanguageKey(
        language,
      )}|${expressionKey(
        expression,
      )}`;

    keys.add(key);
  }

  return keys;
}

function stableProposalCandidateId(
  word: string,
  proposalIndex: number,
): string {
  const wordPart =
    normalizedWord(word)
      .replace(
        /[^a-z0-9ë]+/gu,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      ) || "word";

  return (
    "automatic-functional-proposal:" +
    wordPart +
    ":" +
    String(
      proposalIndex + 1,
    )
  );
}

function componentEvidenceState(
  embryo: string,
  reviewed:
    ReadonlySet<string>,
  structural:
    ReadonlySet<string>,
):
  | "reviewed"
  | "structural"
  | "proposed" {
  const token =
    normalizedToken(embryo);

  if (reviewed.has(token)) {
    return "reviewed";
  }

  if (structural.has(token)) {
    return "structural";
  }

  return "proposed";
}

function makeCheck(
  id: string,
  pass: boolean,
  detail: string,
):
  AutomaticFunctionalProposalVerificationCheckV0_1 {
  return {
    id,
    pass,
    detail,
  };
}

function buildPromotedProposedCandidate(
  args: {
    word: string;
    proposalIndex: number;
    provider: string;
    candidate:
      FunctionalCandidateProposalV0_1;
    candidateVowelPath: string[];
    reviewed:
      ReadonlySet<string>;
    structural:
      ReadonlySet<string>;
    checks:
      AutomaticFunctionalProposalVerificationCheckV0_1[];
  },
): Record<string, unknown> {
  const {
    word,
    proposalIndex,
    provider,
    candidate,
    candidateVowelPath,
    reviewed,
    structural,
    checks,
  } = args;

  const id =
    stableProposalCandidateId(
      word,
      proposalIndex,
    );

  const singleEmbryo =
    candidate.embryos.length === 1
      ? candidate.embryos[0]
      : null;

  const componentRows =
    candidate.embryos.map(
      (embryo) => ({
        embryo:
          embryo.form,
        language:
          candidate.language,
        plainMeaning:
          embryo.gloss,
        evidenceState:
          componentEvidenceState(
            embryo.form,
            reviewed,
            structural,
          ),
      }),
    );

  return {
    id,
    candidateId: id,

    language:
      candidate.language,
    candidateLanguage:
      candidate.language,

    form:
      candidate.candidateExpression,
    displayForm:
      candidate.candidateExpression,

    sourceKind:
      "automatic_llm_functional_proposal",
    sourceStatus:
      "deterministically_verified_proposed",
    proposalProvider:
      provider,

    claimType:
      "functionalMotivation",
    originClaim:
      "not_claimed",
    historicalRelation:
      "not_evaluated",

    embryo:
      singleEmbryo?.form ??
      null,
    embryoSize:
      singleEmbryo
        ? Array.from(
            singleEmbryo.form,
          ).length
        : null,
    embryoLanguage:
      singleEmbryo
        ? candidate.language
        : null,

    isolatedStandaloneForm:
      null,

    plainStandaloneGloss:
      singleEmbryo?.gloss ??
      null,

    sourceNote:
      "Automatic real-provider functional proposal accepted by the deterministic Slice E proposal verifier. It remains Proposed; no reviewed candidate truth is claimed.",

    segmentation: {
      kind:
        "functionalProposal",
      components:
        componentRows,
    },

    semanticBridge:
      candidate.semanticBridge,

    functionalStatement:
      candidate.functionalExplanation,

    expansionChain: [
      ...candidate.embryos.map(
        (embryo) =>
          embryo.form,
      ),
      word,
    ],

    validationOutcome:
      "not_evaluated",

    validationReasons: [
      "automatic_real_provider_proposal",
      "deterministic_proposal_structure_verified",
      "promoted_as_proposed_only",
      ...checks
        .filter(
          (check) =>
            check.pass,
        )
        .map(
          (check) =>
            check.id,
        ),
    ],

    rankGroup:
      "unresolved",
    rankScore: 10,
    rankReason:
      "deterministically verified proposer structure; lexical/candidate truth remains unreviewed",

    claimBoundary:
      "LLM-proposed functional hypothesis only; not reviewed candidate truth and not historical origin",

    userDecisionPosture:
      "user_decides",

    status:
      "experimental",
    confidenceTag:
      "speculative",

    ops:
      candidate.requiredTransforms,
    opsUsed:
      candidate.requiredTransforms,

    vowelPath:
      candidateVowelPath,

    proposalVerificationV0_1: {
      schemaVersion:
        AUTOMATIC_FUNCTIONAL_PROPOSAL_VERIFICATION_SCHEMA_V0_1,
      classification:
        "Proposed",
      proposalIndex,
      checks,
    },
  };
}

export function verifyAutomaticFunctionalProposalV0_1(
  req:
    VerifyAutomaticFunctionalProposalReqV0_1,
): AutomaticFunctionalProposalVerificationV0_1 {
  const {
    analysis,
    automaticProposal,
  } = req;

  const notApplicable:
    AutomaticFunctionalProposalVerificationV0_1 = {
      schemaVersion:
        AUTOMATIC_FUNCTIONAL_PROPOSAL_VERIFICATION_SCHEMA_V0_1,
      status:
        "not_applicable",
      provider:
        automaticProposal.provider,
      promotionPolicy:
        "proposed_only",
      acceptedCount: 0,
      rejectedCount: 0,
      deduplicatedCount: 0,
      results: [],
      promotedCandidates: [],
    };

  const proposalProvider =
    automaticProposal.provider;

  if (
    automaticProposal.status !==
      "proposed_unverified" ||
    automaticProposal.realProvider !==
      true ||
    automaticProposal.mockProvider ===
      true ||
    proposalProvider !==
      "openai_compat" ||
    !automaticProposal.proposal
  ) {
    return notApplicable;
  }

  const root =
    isRecord(analysis)
      ? analysis
      : {};

  const analysisWord =
    text(root["word"]) ?? "";

  const proposal =
    automaticProposal.proposal;

  const context =
    buildAutomaticFunctionalProposalContextV0_1(
      analysis,
    );

  const reviewed =
    new Set(
      context.reviewedOperators.map(
        normalizedToken,
      ),
    );

  const structural =
    new Set(
      context.structuralTokens.map(
        normalizedToken,
      ),
    );

  const permittedTransforms =
    new Set(
      context.permittedTransforms.map(
        normalizeTransform,
      ),
    );

  const reviewedEvidence =
    new Map(
      context.reviewedLexicalEvidence.map(
        (item) => [
          normalizedToken(
            item.embryo,
          ),
          item,
        ],
      ),
    );

  const seenKeys =
    existingCandidateKeys(
      analysis,
    );

  const results:
    AutomaticFunctionalProposalVerificationCandidateV0_1[] =
      [];

  const accepted:
    Array<{
      proposalIndex: number;
      embryoCount: number;
      compactSize: number;
      candidate:
        Record<string, unknown>;
    }> = [];

  let rejectedCount = 0;
  let deduplicatedCount = 0;

  const wordMatches =
    normalizedWord(
      proposal.word,
    ) ===
    normalizedWord(
      analysisWord,
    );

  proposal.candidates.forEach(
    (
      candidate,
      proposalIndex,
    ) => {
      const checks:
        AutomaticFunctionalProposalVerificationCheckV0_1[] =
          [];

      checks.push(
        makeCheck(
          "REAL_PROVIDER_PROPOSAL",
          true,
          "proposal came from the explicit openai_compat real-provider lane",
        ),
      );

      checks.push(
        makeCheck(
          "WORD_MATCH",
          wordMatches,
          wordMatches
            ? "proposal target matches deterministic analysis target"
            : "proposal target differs from deterministic analysis target",
        ),
      );

      const usableLanguage =
        languageLabelUsable(
          candidate.language,
        );

      checks.push(
        makeCheck(
          "LANGUAGE_USABLE",
          usableLanguage,
          usableLanguage
            ? "language label passes the bounded living-language usability guard"
            : "language label is empty, generic, proto, or an explicitly historical/non-living label",
        ),
      );

      const bounded =
        proposalWithinBounds(
          candidate,
        );

      checks.push(
        makeCheck(
          "PROPOSAL_BOUNDS",
          bounded,
          bounded
            ? "proposal fields are within deterministic size/count bounds"
            : "proposal exceeds deterministic size/count bounds",
        ),
      );

      const embryoParts =
        candidate.embryos.map(
          (embryo) =>
            normalizedToken(
              embryo.form,
            ),
        );

      const emittedParts =
        expressionParts(
          candidate.candidateExpression,
        );

      const expressionMatches =
        embryoParts.length > 0 &&
        embryoParts.length ===
          emittedParts.length &&
        embryoParts.every(
          (part, index) =>
            part ===
            emittedParts[index],
        );

      checks.push(
        makeCheck(
          "EXPRESSION_MATCHES_EMBRYOS",
          expressionMatches,
          expressionMatches
            ? "candidate expression exactly represents the emitted embryo sequence"
            : "candidate expression does not match the emitted embryo sequence",
        ),
      );

      const semanticBridgePresent =
        Boolean(
          text(
            candidate.semanticBridge,
          ),
        );

      checks.push(
        makeCheck(
          "SEMANTIC_BRIDGE_PRESENT",
          semanticBridgePresent,
          semanticBridgePresent
            ? "semantic bridge is present"
            : "semantic bridge is missing",
        ),
      );

      const explanationPresent =
        Boolean(
          text(
            candidate.functionalExplanation,
          ),
        );

      checks.push(
        makeCheck(
          "FUNCTIONAL_EXPLANATION_PRESENT",
          explanationPresent,
          explanationPresent
            ? "plain functional explanation is present"
            : "plain functional explanation is missing",
        ),
      );

      const transformsPermitted =
        candidate.requiredTransforms.every(
          (transform) =>
            permittedTransforms.has(
              normalizeTransform(
                transform,
              ),
            ),
        );

      checks.push(
        makeCheck(
          "TRANSFORMS_PERMITTED",
          transformsPermitted,
          transformsPermitted
            ? "all requested transforms are permitted by deterministic context"
            : "one or more requested transforms are not permitted by deterministic context",
        ),
      );

      const candidateVowelPath =
        extractSevenVowelsFromString(
          candidate.candidateExpression,
        ).map(String);

      const vowelPathComputed =
        candidateVowelPath.length > 0;

      checks.push(
        makeCheck(
          "VOWEL_PATH_COMPUTED",
          vowelPathComputed,
          vowelPathComputed
            ? `candidate vowel path computed as ${candidateVowelPath.join(
                "→",
              )}`
            : "candidate expression emits no canonical Seven-Voice vowel path",
        ),
      );

      const sliceGNormalization =
        isRecord(
          root[
            "functionalVoiceNormalizationV0_1"
          ],
        )
          ? root[
              "functionalVoiceNormalizationV0_1"
            ]
          : null;

      const explicitSliceGFunctionalPath =
        sliceGNormalization &&
        Array.isArray(
          sliceGNormalization[
            "functionalPath"
          ],
        )
          ? sliceGNormalization[
              "functionalPath"
            ]
              .map(
                (voice: unknown) =>
                  normalizedToken(
                    voice,
                  ),
              )
              .filter(Boolean)
          : [];

      const functionalPathMatchRequired =
        explicitSliceGFunctionalPath.length > 0;

      const functionalPathMatches =
        !functionalPathMatchRequired
          ? true
          : (
              candidateVowelPath.length ===
                explicitSliceGFunctionalPath.length &&
              candidateVowelPath.every(
                (voice, index) =>
                  normalizedToken(
                    voice,
                  ) ===
                  explicitSliceGFunctionalPath[
                    index
                  ],
              )
            );

      checks.push(
        makeCheck(
          "FUNCTIONAL_PATH_MATCH",
          functionalPathMatches,
          !functionalPathMatchRequired
            ? "no explicit Slice G functional-normalization path is present; legacy Slice E behavior is preserved"
            : functionalPathMatches
              ? `candidate vowel path matches explicit Slice G functional path ${explicitSliceGFunctionalPath.join(
                  "→",
                )}`
              : `candidate vowel path ${candidateVowelPath.join(
                  "→",
                )} differs from explicit Slice G functional path ${explicitSliceGFunctionalPath.join(
                  "→",
                )}`,
        ),
      );

      let reviewedEvidenceOk =
        true;

      for (
        const embryo
        of candidate.embryos
      ) {
        const known =
          reviewedEvidence.get(
            normalizedToken(
              embryo.form,
            ),
          );

        if (!known) {
          continue;
        }

        if (
          known.language &&
          normalizedLanguageKey(
            known.language,
          ) !==
            normalizedLanguageKey(
              candidate.language,
            )
        ) {
          reviewedEvidenceOk =
            false;
          break;
        }

        if (
          known.gloss &&
          !glossesOverlap(
            known.gloss,
            embryo.gloss,
          )
        ) {
          reviewedEvidenceOk =
            false;
          break;
        }
      }

      checks.push(
        makeCheck(
          "REVIEWED_EVIDENCE_NOT_CONTRADICTED",
          reviewedEvidenceOk,
          reviewedEvidenceOk
            ? "proposal does not contradict matching reviewed lexical evidence"
            : "proposal conflicts with matching reviewed lexical evidence",
        ),
      );

      const key =
        `${normalizedLanguageKey(
          candidate.language,
        )}|${expressionKey(
          candidate.candidateExpression,
        )}`;

      const duplicate =
        seenKeys.has(key);

      checks.push(
        makeCheck(
          "NOT_DUPLICATE",
          !duplicate,
          duplicate
            ? "an equivalent deterministic or earlier accepted candidate already exists"
            : "candidate is not an existing deterministic duplicate",
        ),
      );

      const substantiveChecksPass =
        checks
          .filter(
            (check) =>
              check.id !==
              "NOT_DUPLICATE",
          )
          .every(
            (check) =>
              check.pass,
          );

      if (!substantiveChecksPass) {
        rejectedCount += 1;

        results.push({
          proposalIndex,
          language:
            candidate.language,
          candidateExpression:
            candidate.candidateExpression,
          classification:
            "rejected",
          checks,
          promotedCandidateId:
            null,
        });

        return;
      }

      if (duplicate) {
        deduplicatedCount += 1;

        results.push({
          proposalIndex,
          language:
            candidate.language,
          candidateExpression:
            candidate.candidateExpression,
          classification:
            "deduplicated_existing",
          checks,
          promotedCandidateId:
            null,
        });

        return;
      }

      seenKeys.add(key);

      const promoted =
        buildPromotedProposedCandidate({
          word:
            analysisWord,
          proposalIndex,
          provider:
            proposalProvider,
          candidate,
          candidateVowelPath,
          reviewed,
          structural,
          checks,
        });

      const promotedCandidateId =
        String(
          promoted[
            "candidateId"
          ] ?? "",
        );

      accepted.push({
        proposalIndex,
        embryoCount:
          candidate.embryos.length,
        compactSize:
          candidate.embryos.reduce(
            (total, embryo) =>
              total +
              Array.from(
                embryo.form.replace(
                  /\s+/g,
                  "",
                ),
              ).length,
            0,
          ),
        candidate:
          promoted,
      });

      results.push({
        proposalIndex,
        language:
          candidate.language,
        candidateExpression:
          candidate.candidateExpression,
        classification:
          "Proposed",
        checks,
        promotedCandidateId,
      });
    },
  );

  accepted.sort(
    (left, right) =>
      left.embryoCount -
        right.embryoCount ||
      left.compactSize -
        right.compactSize ||
      left.proposalIndex -
        right.proposalIndex,
  );

  const promotedCandidates =
    accepted.map(
      (item) =>
        item.candidate,
    );

  const status:
    AutomaticFunctionalProposalVerificationV0_1["status"] =
    promotedCandidates.length > 0
      ? "verified_proposed"
      : deduplicatedCount > 0 &&
          rejectedCount === 0
        ? "deduplicated_only"
        : "rejected_all";

  return {
    schemaVersion:
      AUTOMATIC_FUNCTIONAL_PROPOSAL_VERIFICATION_SCHEMA_V0_1,
    status,
    provider:
      automaticProposal.provider,
    promotionPolicy:
      "proposed_only",
    acceptedCount:
      promotedCandidates.length,
    rejectedCount,
    deduplicatedCount,
    results,
    promotedCandidates,
  };
}

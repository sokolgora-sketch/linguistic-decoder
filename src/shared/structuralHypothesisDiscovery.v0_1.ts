import {
  extractSevenVowelsFromString,
  type SevenVowel,
} from "./math7.core";

export const STRUCTURAL_HYPOTHESIS_VERSION_V0_1 =
  "z-zero.structural-hypothesis.v0_1" as const;

export type StructuralReductionOperationIdV0_1 =
  | "peel_right_vowel_led_expansion"
  | "peel_left_consonant_frame";

export type StructuralReductionReasonCodeV0_1 =
  | "structural_reduction_applied"
  | "right_edge_vowel_led_expansion"
  | "left_consonant_frame_preserved"
  | "structural_containment_preserved"
  | "deterministic_operation_authorized"
  | "voice_path_recorded";

export type StructuralHypothesisReasonCodeV0_1 =
  | "structural_reduction_applied"
  | "structural_containment_preserved"
  | "deterministic_operation_authorized"
  | "terminal_structural_hypothesis_reached"
  | "minimum_defensible_embryo_reached"
  | "insufficient_structural_support"
  | "voice_path_recorded"
  | "independent_meaning_unknown"
  | "lexical_attestation_not_required_for_discovery"
  | "historical_origin_not_claimed"
  | "candidate_truth_not_claimed"
  | "production_promotion_not_claimed";

export type StructuralReductionStepV0_1 = {
  from: string;
  to: string;
  operationId:
    StructuralReductionOperationIdV0_1;
  reasonCodes:
    StructuralReductionReasonCodeV0_1[];
  fromSpan: {
    start: number;
    end: number;
  };
  removedOrChanged: string;
  voicePathBefore: SevenVowel[];
  voicePathAfter: SevenVowel[];
};

export type StructuralHypothesisV0_1 = {
  hypothesisVersion:
    typeof STRUCTURAL_HYPOTHESIS_VERSION_V0_1;
  hypothesisId: string;
  basis: string;
  embryo: string;
  embryoSize: number;
  discoveryStatus:
    "structural_hypothesis";
  independentStandaloneMeaning: null;
  lexicalAttestation:
    "not_evaluated";
  functionalSupportStatus:
    "unknown";
  reductionSteps:
    StructuralReductionStepV0_1[];
  expansionChain: string[];
  reasonCodes:
    StructuralHypothesisReasonCodeV0_1[];
  evidenceRefs: string[];
  historicalOriginClaim:
    "not_claimed";
  historicalTransmissionClaim:
    "not_claimed";
  winnerClaim:
    "not_claimed";
  languageSuperiorityClaim:
    "not_claimed";
  candidateTruthClaim:
    "not_claimed";
  userDecisionPosture:
    "user_decides";
};

type ReductionBranchV0_1 = {
  form: string;
  reductionSteps:
    StructuralReductionStepV0_1[];
};

const MAX_RIGHT_EDGE_PEELS_V0_1 = 1;
const MAX_LEFT_FRAME_PEELS_V0_1 = 2;
const MIN_TERMINAL_LENGTH_V0_1 = 2;

function normalizeStructuralBasisV0_1(
  value: unknown,
): string {
  const raw =
    String(value ?? "")
      .normalize("NFC")
      .trim()
      .toLocaleLowerCase(
        "en-US",
      );

  // Structural discovery currently has deterministic character
  // authority only for ASCII Latin letters plus canonical Ë.
  //
  // Never manufacture a new structural basis by deleting unsupported
  // Unicode letters or combining marks from inside a word.
  //
  // Example forbidden normalization:
  // résumé -> rsum
  //
  // No transliteration or Unicode lexical equivalence is claimed here.
  const hasUnsupportedUnicodeLetter =
    Array.from(raw).some(
      (symbol) =>
        /[\p{L}\p{M}]/u.test(
          symbol,
        ) &&
        !/[a-zë]/u.test(
          symbol,
        ),
    );

  if (
    hasUnsupportedUnicodeLetter
  ) {
    return "";
  }

  return raw.replace(
    /[^a-zë]/g,
    "",
  );
}

function symbolsV0_1(
  value: string,
): string[] {
  return Array.from(value.normalize("NFC"));
}

function displayFormV0_1(
  value: string,
): string {
  return value.toLocaleUpperCase("en-US");
}

function voicePathV0_1(
  value: string,
): SevenVowel[] {
  return [
    ...extractSevenVowelsFromString(
      value,
    ),
  ];
}

function sameVoicePathV0_1(
  left: readonly SevenVowel[],
  right: readonly SevenVowel[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every(
    (voice, index) =>
      voice === right[index],
  );
}

function isCanonicalVoiceSymbolV0_1(
  value: string,
): boolean {
  return (
    voicePathV0_1(value).length === 1
  );
}

function containsCanonicalVoiceV0_1(
  value: string,
): boolean {
  return (
    voicePathV0_1(value).length > 0
  );
}

function buildRightEdgePeelStepV0_1(
  form: string,
  suffixLength: 2 | 3,
): StructuralReductionStepV0_1 | null {
  const chars = symbolsV0_1(form);

  if (
    chars.length <
    suffixLength + 3
  ) {
    return null;
  }

  const start =
    chars.length - suffixLength;

  const suffixChars =
    chars.slice(start);

  const suffix =
    suffixChars.join("");

  const firstSuffixSymbol =
    suffixChars[0] ?? "";

  if (
    !isCanonicalVoiceSymbolV0_1(
      firstSuffixSymbol,
    )
  ) {
    return null;
  }

  const suffixHasConsonantalFrame =
    suffixChars.some(
      (symbol) =>
        !isCanonicalVoiceSymbolV0_1(
          symbol,
        ),
    );

  if (!suffixHasConsonantalFrame) {
    return null;
  }

  const next =
    chars
      .slice(0, start)
      .join("");

  if (
    symbolsV0_1(next).length < 3
  ) {
    return null;
  }

  if (
    !containsCanonicalVoiceV0_1(
      next,
    )
  ) {
    return null;
  }

  const before =
    voicePathV0_1(form);

  const after =
    voicePathV0_1(next);

  return {
    from:
      displayFormV0_1(form),
    to:
      displayFormV0_1(next),
    operationId:
      "peel_right_vowel_led_expansion",
    reasonCodes: [
      "structural_reduction_applied",
      "right_edge_vowel_led_expansion",
      "structural_containment_preserved",
      "deterministic_operation_authorized",
      "voice_path_recorded",
    ],
    fromSpan: {
      start,
      end: chars.length,
    },
    removedOrChanged:
      displayFormV0_1(suffix),
    voicePathBefore:
      before,
    voicePathAfter:
      after,
  };
}

function applyRightEdgePeelV0_1(
  form: string,
): ReductionBranchV0_1[] {
  if (
    MAX_RIGHT_EDGE_PEELS_V0_1 < 1
  ) {
    return [];
  }

  const out:
    ReductionBranchV0_1[] = [];

  for (
    const suffixLength
    of [2, 3] as const
  ) {
    const step =
      buildRightEdgePeelStepV0_1(
        form,
        suffixLength,
      );

    if (!step) {
      continue;
    }

    out.push({
      form:
        step.to.toLocaleLowerCase(
          "en-US",
        ),
      reductionSteps: [
        step,
      ],
    });
  }

  return out;
}

function buildLeftFramePeelStepV0_1(
  form: string,
): StructuralReductionStepV0_1 | null {
  const chars =
    symbolsV0_1(form);

  if (
    chars.length <=
    MIN_TERMINAL_LENGTH_V0_1
  ) {
    return null;
  }

  const leading =
    chars[0] ?? "";

  if (
    isCanonicalVoiceSymbolV0_1(
      leading,
    )
  ) {
    return null;
  }

  const next =
    chars.slice(1).join("");

  if (
    symbolsV0_1(next).length <
    MIN_TERMINAL_LENGTH_V0_1
  ) {
    return null;
  }

  const before =
    voicePathV0_1(form);

  const after =
    voicePathV0_1(next);

  if (
    before.length === 0 ||
    after.length === 0
  ) {
    return null;
  }

  if (
    !sameVoicePathV0_1(
      before,
      after,
    )
  ) {
    return null;
  }

  return {
    from:
      displayFormV0_1(form),
    to:
      displayFormV0_1(next),
    operationId:
      "peel_left_consonant_frame",
    reasonCodes: [
      "structural_reduction_applied",
      "left_consonant_frame_preserved",
      "structural_containment_preserved",
      "deterministic_operation_authorized",
      "voice_path_recorded",
    ],
    fromSpan: {
      start: 0,
      end: 1,
    },
    removedOrChanged:
      displayFormV0_1(
        leading,
      ),
    voicePathBefore:
      before,
    voicePathAfter:
      after,
  };
}

function reduceLeftFrameV0_1(
  branch: ReductionBranchV0_1,
): ReductionBranchV0_1 {
  let form =
    branch.form;

  const reductionSteps = [
    ...branch.reductionSteps,
  ];

  for (
    let count = 0;
    count <
      MAX_LEFT_FRAME_PEELS_V0_1;
    count += 1
  ) {
    const step =
      buildLeftFramePeelStepV0_1(
        form,
      );

    if (!step) {
      break;
    }

    reductionSteps.push(
      step,
    );

    form =
      step.to.toLocaleLowerCase(
        "en-US",
      );
  }

  return {
    form,
    reductionSteps,
  };
}

function expansionChainV0_1(
  basis: string,
  steps:
    readonly StructuralReductionStepV0_1[],
): string[] {
  if (steps.length === 0) {
    return [];
  }

  const reduced = [
    displayFormV0_1(basis),
    ...steps.map(
      (step) => step.to,
    ),
  ];

  return [
    ...reduced,
  ].reverse();
}

function buildHypothesisV0_1(
  basis: string,
  branch: ReductionBranchV0_1,
): StructuralHypothesisV0_1 | null {
  if (
    branch.reductionSteps.length === 0
  ) {
    return null;
  }

  const embryo =
    displayFormV0_1(
      branch.form,
    );

  if (
    !containsCanonicalVoiceV0_1(
      branch.form,
    )
  ) {
    return null;
  }

  const expansionChain =
    expansionChainV0_1(
      basis,
      branch.reductionSteps,
    );

  if (
    expansionChain.length < 2
  ) {
    return null;
  }

  const operationKey =
    branch.reductionSteps
      .map(
        (step) =>
          step.operationId,
      )
      .join("+");

  return {
    hypothesisVersion:
      STRUCTURAL_HYPOTHESIS_VERSION_V0_1,
    hypothesisId:
      [
        "logic-structural",
        basis,
        branch.form,
        operationKey,
      ].join(":"),
    basis,
    embryo,
    embryoSize:
      symbolsV0_1(
        branch.form,
      ).length,
    discoveryStatus:
      "structural_hypothesis",
    independentStandaloneMeaning:
      null,
    lexicalAttestation:
      "not_evaluated",
    functionalSupportStatus:
      "unknown",
    reductionSteps: [
      ...branch.reductionSteps,
    ],
    expansionChain,
    reasonCodes: [
      "structural_reduction_applied",
      "structural_containment_preserved",
      "deterministic_operation_authorized",
      "terminal_structural_hypothesis_reached",
      "voice_path_recorded",
      "independent_meaning_unknown",
      "lexical_attestation_not_required_for_discovery",
      "historical_origin_not_claimed",
      "candidate_truth_not_claimed",
      "production_promotion_not_claimed",
    ],
    evidenceRefs: [],
    historicalOriginClaim:
      "not_claimed",
    historicalTransmissionClaim:
      "not_claimed",
    winnerClaim:
      "not_claimed",
    languageSuperiorityClaim:
      "not_claimed",
    candidateTruthClaim:
      "not_claimed",
    userDecisionPosture:
      "user_decides",
  };
}

export function discoverStructuralHypothesesV0_1(
  input: string,
): StructuralHypothesisV0_1[] {
  const basis =
    normalizeStructuralBasisV0_1(
      input,
    );

  if (!basis) {
    return [];
  }

  const branches:
    ReductionBranchV0_1[] = [
      {
        form: basis,
        reductionSteps: [],
      },
      ...applyRightEdgePeelV0_1(
        basis,
      ),
    ];

  const hypotheses =
    branches
      .map(
        (branch) =>
          reduceLeftFrameV0_1(
            branch,
          ),
      )
      .map(
        (branch) =>
          buildHypothesisV0_1(
            basis,
            branch,
          ),
      )
      .filter(
        (
          hypothesis,
        ): hypothesis is StructuralHypothesisV0_1 =>
          hypothesis !== null,
      );

  const deduped =
    new Map<
      string,
      StructuralHypothesisV0_1
    >();

  for (
    const hypothesis
    of hypotheses
  ) {
    const key = [
      hypothesis.embryo,
      hypothesis.reductionSteps
        .map(
          (step) =>
            [
              step.from,
              step.to,
              step.operationId,
            ].join(">"),
        )
        .join("|"),
    ].join("::");

    if (
      !deduped.has(key)
    ) {
      deduped.set(
        key,
        hypothesis,
      );
    }
  }

  // A mechanically reachable terminal is not automatically
  // a defensible structural hypothesis.
  //
  // v0.1 survival:
  // - two or more independently authorized reduction steps; or
  // - exactly one authorized step whose terminal is composed
  //   entirely of canonical Seven Voices.
  //
  // The canonical voice decision comes from math7.core through
  // extractSevenVowelsFromString. No lexical/evidence lookup occurs.
  const defensibleHypotheses =
    [...deduped.values()].filter(
      (hypothesis) => {
        const operationCount =
          hypothesis
            .reductionSteps
            .length;

        if (
          operationCount >= 2
        ) {
          return true;
        }

        if (
          operationCount !== 1
        ) {
          return false;
        }

        const terminalSymbols =
          Array.from(
            hypothesis
              .embryo
              .normalize("NFC"),
          );

        const terminalVoices =
          extractSevenVowelsFromString(
            hypothesis.embryo,
          );

        const pureSevenVoicesTerminal =
          terminalSymbols.length > 0 &&
          terminalVoices.length ===
            terminalSymbols.length;

        return pureSevenVoicesTerminal;
      },
    );

  // Structural-family emission requires reaching the minimum
  // form size already authorized by the v0.1 operation grammar.
  //
  // A family that bottoms out above two symbols remains only a
  // mechanically reachable reduction path; it is not emitted as
  // StructuralHypothesisV0_1.
  //
  // Once a size-2 anchor exists, larger siblings that already
  // passed the structural-support gate may remain visible under
  // the no-single-winner posture.
  const structuralMinimumAnchorSizeV0_1 =
    2;

  const minimumDefensibleAnchorSize =
    defensibleHypotheses.length > 0
      ? Math.min(
          ...defensibleHypotheses.map(
            (hypothesis) =>
              hypothesis.embryoSize,
          ),
        )
      : null;

  if (
    minimumDefensibleAnchorSize !==
    structuralMinimumAnchorSizeV0_1
  ) {
    return [];
  }

  const ordered =
    defensibleHypotheses
      .map(
        (hypothesis, index) => ({
          hypothesis,
          index,
        }),
      )
      .sort((left, right) => {
        if (
          left.hypothesis.embryoSize !==
          right.hypothesis.embryoSize
        ) {
          return (
            left.hypothesis.embryoSize -
            right.hypothesis.embryoSize
          );
        }

        if (
          left.hypothesis.reductionSteps.length !==
          right.hypothesis.reductionSteps.length
        ) {
          return (
            left.hypothesis.reductionSteps.length -
            right.hypothesis.reductionSteps.length
          );
        }

        return left.index - right.index;
      })
      .map(({ hypothesis }) => hypothesis);

  const minimumEmbryoSize =
    ordered[0]?.embryoSize ?? null;

  return ordered.map(
    (hypothesis) => {
      if (
        minimumEmbryoSize === null ||
        hypothesis.embryoSize !==
          minimumEmbryoSize
      ) {
        return hypothesis;
      }

      if (
        hypothesis.reasonCodes.includes(
          "minimum_defensible_embryo_reached",
        )
      ) {
        return hypothesis;
      }

      return {
        ...hypothesis,
        reasonCodes: [
          ...hypothesis.reasonCodes,
          "minimum_defensible_embryo_reached",
        ],
      };
    },
  );
}

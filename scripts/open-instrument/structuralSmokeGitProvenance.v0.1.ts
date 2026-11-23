const SHA_PATTERN = /^[a-f0-9]{40}$/iu;

type PullRequestEvent = {
  pull_request?: {
    base?: { ref?: unknown; sha?: unknown };
    head?: { sha?: unknown };
  };
};

export type StructuralSmokeGitProvenance = {
  source: "GITHUB_ACTION_EVENT" | "EXPLICIT_VERIFIED_INPUT";
  eventName: string;
  testedCheckoutHeadSha: string;
  testedFeatureHeadSha: string;
  verifiedPrBase: { ref: string; sha: string } | null;
};

export type StructuralSmokeGitProvenanceInput = {
  eventName: string | null;
  eventPayload: unknown;
  checkoutHeadSha: string;
  explicitFeatureHeadSha: string | null;
  explicitBaseRef: string | null;
  explicitBaseSha: string | null;
  githubSha: string | null;
};

export function resolveStructuralSmokeCheckoutHeadSha(
  githubSha: string | null,
  readGitHead: () => string,
): string {
  if (githubSha) return requireSha(githubSha, "GitHub workflow checkout SHA");
  return requireSha(readGitHead(), "Runtime checkout HEAD");
}

function requireSha(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA_PATTERN.test(value)) {
    throw new Error(`${label} must be an exact 40-character Git commit SHA.`);
  }
  return value.toLowerCase();
}

function requireRef(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty Git ref name.`);
  }
  return value.trim();
}

function asPullRequestEvent(value: unknown): PullRequestEvent | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as PullRequestEvent;
}

export function resolveStructuralSmokeGitProvenance(
  input: StructuralSmokeGitProvenanceInput,
): StructuralSmokeGitProvenance {
  const testedCheckoutHeadSha = requireSha(input.checkoutHeadSha, "Runtime checkout HEAD");
  const eventName = input.eventName?.trim() || "manual";

  if (eventName === "pull_request") {
    const event = asPullRequestEvent(input.eventPayload);
    const eventHeadSha = requireSha(event?.pull_request?.head?.sha, "GitHub pull_request head SHA");
    const eventBaseSha = requireSha(event?.pull_request?.base?.sha, "GitHub pull_request base SHA");
    const eventBaseRef = requireRef(event?.pull_request?.base?.ref, "GitHub pull_request base ref");
    if (input.explicitFeatureHeadSha && input.explicitFeatureHeadSha.toLowerCase() !== eventHeadSha) {
      throw new Error("OPEN_INSTRUMENT_PR_HEAD does not match the GitHub pull_request event head SHA.");
    }
    if (input.explicitBaseSha && input.explicitBaseSha.toLowerCase() !== eventBaseSha) {
      throw new Error("Explicit PR base SHA does not match the GitHub pull_request event base SHA.");
    }
    if (input.explicitBaseRef && input.explicitBaseRef !== eventBaseRef) {
      throw new Error("Explicit PR base ref does not match the GitHub pull_request event base ref.");
    }
    return {
      source: "GITHUB_ACTION_EVENT",
      eventName,
      testedCheckoutHeadSha,
      testedFeatureHeadSha: eventHeadSha,
      verifiedPrBase: { ref: eventBaseRef, sha: eventBaseSha },
    };
  }

  if (input.explicitFeatureHeadSha && input.explicitBaseRef && input.explicitBaseSha) {
    const testedFeatureHeadSha = requireSha(input.explicitFeatureHeadSha, "Explicit tested feature head SHA");
    const baseSha = requireSha(input.explicitBaseSha, "Explicit verified PR base SHA");
    if (input.githubSha && input.githubSha.toLowerCase() !== testedFeatureHeadSha) {
      throw new Error("Explicit tested feature head SHA does not match GITHUB_SHA.");
    }
    return {
      source: "EXPLICIT_VERIFIED_INPUT",
      eventName,
      testedCheckoutHeadSha,
      testedFeatureHeadSha,
      verifiedPrBase: { ref: requireRef(input.explicitBaseRef, "Explicit verified PR base ref"), sha: baseSha },
    };
  }

  if (eventName === "push" && input.githubSha) {
    const testedFeatureHeadSha = requireSha(input.githubSha, "GitHub push SHA");
    if (input.explicitFeatureHeadSha && input.explicitFeatureHeadSha.toLowerCase() !== testedFeatureHeadSha) {
      throw new Error("OPEN_INSTRUMENT_PR_HEAD does not match the GitHub push SHA.");
    }
    return {
      source: "GITHUB_ACTION_EVENT",
      eventName,
      testedCheckoutHeadSha,
      testedFeatureHeadSha,
      verifiedPrBase: null,
    };
  }

  throw new Error("Provide a GitHub pull_request event or explicit verified feature-head and PR-base inputs.");
}

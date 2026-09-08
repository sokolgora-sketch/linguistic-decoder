export type ProposerProviderIdV0_2 =
  | "mock"
  | "mock_reject_ops"
  | "mock_semantic_proposed"
  | "mock_semantic_unknown"
  | "mock_semantic_rejected"
  | "openai_compat";

export type ProposerRequestV0_2 = {
  word: string;
  mode: "strict" | "open";
  systemPrompt: string;
  /**
   * Optional: structured user payload. If omitted, {word, mode} is used.
   * Used by v0.3 loop to send repair failReasons deterministically.
   */
  userPayload?: unknown;
  signal?: AbortSignal;
};

export type ProposerResultV0_2 = {
  provider: ProposerProviderIdV0_2;
  rawText: string;
  meta?: Record<string, unknown>;
};

function env(name: string): string | null {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

async function proposeMock(req: ProposerRequestV0_2): Promise<ProposerResultV0_2> {
  // Deterministic, CI-safe. Produces a minimal Proposal that will pass v0.1 verifier rules.
  const proposal = {
    word: req.word,
    mode: req.mode,
    candidates: [
      { form: req.word, language: "English", opsUsed: [], decomposition: { action: req.word, statement: `mock proposer v0.2 ${req.word}` } },
    ],
  };
  return { provider: "mock", rawText: JSON.stringify(proposal, null, 2), meta: { model: "mock" } };
}

async function proposeMockRejectOps(req: ProposerRequestV0_2): Promise<ProposerResultV0_2> {
  // Deterministic, CI-safe rejected proposal. No network, no secrets.
  // Used only for local/operator smoke of rejected-proposal UI and repair guidance.
  const proposal = {
    word: req.word,
    mode: req.mode,
    candidates: [
      {
        form: req.word,
        language: "English",
        opsUsed: ["E_INSERT_NOT_ALLOWED"],
        decomposition: {
          action: req.word,
          statement: `mock rejected proposer v0.2 ${req.word}`,
        },
      },
    ],
  };
  return { provider: "mock_reject_ops", rawText: JSON.stringify(proposal, null, 2), meta: { model: "mock_reject_ops" } };
}

async function proposeMockSemantic(
  req: ProposerRequestV0_2,
  status: "proposed" | "unknown" | "rejected",
): Promise<ProposerResultV0_2> {
  const context =
    req.userPayload && typeof req.userPayload === "object"
      ? (req.userPayload as Record<string, unknown>).semanticContext
      : null;
  const record =
    context && typeof context === "object"
      ? (context as Record<string, unknown>)
      : {};
  const projection =
    record.doctrineProjection && typeof record.doctrineProjection === "object"
      ? (record.doctrineProjection as Record<string, unknown>)
      : {};
  const projections = Array.isArray(projection.projections)
    ? projection.projections
    : [];
  const firstRole =
    projections[0] && typeof projections[0] === "object"
      ? (projections[0] as Record<string, unknown>).doctrineRole
      : null;

  const proposal = {
    ...(req.userPayload && typeof req.userPayload === "object" &&
    (req.userPayload as Record<string, unknown>).semanticDecisionContractVersion === "open-instrument.semantic-decision-contract.v0_2"
      ? {
          semanticDecision: {
            relationSpecificity:
              status === "proposed"
                ? "structure_specific"
                : status === "unknown"
                  ? "generic_or_unclear"
                  : "conflicting",
          },
        }
      : {}),
    alignmentStatus: status,
    doctrineRoles: status === "proposed" && typeof firstRole === "string" ? [firstRole] : [],
    semanticBridge:
      status === "proposed"
        ? `The selected doctrine role can be tested as a bounded functional relation to the supplied sense through the structural anchor; this remains a reviewable hypothesis, not lexical truth.`
        : null,
    reasonCodes: [
      ...(req.userPayload && typeof req.userPayload === "object" &&
      (req.userPayload as Record<string, unknown>).semanticDecisionContractVersion === "open-instrument.semantic-decision-contract.v0_2"
        ? [
            status === "proposed"
              ? "SEMANTIC_RELATION_STRUCTURE_SPECIFIC"
              : status === "unknown"
                ? "SEMANTIC_RELATION_GENERIC_OR_UNCLEAR"
                : "SEMANTIC_RELATION_CONFLICTING",
          ]
        : []),
      `mock_semantic_${status}`,
    ],
  };

  return {
    provider:
      status === "proposed"
        ? "mock_semantic_proposed"
        : status === "unknown"
          ? "mock_semantic_unknown"
          : "mock_semantic_rejected",
    rawText: JSON.stringify(proposal, null, 2),
    meta: { model: "mock_semantic_fixture" },
  };
}

async function proposeOpenAICompat(req: ProposerRequestV0_2): Promise<ProposerResultV0_2> {
  // Optional provider: OpenAI-compatible Chat Completions API.
  // Requires env:
  // - OPENAI_API_KEY
  // - OPENAI_MODEL
  // Optional:
  // - OPENAI_BASE_URL (default: https://api.openai.com/v1)
  const key = env("OPENAI_API_KEY");
  const model = env("OPENAI_MODEL");
  const baseUrl = env("OPENAI_BASE_URL") ?? "https://api.openai.com/v1";

  if (!key || !model) {
    throw new Error("openai_compat not configured (need OPENAI_API_KEY + OPENAI_MODEL)");
  }

  const userPayload = req.userPayload ?? { word: req.word, mode: req.mode };

  const body = {
    model,
    temperature: 0,
    messages: [
      { role: "system", content: req.systemPrompt },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
  };

  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    signal: req.signal,
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`openai_compat http ${r.status}: ${txt.slice(0, 400)}`);
  }

  const j: any = await r.json();
  const rawText = j?.choices?.[0]?.message?.content ?? "";
  return { provider: "openai_compat", rawText, meta: { model, baseUrl } };
}

export async function runProposerV0_2(
  req: ProposerRequestV0_2,
  provider: ProposerProviderIdV0_2
): Promise<ProposerResultV0_2> {
  if (provider === "openai_compat") return proposeOpenAICompat(req);
  if (provider === "mock_semantic_proposed") return proposeMockSemantic(req, "proposed");
  if (provider === "mock_semantic_unknown") return proposeMockSemantic(req, "unknown");
  if (provider === "mock_semantic_rejected") return proposeMockSemantic(req, "rejected");
  if (provider === "mock_reject_ops") return proposeMockRejectOps(req);
  return proposeMock(req);
}

export function defaultProposerProviderV0_2(): ProposerProviderIdV0_2 {
  const p = env("PROPOSER_PROVIDER");
  return p === "openai_compat" ? "openai_compat" : "mock";
}

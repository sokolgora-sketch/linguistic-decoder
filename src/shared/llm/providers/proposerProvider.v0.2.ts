export type ProposerProviderIdV0_2 = "mock" | "openai_compat";

export type ProposerRequestV0_2 = {
  word: string;
  mode: "strict" | "open";
  systemPrompt: string;
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
      { form: req.word, opsUsed: [], decomposition: { statement: "mock proposer v0.2" } },
    ],
  };
  return { provider: "mock", rawText: JSON.stringify(proposal, null, 2) };
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

  const body = {
    model,
    temperature: 0,
    messages: [
      { role: "system", content: req.systemPrompt },
      { role: "user", content: JSON.stringify({ word: req.word, mode: req.mode }) },
    ],
  };

  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
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
  return proposeMock(req);
}

export function defaultProposerProviderV0_2(): ProposerProviderIdV0_2 {
  const p = env("PROPOSER_PROVIDER");
  return p === "openai_compat" ? "openai_compat" : "mock";
}

import {
  defaultProposerProviderV0_2,
  runProposerV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";

describe("proposerProvider v0.2 real-provider readiness guard", () => {
  const originalEnv = {
    PROPOSER_PROVIDER: process.env.PROPOSER_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  };

  function restoreEnv() {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (typeof value === "undefined") {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }

  beforeEach(() => {
    delete process.env.PROPOSER_PROVIDER;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    delete process.env.OPENAI_BASE_URL;
  });

  afterEach(() => {
    restoreEnv();
  });

  afterAll(() => {
    restoreEnv();
  });

  it("defaults to mock provider when PROPOSER_PROVIDER is unset", () => {
    expect(defaultProposerProviderV0_2()).toBe("mock");
  });

  it("defaults to mock provider for unknown PROPOSER_PROVIDER values", () => {
    process.env.PROPOSER_PROVIDER = "real";
    expect(defaultProposerProviderV0_2()).toBe("mock");
  });

  it("selects openai_compat only when explicitly requested", () => {
    process.env.PROPOSER_PROVIDER = "openai_compat";
    expect(defaultProposerProviderV0_2()).toBe("openai_compat");
  });

  it("refuses openai_compat when required env vars are missing", async () => {
    await expect(
      runProposerV0_2(
        {
          word: "study",
          mode: "strict",
          systemPrompt: "Return JSON only.",
        },
        "openai_compat"
      )
    ).rejects.toThrow(/openai_compat not configured/);
  });

  it("honors OPENAI_BASE_URL for OpenAI-compatible endpoints", async () => {
    process.env.OPENAI_API_KEY = "fake-key";
    process.env.OPENAI_MODEL = "fake-model";
    process.env.OPENAI_BASE_URL = "http://localhost:11434/v1";

    const originalFetch = global.fetch;
    const rawText = '{"word":"study","mode":"strict","candidates":[]}';

    const fetchMock = jest.fn(async (input: unknown, init?: RequestInit) => {
      expect(String(input)).toBe("http://localhost:11434/v1/chat/completions");
      expect(init?.method).toBe("POST");

      const headers = init?.headers as Record<string, string>;
      expect(headers["content-type"]).toBe("application/json");
      expect(headers.authorization).toBe("Bearer fake-key");

      const body = JSON.parse(String(init?.body ?? "{}"));
      expect(body.model).toBe("fake-model");
      expect(body.temperature).toBe(0);
      expect(body.messages).toEqual([
        { role: "system", content: "Return JSON only." },
        { role: "user", content: JSON.stringify({ word: "study", mode: "strict" }) },
      ]);

      return new Response(
        JSON.stringify({
          choices: [{ message: { content: rawText } }],
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    });

    global.fetch = fetchMock as any;

    try {
      const out = await runProposerV0_2(
        {
          word: "study",
          mode: "strict",
          systemPrompt: "Return JSON only.",
        },
        "openai_compat"
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(out.provider).toBe("openai_compat");
      expect(out.rawText).toBe(rawText);
      expect(out.meta).toMatchObject({
        model: "fake-model",
        baseUrl: "http://localhost:11434/v1",
      });
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("keeps mock provider CI-safe and aligned with the Phase 2 verifier contract", async () => {
    const out = await runProposerV0_2(
      {
        word: "study",
        mode: "strict",
        systemPrompt: "Return JSON only.",
      },
      "mock"
    );

    expect(out.provider).toBe("mock");
    expect(out.meta?.model).toBe("mock");

    const parsed = JSON.parse(out.rawText);
    expect(parsed).toMatchObject({
      word: "study",
      mode: "strict",
      candidates: [
        {
          form: "study",
          language: "English",
          opsUsed: [],
          decomposition: {
            action: "study",
            statement: "mock proposer v0.2 study",
          },
        },
      ],
    });
  });
  it("provides deterministic rejected mock output for local rejected-proposal smoke", async () => {
    const out = await runProposerV0_2(
      {
        word: "study",
        mode: "strict",
        systemPrompt: "ignored in mock",
      },
      "mock_reject_ops"
    );

    expect(out.provider).toBe("mock_reject_ops");
    expect(out.meta?.model).toBe("mock_reject_ops");

    const parsed = JSON.parse(out.rawText);
    expect(parsed).toMatchObject({
      word: "study",
      mode: "strict",
      candidates: [
        {
          form: "study",
          language: "English",
          opsUsed: ["E_INSERT_NOT_ALLOWED"],
          decomposition: {
            action: "study",
          },
        },
      ],
    });
  });

});

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
      expect(body).not.toHaveProperty("max_tokens");
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
      expect(out.usage).toBeUndefined();
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("maps explicit maximumOutputTokens to OpenAI-compatible max_tokens", async () => {
    process.env.OPENAI_API_KEY = "fake-key";
    process.env.OPENAI_MODEL = "fake-model";
    process.env.OPENAI_BASE_URL = "http://localhost:11434/v1";

    const originalFetch = global.fetch;
    const rawText = '{"word":"study","mode":"strict","candidates":[]}';

    const fetchMock = jest.fn(async (_input: unknown, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}"));

      expect(body.model).toBe("fake-model");
      expect(body.temperature).toBe(0);
      expect(body.max_tokens).toBe(128);

      return new Response(
        JSON.stringify({
          choices: [{ message: { content: rawText } }],
          usage: { prompt_tokens: 7, completion_tokens: 11, total_tokens: 18 },
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
          maximumOutputTokens: 128,
        },
        "openai_compat"
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(out.rawText).toBe(rawText);
      expect(out.usage).toEqual({ promptTokens: 7, completionTokens: 11, totalTokens: 18 });
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("keeps absent or malformed provider usage unknown without inferring counts", async () => {
    process.env.OPENAI_API_KEY = "fake-key";
    process.env.OPENAI_MODEL = "fake-model";
    process.env.OPENAI_BASE_URL = "http://localhost:11434/v1";

    const originalFetch = global.fetch;
    const rawText = '{"word":"study","mode":"strict","candidates":[]}';
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ choices: [{ message: { content: rawText } }], usage: { prompt_tokens: 7, completion_tokens: 11 } }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ choices: [{ message: { content: rawText } }], usage: { prompt_tokens: 7, completion_tokens: -1, total_tokens: 6 } }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      );
    global.fetch = fetchMock as any;

    try {
      const absent = await runProposerV0_2({ word: "study", mode: "strict", systemPrompt: "Return JSON only." }, "openai_compat");
      const malformed = await runProposerV0_2({ word: "study", mode: "strict", systemPrompt: "Return JSON only." }, "openai_compat");

      expect(absent.usage).toBeUndefined();
      expect(malformed.usage).toBeUndefined();
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("rejects invalid explicit maximumOutputTokens before provider fetch", async () => {
    process.env.OPENAI_API_KEY = "fake-key";
    process.env.OPENAI_MODEL = "fake-model";
    process.env.OPENAI_BASE_URL = "http://localhost:11434/v1";

    const originalFetch = global.fetch;
    const fetchMock = jest.fn();
    global.fetch = fetchMock as any;

    try {
      await expect(
        runProposerV0_2(
          {
            word: "study",
            mode: "strict",
            systemPrompt: "Return JSON only.",
            maximumOutputTokens: 0,
          },
          "openai_compat"
        )
      ).rejects.toThrow(/positive safe integer/);

      expect(fetchMock).not.toHaveBeenCalled();
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

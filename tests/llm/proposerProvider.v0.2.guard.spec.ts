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
});

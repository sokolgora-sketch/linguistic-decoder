import { join, resolve } from "node:path";

import { GET, POST } from "@/app/api/analyze-v1/route";
import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
  lookupEnglishTargetSenseServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";

jest.mock("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1", () => {
  const actual = jest.requireActual("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1");
  return {
    ...actual,
    buildMotivationEngineDiscoveryServerOnlyV0_1: jest.fn(),
    lookupEnglishTargetSenseServerOnlyV0_1: jest.fn(),
  };
});

const FIXTURE_ROOT = resolve("tests/fixtures/openInstrument/englishKaikkiDeterministicIndexProvider.v0_1");
const realServerBuilder = jest.requireActual<{
  buildMotivationEngineDiscoveryServerOnlyV0_1: typeof buildMotivationEngineDiscoveryServerOnlyV0_1;
}>("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1").buildMotivationEngineDiscoveryServerOnlyV0_1;
const realTargetSenseLookup = jest.requireActual<{
  lookupEnglishTargetSenseServerOnlyV0_1: typeof lookupEnglishTargetSenseServerOnlyV0_1;
}>("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1").lookupEnglishTargetSenseServerOnlyV0_1;
const serverBuilderMock = jest.mocked(buildMotivationEngineDiscoveryServerOnlyV0_1);
const targetSenseLookupMock = jest.mocked(lookupEnglishTargetSenseServerOnlyV0_1);
const ENV_KEYS = [
  "OPEN_INSTRUMENT_AUTO_CARRIER",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "OPENAI_API_KEY",
  "OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER",
  "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER",
  "OPEN_INSTRUMENT_PUBLIC_BETA_MODE",
] as const;

function snapshotEnv(): Record<string, string | undefined> {
  return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
}

function restoreEnv(snapshot: Record<string, string | undefined>): void {
  for (const key of ENV_KEYS) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

async function fixtureProvider() {
  return createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1({
    fixtureRoot: FIXTURE_ROOT,
    sourcePath: join(FIXTURE_ROOT, "source.jsonl"),
    indexPath: FIXTURE_ROOT,
    adaptRecord: (input) => adaptEnglishKaikkiJsonlRecordV0_1({
      ...input,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    }),
  });
}

async function post(body: Record<string, unknown>) {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }));
  return { status: response.status, json: await response.json() as Record<string, any> };
}

async function get(params: Record<string, string>) {
  const url = new URL("http://localhost/api/analyze-v1");
  url.searchParams.set("word", "apple");
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await GET(new Request(url));
  return { status: response.status, json: await response.json() as Record<string, any> };
}

describe("/api/analyze-v1 native lexical target-sense binding v0.1", () => {
  const originalFetch = global.fetch;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    originalEnv = snapshotEnv();
    process.env.OPEN_INSTRUMENT_AUTO_CARRIER = "1";
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER = "openai_compat";
    process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER = "openai_compat";
    delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
    global.fetch = jest.fn(() => {
      throw new Error("provider network execution must remain disabled");
    }) as any;
    serverBuilderMock.mockImplementation(async (input) =>
      realServerBuilder({ ...input, provider: await fixtureProvider() }),
    );
    targetSenseLookupMock.mockImplementation(async (input) =>
      realTargetSenseLookup(input, await fixtureProvider()),
    );
  });

  afterEach(() => {
    restoreEnv(originalEnv);
    global.fetch = originalFetch;
    serverBuilderMock.mockReset();
  });

  it("performs local exact lookup with providerExecution disabled and preserves all unselected alternatives", async () => {
    const result = await post({ word: "apple", language: "en", providerExecution: "disabled" });

    expect(result.status).toBe(200);
    expect(targetSenseLookupMock).toHaveBeenCalledTimes(1);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.json.nativeLexicalTargetSensesV0_1).toMatchObject({
      inputForm: "apple",
      lookupStatus: "MATCHES_FOUND",
      sourceStatus: "research_candidate",
      selection: { status: "NOT_REQUESTED", selectedSenseId: null },
      noAutomaticWinner: true,
      userDecisionPosture: "user_decides",
    });
    expect(result.json.nativeLexicalTargetSensesV0_1.alternatives).toHaveLength(3);
    expect(result.json.nativeLexicalTargetSensesV0_1.alternatives.map((sense: any) => sense.partOfSpeech))
      .toEqual(["noun", "noun", "verb"]);
    expect(result.json.nativeLexicalTargetSensesV0_1.alternatives.every((sense: any) =>
      sense.sourceStatus === "research_candidate",
    )).toBe(true);
    expect(result.json.nativeLexicalTargetSensesV0_1.alternatives[0].sourceRecord.entryLocator)
      .toMatch(/^jsonl:\/\/record\//u);
  });

  it("binds an explicitly selected exact source sense and gloss into the existing interpretation input", async () => {
    const provider = await fixtureProvider();
    const lookup = await provider.queryWithMetrics("apple");
    const selected = lookup.sourceRecords?.[0]?.senses[0];
    if (!selected?.glosses?.[0]) throw new Error("fixture sense/gloss unavailable");

    const result = await post({
      word: "apple",
      language: "en",
      providerExecution: "disabled",
      targetLexicalSenseId: selected.senseId,
      targetLexicalGloss: selected.glosses[0],
    });

    expect(result.status).toBe(200);
    expect(result.json.nativeLexicalTargetSensesV0_1.selection).toMatchObject({
      status: "BOUND",
      selectedSenseId: selected.senseId,
      selectedGloss: selected.glosses[0],
      sourceStatus: "research_candidate",
    });
    expect(result.json.functionalMotivationInterpretationV0_3.input.targetSense).toEqual({
      id: selected.senseId,
      label: selected.glosses[0],
      authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE",
    });
    expect(result.json.nativeLexicalTargetSensesV0_1.alternatives).toHaveLength(3);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("keeps a selected multi-gloss sense unresolved and rejects a sense from another word", async () => {
    const provider = await fixtureProvider();
    const appleLookup = await provider.queryWithMetrics("apple");
    const bananaLookup = await provider.queryWithMetrics("banana");
    const appleSense = appleLookup.sourceRecords?.[0]?.senses[0];
    const bananaSenseId = bananaLookup.sourceRecords?.[0]?.senses[0]?.senseId;
    if (!appleSense || !bananaSenseId) throw new Error("fixture sense unavailable");

    const unresolved = await post({
      word: "apple",
      language: "en",
      providerExecution: "disabled",
      targetLexicalSenseId: appleSense.senseId,
    });
    expect(unresolved.status).toBe(200);
    expect(unresolved.json.nativeLexicalTargetSensesV0_1.selection.status)
      .toBe("SENSE_SELECTED_GLOSS_UNRESOLVED");
    expect(unresolved.json.functionalMotivationInterpretationV0_3.input.targetSense).toBeNull();

    const wrongWord = await post({
      word: "apple",
      language: "en",
      providerExecution: "disabled",
      targetLexicalSenseId: bananaSenseId,
    });
    expect(wrongWord.status).toBe(400);
    expect(wrongWord.json.reason).toBe("TARGET_LEXICAL_SENSE_NOT_FOUND");
  });

  it("preserves legacy user-proposed target senses and keeps xyz as a Null lexical control", async () => {
    const legacy = await post({
      word: "apple",
      language: "en",
      providerExecution: "disabled",
      targetSenseId: "user-sense",
      targetSenseLabel: "a user-proposed gloss",
    });
    expect(legacy.status).toBe(200);
    expect(legacy.json.functionalMotivationInterpretationV0_3.input.targetSense).toMatchObject({
      id: "user-sense",
      label: "a user-proposed gloss",
    });

    const unknown = await post({ word: "xyz", language: "en", providerExecution: "disabled" });
    expect(unknown.status).toBe(200);
    expect(unknown.json.nativeLexicalTargetSensesV0_1).toMatchObject({
      lookupStatus: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      alternatives: [],
      selection: { status: "NOT_REQUESTED" },
    });
    expect(unknown.json.functionalMotivationInterpretationV0_3.input.targetSense).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects conflicting legacy selectors, unmatched glosses and duplicate GET selectors", async () => {
    const provider = await fixtureProvider();
    const exact = await provider.queryWithMetrics("apple");
    const exactSenseId = exact.sourceRecords?.[0]?.senses[0]?.senseId;
    if (!exactSenseId) throw new Error("fixture source sense unavailable");

    const conflict = await post({
      word: "apple",
      providerExecution: "disabled",
      targetSenseLabel: "user meaning",
      targetLexicalSenseId: "some-source-sense",
    });
    expect(conflict.status).toBe(400);
    expect(conflict.json.reason).toBe("CONFLICTING_TARGET_SENSE_SELECTION");

    const wrongGloss = await post({
      word: "apple",
      language: "en",
      providerExecution: "disabled",
      targetLexicalSenseId: exactSenseId,
      targetLexicalGloss: "not a source gloss",
    });
    expect(wrongGloss.status).toBe(400);
    expect(wrongGloss.json.reason).toBe("TARGET_LEXICAL_GLOSS_NOT_FOUND");

    const duplicateUrl = new URL("http://localhost/api/analyze-v1");
    duplicateUrl.searchParams.set("word", "apple");
    duplicateUrl.searchParams.append("targetLexicalSenseId", "one");
    duplicateUrl.searchParams.append("targetLexicalSenseId", "two");
    const duplicateResponse = await GET(new Request(duplicateUrl));
    expect(duplicateResponse.status).toBe(400);
    expect(await duplicateResponse.json()).toMatchObject({ reason: "DUPLICATE_TARGET_LEXICAL_SENSE_ID" });
  });
});

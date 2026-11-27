import { existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { POST } from "@/app/api/analyze-v2/route";
import {
  ALBANET_SOURCE_PATH_ENV_V0_1,
} from "@/shared/openInstrument/albanetSourceIdentity.v0_1";
import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

const pinnedSourcesAvailable = Boolean(
  process.env[ALBANET_SOURCE_PATH_ENV_V0_1] &&
  process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1] &&
  existsSync(process.env[ALBANET_SOURCE_PATH_ENV_V0_1] ?? "") &&
  existsSync(process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1] ?? ""),
);
const itWithPinnedSources = pinnedSourcesAvailable ? it : it.skip;

async function analyze(word: string) {
  const response = await POST(new Request("http://localhost/api/analyze-v2", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      word,
      language: "sq",
      alphabet: "albanian",
      providerExecution: "disabled",
    }),
  }));
  expect(response.status).toBe(200);
  return response.json();
}

describe("native separative reasoning with pinned AlbaNet", () => {
  beforeAll(() => {
    process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = "deterministic_only";
    jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected network or provider call"));
  });

  afterAll(() => {
    jest.restoreAllMocks();
    delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
  });

  itWithPinnedSources("analyzes NDARJE without a Kaikki primary, preserves nine AlbaNet senses, and transfers to veçoj", async () => {
    const firstPayload = await analyze("NDARJE");
    const firstReading = firstPayload.motivationDiscoveryV0_2.albanianLexicalReading;
    expect(firstPayload.motivationDiscoveryV0_2.exactLexicalSourceStatus.status).not.toBe("MATCHES_FOUND");
    expect(firstReading.status).toBe("NULL");
    expect(firstReading.primarySourceFact).toBeNull();
    const ndarje = firstReading.nativeSeparativeEventToState;
    expect(ndarje).toMatchObject({
      operation: "SEPARATIVE_EVENT_TO_STATE",
      inputForm: "NDARJE",
      albanetSource: {
        sourceFamilyId: "albanet-omw-sq-v0.1",
        revision: "406bf83b3c507a3d1f26e88252d5d66893fd36bf",
        sha256: "5a3c72ec0681fdd1b217c134b04fcb7a03b595163111dc06ce7f9333f70d1ba4",
        bytes: 932373,
      },
      alternatives: expect.arrayContaining([
        expect.objectContaining({ target: expect.objectContaining({ synsetId: "00383606-n" }) }),
      ]),
      interpretationDecisionPolicy: { automaticInterpretationSelection: "DISABLED" },
      userDecisionPosture: "user_decides",
    });
    expect(ndarje.alternatives).toHaveLength(9);
    const separationSense = ndarje.alternatives.find((alternative: { target: { synsetId: string } }) =>
      alternative.target.synsetId === "00383606-n",
    );
    expect(separationSense).toMatchObject({
      compatibility: "COMPATIBLE_FUNCTION_FAMILY",
      target: {
        definitions: ["veprimi i veçimit apo i shqitjes"],
        entryLocator: expect.stringContaining("synset=00383606-n;lemma=ndarje"),
      },
      action: { text: "to split, cut, divide", status: "SOURCE_REPORTED" },
      patient: { description: { status: "INFERRED", text: "an initially undivided whole" } },
      changedState: { status: "INFERRED", text: "distinct parts or separated entities" },
    });
    const secondPayload = await analyze("NDARJE");
    expect(secondPayload.motivationDiscoveryV0_2.albanianLexicalReading.nativeSeparativeEventToState)
      .toEqual(ndarje);

    const transferPayload = await analyze("veçoj");
    const transferReading = transferPayload.motivationDiscoveryV0_2.albanianLexicalReading;
    expect(transferPayload.motivationDiscoveryV0_2.exactLexicalSourceStatus.status).toBe("MATCHES_FOUND");
    const transfer = transferReading.nativeSeparativeEventToState;
    expect(transfer?.alternatives).toEqual(expect.arrayContaining([
      expect.objectContaining({
        compatibility: "COMPATIBLE_FUNCTION_FAMILY",
        target: expect.objectContaining({
          synsetId: "02031158-v",
          definitions: ["të ndash në pjesë ose veçon"],
        }),
      }),
    ]));
    expect((await analyze("veçoj")).motivationDiscoveryV0_2.albanianLexicalReading.nativeSeparativeEventToState)
      .toEqual(transfer);

    const vm = adaptAnalysisToTelemetryVM(firstPayload);
    const markup = renderToStaticMarkup(createElement(InstrumentPanel, { vm }));
    expect(markup).toContain('data-testid="primary-albanian-native-separative"');
    expect(markup).toContain("Action · source-reported");
    expect(markup).toContain("Affected entity · inferred");
    expect(markup).toContain("Changed state · inferred");
    expect(markup).toContain("veprimi i veçimit apo i shqitjes");
    expect(markup).toContain("synset=00383606-n;lemma=ndarje");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

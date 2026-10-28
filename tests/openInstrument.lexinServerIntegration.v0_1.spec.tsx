import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  createLexinSourceFamilyAdapterV0_1,
  LEXIN_SOURCE_FAMILY_ID_V0_1,
  parseLexinXmlV0_1,
  type LexinSourceLoadResultV0_1,
} from "@/shared/openInstrument/lexinSourceFamilyAdapter.v0_1";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { render, screen } from "@testing-library/react";

const FIXTURE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Dictionary BaseLang="Swedish" TargetLang="Albanian" Version="2010-07-07">
  <Word ID="20" MatchingID="21" Type="verb" Value="studera" Variant="" VariantID="22">
    <BaseLang><Meaning>lära sig genom studier</Meaning></BaseLang>
    <TargetLang><Translation>di</Translation><Example ID="1">di në shkollë</Example></TargetLang>
  </Word>
</Dictionary>`;

const parsedFixture = parseLexinXmlV0_1(FIXTURE_XML);
if (!parsedFixture.ok) throw new Error("Lexin integration fixture did not parse");

let mockLexinSourceLoadResultV0_1: LexinSourceLoadResultV0_1 | null = null;

jest.mock("@/shared/openInstrument/lexinSourceFamilyAdapter.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/openInstrument/lexinSourceFamilyAdapter.v0_1",
  );
  return {
    ...actual,
    getProductionLexinSourceV0_1: jest.fn(async () => {
      if (mockLexinSourceLoadResultV0_1 === null) {
        throw new Error("LEXIN_TEST_FIXTURE_NOT_CONFIGURED");
      }
      return mockLexinSourceLoadResultV0_1;
    }),
  };
});

function unavailableEnglishProvider() {
  return {
    providerId: "open-instrument.english-kaikki-server-only-exact-index-provider.v0.1" as const,
    runtimeBoundary: "SERVER_ONLY" as const,
    query: async () => ({
      status: "PROVIDER_CONFIGURATION_FAILURE" as const,
      reasonCode: "PROVIDER_CONFIGURATION_FAILURE" as const,
      queryForm: null,
      records: Object.freeze([]) as readonly [],
    }),
    queryWithMetrics: async () => ({
      result: {
        status: "PROVIDER_CONFIGURATION_FAILURE" as const,
        reasonCode: "PROVIDER_CONFIGURATION_FAILURE" as const,
        queryForm: null,
        records: Object.freeze([]) as readonly [],
      },
      metrics: {
        directoryBytesRead: 0,
        postingsBytesRead: 0,
        sourceBytesRead: 0,
        sourceRecordsRecovered: 0,
        adapterRecordsEmitted: 0,
      },
    }),
  };
}

describe("Lexin server/API/UI integration v0.1", () => {
  it("projects descriptive Lexin evidence through the API and existing UI without functional authority", async () => {
    mockLexinSourceLoadResultV0_1 = {
      status: "READY",
      sourcePath: "/private/tmp/open-instrument-lexin-fixture/swe_alb.xml",
      records: parsedFixture.records,
      adapter: createLexinSourceFamilyAdapterV0_1(parsedFixture.records),
    };
    try {
      const response = await GET(
        new Request("http://localhost/api/analyze-v1?word=study&mode=strict&alphabet=albanian&language=sq"),
      );
      expect(response.status).toBe(200);
      const body = await response.json() as {
        motivationDiscoveryV0_1?: {
          candidates?: readonly Readonly<{
            candidateForm: string;
            candidateGloss: string;
            candidateVoicePath: readonly string[];
            functionalInterpretation: Readonly<{ status: string }>;
            sourceFact: Readonly<{
              sourceFamilyId?: string;
              sourceDetails?: Readonly<{ sourceIdentity?: string; definitions: readonly string[] }>;
            }>;
          }>[];
        };
      };
      const candidate = body.motivationDiscoveryV0_1?.candidates?.find(
        (item) => item.sourceFact.sourceFamilyId === LEXIN_SOURCE_FAMILY_ID_V0_1,
      );
      expect(candidate).toMatchObject({
        candidateForm: "di",
        candidateGloss: expect.stringContaining("Swedish headword: studera"),
        candidateVoicePath: [],
        functionalInterpretation: { status: "UNKNOWN_OR_NULL" },
        sourceFact: {
          sourceFamilyId: LEXIN_SOURCE_FAMILY_ID_V0_1,
          sourceDetails: {
            sourceIdentity: expect.stringContaining("word=20"),
            definitions: [
              "Swedish headword: studera",
              "Swedish meaning: lära sig genom studier",
            ],
          },
        },
      });

      const vm = adaptAnalysisToTelemetryVM(body);
      render(<MotivationDiscoveryCardV0_1 discovery={vm.motivationDiscoveryV0_1} />);
      expect(screen.getAllByText("di").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Swedish headword: studera/).length).toBeGreaterThan(0);
      expect(screen.getByText(new RegExp(`Source family: ${LEXIN_SOURCE_FAMILY_ID_V0_1}`))).toBeInTheDocument();
      expect(screen.getByText(/TargetLang=Albanian/)).toBeInTheDocument();
      expect(screen.getByText(/CC BY 4\.0/)).toBeInTheDocument();
      expect(screen.getAllByText("Functional motivation unknown").length).toBeGreaterThan(0);
    } finally {
      mockLexinSourceLoadResultV0_1 = null;
    }
  });

  it("keeps the direct server composition additive and functional interpretation Null", async () => {
    const analysis = enginePayloadToAnalysisResult(await runAnalysisDeterministic("study", {
      mode: "strict",
      alphabet: "albanian",
    }));
    const heart = buildHeartInstrumentV1("study");
    const lexinAdapter = createLexinSourceFamilyAdapterV0_1(parsedFixture.records);
    const result = await import("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1").then(
      ({ buildMotivationEngineDiscoveryServerOnlyV0_1 }) => buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "study",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis,
        heart,
        provider: unavailableEnglishProvider(),
        albanetSourceAdapter: null,
        lexinSourceAdapter: lexinAdapter,
      }),
    );
    expect(result.discovery.candidates.some((candidate) => candidate.sourceFact.sourceFamilyId === LEXIN_SOURCE_FAMILY_ID_V0_1)).toBe(true);
    expect(result.discovery.candidates
      .filter((candidate) => candidate.sourceFact.sourceFamilyId === LEXIN_SOURCE_FAMILY_ID_V0_1)
      .every((candidate) => candidate.functionalInterpretation.status === "UNKNOWN_OR_NULL"))
      .toBe(true);
  });
});

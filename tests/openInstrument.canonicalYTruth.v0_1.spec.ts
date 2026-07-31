import { NextRequest } from "next/server";
import { GET } from "@/app/api/analyze-v1/route";
import { pickHeartPrimaryPathForRootMap } from "@/shared/heartPrimaryPathForRootMap.v0.1.2";

async function analyze(
  word: string,
  alphabet = "auto",
): Promise<any> {
  const url =
    "http://localhost/api/analyze-v1" +
    `?word=${encodeURIComponent(word)}` +
    "&mode=strict" +
    `&alphabet=${encodeURIComponent(alphabet)}`;

  const response = await GET(new NextRequest(url));

  expect(response.status).toBe(200);

  return response.json();
}

function pathOf(result: any): string[] {
  return Array.isArray(result?.primaryPath?.voicePath)
    ? result.primaryPath.voicePath
    : [];
}

function hasAutomaticYToI(result: any): boolean {
  const steps = Array.isArray(
    result?.evidence?.normalizationSteps,
  )
    ? result.evidence.normalizationSteps
    : [];

  return steps.some(
    (step: any) =>
      step?.op === "vowel_normalize" &&
      String(step?.from ?? "").includes("Y") &&
      String(step?.to ?? "").includes("I"),
  );
}

describe("Open Instrument canonical Y truth v0.1", () => {
  it.each([
    ["y", ["Y"]],
    ["my", ["Y"]],
    ["sky", ["Y"]],
    ["fly", ["Y"]],
    ["study", ["U", "Y"]],
    ["mystery", ["Y", "E", "Y"]],
  ])(
    "%s preserves canonical Y in the authoritative Heart path",
    async (word, expectedPath) => {
      const out = await analyze(word);

      expect(pathOf(out)).toEqual(expectedPath);
      expect(out?.heart?.math7?.primary?.vowels).toEqual(
        expectedPath,
      );
      expect(out?.heart?.math7?.primary?.basis).toBe(
        expectedPath.join(""),
      );
      expect(out?.evidence?.surfaceVowelsRaw).toEqual(
        expectedPath,
      );
      expect(out?.evidence?.surfaceVowels).toEqual(
        expectedPath,
      );
      expect(out?.evidence?.vowelPath).toEqual(
        expectedPath,
      );
      expect(hasAutomaticYToI(out)).toBe(false);
      expect(out?.evidence?.signals).toContain(
        `base_raw=${expectedPath.join("")}`,
      );
      expect(out?.evidence?.signals).toContain(
        `base_norm=${expectedPath.join("")}`,
      );
    },
  );

  it.each([
    ["xyz", ["Y"]],
    ["yellow", ["Y", "E", "O"]],
    ["yol", ["Y", "O"]],
    ["dij", ["I"]],
  ])(
    "%s keeps its existing canonical path",
    async (word, expectedPath) => {
      const out = await analyze(word);

      expect(pathOf(out)).toEqual(expectedPath);
      expect(out?.heart?.math7?.primary?.vowels).toEqual(
        expectedPath,
      );
    },
  );

  it.each([
    "auto",
    "latin",
    "albanian",
    "turkish",
  ])(
    "alphabet=%s does not rewrite canonical Y",
    async (alphabet) => {
      const standalone = await analyze("y", alphabet);
      const study = await analyze("study", alphabet);

      expect(pathOf(standalone)).toEqual(["Y"]);
      expect(pathOf(study)).toEqual(["U", "Y"]);
      expect(hasAutomaticYToI(standalone)).toBe(false);
      expect(hasAutomaticYToI(study)).toBe(false);
    },
  );

  it("passes the upstream Heart path to RootMap unchanged", () => {
    expect(
      pickHeartPrimaryPathForRootMap({
        word: "study",
        mode: "strict",
        primaryPath: {
          voicePath: ["U", "Y"],
        },
      }),
    ).toEqual(["U", "Y"]);

    expect(
      pickHeartPrimaryPathForRootMap({
        word: "mystery",
        mode: "strict",
        primaryPath: {
          voicePath: ["Y", "E", "Y"],
        },
      }),
    ).toEqual(["Y", "E", "Y"]);

    expect(
      pickHeartPrimaryPathForRootMap({
        word: "y",
        mode: "strict",
        primaryPath: {
          voicePath: ["Y"],
        },
      }),
    ).toEqual(["Y"]);
  });

  it("keeps study DI evidence separate from canonical U-Y", async () => {
    const out = await analyze("study");

    expect(pathOf(out)).toEqual(["U", "Y"]);

    const tokens = Array.isArray(
      out?.rootMap?.tokens,
    )
      ? out.rootMap.tokens.map(
          (token: any) => token?.token,
        )
      : [];

    const keys = Array.isArray(
      out?.rootMap?.keys,
    )
      ? out.rootMap.keys
      : [];

    expect(tokens).toEqual(["SHTU", "DI"]);
    expect(tokens).not.toContain("DA");

    const diKey = keys.find(
      (key: any) => key?.token === "DI",
    );

    expect(diKey?.ops).toEqual(["y_to_i"]);

    expect(
      Array.isArray(diKey?.evidence)
        ? diKey.evidence.join("\n")
        : "",
    ).toContain(
      "reviewed functional free-operator evidence",
    );

    const hypotheses = Array.isArray(
      out?.deepRoot?.hypotheses,
    )
      ? out.deepRoot.hypotheses
      : [];

    const diHypothesis = hypotheses.find(
      (hypothesis: any) =>
        Array.isArray(hypothesis?.protoRoots) &&
        hypothesis.protoRoots.includes("DI"),
    );

    const diCarrier = Array.isArray(
      diHypothesis?.carriers,
    )
      ? diHypothesis.carriers.find(
          (carrier: any) =>
            carrier?.protoRootId === "DI",
        )
      : null;

    expect(diCarrier?.ops).toContain("y_to_i");

    const candidatePaths = Array.isArray(
      out?.candidates,
    )
      ? out.candidates
          .map(
            (candidate: any) =>
              candidate?.vowelPath,
          )
          .filter(Boolean)
      : [];

    expect(candidatePaths.length).toBeGreaterThan(0);

    expect(
      candidatePaths.every(
        (path: string) => path === "U-I",
      ),
    ).toBe(true);
  });
});

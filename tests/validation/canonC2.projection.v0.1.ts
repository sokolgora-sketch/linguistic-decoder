type AnyObj = Record<string, any>;

function stableSort<T>(arr: T[], key: (x: T) => string): T[] {
  return [...arr].sort((a, b) => key(a).localeCompare(key(b)));
}

function pick(obj: any, paths: string[]): any {
  for (const p of paths) {
    const v = p.split(".").reduce((acc: any, k) => (acc == null ? acc : acc[k]), obj);
    if (v !== undefined) return v;
  }
  return undefined;
}

export type CanonC2ProjectionV01 = {
  word: string;
  norm: string | null;
  engineVersion: string | null;

  orthographyVoices: string[];
  phoneticVoices: string[];

  heartPrimaryVowelPath: string | null;
  deepRootFunctionalVowelPath: string | null;

  candidates: Array<{
    id: string | null;
    language: string | null;
    form: string | null;
    status: string | null;
    vowelPath: string | null;
    deepRootHeartGateStatus: string | null;
    deepRootHeartGateReasonCodes: string[];
  }>;
};

export function projectForCanonC2V01(raw: AnyObj, fallbackWord: string): CanonC2ProjectionV01 {
  const word = String(pick(raw, ["word", "input.word"]) ?? fallbackWord);
  const norm = pick(raw, ["norm", "normalized", "input.norm", "readout.word.norm"]) ?? null;

  const engineVersion =
    pick(raw, ["engineVersion", "meta.engineVersion", "analysis.engineVersion", "readout.engineVersion"]) ?? null;

  const orthographyVoices =
    (pick(raw, ["orthography.voices", "readout.orthography.voices"]) as any[]) ?? [];

  const phoneticVoices =
    (pick(raw, ["phonetic.voices", "readout.phonetic.voices"]) as any[]) ?? [];

  const heartPrimaryVowelPath =
    pick(raw, [
      "heartPrimaryPath",
      "heartPrimaryPath.vowelPath",
      "heart.math7.primary.vowelPath",
      "analysis.heart.math7.primary.vowelPath",
      "readout.heart.math7.primary.vowelPath"
    ]) ?? null;

  const deepRootFunctionalVowelPath =
    pick(raw, [
      "deepRoot.functional.vowelPath",
      "analysis.deepRoot.functional.vowelPath",
      "readout.deepRoot.functional.vowelPath",
      "deepRoot.vowelPath",
      "deepRoot.vowel_path"
    ]) ?? null;

  const rawCandidates: AnyObj[] =
    (pick(raw, ["originClaim.candidates", "candidates", "analysis.originClaim.candidates", "readout.originClaim.candidates"]) as any[]) ?? [];

  const candidates = stableSort(
    rawCandidates.map((c) => {
      const gate = pick(c, ["deepRootHeartGate", "deepRoot.heartGate", "gate.deepRootHeart"]) ?? null;
      const gateStatus = gate?.status ?? null;
      const gateReasonCodes: string[] = Array.isArray((gate as any)?.reasonCodes)
  ? (((gate as any).reasonCodes as any[]) ?? []).map((x) => String(x))
  : [];

      return {
        id: c?.id ?? null,
        language: c?.language ?? null,
        form: c?.form ?? null,
        status: c?.status ?? null,
        vowelPath: c?.vowelPath ?? c?.vowel_path ?? null,
        deepRootHeartGateStatus: gateStatus,
        deepRootHeartGateReasonCodes: [...gateReasonCodes].sort(),
      };
    }),
    (x) => `${x.language ?? ""}::${x.form ?? ""}::${x.id ?? ""}`
  );

  return {
    word,
    norm: norm == null ? null : String(norm),
    engineVersion: engineVersion == null ? null : String(engineVersion),
    orthographyVoices: Array.isArray(orthographyVoices) ? orthographyVoices.map(String) : [],
    phoneticVoices: Array.isArray(phoneticVoices) ? phoneticVoices.map(String) : [],
    heartPrimaryVowelPath: heartPrimaryVowelPath == null ? null : String(heartPrimaryVowelPath),
    deepRootFunctionalVowelPath: deepRootFunctionalVowelPath == null ? null : String(deepRootFunctionalVowelPath),
    candidates,
  };
}

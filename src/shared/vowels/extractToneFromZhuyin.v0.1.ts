export type ZhuyinToneV0_1 = 0 | 1 | 2 | 3 | 4 | 5;

export type ToneFromZhuyinV0_1 = {
  tone: ZhuyinToneV0_1;
  mark: "ˊ" | "ˇ" | "ˋ" | "˙" | null;
  normalized: string;
};

const RE_ZHUYIN = /[\u3105-\u312D]/u;
const RE_TONE = /[ˊˇˋ˙]/gu;

export function extractToneFromZhuyinV0_1(input: unknown): ToneFromZhuyinV0_1 {
  const s = String(input ?? "").trim();
  if (!s) return { tone: 0, mark: null, normalized: "" };

  const has5 = s.includes("˙");
  const has4 = s.includes("ˋ");
  const has3 = s.includes("ˇ");
  const has2 = s.includes("ˊ");

  let tone: ZhuyinToneV0_1 = 0;
  let mark: ToneFromZhuyinV0_1["mark"] = null;

  if (has5) { tone = 5; mark = "˙"; }
  else if (has4) { tone = 4; mark = "ˋ"; }
  else if (has3) { tone = 3; mark = "ˇ"; }
  else if (has2) { tone = 2; mark = "ˊ"; }
  else if (RE_ZHUYIN.test(s)) { tone = 1; mark = null; }
  else { tone = 0; mark = null; }

  const normalized = s.replace(RE_TONE, "").trim();
  return { tone, mark, normalized };
}

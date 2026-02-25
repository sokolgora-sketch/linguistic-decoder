import { extractCarrierVoicesFromZhuyinV0_1 } from "@/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1";
import { extractToneFromZhuyinV0_1, ToneFromZhuyinV0_1, ZhuyinToneV0_1 } from "@/shared/vowels/extractToneFromZhuyin.v0.1";

export type ZhuyinSignalV0_1 = {
  tone: ZhuyinToneV0_1;
  mark: ToneFromZhuyinV0_1["mark"];
  normalized: string;          // tone marks removed
  voices: ("A" | "E" | "I" | "O" | "U" | "Y" | "Ë")[];
  primary: ("A" | "E" | "I" | "O" | "U" | "Y" | "Ë") | "NONE";
};

export function extractZhuyinSignalV0_1(input: unknown): ZhuyinSignalV0_1 {
  const toneOut = extractToneFromZhuyinV0_1(input);
  const vowOut = extractCarrierVoicesFromZhuyinV0_1(toneOut.normalized);

  const voices = Array.isArray((vowOut as any)?.voices) ? ((vowOut as any).voices as ZhuyinSignalV0_1["voices"]) : [];
  const primary = ((vowOut as any)?.primary ?? "NONE") as ZhuyinSignalV0_1["primary"];

  return {
    tone: toneOut.tone,
    mark: toneOut.mark,
    normalized: toneOut.normalized,
    voices,
    primary,
  };
}

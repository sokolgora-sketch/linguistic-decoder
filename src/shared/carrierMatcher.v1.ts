import type { ProtoCarrier } from "./protoRoots.v1";
import { PROTO_ROOTS_V1 } from "./protoRoots.v1";

export type AllowedOp =
  | "exact"
  | "vowel_swap"
  | "s_to_sh"
  | "sh_to_s"
  | "g_to_gj"
  | "gj_to_g"
  | "final_a_to_e"
  | "final_e_to_a"
  | "optional_h_removed"
  | "optional_h_added"
  | "optional_j_removed"
  | "optional_j_added";

export type ReasonCode =
  | "EXACT"
  | "VOWEL_SWAP"
  | "S_SH"
  | "G_GJ"
  | "FINAL_A_E"
  | "OPTIONAL_H"
  | "OPTIONAL_J";

export type MatchRules = {
  allowVowelSwaps?: boolean; // default true
  allowSSh?: boolean;        // default true
  allowGGj?: boolean;        // default true
  allowFinalAE?: boolean;    // default true
  allowOptionalH?: boolean;  // default false
  allowOptionalJ?: boolean;  // default false
  langAllowList?: string[];  // if set, only carriers in list
  maxMatches?: number;       // default 50
};

export type CarrierMatch = {
  protoRootId: string;
  protoGloss: string;
  roleHint?: string;
  carrier: ProtoCarrier;
  ops: AllowedOp[];
  reasonCodes: ReasonCode[];
  cost: number;     // lower is better
  isExact: boolean;
};

export function matchSegmentToProtoRoots(
  segmentRaw: string,
  rules: MatchRules = {}
): CarrierMatch[] {
  const segment = norm(segmentRaw);
  if (!segment) return [];

  const r: Required<MatchRules> = {
    allowVowelSwaps: rules.allowVowelSwaps ?? true,
    allowSSh: rules.allowSSh ?? true,
    allowGGj: rules.allowGGj ?? true,
    allowFinalAE: rules.allowFinalAE ?? true,
    allowOptionalH: rules.allowOptionalH ?? false,
    allowOptionalJ: rules.allowOptionalJ ?? false,
    langAllowList: rules.langAllowList ?? [],
    maxMatches: rules.maxMatches ?? 50,
  };

  const matches: CarrierMatch[] = [];

  for (const root of PROTO_ROOTS_V1) {
    for (const carrier of root.carriers) {
      if (r.langAllowList.length > 0 && !r.langAllowList.includes(carrier.lang)) continue;

      const res = tryMatch(segment, norm(carrier.form), r);
      if (!res) continue;

      matches.push({
        protoRootId: root.id,
        protoGloss: root.gloss,
        roleHint: root.roleHint,
        carrier,
        ops: res.ops,
        reasonCodes: res.reasonCodes,
        cost: res.cost,
        isExact: res.isExact,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.isExact !== b.isExact) return a.isExact ? -1 : 1;
    if (a.cost !== b.cost) return a.cost - b.cost;
    if (a.protoRootId !== b.protoRootId) return a.protoRootId.localeCompare(b.protoRootId);
    const al = a.carrier.lang ?? "";
    const bl = b.carrier.lang ?? "";
    if (al !== bl) return al.localeCompare(bl);
    const af = a.carrier.form ?? "";
    const bf = b.carrier.form ?? "";
    return af.localeCompare(bf);
  });

  return matches.slice(0, r.maxMatches);
}

function tryMatch(
  segment: string,
  carrier: string,
  rules: Required<MatchRules>
): { ops: AllowedOp[]; reasonCodes: ReasonCode[]; cost: number; isExact: boolean } | null {
  if (segment === carrier) {
    return { ops: ["exact"], reasonCodes: ["EXACT"], cost: 0, isExact: true };
  }

  const attempts: Array<{
    ops: AllowedOp[];
    reasonCodes: ReasonCode[];
    cost: number;
    segment: string;
  }> = [{ ops: [], reasonCodes: [], cost: 0, segment }];

  if (rules.allowOptionalH) {
    attempts.push({
      ops: ["optional_h_removed"],
      reasonCodes: ["OPTIONAL_H"],
      cost: 3,
      segment: segment.replace(/h/g, ""),
    });
  }

  if (rules.allowOptionalJ) {
    attempts.push({
      ops: ["optional_j_removed"],
      reasonCodes: ["OPTIONAL_J"],
      cost: 3,
      segment: segment.replace(/j/g, ""),
    });
  }

  if (rules.allowSSh) {
    attempts.push({
      ops: ["s_to_sh"],
      reasonCodes: ["S_SH"],
      cost: 1,
      segment: segment.replace(/^s/, "sh"),
    });
    attempts.push({
      ops: ["sh_to_s"],
      reasonCodes: ["S_SH"],
      cost: 1,
      segment: segment.replace(/^sh/, "s"),
    });
  }

  if (rules.allowGGj) {
    attempts.push({
      ops: ["g_to_gj"],
      reasonCodes: ["G_GJ"],
      cost: 1,
      segment: segment.replace(/^g/, "gj"),
    });
    attempts.push({
      ops: ["gj_to_g"],
      reasonCodes: ["G_GJ"],
      cost: 1,
      segment: segment.replace(/^gj/, "g"),
    });
  }

  if (rules.allowFinalAE) {
    attempts.push({
      ops: ["final_a_to_e"],
      reasonCodes: ["FINAL_A_E"],
      cost: 1,
      segment: segment.replace(/a$/, "e"),
    });
    attempts.push({
      ops: ["final_e_to_a"],
      reasonCodes: ["FINAL_A_E"],
      cost: 1,
      segment: segment.replace(/e$/, "a"),
    });
  }

  for (const a of attempts) {
    if (a.segment === carrier) {
      return finalizeMatch(a.ops, a.reasonCodes, a.cost, false);
    }

    if (!rules.allowVowelSwaps) continue;
    if (a.segment.length !== carrier.length) continue;

    const vs = vowelSwapOps(a.segment, carrier);
    if (!vs) continue;

    return finalizeMatch(
      [...a.ops, "vowel_swap"],
      [...a.reasonCodes, "VOWEL_SWAP"],
      a.cost + vs.cost,
      false
    );
  }

  return null;
}

function finalizeMatch(
  ops: AllowedOp[],
  reasonCodes: ReasonCode[],
  cost: number,
  isExact: boolean
) {
  const opsOut: AllowedOp[] = [];
  const seenOps = new Set<string>();
  for (const op of ops) {
    if (seenOps.has(op)) continue;
    seenOps.add(op);
    opsOut.push(op);
  }

  const reasonsOut: ReasonCode[] = [];
  const seenR = new Set<string>();
  for (const rc of reasonCodes) {
    if (seenR.has(rc)) continue;
    seenR.add(rc);
    reasonsOut.push(rc);
  }

  return { ops: opsOut, reasonCodes: reasonsOut, cost, isExact };
}

function vowelSwapOps(a: string, b: string): { cost: number } | null {
  const A = a.split("");
  const B = b.split("");
  let changes = 0;

  for (let i = 0; i < A.length; i++) {
    const x = A[i];
    const y = B[i];
    if (x === y) continue;
    if (!isSevenVowel(x) || !isSevenVowel(y)) return null;
    changes += 1;
  }

  return { cost: changes * 2 };
}

function isSevenVowel(ch: string): boolean {
  const c = ch.toLowerCase();
  return c === "a" || c === "e" || c === "i" || c === "o" || c === "u" || c === "y";
}

function norm(s: string): string {
  return String(s ?? "").trim().toLowerCase().replace(/ë/g, "e");
}

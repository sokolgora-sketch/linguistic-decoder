import type { DeepRootHeartGateV01 } from "./deepRootHeartGate.v0.1";

export type DeepRootHeartGatePolicyActionV01 = "allow" | "warn" | "block";

export type DeepRootHeartGatePolicyDecisionV01 = {
  action: DeepRootHeartGatePolicyActionV01;
  reasonCodes: string[];
};

/**
 * DeepRoot–Heart Gate → OriginClaim policy (v0.1)
 *
 * This policy matches existing OriginClaim behavior:
 * - strict mode: medium+ confidence requires gate alignment (anything non-aligned caps)
 * - loose mode: gate is a soft warning only
 *
 * Meaning of "block" here is "cap medium+ to weak" (NOT candidate rejection).
 */
export function decideDeepRootHeartGatePolicyV01(args: {
  strictMediumPlus: boolean;
  gate: DeepRootHeartGateV01 | null | undefined;
}): DeepRootHeartGatePolicyDecisionV01 {
  const g: any = args.gate as any;

  const status: string =
    g && typeof g === "object" && typeof g.status === "string" && g.status.length ? g.status : "missing";

  const reasonCodes: string[] =
    g && typeof g === "object" && Array.isArray(g.reasonCodes)
      ? g.reasonCodes.filter((x: any) => typeof x === "string" && x.length)
      : [];

  if (status === "aligned") return { action: "allow", reasonCodes: [] };

  // strict: anything non-aligned caps medium+ (block)
  if (args.strictMediumPlus) return { action: "block", reasonCodes };

  // loose: warning only
  return { action: "warn", reasonCodes };
}

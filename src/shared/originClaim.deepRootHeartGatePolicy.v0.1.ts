import type { DeepRootHeartGateV01 } from "./deepRootHeartGate.v0.1";

export type DeepRootHeartGatePolicyActionV01 = "allow" | "warn" | "block";

export type DeepRootHeartGatePolicyDecisionV01 = {
  action: DeepRootHeartGatePolicyActionV01;
  reasonCodes: string[];
};

/**
 * DeepRoot–Heart Gate → OriginClaim policy (v0.1)
 *
 * v0.1 rule:
 * - aligned      => allow
 * - misaligned   => strict: block (cap medium+ to weak), loose: warn
 * - insufficient/missing => warn (never hard-cap on missing DeepRoot)
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

  if (status === "misaligned") {
    return args.strictMediumPlus ? { action: "block", reasonCodes } : { action: "warn", reasonCodes };
  }

  return { action: "warn", reasonCodes };
}

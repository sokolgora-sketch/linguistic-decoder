import type { CanonCaseV0_1, CanonStatusV0_1 } from "./proposerCanon.types.v0.1";
import type { ProposerRequestV0_2, ProposerResultV0_2, ProposerProviderIdV0_2 } from "../../src/shared/llm/providers/proposerProvider.v0.2";
import type { LoopResultV0_3 } from "../../src/shared/orchestrator/proposeLoop.v0.3";
import { proposeLoopV0_3 } from "../../src/shared/orchestrator/proposeLoop.v0.3";

export async function runCanonCaseV0_1(c: CanonCaseV0_1): Promise<LoopResultV0_3> {
  let i = 0;

  const runProposer = async (_req: ProposerRequestV0_2, provider: ProposerProviderIdV0_2): Promise<ProposerResultV0_2> => {
    const raw = c.attempts[i++] ?? c.attempts[c.attempts.length - 1] ?? "";
    if (raw === "__THROW__") throw new Error("canon: forced LLM_ERROR");
    return { provider, rawText: raw, meta: { model: "canon-mock" } } as any;
  };

  const maxAttempts = typeof c.input.maxAttempts === "number" ? c.input.maxAttempts : Math.max(1, c.attempts.length);

  return proposeLoopV0_3(
    {
      word: c.input.word,
      mode: c.input.mode,
      maxAttempts,
      provider: "mock",
    },
    { runProposer, cache: new Map() }
  );
}

function uniq(xs: readonly string[]): string[] {
  return Array.from(new Set(xs));
}

export function assertCanonCaseV0_1(c: CanonCaseV0_1, out: LoopResultV0_3): void {
  const exp = c.expect;

  if (out.status !== exp.status) {
    throw new Error(`[${c.id}] status mismatch: expected ${exp.status} got ${out.status}`);
  }

  if (exp.traceStatuses) {
    const got = out.trace.map((t) => t.status as CanonStatusV0_1);
    const want = Array.from(exp.traceStatuses);
    const same =
      got.length === want.length && got.every((v, idx) => v === want[idx]);

    if (!same) {
      throw new Error(`[${c.id}] traceStatuses mismatch:\nwant=${JSON.stringify(want)}\ngot=${JSON.stringify(got)}`);
    }
  }

  if (exp.mustIncludeFailCheckIds?.length) {
    const gotIds = uniq(
      out.trace.flatMap((t) => (t.failReasons ?? []).map((f) => String(f.checkId ?? ""))).filter(Boolean)
    );
    for (const need of exp.mustIncludeFailCheckIds) {
      if (!gotIds.includes(need)) {
        throw new Error(`[${c.id}] missing fail checkId ${need}. got=${JSON.stringify(gotIds)}`);
      }
    }
  }

  if (exp.status === "PASS") {
    const n = out.final?.acceptedCandidateForms?.length ?? 0;
    const min = exp.minAccepted ?? 1;
    if (n < min) {
      throw new Error(`[${c.id}] PASS but acceptedCandidateForms=${n} (< ${min})`);
    }
  }
}

export function simplifyLoopResultV0_1(out: LoopResultV0_3) {
  return {
    status: out.status,
    word: out.word,
    mode: out.mode,
    meta: out.meta,
    final: out.final ? { acceptedCandidateForms: out.final.acceptedCandidateForms } : null,
    trace: out.trace.map((t) => ({
      attempt: t.attempt,
      status: t.status,
      parseOk: t.parseOk,
      failReasons: (t.failReasons ?? []).map((f) => ({
        form: f.form,
        checkId: f.checkId,
        reason: f.reason,
      })),
    })),
  };
}

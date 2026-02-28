import { NextResponse } from "next/server";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";

export const runtime = "nodejs";

type ApiOk = {
  ok: true;
  report: ReturnType<typeof scoreEvalRunBundleV0_1>;
  md: string;
};

type ApiErr = {
  ok: false;
  code:
    | "BAD_JSON"
    | "PAYLOAD_TOO_LARGE"
    | "INVALID_RUN"
    | "INTERNAL_ERROR";
  message: string;
};

function err(code: ApiErr["code"], message: string, status = 400) {
  return NextResponse.json(
    { ok: false, code, message } satisfies ApiErr,
    {
      status,
      headers: {
        "cache-control": "no-store",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();

    // Minimal abuse gate (v0.1): hard payload cap
    // (UI sends only a run bundle; no baselines; no huge logs.)
    const MAX_BYTES = 300_000; // 300 KB
    if (raw.length > MAX_BYTES) {
      return err("PAYLOAD_TOO_LARGE", `Payload too large (max ${MAX_BYTES} bytes).`, 413);
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return err("BAD_JSON", "Body must be valid JSON.", 400);
    }

    let run;
    try {
      run = parseEvalRunBundleV0_1(json);
    } catch (e) {
      return err("INVALID_RUN", (e as Error)?.message ?? "Invalid eval run bundle.", 400);
    }

    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
    const md = renderEvalReportMdV0_1(report);

    return NextResponse.json(
      { ok: true, report, md } satisfies ApiOk,
      {
        status: 200,
        headers: {
          "cache-control": "no-store",
        },
      }
    );
  } catch (e) {
    return err("INTERNAL_ERROR", (e as Error)?.message ?? "Unknown error.", 500);
  }
}

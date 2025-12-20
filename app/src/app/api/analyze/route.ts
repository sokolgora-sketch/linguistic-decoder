import { NextResponse } from "next/server";

// Prevent build-time static evaluation / pre-render behavior.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyObj = Record<string, unknown>;

function pickRunner(mod: AnyObj): ((input: AnyObj) => Promise<unknown>) | null {
  const cand =
    (mod as AnyObj)["runAnalysis"] ??
    (mod as AnyObj)["analyze"] ??
    (mod as AnyObj)["default"];
  return typeof cand === "function" ? (cand as any) : null;
}

export async function POST(req: Request) {
  const payload: AnyObj = await req.json().catch(() => ({}));

  try {
    // Dynamic import avoids build-time execution of Firebase/history modules.
    const mod = (await import("@/lib/runAnalysis")) as AnyObj;
    const run = pickRunner(mod);

    if (!run) {
      return NextResponse.json(
        { ok: false, error: "No runAnalysis/analyze/default export found in @/lib/runAnalysis" },
        { status: 500 }
      );
    }

    const result = await run(payload);
    return NextResponse.json(result);
  } catch (err: any) {
    const message = err?.message ?? String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

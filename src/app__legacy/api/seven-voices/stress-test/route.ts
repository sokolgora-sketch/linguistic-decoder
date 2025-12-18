import { NextResponse } from "next/server";
import { runStressHarnessV1, CANON_WORDS_V1 } from "@/engine/stressHarness.v1";
import type { StressHarnessItem } from "@/shared/engineShape";
import { runSevenVoicesStressTest } from "@/functions/sevenVoicesStressTest";

type Body = {
  words?: string[];
  items?: StressHarnessItem[];
};

function normalizeItems(body: Body | null): StressHarnessItem[] {
  if (body?.items?.length) {
    return body.items
      .map((it) => ({
        word: String((it as any)?.word ?? "").trim(),
        label: typeof (it as any)?.label === "string" ? (it as any).label : "custom",
      }))
      .filter((it) => it.word.length > 0);
  }

  if (body?.words?.length) {
    return body.words
      .map((w) => ({ word: String(w ?? "").trim(), label: "custom" }))
      .filter((it) => it.word.length > 0);
  }

  return CANON_WORDS_V1;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const items = normalizeItems(body);

    const rows = runStressHarnessV1(items, runSevenVoicesStressTest);

    return NextResponse.json({
      ok: true,
      count: rows.length,
      rows,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

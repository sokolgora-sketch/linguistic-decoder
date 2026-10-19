import { NextResponse } from "next/server";

const SHARED_STATE_DISABLED_RESPONSE = {
  ok: false,
  error: "Shared Evals state is disabled.",
  reason: "EVALS_SHARED_STATE_DISABLED",
} as const;

function sharedStateDisabledResponse(): NextResponse {
  return NextResponse.json(SHARED_STATE_DISABLED_RESPONSE, {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  return sharedStateDisabledResponse();
}

export async function POST(req: Request) {
  void req;
  return sharedStateDisabledResponse();
}

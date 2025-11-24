// src/app/api/firestore-test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "firestore-test route is alive",
    time: Date.now(),
  });
}

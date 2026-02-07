import { NextResponse } from "next/server";
import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = verifyProposalV0_1(body as any);

  if (!result.word || !Array.isArray((body as any)?.candidates)) {
    return NextResponse.json(
      { error: "Invalid Proposal: requires { word: string, candidates: [] }" },
      { status: 400 }
    );
  }

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

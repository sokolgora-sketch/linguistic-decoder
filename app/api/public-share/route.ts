import { NextResponse } from 'next/server';
import { buildPublicSharePayload } from '@/lib/publicSharePayload';
import { savePublicShare } from '@/lib/publicShareStore';
import { getShareId } from '@/lib/getShareId';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';

type PublicShareRequestBody = {
  result?: AnalyzeWordResultUI;
};

export async function POST(req: Request) {
  let body: PublicShareRequestBody;

  // Safely parse JSON body
  try {
    body = (await req.json()) as PublicShareRequestBody;
  } catch {
    return NextResponse.json({ error: 'Missing result' }, { status: 400 });
  }

  // Validate payload
  if (!body?.result) {
    return NextResponse.json({ error: 'Missing result' }, { status: 400 });
  }

  // 1) Generate a new share id
  const id = getShareId();

  // 2) Build the base payload from the analysis result
  const base = buildPublicSharePayload(body.result);

  // 3) Attach the id to the record that goes into the store
  const record = { ...base, id };

  // 4) Persist
  await savePublicShare(record);

  // 5) Return the id to the client
  return NextResponse.json({ id }, { status: 201 });
}

import { NextResponse } from 'next/server';
import { buildPublicSharePayload } from '@/lib/publicSharePayload';
import { savePublicShare } from '@/lib/publicShareStore';
import { getShareId } from '@/lib/getShareId';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body.result as AnalyzeWordResultUI;

    if (!result || typeof result.word !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const id = getShareId();
    const record = buildPublicSharePayload(result, id);

    await savePublicShare(record);

    return NextResponse.json({ id: record.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import { POST } from '../app/api/public-share/route';
import { savePublicShare } from '@/lib/publicShareStore';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';
import { NextResponse } from 'next/server';

// Mock NextResponse so route.ts doesn't pull in the real edge runtime
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ ...init, body })),
  },
}));

jest.mock('@/lib/publicShareStore', () => ({
  savePublicShare: jest.fn(),
}));

jest.mock('@/lib/getShareId', () => ({
  getShareId: jest.fn(() => 'share-123'),
}));

describe('POST /api/public-share', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a public share and returns an id', async () => {
    const fakeResult = {
      word: 'study',
      engineMeta: { engineLabel: 'Test Engine' },
      heartSummary: { primary: 'summary' },
    } as unknown as AnalyzeWordResultUI;

    const req = {
      json: async () => ({ result: fakeResult }),
    } as any;

    await POST(req);

    expect(savePublicShare).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'share-123', word: 'study' }),
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 'share-123' }, { status: 201 });
  });

  it('returns 400 for invalid payload', async () => {
    const req = {
      json: async () => ({}), // missing result
    } as any;

    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Invalid payload' }, { status: 400 });
  });
});

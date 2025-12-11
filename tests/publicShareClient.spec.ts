import { createPublicShare } from '@/lib/publicShareClient';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';

describe('createPublicShare', () => {
  const fakeResult = {
    word: 'study',
  } as unknown as AnalyzeWordResultUI;

  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  it('posts the result and returns the id on success', async () => {
    (global as any).fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'share-123' }),
    });

    const id = await createPublicShare(fakeResult);

    expect((global as any).fetch).toHaveBeenCalledWith(
      '/api/public-share',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }),
    );

    expect(id).toBe('share-123');
  });

  it('throws when the response is not ok', async () => {
    (global as any).fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(createPublicShare(fakeResult)).rejects.toThrow(
      'Public share failed with status 500',
    );
  });

  it('throws when id is missing in the response', async () => {
    (global as any).fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await expect(createPublicShare(fakeResult)).rejects.toThrow(
      'Public share response missing id',
    );
  });
});

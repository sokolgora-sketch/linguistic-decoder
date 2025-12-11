import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShareSnippetPublicButton from '@/components/ShareSnippetPublicButton';
import { createPublicShare } from '@/lib/publicShareClient';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';

jest.mock('@/lib/publicShareClient');

const writeTextMock = jest.fn();

describe('ShareSnippetPublicButton', () => {
  const mockCreatePublicShare = createPublicShare as jest.MockedFunction<typeof createPublicShare>;
  const fakeResult = { word: 'test' } as unknown as AnalyzeWordResultUI;

  beforeEach(() => {
    jest.clearAllMocks();

    // Provide a fake clipboard implementation for jsdom
    Object.assign(global.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    } as any);
  });

  it('calls createPublicShare and copies link', async () => {
    mockCreatePublicShare.mockResolvedValue('abc123');
    render(<ShareSnippetPublicButton result={fakeResult} />);

    const button = screen.getByRole('button', { name: /share public link/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreatePublicShare).toHaveBeenCalledWith(fakeResult);
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining('/share/abc123'),
      );
    });

    expect(await screen.findByText(/copied link/i)).toBeInTheDocument();
  });
});

/**
 * v1.1+ suite (quarantined for ZË-RO v1 minimal release)
 * This suite targets advanced “Heart summary / Engine meta” UI.
 * Re-enable after v1 ships.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ZroChatPage from "@/components/ZroChatPage";
jest.mock('lucide-react', () => ({
  __esModule: true,
  Sparkles: () => null,
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe.skip('Advanced Results Toggle', () => {
  beforeEach(() => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            word: 'test',
            engineMeta: {
              engineLabel: 'SevenVoices Core',
              build: '0.1.0',
              modeLabel: 'strict',
              alphabetLabel: 'auto',
            },
            primaryPath: {
              voicePath: 'U → I',
              levelPath: '1 → 1',
              ringPath: '1 → 1',
            },
          }),
      })
    );
  });

  it('hides advanced details by default and shows them after toggle', async () => {
    render(<ZroChatPage />);

    const input = screen.getByPlaceholderText('study');
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(analyzeButton);

    await screen.findByText('Heart summary');

    expect(screen.queryByText('Engine meta')).toBeNull();

    const toggleButton = screen.getByText(/Show advanced details/i);
    fireEvent.click(toggleButton);

    expect(await screen.findByText('Engine meta')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByText('Engine meta')).toBeNull();
  });
});

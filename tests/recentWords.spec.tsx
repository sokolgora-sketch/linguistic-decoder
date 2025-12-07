import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../app/page';
import '@testing-library/jest-dom';

jest.mock("lucide-react", () => ({
  __esModule: true,
  // Only the icons we actually use in the UI
  Sparkles: () => null,
}));

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('RecentWords', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            word: 'alpha',
            primaryPath: {
              voicePath: 'U → I',
              levelPath: '1 → 1',
              ringPath: '1 → 1',
            },
            raw: { engineVersion: 'test-v1' }, // for share snippet
            engineMeta: { versionLine: 'test-v1' }, // for meta card
          }),
      })
    ) as jest.Mock;
  });

  it('clicking a history item should update the input field', async () => {
    render(<Page />);

    // 1. Get elements
    const input = screen.getByPlaceholderText('study');
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });

    // 2. Set input to 'alpha' and submit to create a history item
    fireEvent.change(input, { target: { value: 'alpha' } });
    fireEvent.click(analyzeButton);

    // 3. Wait for the history table to appear and contain the word 'alpha'.
    const historyWordCell = await screen.findByRole('cell', { name: 'alpha' });
    expect(historyWordCell).toBeInTheDocument();

    // 4. Change the input to something else to ensure our click has an effect
    fireEvent.change(input, { target: { value: 'beta' } });
    expect(input).toHaveValue('beta');

    // 5. Find the table row containing 'alpha' and click it.
    const historyRow = historyWordCell.closest('tr');
    expect(historyRow).not.toBeNull();
    if (historyRow) {
        fireEvent.click(historyRow);
    }

    // 6. Assert that the input value is now 'alpha' again
    expect(input).toHaveValue('alpha');
  });
});

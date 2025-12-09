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
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('CopyJsonButton', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            word: 'test-word',
            primaryPath: {
              voicePath: 'U → I',
              levelPath: '1 → 1',
              ringPath: '1 → 1',
            },
            raw: {
              word: 'test-word',
              engineVersion: 'test-v1',
            },
            engineMeta: { versionLine: 'test-v1' }, // for meta card
          }),
      })
    ) as jest.Mock;

    // Mock navigator.clipboard.writeText to return a resolved promise
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  it('clicking the button should copy the raw JSON to the clipboard', async () => {
    render(<Page />);

    // 1. Get elements
    const input = screen.getByPlaceholderText('study');
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });

    // 2. Set input and submit to create a result
    fireEvent.change(input, { target: { value: 'test-word' } });
    fireEvent.click(analyzeButton);

    // 3. Wait for the dev button to appear
    const copyJsonButton = await screen.findByRole('button', {
      name: /Copy JSON \(dev\)/i,
    });
    expect(copyJsonButton).toBeInTheDocument();

    // 4. Click the button
    fireEvent.click(copyJsonButton);

    // 5. Assert that writeText was called with the correct JSON
    const expectedJson = JSON.stringify(
      {
        word: 'test-word',
        engineVersion: 'test-v1',
      },
      null,
      2
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedJson);
  });
});

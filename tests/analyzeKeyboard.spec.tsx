import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ZroChatPage from "@/components/ZroChatPage";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ word: 'test' }),
  } as Response)
);

describe('Analyze keyboard interactions', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    (global.fetch as jest.Mock).mockClear();
  });

  it('triggers analysis with Enter key', async () => {
    render(<ZroChatPage />);
    const input = screen.getByLabelText('Word');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('shows validation on Enter with empty input and does not call fetch', async () => {
    render(<ZroChatPage />);
    const input = screen.getByLabelText('Word');
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Type a word before analyzing.')).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('disables button and prevents extra calls while analyzing', async () => {
    render(<ZroChatPage />);
    const input = screen.getByLabelText('Word');
    const analyzeButton = screen.getByText('Analyze');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(analyzeButton);

    // While loading
    expect(analyzeButton).toBeDisabled();
    expect(analyzeButton).toHaveAttribute('aria-busy', 'true');

    // Try to trigger again
    fireEvent.click(analyzeButton);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // After loading, the button should be re-enabled
    await waitFor(() => {
        expect(analyzeButton).not.toBeDisabled();
    });
    expect(analyzeButton).toHaveAttribute('aria-busy', 'false');
  });
});

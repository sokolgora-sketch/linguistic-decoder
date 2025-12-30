import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComparePanel from '../src/components/ComparePanel';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
);

describe('Compare keyboard interactions', () => {
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

  it('triggers comparison with Enter key in an input', async () => {
    render(<ComparePanel />);
    const leftInput = screen.getByPlaceholderText('Left word');
    const rightInput = screen.getByPlaceholderText('Right word');

    fireEvent.change(leftInput, { target: { value: 'word1' } });
    fireEvent.change(rightInput, { target: { value: 'word2' } });

    fireEvent.keyDown(leftInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      // one for each word
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('shows validation on Enter with one empty input and does not call fetch', async () => {
    render(<ComparePanel />);
    const leftInput = screen.getByPlaceholderText('Left word');

    fireEvent.change(leftInput, { target: { value: '' } });
    fireEvent.keyDown(leftInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Enter both words before comparing.')).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('disables button and prevents extra calls while comparing', async () => {
    render(<ComparePanel />);
    const leftInput = screen.getByPlaceholderText('Left word');
    const rightInput = screen.getByPlaceholderText('Right word');
    const compareButton = screen.getByText('Compare');

    fireEvent.change(leftInput, { target: { value: 'word1' } });
    fireEvent.change(rightInput, { target: { value: 'word2' } });
    fireEvent.click(compareButton);

    // While loading
    expect(compareButton).toBeDisabled();
    expect(compareButton).toHaveAttribute('aria-busy', 'true');

    // Try to trigger again
    fireEvent.click(compareButton);
    fireEvent.keyDown(leftInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // After loading, the button should be re-enabled
    await waitFor(() => {
        expect(compareButton).not.toBeDisabled();
    });

    expect(compareButton).toHaveAttribute('aria-busy', 'false');
  });
});

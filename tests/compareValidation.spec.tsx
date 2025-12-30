import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComparePanel from '../src/components/ComparePanel';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
);

describe('ComparePanel validation', () => {
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

  it('shows a validation message and does not call fetch if one or both inputs are empty', async () => {
    render(<ComparePanel />);

    const leftInput = screen.getByPlaceholderText('Left word');
    const rightInput = screen.getByPlaceholderText('Right word');

    fireEvent.change(leftInput, { target: { value: '' } });
    fireEvent.change(rightInput, { target: { value: '' } });

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    await waitFor(() => {
      expect(screen.getByText('Enter both words before comparing.')).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('clears the validation message and calls fetch when both inputs are filled', async () => {
    render(<ComparePanel />);

    const leftInput = screen.getByPlaceholderText('Left word');
    const rightInput = screen.getByPlaceholderText('Right word');

    fireEvent.change(leftInput, { target: { value: 'word1' } });
    fireEvent.change(rightInput, { target: { value: 'word2' } });

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    await waitFor(() => {
      expect(screen.queryByText('Enter both words before comparing.')).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalled();
  });
});

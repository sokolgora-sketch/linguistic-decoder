import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../app/page';

global.fetch = jest.fn();

describe('Analyze validation', () => {
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

  it('shows a validation message and does not call fetch when the input is empty', async () => {
    render(<Page />);

    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Type a word before analyzing.')).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

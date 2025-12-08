import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComparePanel from '../src/components/ComparePanel';

describe('ComparePanel error handling', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('shows an error message on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<ComparePanel />);

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('shows an error message on non-OK HTTP status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Server error details'),
    } as Response);

    render(<ComparePanel />);

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});

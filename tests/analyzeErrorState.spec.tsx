import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../app/page';

describe('Analyze form error handling', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // Suppress console.error messages
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('shows an engine error message on 500', async () => {
    // Mock fetch to return a 500 error
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<Page />);

    const input = screen.getByPlaceholderText('study');
    const button = screen.getByText('Analyze');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/engine error/i);
    expect(errorMessage).toBeInTheDocument();

    // Check that the input is still editable
    fireEvent.change(input, { target: { value: 'another test' } });
    expect(input).toHaveValue('another test');
  });

  it('shows a network error message on fetch reject', async () => {
    // Mock fetch to reject the promise
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down'));

    render(<Page />);

    const input = screen.getByPlaceholderText('study');
    const button = screen.getByText('Analyze');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/network error/i);
    expect(errorMessage).toBeInTheDocument();

    // Check that the input is still editable
    fireEvent.change(input, { target: { value: 'another test' } });
    expect(input).toHaveValue('another test');
  });
});

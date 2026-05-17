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

  it('renders the branded Open Instrument console frame', () => {
    render(<ZroChatPage />);

    expect(screen.getByAltText('ZË-RO')).toBeInTheDocument();
    expect(screen.getByText('instrument · open')).toBeInTheDocument();
    expect(screen.getByText('Deterministic word inspection')).toBeInTheDocument();
    expect(screen.getByText('Open Instrument ready')).toBeInTheDocument();
    expect(screen.getByText('No origin proof')).toBeInTheDocument();
    expect(screen.getByLabelText('Word')).toBeInTheDocument();
    expect(screen.getByLabelText('IPA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeInTheDocument();
  });

  it('renders debug telemetry as a console surface when debug query is enabled', async () => {
    window.history.pushState({}, '', '/chat?debug=1');

    render(<ZroChatPage />);

    expect(await screen.findByRole('region', { name: 'Open Instrument debug telemetry' })).toBeInTheDocument();
    expect(screen.getByText('debug telemetry')).toBeInTheDocument();
    expect(screen.getByText('messages=1')).toBeInTheDocument();
    expect(screen.getByText('latestInstrumentPayload=NO')).toBeInTheDocument();

    window.history.pushState({}, '', '/chat');
  });

  it('replaces the empty state after a result payload arrives', async () => {
    render(<ZroChatPage />);
    expect(screen.getByText('Open Instrument ready')).toBeInTheDocument();

    const input = screen.getByLabelText('Word');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    await waitFor(() => {
      expect(screen.queryByText('Open Instrument ready')).not.toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
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

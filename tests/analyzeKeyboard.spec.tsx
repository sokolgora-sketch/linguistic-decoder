import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ZroChatPage from "@/components/ZroChatPage";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ word: 'test' }),
  } as Response)
);

function countAnalyzeV1Fetches(): number {
  return (global.fetch as jest.Mock).mock.calls.filter(
    ([input]) => String(input).includes('/api/analyze-v1?')
  ).length;
}

const SELECTOR_RESULT = {
  word: 'study',
  mode: 'open',
  alphabet: 'latin',
  engineVersion: '0.2.0-symbolic',
  primaryPath: { voicePath: ['U', 'I'], ringPath: [1, 1], levelPath: [], ops: [] },
  evidence: {},
  candidates: [],
  rootMap: { tokens: [], keys: [], carriers: [], spans: [], composedMeaning: '' },
  originClaim: {
    policy: 'no_single_winner',
    gatesActive: false,
    summary: { confidence: 'weak', note: 'selector test payload' },
    candidates: [],
  },
};

describe('Analyze keyboard interactions', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: jest.fn(),
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the branded Open Instrument result-first frame', () => {
    render(<ZroChatPage />);

    expect(screen.getByAltText('ZË-RO')).toBeInTheDocument();
    expect(screen.getByText('instrument · open')).toBeInTheDocument();
    expect(screen.getByText('Functional motivation for one word')).toBeInTheDocument();
    expect(screen.getByText('Analyze one word')).toBeInTheDocument();
    expect(screen.queryByText('No origin proof')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Word')).toBeInTheDocument();
    expect(screen.getByLabelText('IPA')).toBeInTheDocument();
    expect(screen.getByLabelText('Intended sense')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeInTheDocument();
  });

  it('exposes strict and auto selector defaults while preserving the default request', async () => {
    render(<ZroChatPage />);

    expect(screen.getByRole('combobox', { name: 'Analysis mode' })).toHaveTextContent('Strict');
    expect(screen.getByRole('combobox', { name: 'Alphabet profile' })).toHaveTextContent('Auto');

    fireEvent.change(screen.getByLabelText('Word'), { target: { value: 'study' } });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    await waitFor(() => {
      expect(countAnalyzeV1Fetches()).toBe(1);
    });

    const [request] = (global.fetch as jest.Mock).mock.calls.find(([input]) =>
      String(input).includes('/api/analyze-v1?'),
    ) ?? [];
    const requestUrl = new URL(String(request), 'http://localhost');
    expect(requestUrl.searchParams.get('mode')).toBe('strict');
    expect(requestUrl.searchParams.has('alphabet')).toBe(false);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Analyze' })).not.toBeDisabled();
    });
  });

  it('sends selected mode and alphabet values to Analyze V1', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => SELECTOR_RESULT,
    } as any);

    render(<ZroChatPage />);

    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Analysis mode' }), { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Open' }));
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Alphabet profile' }), { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Latin' }));
    fireEvent.change(screen.getByLabelText('Word'), { target: { value: 'study' } });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    await waitFor(() => {
      expect(countAnalyzeV1Fetches()).toBe(1);
    });

    const [request] = (global.fetch as jest.Mock).mock.calls.find(([input]) =>
      String(input).includes('/api/analyze-v1?'),
    ) ?? [];
    const requestUrl = new URL(String(request), 'http://localhost');
    expect(requestUrl.searchParams.get('mode')).toBe('open');
    expect(requestUrl.searchParams.get('alphabet')).toBe('latin');
    expect(await screen.findByText('mode=open')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === 'alphabet: latin'),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Analyze' })).not.toBeDisabled();
    });
  });

  it('locks selector controls while an analysis request is pending', async () => {
    let resolveRequest: ((value: Response) => void) | undefined;
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    }));

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText('Word'), { target: { value: 'study' } });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    expect(screen.getByRole('combobox', { name: 'Analysis mode' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Alphabet profile' })).toBeDisabled();

    resolveRequest?.({ ok: true, json: async () => ({ word: 'study' }) } as Response);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Analyze' })).not.toBeDisabled();
    });
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
    expect(screen.getByText('Analyze one word')).toBeInTheDocument();

    const input = screen.getByLabelText('Word');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    await waitFor(() => {
      expect(screen.queryByText('Analyze one word')).not.toBeInTheDocument();
    });
    expect(countAnalyzeV1Fetches()).toBe(1);
  });

  it('triggers analysis with Enter key', async () => {
    render(<ZroChatPage />);
    const input = screen.getByLabelText('Word');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(countAnalyzeV1Fetches()).toBe(1);
    });
  });

  it('passes an explicit intended sense label without requiring an internal sense id', async () => {
    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText('Word'), { target: { value: 'candle' } });
    fireEvent.change(screen.getByLabelText('Intended sense'), {
      target: { value: 'a wax light source' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    await waitFor(() => {
      expect(countAnalyzeV1Fetches()).toBe(1);
    });

    const [request] = (global.fetch as jest.Mock).mock.calls.find(([input]) =>
      String(input).includes('/api/analyze-v1?'),
    ) ?? [];
    const requestUrl = new URL(String(request), 'http://localhost');
    expect(requestUrl.searchParams.get('targetSenseLabel')).toBe('a wax light source');
    expect(requestUrl.searchParams.has('targetSenseId')).toBe(false);
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
      expect(countAnalyzeV1Fetches()).toBe(1);
    });

    // After loading, the button should be re-enabled
    await waitFor(() => {
        expect(analyzeButton).not.toBeDisabled();
    });
    expect(analyzeButton).toHaveAttribute('aria-busy', 'false');
  });
});

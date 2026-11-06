import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ZroChatPage from "@/components/ZroChatPage";

global.fetch = jest.fn();

function overrideMatchMedia(value: typeof window.matchMedia | undefined): () => void {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  Object.defineProperty(window, 'matchMedia', { configurable: true, value });
  return () => {
    if (descriptor) {
      Object.defineProperty(window, 'matchMedia', descriptor);
    } else {
      Reflect.deleteProperty(window, 'matchMedia');
    }
  };
}

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
    render(<ZroChatPage />);

    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Type a word before analyzing.')).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('renders without matchMedia and uses the viewport-width fallback', async () => {
    const restoreMatchMedia = overrideMatchMedia(undefined);
    const innerWidthDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
    try {
      render(<ZroChatPage />);
      fireEvent.click(screen.getByText('Analyze'));

      await waitFor(() => {
        expect(screen.getByText('Type a word before analyzing.')).toBeInTheDocument();
      });
      expect(global.fetch).not.toHaveBeenCalled();
    } finally {
      restoreMatchMedia();
      if (innerWidthDescriptor) {
        Object.defineProperty(window, 'innerWidth', innerWidthDescriptor);
      } else {
        Reflect.deleteProperty(window, 'innerWidth');
      }
    }
  });

  it('continues using matchMedia when the browser API exists', () => {
    const matchMedia = jest.fn().mockReturnValue({ matches: false } as MediaQueryList);
    const restoreMatchMedia = overrideMatchMedia(matchMedia);
    try {
      render(<ZroChatPage />);
      expect(matchMedia).toHaveBeenCalledWith('(max-width: 639px)');
    } finally {
      restoreMatchMedia();
    }
  });
});

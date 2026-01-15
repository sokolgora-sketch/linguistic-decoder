import React from 'react';
import { render, screen } from '@testing-library/react';
import type { PresentOrMissing } from '@/ui/telemetry/types';
import { VowelPathTimeline } from '@/ui/instrument/VowelPathTimeline';

function present<T>(value: T): PresentOrMissing<T> {
  return { kind: 'present', value };
}

function missing<T>(note?: string): PresentOrMissing<T> {
  return { kind: 'missing', missing: 'not_emitted', note };
}

describe('VowelPathTimeline (v0.1)', () => {
  it('renders DIVERGE when surface != functional', () => {
    render(
      <VowelPathTimeline
        detected={present(['U', 'I'] as any)}
        surface={present(['U', 'Y'] as any)}
        functional={present(['U', 'I'] as any)}
        delta="DIVERGE"
      />
    );

    expect(screen.getByText(/Vowel Path Timeline/)).toBeInTheDocument();
    expect(screen.getByText('DIVERGE')).toBeInTheDocument();

    expect(screen.getByText('Detected')).toBeInTheDocument();
    expect(screen.getByText('Surface')).toBeInTheDocument();
    expect(screen.getByText('Functional')).toBeInTheDocument();

    // spot-check one formatted path
    expect(screen.getAllByText('U → I').length).toBeGreaterThan(0);
    expect(screen.getByText('U → Y')).toBeInTheDocument();
  });

  it('renders NOT EMITTED when detected missing', () => {
    render(
      <VowelPathTimeline
        detected={missing('no detected')}
        surface={missing()}
        functional={missing()}
        delta="NOT_EMITTED"
      />
    );

    expect(screen.getByText('NOT EMITTED')).toBeInTheDocument();
    expect(screen.getByText('No detected voice path.')).toBeInTheDocument();
    expect(screen.getAllByText('not emitted').length).toBeGreaterThan(0);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { VowelPathTimeline } from '@/ui/instrument/VowelPathTimeline';

function present<T>(value: T) {
  return { kind: 'present' as const, value };
}

function missing() {
  return { kind: 'missing' as const, missing: 'not_emitted' as const };
}

describe('VowelPathTimeline (v0.1)', () => {
  it('explains differing paths without exposing the internal delta code', () => {
    render(
      <VowelPathTimeline
        detected={present(['U', 'I'])}
        surface={present(['U', 'Y'])}
        functional={present(['U', 'I'])}
        delta="DIVERGE"
      />
    );

    expect(screen.getByText('Paths differ')).toBeInTheDocument();
    expect(screen.getByText('Detected Voice sequence')).toBeInTheDocument();
    expect(screen.getByText('Written vowel sequence')).toBeInTheDocument();
    expect(screen.getByText('Functional or normalized sequence')).toBeInTheDocument();
    expect(screen.getAllByText('U → I')).toHaveLength(2);
    expect(screen.getByText('U → Y')).toBeInTheDocument();
    expect(screen.queryByText('DIVERGE')).not.toBeInTheDocument();
    expect(screen.getByText('Functional or normalized sequence').parentElement).toHaveClass('flex-wrap', 'min-w-0');
    expect(screen.getAllByText('U → I')[0].parentElement).toHaveClass('min-w-0');
  });

  it('uses plain labels for matching and shifted paths', () => {
    render(
      <VowelPathTimeline
        detected={present(['U', 'I'])}
        surface={present(['U', 'Y'])}
        functional={present(['U', 'I'])}
        delta="SHIFT"
      />
    );

    expect(screen.getByText('Paths shifted')).toBeInTheDocument();
    expect(screen.queryByText('SHIFT')).not.toBeInTheDocument();
  });

  it('shows unavailable paths without exposing missing-state codes', () => {
    render(
      <VowelPathTimeline
        detected={missing()}
        surface={missing()}
        functional={missing()}
        delta="NOT_EMITTED"
      />
    );

    expect(screen.getByText('Comparison unavailable')).toBeInTheDocument();
    expect(screen.getAllByText('Not available')).toHaveLength(3);
    expect(screen.queryByText('NOT EMITTED')).not.toBeInTheDocument();
    expect(screen.queryByText('not emitted')).not.toBeInTheDocument();
  });
});

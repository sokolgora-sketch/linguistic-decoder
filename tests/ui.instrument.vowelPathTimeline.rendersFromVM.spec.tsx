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
  it('renders DIVERGE when surface != functional', () => {
    render(
      <VowelPathTimeline
        detected={present(['U', 'I'])}
        surface={present(['U', 'Y'])}
        functional={present(['U', 'I'])}
        delta="DIVERGE"
      />
    );

    expect(screen.getByText('DIVERGE')).toBeInTheDocument();
    expect(screen.getAllByText('U → I').length).toBeGreaterThan(0);
    expect(screen.getByText('U → Y')).toBeInTheDocument();
  });

  it('renders SHIFT when VM emits SHIFT', () => {
    render(
      <VowelPathTimeline
        detected={present(['U', 'I'])}
        surface={present(['U', 'Y'])}
        functional={present(['U', 'I'])}
        delta="SHIFT"
      />
    );

    expect(screen.getByText('SHIFT')).toBeInTheDocument();
  });

  it('renders not emitted state when paths are missing', () => {
    render(
      <VowelPathTimeline
        detected={missing()}
        surface={missing()}
        functional={missing()}
        delta="NOT_EMITTED"
      />
    );

    expect(screen.getByText('NOT EMITTED')).toBeInTheDocument();
    expect(screen.getByText('No detected voice path.')).toBeInTheDocument();
  });
});

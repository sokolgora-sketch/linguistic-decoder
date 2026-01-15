 import React from 'react';
import { render, screen } from '@testing-library/react';
import MeaningPanel from '../src/ui/instrument/MeaningPanel';

// NOTE: this is intentionally a shallow VM stub.
// We are locking the UI contract: Meaning renders from VM fields only.
describe('MeaningPanel (v1 minimal)', () => {
  it('renders a deterministic sentence when principles are present', () => {
    const vm = {
      detection: { principles: 'Unity → Insight', delta: 'DIVERGE', voicePathFunctional: 'U-I' },
      counts: { candidates: 2 },
    };

    render(<MeaningPanel vm={vm} />);

    expect(screen.getByText('Meaning')).toBeInTheDocument();
    expect(screen.getByText(/Principles:\s*Unity → Insight\./)).toBeInTheDocument();
    expect(screen.getByText(/Candidates:\s*2\./)).toBeInTheDocument();
    expect(screen.getByText(/Delta:\s*DIVERGE\./)).toBeInTheDocument();
    expect(screen.getByText(/Functional path:\s*U-I\./)).toBeInTheDocument();
  });

  it('renders a neutral fallback when telemetry is missing', () => {
    render(<MeaningPanel vm={{}} />);
    expect(screen.getByText(/Meaning v1 \(minimal\): insufficient telemetry emitted\./)).toBeInTheDocument();
  });
});

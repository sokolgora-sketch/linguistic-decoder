import React from 'react';
import { render, screen } from '@testing-library/react';
import MeaningPanel from '../src/ui/instrument/MeaningPanel';

function present<T>(value: T) {
  return { kind: 'present', value } as const;
}

function missing(missing: string, note?: string) {
  return { kind: 'missing', missing, note } as const;
}

describe('MeaningPanel (v0.1.1) — evidence summary renders present/none/missing from VM', () => {
  it('renders evidence truth posture lines', () => {
    const vm = {
      readout: {
        principlesPath: present(['P1', 'P2']),
        counts: { candidates: 2 },
        voicePathDelta: 'DIVERGE',
      },
      evidence: {
        normalizationSteps: present(['NFC', 'trim']),
        ops: present([]), // explicit none
        signals: missing('not_emitted'),
        notes: missing('unknown', 'upstream did not provide notes'),
      },
    };

    render(<MeaningPanel vm={vm} />);

    expect(screen.getByText(/Normalization \(2\): NFC, trim\./)).toBeInTheDocument();
    expect(screen.getByText(/Ops: none\./)).toBeInTheDocument();
    expect(screen.getByText(/Signals: missing \(not_emitted\)\./)).toBeInTheDocument();
    expect(
      screen.getByText(/Notes: missing \(unknown; upstream did not provide notes\)\./)
    ).toBeInTheDocument();
  });
});

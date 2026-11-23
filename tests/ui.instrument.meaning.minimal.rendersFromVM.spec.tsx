 import React from 'react';
import { render, screen } from '@testing-library/react';
import MeaningPanel from '../src/ui/instrument/MeaningPanel';

// NOTE: this is intentionally a shallow VM stub.
// We are locking the UI contract: Meaning renders from VM fields only.
describe('MeaningPanel structure summary', () => {
  it('presents the written/spoken structure plainly and keeps telemetry in technical details', () => {
    const vm = {
      detection: { principles: 'Unity → Insight', delta: 'DIVERGE', voicePathFunctional: 'U-I' },
      counts: { candidates: 2 },
    };

    render(<MeaningPanel vm={vm} />);

    expect(screen.getByTestId('meaning-structural-paths')).toHaveTextContent('Analysis path: U-I.');
    expect(screen.getByText(/does not by itself establish a word meaning or origin/i)).toBeInTheDocument();
    const details = screen.getByTestId('meaning-technical-details');
    expect(details).not.toHaveAttribute('open');
    expect(details).toHaveTextContent(/Principles:\s*Unity → Insight\./);
    expect(details).toHaveTextContent(/Candidates:\s*2\./);
    expect(details).toHaveTextContent(/Delta:\s*DIVERGE\./);
    expect(details).toHaveTextContent(/Functional \/ normalization path:\s*U-I\./);
    expect(screen.getByTestId('meaning-panel')).not.toHaveTextContent('source=vm');
  });

  it('uses a plain-language Null message when no structural path is available', () => {
    render(<MeaningPanel vm={{}} />);
    expect(screen.getByTestId('meaning-structural-paths-unavailable')).toHaveTextContent('No written or spoken path was produced for this analysis.');
    expect(screen.getByTestId('meaning-technical-details')).toHaveTextContent(/insufficient telemetry emitted/);
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { CountsRatiosCard } from '@/ui/instrument/sections/CountsRatiosCard';

describe('CountsRatiosCard humanizes PresentOrMissing values', () => {
  it('renders present counts as numbers and missing as "missing (...)" (no raw JSON)', () => {
    const readout = {
      counts: {
        candidates: 2,
        ops: { kind: 'present', value: 0 },
        notes: { kind: 'present', value: 0 },
        signals: { kind: 'present', value: 7 },
        rejections: { kind: 'missing', missing: 'not_emitted' },
      },
      ratios: {},
    };

    const { container } = render(<CountsRatiosCard readout={readout} engineVersion="0.2.0-symbolic" />);

    const text = container.textContent ?? '';

    // Human strings should be visible
    expect(text).toContain('Counts / Ratios');
    expect(text).toContain('Counts');
    expect(text).toContain('0');
    expect(text).toContain('7');
    expect(text).toContain('missing (not_emitted)');

    // Should NOT leak raw object JSON like {"kind":"present","value":0}
    expect(text).not.toContain('"kind":"present"');
    expect(text).not.toContain('"kind":"missing"');
  });
});

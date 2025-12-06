import React from 'react';
import { render, screen } from '@testing-library/react';
import { EngineMetaCard } from '@/components/EngineMetaCard';
import type { EngineMetaSummaryUI } from '@/lib/engineMetaSummary';
import '@testing-library/jest-dom';

describe('EngineMetaCard', () => {
  const mockMeta: EngineMetaSummaryUI = {
    engineName: 'Seven-Voices Core',
    versionLine: 'v0.2.0-build.12',
    modeLabel: 'strict',
    alphabetLabel: 'auto',
    notes: 'Raw version: 1.2.3',
  };

  it('renders the engine name and version', () => {
    render(<EngineMetaCard meta={mockMeta} />);
    expect(screen.getByText('Seven-Voices Core')).toBeInTheDocument();
    expect(screen.getByText('v0.2.0-build.12')).toBeInTheDocument();
  });

  it('renders the mode and alphabet', () => {
    render(<EngineMetaCard meta={mockMeta} />);
    expect(screen.getByText('strict')).toBeInTheDocument();
    expect(screen.getByText('auto')).toBeInTheDocument();
  });

  it('renders the notes if provided', () => {
    render(<EngineMetaCard meta={mockMeta} />);
    expect(screen.getByText('Raw version: 1.2.3')).toBeInTheDocument();
  });

  it('does not render the notes section if not provided', () => {
    const metaWithoutNotes = { ...mockMeta, notes: undefined };
    render(<EngineMetaCard meta={metaWithoutNotes} />);
    expect(screen.queryByText('Notes')).not.toBeInTheDocument();
  });
});

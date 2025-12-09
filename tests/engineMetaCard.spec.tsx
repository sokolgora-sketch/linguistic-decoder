import React from 'react';
import { render, screen } from '@testing-library/react';
import { EngineMetaCard } from '@/components/EngineMetaCard';
import type { EngineMetaSummary } from '@/lib/engineMetaSummary';
import '@testing-library/jest-dom';

describe('EngineMetaCard', () => {
  const mockSummary: EngineMetaSummary = {
    engineLabel: 'SevenVoices Core',
    build: 'v0.2.0-build.12',
    modeLabel: 'strict',
    alphabetLabel: 'auto',
    rawVersion: '1.2.3',
    engineName: 'SevenVoices Core',
    versionLine: 'v0.2.0-build.12',
    notes: 'Raw version: 1.2.3',
  };

  it('renders the engine name and version', () => {
    render(<EngineMetaCard summary={mockSummary} />);
    expect(screen.getByText('SevenVoices Core')).toBeInTheDocument();
    expect(screen.getByText('v0.2.0-build.12')).toBeInTheDocument();
  });

  it('renders the mode and alphabet', () => {
    render(<EngineMetaCard summary={mockSummary} />);
    expect(screen.getByText('strict')).toBeInTheDocument();
    expect(screen.getByText('auto')).toBeInTheDocument();
  });

  it('renders the notes if provided', () => {
    render(<EngineMetaCard summary={mockSummary} />);
    expect(screen.getByText('Raw version: 1.2.3')).toBeInTheDocument();
  });

  it('does not render the notes section if not provided', () => {
    const summaryWithoutNotes = { ...mockSummary, rawVersion: '' };
    render(<EngineMetaCard summary={summaryWithoutNotes} />);
    expect(screen.queryByText('Raw version:')).not.toBeInTheDocument();
  });
});

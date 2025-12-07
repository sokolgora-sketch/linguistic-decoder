
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageFamiliesCard, type LanguageFamilyView } from '@/components/LanguageFamiliesCard';
import '@testing-library/jest-dom';

describe('LanguageFamiliesCard', () => {
  const mockFamilies: LanguageFamilyView[] = [
    {
      language: 'Latin',
      form: 'amor',
      pivot: 'am',
      status: 'core',
      tags: ['love'],
    },
    {
      language: 'Albanian',
      form: 'dashuri',
      pivot: 'dash',
      status: 'experimental',
      tags: [],
    },
  ];

  it('should render the card with the correct title and content', () => {
    render(<LanguageFamiliesCard families={mockFamilies} />);

    expect(screen.getByText('Language families (experimental)')).toBeInTheDocument();
    expect(screen.getByText('Latin')).toBeInTheDocument();
    expect(screen.getByText('amor')).toBeInTheDocument();
    expect(screen.getByText('core')).toBeInTheDocument();
    expect(screen.getByText('love')).toBeInTheDocument();

    expect(screen.getByText('Albanian')).toBeInTheDocument();
    expect(screen.getByText('dashuri')).toBeInTheDocument();
    expect(screen.getByText('experimental')).toBeInTheDocument();
  });

  it('should render null if families are empty or not provided', () => {
    const { container } = render(<LanguageFamiliesCard families={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

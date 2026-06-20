import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardHeader from '@/components/DashboardHeader';

describe('DashboardHeader', () => {
  const defaultProps = {
    onFilterClick: vi.fn(),
    selectedType: 'All Orders',
    onTypeChange: vi.fn(),
  };

  it('renders the title', () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByText('Certified True Copy (47834)')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByText('Manage Your CTC Orders Here')).toBeInTheDocument();
  });

  it('renders the Types label', () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByText('Types')).toBeInTheDocument();
  });

  it('renders ORDERS when All Orders selected', () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByText('ORDERS')).toBeInTheDocument();
  });

  it('shows selected type in uppercase when not All Orders', () => {
    render(<DashboardHeader {...defaultProps} selectedType="Judgement" onTypeChange={vi.fn()} />);
    expect(screen.getByText('JUDGEMENT')).toBeInTheDocument();
  });

  it('renders the filter button', () => {
    render(<DashboardHeader {...defaultProps} />);
    const filterBtn = screen.getByTitle('Filter');
    expect(filterBtn).toBeInTheDocument();
  });

  it('renders the share button', () => {
    render(<DashboardHeader {...defaultProps} />);
    const shareBtn = screen.getByTitle('Share');
    expect(shareBtn).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<DashboardHeader {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search orders...');
    expect(searchInput).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterModal from '@/components/FilterModal';

describe('FilterModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onApply: vi.fn(),
  };

  it('renders the title', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Filter Orders')).toBeInTheDocument();
  });

  it('renders District section', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('District')).toBeInTheDocument();
  });

  it('renders Court Establishment section', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Court Establishment')).toBeInTheDocument();
  });

  it('renders Status section', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders Tags section', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Tags Quick Filter')).toBeInTheDocument();
  });

  it('renders Test Users checkbox', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Test Users')).toBeInTheDocument();
  });

  it('renders Reset Filter button', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Reset Filter')).toBeInTheDocument();
  });

  it('renders Apply Filter button', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Apply Filter')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<FilterModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Filter Orders')).not.toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  it('renders page numbers', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables prev button on first page', () => {
    render(<Pagination {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];
    expect(prevButton).toBeDisabled();
  });

  it('calls onPageChange when clicking a page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders "Go To" input', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Go To')).toBeInTheDocument();
    expect(screen.getByText('Page')).toBeInTheDocument();
  });

  it('shows ellipsis for large page counts', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
  });
});

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [goValue, setGoValue] = useState('');

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const handleGo = () => {
    const page = parseInt(goValue, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGo();
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination-bar">
      <div className="pagination-controls">
        <button
          className="pagination-chevron"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {visiblePages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`e-${i}`} className="pagination-btn ellipsis-btn">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-btn${currentPage === page ? ' active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
        <button
          className="pagination-chevron"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
        <span className="pagination-divider" />
        <span className="pagination-go-label">Go to</span>
        <input
          className="pagination-go-input"
          type="text"
          value={goValue}
          onChange={(e) => setGoValue(e.target.value.replace(/[^0-9]/g, ''))}
          onKeyDown={handleKeyDown}
          placeholder=""
        />
        <button className="pagination-go-btn" onClick={handleGo}>
          Page
        </button>
      </div>
    </div>
  );
}

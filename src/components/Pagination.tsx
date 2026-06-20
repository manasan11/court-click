'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    const range = end - start + 1;
    if (range < 5) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('ellipsis');
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const handleGo = () => {
    const page = parseInt(goValue, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoValue('');
    }
  };

  const handleGoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      </div>
      <div className="pagination-go-section">
        <span className="pagination-go-label">Go To</span>
        <input
          className="pagination-go-input"
          type="text"
          inputMode="numeric"
          value={goValue}
          onChange={(e) => setGoValue(e.target.value.replace(/\D/g, ''))}
          onKeyDown={handleGoKeyDown}
          placeholder=""
        />
        <span className="pagination-go-page-label">Page</span>
      </div>
    </div>
  );
}

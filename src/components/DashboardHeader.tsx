'use client';

import { Share2, SlidersHorizontal, Search, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  onFilterClick: () => void;
}

export default function DashboardHeader({ onFilterClick }: DashboardHeaderProps) {
  return (
    <div className="header-bar">
      <div className="header-title">
        <h1>Certified True Copy (47834)</h1>
        <p>Manage Your CTC Orders Here</p>
      </div>
      <div className="header-controls">
        <button className="control-btn" title="Share">
          <Share2 size={16} strokeWidth={1.5} />
        </button>
        <button className="control-btn" title="Filter" onClick={onFilterClick}>
          <SlidersHorizontal size={16} strokeWidth={1.5} />
        </button>
        <div className="header-search">
          <input type="text" placeholder="Search orders..." />
          <Search size={15} className="search-icon" strokeWidth={1.5} />
        </div>
        <div className="header-dropdown">
          <span className="label">Types</span>
          <span className="value">
            ORDERS
            <ChevronDown size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

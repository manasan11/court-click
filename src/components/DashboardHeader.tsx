'use client';

import { memo } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Share2, SlidersHorizontal, Search, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  onFilterClick: () => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const TYPE_OPTIONS = [
  { key: 'All Orders', label: 'All Orders' },
  { key: 'Judgement', label: 'Judgement' },
  { key: 'Interim Order', label: 'Interim Order' },
  { key: 'Certified True Copy', label: 'Certified True Copy' },
  { key: 'Other', label: 'Other' },
];

const items: MenuProps['items'] = TYPE_OPTIONS.map((opt) => ({
  key: opt.key,
  label: opt.label,
}));

const DashboardHeader = memo(function DashboardHeader({ onFilterClick, selectedType, onTypeChange }: DashboardHeaderProps) {
  const displayLabel = selectedType === 'All Orders' ? 'ORDERS' : selectedType.toUpperCase();

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
        <Dropdown menu={{ items, onClick: ({ key }) => onTypeChange(key) }} trigger={['click']}>
          <div className="header-dropdown" style={{ cursor: 'pointer' }}>
            <span className="label">Types</span>
            <span className="value">
              {displayLabel}
              <ChevronDown size={14} />
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
});

export default DashboardHeader;

'use client';

import { Popover, Checkbox, Divider } from 'antd';
import { Plus } from 'lucide-react';
import type { Tag } from '@/types';

interface TagFilterDropdownProps {
  tags: Tag[];
  selectedIds: string[];
  onToggle: (tagId: string) => void;
  onCreateNew: () => void;
  children: React.ReactNode;
}

export default function TagFilterDropdown({
  tags,
  selectedIds,
  onToggle,
  onCreateNew,
  children,
}: TagFilterDropdownProps) {
  const content = (
    <div style={{ width: 220 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
        Tags
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
        {tags.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 12, fontSize: 12 }}>
            No tags available
          </div>
        )}
        {tags.map((tag) => (
          <label
            key={tag.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: 13,
              padding: '4px 0',
            }}
          >
            <Checkbox
              checked={selectedIds.includes(tag.id)}
              onChange={() => onToggle(tag.id)}
            />
            <span
              style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 4,
                background: tag.color,
                color: '#fff',
                fontSize: 12,
              }}
            >
              {tag.name}
            </span>
          </label>
        ))}
      </div>
      <Divider style={{ margin: '10px 0 6px' }} />
      <button
        onClick={onCreateNew}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #E5E7EB',
          background: '#fff',
          cursor: 'pointer',
          fontSize: 13,
          color: '#374151',
          fontFamily: 'inherit',
          fontWeight: 500,
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
      >
        <Plus size={14} color="#9CA3AF" />
        Create New Tag
      </button>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomLeft">
      {children}
    </Popover>
  );
}

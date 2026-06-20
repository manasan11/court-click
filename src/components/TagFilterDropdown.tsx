'use client';

import { Popover, Checkbox, Divider } from 'antd';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Tag } from '@/types';

interface TagFilterDropdownProps {
  tags: Tag[];
  selectedIds: string[];
  onToggle: (tagId: string) => void;
  onCreateNew: () => void;
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: string) => void;
  children: React.ReactNode;
}

export default function TagFilterDropdown({
  tags,
  selectedIds,
  onToggle,
  onCreateNew,
  onEdit,
  onDelete,
  children,
}: TagFilterDropdownProps) {
  const content = (
    <div style={{ width: 240 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
        Tags
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 240, overflowY: 'auto' }}>
        {tags.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 12, fontSize: 12 }}>
            No tags available
          </div>
        )}
        {tags.map((tag) => (
          <div
            key={tag.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 6px',
              borderRadius: 6,
              cursor: 'default',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Checkbox
              checked={selectedIds.includes(tag.id)}
              onChange={() => onToggle(tag.id)}
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 4,
                background: tag.color,
                color: '#fff',
                fontSize: 12,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {tag.name}
            </span>
            <button
              title="Edit"
              onClick={(e) => { e.stopPropagation(); onEdit(tag); }}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: '#9CA3AF', padding: 2, display: 'flex', flexShrink: 0,
                borderRadius: 4, transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#3A1534'; e.currentTarget.style.background = '#F3F4F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Pencil size={12} />
            </button>
            <button
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(tag.id); }}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: '#9CA3AF', padding: 2, display: 'flex', flexShrink: 0,
                borderRadius: 4, transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = '#FEE2E2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <Divider style={{ margin: '8px 0 6px' }} />
      <button
        onClick={onCreateNew}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          padding: '8px 10px', borderRadius: 6, border: '1px solid #E5E7EB',
          background: '#fff', cursor: 'pointer', fontSize: 13, color: '#374151',
          fontFamily: 'inherit', fontWeight: 500, transition: 'background 0.1s',
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

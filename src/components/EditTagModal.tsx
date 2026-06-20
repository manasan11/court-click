'use client';

import { Modal, Input, Button } from 'antd';
import { useState } from 'react';
import type { Tag } from '@/types';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#EF4444', '#8B4513', '#F59E0B',
  '#8B5CF6', '#3B82F6', '#EC4899', '#9CA3AF', '#14B8A6', '#3A1534',
];

interface EditTagModalProps {
  open: boolean;
  tag: Tag | null;
  onClose: () => void;
  onSave: (tag: Tag) => void;
}

export default function EditTagModal({ open, tag, onClose, onSave }: EditTagModalProps) {
  const [tagName, setTagName] = useState(tag?.name || '');
  const [selectedColor, setSelectedColor] = useState(tag?.color || PRESET_COLORS[0]);

  const handleSave = () => {
    const trimmed = tagName.trim();
    if (!trimmed || !tag) return;
    onSave({ ...tag, name: trimmed, color: selectedColor });
    onClose();
  };

  const canSave = tagName.trim().length > 0 && tag;

  return (
    <Modal
      title="Edit Tag"
      open={open}
      onCancel={onClose}
      footer={null}
      width={460}
      destroyOnClose
    >
      <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
        Update tag name or color
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
            Tag Name
          </div>
          <Input
            placeholder="Enter Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onPressEnter={handleSave}
            style={{ borderRadius: 8, height: 40, fontSize: 14 }}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
            Choose Tag Color
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((color) => (
              <div
                key={color}
                className="color-swatch"
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: color,
                  border: selectedColor === color ? '3px solid #111827' : '3px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: selectedColor === color ? '0 0 0 2px white' : 'none',
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {canSave && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
              Preview
            </div>
            <span
              style={{
                background: selectedColor, color: '#fff', padding: '5px 16px',
                fontSize: 13, borderRadius: 6, display: 'inline-block', fontWeight: 500,
              }}
            >
              {tagName.trim()}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          <Button
            onClick={onClose}
            style={{ borderRadius: 8, height: 38, padding: '0 20px', fontSize: 14, fontFamily: 'inherit' }}
          >
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={handleSave}
            style={{
              borderRadius: 8, height: 38, padding: '0 20px', fontSize: 14, fontFamily: 'inherit',
              background: canSave ? '#3A1534' : undefined,
              borderColor: canSave ? '#3A1534' : undefined,
              color: canSave ? '#fff' : undefined,
            }}
          >
            Update Tag
          </Button>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import { Modal, Button, Tag } from 'antd';
import { tags } from '@/data/mockData';

interface TagManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TagManagementModal({ open, onClose }: TagManagementModalProps) {
  return (
    <Modal
      title="Manage Tags"
      open={open}
      onCancel={onClose}
      footer={
        <Button type="primary" style={{ background: '#501B2D', borderColor: '#501B2D' }} onClick={onClose}>
          Done
        </Button>
      }
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            color={tag.color}
            style={{ padding: '2px 10px', borderRadius: 4, fontSize: 13 }}
          >
            {tag.name}
          </Tag>
        ))}
      </div>
    </Modal>
  );
}

'use client';

import { Modal, Input, Button, Form } from 'antd';

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTagModal({ open, onClose }: CreateTagModalProps) {
  return (
    <Modal
      title="Create Tag"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Tag Name">
          <Input placeholder="Enter tag name" />
        </Form.Item>
        <Form.Item label="Color">
          <div style={{ display: 'flex', gap: 8 }}>
            {['#F59E0B', '#8B5CF6', '#3B82F6', '#10B981', '#EF4444', '#F97316'].map((color) => (
              <div
                key={color}
                className="color-swatch"
                style={{ background: color }}
              />
            ))}
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ background: '#501B2D', borderColor: '#501B2D' }}
            onClick={onClose}
          >
            Create Tag
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

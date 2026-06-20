'use client';

import { Modal, Input, Button, Form, Select } from 'antd';

interface AddClerkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddClerkModal({ open, onClose }: AddClerkModalProps) {
  return (
    <Modal
      title="Add Clerk"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Full Name">
          <Input placeholder="Enter clerk name" />
        </Form.Item>
        <Form.Item label="Email">
          <Input placeholder="Enter email" type="email" />
        </Form.Item>
        <Form.Item label="Court Assignment">
          <Select placeholder="Select court">
            <Select.Option value="delhi">Delhi District Court</Select.Option>
            <Select.Option value="bombay">Bombay High Court</Select.Option>
            <Select.Option value="karnataka">Karnataka High Court</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ background: '#501B2D', borderColor: '#501B2D' }}
            onClick={onClose}
          >
            Add Clerk
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

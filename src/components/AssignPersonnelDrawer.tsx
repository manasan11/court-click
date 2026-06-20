'use client';

import { Drawer, Button, Radio, Space, Divider } from 'antd';
import { clerks } from '@/data/mockData';

interface AssignPersonnelDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AssignPersonnelDrawer({ open, onClose }: AssignPersonnelDrawerProps) {
  return (
    <Drawer
      title="Assign Personnel"
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
    >
      <p style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 13 }}>
        Select a clerk to assign this order:
      </p>
      <Radio.Group style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {clerks.map((clerk) => (
            <Radio key={clerk.id} value={clerk.id} style={{ width: '100%', padding: '8px 0' }}>
              {clerk.name}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <Divider />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          style={{ background: '#501B2D', borderColor: '#501B2D' }}
          onClick={onClose}
        >
          Assign
        </Button>
      </div>
    </Drawer>
  );
}

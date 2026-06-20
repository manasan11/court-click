'use client';

import { Modal, Input, Button } from 'antd';
import { useState } from 'react';

interface AddClerkModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function AddClerkModal({ open, onClose, onBack }: AddClerkModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [clerkId, setClerkId] = useState('');

  const valid = name.trim().length > 0 && phone.trim().length > 0 && clerkId.trim().length > 0;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      destroyOnClose
      closable={false}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Add Clerk
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            Add a new authorized person by providing details
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#9CA3AF',
            fontSize: 20,
            lineHeight: 1,
            padding: '2px 6px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
            Clerk Name <span style={{ color: '#EF4444' }}>*</span>
          </div>
          <Input
            placeholder="Enter clerk name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderRadius: 8, height: 42, fontSize: 14 }}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
            Phone Number <span style={{ color: '#EF4444' }}>*</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid #D9D9D9',
                background: '#fff',
                fontSize: 14,
                color: '#111827',
                fontWeight: 500,
                height: 42,
              }}
            >
              <span style={{ fontSize: 18 }}>🇮🇳</span>
              +91
            </div>
            <Input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ borderRadius: 8, height: 42, fontSize: 14, flex: 1 }}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
            Clerk ID <span style={{ color: '#EF4444' }}>*</span>
          </div>
          <Input
            placeholder="Enter Clerk ID"
            value={clerkId}
            onChange={(e) => setClerkId(e.target.value)}
            style={{ borderRadius: 8, height: 42, fontSize: 14 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 28, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
        <Button
          onClick={onBack}
          style={{
            borderRadius: 8,
            height: 38,
            padding: '0 22px',
            fontSize: 14,
            borderColor: '#3A1534',
            color: '#3A1534',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!valid}
          onClick={onClose}
          style={{
            borderRadius: 8,
            height: 38,
            padding: '0 22px',
            fontSize: 14,
            background: valid ? '#3A1534' : undefined,
            borderColor: valid ? '#3A1534' : undefined,
            color: valid ? '#fff' : undefined,
            fontFamily: 'inherit',
          }}
        >
          Add & Save
        </Button>
      </div>
    </Modal>
  );
}

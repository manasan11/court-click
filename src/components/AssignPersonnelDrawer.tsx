'use client';

import { Modal, Button, Checkbox, Select } from 'antd';
import { useState } from 'react';

import { clerks } from '@/data/mockData';
import type { Clerk } from '@/types';

interface AssignClerkModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (clerk: Clerk) => void;
  onAddNew: () => void;
}

function ClerkAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#3A1534', '#4E2144', '#8B5CF6', '#065F46', '#92400E', '#991B1B'];
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return (
    <div style={{
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: colors[colorIndex],
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 600,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function AssignClerkModal({ open, onClose, onAssign, onAddNew }: AssignClerkModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [moreClerkId, setMoreClerkId] = useState<string | null>(null);

  const handleAssign = () => {
    const id = selectedId || moreClerkId;
    if (!id) return;
    const clerk = clerks.find(c => c.id === id);
    if (clerk) {
      onAssign(clerk);
      setSelectedId(null);
      setMoreClerkId(null);
      onClose();
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      destroyOnClose
      closable={false}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Assign Authorized Personnel
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            Select the person who is authorized to collect CTC document.
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

      <div style={{ marginTop: 18, marginBottom: 16 }}>
        <button
          onClick={onAddNew}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: '#3A1534',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          + Add New
        </button>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
        Quick Select
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
        {clerks.map((clerk) => (
          <label
            key={clerk.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              background: selectedId === clerk.id ? '#F9FAFB' : 'transparent',
              border: selectedId === clerk.id ? '1px solid #E5E7EB' : '1px solid transparent',
              transition: 'all 0.1s',
            }}
          >
            <Checkbox
              checked={selectedId === clerk.id}
              onChange={() => setSelectedId(selectedId === clerk.id ? null : clerk.id)}
              style={{ accentColor: '#3A1534' }}
            />
            <ClerkAvatar name={clerk.name} />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>
              {clerk.name}
            </span>
          </label>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
        More Clerks
      </div>

      <div style={{ position: 'relative' }}>
        <Select
          style={{ width: '100%', height: 42 }}
          placeholder="Choose Clerks"
          value={moreClerkId}
          onChange={(val) => { setMoreClerkId(val); setSelectedId(null); }}
          options={clerks.map(c => ({ value: c.id, label: c.name }))}
          notFoundContent={null}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
        <Button
          onClick={onClose}
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
          disabled={!selectedId && !moreClerkId}
          onClick={handleAssign}
          style={{
            borderRadius: 8,
            height: 38,
            padding: '0 22px',
            fontSize: 14,
            background: selectedId || moreClerkId ? '#3A1534' : undefined,
            borderColor: selectedId || moreClerkId ? '#3A1534' : undefined,
            color: selectedId || moreClerkId ? '#fff' : undefined,
            fontFamily: 'inherit',
          }}
        >
          Assign Personnel
        </Button>
      </div>
    </Modal>
  );
}

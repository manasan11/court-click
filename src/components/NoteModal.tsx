'use client';

import { Modal, Input, Button, message } from 'antd';
import { useState } from 'react';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  initialNote?: string;
  onSave: (orderId: string, note: string) => void;
}

export default function NoteModal({ open, onClose, orderId, initialNote, onSave }: NoteModalProps) {
  const [note, setNote] = useState(initialNote || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const prevNote = initialNote || '';

    // Optimistic: update immediately
    onSave(orderId, note);
    onClose();

    // Simulate async API call
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      message.success('Note saved successfully');
    } catch {
      // Rollback on failure
      onSave(orderId, prevNote);
      message.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`Note - ${orderId}`}
      open={open}
      onCancel={onClose}
      key={orderId}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            loading={saving}
            style={{ background: '#3A1534', borderColor: '#3A1534' }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      }
      destroyOnClose
    >
      <Input.TextArea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
        rows={5}
        style={{ borderRadius: 8, fontSize: 13 }}
      />
    </Modal>
  );
}

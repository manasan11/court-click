'use client';

import { Modal, Input, Button } from 'antd';
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

  const handleSave = () => {
    onSave(orderId, note);
    onClose();
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

'use client';

import { Modal } from 'antd';
import { Copy, X } from 'lucide-react';
import type { Order } from '@/types';

interface ClerkShareModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const details = [
  { label: 'APPLICANT', value: 'Laisamma George (Petitioner)' },
  { label: 'CASE NUMBER', value: 'WA 233/2024' },
  { label: 'CASE NAME', value: 'Laisamma George & Other vs State Of Kerala & Others' },
  { label: 'CNR NUMBER', value: 'KLHC010922112023' },
  { label: 'COURT ESTABLISHMENT', value: 'JFCM 1 District Court Thrissur' },
  { label: 'DOCUMENT TYPE', value: 'Certified True Copy - Judgment' },
  { label: 'ORDER NUMBER', value: '1/2026' },
  { label: 'ORDER DATE', value: '22-Feb-2026' },
];

export default function ClerkShareModal({ open, onClose, order }: ClerkShareModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
      closable={false}
      style={{ padding: 0 }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Order Details</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid #E5E7EB',
                background: '#F9FAFB',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                fontFamily: 'inherit',
              }}
              onClick={() => navigator.clipboard.writeText(JSON.stringify(order, null, 2))}
            >
              <Copy size={14} />
              Copy Details
            </button>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                borderRadius: 6,
                background: 'transparent',
                cursor: 'pointer',
                color: '#6B7280',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '2px 0',
            }}
          >
            {details.map((d) => (
              <>
                <div
                  style={{
                    padding: '10px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#6B7280',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    background: '#F9FAFB',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    fontSize: 13,
                    color: '#111827',
                    fontWeight: 500,
                    background: '#fff',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  {d.value}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

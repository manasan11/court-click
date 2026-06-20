'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { X, Copy, FileText, Clock, CheckCircle } from 'lucide-react';
import type { Order } from '@/types';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const TABS = [
  'Case & Customer Details',
  'Address',
  'Products',
  'Digio eSign Documents',
];

export default function OrderDetailModal({ open, onClose, order }: OrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      destroyOnClose
      closable={false}
      maskStyle={{ background: 'rgba(0,0,0,0.55)' }}
      styles={{ body: { padding: 0, borderRadius: 12, overflow: 'hidden' } }}
    >
      <div style={{ background: '#fff', borderRadius: 12 }}>
        {/* ─── HEADER ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Order Details</div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', color: '#6B7280',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── UPPER META MATRIX ─── */}
        <div style={{ padding: '16px 24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '4px 0', fontSize: 13 }}>
            <MetaLabel text="Order ID:" />
            <MetaValue text={order.id} />
            <MetaLabel text="Tracking ID:" />
            <MetaValue text="EL767335963IN" />
            <MetaLabel text="Payment completed:" />
            <MetaValue text={order.status === 'Payment Completed' ? `${order.orderDate} 01:54 PM` : '—'} />
            <MetaLabel text="Order placed:" />
            <MetaValue text={`${order.orderDate} 10:32 AM`} />
            <MetaLabel text="Assigned:" />
            <MetaValue text={order.clerk ? `${order.orderDate} 11:15 AM` : '—'} />
            <MetaLabel text="Applied:" />
            <MetaValue text="—" />
            <MetaLabel text="Dispatched:" />
            <MetaValue text="—" />
            <MetaLabel text="Delivered:" />
            <MetaValue text="—" />
          </div>
        </div>

        {/* ─── TABS ─── */}
        <div style={{ borderBottom: '1px solid #E5E7EB', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: i === activeTab ? 700 : 500,
                  color: i === activeTab ? '#111827' : '#6B7280',
                  fontFamily: 'inherit',
                  borderBottom: i === activeTab ? '2px solid #3A1534' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ─── TAB CONTENT ─── */}
        <div style={{ padding: '20px 24px 24px', minHeight: 260 }}>
          {activeTab === 0 && <CaseCustomerDetails order={order} />}
          {activeTab === 1 && <AddressTab order={order} />}
          {activeTab === 2 && <ProductsTab order={order} />}
          {activeTab === 3 && <DigioTab />}
        </div>
      </div>
    </Modal>
  );
}

/* ─── Helpers ─── */
function MetaLabel({ text }: { text: string }) {
  return (
    <div style={{ padding: '5px 0', color: '#6B7280', fontSize: 12, fontWeight: 500 }}>
      {text}
    </div>
  );
}

function MetaValue({ text }: { text: string }) {
  return (
    <div style={{ padding: '5px 0', color: '#111827', fontWeight: 700, fontSize: 13 }}>
      {text}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ width: 160, fontSize: 13, color: '#6B7280', flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#111827', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* ─── State A: Case & Customer Details ─── */
function CaseCustomerDetails({ order }: { order: Order }) {
  return (
    <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '16px 20px' }}>
      <DataRow label="Case Number:" value="OS/300179/2024" />
      <DataRow label="Legal Name:" value={order.userInfo.name} />
      <DataRow label="Name:" value={order.userInfo.name} />
      <DataRow label="Email:" value={order.userInfo.email || 'anilphilipka@gmail.com'} />
      <DataRow label="Phone:" value={order.userInfo.phone || '919495862301'} />
      <div style={{ padding: '10px 0 0' }}>
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Delivery Feedback:</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#111827' }}>
          <li>Issue: N/A</li>
        </ul>
      </div>
    </div>
  );
}

/* ─── State B: Address ─── */
function AddressTab({ order }: { order: Order }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          onClick={() => navigator.clipboard.writeText(order.address || '')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB',
            background: '#F9FAFB', cursor: 'pointer', fontSize: 13,
            fontWeight: 500, color: '#374151', fontFamily: 'inherit',
          }}
        >
          <Copy size={14} />
          Copy Address
        </button>
      </div>
      <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '16px 20px' }}>
        <DataRow label="Pincode:" value="682028" />
        <DataRow label="Address Line 1:" value="67/67A flat no D 1st floor" />
        <DataRow label="Address Line 2:" value="attaniyathu road vennala" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <DataRow label="City:" value="kochi" />
          <DataRow label="District:" value="kochi" />
          <DataRow label="State:" value="kerala" />
          <DataRow label="Country:" value="India" />
        </div>
      </div>
    </div>
  );
}

/* ─── State C: Products ─── */
function ProductsTab({ order }: { order: Order }) {
  const p = order.products[0];
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Product 1</div>
      <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '16px 20px' }}>
        <DataRow label="Type:" value={p ? p.classification : 'N/A'} />
        <DataRow label="Order Date:" value={order.orderDate} />
        <DataRow
          label="File:"
          value="N/A"
        />
      </div>
    </div>
  );
}

/* ─── State D: Digio eSign Documents ─── */
function DigioTab() {
  const linkStyle: React.CSSProperties = {
    color: '#2563EB', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'none',
  };

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>eSign 1</div>
      <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '16px 20px' }}>
        <DataRow label="Digio ID:" value="DID260227135944268625QRGSUK5WP37" />
        <DataRow label="Status:" value="Completed" />
        <div style={{ padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ width: 160, fontSize: 13, color: '#6B7280', flexShrink: 0, display: 'inline-block' }}>
            Signed Document:
          </div>
          <a style={linkStyle} href="#">View Signed Document</a>
        </div>
        <div style={{ padding: '8px 0' }}>
          <div style={{ width: 160, fontSize: 13, color: '#6B7280', flexShrink: 0, display: 'inline-block' }}>
            Audit Log:
          </div>
          <a style={linkStyle} href="#">View Audit Log</a>
        </div>
      </div>
    </div>
  );
}

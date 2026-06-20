'use client';

import { Drawer, Button, Select, Checkbox } from 'antd';
import { useState, useCallback } from 'react';
import { X } from 'lucide-react';

export interface FilterState {
  district: string | undefined;
  court: string | undefined;
  product: string;
  statuses: string[];
  tagIds: string[];
  testUsers: boolean;
}

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

const initialState: FilterState = {
  district: undefined,
  court: undefined,
  product: 'All',
  statuses: [],
  tagIds: [],
  testUsers: false,
};

export default function FilterModal({ open, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialState);
  const [savedFilters, setSavedFilters] = useState<FilterState>(initialState);

  const handleReset = useCallback(() => {
    setFilters(initialState);
    setSavedFilters(initialState);
  }, []);

  const handleApply = useCallback(() => {
    setSavedFilters({ ...filters });
    onApply({ ...filters });
    onClose();
  }, [filters, onApply, onClose]);

  const handleClose = useCallback(() => {
    setFilters({ ...savedFilters });
    onClose();
  }, [savedFilters, onClose]);

  return (
    <Drawer
      placement="right"
      open={open}
      onClose={handleClose}
      width={400}
      mask={true}
      maskStyle={{ background: 'rgba(0,0,0,0.45)' }}
      closable={false}
      destroyOnClose={false}
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column' },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
            Filter Users
          </span>
          <button
            onClick={handleClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6B7280',
              padding: 4,
              display: 'flex',
              borderRadius: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
              District
            </div>
            <Select
              placeholder="Choose District"
              value={filters.district}
              onChange={(v) => setFilters((prev) => ({ ...prev, district: v }))}
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: 'Delhi', value: 'delhi' },
                { label: 'Mumbai', value: 'mumbai' },
                { label: 'Bangalore', value: 'bangalore' },
                { label: 'Jaipur', value: 'jaipur' },
                { label: 'Chennai', value: 'chennai' },
                { label: 'Kolkata', value: 'kolkata' },
              ]}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
              Court Establishment
            </div>
            <Select
              placeholder="Choose Court Establishment"
              value={filters.court}
              onChange={(v) => setFilters((prev) => ({ ...prev, court: v }))}
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: 'Delhi District Court', value: 'delhi-district' },
                { label: 'Bombay High Court', value: 'bombay-hc' },
                { label: 'Karnataka High Court', value: 'karnataka-hc' },
                { label: 'Rajasthan High Court', value: 'rajasthan-hc' },
                { label: 'Madras High Court', value: 'madras-hc' },
                { label: 'Calcutta High Court', value: 'calcutta-hc' },
              ]}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
              Product
            </div>
            <Select
              value={filters.product}
              onChange={(v) => setFilters((prev) => ({ ...prev, product: v }))}
              style={{ width: '100%' }}
              options={[
                { label: 'All', value: 'All' },
                { label: 'Certified Copy', value: 'Certified Copy' },
                { label: 'Marriage Certificate', value: 'Marriage Certificate' },
                { label: 'GST Registration', value: 'GST Registration' },
                { label: 'Document Attestation', value: 'Document Attestation' },
              ]}
            />
          </div>

          <div>
            <Checkbox
              checked={filters.testUsers}
              onChange={(e) => setFilters((prev) => ({ ...prev, testUsers: e.target.checked }))}
            >
              <span style={{ fontSize: 13 }}>Test Users</span>
            </Checkbox>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '16px 20px',
            borderTop: '1px solid #E5E7EB',
            flexShrink: 0,
          }}
        >
          <Button onClick={handleReset} style={{ borderRadius: 8, height: 40, fontSize: 13 }}>
            Reset Filter
          </Button>
          <Button
            type="primary"
            style={{
              background: '#3A1534',
              borderColor: '#3A1534',
              borderRadius: 8,
              height: 40,
              fontSize: 13,
            }}
            onClick={handleApply}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

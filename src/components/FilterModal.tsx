'use client';

import { Modal, Button, Select, Checkbox, Space } from 'antd';
import { useState, useCallback } from 'react';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
}

interface FilterState {
  district: string | undefined;
  court: string | undefined;
  product: string;
  testUsers: boolean;
}

const initialState: FilterState = {
  district: undefined,
  court: undefined,
  product: 'All',
  testUsers: false,
};

export default function FilterModal({ open, onClose }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialState);
  const [savedFilters, setSavedFilters] = useState<FilterState>(initialState);

  const handleReset = useCallback(() => {
    setFilters(initialState);
    setSavedFilters(initialState);
  }, []);

  const handleApply = useCallback(() => {
    setSavedFilters({ ...filters });
    onClose();
  }, [filters, onClose]);

  const handleClose = useCallback(() => {
    setFilters({ ...savedFilters });
    onClose();
  }, [savedFilters, onClose]);

  return (
    <Modal
      title="Filter Users"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={420}
      destroyOnClose={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 8 }}>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button onClick={handleReset}>Reset Filter</Button>
          <Button
            type="primary"
            style={{ background: '#3A1534', borderColor: '#3A1534' }}
            onClick={handleApply}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </Modal>
  );
}

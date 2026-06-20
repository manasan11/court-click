'use client';

import { Drawer, Button, Divider } from 'antd';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  return (
    <Drawer
      title="Filters"
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
      className="filter-drawer"
    >
      <div className="filter-section">
        <h4>Status</h4>
        <div className="filter-checkbox-group">
          <label>
            <input type="checkbox" defaultChecked />
            Order Placed
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Payment Completed
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Cancelled
          </label>
        </div>
      </div>
      <Divider />
      <div className="filter-section">
        <h4>Court Complex</h4>
        <div className="filter-checkbox-group">
          <label><input type="checkbox" defaultChecked /> Delhi District Court</label>
          <label><input type="checkbox" defaultChecked /> Bombay High Court</label>
          <label><input type="checkbox" defaultChecked /> Karnataka High Court</label>
          <label><input type="checkbox" defaultChecked /> Rajasthan High Court</label>
        </div>
      </div>
      <Divider />
      <div className="filter-section">
        <h4>Clerk</h4>
        <div className="filter-checkbox-group">
          <label><input type="checkbox" defaultChecked /> Assigned</label>
          <label><input type="checkbox" defaultChecked /> Unassigned</label>
        </div>
      </div>
      <Divider />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" style={{ background: '#501B2D', borderColor: '#501B2D' }} onClick={onClose}>
          Apply
        </Button>
      </div>
    </Drawer>
  );
}

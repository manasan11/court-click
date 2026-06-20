'use client';

import { orders } from '@/data/mockData';

export default function DashboardMetrics() {
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === 'Order Placed').length;
  const completedOrders = orders.filter((o) => o.status === 'Payment Completed').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      <div className="detail-card" style={{ flex: 1 }}>
        <div className="detail-field">
          <div className="label">Total Orders</div>
          <div className="value" style={{ fontSize: 24 }}>{totalOrders}</div>
        </div>
      </div>
      <div className="detail-card" style={{ flex: 1 }}>
        <div className="detail-field">
          <div className="label">Active</div>
          <div className="value" style={{ fontSize: 24, color: '#065F46' }}>{activeOrders}</div>
        </div>
      </div>
      <div className="detail-card" style={{ flex: 1 }}>
        <div className="detail-field">
          <div className="label">Completed</div>
          <div className="value" style={{ fontSize: 24, color: '#92400E' }}>{completedOrders}</div>
        </div>
      </div>
      <div className="detail-card" style={{ flex: 1 }}>
        <div className="detail-field">
          <div className="label">Cancelled</div>
          <div className="value" style={{ fontSize: 24, color: '#991B1B' }}>{cancelledOrders}</div>
        </div>
      </div>
    </div>
  );
}

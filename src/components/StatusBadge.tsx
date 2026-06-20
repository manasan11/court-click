'use client';

import type { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusClass: Record<OrderStatus, string> = {
  'Cancelled': 'cancelled',
  'Order Placed': 'order-placed',
  'Payment Completed': 'payment-completed',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${statusClass[status]}`}>
      {status}
    </span>
  );
}

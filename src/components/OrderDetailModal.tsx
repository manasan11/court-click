'use client';

import { Modal, Descriptions, Tag } from 'antd';
import type { Order } from '@/types';
import StatusBadge from './StatusBadge';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

export default function OrderDetailModal({ open, onClose, order }: OrderDetailModalProps) {
  return (
    <Modal
      title={`Order #${order.orderId}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="Order ID" span={2}>
          {order.id}
        </Descriptions.Item>
        <Descriptions.Item label="Customer">{order.userInfo.name}</Descriptions.Item>
        <Descriptions.Item label="Phone">{order.userInfo.phone}</Descriptions.Item>
        <Descriptions.Item label="Court Complex" span={2}>
          {order.courtComplex.name}, {order.courtComplex.location}
        </Descriptions.Item>
        <Descriptions.Item label="Products" span={2}>
          {order.products[0] ? `${order.products[0].classification} ${order.products[0].trackingToken}${order.products[0].subClause ? ` — ${order.products[0].subClause}` : ''} — ${order.products[0].amount}` : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Order Date">{order.orderDate}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <StatusBadge status={order.status} />
        </Descriptions.Item>
        <Descriptions.Item label="E-sign">
          {order.hasEsign ? 'Available' : 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label="Clerk">
          {order.clerk ? order.clerk.name : 'Not Assigned'}
        </Descriptions.Item>
        <Descriptions.Item label="Tags" span={2}>
          {order.tags.map((t) => (
            <Tag key={t.id} color={t.color}>
              {t.name}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {order.address || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

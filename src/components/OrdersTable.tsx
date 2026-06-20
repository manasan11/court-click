'use client';

import { useState } from 'react';
import { Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Eye, FileSignature, Copy, UserPlus } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import OrderDetailModal from './OrderDetailModal';

interface OrdersTableProps {
  orders: Order[];
}

const USERS_PER_PAGE = 3;

const tagColorMap: Record<string, string> = {
  'Subscription Pending': 'subscription-pending',
  'Gouri': 'gouri',
  'Add Case': 'add-case',
  'Aadhaar Verified': 'aadhaar-verified',
  'Urgent': 'urgent',
  'High Priority': 'high-priority',
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const totalPages = Math.ceil(orders.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + USERS_PER_PAGE);

  const columns: ColumnsType<Order> = [
    {
      title: '#',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 70,
      render: (id: number) => <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{id}</span>,
    },
    {
      title: 'User Info',
      key: 'userInfo',
      width: 260,
      render: (_, record) => (
        <div className="user-info-cell">
          <div className="user-avatar">
            {record.userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="user-info-body">
            <div className="user-name">{record.userInfo.name}</div>
            <div className="user-phone">{record.userInfo.phone}</div>
            <div className="user-order-id">#{record.orderId}</div>
            <button
              className="copy-address-btn"
              onClick={() => navigator.clipboard.writeText(record.address || '')}
            >
              <Copy size={11} />
              Copy Address
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Court Complex',
      dataIndex: 'courtComplex',
      key: 'courtComplex',
      width: 180,
    },
    {
      title: 'Products',
      key: 'products',
      width: 180,
      render: (_, record) => record.products.join(', '),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: OrderStatus) => <StatusBadge status={status} />,
    },
    {
      title: 'Order Details / E-sign',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <div className="order-details-cell">
          <Tooltip title="View Details">
            <button
              className="action-btn"
              onClick={() => {
                setSelectedOrder(record);
                setDetailOpen(true);
              }}
            >
              <Eye size={14} />
              View
            </button>
          </Tooltip>
          {record.hasEsign && (
            <Tooltip title="E-sign">
              <button className="action-btn esign">
                <FileSignature size={14} />
                E-sign
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Tags / Note',
      key: 'tags',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {record.tags.map((tag) => (
            <span
              key={tag.id}
              className={`tag-chip ${tagColorMap[tag.name] || ''}`}
              style={!tagColorMap[tag.name] ? { background: tag.color + '20', color: tag.color } : undefined}
            >
              {tag.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'Clerk',
      key: 'clerk',
      width: 120,
      render: (_, record) =>
        record.clerk ? (
          <span className="clerks-assigned">
            <span className="clerk-name">{record.clerk.name.split(' ')[0]}</span>
          </span>
        ) : (
          <Tooltip title="Assign Clerk">
            <button className="action-btn assign">
              <UserPlus size={12} />
              Assign
            </button>
          </Tooltip>
        ),
    },
  ];

  return (
    <>
      <div className="table-container">
        <div className="table-scroll">
          <Table
            columns={columns}
            dataSource={currentOrders}
            rowKey="id"
            pagination={false}
            bordered={false}
            size="middle"
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {selectedOrder && (
        <OrderDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          order={selectedOrder}
        />
      )}
    </>
  );
}

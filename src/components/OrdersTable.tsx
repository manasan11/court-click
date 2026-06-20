'use client';

import { useState, useRef } from 'react';
import { Table, Tooltip, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Eye, FileSignature, Copy, UserPlus, Upload as UploadIcon,
  FileText, CheckCircle, Clock, X,
  Pencil, Trash2, Share2, Diamond, ChevronDown, ChevronUp, NotebookPen,
} from 'lucide-react';
import type { Order, OrderStatus, Tag, Clerk } from '@/types';
import { tags as initialTags } from '@/data/mockData';
import Pagination from './Pagination';
import OrderDetailModal from './OrderDetailModal';
import NoteModal from './NoteModal';
import ClerkShareModal from './ClerkShareModal';
import AssignClerkModal from './AssignPersonnelDrawer';
import AddClerkModal from './AddClerkModal';
import CreateTagModal from './CreateTagModal';
import TagFilterDropdown from './TagFilterDropdown';

interface OrdersTableProps {
  orders: Order[];
}

const USERS_PER_PAGE = 3;

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'Cancelled', label: 'Cancelled', color: '#DC2626' },
  { value: 'Order Placed', label: 'Order Placed', color: '#16A34A' },
  { value: 'Payment Completed', label: 'Payment Completed', color: '#D97706' },
];

const STATUS_PILLS: Record<OrderStatus, { bg: string; text: string }> = {
  Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  'Order Placed': { bg: '#D1FAE5', text: '#065F46' },
  'Payment Completed': { bg: '#FEF3C7', text: '#92400E' },
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteTargetOrder, setNoteTargetOrder] = useState<Order | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [ecopyFiles, setEcopyFiles] = useState<Record<string, string>>({});
  const ecopyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    orders.forEach((o) => {
      if (o.note) initial[o.id] = o.note;
    });
    return initial;
  });

  const [availableTags, setAvailableTags] = useState<Tag[]>(initialTags);
  const [rowTags, setRowTags] = useState<Record<string, Tag[]>>(() => {
    const initial: Record<string, Tag[]> = {};
    orders.forEach((o) => {
      initial[o.id] = [...o.tags];
    });
    return initial;
  });

  const [tagSelectRowId, setTagSelectRowId] = useState<string | null>(null);

  const [createTagOpen, setCreateTagOpen] = useState(false);

  const [rowStatus, setRowStatus] = useState<Record<string, OrderStatus>>(() => {
    const initial: Record<string, OrderStatus> = {};
    orders.forEach((o) => { initial[o.id] = o.status; });
    return initial;
  });
  const [openStatusRowId, setOpenStatusRowId] = useState<string | null>(null);

  const [assignClerkOrder, setAssignClerkOrder] = useState<Order | null>(null);
  const [assignClerkOpen, setAssignClerkOpen] = useState(false);
  const [addClerkOpen, setAddClerkOpen] = useState(false);

  const [rowClerks, setRowClerks] = useState<Record<string, Clerk>>(() => {
    const initial: Record<string, Clerk> = {};
    orders.forEach((o) => { if (o.clerk) initial[o.id] = o.clerk; });
    return initial;
  });

  const [shareOrder, setShareOrder] = useState<Order | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const totalPages = Math.ceil(orders.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + USERS_PER_PAGE);

  const handleRemoveTag = (orderId: string, tagId: string) => {
    setRowTags((prev) => ({
      ...prev,
      [orderId]: (prev[orderId] || []).filter((t) => t.id !== tagId),
    }));
  };

  const handleCreateTag = (newTag: Tag) => {
    setAvailableTags((prev) => [...prev, newTag]);
    if (tagSelectRowId) {
      setRowTags((prev) => ({
        ...prev,
        [tagSelectRowId]: [...(prev[tagSelectRowId] || []), newTag],
      }));
    }
  };

  const handleQuickTagToggle = (orderId: string, tagId: string) => {
    setRowTags((prev) => {
      const current = prev[orderId] || [];
      const tag = availableTags.find((t) => t.id === tagId);
      if (!tag) return prev;
      const exists = current.find((t) => t.id === tagId);
      if (exists) {
        return { ...prev, [orderId]: current.filter((t) => t.id !== tagId) };
      }
      return { ...prev, [orderId]: [...current, tag] };
    });
  };

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
      key: 'courtComplex',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', lineHeight: 1.4 }}>
            {record.courtComplex.name}
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
            {record.courtComplex.location}
          </div>
        </div>
      ),
    },
    {
      title: 'Products',
      key: 'products',
      width: 220,
      render: (_, record) => {
        const p = record.products[0];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', lineHeight: 1.4 }}>
              {p.classification} {p.trackingToken}
            </div>
            {p.classification === 'Other' && p.subClause && (
              <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4, marginTop: 1 }}>
                {p.subClause}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#374151', marginTop: 1 }}>
              {p.amount}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
    },
    {
      title: 'Status',
      key: 'status',
      width: 220,
      render: (_, record) => {
        const current = rowStatus[record.id] || 'Order Placed';
        const isOpen = openStatusRowId === record.id;
        const pill = STATUS_PILLS[current];
        return (
          <div style={{ position: 'relative', width: '100%' }}>
            <button
              onClick={() => setOpenStatusRowId(isOpen ? null : record.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '7px 12px',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                color: '#374151',
                fontFamily: 'inherit',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Update status
              {isOpen ? <ChevronUp size={12} color="#9CA3AF" /> : <ChevronDown size={12} color="#9CA3AF" />}
            </button>
            <div style={{ marginTop: 11 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: pill.bg,
                  color: pill.text,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                {current}
              </span>
            </div>
            {isOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 4,
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #F3F4F6',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)',
                  padding: 4,
                  zIndex: 100,
                  minWidth: 150,
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setRowStatus((prev) => ({ ...prev, [record.id]: opt.value }));
                      setOpenStatusRowId(null);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '7px 12px',
                      border: 'none',
                      borderRadius: 6,
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: opt.color,
                      fontWeight: current === opt.value ? 700 : 500,
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      },
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
      key: 'tagsNote',
      width: 240,
      render: (_, record) => {
        const currentTags = rowTags[record.id] || [];
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: currentTags.length > 0 ? 6 : 0 }}>
              <TagFilterDropdown
                tags={availableTags}
                selectedIds={(rowTags[record.id] || []).map((t) => t.id)}
                onToggle={(tagId) => handleQuickTagToggle(record.id, tagId)}
                onCreateNew={() => {
                  setTagSelectRowId(record.id);
                  setCreateTagOpen(true);
                }}
              >
                <button className="choose-tag-btn">
                  Choose Tag
                  <ChevronDown size={12} />
                </button>
              </TagFilterDropdown>
              <Tooltip title="Add Note">
                <button
                  className="tags-note-action-btn"
                  onClick={() => {
                    setNoteTargetOrder(record);
                    setNoteModalOpen(true);
                  }}
                >
                  <NotebookPen size={16} />
                </button>
              </Tooltip>
            </div>
            {currentTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {currentTags.map((tag) => (
                  <span
                    key={tag.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: tag.color,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {tag.name}
                    <X
                      size={10}
                      style={{ cursor: 'pointer', opacity: 0.7 }}
                      onClick={() => handleRemoveTag(record.id, tag.id)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>CLERK</span>
          <Diamond size={10} fill="#9CA3AF" color="#9CA3AF" />
        </div>
      ),
      key: 'clerk',
      width: 200,
      render: (_, record) => {
        const clerk = rowClerks[record.id];
        const hasClerk = !!clerk;
        const clerkName = hasClerk ? clerk.name.split(' ')[0] : '';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {hasClerk ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                  {clerkName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tooltip title="Edit">
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 2 }}
                      onClick={() => {
                        setAssignClerkOrder(record);
                        setAssignClerkOpen(true);
                      }}
                    >
                      <Pencil size={13} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 2 }}
                      onClick={() => {
                        setRowClerks((prev) => {
                          const next = { ...prev };
                          delete next[record.id];
                          return next;
                        });
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Share">
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 2 }}
                      onClick={() => {
                        setShareOrder(record);
                        setShareModalOpen(true);
                      }}
                    >
                      <Share2 size={13} />
                    </button>
                  </Tooltip>
                </div>
              </>
            ) : (
              <button
                className="action-btn assign"
                style={{ width: '100%', justifyContent: 'center', gap: 6 }}
                onClick={() => {
                  setAssignClerkOrder(record);
                  setAssignClerkOpen(true);
                }}
              >
                <UserPlus size={14} />
                Assign
              </button>
            )}
          </div>
        );
      },
    },
    {
      title: 'ECopy',
      key: 'ecopy',
      width: 100,
      render: (_, record) => {
        const uploaded = ecopyFiles[record.id];

        if (uploaded) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={14} style={{ color: '#10B981' }} />
              <span style={{ fontSize: 12, color: '#065F46' }}>Uploaded</span>
            </div>
          );
        }

        if (uploadingId === record.id) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: 12, color: '#92400E' }}>Uploading...</span>
            </div>
          );
        }

        return (
          <Upload
            accept=".pdf,.doc,.docx,.jpg,.png"
            showUploadList={false}
            beforeUpload={(file) => {
              setUploadingId(record.id);
              const timer = setTimeout(() => {
                setEcopyFiles((prev) => ({ ...prev, [record.id]: file.name }));
                setUploadingId(null);
                message.success(`${file.name} uploaded successfully`);
              }, 1200);
              ecopyTimerRef.current = timer;
              return false;
            }}
          >
            <button className="action-btn assign" style={{ fontSize: 11, padding: '3px 10px' }}>
              <UploadIcon size={12} />
              Upload
            </button>
          </Upload>
        );
      },
    },
    {
      title: 'Note',
      key: 'note',
      width: 80,
      render: (_, record) => {
        const hasNote = !!notes[record.id];
        return (
          <Tooltip title={hasNote ? 'Edit Note' : 'Add Note'}>
            <button
              className="action-btn"
              style={{
                border: 'none',
                background: 'transparent',
                padding: '4px 8px',
                color: hasNote ? '#3A1534' : 'var(--text-secondary)',
              }}
              onClick={() => {
                setNoteTargetOrder(record);
                setNoteModalOpen(true);
              }}
            >
              <FileText size={16} />
            </button>
          </Tooltip>
        );
      },
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
      {noteTargetOrder && (
        <NoteModal
          open={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          orderId={noteTargetOrder.id}
          initialNote={notes[noteTargetOrder.id]}
          onSave={(orderId, note) => {
            setNotes((prev) => ({ ...prev, [orderId]: note }));
          }}
        />
      )}
      <CreateTagModal
        open={createTagOpen}
        onClose={() => {
          setCreateTagOpen(false);
        }}
        onSave={(tag) => {
          handleCreateTag(tag);
        }}
      />
      {shareOrder && (
        <ClerkShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          order={shareOrder}
        />
      )}
      {assignClerkOrder && (
        <>
          <AssignClerkModal
            open={assignClerkOpen}
            onClose={() => setAssignClerkOpen(false)}
            onAssign={(clerk) => {
              setRowClerks((prev) => ({ ...prev, [assignClerkOrder.id]: clerk }));
            }}
            onAddNew={() => {
              setAssignClerkOpen(false);
              setAddClerkOpen(true);
            }}
          />
          <AddClerkModal
            open={addClerkOpen}
            onClose={() => setAddClerkOpen(false)}
            onBack={() => {
              setAddClerkOpen(false);
              setAssignClerkOpen(true);
            }}
          />
        </>
      )}
    </>
  );
}

'use client';

import { useState, useRef, useMemo, useCallback, memo } from 'react';
import { Table, Tooltip, Upload, Modal, message, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Eye, FileSignature, Copy, UserPlus, Upload as UploadIcon,
  CheckCircle, Clock, X, Calendar, FileText,
  Pencil, Trash2, Share2, Diamond, ChevronDown, ChevronUp, NotebookPen,
} from 'lucide-react';
import type { Order, OrderStatus, Tag, Clerk } from '@/types';
import { tags as initialTags } from '@/data/mockData';

import OrderDetailModal from './OrderDetailModal';
import NoteModal from './NoteModal';
import ClerkShareModal from './ClerkShareModal';
import AssignClerkModal from './AssignPersonnelDrawer';
import AddClerkModal from './AddClerkModal';
import CreateTagModal from './CreateTagModal';
import EditTagModal from './EditTagModal';
import TagFilterDropdown from './TagFilterDropdown';

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const USERS_PER_PAGE = 3;

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'Cancelled', label: 'Cancelled', color: '#DC2626' },
  { value: 'Order Placed', label: 'Order Placed', color: '#16A34A' },
  { value: 'Payment Completed', label: 'Payment Completed', color: '#D97706' },
];

const parseDate = (dateStr: string): Date => {
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const [day, mon, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[mon], parseInt(day));
};

const daysSince = (dateStr: string): number => {
  const today = new Date(2026, 5, 20);
  const d = parseDate(dateStr);
  return Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
};

const generateTime = (orderId: number): string => {
  const h = ((orderId * 7) % 12) + 1;
  const m = ((orderId * 13) % 60).toString().padStart(2, '0');
  const ampm = (orderId * 7) % 2 === 0 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
};

const STATUS_PILLS: Record<OrderStatus, { bg: string; text: string }> = {
  Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  'Order Placed': { bg: '#D1FAE5', text: '#065F46' },
  'Payment Completed': { bg: '#FEF3C7', text: '#92400E' },
};

const OrdersTable = memo(function OrdersTable({ orders, currentPage, onPageChange }: OrdersTableProps) {
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
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [editTagOpen, setEditTagOpen] = useState(false);

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

  const [copyAddressRowId, setCopyAddressRowId] = useState<string | null>(null);

  const totalPages = Math.ceil(orders.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + USERS_PER_PAGE);

  const handleRemoveTag = useCallback((orderId: string, tagId: string) => {
    setRowTags((prev) => ({
      ...prev,
      [orderId]: (prev[orderId] || []).filter((t) => t.id !== tagId),
    }));
  }, []);

  const handleCreateTag = useCallback((newTag: Tag) => {
    setAvailableTags((prev) => [...prev, newTag]);
    if (tagSelectRowId) {
      setRowTags((prev) => ({
        ...prev,
        [tagSelectRowId]: [...(prev[tagSelectRowId] || []), newTag],
      }));
    }
  }, [tagSelectRowId]);

  const handleEditTag = useCallback((tag: Tag) => {
    setEditTag(tag);
    setEditTagOpen(true);
  }, []);

  const handleSaveEditTag = useCallback((updated: Tag) => {
    setAvailableTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setRowTags((prev) => {
      const next: Record<string, Tag[]> = {};
      for (const [orderId, tags] of Object.entries(prev)) {
        next[orderId] = tags.map((t) => (t.id === updated.id ? updated : t));
      }
      return next;
    });
  }, []);

  const handleDeleteTag = useCallback((tagId: string) => {
    Modal.confirm({
      title: 'Delete Tag',
      content: 'Are you sure you want to delete this tag? It will be removed from all orders.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        setAvailableTags((prev) => prev.filter((t) => t.id !== tagId));
        setRowTags((prev) => {
          const next: Record<string, Tag[]> = {};
          for (const [orderId, tags] of Object.entries(prev)) {
            next[orderId] = tags.filter((t) => t.id !== tagId);
          }
          return next;
        });
      },
    });
  }, []);

  const handleQuickTagToggle = useCallback((orderId: string, tagId: string) => {
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
  }, [availableTags]);

  const columns: ColumnsType<Order> = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_: unknown, __: unknown, index: number) => (
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12 }}>
          {startIndex + index + 1}
        </span>
      ),
    },
    {
      title: 'User Info',
      key: 'userInfo',
      width: 240,
      render: (_, record) => (
        <div className="user-info-cell">
          <div className="user-avatar">
            {record.userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="user-info-body">
            <div className="user-name">{record.userInfo.name}</div>
            <div className="user-phone">{record.userInfo.phone}</div>
            <div className="user-order-id">#{record.orderId}</div>
            <Popover
              open={copyAddressRowId === record.id}
              onOpenChange={(visible) => {
                if (!visible) setCopyAddressRowId(null);
              }}
              placement="top"
              overlayStyle={{ zIndex: 1060 }}
              content={
                <div style={{ width: 280, padding: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                    {record.userInfo.name}
                  </div>
                  <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {record.address || ''}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                    {record.userInfo.phone || ''}
                  </div>
                </div>
              }
            >
              <button
                className="copy-address-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (copyAddressRowId === record.id) {
                    setCopyAddressRowId(null);
                  } else {
                    setCopyAddressRowId(record.id);
                    const fullAddress = `${record.userInfo.name}\n\n${record.address || ''}\n\n${record.userInfo.phone || ''}`;
                    navigator.clipboard.writeText(fullAddress);
                    message.success('Address copied successfully!');
                  }
                }}
              >
                <Copy size={11} />
                Copy Address
              </button>
            </Popover>
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
          <div style={{ fontWeight: 600, fontSize: 12, color: '#111827', lineHeight: 1.3 }}>
            {record.courtComplex.name}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
            {record.courtComplex.location}
          </div>
        </div>
      ),
    },
    {
      title: 'Products',
      key: 'products',
      width: 200,
      render: (_, record) => {
        const p = record.products[0];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 11, color: '#111827', lineHeight: 1.3 }}>
              {p.classification} {p.trackingToken}
            </div>
            {p.classification === 'Other' && p.subClause && (
              <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.3 }}>
                {p.subClause}
              </div>
            )}
            <div style={{ fontSize: 11, color: '#374151' }}>
              {p.amount}
            </div>
          </div>
        );
      },
    },
    {
      title: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>ORDER DATE</span>
          <Calendar size={12} style={{ color: '#9CA3AF' }} />
        </div>
      ),
      key: 'orderDate',
      width: 130,
      render: (_, record) => {
        const elapsed = daysSince(record.orderDate);
        const status = rowStatus[record.id] || record.status;
        const showElapsed = status !== 'Cancelled';
        const isWarning = status === 'Order Placed';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#111827', lineHeight: 1.4 }}>
              {record.orderDate}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4 }}>
              {generateTime(record.orderId)}
            </div>
            {showElapsed && (
              <div style={{ fontSize: 10, lineHeight: 1.4, marginTop: 1 }}>
                <span style={{ fontWeight: 700, color: isWarning ? '#DC2626' : '#D97706' }}>
                  {elapsed.toString().padStart(2, '0')}
                </span>
                <span style={{ color: '#6B7280' }}>{' '}days since payment</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 190,
      render: (_, record) => {
        const current = rowStatus[record.id] || 'Order Placed';
        const isOpen = openStatusRowId === record.id;
        const pill = STATUS_PILLS[current];
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenStatusRowId(isOpen ? null : record.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 11,
                color: '#374151',
                fontFamily: 'inherit',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Update status
              {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: pill.bg,
                  color: pill.text,
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
                  minWidth: 140,
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
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: 6,
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 11,
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
      title: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.25 }}>
          <span>ORDER DETAILS/</span>
          <span style={{ fontSize: 10, letterSpacing: '0.06em' }}>E-SIGN</span>
        </div>
      ),
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <Tooltip title="View Details">
            <button
              className="action-btn"
              style={{ padding: '3px 8px', fontSize: 10, gap: 3 }}
              onClick={() => {
                setSelectedOrder(record);
                setDetailOpen(true);
              }}
            >
              <Eye size={12} />
              View
            </button>
          </Tooltip>
          {record.hasEsign && (
            <Tooltip title="E-sign">
              <button className="action-btn esign" style={{ padding: '3px 8px', fontSize: 10, gap: 3 }}>
                <FileSignature size={12} />
                Sign
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Tags / Note',
      key: 'tagsNote',
      width: 220,
      render: (_, record) => {
        const currentTags = rowTags[record.id] || [];
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: currentTags.length > 0 ? 4 : 0 }}>
              <TagFilterDropdown
                tags={availableTags}
                selectedIds={(rowTags[record.id] || []).map((t) => t.id)}
                onToggle={(tagId) => handleQuickTagToggle(record.id, tagId)}
                onCreateNew={() => {
                  setTagSelectRowId(record.id);
                  setCreateTagOpen(true);
                }}
                onEdit={handleEditTag}
                onDelete={handleDeleteTag}
              >
                <button className="choose-tag-btn" style={{ padding: '2px 8px', fontSize: 10, gap: 4 }}>
                  Choose Tag
                  <ChevronDown size={10} />
                </button>
              </TagFilterDropdown>
              <Tooltip title="Add Note">
                <button
                  className="tags-note-action-btn"
                  style={{ width: 26, height: 26 }}
                  onClick={() => {
                    setNoteTargetOrder(record);
                    setNoteModalOpen(true);
                  }}
                >
                  <NotebookPen size={14} />
                </button>
              </Tooltip>
            </div>
            {currentTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {currentTags.map((tag) => {
                  const hex = tag.color.replace('#', '');
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  const pastelBg = `rgba(${r}, ${g}, ${b}, 0.15)`;
                  return (
                    <span
                      key={tag.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: pastelBg,
                        color: tag.color,
                        fontSize: 10,
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      {tag.name}
                      <X
                        size={8}
                        style={{ cursor: 'pointer', opacity: 0.6 }}
                        onClick={() => handleRemoveTag(record.id, tag.id)}
                      />
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span>CLERK</span>
          <Diamond size={8} fill="#9CA3AF" color="#9CA3AF" />
        </div>
      ),
      key: 'clerk',
      width: 120,
      render: (_, record) => {
        const clerk = rowClerks[record.id];
        const hasClerk = !!clerk;
        const clerkName = hasClerk ? clerk.name.split(' ')[0] : '';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {hasClerk ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 11, color: '#111827', textAlign: 'center' }}>
                  {clerkName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tooltip title="Edit">
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 1, display: 'flex' }}
                      onClick={() => {
                        setAssignClerkOrder(record);
                        setAssignClerkOpen(true);
                      }}
                    >
                      <Pencil size={11} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 1, display: 'flex' }}
                      onClick={() => {
                        setRowClerks((prev) => {
                          const next = { ...prev };
                          delete next[record.id];
                          return next;
                        });
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Share">
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 1, display: 'flex' }}
                      onClick={() => {
                        setShareOrder(record);
                        setShareModalOpen(true);
                      }}
                    >
                      <Share2 size={11} />
                    </button>
                  </Tooltip>
                </div>
              </>
            ) : (
              <button
                className="action-btn assign"
                style={{ padding: '2px 10px', fontSize: 10, gap: 4, justifyContent: 'center' }}
                onClick={() => {
                  setAssignClerkOrder(record);
                  setAssignClerkOpen(true);
                }}
              >
                <UserPlus size={12} />
                Assign
              </button>
            )}
          </div>
        );
      },
    },
    {
      title: 'E-Copy',
      key: 'ecopy',
      width: 100,
      render: (_, record) => {
        const uploaded = ecopyFiles[record.id];

        if (uploaded) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={14} style={{ color: '#10B981' }} />
            </div>
          );
        }

        if (uploadingId === record.id) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={14} style={{ color: '#F59E0B' }} />
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
              <button
                className="action-btn assign"
                style={{ fontSize: 10, padding: '2px 8px', gap: 3 }}
              >
                <UploadIcon size={11} />
                Upload
              </button>
            </Upload>
          </div>
        );
      },
    },
    {
      title: 'Note',
      key: 'note',
      width: 70,
      render: (_, record) => {
        const hasNote = !!notes[record.id];
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={hasNote ? 'Edit Note' : 'Add Note'}>
              <button
                className="tags-note-action-btn"
                style={{
                  width: 26,
                  height: 26,
                  border: 'none',
                  background: 'transparent',
                  color: hasNote ? '#3A1534' : '#9CA3AF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setNoteTargetOrder(record);
                  setNoteModalOpen(true);
                }}
              >
                <FileText size={14} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ], [startIndex, rowStatus, openStatusRowId, notes, rowTags, availableTags, ecopyFiles, uploadingId, rowClerks]);

  return (
    <>
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={currentOrders}
          rowKey="id"
          pagination={false}
          bordered
          size="middle"
          scroll={{ x: 1610 }}
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
      <EditTagModal
        open={editTagOpen}
        tag={editTag}
        onClose={() => setEditTagOpen(false)}
        onSave={handleSaveEditTag}
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
});

export default OrdersTable;

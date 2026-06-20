'use client';

import { LayoutDashboard, Users, FileText, FolderOpen, Bell, Settings, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Users', active: false },
  { icon: FileText, label: 'Orders', active: false },
  { icon: FolderOpen, label: 'Documents', active: false },
  { icon: Bell, label: 'Notifications', active: false },
  { icon: Settings, label: 'Settings', active: false },
  { icon: ChevronRight, label: 'More', active: false },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <button className="hamburger" onClick={onToggle}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      <div className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/court-logo.png" alt="Court Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
        </div>
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            className={`sidebar-icon-wrap${i === activeIndex ? ' active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <item.icon size={22} strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </>
  );
}

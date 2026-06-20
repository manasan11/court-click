'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import OrdersTable from '@/components/OrdersTable';
import FilterDrawer from '@/components/FilterDrawer';
import { orders } from '@/data/mockData';

const tabs = [
  { label: 'Orders', count: 121 },
  { label: 'Clerks', count: 40 },
  { label: 'Courts', count: 32 },
  { label: 'Districts', count: 14 },
  { label: 'Eligible Users', count: 11 },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-layout">
        <DashboardHeader onFilterClick={() => setFilterOpen(true)} />
        <div className="tabs-container">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              className={`tab-pill${i === activeTab ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.label}
              <span className="tab-count">({tab.count})</span>
            </button>
          ))}
        </div>
        <OrdersTable orders={orders} />
      </div>
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
    </>
  );
}

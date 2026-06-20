'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import OrdersTable from '@/components/OrdersTable';
import Pagination from '@/components/Pagination';
import FilterModal from '@/components/FilterModal';
import { orders } from '@/data/mockData';

const tabs = [
  { label: 'Orders', count: 121 },
  { label: 'Clerks', count: 40 },
  { label: 'Courts', count: 32 },
  { label: 'Districts', count: 14 },
  { label: 'Eligible Users', count: 11 },
];

const USERS_PER_PAGE = 3;

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(orders.length / USERS_PER_PAGE);

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
        <OrdersTable orders={orders} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
      <div className="page-footer">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      <FilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
    </>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import OrdersTable from '@/components/OrdersTable';
import Pagination from '@/components/Pagination';
import FilterModal from '@/components/FilterModal';
import type { FilterState } from '@/components/FilterModal';
import { orders } from '@/data/mockData';

const tabs = [
  { label: 'Orders', count: 121 },
  { label: 'Clerks', count: 40 },
  { label: 'Courts', count: 32 },
  { label: 'Districts', count: 14 },
  { label: 'Eligible Users', count: 11 },
];

const USERS_PER_PAGE = 3;

const defaultFilters: FilterState = {
  district: undefined,
  court: undefined,
  product: 'All',
  statuses: [],
  tagIds: [],
  testUsers: false,
};

const courtValueMap: Record<string, string> = {
  'delhi-district': 'District Court, Dwarka',
  'bombay-hc': 'Bombay High Court',
  'karnataka-hc': 'Karnataka High Court',
  'rajasthan-hc': 'Rajasthan High Court',
  'madras-hc': 'Madras High Court',
  'calcutta-hc': 'Calcutta High Court',
};

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('All Orders');
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>(defaultFilters);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (typeFilter !== 'All Orders') {
      result = result.filter((o) =>
        o.products.some((p) => p.classification === typeFilter),
      );
    }

    if (advancedFilters.district) {
      const districtLower = advancedFilters.district.toLowerCase();
      result = result.filter((o) =>
        o.courtComplex.location.toLowerCase() === districtLower,
      );
    }

    if (advancedFilters.court) {
      const courtName = courtValueMap[advancedFilters.court];
      if (courtName) {
        result = result.filter((o) => o.courtComplex.name === courtName);
      }
    }

    if (advancedFilters.statuses.length > 0) {
      result = result.filter((o) =>
        advancedFilters.statuses.includes(o.status),
      );
    }

    if (advancedFilters.tagIds.length > 0) {
      result = result.filter((o) =>
        advancedFilters.tagIds.some((tagId) =>
          o.tags.some((t) => t.id === tagId),
        ),
      );
    }

    return result;
  }, [typeFilter, advancedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / USERS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredOrders.length, currentPage, totalPages]);

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAdvancedFilters(filters);
    setCurrentPage(1);
  };

  return (
    <>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-layout">
        <DashboardHeader
          onFilterClick={() => setFilterOpen(true)}
          selectedType={typeFilter}
          onTypeChange={handleTypeChange}
        />
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
        <OrdersTable orders={filteredOrders} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
      <div className="page-footer">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
}

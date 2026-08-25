'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  urgencyFilter: string;
  onUrgencyChange: (urgency: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  urgencyFilter,
  onUrgencyChange,
  categoryFilter,
  onCategoryChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="card-dispatch p-3.5 space-y-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Monospace Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH DISPATCH FEED..."
            className="w-full bg-[#0F1115] border-2 border-[#2B2E37] rounded-[2px] pl-9 pr-3 py-2 text-xs font-mono text-[#EDEAE2] placeholder-slate-500 focus:outline-none focus:border-[#EDEAE2]"
          />
        </div>

        {/* Filter Dropdowns & Reset */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono text-xs">
          {/* Status Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[10px] uppercase hidden sm:inline">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-[#0F1115] border-2 border-[#2B2E37] text-[#EDEAE2] text-xs font-mono rounded-[2px] px-2.5 py-1.5 focus:outline-none focus:border-[#EDEAE2]"
            >
              <option value="all">ALL STATUSES</option>
              <option value="new">NEW</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="escalated">ESCALATED</option>
              <option value="resolved">RESOLVED</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[10px] uppercase hidden sm:inline">URGENCY:</span>
            <select
              value={urgencyFilter}
              onChange={(e) => onUrgencyChange(e.target.value)}
              className="bg-[#0F1115] border-2 border-[#2B2E37] text-[#EDEAE2] text-xs font-mono rounded-[2px] px-2.5 py-1.5 focus:outline-none focus:border-[#EDEAE2]"
            >
              <option value="all">ALL URGENCIES</option>
              <option value="high">HIGH URGENCY</option>
              <option value="medium">MEDIUM URGENCY</option>
              <option value="low">LOW URGENCY</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[10px] uppercase hidden sm:inline">CATEGORY:</span>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-[#0F1115] border-2 border-[#2B2E37] text-[#EDEAE2] text-xs font-mono rounded-[2px] px-2.5 py-1.5 focus:outline-none focus:border-[#EDEAE2]"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="billing">BILLING</option>
              <option value="technical">TECHNICAL</option>
              <option value="complaint">COMPLAINT</option>
              <option value="general">GENERAL</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="btn-brutal-dark px-2.5 py-1 text-xs font-display flex items-center gap-1"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
}

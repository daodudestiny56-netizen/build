'use client';

import React from 'react';

interface StatBarProps {
  stats: {
    total: number;
    open: number;
    escalated: number;
    resolved_today: number;
    urgent: number;
  };
  activeFilterStatus: string;
  onSelectFilterStatus: (status: string) => void;
}

export default function StatBar({ stats, activeFilterStatus, onSelectFilterStatus }: StatBarProps) {
  const isEscalatedAlert = stats.escalated > 0;
  const isUrgentAlert = stats.urgent > 0;

  const cards = [
    {
      id: 'all',
      label: 'TOTAL CASES',
      value: stats.total,
      borderClass: 'border-2 border-[#2B2E37]',
      bgClass: 'bg-[#17191F]',
      textClass: 'text-[#EDEAE2]',
    },
    {
      id: 'open',
      label: 'OPEN QUEUE',
      value: stats.open,
      borderClass: 'border-2 border-[#EDEAE2]',
      bgClass: 'bg-[#17191F]',
      textClass: 'text-[#EDEAE2]',
    },
    {
      id: 'urgent',
      label: 'HIGH URGENCY',
      value: stats.urgent,
      borderClass: isUrgentAlert ? 'border-3 border-[#FF4405] shadow-[4px_4px_0px_#FF4405]' : 'border-2 border-[#2B2E37]',
      bgClass: isUrgentAlert ? 'bg-[#17191F]' : 'bg-[#17191F]',
      textClass: isUrgentAlert ? 'text-[#FF4405]' : 'text-slate-300',
    },
    {
      id: 'escalated',
      label: 'ESCALATED [SLA BREACH]',
      value: stats.escalated,
      borderClass: isEscalatedAlert ? 'border-3 border-[#FF4405] bg-[#17191F] shadow-[4px_4px_0px_#FF4405]' : 'border-2 border-[#2B2E37]',
      bgClass: 'bg-[#17191F]',
      textClass: isEscalatedAlert ? 'text-[#FF4405] font-extrabold' : 'text-slate-300',
    },
    {
      id: 'resolved',
      label: 'RESOLVED TODAY',
      value: stats.resolved_today,
      borderClass: 'border-2 border-[#3DDC97]',
      bgClass: 'bg-[#17191F]',
      textClass: 'text-[#3DDC97]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const isSelected = activeFilterStatus === card.id || (card.id === 'open' && activeFilterStatus === 'in_progress');

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilterStatus(card.id === 'open' ? 'in_progress' : card.id)}
            className={`p-3.5 text-left rounded-[2px] shadow-[3px_3px_0px_#000000] transition-all relative cursor-pointer ${
              card.bgClass
            } ${card.borderClass} ${
              isSelected ? 'ring-2 ring-[#EDEAE2] translate-x-[-1px] translate-y-[-1px]' : 'hover:border-[#EDEAE2]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
            </div>
            <div className={`font-mono text-2xl font-bold tracking-tight ${card.textClass}`}>
              {String(card.value).padStart(2, '0')}
            </div>
          </button>
        );
      })}
    </div>
  );
}

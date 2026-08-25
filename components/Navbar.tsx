'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  RefreshCw,
  Clock,
  Layers,
  PlusSquare,
  Users,
  FileText,
  Inbox,
} from 'lucide-react';

interface NavbarProps {
  onManualRefresh?: () => void;
  isPollingActive?: boolean;
  onTogglePolling?: () => void;
  lastEscalateCheckTime?: string | null;
}

export default function Navbar({
  onManualRefresh,
  isPollingActive = true,
  onTogglePolling,
}: NavbarProps) {
  const pathname = usePathname();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'DISPATCH FEED', icon: Layers },
    { href: '/intake', label: 'NEW INTAKE', icon: PlusSquare },
    { href: '/cases', label: 'CASES QUEUE', icon: Inbox },
    { href: '/customers', label: 'CRM DIRECTORY', icon: Users },
    { href: '/deliverables', label: 'DELIVERABLES', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#17191F] border-b-2 border-[#EDEAE2] text-[#EDEAE2] px-4 py-2.5 shadow-[0_4px_0_#000000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Stamp Wordmark & Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-1.5 bg-[#FF4405] text-[#0F1115] border-2 border-[#EDEAE2] rounded-[2px] shadow-[2px_2px_0px_#EDEAE2] group-hover:translate-x-[-1px]">
              <ShieldAlert className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-display text-lg font-bold tracking-tight text-[#EDEAE2]">
                  TRIAGE
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#0F1115] border border-[#2B2E37] text-[#3DDC97]">
                  DISPATCH
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-1 font-mono text-xs overflow-x-auto max-w-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 border font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#EDEAE2] text-[#0F1115] border-[#EDEAE2] shadow-[2px_2px_0px_#FF4405]'
                      : 'bg-[#0F1115] text-[#EDEAE2] border-[#2B2E37] hover:border-[#EDEAE2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Time & Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* SLA Clock & Polling Status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-[2px] bg-[#0F1115] border-2 border-[#2B2E37] font-mono">
            {onTogglePolling && (
              <button
                onClick={onTogglePolling}
                className={`w-2.5 h-2.5 border border-[#EDEAE2] ${
                  isPollingActive ? 'bg-[#3DDC97]' : 'bg-[#FF4405]'
                }`}
                title="Toggle SLA Daemon"
              />
            )}
            <span className="text-[#EDEAE2] font-semibold text-[11px]">
              SLA: 60S DEMO
            </span>
            <span className="text-[#2B2E37]">|</span>
            <span className="text-amber-400 font-mono font-bold text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {timeStr}
            </span>
          </div>

          {/* Refresh Button */}
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              className="p-1.5 text-[#EDEAE2] bg-[#0F1115] border-2 border-[#2B2E37] hover:border-[#EDEAE2] transition"
              title="Force Sync Feed"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

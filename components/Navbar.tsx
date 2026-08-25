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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
    <header className="sticky top-0 z-40 bg-[#16181E] border-b-3 border-[#F4F0EA] text-[#F4F0EA] px-3 sm:px-4 py-2.5 shadow-[0_4px_0_#000000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Stamp Wordmark */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-1.5 bg-[#FF3B00] text-[#0D0E12] border-2 border-[#F4F0EA] rounded-[2px] shadow-[2px_2px_0px_#000000] group-hover:translate-x-[-1px]">
            <ShieldAlert className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-display text-lg font-bold tracking-tight text-[#F4F0EA]">
                TRIAGE
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#0D0E12] border border-[#262933] text-[#00E676]">
                3D DISPATCH
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1.5 font-mono text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 border-2 font-bold flex items-center space-x-1.5 transition ${
                  isActive
                    ? 'bg-[#F4F0EA] text-[#0D0E12] border-[#F4F0EA] shadow-[3px_3px_0px_#FF3B00]'
                    : 'bg-[#0D0E12] text-[#F4F0EA] border-[#262933] hover:border-[#F4F0EA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          {/* SLA Clock & Polling Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-[2px] bg-[#0D0E12] border-2 border-[#262933] font-mono">
            {onTogglePolling && (
              <button
                onClick={onTogglePolling}
                className={`w-2.5 h-2.5 border border-[#F4F0EA] ${
                  isPollingActive ? 'bg-[#00E676]' : 'bg-[#FF3B00]'
                }`}
                title="Toggle SLA Daemon"
              />
            )}
            <span className="text-[#F4F0EA] font-semibold text-[11px]">
              SLA: 60S DEMO
            </span>
            <span className="text-[#262933]">|</span>
            <span className="text-[#FFD600] font-mono font-bold text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {timeStr}
            </span>
          </div>

          {/* Refresh Button */}
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              className="btn-3d-dark p-2"
              title="Force Sync Feed"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex lg:hidden items-center space-x-2">
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              className="btn-3d-dark p-1.5"
              title="Force Sync Feed"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-3d p-1.5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t-2 border-[#262933] bg-[#0D0E12] p-3 space-y-2 font-mono text-xs animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full p-2.5 border-2 font-bold flex items-center space-x-2 transition ${
                  isActive
                    ? 'bg-[#F4F0EA] text-[#0D0E12] border-[#F4F0EA] shadow-[3px_3px_0px_#FF3B00]'
                    : 'bg-[#16181E] text-[#F4F0EA] border-[#262933]'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#262933] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFD600]" /> {timeStr}
            </span>
            <span className="text-[#00E676] font-bold">DAEMON: ACTIVE</span>
          </div>
        </div>
      )}
    </header>
  );
}

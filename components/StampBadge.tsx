'use client';

import React from 'react';

interface StampBadgeProps {
  status: 'new' | 'in_progress' | 'resolved' | 'escalated' | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StampBadge({ status, size = 'md' }: StampBadgeProps) {
  const normStatus = (status || 'new').toLowerCase().replace(' ', '_');

  let stampStyle = 'stamp-new';
  let labelText = 'NEW';

  switch (normStatus) {
    case 'in_progress':
      stampStyle = 'stamp-in-progress';
      labelText = 'IN PROGRESS';
      break;
    case 'escalated':
      stampStyle = 'stamp-escalated';
      labelText = 'ESCALATED';
      break;
    case 'resolved':
      stampStyle = 'stamp-resolved';
      labelText = 'RESOLVED';
      break;
    case 'new':
    default:
      stampStyle = 'stamp-new';
      labelText = 'NEW';
      break;
  }

  let sizeClass = 'text-[10px] px-2 py-0.5 border-[2.5px]';
  if (size === 'sm') sizeClass = 'text-[9px] px-1.5 py-0 border-[2px]';
  if (size === 'lg') sizeClass = 'text-xs px-3 py-1 border-[3.5px] tracking-widest';

  return (
    <span
      className={`stamp-3d ${stampStyle} ${sizeClass} font-display uppercase tracking-wider select-none`}
    >
      {labelText}
    </span>
  );
}

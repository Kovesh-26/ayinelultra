'use client';

import React from 'react';
import Navigation from '../Navigation';
import StudioHeader from '../StudioHeader';
import { cn } from '@/lib/utils';

interface StudioShellProps {
  studio: any;
  rightRail?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function StudioShell({
  studio,
  rightRail,
  children,
  className,
}: StudioShellProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <Navigation />

      {/* Studio Header */}
      <StudioHeader studio={studio} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div
          className={cn(
            'grid gap-6',
            rightRail ? 'lg:grid-cols-4' : '',
            className
          )}
        >
          {/* Main Content */}
          <div className={cn(rightRail ? 'lg:col-span-3' : '')}>{children}</div>

          {/* Right Rail */}
          {rightRail && (
            <aside className="lg:col-span-1 space-y-6">{rightRail}</aside>
          )}
        </div>
      </div>
    </div>
  );
}

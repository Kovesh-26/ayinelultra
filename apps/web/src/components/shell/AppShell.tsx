'use client';

import React from 'react';
import Navigation from '../Navigation';
import { cn } from '@/lib/utils';

interface AppShellProps {
  sidebar?: React.ReactNode;
  rightRail?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({ sidebar, rightRail, children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <Navigation />
      
      <div className="flex">
        {/* Left Sidebar */}
        {sidebar && (
          <aside className="w-64 bg-gray-800 min-h-screen p-4 border-r border-gray-700">
            {sidebar}
          </aside>
        )}
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 p-6",
          rightRail ? "lg:grid lg:grid-cols-4 lg:gap-6" : "",
          className
        )}>
          <div className={cn(
            rightRail ? "lg:col-span-3" : ""
          )}>
            {children}
          </div>
          
          {/* Right Rail */}
          {rightRail && (
            <aside className="lg:col-span-1 space-y-6">
              {rightRail}
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}

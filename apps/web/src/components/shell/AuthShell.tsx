'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AuthShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div
        className={cn(
          'w-full max-w-md',
          'bg-gray-800 rounded-2xl border border-gray-700 shadow-xl',
          'p-8',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

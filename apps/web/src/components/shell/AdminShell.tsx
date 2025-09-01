'use client';

import React from 'react';
import Navigation from '../Navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  UsersIcon, 
  FileTextIcon, 
  ShieldIcon, 
  CreditCardIcon 
} from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
  className?: string;
  headerFilters?: React.ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: FileTextIcon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/content', label: 'Content', icon: FileTextIcon },
  { href: '/admin/moderation', label: 'Moderation', icon: ShieldIcon },
  { href: '/admin/payments', label: 'Payments', icon: CreditCardIcon },
];

export default function AdminShell({ children, className, headerFilters }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <Navigation />
      
      <div className="flex">
        {/* Left Admin Rail */}
        <aside className="w-64 bg-gray-800 min-h-screen p-4 border-r border-gray-700">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Admin Panel</h2>
            <p className="text-sm text-gray-400">Platform management</p>
          </div>
          
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className={cn("flex-1 p-6", className)}>
          {/* Header Filters */}
          {headerFilters && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              {headerFilters}
            </div>
          )}
          
          {/* Data Table Area */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

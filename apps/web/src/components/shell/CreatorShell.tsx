'use client';

import React from 'react';
import Navigation from '../Navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  FileTextIcon, 
  BarChart3Icon, 
  DollarSignIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  MessageSquareIcon, 
  MessageCircleIcon, 
  FolderIcon, 
  SettingsIcon 
} from 'lucide-react';

interface CreatorShellProps {
  children: React.ReactNode;
  className?: string;
}

const creatorNavItems = [
  { href: '/studio/me', label: 'Overview', icon: FileTextIcon },
  { href: '/studio/me/content', label: 'Content', icon: FileTextIcon },
  { href: '/studio/me/analytics', label: 'Analytics', icon: BarChart3Icon },
  { href: '/studio/me/monetization', label: 'Monetization', icon: DollarSignIcon },
  { href: '/studio/me/memberships', label: 'Crew (Memberships)', icon: UsersIcon },
  { href: '/studio/me/store', label: 'Store', icon: ShoppingBagIcon },
  { href: '/studio/me/payouts', label: 'Payouts', icon: CreditCardIcon },
  { href: '/studio/me/community', label: 'Community', icon: MessageSquareIcon },
  { href: '/studio/me/comments', label: 'Comments', icon: MessageCircleIcon },
  { href: '/studio/me/collections', label: 'Collections', icon: FolderIcon },
  { href: '/studio/me/settings', label: 'Settings', icon: SettingsIcon },
];

export default function CreatorShell({ children, className }: CreatorShellProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <Navigation />
      
      <div className="flex">
        {/* Left Creator Navigation */}
        <aside className="w-64 bg-gray-800 min-h-screen p-4 border-r border-gray-700">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Creator Studio</h2>
            <p className="text-sm text-gray-400">Manage your content & audience</p>
          </div>
          
          <nav className="space-y-1">
            {creatorNavItems.map((item) => {
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
          {children}
        </main>
      </div>
    </div>
  );
}

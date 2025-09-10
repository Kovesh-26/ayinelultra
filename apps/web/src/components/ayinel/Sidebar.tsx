import React from 'react';
import { Home, Compass, TrendingUp, Radio, Music, Video, Clock, ThumbsUp, Bookmark, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  active?: string;
}

export function Sidebar({ active = "Home" }: SidebarProps) {
  const mainItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Explore", icon: Compass, href: "/explore" },
    { name: "Trending", icon: TrendingUp, href: "/trending" },
    { name: "Live", icon: Radio, href: "/live" },
    { name: "Music", icon: Music, href: "/music" },
    { name: "Videos", icon: Video, href: "/videos" },
  ];

  const libraryItems = [
    { name: "History", icon: Clock, href: "/history" },
    { name: "Liked", icon: ThumbsUp, href: "/liked" },
    { name: "Collections", icon: Bookmark, href: "/collections" },
  ];

  const settingsItems = [
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Help", icon: HelpCircle, href: "/help" },
  ];

  const renderNavItem = (item: any, isActive: boolean) => (
    <a
      key={item.name}
      href={item.href}
      className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
    >
      <item.icon className="w-5 h-5" />
      <span className="font-medium">{item.name}</span>
    </a>
  );

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 p-3 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => renderNavItem(item, active === item.name))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8"></div>

        {/* Library Section */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
            Library
          </div>
          {libraryItems.map((item) => renderNavItem(item, active === item.name))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8"></div>

        {/* Settings Section */}
        <div className="space-y-1">
          {settingsItems.map((item) => renderNavItem(item, active === item.name))}
        </div>

        {/* Creator Spotlight */}
        <div className="mt-8 p-4 rounded-xl ayinel-glass-strong">
          <div className="text-sm font-semibold text-white mb-2">Creator Spotlight</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500"></div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-white truncate">Alex Chen</div>
                <div className="text-xs text-white/50">Live now</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500"></div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-white truncate">Maya Studio</div>
                <div className="text-xs text-white/50">2.1M crew</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-white/30 space-y-1">
          <div>© 2024 Ayinel</div>
          <div>Creator Platform</div>
        </div>
      </nav>
    </aside>
  );
}

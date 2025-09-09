import React from 'react';

interface SidebarProps {
  active?: string;
}

export function Sidebar({ active = 'Home' }: SidebarProps) {
  const items = ['Home', 'Explore', 'Trending', 'Live', 'Music', 'Videos'];

  const getIcon = (item: string) => {
    switch (item) {
      case 'Home':
        return '🏠';
      case 'Explore':
        return '🧭';
      case 'Trending':
        return '🔥';
      case 'Live':
        return '🔴';
      case 'Music':
        return '🎵';
      case 'Videos':
        return '🎬';
      default:
        return '📄';
    }
  };

  return (
    <aside className="hidden md:block w-56 shrink-0">
      <nav className="sticky top-16 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-default ${
              active === item
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{getIcon(item)}</span>
            <span>{item}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

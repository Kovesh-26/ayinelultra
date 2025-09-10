import React from 'react';

interface SidebarProps {
  active?: string;
}

export function Sidebar({ active = "Home" }: SidebarProps) {
  const items = ["Home", "Explore", "Trending", "Live", "Music", "Videos"];
  
  const getIcon = (item: string) => {
    switch (item) {
      case "Home": return "🏠";
      case "Explore": return "🧭";
      case "Trending": return "🔥";
      case "Live": return "🔴";
      case "Music": return "🎵";
      case "Videos": return "🎬";
      default: return "📄";
    }
  };

  return (
    <aside className="hidden md:block w-56 shrink-0">
      <nav className="sticky top-20 space-y-1">
        {items.map((item) => (
          <div
            key={item}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${
              active === item 
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg" 
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-lg">{getIcon(item)}</span>
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

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
    <aside className="hidden md:block w-64 shrink-0">
      {/* Enhanced Logo Section */}
      <div className="sticky top-16 bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-fuchsia-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-2xl font-bold shadow-lg">👁️</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-25"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Ayinel</h2>
            <p className="text-xs text-white/60">Creator Platform</p>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${
                active === item 
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg" 
                  : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"
              }`}
            >
              <span className={`text-xl transition-transform duration-200 ${
                active === item ? "scale-110" : "group-hover:scale-110"
              }`}>
                {getIcon(item)}
              </span>
              <span className="font-medium">{item}</span>
              {active === item && (
                <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/5">
          <div className="text-xs text-white/50 mb-2">Your Activity</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Videos Watched</span>
              <span className="text-white font-medium">127</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Hours Streamed</span>
              <span className="text-white font-medium">24.5</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

'use client';
import { Bell, Upload, Search } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Navigation() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-700/60 bg-gray-900/70 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center gap-4">
        {/* LEFT: brand */}
        <Logo withWordmark size={32} />

        {/* CENTER: search */}
        <div className="flex-1 max-w-[640px]">
          <div className="relative">
            <input
              placeholder="Search Ayinel..."
              className="w-full bg-gray-800 border border-gray-600 rounded-xl h-10 pl-10 pr-4 outline-none focus:ring-2 focus:ring-cyan-400/40 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* RIGHT: actions */}
        <nav className="flex items-center gap-2">
          <button className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee]">
            Create
          </button>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-gray-800 border border-gray-600 text-white">
            <Upload className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-gray-800 border border-gray-600 text-white">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gray-800 border border-gray-600 grid place-items-center text-white">
            🧑
          </div>
        </nav>
      </div>
    </header>
  );
}

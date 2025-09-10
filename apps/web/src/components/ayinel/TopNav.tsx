import React from 'react';
import { Container } from './Container';
import { Search, Upload, Plus, Menu, Mic, Bell, User } from 'lucide-react';

export function TopNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/8 bg-nav/95 backdrop-blur-xl">
      <Container className="h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Menu className="w-5 h-5 text-white/80" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl ayinel-gradient">
              <span className="text-lg font-bold text-white">👁️</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Ayinel
            </span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex items-center max-w-2xl flex-1 mx-8">
          <div className="flex w-full max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search videos, studios, creators..."
                className="search-modern w-full pl-4 pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors">
                <Search className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <button className="ml-2 p-2.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700/60 border border-white/8 transition-colors">
              <Mic className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Search className="w-5 h-5 text-white/80" />
          </button>
          
          <button className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>
          
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
            <Bell className="w-5 h-5 text-white/80" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
          
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </Container>
    </div>
  );
}

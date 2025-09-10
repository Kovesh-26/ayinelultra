import React from 'react';
import { Container } from './Container';

export function TopNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f14]/80 backdrop-blur">
      <Container className="h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Ayinel Logo with Antennas */}
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              className="text-transparent"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              {/* Antennas */}
              <path
                d="M12 4 L14 8 M20 4 L18 8 M8 6 L10 9 M24 6 L22 9"
                stroke="url(#logoGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Eye Shape */}
              <ellipse
                cx="16"
                cy="16"
                rx="12"
                ry="8"
                fill="none"
                stroke="url(#logoGradient)"
                strokeWidth="2"
              />
              {/* Inner Eye */}
              <ellipse
                cx="16"
                cy="16"
                rx="6"
                ry="4"
                fill="url(#logoGradient)"
                opacity="0.3"
              />
              {/* Pupil */}
              <circle
                cx="16"
                cy="16"
                r="2"
                fill="url(#logoGradient)"
              />
            </svg>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent text-xl font-bold">Ayinel</span>
          </div>
          
          {/* Pill-shaped Search Bar */}
          <div className="ml-6 hidden md:block w-80">
            <input
              placeholder="Search Ayinel..."
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Upload Button - Outlined */}
          <button className="rounded-full border border-white/20 bg-transparent px-6 py-2 text-sm font-medium text-white hover:bg-white/5 hover:border-white/30 transition-all">
            Upload
          </button>
          
          {/* Create Button - Gradient */}
          <button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
            Create
          </button>
          
          {/* Round Avatar Placeholder */}
          <div className="ml-2 h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-white/10" />
          </div>
        </div>
      </Container>
    </div>
  );
}

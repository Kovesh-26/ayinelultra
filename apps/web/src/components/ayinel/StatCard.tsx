import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-fuchsia-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-xs uppercase tracking-widest text-white/70 transition-colors duration-300 group-hover:text-indigo-300">{label}</div>
        <div className="mt-2 text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-105">{value}</div>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]" />
    </div>
  );
}

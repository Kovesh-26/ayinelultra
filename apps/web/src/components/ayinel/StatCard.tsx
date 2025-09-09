import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-white/60 text-sm">{label}</div>
      <div className="text-white text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

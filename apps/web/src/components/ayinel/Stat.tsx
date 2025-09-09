import React from 'react';

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 text-lg">{icon}</div>
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
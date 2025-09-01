import React from 'react';

interface PhotoGridProps {
  count?: number;
}

export function PhotoGrid({ count = 6 }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

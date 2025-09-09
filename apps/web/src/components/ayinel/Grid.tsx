import React from 'react';

interface GridProps {
  children: React.ReactNode;
}

export function Grid({ children }: GridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

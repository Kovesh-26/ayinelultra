import React from 'react';

interface SectionProps {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, right, children }: SectionProps) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white/90">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

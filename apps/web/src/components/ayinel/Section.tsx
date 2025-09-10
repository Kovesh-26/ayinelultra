import React from 'react';

interface SectionProps {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, right, children }: SectionProps) {
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}

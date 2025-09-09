'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryChipsProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => onCategoryChange?.(category)}
            className={cn(
              'px-4 py-2 rounded-lg whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
              selectedCategory === category ||
                (index === 0 && !selectedCategory)
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  stats?: Array<{
    number: string;
    label: string;
    icon: string;
  }>;
}

export default function HeroBanner({ 
  title, 
  subtitle, 
  primaryAction, 
  secondaryAction, 
  stats 
}: HeroBannerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 mb-8 shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
          {subtitle}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex justify-center space-x-4">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
            >
              {primaryAction.label}
            </Link>
          )}
          
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition border border-gray-300"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
      
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.number}</p>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import CreatorShell from '@/components/shell/CreatorShell';
import PageHeader from '@/components/PageHeader';

export default function CreatorStudioPage() {
  const stats = [
    { label: 'Total Views', value: '1.2M', change: '+12%', icon: '👁️' },
    { label: 'Crew Members', value: '2.4K', change: '+8%', icon: '👥' },
    { label: 'Videos', value: '45', change: '+3', icon: '🎬' },
    { label: 'Revenue', value: '$2.8K', change: '+15%', icon: '💰' }
  ];

  const recentVideos = [
    { id: '1', title: 'Building a Next-Gen Studio', views: '12.5K', status: 'Published', date: '2 hours ago' },
    { id: '2', title: 'Live Coding Session', views: '8.2K', status: 'Published', date: '1 day ago' },
    { id: '3', title: 'Tech Review: Latest Gadgets', views: '15.7K', status: 'Published', date: '3 days ago' }
  ];

  return (
    <CreatorShell>
      <PageHeader 
        title="Creator Studio" 
        subtitle="Manage your content, audience, and monetization" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-green-400">{stat.change}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Videos */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Videos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentVideos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{video.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{video.views}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {video.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {video.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition">
              Upload Video
            </button>
            <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              Go Live
            </button>
            <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              Create Collection
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Analytics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">This Week</span>
              <span className="text-white">+12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">This Month</span>
              <span className="text-white">+8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">This Year</span>
              <span className="text-white">+45%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Notifications</h4>
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              <p>🎉 New Crew member joined!</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <div className="text-sm text-gray-300">
              <p>📈 Video reached 10K views</p>
              <p className="text-xs text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </CreatorShell>
  );
}

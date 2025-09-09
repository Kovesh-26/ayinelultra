'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MonetizationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const earningsData = {
    totalEarnings: 2847.5,
    thisMonth: 892.3,
    lastMonth: 756.8,
    pendingPayout: 1245.2,
    currency: 'USD',
  };

  const revenueStreams = [
    { name: 'Ad Revenue', amount: 1247.5, percentage: 43.8, color: '#8B5CF6' },
    {
      name: 'Crew Memberships',
      amount: 892.3,
      percentage: 31.4,
      color: '#EC4899',
    },
    { name: 'Tips', amount: 456.7, percentage: 16.0, color: '#10B981' },
    { name: 'Store Sales', amount: 251.0, percentage: 8.8, color: '#F59E0B' },
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'Tip',
      amount: 25.0,
      from: 'JohnDoe',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: '2',
      type: 'Membership',
      amount: 9.99,
      from: 'MusicLover',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: '3',
      type: 'Ad Revenue',
      amount: 45.67,
      from: 'Platform',
      date: '2024-01-13',
      status: 'pending',
    },
    {
      id: '4',
      type: 'Store Sale',
      amount: 15.99,
      from: 'Fan123',
      date: '2024-01-12',
      status: 'completed',
    },
  ];

  const membershipTiers = [
    {
      id: '1',
      name: 'Fan',
      price: 4.99,
      benefits: ['Exclusive content', 'Early access', 'Chat access'],
      members: 156,
    },
    {
      id: '2',
      name: 'Supporter',
      price: 9.99,
      benefits: ['All Fan benefits', 'Custom badges', 'Priority support'],
      members: 89,
    },
    {
      id: '3',
      name: 'VIP',
      price: 19.99,
      benefits: ['All Supporter benefits', '1-on-1 calls', 'Merchandise'],
      members: 34,
    },
  ];

  const products = [
    {
      id: '1',
      name: 'Custom T-Shirt',
      price: 24.99,
      sales: 45,
      revenue: 1124.55,
    },
    {
      id: '2',
      name: 'Digital Art Pack',
      price: 9.99,
      sales: 128,
      revenue: 1278.72,
    },
    {
      id: '3',
      name: 'Exclusive Video',
      price: 4.99,
      sales: 89,
      revenue: 444.11,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Monetization Dashboard
              </h1>
              <p className="text-gray-300 mt-1">
                Track your earnings and manage revenue streams
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition">
                Request Payout
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition">
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'earnings'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('memberships')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'memberships'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Crew Memberships
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'store'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Store
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Total Earnings
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ${earningsData.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      This Month
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ${earningsData.thisMonth.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Pending Payout
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ${earningsData.pendingPayout.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Crew Members
                    </p>
                    <p className="text-2xl font-bold text-white">279</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Streams Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Revenue Streams
                </h3>
                <div className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: stream.color }}
                        ></div>
                        <span className="text-gray-300">{stream.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          ${stream.amount.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {stream.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {transaction.type}
                        </p>
                        <p className="text-gray-400 text-sm">
                          from {transaction.from}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          ${transaction.amount}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            transaction.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Earnings History
              </h3>
              <div className="flex space-x-4 mb-6">
                {['7d', '30d', '90d', '1y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedPeriod === period
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">
                  Earnings chart will be displayed here
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Memberships Tab */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Crew Membership Tiers
              </h3>
              <Link
                href="/monetization/memberships/create"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
              >
                Create New Tier
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
                >
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {tier.name}
                    </h4>
                    <p className="text-3xl font-bold text-purple-400">
                      ${tier.price}
                    </p>
                    <p className="text-gray-400 text-sm">per month</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-white font-medium">
                      {tier.members} members
                    </p>
                    <p className="text-gray-400 text-sm">
                      ${(tier.price * tier.members).toLocaleString()}/month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Tab */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Store Products
              </h3>
              <Link
                href="/monetization/store/create"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
              >
                Add Product
              </Link>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          ${product.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {product.sales}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-medium">
                          ${product.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-purple-400 hover:text-purple-300 mr-3">
                          Edit
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

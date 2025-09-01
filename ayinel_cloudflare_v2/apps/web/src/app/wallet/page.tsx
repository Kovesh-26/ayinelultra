'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, auth, endpoints } from '@/lib/api';

interface Wallet {
  id: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  paymentMethod?: string;
  withdrawalMethod?: string;
}

interface WalletStats {
  currentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'add-funds' | 'withdraw'>('overview');
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'card',
    description: '',
  });

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      window.location.href = '/auth/login';
      return;
    }

    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletResponse, transactionsResponse, statsResponse] = await Promise.all([
        api.get(endpoints.wallet.balance),
        api.get(endpoints.wallet.transactions),
        api.get('/wallet/stats'),
      ]);

      setWallet(walletResponse.data);
      setTransactions(transactionsResponse.data.transactions);
      setStats(statsResponse.data);
    } catch (error: any) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.post(endpoints.wallet.addFunds, {
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        description: formData.description,
      });

      setFormData({ amount: '', paymentMethod: 'card', description: '' });
      loadWalletData();
      setActiveTab('overview');
    } catch (error: any) {
      console.error('Failed to add funds:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Wallet...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-white">
              Ayinel
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-purple-200">Manage your balance and transactions</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '💰' },
            { id: 'transactions', label: 'Transactions', icon: '📊' },
            { id: 'add-funds', label: 'Add Funds', icon: '➕' },
            { id: 'withdraw', label: 'Withdraw', icon: '💸' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Balance Card */}
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-4">Current Balance</h2>
                  <div className="text-5xl font-bold text-white mb-6">
                    {formatCurrency(wallet?.balance || 0)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-purple-200 text-sm">Total Deposits</p>
                      <p className="text-white font-semibold">{formatCurrency(stats?.totalDeposits || 0)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Total Withdrawals</p>
                      <p className="text-white font-semibold">{formatCurrency(stats?.totalWithdrawals || 0)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Total Transfers</p>
                      <p className="text-white font-semibold">{formatCurrency(stats?.totalTransfers || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('add-funds')}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    Add Funds
                  </button>
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className="w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-4 rounded-lg hover:bg-white hover:text-purple-900 transition-all duration-300"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-semibold text-white">Transaction History</h2>
              </div>
              
              <div className="divide-y divide-white/10">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-purple-200">No transactions yet.</p>
                    <button
                      onClick={() => setActiveTab('add-funds')}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Add Funds
                    </button>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT' ? 'bg-green-500/20' :
                          transaction.type === 'WITHDRAWAL' ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          <span className={`text-lg ${
                            transaction.type === 'DEPOSIT' ? 'text-green-400' :
                            transaction.type === 'WITHDRAWAL' ? 'text-red-400' :
                            'text-blue-400'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? '💰' :
                             transaction.type === 'WITHDRAWAL' ? '💸' : '🔄'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{transaction.description}</p>
                          <p className="text-sm text-purple-200">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'DEPOSIT' ? 'text-green-400' :
                          transaction.type === 'WITHDRAWAL' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {transaction.type === 'WITHDRAWAL' ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          transaction.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Add Funds Tab */}
          {activeTab === 'add-funds' && (
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Add Funds</h2>
              
              <form onSubmit={handleAddFunds} className="space-y-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
                    Amount (USD)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-white mb-2">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto">Cryptocurrency</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                    Description (Optional)
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Monthly deposit"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Add Funds
                </button>
              </form>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Withdraw Funds</h2>
              <p className="text-purple-200 mb-6">
                Minimum withdrawal amount: $10.00
              </p>
              
              <div className="text-center">
                <p className="text-purple-200 mb-4">Current Balance</p>
                <p className="text-3xl font-bold text-white mb-6">{formatCurrency(wallet?.balance || 0)}</p>
                
                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                  disabled={(wallet?.balance || 0) < 10}
                >
                  Withdraw Funds
                </button>
                
                <p className="text-sm text-purple-200 mt-4">
                  Withdrawals are processed within 3-5 business days.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

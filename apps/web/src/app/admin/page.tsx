"use client";
import { useState, useEffect } from "react";

interface SystemStats {
  totalUsers: number;
  totalVideos: number;
  totalMusic: number;
  totalLiveStreams: number;
  totalRevenue: number;
  activeUsers: number;
  systemHealth: {
    database: string;
    redis: string;
    externalServices: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
  role: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data from API
    setStats({
      totalUsers: 1250,
      totalVideos: 3400,
      totalMusic: 2100,
      totalLiveStreams: 156,
      totalRevenue: 15420,
      activeUsers: 890,
      systemHealth: {
        database: 'healthy',
        redis: 'healthy',
        externalServices: 'healthy'
      }
    });

    setUsers([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        handle: 'johndoe',
        createdAt: '2024-01-15',
        lastLoginAt: '2024-01-20',
        isActive: true,
        role: 'user'
      }
    ]);

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-4">
        <div className="text-center">Loading admin dashboard...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button className="rounded-xl border px-3 py-2">System Config</button>
          <button className="rounded-xl border px-3 py-2">Maintenance Mode</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex gap-2 border-b">
        {['overview', 'users', 'content', 'analytics', 'developer'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg capitalize ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Stats */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border p-4">
              <div className="text-sm opacity-70">Total Users</div>
              <div className="mt-1 text-2xl font-semibold">{stats?.totalUsers.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-sm opacity-70">Total Videos</div>
              <div className="mt-1 text-2xl font-semibold">{stats?.totalVideos.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-sm opacity-70">Total Music</div>
              <div className="mt-1 text-2xl font-semibold">{stats?.totalMusic.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-sm opacity-70">Total Revenue</div>
              <div className="mt-1 text-2xl font-semibold">${stats?.totalRevenue.toLocaleString()}</div>
            </div>
          </section>

          {/* System Health */}
          <section className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold mb-4">System Health</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats && Object.entries(stats.systemHealth).map(([service, status]) => (
                <div key={service} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="capitalize">{service}</span>
                  <span className="text-sm opacity-70">({status})</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New user registration</span>
                <span className="opacity-70">2 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span>Video upload completed</span>
                <span className="opacity-70">5 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span>Payment processed</span>
                <span className="opacity-70">10 minutes ago</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input className="flex-1 rounded-xl border px-3 py-2" placeholder="Search users..." />
            <select className="rounded-xl border px-3 py-2">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Developer</option>
              <option>User</option>
            </select>
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Last Login</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm opacity-70">@{user.handle}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm opacity-70">
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 hover:underline">Edit</button>
                        <button className="text-sm text-red-600 hover:underline">Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Developer Tab */}
      {activeTab === 'developer' && (
        <div className="space-y-6">
          <section className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold mb-4">Developer Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <h3 className="font-medium mb-2">Database Schema</h3>
                <p className="text-sm opacity-70 mb-3">View and modify database schema</p>
                <button className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm">
                  View Schema
                </button>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-medium mb-2">API Testing</h3>
                <p className="text-sm opacity-70 mb-3">Test API endpoints</p>
                <button className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm">
                  Open Tester
                </button>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-medium mb-2">Performance Monitoring</h3>
                <p className="text-sm opacity-70 mb-3">Monitor system performance</p>
                <button className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm">
                  View Metrics
                </button>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-medium mb-2">Error Logs</h3>
                <p className="text-sm opacity-70 mb-3">View detailed error logs</p>
                <button className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm">
                  View Logs
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Maintenance Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>User Registration</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

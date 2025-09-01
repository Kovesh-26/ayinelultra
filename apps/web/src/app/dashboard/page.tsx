'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Real-time data with advanced animations
  const [liveStats, setLiveStats] = useState({
    viewers: 1247,
    likes: 892,
    comments: 156,
    shares: 43,
    earnings: 1247.89,
    followers: 45678
  });

  const [recentActivity] = useState([
    { id: 1, type: 'video', title: 'New video uploaded', time: '2 min ago', icon: '🎬', color: 'from-purple-500 to-pink-500' },
    { id: 2, type: 'comment', title: 'New comment on video', time: '5 min ago', icon: '💬', color: 'from-blue-500 to-purple-500' },
    { id: 3, type: 'like', title: 'Video reached 1K likes', time: '12 min ago', icon: '❤️', color: 'from-red-500 to-pink-500' },
    { id: 4, type: 'follower', title: 'New follower joined', time: '18 min ago', icon: '👤', color: 'from-green-500 to-blue-500' },
    { id: 5, type: 'earnings', title: 'Earnings milestone reached', time: '25 min ago', icon: '💰', color: 'from-yellow-500 to-orange-500' }
  ]);

  const [performanceData] = useState([
    { day: 'Mon', views: 1200, likes: 450, comments: 89 },
    { day: 'Tue', views: 1800, likes: 670, comments: 120 },
    { day: 'Wed', views: 2100, likes: 890, comments: 156 },
    { day: 'Thu', views: 2400, likes: 1100, comments: 189 },
    { day: 'Fri', views: 2800, likes: 1300, comments: 234 },
    { day: 'Sat', views: 3200, likes: 1500, comments: 289 },
    { day: 'Sun', views: 3600, likes: 1700, comments: 345 }
  ]);

  // Initialize loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Real-time updates
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        viewers: prev.viewers + Math.floor(Math.random() * 20) - 10,
        likes: prev.likes + Math.floor(Math.random() * 10),
        comments: prev.comments + Math.floor(Math.random() * 5),
        shares: prev.shares + Math.floor(Math.random() * 3),
        earnings: prev.earnings + (Math.random() * 2 - 1),
        followers: prev.followers + Math.floor(Math.random() * 5)
      }));
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition(prev => ({
        x: prev.x + (e.clientX - prev.x) * 0.1,
        y: prev.y + (e.clientY - prev.y) * 0.1
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Canvas animation
  const animateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw animated background
    const time = Date.now() * 0.001;
    for (let i = 0; i < 50; i++) {
      const x = (i * 50 + time * 20) % canvas.width;
      const y = Math.sin(time + i * 0.1) * 100 + canvas.height / 2;
      const size = Math.sin(time + i) * 3 + 5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 51, 234, ${0.1 + Math.sin(time + i) * 0.1})`;
      ctx.fill();
    }

    // Draw mouse trail
    ctx.beginPath();
    ctx.arc(mousePosition.x, mousePosition.y, 80, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(147, 51, 234, 0.05)';
    ctx.fill();

    animationRef.current = requestAnimationFrame(animateCanvas);
  }, [mousePosition]);

  useEffect(() => {
    animateCanvas();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateCanvas]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-pink-500 border-b-transparent rounded-full animate-spin mx-auto animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Please log in to access your dashboard</h1>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-pink-500 border-b-transparent rounded-full animate-spin mx-auto animate-pulse"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-blue-500 border-l-transparent rounded-full animate-spin mx-auto animate-pulse delay-1000"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Loading your creative space</h2>
          <p className="text-gray-400">Preparing your next-level dashboard...</p>
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at center, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}
      />

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.03}px)`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: mousePosition.x - 150,
            bottom: mousePosition.y - 150,
            transform: `translate(${-scrollY * 0.03}px, ${scrollY * 0.05}px)`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      {/* Animated Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="relative">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.displayName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-2xl shadow-purple-500/50"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold border-4 border-purple-500 shadow-2xl shadow-purple-500/50">
                    {user.displayName.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-black animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 
                  className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  style={{ transform: `translateY(${scrollY * 0.05}px)` }}
                >
                  Welcome back, {user.displayName}!
                </h1>
                <p className="text-gray-300 text-lg">@{user.handle} • {currentTime.toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Live Now</p>
                <p className="text-xl font-bold text-green-400 animate-pulse">● Broadcasting</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl animate-pulse">
                🔴
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 relative z-10">
        {/* Live Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {[
            { label: 'Live Viewers', value: liveStats.viewers, icon: '👥', color: 'from-purple-500 to-pink-500', trend: '+12%' },
            { label: 'Total Likes', value: liveStats.likes.toLocaleString(), icon: '❤️', color: 'from-red-500 to-pink-500', trend: '+8%' },
            { label: 'Comments', value: liveStats.comments, icon: '💬', color: 'from-blue-500 to-purple-500', trend: '+15%' },
            { label: 'Shares', value: liveStats.shares, icon: '📤', color: 'from-green-500 to-blue-500', trend: '+22%' },
            { label: 'Earnings', value: `$${liveStats.earnings.toFixed(2)}`, icon: '💰', color: 'from-yellow-500 to-orange-500', trend: '+18%' },
            { label: 'Followers', value: liveStats.followers.toLocaleString(), icon: '👑', color: 'from-purple-400 to-pink-400', trend: '+5%' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-6 border border-purple-500/30 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm"
              style={{
                transform: `translateY(${scrollY * 0.02}px)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <span className="text-green-400 text-sm font-bold">{stat.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            { title: 'Upload Video', icon: '🎬', color: 'from-purple-500 to-pink-500', href: '/upload/video', description: 'Share your latest content' },
            { title: 'Go Live', icon: '🔴', color: 'from-red-500 to-pink-500', href: '/live', description: 'Start broadcasting now' },
            { title: 'Create Studio', icon: '🎨', color: 'from-blue-500 to-purple-500', href: '/studio/create', description: 'Build your brand' },
            { title: 'Analytics', icon: '📊', color: 'from-green-500 to-blue-500', href: '/analytics', description: 'View performance data' },
            { title: 'Monetization', icon: '💰', color: 'from-yellow-500 to-orange-500', href: '/monetization', description: 'Manage earnings' },
            { title: 'Community', icon: '💬', color: 'from-purple-400 to-pink-400', href: '/community', description: 'Connect with fans' }
          ].map((action, index) => (
            <Link 
              key={index}
              href={action.href}
              className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm overflow-hidden"
              style={{
                transform: `translateY(${scrollY * 0.03}px)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-300">{action.description}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-purple-400 text-2xl">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 rounded-3xl p-8 border border-purple-500/30 backdrop-blur-sm mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="mr-4">📈</span>
            Performance Analytics
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Weekly Overview</h4>
              <div className="space-y-4">
                {performanceData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="font-medium text-white">{day.day}</span>
                    <div className="flex items-center space-x-6">
                      <span className="text-purple-400">{day.views} views</span>
                      <span className="text-pink-400">{day.likes} likes</span>
                      <span className="text-blue-400">{day.comments} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Avg. Views', value: '2,847', change: '+12%' },
                  { label: 'Engagement', value: '8.4%', change: '+5%' },
                  { label: 'Watch Time', value: '12.3h', change: '+18%' },
                  { label: 'Subscribers', value: '+234', change: '+7%' }
                ].map((stat, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-green-400 text-sm font-bold">{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 rounded-3xl p-8 border border-purple-500/30 backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="mr-4">⚡</span>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id}
                className="flex items-center space-x-6 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center text-xl shadow-lg`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{activity.title}</p>
                  <p className="text-gray-400">{activity.time}</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 animate-bounce hover:animate-spin">
          ⚡
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div 
            className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mt-2 animate-bounce"
            style={{
              transform: `translateY(${Math.min(scrollY / 10, 20)}px)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

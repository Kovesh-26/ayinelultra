'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'tune_in_request' | 'tune_in_accepted' | 'boost' | 'comment' | 'video_upload' | 'live_stream';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  video?: {
    id: string;
    title: string;
    thumbnail: string;
  };
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'tune_ins' | 'boosts'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for development
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "tune_in_request",
        title: "New Tune-In Request",
        message: "Tech Enthusiast wants to tune in to your content",
        createdAt: "2024-01-15T11:30:00Z",
        isRead: false,
        user: {
          id: "user-1",
          username: "tech_enthusiast",
          displayName: "Tech Enthusiast",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
        },
        actionUrl: "/profile/tech_enthusiast"
      },
      {
        id: "notif-2",
        type: "boost",
        title: "New Boost",
        message: "Content Creator Pro boosted your video",
        createdAt: "2024-01-15T10:45:00Z",
        isRead: false,
        user: {
          id: "user-2",
          username: "content_creator",
          displayName: "Content Creator Pro",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
        },
        video: {
          id: "video-1",
          title: "Amazing Ayinel Platform Demo",
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=56&fit=crop"
        },
        actionUrl: "/watch/video-1"
      },
      {
        id: "notif-3",
        type: "comment",
        title: "New Comment",
        message: "Crypto Fan commented on your video",
        createdAt: "2024-01-15T09:20:00Z",
        isRead: true,
        user: {
          id: "user-3",
          username: "crypto_fan",
          displayName: "Crypto Fan",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face"
        },
        video: {
          id: "video-1",
          title: "Amazing Ayinel Platform Demo",
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=56&fit=crop"
        },
        actionUrl: "/watch/video-1"
      },
      {
        id: "notif-4",
        type: "tune_in_accepted",
        title: "Tune-In Accepted",
        message: "GameMaster accepted your tune-in request",
        createdAt: "2024-01-14T16:15:00Z",
        isRead: true,
        user: {
          id: "user-4",
          username: "gamemaster",
          displayName: "GameMaster",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
        },
        actionUrl: "/profile/gamemaster"
      },
      {
        id: "notif-5",
        type: "live_stream",
        title: "Live Stream Started",
        message: "Ayinel Creator is now live streaming",
        createdAt: "2024-01-14T14:30:00Z",
        isRead: true,
        user: {
          id: "user-5",
          username: "ayinel_creator",
          displayName: "Ayinel Creator",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
        },
        actionUrl: "/live/ayinel_creator"
      },
      {
        id: "notif-6",
        type: "boost",
        title: "New Boost",
        message: "Tech Enthusiast boosted your comment",
        createdAt: "2024-01-14T12:45:00Z",
        isRead: true,
        user: {
          id: "user-1",
          username: "tech_enthusiast",
          displayName: "Tech Enthusiast",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
        },
        actionUrl: "/watch/video-1"
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tune_in_request':
        return '🎧';
      case 'tune_in_accepted':
        return '✅';
      case 'boost':
        return '🚀';
      case 'comment':
        return '💬';
      case 'video_upload':
        return '📹';
      case 'live_stream':
        return '🔴';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'tune_in_request':
        return 'text-blue-400';
      case 'tune_in_accepted':
        return 'text-green-400';
      case 'boost':
        return 'text-purple-400';
      case 'comment':
        return 'text-yellow-400';
      case 'video_upload':
        return 'text-red-400';
      case 'live_stream':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'unread') return !notification.isRead;
    if (activeFilter === 'tune_ins') return notification.type.includes('tune_in');
    if (activeFilter === 'boosts') return notification.type === 'boost';
    return true;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Ayinel
            </Link>
            <nav className="flex space-x-6">
              <Link href="/explore" className="text-gray-300 hover:text-white">Explore</Link>
              <Link href="/trending" className="text-gray-300 hover:text-white">Trending</Link>
              <Link href="/live" className="text-gray-300 hover:text-white">Live</Link>
              <Link href="/chat" className="text-gray-300 hover:text-white">Chat</Link>
              <Link href="/notifications" className="text-purple-400 font-medium">Notifications</Link>
              <Link href="/studio/create" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Create
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'unread'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveFilter('tune_ins')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'tune_ins'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tune-Ins
          </button>
          <button
            onClick={() => setActiveFilter('boosts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'boosts'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Boosts
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">
                {activeFilter === 'all' 
                  ? "You're all caught up! Check back later for new activity."
                  : `No ${activeFilter} notifications found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-gray-800 rounded-lg p-4 transition-colors ${
                  !notification.isRead ? 'border-l-4 border-purple-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`text-2xl ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{notification.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                        
                        {/* User info */}
                        {notification.user && (
                          <div className="flex items-center space-x-2 mb-3">
                            <img 
                              src={notification.user.avatar} 
                              alt={notification.user.displayName}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-gray-400 text-sm">
                              {notification.user.displayName}
                            </span>
                          </div>
                        )}

                        {/* Video info */}
                        {notification.video && (
                          <div className="flex items-center space-x-3 mb-3">
                            <img 
                              src={notification.video.thumbnail} 
                              alt={notification.video.title}
                              className="w-16 h-9 rounded object-cover"
                            />
                            <span className="text-gray-400 text-sm truncate">
                              {notification.video.title}
                            </span>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center space-x-4">
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                              View
                            </Link>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-gray-300 text-sm"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Time */}
                      <span className="text-gray-500 text-xs whitespace-nowrap ml-4">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

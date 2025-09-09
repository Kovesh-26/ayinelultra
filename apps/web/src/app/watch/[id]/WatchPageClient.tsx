'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WatchPageClient({ id }: { id: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(754); // 12:34 in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [liveViewers, setLiveViewers] = useState(1247);
  const [showControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: 'FanUser123',
      message: 'This is absolutely incredible! 🔥',
      time: '2:34',
    },
    {
      id: 2,
      user: 'ContentLover',
      message: "I've been waiting for this content for so long! 🙏",
      time: '2:35',
    },
    {
      id: 3,
      user: 'TrendWatcher',
      message: 'The quality is amazing! What camera do you use? 📹',
      time: '2:36',
    },
    {
      id: 4,
      user: 'CreatorFan',
      message: 'This is next level content! 🚀',
      time: '2:37',
    },
    {
      id: 5,
      user: 'VideoEnthusiast',
      message: "Can't wait for the next upload! 💯",
      time: '2:38',
    },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Mock video data
  const video = {
    id: id,
    title: 'Amazing Creator Content - This Will Blow Your Mind! 🚀',
    description:
      "Join me on this incredible journey as we explore the latest trends in content creation. Don't forget to like, comment, and subscribe for more amazing content! #AYINEL #Creator #Trending",
    views: 124756,
    likes: 8923,
    dislikes: 156,
    uploadDate: '2024-01-15',
    duration: '12:34',
    creator: {
      name: 'CreativeMaster',
      handle: '@creativemaster',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      subscribers: 125000,
      verified: true,
    },
    tags: ['#AYINEL', '#Creator', '#Trending', '#Content', '#Innovation'],
  };

  const comments = [
    {
      id: 1,
      author: 'FanUser123',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'This is absolutely incredible! 🔥',
      likes: 45,
      time: '2 hours ago',
      replies: 3,
    },
    {
      id: 2,
      author: 'ContentLover',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: "I've been waiting for this content for so long! Thank you! 🙏",
      likes: 23,
      time: '3 hours ago',
      replies: 1,
    },
    {
      id: 3,
      author: 'TrendWatcher',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      content: 'The quality is amazing! What camera do you use? 📹',
      likes: 67,
      time: '4 hours ago',
      replies: 8,
    },
  ];

  const recommendedVideos = [
    {
      id: '2',
      title: 'Next Level Content Creation Tips',
      creator: 'ContentPro',
      views: '89K',
      duration: '8:45',
      thumbnail:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=180&fit=crop',
    },
    {
      id: '3',
      title: 'How to Build Your Creator Empire',
      creator: 'EmpireBuilder',
      views: '156K',
      duration: '15:22',
      thumbnail:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=320&h=180&fit=crop',
    },
    {
      id: '4',
      title: 'The Future of Digital Content',
      creator: 'FutureGazer',
      views: '234K',
      duration: '22:18',
      thumbnail:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=320&h=180&fit=crop',
    },
  ];

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);

    return () => clearInterval(interval);
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

    // Draw animated particles
    const time = Date.now() * 0.001;
    for (let i = 0; i < 30; i++) {
      const x = (i * 60 + time * 15) % canvas.width;
      const y = Math.sin(time + i * 0.1) * 50 + canvas.height / 2;
      const size = Math.sin(time + i) * 2 + 3;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 51, 234, ${0.1 + Math.sin(time + i) * 0.1})`;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animateCanvas);
  }, []);

  useEffect(() => {
    animateCanvas();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateCanvas]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setBuffering(true);
    setTimeout(() => setBuffering(false), 1000);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const addChatMessage = (message: string) => {
    const newMessage = {
      id: chatMessages.length + 1,
      user: 'You',
      message,
      time: formatTime(currentTime),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at center, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      />

      {/* Video Player Section */}
      <div className="relative">
        {/* Video Player */}
        <div className="relative bg-gray-900 aspect-video group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl mb-6 animate-pulse shadow-2xl shadow-purple-500/50">
                {isPlaying ? '⏸️' : '▶️'}
              </div>
              <p className="text-gray-400 text-xl">Advanced Video Player</p>
              <p className="text-sm text-gray-500">ID: {id}</p>
            </div>
          </div>

          {/* Video Controls Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-mono">
                    {formatTime(currentTime)}
                  </span>
                  <div
                    className="w-96 h-2 bg-white/30 rounded-full cursor-pointer relative"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                    </div>
                  </div>
                  <span className="text-lg font-mono">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="bg-white/20 text-white rounded px-4 py-2 text-sm hover:bg-white/30 transition"
                  >
                    {quality}
                  </button>
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                      {['1080p', '720p', '480p'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuality(q);
                            setShowQualityMenu(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-lg"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="bg-white/20 text-white rounded px-4 py-2 text-sm hover:bg-white/30 transition"
                  >
                    {playbackSpeed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                      {[0.5, 1, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSpeedMenu(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-lg"
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                  {isFullscreen ? '⤓' : '⤢'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="absolute top-6 left-6 flex items-center space-x-3 bg-red-600 px-4 py-2 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">LIVE</span>
            <span className="text-sm">
              {formatNumber(liveViewers)} watching
            </span>
          </div>

          {/* Buffering Indicator */}
          {buffering && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Buffering...</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
              <div className="flex items-center space-x-6 text-gray-400 text-lg">
                <span>{formatNumber(video.views)} views</span>
                <span>•</span>
                <span>{video.uploadDate}</span>
                <span>•</span>
                <span>{video.duration}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isLiked
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
                <span className="font-semibold">
                  {formatNumber(video.likes)}
                </span>
              </button>
              <button
                onClick={() => setIsDisliked(!isDisliked)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isDisliked
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-2xl">👎</span>
                <span className="font-semibold">
                  {formatNumber(video.dislikes)}
                </span>
              </button>
              <button className="flex items-center space-x-3 px-8 py-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <span className="text-2xl">📤</span>
                <span className="font-semibold">Share</span>
              </button>
              <button className="flex items-center space-x-3 px-8 py-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <span className="text-2xl">💾</span>
                <span className="font-semibold">Save</span>
              </button>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-500/30 backdrop-blur-sm mb-8">
            <div className="flex items-center space-x-6">
              <Image
                src={video.creator.avatar}
                alt={video.creator.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-lg"
              />
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold">{video.creator.name}</h3>
                  {video.creator.verified && (
                    <span className="text-blue-400 text-2xl">✓</span>
                  )}
                </div>
                <p className="text-gray-400 text-lg">{video.creator.handle}</p>
                <p className="text-sm text-gray-500">
                  {formatNumber(video.creator.subscribers)} subscribers
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                isSubscribed
                  ? 'bg-gray-600 text-white'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/50'
              }`}
            >
              {isSubscribed ? 'Joined' : 'Join'}
            </button>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-6 border border-purple-500/30 backdrop-blur-sm mb-8">
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              {video.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-purple-400 hover:text-purple-300 cursor-pointer text-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-6 border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{comments.length} Comments</h3>
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-gray-400 hover:text-white transition"
              >
                {showComments ? 'Hide' : 'Show'}
              </button>
            </div>

            {showComments && (
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="User"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-lg"
                    />
                  </div>
                </div>

                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <Image
                      src={comment.avatar}
                      alt={comment.author}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-lg">
                          {comment.author}
                        </span>
                        <span className="text-gray-400">{comment.time}</span>
                      </div>
                      <p className="text-gray-300 text-lg mb-3">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <button className="hover:text-white transition">
                          👍 {comment.likes}
                        </button>
                        <button className="hover:text-white transition">
                          Reply
                        </button>
                        {comment.replies > 0 && (
                          <button className="hover:text-white transition">
                            View {comment.replies} replies
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Chat Sidebar */}
      {showLiveChat && (
        <div className="fixed top-0 right-0 w-80 h-full bg-black/95 backdrop-blur-md border-l border-purple-500/30 z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Live Chat</h3>
              <button
                onClick={() => setShowLiveChat(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="h-96 overflow-y-auto mb-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-purple-400">
                      {msg.user}
                    </span>
                    <span className="text-gray-400 text-sm">{msg.time}</span>
                  </div>
                  <p className="text-white">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addChatMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Videos Sidebar */}
      <div
        className="fixed top-0 right-0 w-80 h-full bg-black/95 backdrop-blur-md border-l border-white/10 overflow-y-auto z-40"
        style={{ right: showLiveChat ? '320px' : '0' }}
      >
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6">Recommended</h3>
          <div className="space-y-6">
            {recommendedVideos.map((video) => (
              <Link
                key={video.id}
                href={`/watch/${video.id}`}
                className="flex space-x-4 hover:bg-white/5 rounded-2xl p-4 transition-all duration-300 group"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={160}
                  height={96}
                  className="w-40 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg line-clamp-2 group-hover:text-purple-400 transition">
                    {video.title}
                  </h4>
                  <p className="text-gray-400 text-lg">{video.creator}</p>
                  <div className="flex items-center space-x-3 text-gray-500 text-lg">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex space-x-4">
        <button
          onClick={() => setShowLiveChat(!showLiveChat)}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 animate-bounce"
        >
          💬
        </button>
        <button className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 animate-bounce">
          ⚡
        </button>
      </div>
    </div>
  );
}

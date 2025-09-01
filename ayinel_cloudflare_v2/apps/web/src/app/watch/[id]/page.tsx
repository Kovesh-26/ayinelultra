'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isTunedIn: boolean;
  };
  boosts: number;
  isBoosted: boolean;
  tags: string[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  boosts: number;
  isBoosted: boolean;
  replies: Comment[];
}

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'related'>('comments');

  // Mock data for development
  useEffect(() => {
    const mockVideo: Video = {
      id: videoId,
      title: "Amazing Ayinel Platform Demo - Building the Future of Video",
      description: "Join us as we explore the incredible features of Ayinel, the next-generation video platform. From Tune-In relationships to Boost interactions, discover how we're revolutionizing content creation and consumption. #Ayinel #VideoPlatform #Innovation",
      thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop",
      duration: 1247, // 20:47 in seconds
      views: 15420,
      createdAt: "2024-01-15T10:30:00Z",
      creator: {
        id: "creator-1",
        username: "ayinel_creator",
        displayName: "Ayinel Creator",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isTunedIn: false
      },
      boosts: 1247,
      isBoosted: false,
      tags: ["Ayinel", "Video Platform", "Innovation", "Technology"]
    };

    const mockComments: Comment[] = [
      {
        id: "comment-1",
        content: "This platform looks incredible! The Tune-In feature is genius. Can't wait to see more creators join!",
        createdAt: "2024-01-15T11:00:00Z",
        user: {
          id: "user-1",
          username: "tech_enthusiast",
          displayName: "Tech Enthusiast",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
        },
        boosts: 45,
        isBoosted: false,
        replies: []
      },
      {
        id: "comment-2",
        content: "The Boost system is so much better than traditional likes. Really encourages meaningful engagement!",
        createdAt: "2024-01-15T11:15:00Z",
        user: {
          id: "user-2",
          username: "content_creator",
          displayName: "Content Creator Pro",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
        },
        boosts: 32,
        isBoosted: true,
        replies: [
          {
            id: "reply-1",
            content: "Absolutely! The token economy makes it feel more valuable.",
            createdAt: "2024-01-15T11:20:00Z",
            user: {
              id: "user-3",
              username: "crypto_fan",
              displayName: "Crypto Fan",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face"
            },
            boosts: 12,
            isBoosted: false,
            replies: []
          }
        ]
      }
    ];

    const mockRelatedVideos: Video[] = [
      {
        id: "video-2",
        title: "How to Create Your First Studio on Ayinel",
        description: "Step-by-step guide to setting up your creator studio...",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=169&fit=crop",
        duration: 892,
        views: 8234,
        createdAt: "2024-01-14T15:20:00Z",
        creator: {
          id: "creator-2",
          username: "ayinel_tutorials",
          displayName: "Ayinel Tutorials",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
          isTunedIn: true
        },
        boosts: 567,
        isBoosted: false,
        tags: ["Tutorial", "Studio", "Guide"]
      },
      {
        id: "video-3",
        title: "Understanding the Token Economy",
        description: "Learn how tokens work in the Ayinel ecosystem...",
        thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=169&fit=crop",
        duration: 654,
        views: 5678,
        createdAt: "2024-01-13T09:45:00Z",
        creator: {
          id: "creator-3",
          username: "token_expert",
          displayName: "Token Expert",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
          isTunedIn: false
        },
        boosts: 234,
        isBoosted: false,
        tags: ["Tokens", "Economy", "Guide"]
      }
    ];

    setTimeout(() => {
      setVideo(mockVideo);
      setComments(mockComments);
      setRelatedVideos(mockRelatedVideos);
      setIsLoading(false);
    }, 1000);
  }, [videoId]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleBoost = () => {
    if (video) {
      setVideo({
        ...video,
        boosts: video.isBoosted ? video.boosts - 1 : video.boosts + 1,
        isBoosted: !video.isBoosted
      });
    }
  };

  const handleTuneIn = () => {
    if (video) {
      setVideo({
        ...video,
        creator: {
          ...video.creator,
          isTunedIn: !video.creator.isTunedIn
        }
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: "current-user",
          username: "current_user",
          displayName: "Current User",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
        },
        boosts: 0,
        isBoosted: false,
        replies: []
      };

      setComments([newCommentObj, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">▶️</div>
                  <p className="text-lg">Video Player Integration</p>
                  <p className="text-sm text-gray-400">Cloudflare Stream / HLS Player</p>
                </div>
                {/* Video duration overlay */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {formatDuration(video.duration)}
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-gray-300">
                  <span>{formatViews(video.views)} views</span>
                  <span>•</span>
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBoost}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      video.isBoosted 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span>🚀</span>
                    <span>{video.boosts}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
                    <span>💬</span>
                    <span>{comments.length}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
                    <span>📤</span>
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={video.creator.avatar} 
                    alt={video.creator.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{video.creator.displayName}</h3>
                    <p className="text-gray-400 text-sm">@{video.creator.username}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleTuneIn}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    video.creator.isTunedIn
                      ? 'bg-gray-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {video.creator.isTunedIn ? 'Tuned In' : 'Tune In'}
                </button>
              </div>

              {/* Description */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-white whitespace-pre-wrap">{video.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {video.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === 'comments'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Comments ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === 'related'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Related Videos
                </button>
              </div>

              {activeTab === 'comments' && (
                <div>
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex space-x-4">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                        alt="Your avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                          >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex space-x-4">
                        <img 
                          src={comment.user.avatar} 
                          alt={comment.user.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-white font-semibold">{comment.user.displayName}</span>
                            <span className="text-gray-400 text-sm">@{comment.user.username}</span>
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-white mb-3">{comment.content}</p>
                          
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                              <span>🚀</span>
                              <span>{comment.boosts}</span>
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                              Reply
                            </button>
                          </div>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-4 ml-6 space-y-4">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="flex space-x-4">
                                  <img 
                                    src={reply.user.avatar} 
                                    alt={reply.user.displayName}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-white font-semibold text-sm">{reply.user.displayName}</span>
                                      <span className="text-gray-400 text-xs">@{reply.user.username}</span>
                                      <span className="text-gray-500 text-xs">•</span>
                                      <span className="text-gray-400 text-xs">{formatDate(reply.createdAt)}</span>
                                    </div>
                                    <p className="text-white text-sm mb-2">{reply.content}</p>
                                    <div className="flex items-center space-x-4">
                                      <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm">
                                        <span>🚀</span>
                                        <span>{reply.boosts}</span>
                                      </button>
                                      <button className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'related' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedVideos.map(relatedVideo => (
                    <Link 
                      key={relatedVideo.id} 
                      href={`/watch/${relatedVideo.id}`}
                      className="flex space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img 
                          src={relatedVideo.thumbnail} 
                          alt={relatedVideo.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {formatDuration(relatedVideo.duration)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-1">{relatedVideo.creator.displayName}</p>
                        <p className="text-gray-500 text-xs">
                          {formatViews(relatedVideo.views)} views • {formatDate(relatedVideo.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map(relatedVideo => (
                <Link 
                  key={relatedVideo.id} 
                  href={`/watch/${relatedVideo.id}`}
                  className="block group"
                >
                  <div className="relative mb-2">
                    <img 
                      src={relatedVideo.thumbnail} 
                      alt={relatedVideo.title}
                      className="w-full h-24 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {formatDuration(relatedVideo.duration)}
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                    {relatedVideo.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-1">{relatedVideo.creator.displayName}</p>
                  <p className="text-gray-500 text-xs">
                    {formatViews(relatedVideo.views)} views • {formatDate(relatedVideo.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

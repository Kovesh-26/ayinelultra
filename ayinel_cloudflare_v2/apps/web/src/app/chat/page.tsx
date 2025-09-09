'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title: string;
  lastMessage: {
    content: string;
    createdAt: string;
    sender: {
      id: string;
      username: string;
      displayName: string;
      avatar: string;
    };
  };
  members: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isOnline: boolean;
  }[];
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  isOwn: boolean;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data for development
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        type: 'direct',
        title: 'Tech Enthusiast',
        lastMessage: {
          content: 'The Boost system is so much better than traditional likes!',
          createdAt: '2024-01-15T11:15:00Z',
          sender: {
            id: 'user-1',
            username: 'tech_enthusiast',
            displayName: 'Tech Enthusiast',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          },
        },
        members: [
          {
            id: 'user-1',
            username: 'tech_enthusiast',
            displayName: 'Tech Enthusiast',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
            isOnline: true,
          },
        ],
        unreadCount: 2,
      },
      {
        id: 'conv-2',
        type: 'group',
        title: 'Ayinel Creators',
        lastMessage: {
          content: 'Anyone tried the new video editor features?',
          createdAt: '2024-01-15T10:30:00Z',
          sender: {
            id: 'user-2',
            username: 'content_creator',
            displayName: 'Content Creator Pro',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          },
        },
        members: [
          {
            id: 'user-2',
            username: 'content_creator',
            displayName: 'Content Creator Pro',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
            isOnline: true,
          },
          {
            id: 'user-3',
            username: 'crypto_fan',
            displayName: 'Crypto Fan',
            avatar:
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
            isOnline: false,
          },
        ],
        unreadCount: 0,
      },
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for selected conversation
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          content:
            "Hey! I just watched your latest video about the Ayinel platform. It's incredible!",
          createdAt: '2024-01-15T10:00:00Z',
          sender: {
            id: 'user-1',
            username: 'tech_enthusiast',
            displayName: 'Tech Enthusiast',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          },
          isOwn: false,
        },
        {
          id: 'msg-2',
          content:
            "Thanks! I'm really excited about what we're building here. The Tune-In feature is going to revolutionize how creators connect with their audience.",
          createdAt: '2024-01-15T10:05:00Z',
          sender: {
            id: 'current-user',
            username: 'current_user',
            displayName: 'Current User',
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          },
          isOwn: true,
        },
        {
          id: 'msg-3',
          content:
            'The Boost system is so much better than traditional likes! Really encourages meaningful engagement.',
          createdAt: '2024-01-15T11:15:00Z',
          sender: {
            id: 'user-1',
            username: 'tech_enthusiast',
            displayName: 'Tech Enthusiast',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          },
          isOwn: false,
        },
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newMessageObj: Message = {
        id: `msg-${Date.now()}`,
        content: newMessage,
        createdAt: new Date().toISOString(),
        sender: {
          id: 'current-user',
          username: 'current_user',
          displayName: 'Current User',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        },
        isOwn: true,
      };

      setMessages([...messages, newMessageObj]);
      setNewMessage('');
      setIsSubmitting(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading conversations...</div>
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
              <Link href="/explore" className="text-gray-300 hover:text-white">
                Explore
              </Link>
              <Link href="/trending" className="text-gray-300 hover:text-white">
                Trending
              </Link>
              <Link href="/live" className="text-gray-300 hover:text-white">
                Live
              </Link>
              <Link href="/chat" className="text-purple-400 font-medium">
                Chat
              </Link>
              <Link
                href="/studio/create"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Create
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="border-r border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  New Message
                </button>
              </div>

              <div className="overflow-y-auto h-full">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-purple-600 bg-opacity-20'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {conversation.type === 'direct' ? (
                          <img
                            src={conversation.members[0].avatar}
                            alt={conversation.members[0].displayName}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {conversation.members.length}
                            </span>
                          </div>
                        )}
                        {conversation.members.some((m) => m.isOnline) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold truncate">
                            {conversation.title}
                          </h3>
                          <span className="text-gray-400 text-xs">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">
                          {conversation.lastMessage.sender.displayName}:{' '}
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-purple-400 text-xs font-medium">
                              {conversation.unreadCount} new
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-700 bg-gray-750">
                    <div className="flex items-center space-x-3">
                      {selectedConversation.type === 'direct' ? (
                        <img
                          src={selectedConversation.members[0].avatar}
                          alt={selectedConversation.members[0].displayName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {selectedConversation.members.length}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-semibold">
                          {selectedConversation.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {selectedConversation.members.length} member
                          {selectedConversation.members.length !== 1 ? 's' : ''}
                          {selectedConversation.members.some(
                            (m) => m.isOnline
                          ) && (
                            <span className="text-green-400 ml-2">
                              • Online
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => {
                      const showDate =
                        index === 0 ||
                        formatDate(messages[index - 1].createdAt) !==
                          formatDate(message.createdAt);

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center mb-4">
                              <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`flex space-x-3 max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}
                            >
                              {!message.isOwn && (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.displayName}
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                              )}
                              <div>
                                {!message.isOwn && (
                                  <p className="text-gray-400 text-xs mb-1">
                                    {message.sender.displayName}
                                  </p>
                                )}
                                <div
                                  className={`rounded-lg px-4 py-2 ${
                                    message.isOwn
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700 text-white'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-700">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-4"
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !newMessage.trim()}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                      >
                        {isSubmitting ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-400">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

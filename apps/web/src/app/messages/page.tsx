'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const chats = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/48x48/3b82f6/ffffff?text=JD',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/48x48/10b981/ffffff?text=JS',
      lastMessage: 'Thanks for the video recommendation!',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/48x48/f59e0b/ffffff?text=MJ',
      lastMessage: 'Can you help me with the upload process?',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      avatar: 'https://via.placeholder.com/48x48/8b5cf6/ffffff?text=SW',
      lastMessage: 'Great content as always!',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
    },
    {
      id: '5',
      name: 'David Brown',
      avatar: 'https://via.placeholder.com/48x48/ef4444/ffffff?text=DB',
      lastMessage: 'Looking forward to your next stream!',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
    },
  ];

  const messages = {
    '1': [
      {
        id: 1,
        sender: 'them',
        content: 'Hey! How are you doing?',
        timestamp: '2:30 PM',
      },
      {
        id: 2,
        sender: 'me',
        content: "I'm doing great! Just finished editing my latest video.",
        timestamp: '2:32 PM',
      },
      {
        id: 3,
        sender: 'them',
        content: "That sounds awesome! Can't wait to see it.",
        timestamp: '2:33 PM',
      },
      {
        id: 4,
        sender: 'them',
        content: "What's it about?",
        timestamp: '2:33 PM',
      },
    ],
    '2': [
      {
        id: 1,
        sender: 'them',
        content: 'Thanks for the video recommendation!',
        timestamp: '1:15 PM',
      },
      {
        id: 2,
        sender: 'me',
        content: "You're welcome! I thought you'd like it.",
        timestamp: '1:20 PM',
      },
    ],
    '3': [
      {
        id: 1,
        sender: 'them',
        content: 'Can you help me with the upload process?',
        timestamp: '11:30 AM',
      },
      {
        id: 2,
        sender: 'me',
        content: 'Of course! What specific issue are you having?',
        timestamp: '11:35 AM',
      },
    ],
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = selectedChat
    ? chats.find((chat) => chat.id === selectedChat)
    : null;
  const selectedMessages = selectedChat
    ? messages[selectedChat as keyof typeof messages] || []
    : [];

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      // In real app, this would send to API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please log in to access messages
          </h1>
          <p className="text-gray-300">Connect with other creators and fans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition ${
                  selectedChat === chat.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedChatData?.avatar}
                      alt={selectedChatData?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {selectedChatData?.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">
                      {selectedChatData?.name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {selectedChatData?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'me'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'me'
                            ? 'text-purple-200'
                            : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

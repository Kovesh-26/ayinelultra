'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircleIcon, SendIcon, BotIcon, UserIcon, CameraIcon, XIcon } from 'lucide-react';
import ScreenshotCapture, { type Screenshot } from './ScreenshotCapture';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  screenshot?: Screenshot;
}

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Hello! I\'m your AYINEL assistant. You can ask me to "show me the screenshot" or help with other tasks.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestScreenshot, setLatestScreenshot] = useState<Screenshot | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Process the command
    const response = await processAgentCommand(inputValue.toLowerCase());
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: response.content,
      timestamp: new Date(),
      screenshot: response.screenshot
    };

    setMessages(prev => [...prev, agentMessage]);
    setIsProcessing(false);
  };

  const processAgentCommand = async (command: string): Promise<{ content: string; screenshot?: Screenshot }> => {
    if (command.includes('screenshot') || command.includes('show me the screenshot')) {
      if (latestScreenshot) {
        return {
          content: 'Here\'s the latest screenshot I captured for you:',
          screenshot: latestScreenshot
        };
      } else {
        return {
          content: 'I don\'t have any screenshots yet. Please use the screenshot button in the top navigation to capture one first, then ask me again!'
        };
      }
    }

    if (command.includes('hello') || command.includes('hi')) {
      return {
        content: 'Hello! I\'m here to help you with the AYINEL platform. You can ask me to show screenshots or help with other tasks.'
      };
    }

    if (command.includes('help')) {
      return {
        content: 'I can help you with:\n• Taking and showing screenshots\n• Platform navigation\n• Creator tools information\n• General AYINEL questions\n\nJust ask me anything!'
      };
    }

    if (command.includes('ayinel') || command.includes('platform')) {
      return {
        content: 'AYINEL is a next-gen creator platform that blends the best of YouTube, Facebook, and MySpace. It features video streaming, live broadcasts, social features, and powerful creator tools!'
      };
    }

    // Default response
    return {
      content: 'I\'m not sure how to help with that. Try asking me to "show me the screenshot" or type "help" for available commands.'
    };
  };

  const handleScreenshotTaken = (screenshot: Screenshot) => {
    setLatestScreenshot(screenshot);
    
    // Automatically add a message when screenshot is taken
    const agentMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: 'Great! I\'ve captured a new screenshot for you. You can ask me to "show me the screenshot" anytime.',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, agentMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircleIcon className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-96 h-[500px] bg-gray-900 border border-white/10 rounded-xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AYINEL Agent</h3>
                <p className="text-gray-400 text-xs">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ScreenshotCapture onScreenshotTaken={handleScreenshotTaken} />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'agent' && (
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[280px] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`p-3 rounded-xl text-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
                        : 'bg-gray-800 text-white border border-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {/* Screenshot display */}
                  {message.screenshot && (
                    <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={message.screenshot.dataUrl}
                        alt={message.screenshot.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-gray-300 text-xs">{message.screenshot.name}</p>
                        <p className="text-gray-400 text-xs">{message.screenshot.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-400 text-xs mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-800 text-white border border-gray-700 p-3 rounded-xl text-sm">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Try: 'show me the screenshot'"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
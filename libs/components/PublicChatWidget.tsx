import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../../lib/hooks/useWebSocket';
import { getJwtToken, getCurrentUser } from '../auth';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'system' | 'other';
}

export const PublicChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();
  const isLoggedIn = !!getJwtToken();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { connected, sendMessage } = useWebSocket({
    onMessage: (text: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        timestamp: new Date(),
        sender: 'other',
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    onConnectionChange: (connected) => {
      if (connected) {
        const welcomeMessage: Message = {
          id: 'welcome',
          text: 'Connected to public chat! Say hello 👋',
          timestamp: new Date(),
          sender: 'system',
        };
        setMessages((prev) => [...prev, welcomeMessage]);
      }
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || !connected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      timestamp: new Date(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    sendMessage(inputValue.trim());
    setInputValue('');

    // Focus input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button - Fixed Bottom Right (positioned above Chatbase AI widget) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Open public chat"
        >
          <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
            chat
          </span>
          {!connected && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">chat</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Public Chat</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-300' : 'bg-red-300'}`}></div>
                  <span className="text-white/80 text-xs">
                    {connected ? `${isLoggedIn ? currentUser?.userNick || 'You' : 'Guest'} • Online` : 'Connecting...'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/50 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400">
                      chat_bubble_outline
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {connected ? 'Start a conversation!' : 'Connecting to chat...'}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                        : message.sender === 'system'
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm italic'
                        : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-white/70'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={connected ? "Type a message..." : "Connecting..."}
                disabled={!connected}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!connected || !inputValue.trim()}
                className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              Press Enter to send
            </p>
          </div>
        </div>
      )}
    </>
  );
};

 'use client';
 
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getJwtToken, getCurrentUser } from '../auth';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'system' | 'other';
}

/**
 * UnifiedChatWidget Component
 *
 * Floating chatbot button that opens:
 * - Ask AI → Chatbase iframe widget
 * - Online Message → Real-time WebSocket public chat
 *
 * The previous Gemini-style AI chat UI is no longer shown; AI is handled
 * only by the Chatbase iframe.
 */
export const UnifiedChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // controls right-side public chat window
  const [publicMessages, setPublicMessages] = useState<Message[]>([]);
  const [publicInputValue, setPublicInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const publicMessagesEndRef = useRef<HTMLDivElement>(null);
  const publicInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket | undefined>(undefined);
  const sentMessages = useRef<Map<string, string>>(new Map()); // Track sent messages in this session
  const sentMessageTextsRef = useRef<Set<string>>(new Set()); // Persisted texts used to restore alignment after reload
  const currentUser = getCurrentUser();
  const isLoggedIn = !!getJwtToken();

  // Restore previously sent message texts from localStorage (for alignment after reload)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('publicChatSentTexts');
      if (raw) {
        const list: string[] = JSON.parse(raw);
        sentMessageTextsRef.current = new Set(list);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Listen for global "open chat" events dispatched from the Navbar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpenFromHeader = () => {
      setIsOpen(true);

      // Close Chatbase widget when opening our public chat
      const anyWindow = window as any;
      try {
        if (typeof anyWindow.chatbase === 'function') {
          anyWindow.chatbase('close');
        } else if (typeof anyWindow.Chatbase === 'function') {
          anyWindow.Chatbase('close');
        }
      } catch {
        // ignore errors
      }
    };

    window.addEventListener('smeconnect-open-chat', handleOpenFromHeader as EventListener);
    return () => {
      window.removeEventListener('smeconnect-open-chat', handleOpenFromHeader as EventListener);
    };
  }, []);

  // When Chatbase widget is opened, automatically close our public chat
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const anyWindow = window as any;
    if (typeof anyWindow.chatbase !== 'function') return;

    try {
      anyWindow.chatbase('on', 'open', () => {
        setIsOpen(false);
      });
    } catch {
      // ignore if event API is not available
    }
  }, []);

  // Initialize WebSocket connection for public chat
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get WebSocket URL
    let wsHost = process.env.NEXT_PUBLIC_WS_URL || process.env.REACT_APP_API_WS;
    
    if (!wsHost) {
      const graphqlUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
      wsHost = graphqlUrl
        .replace('/graphql', '')
        .replace('http://', 'ws://')
        .replace('https://', 'wss://');
    }
    
    if (!wsHost) {
      wsHost = window.location.protocol === 'https:' ? 'wss://localhost:3010' : 'ws://localhost:3010';
    }
    
    const token = getJwtToken();
    const url = token ? `${wsHost}?token=${encodeURIComponent(token)}` : wsHost;

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        socketRef.current = ws;
        
        const welcomeMessage: Message = {
          id: 'welcome',
          text: 'Connected to public chat! Say hello 👋',
          timestamp: new Date(),
          sender: 'system',
        };
        setPublicMessages((prev) => [...prev, welcomeMessage]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === 'message') {
            const messageText = data.text || data.data || JSON.stringify(data);
            const messageId = data.id || `msg-${Date.now()}-${Math.random()}`;
            
            // Check if this is a message we just sent (prevent echo)
            const isOwnMessage = Array.from(sentMessages.current.values()).some(
              sentText => sentText.trim() === messageText.trim()
            );
            
            // Only add if it's NOT our own message in this session
            if (!isOwnMessage) {
              const newMessage: Message = {
                id: messageId,
                text: messageText,
                timestamp: new Date(),
                sender: 'other', // All incoming messages are from others
              };
              setPublicMessages((prev) => [...prev, newMessage]);
            }
          } else if (data.event === 'getMessages' && data.list) {
            data.list.forEach((msg: any) => {
              const msgText = msg.text || msg.data || JSON.stringify(msg);
              const isMine = sentMessageTextsRef.current.has(msgText.trim());
              const historyMessage: Message = {
                id: `history-${Date.now()}-${Math.random()}`,
                text: msgText,
                timestamp: new Date(),
                sender: isMine ? 'user' : 'other',
              };
              setPublicMessages((prev) => [...prev, historyMessage]);
            });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        socketRef.current = undefined;
      };

      return () => {
        ws.close();
        socketRef.current = undefined;
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, []);

  // Scroll to bottom when messages change (only when public chat is visible)
  useEffect(() => {
    if (isOpen) {
      publicMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [publicMessages, isOpen]);

  // Handle sending public chat message
  const handleSendPublicMessage = () => {
    if (!publicInputValue.trim()) return;

    const messageText = publicInputValue.trim();
    const messageId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: messageId,
      text: messageText,
      timestamp: new Date(),
      sender: 'user', // User messages always on right
    };

    // Track this sent message to prevent it from appearing as incoming
    if (isConnected && socketRef.current) {
      sentMessages.current.set(messageId, messageText);
    }

    // Persist text so that after reload we can still recognize it as user's message
    sentMessageTextsRef.current.add(messageText.trim());
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'publicChatSentTexts',
          JSON.stringify(Array.from(sentMessageTextsRef.current.values()).slice(-50)),
        );
      } catch {
        // ignore storage errors
      }
    }

    // Always add message immediately in UI (appears on right)
    setPublicMessages((prev) => [...prev, userMessage]);
    
    // Send via WebSocket only when connected
    if (isConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify({
          event: 'message',
          data: messageText,
          id: messageId,
        }));
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }

    setPublicInputValue('');

    setTimeout(() => {
      publicInputRef.current?.focus();
    }, 50);
  };

  const handlePublicKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPublicMessage();
    }
  };

  const handleToggleChat = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);

    // When opening our chat, make sure Chatbase widget is closed
    if (nextIsOpen && typeof window !== 'undefined') {
      const anyWindow = window as any;
      try {
        if (typeof anyWindow.chatbase === 'function') {
          anyWindow.chatbase('close');
        } else if (typeof anyWindow.Chatbase === 'function') {
          anyWindow.Chatbase('close');
        }
      } catch {
        // ignore errors if Chatbase is not ready
      }
    }
  };

  return (
    <>
      {/* Public Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          className="fixed bottom-24 right-6 z-[999999] w-[380px] h-[600px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-xl"
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Online Message</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Free chat room for everyone</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
              <button
                onClick={handleToggleChat}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Public Chat Content */}
          <div className="flex-1 relative overflow-hidden bg-[#f6f6f8] dark:bg-slate-900">
            <div className="h-full flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {publicMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="animate-fade-in">
                      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400">
                          chat_bubble_outline
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        {isConnected ? 'Start a conversation!' : 'Connecting...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  publicMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                            : message.sender === 'system'
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs italic'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{message.text}</p>
                        {message.sender !== 'system' && (
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={publicMessagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    ref={publicInputRef}
                    type="text"
                    value={publicInputValue}
                    onChange={(e) => setPublicInputValue(e.target.value)}
                    onKeyDown={handlePublicKeyPress}
                    placeholder={isConnected ? 'Type a message...' : 'You can type while we connect...'}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm transition-all duration-200"
                    autoFocus
                  />
                  <button
                    onClick={handleSendPublicMessage}
                    disabled={!isConnected || !publicInputValue.trim()}
                    className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

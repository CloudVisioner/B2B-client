import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../../lib/hooks/useWebSocket';
import { getJwtToken, getCurrentUser } from '../auth';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'system' | 'other';
}

type ChatType = 'ai' | 'public' | null;

export const UnifiedChatWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatType>(null);
  const [publicMessages, setPublicMessages] = useState<Message[]>([]);
  const [publicInputValue, setPublicInputValue] = useState('');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();
  const isLoggedIn = !!getJwtToken();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChat === 'public') {
      scrollToBottom();
    }
  }, [publicMessages, activeChat]);

  // Initialize Chatbase on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkChatbase = setInterval(() => {
        if ((window as any).chatbase) {
          clearInterval(checkChatbase);
          setTimeout(() => {
            const chatbaseElements = document.querySelectorAll('[id*="chatbase"]:not(iframe), [class*="chatbase"]:not(iframe), button[id*="chatbase"]');
            chatbaseElements.forEach((el: any) => {
              el.style.display = 'none';
            });
          }, 1000);
        }
      }, 100);
      return () => clearInterval(checkChatbase);
    }
  }, []);

  const { connected, sendMessage } = useWebSocket({
    onMessage: (text: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        timestamp: new Date(),
        sender: 'other',
      };
      setPublicMessages((prev) => [...prev, newMessage]);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    },
    onConnectionChange: (connected) => {
      if (connected && activeChat === 'public') {
        const welcomeMessage: Message = {
          id: 'welcome',
          text: 'Connected to public chat! Say hello 👋',
          timestamp: new Date(),
          sender: 'system',
        };
        setPublicMessages((prev) => [...prev, welcomeMessage]);
      }
    },
  });

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setActiveChat(null);
    } else {
      setActiveChat(null);
    }
  };

  const handleSelectChat = (chatType: ChatType) => {
    setActiveChat(chatType);
    setIsExpanded(false);
    
    if (chatType === 'ai') {
      setAiChatOpen(true);
      setIsAnimating(true);
      
      // Open Chatbase widget with multiple attempts
      const openChatbase = () => {
        if (typeof window !== 'undefined') {
          const chatbase = (window as any).chatbase;
          
          // Method 1: Try direct function call
          if (chatbase && typeof chatbase === 'function') {
            try {
              chatbase('open');
            } catch (e) {
              console.log('Chatbase open attempt 1:', e);
            }
          }
          
          // Method 2: Find and show iframe
          const showChatbaseIframe = () => {
            const chatbaseIframes = document.querySelectorAll('iframe[src*="chatbase"]');
            chatbaseIframes.forEach((iframe: any) => {
              iframe.classList.add('chatbase-active');
              iframe.style.position = 'fixed';
              iframe.style.bottom = '120px';
              iframe.style.right = '24px';
              iframe.style.zIndex = '99999';
              iframe.style.width = '500px';
              iframe.style.height = '750px';
              iframe.style.border = 'none';
              iframe.style.borderRadius = '24px';
              iframe.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
              iframe.style.display = 'block';
            });
          };
          
          showChatbaseIframe();
          
          // Method 3: Try clicking any Chatbase button
          const chatbaseButtons = document.querySelectorAll('[id*="chatbase"]:not(iframe), button[id*="chatbase"]');
          chatbaseButtons.forEach((btn: any) => {
            if (btn.click) {
              try {
                btn.click();
              } catch (e) {
                // Ignore
              }
            }
          });
          
          // Keep trying to show iframe
          const interval = setInterval(() => {
            showChatbaseIframe();
            const iframes = document.querySelectorAll('iframe[src*="chatbase"]');
            if (iframes.length > 0) {
              const iframe = iframes[0] as HTMLElement;
              if (iframe.style.display === 'block' || iframe.classList.contains('chatbase-active')) {
                clearInterval(interval);
                setIsAnimating(false);
              }
            }
          }, 300);
          
          setTimeout(() => {
            clearInterval(interval);
            setIsAnimating(false);
          }, 15000);
        }
      };
      
      setTimeout(openChatbase, 100);
      setTimeout(openChatbase, 500);
      setTimeout(openChatbase, 1000);
      setTimeout(openChatbase, 2000);
    }
  };

  const handlePublicSendMessage = () => {
    if (!publicInputValue.trim() || !connected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: publicInputValue.trim(),
      timestamp: new Date(),
      sender: 'user',
    };

    setPublicMessages((prev) => [...prev, userMessage]);
    sendMessage(publicInputValue.trim());
    setPublicInputValue('');
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handlePublicKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePublicSendMessage();
    }
  };

  const handleCloseChat = () => {
    if (activeChat === 'ai') {
      const chatbaseIframes = document.querySelectorAll('iframe[src*="chatbase"]');
      chatbaseIframes.forEach((iframe: any) => {
        iframe.classList.remove('chatbase-active');
        iframe.style.display = 'none';
      });
      setAiChatOpen(false);
    }
    setActiveChat(null);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Main Chat Button - Higher position, bigger */}
      {!activeChat && (
        <button
          onClick={handleToggleExpanded}
          className="fixed bottom-32 right-8 z-50 w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 animate-fade-in"
          aria-label="Open chat"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-200 text-3xl transition-transform duration-300">
            {isExpanded ? 'close' : 'chat'}
          </span>
        </button>
      )}

      {/* Chat Selection - Higher position, with animations */}
      {isExpanded && !activeChat && (
        <div className="fixed bottom-44 right-8 z-50 w-80 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-xl bg-white/98 dark:bg-slate-800/98 animate-slide-up">
          <div className="p-5 space-y-3">
            <button
              onClick={() => handleSelectChat('ai')}
              className="w-full p-5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all duration-300 text-left border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined text-slate-700 dark:text-slate-200 text-2xl">smart_toy</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">AI Assistant</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Ask questions, get instant answers</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectChat('public')}
              className="w-full p-5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all duration-300 text-left border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined text-slate-700 dark:text-slate-200 text-2xl">forum</span>
                  {connected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">Public Chat</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {connected ? 'Online • Real-time chat' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Public Chat Window - Bigger, Higher, with animations */}
      {activeChat === 'public' && (
        <div className="fixed bottom-32 right-8 z-50 w-[500px] h-[750px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-xl animate-slide-up">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Public Chat</h3>
              <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <button
              onClick={handleCloseChat}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close chat"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Messages Area - Bigger */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#f6f6f8] dark:bg-slate-900 space-y-4 custom-scrollbar">
            {publicMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="animate-fade-in">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-slate-400">chat_bubble_outline</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-base">
                    {connected ? 'Start a conversation' : 'Connecting...'}
                  </p>
                </div>
              </div>
            ) : (
              publicMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-3 transition-all duration-300 ${
                      message.sender === 'user'
                        ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-lg'
                        : message.sender === 'system'
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm italic'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-slate-700'
                    } ${isAnimating && index === publicMessages.length - 1 ? 'animate-bounce-in' : ''}`}
                  >
                    <p className="text-base leading-relaxed break-words">{message.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed, always enabled */}
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={publicInputValue}
                onChange={(e) => setPublicInputValue(e.target.value)}
                onKeyPress={handlePublicKeyPress}
                placeholder={connected ? "Message..." : "Connecting..."}
                className="flex-1 px-5 py-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-base transition-all duration-200"
                autoFocus
              />
              <button
                onClick={handlePublicSendMessage}
                disabled={!connected || !publicInputValue.trim()}
                className="w-12 h-12 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-xl">arrow_upward</span>
              </button>
            </div>
            <div className="flex items-center justify-center mt-3">
              <p className="text-xs text-slate-400 dark:text-slate-500">Powered by SMEConnect</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat - Chatbase iframe will appear here */}
      {activeChat === 'ai' && aiChatOpen && (
        <div className="fixed bottom-32 right-8 z-50 pointer-events-none">
          {isAnimating && (
            <div className="w-[500px] h-[750px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <span className="material-symbols-outlined text-3xl text-slate-400">smart_toy</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">Loading AI chat...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

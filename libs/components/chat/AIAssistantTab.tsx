'use client';

import React, { useState, useRef, useEffect } from 'react';

const AIAssistantTab: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
        'http://localhost:4001/graphql';
      const apiBase = baseUrl.replace('/graphql', '');
      const response = await fetch(`${apiBase}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const replyText =
        typeof data?.reply === 'string'
          ? data.reply
          : "Sorry, I couldn't understand the server response.";

      setMessages(prev => [...prev, { role: 'ai', text: replyText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-gray-700 dark:text-slate-100">
        SMEConnect AI Assistant
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 dark:text-slate-500 mt-10">
            How can I help your business today?
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-50'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 dark:text-slate-500 text-xs italic">AI is thinking...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex gap-2">
        <input
          className="relative z-[9999] flex-1 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ pointerEvents: 'auto' }}
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIAssistantTab;


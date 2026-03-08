import React from 'react';
import { UnifiedChatWidget } from './UnifiedChatWidget';

/**
 * ChatWidgets Component
 * 
 * Unified chat widget that provides access to both AI Chat (Chatbase) and Public Chat (WebSocket)
 * This component should be added to _app.tsx to make chats available on all pages
 * 
 * Features:
 * - Single button that expands to show chat options
 * - AI Chat: Powered by Chatbase (loaded via script in _document.tsx)
 * - Public Chat: Real-time WebSocket chat with other users
 */
export const ChatWidgets: React.FC = () => {
  return (
    <>
      {/* Unified Chat Widget - Handles both AI and Public chat */}
      <UnifiedChatWidget />
    </>
  );
};

import React from 'react';
import { UnifiedChatWidget } from './UnifiedChatWidget';

/**
 * ChatWidgets Component
 * 
 * Premium unified chat widget that displays both AI Chat (Chatbase) and Public Chat (WebSocket) together
 * This component should be added to _app.tsx to make chats available on all pages
 * 
 * Features:
 * - Single chat button opens both AI and Public chat in a unified interface
 * - Tab-based navigation between AI Assistant and Public Chat
 * - AI Chat: Powered by Chatbase iframe (loaded via script in _document.tsx)
 * - Public Chat: Real-time WebSocket chat with other users
 * - Professional premium UI with smooth animations
 * - WebSocket connection managed via Apollo reactive variable (socketVar)
 */
export const ChatWidgets: React.FC = () => {
  return (
    <>
      {/* Unified Chat Widget - Handles both AI and Public chat */}
      <UnifiedChatWidget />
    </>
  );
};

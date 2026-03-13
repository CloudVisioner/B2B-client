'use client';

import React, { useEffect } from 'react';

export const ChatbaseIdentity: React.FC = () => {
  useEffect(() => {
    // Identity verification is disabled in Chatbase dashboard.
    // We no longer call /chat/token or chatbase('identify').
    // This component is kept as a harmless placeholder.
    if (typeof window === 'undefined') return;
  }, []);

  return null;
};

export default ChatbaseIdentity;


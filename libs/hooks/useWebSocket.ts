import { useEffect, useRef, useState, useCallback } from 'react';
import { getJwtToken } from '../../libs/auth';

interface Notification {
  _id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface InfoPayload {
  event: 'info';
  totalClients: number;
  userData: any | null;
  action: 'joined' | 'left';
}

interface NotificationPayload {
  event: 'notification';
  _id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface MessagePayload {
  event: 'message';
  text: string;
}

interface MessageHistoryPayload {
  event: 'getMessages';
  list: Array<{
    event: 'message';
    text: string;
  }>;
}

type WebSocketPayload = InfoPayload | NotificationPayload | MessagePayload | MessageHistoryPayload;

interface UseWebSocketOptions {
  onNotification?: (notification: Notification) => void;
  onConnectionChange?: (connected: boolean) => void;
  onMessage?: (message: string) => void;
  autoReconnect?: boolean;
}

export function useWebSocket({
  onNotification,
  onConnectionChange,
  onMessage,
  autoReconnect = true,
}: UseWebSocketOptions = {}) {
  const [connected, setConnected] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    const token = getJwtToken();
    // Get WebSocket URL - check for dedicated WS URL first, then derive from GraphQL URL
    let wsHost = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_WS;
    
    if (!wsHost) {
      const graphqlUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
        'http://localhost:4001/graphql';
      // Remove /graphql and convert http to ws, https to wss
      wsHost = graphqlUrl
        .replace('/graphql', '')
        .replace('http://', 'ws://')
        .replace('https://', 'wss://');
    }
    
    // Default fallback
    if (!wsHost) {
      wsHost = window.location.protocol === 'https:' ? 'wss://localhost:4001' : 'ws://localhost:4001';
    }
    
    const wsUrl = token 
      ? `${wsHost}?token=${encodeURIComponent(token)}`
      : wsHost;
    
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnectionChange?.(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketPayload = JSON.parse(event.data);

          switch (data.event) {
            case 'info':
              setTotalClients(data.totalClients);
              console.log(`User ${data.userData?.userNick || 'Guest'} ${data.action}`);
              break;

            case 'notification':
              console.log('📬 New notification:', data);
              onNotification?.(data);
              break;

            case 'getMessages':
              console.log('📜 Message history:', data.list);
              if (data.list && data.list.length > 0) {
                data.list.forEach((msg) => {
                  onMessage?.(msg.text);
                });
              }
              break;

            case 'message':
              console.log('💬 Message:', data.text);
              onMessage?.(data.text);
              break;

            default:
              console.log('Unknown event:', data);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnected(false);
        onConnectionChange?.(false);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setConnected(false);
        onConnectionChange?.(false);
        wsRef.current = null;

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`🔄 Reconnecting in ${delay}ms... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }, [onNotification, onConnectionChange, onMessage, autoReconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(text);
    } else {
      console.error('WebSocket is not open');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connected,
    totalClients,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}

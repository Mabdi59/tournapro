import { createContext, useContext, useEffect, useState } from 'react';
import websocketService from '../services/websocket';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export function WebSocketProvider({ children }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.token) {
      // Connect to WebSocket when user is authenticated
      websocketService.connect(user.token);

      // Subscribe to connection status
      const unsubscribe = websocketService.subscribe('connection', (data) => {
        setIsConnected(data.status === 'connected');
      });

      return () => {
        unsubscribe();
        websocketService.disconnect();
      };
    }
  }, [user?.token]);

  const subscribe = (eventType, callback) => {
    return websocketService.subscribe(eventType, callback);
  };

  const send = (message) => {
    websocketService.send(message);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';

interface StreamingMessage {
  type: 'writing_start' | 'writing_chunk' | 'writing_complete' | 'analysis_result' | 'error';
  section_id?: string;
  content?: string;
  analysis?: any;
  error?: string;
}

interface StreamingRequest {
  type: 'write' | 'analyze';
  section_id?: string;
  payload: any;
}

interface UseStreamingAIOptions {
  userId?: string;
  onMessage?: (message: StreamingMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useStreamingAI = (options: UseStreamingAIOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingStates, setStreamingStates] = useState<Record<string, boolean>>({});
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<StreamingRequest[]>([]);

  const connect = useCallback(() => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);
    
    const clientId = `${options.userId || 'anonymous'}_${Date.now()}`;
    const wsUrl = `ws://localhost:8030/ws/stream-writing/${clientId}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('🤖 Connected to AI Writing Service');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        options.onConnect?.();
        
        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift();
          if (message) {
            ws.send(JSON.stringify(message));
          }
        }
      };
      
      ws.onmessage = (event) => {
        try {
          const message: StreamingMessage = JSON.parse(event.data);
          
          // Update streaming states
          if (message.type === 'writing_start' && message.section_id) {
            setStreamingStates(prev => ({ ...prev, [message.section_id!]: true }));
          } else if (message.type === 'writing_complete' && message.section_id) {
            setStreamingStates(prev => ({ ...prev, [message.section_id!]: false }));
          }
          
          options.onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log('🤖 Disconnected from AI Writing Service', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        options.onDisconnect?.();
        
        // Attempt to reconnect if not intentional close
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };
      
      ws.onerror = (error) => {
        console.error('🤖 WebSocket error:', error);
        const errorMessage = 'Failed to connect to AI Writing Service';
        setError(errorMessage);
        setIsConnecting(false);
        options.onError?.(new Error(errorMessage));
      };
      
    } catch (error) {
      console.error('🤖 Failed to create WebSocket:', error);
      setError('Failed to initialize connection');
      setIsConnecting(false);
      options.onError?.(error as Error);
    }
  }, [options.userId, isConnecting, isConnected]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setStreamingStates({});
  }, []);

  const sendMessage = useCallback((message: StreamingRequest) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is established
      messageQueueRef.current.push(message);
      if (!isConnected && !isConnecting) {
        connect();
      }
    }
  }, [isConnected, isConnecting, connect]);

  const generateContent = useCallback((
    sectionId: string,
    prompt: string,
    context: any,
    stylePreferences: any = {},
    maxTokens: number = 1000
  ) => {
    const request: StreamingRequest = {
      type: 'write',
      section_id: sectionId,
      payload: {
        prompt,
        context,
        style_preferences: stylePreferences,
        max_tokens: maxTokens
      }
    };
    
    sendMessage(request);
  }, [sendMessage]);

  const analyzeContent = useCallback((content: string, context: any) => {
    const request: StreamingRequest = {
      type: 'analyze',
      payload: {
        content,
        context
      }
    };
    
    sendMessage(request);
  }, [sendMessage]);

  const isStreaming = useCallback((sectionId: string) => {
    return streamingStates[sectionId] || false;
  }, [streamingStates]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
    generateContent,
    analyzeContent,
    isStreaming,
    streamingStates
  };
};